# AI UPGRADE - PHASE 0 - BACKUP LOG

**Date:** 2026-05-08
**Version:** v1.0 (Trước nâng cấp YOLO-seg và Speech-to-Text)

## FILES BACKUP

1. `ai-server_main.py`: Chứa cấu hình FastAPI cho Gemma và định tuyến YOLO cũ.
2. `yolo_main.py`: Chứa cấu hình mô hình YOLOv8n.pt gốc.
3. `services_ai-smart-router.ts`: Chứa prompt, hệ thống phân loại câu hỏi (GraphRAG, DocumentRAG, Agent) nguyên bản.
4. `services_ai-knowledge.ts`: Chứa RAG logic (lấy dữ liệu từ DNF, Hazard, Inspection).

## STATUS

- Tất cả rule và prompt hiện hữu đã được bảo toàn.
- Bất kỳ lỗi nào phát sinh ở Giai đoạn 1 (Fine-tune) hoặc Giai đoạn 2 (Voice) đều có thể được rollback về mã nguồn tại thư mục này.
