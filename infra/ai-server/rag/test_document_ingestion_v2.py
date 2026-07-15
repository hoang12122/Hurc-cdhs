import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("document_ingestion_v2.py")
SPEC = importlib.util.spec_from_file_location("hurc_document_ingestion", MODULE_PATH)
assert SPEC and SPEC.loader
ingestion = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = ingestion
SPEC.loader.exec_module(ingestion)


class DocumentIngestionTests(unittest.TestCase):
    def test_creates_chunks_metadata_and_latest_pointer(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            index_dir = Path(temp_dir) / "indexes"
            raw_dir = Path(temp_dir) / "raw"
            builder = ingestion.DocumentRAGUpgrade(
                str(raw_dir),
                str(index_dir),
                chunk_size=300,
                chunk_overlap=50,
            )
            source = {
                "title": "Quy trình kiểm tra PSD tại ga Bến Thành",
                "code": "OM-PSD-001",
                "version": "2.0",
                "source_file": "OM-PSD-001.pdf",
                "content": "Kiểm tra cách điện cửa chắn ke ga. " * 40,
            }
            output_path = Path(builder.create_new_vector_index([source]))
            payload = json.loads(output_path.read_text(encoding="utf-8"))
            latest = json.loads((index_dir / "latest.json").read_text(encoding="utf-8"))

        self.assertEqual(payload["schema_version"], "3.0")
        self.assertGreater(payload["statistics"]["unique_chunks"], 1)
        self.assertEqual(payload["chunks"][0]["metadata"]["related_system"], "PSD")
        self.assertEqual(payload["chunks"][0]["metadata"]["source_file"], "OM-PSD-001.pdf")
        self.assertEqual(latest["filename"], output_path.name)

    def test_deduplicates_identical_chunks_and_rejects_empty_documents(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            builder = ingestion.DocumentRAGUpgrade(
                index_dir=str(Path(temp_dir) / "indexes"),
                raw_docs_dir=str(Path(temp_dir) / "raw"),
                chunk_size=300,
                chunk_overlap=40,
            )
            docs = [
                {"title": "AFC A", "code": "AFC-1", "content": "Nội dung kiểm tra AFC."},
                {"title": "AFC B", "code": "AFC-2", "content": "Nội dung kiểm tra AFC."},
                {"title": "Empty", "content": ""},
            ]
            output_path = Path(builder.create_new_vector_index(docs))
            payload = json.loads(output_path.read_text(encoding="utf-8"))

        self.assertEqual(payload["statistics"]["accepted_documents"], 2)
        self.assertEqual(payload["statistics"]["rejected_documents"], 1)
        self.assertEqual(payload["statistics"]["unique_chunks"], 1)
        self.assertEqual(payload["statistics"]["duplicate_chunks_removed"], 1)


if __name__ == "__main__":
    unittest.main()
