import os
import json
import uuid
from datetime import datetime

class DocumentRAGUpgrade:
    def __init__(self, raw_docs_dir="data/raw/docs", index_dir="data/vector_db"):
        self.raw_docs_dir = raw_docs_dir
        self.index_dir = index_dir
        os.makedirs(self.raw_docs_dir, exist_ok=True)
        os.makedirs(self.index_dir, exist_ok=True)
        
        # Danh mục phân loại kỹ thuật Metro chuẩn
        self.metro_systems = [
            "AFC", "PSD", "Rolling Stock", "Trackwork", 
            "Power Supply", "Signalling", "Telecom"
        ]

    def add_metadata(self, doc_record):
        """
        Bổ sung siêu dữ liệu (Metadata) kỹ thuật chuyên sâu thay vì chỉ có text thô.
        """
        # Logic giả lập tự động phân loại hệ thống dựa vào title
        title = doc_record.get("title", "").upper()
        detected_sys = "General"
        for sys in self.metro_systems:
            if sys.upper() in title:
                detected_sys = sys
                break

        # Gắn metadata
        enhanced_doc = {
            "id": str(uuid.uuid4()),
            "content": doc_record.get("content", ""),
            "metadata": {
                "document_code": doc_record.get("code", "DOC-UNKNOWN"),
                "version": doc_record.get("version", "1.0"),
                "issue_date": doc_record.get("issue_date", "2024-01-01"),
                "contractor": doc_record.get("contractor", "Hitachi/Nippon Koei"),
                "related_system": detected_sys,
                "related_asset": doc_record.get("asset", "All")
            }
        }
        return enhanced_doc

    def create_new_vector_index(self, docs):
        """
        Nguyên tắc: Không xóa Index cũ. Tạo Index version mới.
        """
        version = datetime.now().strftime("%Y%m%d_%H%M")
        index_name = f"metro_rag_index_v2_{version}"
        
        processed_docs = [self.add_metadata(d) for d in docs]
        
        output_payload = {
            "index_name": index_name,
            "created_at": datetime.now().isoformat(),
            "total_documents": len(processed_docs),
            "documents": processed_docs
        }
        
        out_path = os.path.join(self.index_dir, f"{index_name}.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(output_payload, f, ensure_ascii=False, indent=2)
            
        print(f"✅ [RAG UPGRADE] Tối ưu hóa xong {len(processed_docs)} tài liệu. Đã lưu vào Vector Index MỚI: {index_name}")
        return out_path

if __name__ == "__main__":
    # Mock data tài liệu O&M
    mock_docs = [
        {
            "title": "Hướng dẫn bảo trì Cổng soát vé AFC tự động",
            "code": "OM-AFC-001",
            "content": "Kiểm tra vành răng định kỳ 3 tháng/lần...",
            "asset": "GATE"
        },
        {
            "title": "Cẩm nang xử lý sự cố Tàu Rolling Stock",
            "code": "OM-RS-042",
            "version": "1.2",
            "content": "Nếu má phanh mòn quá 2mm, lập tức thay thế...",
            "asset": "TRAIN"
        }
    ]
    
    rag_upgrader = DocumentRAGUpgrade()
    rag_upgrader.create_new_vector_index(mock_docs)
