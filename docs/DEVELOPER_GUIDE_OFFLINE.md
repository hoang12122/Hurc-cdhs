# Hướng dẫn Phát triển Chế độ Offline & Bài học Kinh nghiệm

Tài liệu này ghi nhận các lỗi đã xảy ra và cách phòng tránh khi làm việc với `json-db.ts`.

## 1. TypeScript Constraints (Ràng buộc Kiểu)

Luôn sử dụng `extends { id?: string }` cho các hàm thao tác bản ghi để TypeScript biết đối tượng luôn có thuộc tính ID.

## 2. Type Inference trong Scripts & Testing

Luôn định nghĩa một `Interface` rõ ràng cho dữ liệu test và ép kiểu Generic tường minh khi gọi hàm để tránh lỗi không nhận diện được thuộc tính.

## 3. Quản lý File db.json

Hàm `writeJsonDb` đã được bổ sung kiểm tra lỗi `EPERM` (lỗi quyền file trên Windows). Nếu gặp lỗi này, hãy đóng các ứng dụng đang mở file `db.json`.

## 4. UUID vs Timestamp

Tất cả bản ghi mới PHẢI sử dụng UUID v4 thông qua `crypto.randomUUID()`. Không sử dụng `Date.now()` làm ID để tránh xung đột dữ liệu khi gộp (merge).

## 5. Mở rộng Bộ lọc (Common Filters)

Các trường xuất hiện ở nhiều module (như `isArchived`, `status`) nên được đưa trực tiếp vào tham số của `applyFilters` trong `json-db.ts`.

## 6. Xử lý Kiểu dữ liệu Phức tạp (Complex Objects)

Sử dụng ép kiểu `<any>` ngay tại nơi gọi hàm nếu object đó chứa các thuộc tính tùy chỉnh không nằm trong Schema cơ bản.

## 7. Xử lý Giao dịch (Transactions) Offline

Sử dụng vòng lặp `for...of` kết hợp với `await jsonDb.updateRecord` để giả lập giao dịch (Transaction) trong môi trường Offline.

## 8. Chuẩn hóa Ngày tháng (Date Serialization)

Luôn sử dụng `.toISOString()` trước khi lưu vào `db.json`. JSON chỉ lưu trữ được chuỗi (string), không lưu được đối tượng `Date`.

## 9. Tính đồng bộ khi Refactoring (Consistency)

Thực hiện **Bulk Update** cho toàn bộ file ngay khi thay đổi kiến trúc Import để tránh lỗi "Reference Error" ở các hàm chưa cập nhật.

## 10. Nguyên tắc "Shielding first"

Mọi phương thức Public trong Service Layer nên bắt đầu bằng kiểm tra `IS_DATABASE_OFFLINE` và có khối `try...catch` bọc quanh Prisma logic.

## 11. Kiểm soát Dữ liệu đầu vào (Input Sanitization)

Gán giá trị mặc định cho các trường bắt buộc (như `status`, `isArchived`) trước khi lưu để tránh giá trị `undefined` làm hỏng cấu trúc JSON.

## 12. Giới hạn của Hợp nhất dữ liệu (Shallow Merge)

Cơ chế cập nhật hiện tại là Hợp nhất nông (Shallow Merge). Đối với các Mảng (Array) lồng nhau, hãy xử lý gộp thủ công trước khi truyền vào hàm `updateRecord` để tránh bị ghi đè dữ liệu.
