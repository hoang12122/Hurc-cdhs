# TÀI LIỆU 4: VẬN HÀNH VÀ TRIỂN KHAI

## 0. Mục tiêu

Tài liệu này đối chiếu lại nội dung triển khai, vận hành và kiểm thử với phần mềm hiện tại trên nhánh `master`.

Tài liệu cũ có một số điểm không còn phù hợp, như mô tả service `postgres-core`, hướng dẫn dùng `IS_DATABASE_OFFLINE=true` khi build và mô tả Docker Compose theo dạng snippet đơn giản. Bản này đã chỉnh lại theo Dockerfile, docker-compose và CI thật trong repo.

## 1. Đối chiếu hai chiều giữa tài liệu và phần mềm

| Nội dung | Tài liệu cũ | Phần mềm hiện tại | Trạng thái mới |
|---|---|---|---|
| Docker Compose | Mô tả snippet đơn giản | Có `docker-compose.yml` với các service `postgres`, `mongo`, `redis`, `app`, `nginx` | Đã cập nhật |
| Profile triển khai | Chưa mô tả đúng | Có profile `core`, `tools`, `ai`, `obs` | Đã cập nhật |
| Build production | Còn nhắc `IS_DATABASE_OFFLINE=true` | Dockerfile dùng placeholder env build-time và runtime env trong compose | Đã sửa |
| Healthcheck | Có nhắc `/api/health` | Dockerfile và compose đều có healthcheck | Đã xác nhận |
| CI chính | Mô tả dạng đề xuất | Có `Security and Acceptance Gate` | Đã cập nhật |
| CI Docker | Chưa mô tả đủ | Có `Docker Acceptance Gate` | Đã cập nhật |
| Smoke test | Chưa bám đúng script | Có `production-smoke-test.js` và `smoke-deploy.sh` | Đã cập nhật |
| Backup/restore | Mô tả cron chung | Chưa thấy script chuẩn hóa tương ứng trong repo | Ghi là điểm cần bổ sung |

## 2. Cấu trúc triển khai hiện tại

Các file chính:

```text
Dockerfile
docker-compose.yml
.github/workflows/security-and-acceptance.yml
.github/workflows/docker-acceptance.yml
scripts/production-smoke-test.js
scripts/smoke-deploy.sh
```

Các profile Docker Compose:

```text
core  -> postgres, mongo, redis, app, nginx
tools -> GIS/BIM import tooling
ai    -> AI-related services
obs   -> observability services
```

Lệnh kiểm tra cấu hình compose:

```bash
docker compose --profile core --profile tools config
```

Lệnh chạy core stack:

```bash
docker compose --profile core up -d
```

## 3. Biến môi trường vận hành

Service `app` trong `docker-compose.yml` đang dùng các biến chính:

```text
NEXT_PUBLIC_SETUP_COMPLETE
SESSION_SECRET
AUTH_DATABASE_URL
AI_DATABASE_URL
METRO_DATABASE_URL
OPS_DATABASE_URL
DATABASE_URL
MONGODB_URI
REDIS_URL
```

Không dùng `IS_DATABASE_OFFLINE=true` làm hướng dẫn build production.

## 4. Healthcheck và smoke test

Endpoint kiểm tra sức khỏe hệ thống:

```text
/api/health
```

Các lớp kiểm tra hiện có:

```text
Dockerfile HEALTHCHECK
app healthcheck trong docker-compose.yml
scripts/production-smoke-test.js
scripts/smoke-deploy.sh
Docker Acceptance Gate
```

`production-smoke-test.js` kiểm tra `/api/health` và một số route production chính. `smoke-deploy.sh` kiểm tra container, database/cache, app health và log triển khai theo profile.

## 5. CI/CD hiện tại

### 5.1. Security and Acceptance Gate

Workflow:

```text
.github/workflows/security-and-acceptance.yml
```

Nội dung chính:

```text
Install dependencies
Design rules file-size boundary
Changed-file design boundary gate
Vibe Code rules audit
Module import boundary audit
Module registry audit
Developer Guide traceability audit
Prisma validate/generate
GIS/BIM import dry-run
Typecheck
Lint
Build
Production smoke test
Dependency audit
CodeQL
```

### 5.2. Docker Acceptance Gate

Workflow:

```text
.github/workflows/docker-acceptance.yml
```

Nội dung chính:

```text
Validate Docker Compose configuration
Build application image
Run application container
Docker runtime health smoke test
Cleanup container
```

## 6. Quy trình triển khai khuyến nghị

Trước khi triển khai:

```bash
npm ci --include=dev --ignore-scripts
npm run db:validate:all
npm run db:generate:all
npm run typecheck
npm run lint
npm run build
```

Kiểm tra Docker:

```bash
docker compose --profile core --profile tools config
docker compose --profile core build app
```

Khởi động core stack:

```bash
docker compose --profile core up -d
```

Kiểm tra sau triển khai:

```bash
curl -f http://localhost:3000/api/health
bash scripts/smoke-deploy.sh core
```

## 7. Điểm mạnh hiện tại

- Đã có Dockerfile nhiều stage.
- Đã có docker-compose phân profile.
- App phụ thuộc vào database/cache theo healthcheck.
- Có healthcheck trong Dockerfile và compose.
- Có Security and Acceptance Gate.
- Có Docker Acceptance Gate.
- Có smoke test ở mức app route và Docker runtime.

## 8. Điểm yếu còn lại

- Chưa có script backup/restore production chuẩn hóa trong repo.
- Chưa có tài liệu DR chính thức tách riêng khỏi tài liệu triển khai.
- Chưa có audit script riêng để kiểm tra Tài liệu 4 không lệch với Docker/CI.
- README còn có một số mô tả cần rà soát để tránh mô tả quá mức về MFE, offline và production readiness.

## 9. Lộ trình cải thiện

- Bổ sung runbook backup/restore riêng khi có quy trình chính thức.
- Bổ sung audit cho Deployment/Ops khi công cụ cho phép ghi script ổn định.
- Rà soát README để đồng bộ với Tài liệu 1, 2, 3 và 4.
- Bổ sung cấu hình reverse proxy/SSL chi tiết khi có mô hình mạng chính thức.
