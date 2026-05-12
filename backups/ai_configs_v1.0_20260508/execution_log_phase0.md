# NHẬT KÝ THỰC HIỆN NÂNG CẤP AI (EXECUTION LOG)

## GIAI ĐOẠN 0: CHUẨN BỊ VÀ THIẾT LẬP CƠ CHẾ AN TOÀN

### TASK 0.1 - Sao lưu rule và cấu hình hiện tại [HOÀN THÀNH]
- **Thời gian:** 2026-05-08
- **Chi tiết thực hiện:**
  - Sao lưu `infra/ai-server/main.py` -> `backups/ai_configs_v1.0_20260508/ai-server_main.py`
  - Sao lưu `infra/yolo/main.py` -> `backups/ai_configs_v1.0_20260508/yolo_main.py`
  - Sao lưu `src/lib/services/ai-smart-router.ts` -> `backups/ai_configs_v1.0_20260508/services_ai-smart-router.ts`
  - Sao lưu `src/lib/services/ai-knowledge.ts` -> `backups/ai_configs_v1.0_20260508/services_ai-knowledge.ts`
- **Đánh giá:** Đáp ứng đúng yêu cầu của kế hoạch, bảo toàn 100% rule và luồng xử lý AI nguyên bản trước khi nâng cấp.

### TASK 0.2 - Thiết lập cơ chế Feature Flag/Version [HOÀN THÀNH]
- **Thời gian:** 2026-05-08
- **Chi tiết thực hiện:**
  - Tạo mới module cấu hình: `src/lib/config/ai-config.ts`.
  - Khai báo hằng số `AI_CONFIG` với version hiện tại `v1.0.0`.
  - Khởi tạo Feature Flag `EXPERIMENTAL_MODE` liên kết với biến môi trường `NEXT_PUBLIC_AI_EXPERIMENTAL_MODE`.
  - Bổ sung cấu trúc chứa danh sách model gốc (`STABLE_MODEL`) và model thử nghiệm (`EXPERIMENTAL_MODEL`) cho cả YOLO và Gemma LLM.
  - Viết các hàm helper (`getActiveYoloModel()`, `getActiveLLMModel()`) để tự động chuyển hướng request dựa vào Feature Flag.
- **Đánh giá:** Đáp ứng đúng yêu cầu của kế hoạch. Mã nguồn mới phát triển sau này sẽ dùng cơ chế này để gọi model, qua đó đảm bảo ứng dụng luôn có khả năng fallback về bản ổn định mà không cần sửa code.
