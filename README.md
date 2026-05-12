# Hurc1CRM - Hệ thống Quản lý Vận tải Đường sắt

Hệ thống quản lý bảo trì và vận hành tích hợp AI, hỗ trợ cơ chế lưu trữ linh hoạt (Hybrid Storage).

## 🗄️ Chế độ Cơ sở dữ liệu (Database Modes)

Dự án hỗ trợ hai cơ chế lưu trữ dữ liệu để tối ưu hóa quá trình phát triển và triển khai.

### 1. Offline Mode (Dùng `db.json`)

Chế độ này cho phép chạy ứng dụng mà **KHÔNG cần cài đặt PostgreSQL hay Docker**.

- **Cấu hình**: Đặt `IS_DATABASE_OFFLINE=true` trong tệp `.env`.
- **Cách thức**: Dữ liệu được lưu trữ nguyên tử vào tệp `db.json` tại thư mục gốc.
- **Ưu điểm**: Khởi động nhanh, phù hợp cho phát triển giao diện (UI) và logic nghiệp vụ cơ bản.

### 2. Online Mode (Dùng PostgreSQL)

Chế độ đầy đủ tính năng, sử dụng PostgreSQL làm cơ sở dữ liệu chính thông qua Prisma ORM.

- **Cấu hình**: Đặt `IS_DATABASE_OFFLINE=false` trong tệp `.env`.
- **Yêu cầu**: PostgreSQL server phải đang chạy (thường qua Docker).
- **Lưu ý quan trọng**: Prisma là thành phần **BẮT BUỘC** cho chế độ này. **KHÔNG ĐƯỢC XÓA** thư mục `prisma` hoặc các gói `prisma client` vì chúng là hạ tầng cốt lõi của hệ thống.

---

## 🚀 Hướng dẫn vận hành

### Cách chạy không cần PostgreSQL

1. Đảm bảo `.env` có `IS_DATABASE_OFFLINE=true`.
2. Chạy lệnh: `npm run dev`.
3. Ứng dụng sẽ tự động sử dụng `db.json`.

### Cách bật lại PostgreSQL (Online Mode)

1. Mở Docker Desktop.
2. Khởi động database: `docker compose up -d postgres`.
3. Đồng bộ Prisma:

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. Đặt `IS_DATABASE_OFFLINE=false` trong `.env`.
5. Chạy lệnh: `npm run dev`.

---

## 🛠️ Xử lý sự cố

### ⚠️ Lưu ý Quan trọng khi Triển khai (Build/Production)

Mặc định, hệ thống sẽ ngăn chặn việc chạy `db.json` trong môi trường Production (`npm run build`) để tránh mất mát dữ liệu. Nếu bạn thực sự muốn chạy Offline trong Production:

1. Đặt `IS_DATABASE_OFFLINE=true`
2. Đặt `ALLOW_OFFLINE_PRODUCTION=true` trong `.env`

---

## 🛠 Troubleshooting (Xử lý lỗi)

### Lỗi kết nối Database (Prisma Error)

Nếu bạn thấy lỗi `P2002`, `P1001` hoặc thông báo "Can't reach database server":

- **Nguyên nhân**: Thường do PostgreSQL chưa được khởi động trong Docker.
- **Giải pháp**: Kiểm tra Docker Desktop và chạy `docker compose ps` để đảm bảo dịch vụ `hurc_postgres` đang ở trạng thái `running`.

### Lỗi "Prisma Client not generated"

- **Giải pháp**: Chạy lệnh `npx prisma generate` để khởi tạo lại bộ thư viện truy vấn.

### Cách kiểm tra lỗi Prisma chi tiết

- Kiểm tra log console tại terminal chạy `npm run dev`.
- Kiểm tra tệp `.env` để đảm bảo `DATABASE_URL` chính xác.

---

> [!IMPORTANT]
> **Hạ tầng Hybrid**: Hệ thống được thiết kế để chuyển đổi linh hoạt. Việc giữ lại Prisma giúp đảm bảo ứng dụng có thể nâng cấp lên môi trường sản xuất (Production) bất cứ lúc nào mà không cần viết lại mã nguồn.
