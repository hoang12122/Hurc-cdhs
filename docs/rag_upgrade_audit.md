# RAG Upgrade Audit — HURC1

## Scope

Review of the offline Copilot retrieval path, document ingestion pipeline, and the central TrustGraph orchestration in `src/lib/services/ai.ts`.

## High-priority weaknesses found

1. **Offline Copilot was a demo, not a production retriever.** `rag_engine.py` used four hard-coded records and counted exact token overlaps. It did not load the indexed knowledge base, rank multiple sources, normalize confidence, or return provenance.
2. **The ingestion job did not create a vector index.** `document_ingestion_v2.py` only wrapped whole documents in JSON. There was no semantic chunking, overlap, stable IDs, content hashes, duplicate control, atomic publish, or `latest` pointer.
3. **Grounding can be discarded when memory exists.** In `askAI`, the prompt construction chooses memory context before grounding context. When both are present, the retrieved evidence is omitted from the model input.
4. **Retrieved text is fused as instructions.** The ensemble path concatenates GraphRAG and DocumentRAG responses into a user prompt. Retrieved documents should be treated as untrusted data, bounded in size, and separated from instructions to reduce prompt-injection and context-overflow risk.
5. **RAG provenance is lost at the service boundary.** TrustGraph responses support `sources`, but `askWithRAG` returns only response, intent, and source backend. The UI and audit layer cannot show document code, version, page, retrieval score, or conflicting sources.
6. **Retrieval limits are static and reranking is absent.** DocumentRAG requests up to 20 documents and GraphRAG uses fixed graph limits. There is no query-dependent budget, deduplication, diversity selection, or evidence-quality score before generation.
7. **Intent typing is inconsistent.** The implementation returns `ensemble` through `as any`, while `QueryIntent` does not include this state. This weakens compile-time checks and telemetry consistency.
8. **No retrieval-quality test set.** Existing scripts test connectivity and governance, but there is no golden question set measuring hit rate, citation correctness, abstention, latency, or hallucination rate.

## Changes implemented in this branch

### Offline Copilot retrieval

- Replaced exact overlap counting with a standard-library hybrid retriever: BM25, phrase match, metadata/category bonus, query coverage, and character-trigram similarity.
- Added Unicode and Vietnamese accent normalization.
- Added bounded query size, top-k limits, calibrated confidence, low-confidence refusal, and deterministic JSON errors.
- Added loading from `RAG_KNOWLEDGE_PATH`, `data/vector_db/latest.json`, or the newest versioned index.
- Preserved the existing `answer`, `confidence`, and `engine` response fields and added `sources` plus `knowledge_source`.
- Added provenance fields such as document code, category, matched terms, retrieval score, and metadata.

### Document ingestion

- Added paragraph/sentence-aware chunking with overlap.
- Added stable document/chunk IDs and SHA-256 content hashes.
- Added duplicate chunk removal while retaining duplicate-source provenance.
- Removed fabricated metadata defaults such as a fixed issue date and contractor.
- Added broader metro-system classification using title, code, content, asset, and aliases.
- Added immutable versioned indexes, atomic writes, integrity hash, and an atomic `latest.json` pointer.
- Explicitly labels the output as a source index awaiting external vectorization instead of claiming that JSON alone is a vector database.

### Tests

Run:

```bash
python src/lib/ai/test_rag_engine.py
python infra/ai-server/rag/test_document_ingestion_v2.py
```

The tests cover accent-insensitive retrieval, abstention on unrelated queries, provenance loading, chunk creation, system classification, latest-pointer generation, duplicate removal, and empty-document rejection.

## Recommended phase 2 for central TrustGraph RAG

1. Build a typed `RagEvidence` contract carrying document code, version, page/section, collection, retrieval score, and content hash.
2. Fix prompt assembly so memory and grounding are both included, each with independent token budgets.
3. Treat retrieved content as untrusted evidence: delimit it, strip instruction-like content, and never place it above immutable system policy.
4. Add hybrid retrieval: metadata filters + sparse search + dense search + reranker, followed by diversity selection.
5. Replace fixed limits with a retrieval budget based on query type and available context window.
6. Return citations to the UI and require citation coverage for technical or safety conclusions.
7. Add a golden evaluation set for PSD, AFC, VLD, DNF, hazards, maintenance manuals, and Vietnamese abbreviations. Track Recall@5, MRR, citation precision, abstention precision, p95 latency, and grounded-answer rate.
8. Add ingestion lifecycle controls: document version supersession, soft delete, re-index status, failed-page reporting, and permission-aware collection filters.

## Acceptance targets

- Recall@5 ≥ 0.85 on the approved technical question set.
- Citation precision ≥ 0.95 for document-code and page references.
- Abstention precision ≥ 0.90 for questions outside the indexed corpus.
- No answer used for safety/maintenance decisions without at least one retrievable source.
- p95 retrieval latency under 2 seconds locally, excluding final generation.
