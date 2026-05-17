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

## 2.5. Bảo vệ Nhánh & Khóa Deploy CI/CD (Quality Gate Guard)

Để ngăn ngừa tuyệt đối việc đưa mã lỗi lên nhánh chính (`main`/`develop`), cấu hình bảo vệ nhánh (Branch Protection) phải được áp dụng trên GitHub:

1. **Bật Rule Bảo vệ Nhánh:**
   - Đi tới: `Settings` -> `Branches` -> `Add branch protection rule`.
   - Chọn nhánh áp dụng: `main` hoặc `develop`.

2. **Bắt buộc Kiểm tra Chất lượng trước khi Merge:**
   - Tích chọn: `Require status checks to pass before merging`.
   - Tìm kiếm và tích chọn check sau:
     - `audit_and_build` (Đường ống Ironclad CI/CD kiểm tra 5 tầng).

3. **Cơ chế Khóa Deploy Tự động (Fail-Fast Block):**
   - Mọi tiến trình Deploy/Build Docker (`docker build`) trong file `.github/workflows/ironclad-pipeline.yml` đều nằm ở cuối job `audit_and_build`. 
   - Nếu bất kỳ gate nào trong 5 cổng kiểm duyệt (`npm ci`, `db:generate:all`, `typecheck`, `lint`, `build`) báo đỏ, tiến trình chạy của GitHub Actions sẽ dừng lại lập tức, ngăn chặn hoàn toàn việc build hoặc đẩy image lỗi lên registry.

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

### Bước 3: Kiểm tra Sức khỏe & Nghiệm thu sau Deploy (Post-Deployment Verification)

Sau khi deploy, để chắc chắn hệ thống không chỉ build thành công mà còn vận hành an toàn trên môi trường thực tế với đầy đủ các dịch vụ phụ trợ, hãy tiến hành các bước nghiệm thu sau:

1. **Khởi động và Kiểm tra Trạng thái Dịch vụ (Healthcheck chain):**

   ```bash
   docker compose up -d
   # Chờ khoảng 30-45 giây để các dịch vụ khởi động hoàn tất, sau đó kiểm tra:
   docker compose ps
   ```

   *Đảm bảo tất cả các container (`postgres`, `mongo`, `redis`, `yolo-service`, `ollama`, `app`) đều hiển thị trạng thái `healthy` hoặc `running` và không bị restart đột ngột.*

2. **Chạy Kịch bản Smoke Test Tự động:**

   ```bash
   bash scripts/smoke-test.sh
   ```

   *Script này sẽ gửi HTTP request đến Nginx/App, YOLO-service, Ollama API để đảm bảo luồng giao tiếp nội bộ thông suốt.*

3. **Theo dõi Logs Vận hành 2-5 Phút Đầu:**

   ```bash
   docker compose logs -f --tail=100 app
   ```

   *Giúp phát hiện sớm các lỗi kết nối Database hoặc cảnh báo thiếu tài nguyên hệ thống (RAM/CPU).*

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
