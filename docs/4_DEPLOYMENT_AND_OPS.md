# TÀI LIỆU 4: VẬN HÀNH VÀ TRIỂN KHAI

## 0. Mục tiêu

Tài liệu này đối chiếu nội dung triển khai, vận hành và kiểm thử với phần mềm hiện tại trên nhánh `main`.

Hướng dẫn build chi tiết theo hệ điều hành được tách tại:

```text
docs/technical/BUILD_WINDOWS_LINUX_GUIDE.md
```

Tài liệu build đa nền tảng là nguồn hướng dẫn chính cho lệnh Bash, PowerShell, cấu hình `.env`, Prisma, Docker, smoke test và xử lý lỗi trên Linux/Windows. Tài liệu này tập trung vào cấu trúc triển khai và vận hành.

## 1. Đối chiếu giữa tài liệu và phần mềm

| Nội dung | Phần mềm hiện tại | Trạng thái tài liệu |
|---|---|---|
| Nhánh áp dụng | `main` | Đã cập nhật |
| Docker Compose | Có `postgres`, `mongo`, `redis`, `app`, `nginx` và các profile mở rộng | Đã cập nhật |
| Profile triển khai | `core`, `tools`, `ai`, `obs` | Đã cập nhật |
| Build production | Dockerfile dùng placeholder build-time và runtime env trong Compose | Đã cập nhật |
| Build Linux/Windows | Có tài liệu riêng theo Bash và PowerShell | Đã bổ sung |
| Healthcheck | Dockerfile và Compose đều kiểm tra `/api/health` | Đã xác nhận |
| CI chính | Security and Acceptance Gate | Đã cập nhật |
| CI Docker | Docker Acceptance Gate | Đã cập nhật |
| Smoke test | `production-smoke-test.js` và `smoke-deploy.sh` | Đã cập nhật |
| Backup/restore | Chưa có runbook production hoàn chỉnh | Còn tồn tại |
| Lockfile | Chưa được xem là hoàn chỉnh cho đến khi `package-lock.json` được tạo, kiểm tra và commit | Cần hoàn thiện |

## 2. Cấu trúc triển khai

Các file chính:

```text
Dockerfile
docker-compose.yml
.env.example
init-db.sh
.github/workflows/security-and-acceptance.yml
.github/workflows/docker-acceptance.yml
scripts/production-smoke-test.js
scripts/smoke-deploy.sh
docs/technical/BUILD_WINDOWS_LINUX_GUIDE.md
```

Các profile Docker Compose:

```text
core  -> postgres, mongo, redis, app, nginx
tools -> GIS/BIM import tooling
ai    -> AI-related services
obs   -> observability services
```

Kiểm tra cấu hình:

```bash
docker compose --profile core --profile tools config
```

Chạy core stack:

```bash
docker compose --profile core up -d
```

## 3. Phân biệt build source và runtime

### 3.1. Source build

Source build dùng để kiểm tra Prisma, TypeScript, ESLint và Next.js. Database không bắt buộc phải hoạt động vì build guard có thể tạo placeholder cho biến build-time.

Source build thành công không có nghĩa runtime đã sẵn sàng.

### 3.2. Native runtime

Khi app chạy trực tiếp bằng Node.js trên Linux/Windows:

- PostgreSQL, MongoDB và Redis phải chạy riêng hoặc dùng chế độ dự phòng phù hợp.
- Connection string dùng `127.0.0.1` hoặc `localhost`.
- Redis container phải xuất cổng 6379 nếu app chạy ngoài mạng Docker.

### 3.3. Docker runtime

Khi app chạy trong Compose:

- Dùng hostname `postgres`, `mongo`, `redis`.
- Không dùng `localhost` để kết nối từ container app sang container dữ liệu.
- Compose quản lý thứ tự khởi động bằng healthcheck.

Chi tiết theo hệ điều hành xem `BUILD_WINDOWS_LINUX_GUIDE.md`.

## 4. Biến môi trường vận hành

Các biến chính:

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

Nguyên tắc:

1. Không dùng `IS_DATABASE_OFFLINE=true` làm hướng dẫn build production.
2. Không commit `.env` chứa secret thật.
3. Không dùng mật khẩu mẫu của `.env.example` cho staging/production.
4. Secret production phải được cấp qua secret store của nền tảng triển khai.
5. Mật khẩu có ký tự đặc biệt trong URL phải được URL-encode.

## 5. Dependency và lockfile

Áp dụng quy tắc:

- Có `package-lock.json`: dùng `npm ci --include=dev --ignore-scripts`.
- Chưa có lockfile: chỉ môi trường phát triển cục bộ được dùng `npm install --include=dev --ignore-scripts`.
- CI/deploy phải chuyển sang `npm ci` sau khi lockfile được tạo và kiểm chứng.
- Không tạo lockfile thủ công.

Linux:

```bash
if [ -f package-lock.json ]; then
  npm ci --include=dev --ignore-scripts
else
  npm install --include=dev --ignore-scripts
fi
```

Windows PowerShell:

```powershell
if (Test-Path package-lock.json) {
    npm ci --include=dev --ignore-scripts
} else {
    npm install --include=dev --ignore-scripts
}
```

## 6. Quy trình kiểm tra trước triển khai

```bash
npm run db:verify:prisma-version
npm run db:validate:all
npm run db:generate:all
npm run import:gis-bim:dry-run
npm run typecheck
npm run test:ai-governance
npm run lint
npm run build
```

Tiêu chí tối thiểu:

- Prisma CLI và Client đúng phiên bản `5.22.0`.
- Không có TypeScript error.
- ESLint không có error hoặc warning.
- AI Governance invariant đạt.
- `.prisma-runtime/` được tạo.
- `.next/` được tạo.
- Build kết thúc với exit code 0.

## 7. Build và khởi động Docker

Kiểm tra cấu hình:

```bash
docker compose --profile core --profile tools config
```

Build app:

```bash
docker compose --profile core build app
```

Khởi động:

```bash
docker compose --profile core up -d
```

Theo dõi:

```bash
docker compose ps
docker compose logs -f app
```

Dockerfile phải fail khi bước compile init script thất bại; không được che lỗi bằng `|| true`.

## 8. Healthcheck và smoke test

Endpoint:

```text
/api/health
```

Linux:

```bash
curl -fsS http://127.0.0.1:3000/api/health
bash scripts/smoke-deploy.sh core
```

Windows PowerShell:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/api/health
wsl bash scripts/smoke-deploy.sh core
```

Nếu không dùng WSL, thực hiện kiểm tra tương đương:

```powershell
docker compose ps
Invoke-RestMethod http://127.0.0.1:3000/api/health
docker compose logs --tail 200 app
```

Các lớp kiểm tra hiện có:

```text
Dockerfile HEALTHCHECK
app healthcheck trong docker-compose.yml
scripts/production-smoke-test.js
scripts/smoke-deploy.sh
Docker Acceptance Gate
```

## 9. CI/CD

### 9.1. Security and Acceptance Gate

Workflow:

```text
.github/workflows/security-and-acceptance.yml
```

Nội dung chính:

```text
Install dependencies
Prisma dependency contract
Design rules file-size boundary
Repository/changed-file boundary gate
Vibe Code rules audit
Module import boundary audit
Module registry audit
Documentation evidence audits
Static type check
AI governance invariant checks
Lint
Production build
Production route smoke test
Dependency audit
CodeQL
```

Workflow hiện chạy trên Ubuntu và Node.js 20. Khi lockfile được commit, bước cài dependency phải được chuyển từ `npm install` sang `npm ci`.

### 9.2. Docker Acceptance Gate

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

## 10. PostgreSQL initialization

`init-db.sh` tạo các database:

```text
hurc_auth
hurc_ops
hurc_ai
hurc_metro
```

Database chính lấy từ `POSTGRES_DB`, mặc định local là `hurc_db`.

Script init chỉ chạy khi thư mục dữ liệu PostgreSQL được khởi tạo lần đầu. Không xóa volume production để chạy lại init script.

Prisma generate không tạo bảng. Migration phải dùng quy trình đã được phê duyệt; không chạy `prisma db push` lên database dùng chung hoặc production khi chưa có backup và phê duyệt.

## 11. Lưu ý Windows

1. Khuyến nghị Docker Desktop sử dụng WSL2 backend.
2. PowerShell dùng `Copy-Item` thay cho `cp`.
3. PowerShell dùng `Invoke-RestMethod` hoặc `curl.exe` thay vì dựa vào alias `curl`.
4. Script `.sh` nên chạy trong WSL2 hoặc Git Bash.
5. Bật `git config core.longpaths true` nếu repository gặp giới hạn đường dẫn.
6. Không đặt repository trong thư mục OneDrive khi thường xuyên build Docker hoặc native dependency.
7. Bảo đảm `python.exe` có trong `PATH` nếu dùng AI Lab.

## 12. Lưu ý Linux

1. Không chạy npm bằng `sudo`.
2. Người dùng build phải có quyền ghi vào `.next`, `.prisma-runtime`, `data`, `logs`.
3. Có thể đặt `NODE_OPTIONS=--max-old-space-size=4096` nếu build thiếu bộ nhớ.
4. Kiểm tra port bằng `ss -ltnp` khi container không khởi động.
5. Không dùng root để chạy app production nếu không có yêu cầu đặc biệt và biện pháp kiểm soát.

## 13. Điểm mạnh hiện tại

- Dockerfile nhiều stage.
- Docker Compose phân profile.
- Có healthcheck cho database/cache/app.
- Có Security and Acceptance Gate.
- Có Docker Acceptance Gate.
- Có smoke test app route và Docker runtime.
- Có hướng dẫn build riêng cho Linux và Windows.
- Init compile trong Docker fail-closed.

## 14. Điểm yếu còn lại

- Chưa có `package-lock.json` hoàn chỉnh được kiểm chứng và commit.
- CI hiện còn dùng `npm install`.
- Chưa có script backup/restore production chuẩn hóa.
- Chưa có runbook DR và rollback đầy đủ.
- Chưa có bằng chứng build xanh cho mọi thay đổi trên cả Windows và Linux.

## 15. Lộ trình cải thiện

1. Tạo và kiểm chứng `package-lock.json` trên máy có npm resolver đầy đủ.
2. Chuyển CI và Docker sang `npm ci` bắt buộc.
3. Bổ sung matrix CI tối thiểu gồm Ubuntu và Windows cho typecheck/lint/build nếu thời gian runner cho phép.
4. Bổ sung runbook backup, restore, rollback và disaster recovery.
5. Lưu bằng chứng build theo phiên bản release.
6. Cập nhật đồng thời tài liệu này và `BUILD_WINDOWS_LINUX_GUIDE.md` khi cấu hình build thay đổi.
