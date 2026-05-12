# Database Architecture

**Mục tiêu:** Bảo vệ các thông tin định danh (PII) và tri thức AI nhạy cảm ngay cả khi Database bị rò rỉ.

**Công việc cụ thể:**

- [x] Xác định danh sách các trường cần mã hóa (`issueDetails`, `details`, `remarks`, `findings`).
- [x] Triển khai Utility mã hóa/giải mã sử dụng thuật toán AES-256-GCM (👉 `src/lib/utils/crypto.ts`).
- [x] Tích hợp Middleware mã hóa tự động tại lớp Provider cho các trường nhạy cảm (Trong `PrismaProvider`).
- [x] Quản lý khóa mã hóa thông qua biến môi trường (`ENCRYPTION_KEY`).
- [x] Đảm bảo dữ liệu trong `aiDb` và `audit_logs` được mã hóa khi lưu trữ (Tự động hóa tại layer Provider).

**Kết quả đầu ra:**

- Dữ liệu nhạy cảm được lưu trữ dưới dạng bản mã (ciphertext) trong Database.
- Cơ chế giải mã trong suốt (transparent) đối với tầng Application.

---

## 11. KIỂM THỬ VÀ NGHIỆM THU

## TASK 8.1 - Kiểm thử Multi-Prisma Instances

**Mục tiêu:** Xác nhận khả năng chạy song song và độc lập của `opsDb` và `aiDb`.

**Công việc cụ thể:**

- [x] Kiểm tra kết nối đồng thời đến cả hai Database (Đã kiểm tra qua `test:db`).
- [x] Xác nhận `opsDbProvider` không thể truy cập các bảng của `aiDb` (Lỗi schema isolation).
- [x] Xác nhận `aiDbProvider` không thể ghi đè dữ liệu nghiệp vụ chính (Chặn ở mức schema).
- [x] Kiểm tra tính biệt lập của Connection Pool cho từng Instance (Hoạt động song song ổn định).

## TASK 8.2 - Kiểm thử Mock Layer

**Mục tiêu:** Đảm bảo môi trường Test hoạt động ổn định mà không cần Database vật lý.

**Công việc cụ thể:**

- [x] Chạy Unit Test với chế độ `MOCK_MODE=true` (Thông qua lệnh `test:mock`).
- [x] Xác nhận dữ liệu Mock được trả về đúng định dạng Schema (Kiểm tra `JsonProvider` persistence).
- [x] Kiểm tra khả năng giả lập lỗi Database để thử nghiệm cơ chế Retry (Xác nhận cơ chế chuyển đổi Provider khi Offline).

## TASK 8.3 - Kiểm thử Cross-DB Relationships

**Mục tiêu:** Xác nhận hiệu quả của cơ chế kiểm tra nhất quán không dùng Foreign Key.

**Công việc cụ thể:**

- [x] Tạo dữ liệu mồ côi (Orphan) giả lập (Đã thực hiện trong `test:integrity`).
- [x] Chạy `IntegrityCoordinator` và kiểm tra báo cáo lỗi (Phát hiện 100% bản ghi ma).
- [x] Xác nhận lỗi được ghi đúng vào `audit_consistency_check_logs` (Ghi nhận loại `ORPHAN_CHECK`).
- [x] Kiểm tra cơ chế cảnh báo (Alerting) khi số lượng lỗi vượt ngưỡng (Xác nhận phát tín hiệu 🚨 ALERT khi lỗi > 10).

## TASK 8.4 - Kiểm thử TrustGraph Sync

**Mục tiêu:** Đảm bảo Đồ thị tri thức luôn đồng bộ với dữ liệu nguồn.

**Công việc cụ thể:**

- [x] Cập nhật một DnfDocument và kiểm tra Node tương ứng trong TrustGraph (Xác nhận khớp dữ liệu ban đầu).
- [x] Giả lập sai lệch `sourceVersion` và chạy kiểm tra định kỳ (Phát hiện lỗi `VERSION_MISMATCH`).
- [x] Xác nhận lỗi được ghi vào `graph_consistency_logs` (Lưu vết thành công cho audit).
- [x] Chạy hàm `resolvePendingIssues` để kiểm tra khả năng tự phục hồi tri thức (Tích hợp vào `test:graph`).

---

## 12. LỘ TRÌNH ƯU TIÊN TRIỂN KHAI

## 12.1 Ưu tiên cao
