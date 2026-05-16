# 🚀 HƯỚNG DẪN TRIỂN KHAI HURC1-CRM (IRONCLAD PRODUCTION)

Tài liệu này hướng dẫn cách triển khai hệ thống Hurc1CRM trong môi trường Production (Air-gapped hoặc Online) với độ tin cậy 100%.

## 1. Yêu cầu Hệ thống (Hardened Requirements)

- **CPU:** Tối thiểu 4 Cores (Khuyến nghị 8 Cores cho AI).
- **RAM:** Tối thiểu 8GB (Hệ thống có RAM Guard cảnh báo nếu <15% của 8GB).
- **Storage:** 50GB SSD (Dành cho Docker Images và AI Models).
- **OS:** Linux (Ubuntu 22.04+ khuyến nghị) có cài đặt Docker & Docker Compose v2.

## 2. Chuẩn bị Môi trường (.env)

Hệ thống có cơ chế tự động đồng bộ. Bạn chỉ cần chuẩn bị file `.env` từ mẫu:

```bash
cp docker.env .env
```

**Các biến quan trọng:**

- `IS_DATABASE_OFFLINE`: `true` để dùng JSON-DB, `false` để dùng PostgreSQL.
- `DATABASE_URL`: Chuỗi kết nối Postgres (nếu chạy Online).
- `SESSION_SECRET`: Khóa bí mật cho phiên đăng nhập.

## 3. Các bước Triển khai

### Bước 1: Build và Khởi động

Chạy lệnh duy nhất để build và kích hoạt toàn bộ stack (App, DB, AI, Monitoring):

```bash
docker compose up -d --build
```

### Bước 2: Tự động hóa AI (Ollama & YOLO)

- **Ollama:** Hệ thống sẽ tự động khởi động một container "Seeder" để `pull` model `gemma:2b`. Bạn không cần can thiệp.
- **YOLO:** Model `yolov8n.pt` đã được nướng sẵn vào Image. Hệ thống sẽ tự load khi container khởi động.

### Bước 3: Kiểm tra Sức khỏe (Smoke Test)

Sau khi deploy, chạy script kiểm tra để đảm bảo mọi ngách đều thông suốt:

```bash
docker exec -it hurc_app node --import tsx src/scripts/smoke-test.ts
```

## 4. Quản trị và Sao lưu

### Sao lưu Dữ liệu

Sử dụng script đã chuẩn bị để sao lưu toàn bộ JSON DB, Postgres Dump và Logs:

```bash
bash scripts/backup-system.sh
```

### Giám sát (Monitoring)

- **Grafana:** Truy cập `http://<server-ip>:3001` (User: admin / Pass: config trong .env).
- **Logs:** Xem trực tiếp qua `docker compose logs -f app`.

## 5. Xử lý Sự cố (Troubleshooting)

- **Lỗi Permission:** Hệ thống đã có service `init-perms` tự động sửa quyền thư mục `/data` và `/logs`.
- **Lỗi AI Timeout:** Hệ thống có vòng lặp thử lại 3 lần. Nếu AI chưa lên kịp, hãy chờ 30 giây và refresh.
- **Lỗi Memory:** Nếu nhận được cảnh báo RAM <15%, hãy cân nhắc nâng cấp RAM vật lý hoặc tắt bớt service AI nếu không cần thiết.

---

**Hệ thống được bảo vệ bởi HURC1-IRONCLAD Audit Engine.**
