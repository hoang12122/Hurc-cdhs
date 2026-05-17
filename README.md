# HURC1 CRM - Executive Dashboard & AI Core

Hệ thống quản trị và phân tích dữ liệu bảo trì Metro HURC1, được thiết kế chuyên biệt cho môi trường **Air-Gapped** với kiến trúc **Bọc thép (Ironclad Stability)** và Trí tuệ nhân tạo nội bộ.

---

## 🎖️ Tóm tắt Dự án (Executive Summary)

Dự án này đã chuyển đổi hệ thống HURC1 CRM từ một ứng dụng quản lý dữ liệu thông thường thành một **Hệ sinh thái Trí tuệ nhân tạo Tự chủ**, tập trung vào 3 trụ cột chính:

1. **AI Precision (Độ chính xác cao):** Sử dụng kiến trúc Ensemble RAG (Graph + Vector) kết hợp Smart Routing để hỗ trợ CEO ra quyết định tức thì.
2. **Ironclad Security (Bảo mật bọc thép):** Chạy hoàn toàn Offline, Zero-CVE Docker images, và mã hóa dữ liệu đa tầng.
3. **Data Resilience (Sự bền bỉ dữ liệu):** Cơ chế Snapshot RAM tối ưu hiệu năng và hệ thống sao lưu luân phiên tự động.

---

## 🏗️ Kiến trúc Kỹ thuật (Technical Architecture)

### 1. AI Core (Trí tuệ nhân tạo)

- **Ensemble RAG:** Hợp nhất tri thức từ Đồ thị (TrustGraph) và Tài liệu (DocumentRAG).
- **Smart Intent Routing:** Phân loại câu hỏi thông minh bằng AI, tự động chuyển luồng xử lý.
- **Agent Memory:** Bộ nhớ dài hạn (TencentDB Agent Memory) ghi nhớ ngữ cảnh giao tiếp với CEO.
- **AI Hardening:** Tích hợp Semantic Chunking và Self-Reflection Loop để triệt tiêu ảo giác AI.

### 2. Data Strategy (Chiến lược dữ liệu)

- **Hybrid Storage:** Chuyển đổi linh hoạt giữa PostgreSQL (Online) và JSON-DB (Offline).
- **Hardening:** Snapshot caching (RAM) giúp phản hồi nhanh 0.01ms/op và hệ thống Backups 5 phiên bản.
- **Schema Guard:** Đối soát dữ liệu nghiêm ngặt bằng Zod trước khi xử lý.

### 3. Infrastructure (Hạ tầng)

- **Containerization:** Chainguard (Zero-CVE) & Distroless (Runner).
- **Observability:** Hệ thống Logging tập trung (Loki + Grafana) giám sát an toàn AI và vận hành.
- **Audit Engine:** Công cụ Deep Audit v2.1 tự động xuất chứng chỉ nghiệm thu trước khi triển khai.

---

## 🚀 Hướng dẫn Triển khai (Deployment Guide)

Hệ thống hỗ trợ triển khai theo tầng (Tiered Deployment) để tối ưu hóa tỷ lệ thành công và giảm rủi ro startup.

### Bước 1: Kiểm tra Preflight (Bắt buộc)

Trước khi deploy, hãy chạy script kiểm tra môi trường:

```bash
bash scripts/preflight.sh
```

### Bước 2: Triển khai theo tầng (Tiered Deployment)

Sử dụng Docker Compose Profiles để kích hoạt các khối chức năng theo thứ tự:

1. **Khối Core (Cơ bản):** DB, App, Nginx

   ```bash
   docker compose --profile core up -d --build
   ```

2. **Khối AI (Nâng cao):** Yolo, Ollama

   ```bash
   docker compose --profile ai up -d
   ```

3. **Khối Monitoring (Giám sát):** Loki, Grafana

   ```bash
   docker compose --profile obs up -d
   ```

### Bước 3: Smoke Test & Nghiệm thu

Chạy script tự động để xác nhận hệ thống đã lên đủ các endpoint quan trọng:

```bash
bash scripts/smoke-test.sh
```

---

## 📋 Cẩm nang Lệnh Chuẩn cho Đội ngũ Phát triển (Standard Team Commands)

Dưới đây là chuỗi lệnh chuẩn đã được gia cố (Ironclad Guard). Đội ngũ phát triển và vận hành có thể copy-paste trực tiếp để thiết lập sạch, kiểm tra chất lượng mã nguồn, đóng gói và vận hành hệ thống cục bộ:

### 1. Dọn dẹp và cài đặt sạch Dependencies

*Loại bỏ hoàn toàn thư viện cũ bị xung đột và cài đặt chuẩn theo lockfile:*

```bash
# Windows (PowerShell)
Remove-Item -Recurse -Force node_modules
npm cache verify
npm ci --include=dev

# Linux/macOS
rm -rf node_modules
npm cache verify
npm ci --include=dev
```

### 2. Đồng bộ Database Client

*Tự động sinh Types cho cả 4 Prisma Schemas độc lập:*

```bash
npm run db:generate:all
```

### 3. Kiểm duyệt Chất lượng (Local Quality Gates)

*Chạy chuỗi kiểm duyệt tĩnh bắt buộc trước khi commit/merge:*

```bash
# Kiểm tra kiểu dữ liệu TypeScript
npm run typecheck

# Kiểm tra phong cách viết code & quy tắc an toàn
npm run lint

# Biên dịch thử nghiệm Next.js tĩnh
npm run build
```

### 4. Đóng gói và Khởi chạy Docker Container

*Đóng gói độc lập dịch vụ `app` và khởi chạy cụm container cục bộ:*

```bash
# Đóng gói Docker Image cục bộ
docker compose build app

# Khởi chạy cụm container chế độ chạy ngầm
docker compose up -d

# Kiểm tra trạng thái hoạt động & Healthcheck của các container
docker compose ps

# Theo dõi trực tiếp logs của container app
docker compose logs -f app
```

---

## 📋 Checklist Sẵn sàng Sản xuất (Production Readiness)

- [ ] **Môi trường:** RAM tối thiểu 8GB (nếu dùng AI), 4GB (nếu chỉ Core).
- [ ] **Bảo mật:** `.env` không còn chứa placeholder values cho các khóa bí mật.
- [ ] **Dữ liệu:** Đã backup dữ liệu cũ trước khi chạy `prisma migrate`.
- [ ] **Mạng:** Cổng 80 và 443 đã được mở và không bị chiếm dụng.

---

## 🚀 Quy trình Khởi động Xếp tầng (Layered Startup Guide)

Để tối ưu hóa tài nguyên (RAM/CPU) và cô lập lỗi khởi động nhanh chóng, hệ thống hỗ trợ khởi chạy xếp tầng thông qua Docker Compose Profiles:

### 🟢 Tầng 1: Khởi động dịch vụ cốt lõi (Core Stack)

*Khởi chạy: Web App, PostgreSQL, MongoDB, Redis Cache, Nginx Gateway.*

```powershell
docker compose --profile core up -d
```

### 🔵 Tầng 2: Khởi động dịch vụ Trí tuệ Nhân tạo (AI Stack)

*Khởi chạy thêm: YOLO-service và Ollama.*

```powershell
docker compose --profile core --profile ai up -d
```

*Lưu ý: Sau khi kích hoạt AI Stack, hãy chạy script tải model AI độc lập:*

- Windows: `.\scripts\pull-local-ai.ps1`
- Linux: `chmod +x scripts/pull-local-ai.sh && ./scripts/pull-local-ai.sh`

### 🟣 Tầng 3: Khởi động hệ thống Giám sát (Observability Stack)

*Khởi chạy thêm: Loki log aggregator và Grafana Dashboard.*

```powershell
docker compose --profile core --profile ai --profile obs up -d
```

---

## 🛠️ Runbook Xử lý Sự cố (Incident Runbook)

### 1. Rollback nhanh (Về bản ổn định trước đó)

Nếu deploy bản mới bị lỗi crash dây chuyền:

```bash
docker compose down
# Quay lại tag image hoặc commit trước đó
git checkout <last-stable-commit>
docker compose --profile core up -d
```

### 2. App bị "CrashLoopBackOff"

- Kiểm tra kết nối DB: `docker compose logs postgres`
- Kiểm tra lỗi khởi tạo: `docker compose logs app`
- Thường do lỗi biến môi trường hoặc lỗi Migration Prisma.

### 3. AI Service không phản hồi

- Kiểm tra danh sách model đã tải: `docker exec -it hurc_ollama ollama list`
- Nếu thiếu model hoặc gặp lỗi timeout, hãy tự tải out-of-band:
  - Windows: `.\scripts\pull-local-ai.ps1`
  - Linux: `./scripts/pull-local-ai.sh`

### 4. Quy trình Kiểm nghiệm Sức khỏe & Chẩn đoán nhanh (Healthcheck Guide)

Nếu có service nào báo trạng thái **unhealthy** khi xem qua `docker compose ps`:

1. **PostgreSQL/MongoDB:** Chạy `docker compose logs postgres` hoặc `docker compose logs mongo` để kiểm tra phân quyền volume hoặc lỗi khởi động.
2. **YOLO-Service:** Chạy `curl -f http://localhost:5005/health` trên host. Nếu lỗi, restart bằng `docker compose restart yolo-service`.
3. **App (Next.js Standalone):** Chạy `docker compose logs app` để kiểm tra các bước Migration Prisma của script `./dist-init/container-init.js`.
4. Xem hướng dẫn vận hành và xử lý lỗi chi tiết cho từng trường hợp tại: [DEPLOY.md](file:///d:/Hurc1CRM-main/Hurc-cdhs/DEPLOY.md#5-cam-nang-xu-ly-su-co--kiem-tra-healthcheck-operational-runbook)

---

## 🔒 Cam kết Bảo mật & Ổn định

Hệ thống được thiết kế theo chuẩn **Zero Trust** cho môi trường nội bộ. Mọi luồng dữ liệu đều được kiểm soát bởi gateway nội bộ, không có bất kỳ kết nối nào ra Cloud/Internet bên ngoài.

## 📖 Tài liệu hướng dẫn đầy đủ (Full Documentation)

Bạn có thể xem chi tiết về kiến trúc, tính năng và quy trình bảo trì tại: [FULL_DOCUMENTATION.md](file:///d:/Hurc1CRM-main/Hurc-cdhs/docs/FULL_DOCUMENTATION.md)

**HURC1 AI Engineering Team**
*Version: 2.2.0-IRONCLAD*
