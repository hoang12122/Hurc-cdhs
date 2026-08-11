"""Versioned, provenance-aware ingestion for the HURC1 RAG knowledge base.

Despite the historical filename, this is schema version 3. It creates stable
semantic chunks that can be consumed immediately by the standard-library
fallback retriever and later vectorized by TrustGraph or another embedding
service. The module does not claim to create embeddings locally.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import tempfile
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Mapping, Sequence

SCHEMA_VERSION = "3.0"
DEFAULT_CHUNK_SIZE = 1_200
DEFAULT_CHUNK_OVERLAP = 180
MIN_CHUNK_SIZE = 80

SYSTEM_ALIASES: dict[str, tuple[str, ...]] = {
    "AFC": ("afc", "automatic fare collection", "cổng soát vé", "vé tự động", "tvm"),
    "PSD": ("psd", "platform screen door", "cửa chắn ke ga", "cửa chắn sân ga"),
    "Rolling Stock": ("rolling stock", "đoàn tàu", "toa xe", "train", "traction motor", "bcu"),
    "Trackwork": ("trackwork", "đường ray", "ray", "turnout", "ghi đường sắt"),
    "Power Supply": ("power supply", "traction power", "điện kéo", "tss", "rtss", "vld"),
    "Signalling": ("signalling", "signal", "tín hiệu", "atc", "ats", "interlocking"),
    "Telecom": ("telecom", "viễn thông", "radio", "cctv", "pa", "pis"),
}


def _normalize_text(value: Any) -> str:
    text = unicodedata.normalize("NFKC", str(value or ""))
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in text.split("\n")]
    # Preserve paragraph boundaries while removing excessive empty lines.
    return re.sub(r"\n{3,}", "\n\n", "\n".join(lines)).strip()


def _fold(value: Any) -> str:
    text = _normalize_text(value).lower().replace("đ", "d")
    decomposed = unicodedata.normalize("NFD", text)
    return "".join(ch for ch in decomposed if unicodedata.category(ch) != "Mn")


def _sha256(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _atomic_write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temp_name = tempfile.mkstemp(prefix=f".{path.name}.", suffix=".tmp", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            json.dump(payload, handle, ensure_ascii=False, indent=2)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temp_name, path)
    except Exception:
        try:
            os.unlink(temp_name)
        except OSError:
            pass
        raise


class DocumentRAGUpgrade:
    def __init__(
        self,
        raw_docs_dir: str = "data/raw/docs",
        index_dir: str = "data/vector_db",
        *,
        chunk_size: int = DEFAULT_CHUNK_SIZE,
        chunk_overlap: int = DEFAULT_CHUNK_OVERLAP,
    ) -> None:
        if chunk_size < 300:
            raise ValueError("chunk_size must be at least 300 characters")
        if chunk_overlap < 0 or chunk_overlap >= chunk_size // 2:
            raise ValueError("chunk_overlap must be non-negative and smaller than half of chunk_size")

        self.raw_docs_dir = Path(raw_docs_dir)
        self.index_dir = Path(index_dir)
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.raw_docs_dir.mkdir(parents=True, exist_ok=True)
        self.index_dir.mkdir(parents=True, exist_ok=True)

    def _detect_system(self, doc_record: Mapping[str, Any]) -> tuple[str, list[str]]:
        haystack = _fold(
            "\n".join(
                str(doc_record.get(field, ""))
                for field in ("title", "code", "content", "asset", "system", "category")
            )
        )
        matches: list[str] = []
        for system, aliases in SYSTEM_ALIASES.items():
            if any(_fold(alias) in haystack for alias in aliases):
                matches.append(system)
        return (matches[0] if matches else "General", matches)

    def add_metadata(self, doc_record: Mapping[str, Any]) -> dict[str, Any]:
        """Validate a source record and attach stable, non-fabricated metadata."""
        content = _normalize_text(doc_record.get("content") or doc_record.get("text"))
        if not content:
            raise ValueError("Document content is empty")

        title = _normalize_text(doc_record.get("title")) or "Untitled document"
        document_code = _normalize_text(doc_record.get("code") or doc_record.get("document_code"))
        if not document_code:
            document_code = f"DOC-{_sha256(title + content)[:12].upper()}"

        version = _normalize_text(doc_record.get("version")) or "unknown"
        source_file = _normalize_text(doc_record.get("source_file") or doc_record.get("filename")) or None
        related_system, system_matches = self._detect_system(doc_record)
        document_hash = _sha256(f"{document_code}\n{version}\n{content}")

        metadata = {
            "document_code": document_code,
            "title": title,
            "version": version,
            "issue_date": _normalize_text(doc_record.get("issue_date")) or None,
            "contractor": _normalize_text(doc_record.get("contractor")) or None,
            "related_system": related_system,
            "related_system_matches": system_matches,
            "related_asset": _normalize_text(
                doc_record.get("asset") or doc_record.get("related_asset")
            ) or None,
            "source_file": source_file,
            "source_page": doc_record.get("page") or doc_record.get("source_page"),
            "source_section": _normalize_text(
                doc_record.get("section") or doc_record.get("source_section")
            ) or None,
            "language": _normalize_text(doc_record.get("language")) or "vi",
            "document_hash": document_hash,
        }
        metadata.update(
            {
                str(key): value
                for key, value in dict(doc_record.get("metadata") or {}).items()
                if key not in metadata
            }
        )

        return {
            "id": f"doc_{document_hash[:20]}",
            "content": content,
            "metadata": metadata,
        }

    def _split_long_unit(self, unit: str) -> list[str]:
        if len(unit) <= self.chunk_size:
            return [unit]
        pieces: list[str] = []
        start = 0
        while start < len(unit):
            end = min(len(unit), start + self.chunk_size)
            if end < len(unit):
                boundary = max(
                    unit.rfind(". ", start, end),
                    unit.rfind("; ", start, end),
                    unit.rfind(", ", start, end),
                    unit.rfind(" ", start, end),
                )
                if boundary > start + self.chunk_size // 2:
                    end = boundary + 1
            piece = unit[start:end].strip()
            if piece:
                pieces.append(piece)
            if end >= len(unit):
                break
            start = max(end - self.chunk_overlap, start + 1)
        return pieces

    def chunk_text(self, content: str) -> list[str]:
        """Create paragraph/sentence-aware chunks with bounded overlap."""
        content = _normalize_text(content)
        if not content:
            return []

        units: list[str] = []
        for paragraph in re.split(r"\n\s*\n", content):
            paragraph = paragraph.strip()
            if not paragraph:
                continue
            sentence_units = re.split(r"(?<=[.!?;:])\s+(?=[A-ZÀ-Ỹ0-9])", paragraph)
            for sentence in sentence_units:
                units.extend(self._split_long_unit(sentence.strip()))

        chunks: list[str] = []
        current = ""
        for unit in units:
            candidate = f"{current}\n{unit}".strip() if current else unit
            if len(candidate) <= self.chunk_size:
                current = candidate
                continue

            if current:
                chunks.append(current)
                overlap = current[-self.chunk_overlap:].lstrip() if self.chunk_overlap else ""
                current = f"{overlap}\n{unit}".strip() if overlap else unit
            else:
                chunks.append(unit)
                current = ""

        if current:
            chunks.append(current)

        if len(chunks) > 1 and len(chunks[-1]) < MIN_CHUNK_SIZE:
            tail = chunks.pop()
            merged = f"{chunks[-1]}\n{tail}".strip()
            if len(merged) <= self.chunk_size + self.chunk_overlap:
                chunks[-1] = merged
            else:
                chunks.append(tail)
        return chunks

    def _build_chunks(self, enhanced_doc: Mapping[str, Any]) -> list[dict[str, Any]]:
        doc_id = str(enhanced_doc["id"])
        metadata = dict(enhanced_doc["metadata"])
        chunks = self.chunk_text(str(enhanced_doc["content"]))
        output: list[dict[str, Any]] = []
        for index, chunk in enumerate(chunks):
            content_hash = _sha256(chunk)
            chunk_id = f"chunk_{_sha256(f'{doc_id}:{index}:{content_hash}')[:24]}"
            chunk_metadata = {
                **metadata,
                "parent_document_id": doc_id,
                "chunk_index": index,
                "chunk_count": len(chunks),
                "content_hash": content_hash,
                "character_count": len(chunk),
            }
            output.append({"id": chunk_id, "content": chunk, "metadata": chunk_metadata})
        return output

    def create_new_vector_index(self, docs: Sequence[Mapping[str, Any]]) -> str:
        """Create an immutable source index and atomically update ``latest.json``.

        The method name is retained for compatibility. The generated file holds
        chunked source text and provenance; actual embeddings are expected to be
        generated by the configured TrustGraph ingestion flow.
        """
        if not isinstance(docs, Sequence) or isinstance(docs, (str, bytes)):
            raise TypeError("docs must be a sequence of document objects")

        enhanced_documents: list[dict[str, Any]] = []
        rejected: list[dict[str, Any]] = []
        for index, record in enumerate(docs):
            try:
                if not isinstance(record, Mapping):
                    raise TypeError("record is not an object")
                enhanced_documents.append(self.add_metadata(record))
            except (TypeError, ValueError) as exc:
                rejected.append({"position": index, "reason": str(exc)})

        chunk_by_hash: dict[str, dict[str, Any]] = {}
        duplicate_count = 0
        for document in enhanced_documents:
            for chunk in self._build_chunks(document):
                content_hash = str(chunk["metadata"]["content_hash"])
                existing = chunk_by_hash.get(content_hash)
                if existing:
                    duplicate_count += 1
                    duplicate_sources = existing["metadata"].setdefault("duplicate_sources", [])
                    duplicate_sources.append(
                        {
                            "parent_document_id": chunk["metadata"]["parent_document_id"],
                            "document_code": chunk["metadata"]["document_code"],
                            "source_file": chunk["metadata"].get("source_file"),
                        }
                    )
                else:
                    chunk_by_hash[content_hash] = chunk

        chunks = list(chunk_by_hash.values())
        created_at = _utc_now()
        version = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        index_name = f"metro_rag_index_v3_{version}"
        output_path = self.index_dir / f"{index_name}.json"

        document_summaries = [
            {
                "id": doc["id"],
                "metadata": doc["metadata"],
                "character_count": len(doc["content"]),
                "chunk_count": sum(
                    1
                    for chunk in chunks
                    if chunk["metadata"].get("parent_document_id") == doc["id"]
                ),
            }
            for doc in enhanced_documents
        ]

        payload = {
            "schema_version": SCHEMA_VERSION,
            "index_name": index_name,
            "index_type": "hybrid_lexical_source_index",
            "embedding_status": "pending_external_vectorization",
            "created_at": created_at,
            "configuration": {
                "chunk_size": self.chunk_size,
                "chunk_overlap": self.chunk_overlap,
            },
            "statistics": {
                "submitted_documents": len(docs),
                "accepted_documents": len(enhanced_documents),
                "rejected_documents": len(rejected),
                "unique_chunks": len(chunks),
                "duplicate_chunks_removed": duplicate_count,
            },
            "rejected": rejected,
            "documents": document_summaries,
            "chunks": chunks,
        }
        _atomic_write_json(output_path, payload)

        latest_payload = {
            "schema_version": SCHEMA_VERSION,
            "index_name": index_name,
            "filename": output_path.name,
            "created_at": created_at,
            "sha256": _sha256(output_path.read_text(encoding="utf-8")),
        }
        _atomic_write_json(self.index_dir / "latest.json", latest_payload)

        print(
            f"[RAG UPGRADE] accepted={len(enhanced_documents)} "
            f"chunks={len(chunks)} duplicates={duplicate_count} index={output_path}"
        )
        return str(output_path)


def _load_input(path: str | None) -> list[Mapping[str, Any]]:
    if not path:
        return [
            {
                "title": "Hướng dẫn bảo trì Cổng soát vé AFC tự động",
                "code": "OM-AFC-001",
                "content": "Kiểm tra vành răng định kỳ 3 tháng/lần. Ghi nhận kết quả và mã thiết bị.",
                "asset": "GATE",
            },
            {
                "title": "Cẩm nang xử lý sự cố Rolling Stock",
                "code": "OM-RS-042",
                "version": "1.2",
                "content": "Kiểm tra giới hạn mòn má phanh theo cẩm nang được phê duyệt trước khi thay thế.",
                "asset": "TRAIN",
            },
        ]

    with Path(path).open("r", encoding="utf-8") as handle:
        payload = json.load(handle)
    if isinstance(payload, list):
        records = payload
    elif isinstance(payload, Mapping):
        records = payload.get("documents") or payload.get("records") or payload.get("docs")
    else:
        records = None
    if not isinstance(records, list):
        raise ValueError("Input JSON must be a list or contain documents/records/docs")
    return [record for record in records if isinstance(record, Mapping)]


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Build a versioned HURC1 RAG source index")
    parser.add_argument("--input", help="JSON file containing source documents")
    parser.add_argument("--raw-docs-dir", default="data/raw/docs")
    parser.add_argument("--index-dir", default="data/vector_db")
    parser.add_argument("--chunk-size", type=int, default=DEFAULT_CHUNK_SIZE)
    parser.add_argument("--chunk-overlap", type=int, default=DEFAULT_CHUNK_OVERLAP)
    args = parser.parse_args(argv)

    documents = _load_input(args.input)
    upgrader = DocumentRAGUpgrade(
        raw_docs_dir=args.raw_docs_dir,
        index_dir=args.index_dir,
        chunk_size=args.chunk_size,
        chunk_overlap=args.chunk_overlap,
    )
    upgrader.create_new_vector_index(documents)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
