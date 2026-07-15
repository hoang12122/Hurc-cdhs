import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("rag_engine.py")
SPEC = importlib.util.spec_from_file_location("hurc_rag_engine", MODULE_PATH)
assert SPEC and SPEC.loader
rag_engine = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = rag_engine
SPEC.loader.exec_module(rag_engine)


class RagEngineTests(unittest.TestCase):
    def test_vietnamese_query_is_accent_insensitive(self):
        result = rag_engine.answer_query("qua nhiet stator dong co keo")
        self.assertGreater(result["confidence"], 0.5)
        self.assertEqual(result["sources"][0]["document_code"], "DEMO-MOTOR-001")

    def test_irrelevant_query_is_refused(self):
        result = rag_engine.answer_query("noi dung khong lien quan xyz")
        self.assertEqual(result["confidence"], 0.0)
        self.assertEqual(result["sources"], [])

    def test_loads_versioned_chunk_index_and_returns_provenance(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            index_path = Path(temp_dir) / "index.json"
            index_path.write_text(
                json.dumps(
                    {
                        "schema_version": "3.0",
                        "chunks": [
                            {
                                "id": "chunk-1",
                                "content": "Kiểm tra vành răng định kỳ 3 tháng một lần.",
                                "metadata": {
                                    "title": "Hướng dẫn bảo trì cổng soát vé AFC",
                                    "document_code": "OM-AFC-001",
                                    "related_system": "AFC",
                                    "source_file": "manual.pdf",
                                },
                            }
                        ],
                    },
                    ensure_ascii=False,
                ),
                encoding="utf-8",
            )

            result = rag_engine.answer_query(
                "bảo trì cổng soát vé AFC",
                knowledge_path=str(index_path),
            )

        self.assertGreater(result["confidence"], 0.5)
        self.assertEqual(result["sources"][0]["document_code"], "OM-AFC-001")
        self.assertEqual(result["sources"][0]["metadata"]["source_file"], "manual.pdf")


if __name__ == "__main__":
    unittest.main()
