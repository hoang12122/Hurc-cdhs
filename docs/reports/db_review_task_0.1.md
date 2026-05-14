# BÁO CÁO RÀ SOÁT CẤU TRÚC DATABASE (TASK 0.1)

## 1. Hiện trạng Schema Prisma

Hệ thống hiện đang tồn tại song song hai cấu trúc:

- **Cấu trúc cũ (Legacy):** `prisma/schema.prisma` - Chứa tất cả các model (Task, Dnf, Hazard, SystemLog...) trong một database duy nhất.
- **Cấu trúc mới (Refactored):** Đã bắt đầu tách các schema vào thư mục con:
  - `prisma/ops/schema.prisma`: Chứa các model nghiệp vụ.
  - `prisma/ai/schema.prisma`: Chứa các model liên quan đến AI (Agent, Snippet, SyncLog...).
  - `prisma/auth/schema.prisma` & `prisma/metro/schema.prisma`: Các module khác.

## 2. Hiện trạng Prisma Client & Kết nối

- **File cấu hình:** `src/lib/prisma.ts` hiện chỉ khởi tạo **MỘT** PrismaClient duy nhất từ `DATABASE_URL`.
- **Phân tách Client:** Các biến `opsDb`, `aiDb`, `authDb`, `metroDb` hiện đang bị ép kiểu (`as any`) và trỏ chung về cùng một client cũ. Điều này gây rủi ro về hiệu năng và bảo mật khi dữ liệu AI và nghiệp vụ bị trộn lẫn.
- **Connection Pool:** Đang sử dụng cấu hình mặc định của Prisma. Chưa có cơ chế Circuit Breaker hay Timeout riêng biệt cho từng DB.

## 3. Phân loại dữ liệu hiện có

- **Dữ liệu nghiệp vụ chính:** Đang nằm trong các bảng `DnfDocument`, `HazardRecord`, `Task`, `InspectionDetail`.
- **Dữ liệu AI/Audit:**
  - Đã có schema cho `AiSyncLog`, `AiKnowledgeSnippet`, `AiAgent`.
  - **THIẾU:** Chưa có model cho `AIVerificationLog` và `AISafetyLog` (Hiện đang dùng in-memory trong service).
- **Log hệ thống:** Đang dùng bảng `SystemLog` trong schema chính.

## 4. Rủi ro xác định

1. **Memory Leak:** Việc hot-reload trong môi trường dev có thể tạo ra many instance Prisma nếu Singleton không được triển khai chặt chẽ cho tất cả các schema mới.
2. **Trộn lẫn dữ liệu:** Việc dùng chung một DB cho cả Audit log (tải ghi cao) và Nghiệp vụ (tải đọc/sửa cao) sẽ gây nghẽn cổ chai trong tương lai.
3. **Thiếu Schema AI Safety:** Các bản ghi an toàn AI chưa được định nghĩa trong Prisma schema, dẫn đến mất dữ liệu khi restart server.

## 5. Đề xuất hành động tiếp theo

- Hoàn thiện việc tách `opsDb` và `aiDb` trong `src/lib/prisma.ts`.
- Bổ sung `AIVerificationLog` và `AISafetyLog` vào `prisma/ai/schema.prisma`.
- Thực hiện Task 0.2 (Sao lưu) trước khi chạy migration tách DB.
