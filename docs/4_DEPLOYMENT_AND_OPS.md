# TÀI LIỆU 4: VẬN HÀNH VÀ TRIỂN KHAI PRODUCTION (DEPLOYMENT & OPS)

Tài liệu này hướng dẫn cách triển khai hệ thống **HURC1 CRM (Metro Inspect Pro)** trên hệ điều hành **Ubuntu Server (22.04 LTS / 24.04 LTS)** theo tiêu chuẩn **Ironclad Production**.

---

## 1. YÊU CẦU HỆ THỐNG VÀ CÀI ĐẶT

### 1.1 Cấu hình phần cứng
- **CPU:** Tối thiểu 4 Cores (Khuyến nghị 8 Cores nếu chạy YOLO Vision & AI Chat).
- **RAM:** Tối thiểu 8GB (Hệ thống có RAM Guard sẽ cảnh báo nếu RAM trống < 15%).
- **Ổ cứng:** SSD trống tối thiểu 50GB.

### 1.2 Cài đặt Môi trường
Bắt buộc cài đặt Docker Engine và Docker Compose v2:
```bash
# Cài đặt docker cơ bản trên Ubuntu
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

---

## 2. QUY TRÌNH TRIỂN KHAI PHÂN LỚP (STRICT LAYERED DEPLOYMENT)

Để đảm bảo hệ thống không bao giờ bị "sập toàn phần", chúng tôi áp dụng cơ chế triển khai phân lớp nghiêm ngặt qua script `./scripts/deploy-prod.sh`. Nếu một lớp thất bại ở bài kiểm tra Smoke Test, tiến trình sẽ Rollback lập tức.

### 2.1 Sơ đồ Quy trình Triển khai
```mermaid
graph TD
    A[Preflight Check] --> B[Hot Backup CSDL cũ]
    B --> C[Lớp 1: Khởi chạy Core Services]
    C --> D{Smoke Test Core?}
    D -- Thất bại -- > E[Rollback Core & Dừng]
    D -- Thành công --> F[Lớp 2: Khởi chạy AI Services]
    F --> G{Smoke Test AI?}
    G -- Thất bại --> H[Rollback Toàn bộ & Dừng]
    G -- Thành công --> I[Lớp 3: Observability]
    I --> J[Hệ thống Online 100%]
```

### 2.2 Các Lệnh Vận Hành Cơ Bản
**1. Deploy Toàn bộ (Bao gồm AI):**
```bash
./scripts/deploy-prod.sh
```

**2. Deploy Chế độ Dự phòng (Core-Only):**
Phù hợp cho máy chủ RAM yếu hoặc không có GPU. Chế độ này bỏ qua YOLO và Ollama.
```bash
DEPLOY_PROFILE=core ./scripts/deploy-prod.sh
```

**3. Nghiệm thu & Giám sát (Smoke Test & Logs):**
```bash
./scripts/smoke-deploy.sh all
docker compose logs -f --tail=100 app
```

---

## 3. SAO LƯU VÀ PHỤC HỒI DỮ LIỆU (DISASTER RECOVERY)

### 3.1 Hot Backup Tự Động
Hệ thống tự động sao lưu toàn diện SQL, NoSQL và logs:
```bash
./scripts/backup-system.sh
```
File sao lưu nằm trong thư mục `./backups/YYYY-MM-DD_HH-MM-SS/` kèm mã hash SHA-256 để chống lỗi bit rot.

### 3.2 Di Trú Dữ Liệu Lên Postgres (Migration)
Nếu máy chủ phải chạy chế độ Offline (sử dụng `db.json`), sau khi mạng được khôi phục, bạn cần đồng bộ dữ liệu vào PostgreSQL trung tâm:
```bash
# Chạy bên trong container app, hoặc dùng lệnh npm nếu node ở host:
docker exec -it hurc_app npm run migrate
```
Lệnh này quét dọn dữ liệu mồ côi và ghi đè đồng bộ an toàn 100%.

### 3.3 Khôi Phục Tài Khoản (2FA Backup Codes)
Hệ thống sử dụng cơ chế bảo mật 2FA. Trong trường hợp khẩn cấp mất thiết bị xác thực:
- Mỗi tài khoản có 8 mã dự phòng khẩn cấp (`XXXX-XXXX`) được cấp lúc bật 2FA.
- Mã dự phòng được mã hóa **SHA-256** trong Database `authDb`.
- Nhập 1 mã dự phòng vào màn hình đăng nhập sẽ vô hiệu hóa mã đó vĩnh viễn và cấp quyền vào hệ thống.

---

## 4. INVARIANTS VÀ LỖI THƯỜNG GẶP
- **Nginx HTTP 502:** Nguyên nhân do Next.js mặc định lắng nghe trên `localhost`. Phải đảm bảo `HOSTNAME=0.0.0.0` trong tệp `.env`.
- **Lỗi Prisma Client Undefined:** Model Prisma trả về kiểu `camelCase`. Phải sử dụng bộ đệm (Wrapper) trong `db-wrapper.ts` để ánh xạ chính xác định dạng tên Model.
- **YOLO Connection Refused:** Port `5005` của YOLO không mở public. Smoke test phải dùng `docker exec` để curl nội bộ.
