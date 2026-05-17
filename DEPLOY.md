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

### Bước 2: Tải Mô hình AI Local (Chạy sau khi các container đã khởi động)

Để tránh treo cụm docker khi khởi động trên môi trường mạng yếu, tiến trình tải mô hình AI được chạy tách biệt:

- **Windows:**

  ```powershell
  .\scripts\pull-local-ai.ps1
  ```

- **Linux:**

  ```bash
  chmod +x scripts/pull-local-ai.sh
  ./scripts/pull-local-ai.sh
  ```

*Mô hình mặc định được tải về bao gồm `gemma:2b` (siêu nhẹ cho RAG), `mistral` và `llama3:8b`.*

### Bước 3: Kiểm tra Sức khỏe (Smoke Test)

Sau khi deploy, chạy script kiểm tra để đảm bảo mọi ngách đều thông suốt:

```bash
bash scripts/smoke-test.sh
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

## 5. Cẩm nang Xử lý Sự cố & Kiểm tra Healthcheck (Operational Runbook)

Nếu bất kỳ dịch vụ nào báo trạng thái `unhealthy` hoặc không thể kết nối, hãy thực hiện kiểm tra theo checklist sau:

### 🩺 1. Dịch vụ Cơ sở dữ liệu (PostgreSQL, MongoDB)

- **Lỗi phổ biến:** DB chưa khởi tạo xong hoặc phân quyền volume lỗi.
- **Lệnh chẩn đoán:**

  ```bash
  # Xem logs PostgreSQL
  docker compose logs postgres
  # Xem logs MongoDB
  docker compose logs mongo
  # Kiểm tra kết nối Postgres thủ công từ host
  docker exec -it hurc_postgres pg_isready -U postgres
  # Kiểm tra mongo socket
  docker exec -it hurc_mongo mongosh --eval "db.runCommand({ping:1})" --quiet
  ```

- **Hướng khắc phục:** Nếu Postgres bị lỗi permission trên thư mục `/var/lib/postgresql/data`, chạy lệnh `sudo chown -R 999:999 ./data/postgres` trên host.

### 🩺 2. Dịch vụ Redis Cache

- **Lỗi phổ biến:** Hết bộ nhớ đệm hoặc bị kẹt kết nối.
- **Lệnh chẩn đoán:**

  ```bash
  # Xem logs Redis
  docker compose logs redis
  # Ping thử Redis
  docker exec -it hurc_redis redis-cli ping
  ```

- **Hướng khắc phục:** Khởi động lại Redis bằng `docker compose restart redis`.

### 🩺 3. Dịch vụ Nhận diện YOLO (yolo-service)

- **Lỗi phổ biến:** Thiếu model weights `.pt` hoặc lỗi dependency Python trong container.
- **Lệnh chẩn đoán:**

  ```bash
  # Xem logs YOLO
  docker compose logs yolo-service
  # Test API nhận diện trực tiếp từ host
  curl -f http://localhost:5005/health
  ```

- **Hướng khắc phục:** YOLO tự động tải model khi build image. Nếu fail, hãy chạy `docker compose build --no-cache yolo-service` để build lại.

### 🩺 4. Dịch vụ Trí tuệ Nhân tạo (Ollama)

- **Lỗi phổ biến:** Chưa tải model AI, hoặc card đồ họa/CPU không đủ đáp ứng khiến phản hồi chậm và gây timeout.
- **Lệnh chẩn đoán:**

  ```bash
  # Xem trạng thái Ollama
  docker compose logs ollama
  # Liệt kê các model đã tải thành công
  docker exec -it hurc_ollama ollama list
  ```

- **Hướng khắc phục:** Nếu thiếu model `gemma:2b`, hãy chạy lại script tải mô hình `./scripts/pull-local-ai.sh`.

### 🩺 5. Ứng dụng Chính (app) bị Crash hoặc Unhealthy

- **Lỗi phổ biến:** Gặp lỗi khi chạy Prisma Migration lúc khởi động, hoặc thiếu thư viện do cache node_modules.
- **Lệnh chẩn đoán:**

  ```bash
  # Xem logs chi tiết của container init script & app
  docker compose logs app
  ```

- **Hướng khắc phục:**
  1. Kiểm tra biến `IS_DATABASE_OFFLINE` trong `.env`. Nếu offline, đảm bảo có file `./data/offline/db.json`.
  2. Nếu online, kiểm tra xem `DATABASE_URL` có trỏ đúng đến host `postgres` chưa.
  3. Để sửa lỗi biên dịch script khởi tạo, đảm bảo tệp `./dist-init/container-init.js` đã được build thành công khi build Docker image.

---

**Hệ thống được bảo vệ bởi HURC1-IRONCLAD Audit Engine.**
