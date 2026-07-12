# HƯỚNG DẪN BUILD TRÊN LINUX VÀ WINDOWS

**Mã tài liệu:** HURC-CDHS-TECH-BUILD-01  
**Phạm vi:** Repository `HURC-CDHS`, nhánh `main`  
**Đối tượng:** Lập trình viên, kỹ sư hệ thống, DevOps và người kiểm thử  
**Trạng thái:** Hướng dẫn kỹ thuật áp dụng cho build cục bộ và Docker

---

## 1. Mục đích

Tài liệu này hướng dẫn chi tiết cách:

1. Kiểm tra và build mã nguồn trên Linux.
2. Kiểm tra và build mã nguồn trên Windows bằng PowerShell.
3. Chạy development với các dịch vụ dữ liệu cục bộ.
4. Build và chạy bằng Docker Compose.
5. Thực hiện các bước kiểm tra tương đương pipeline CI.
6. Xử lý các lỗi thường gặp theo từng hệ điều hành.

Tài liệu phân biệt rõ ba trường hợp:

| Trường hợp | Có cần database đang chạy? | Kết quả |
|---|---:|---|
| Kiểm tra source build | Không bắt buộc | Typecheck, lint và tạo `.next` |
| Chạy development | Có hoặc dùng chế độ dữ liệu dự phòng | Chạy `next dev` tại cổng 3000 |
| Docker gần production | Có, do Compose quản lý | Chạy app cùng PostgreSQL, MongoDB, Redis và Nginx |

---

## 2. Phiên bản và công cụ yêu cầu

### 2.1. Yêu cầu bắt buộc

| Thành phần | Yêu cầu |
|---|---|
| Git | Phiên bản còn được hỗ trợ |
| Node.js | Từ 20 trở lên; khuyến nghị Node.js 20 LTS |
| npm | Từ 10 đến nhỏ hơn 12 |
| RAM | Tối thiểu 8 GB; khuyến nghị 16 GB khi build Docker |
| Dung lượng trống | Tối thiểu 10 GB; nên có 20 GB nếu dùng Docker và AI service |

Kiểm tra:

```bash
node --version
npm --version
git --version
```

Node phải trả về phiên bản `v20.x` hoặc cao hơn phù hợp với `package.json`. npm phải thuộc dải `10.x` hoặc `11.x`.

### 2.2. Công cụ bổ sung

| Thành phần | Khi nào cần |
|---|---|
| Python 3 | Chạy các chức năng LSTM, RAG Python và AI Lab |
| Docker Engine / Docker Desktop | Chạy stack bằng Compose |
| PostgreSQL 15 | Chạy native không dùng container PostgreSQL |
| MongoDB 7 | Chạy native không dùng container MongoDB |
| Redis 7 | Chạy native không dùng container Redis |
| OpenSSL | Tạo secret trên Linux; có thể dùng Node thay thế |

Prisma CLI và `@prisma/client` của dự án được khóa ở phiên bản `5.22.0`. Không tự ý nâng riêng một trong hai package.

---

## 3. Lựa chọn phương án build

### Phương án A — Source build không cần database

Dùng khi cần xác nhận mã nguồn có thể typecheck, lint và build. `build-env-guard.ts` sẽ tạo giá trị placeholder nếu các biến build bắt buộc chưa tồn tại.

### Phương án B — App chạy native, database/cache chạy cục bộ

Dùng khi lập trình và debug trực tiếp bằng Node.js. Các URL database phải dùng `127.0.0.1` hoặc `localhost`, không dùng hostname Docker như `postgres`, `mongo`, `redis`.

### Phương án C — Docker Compose

Đây là phương án gần môi trường triển khai nhất. App và các dịch vụ giao tiếp bằng hostname nội bộ Compose như `postgres`, `mongo`, `redis`.

### Khuyến nghị theo hệ điều hành

| Hệ điều hành | Khuyến nghị |
|---|---|
| Linux | Native build hoặc Docker Compose đều phù hợp |
| Windows 11 | Docker Desktop với WSL2; dùng PowerShell cho build source |
| Windows Server | Ưu tiên WSL2 hoặc Linux VM nếu Docker Linux container không được hỗ trợ đầy đủ |
| CI/CD | Linux runner, lockfile và `npm ci` |

---

## 4. Chuẩn bị repository

### 4.1. Linux — Bash

```bash
git clone <REPOSITORY_URL>
cd Hurc-cdhs
git switch main
git pull --ff-only
```

### 4.2. Windows — PowerShell

```powershell
git clone <REPOSITORY_URL>
Set-Location Hurc-cdhs
git switch main
git pull --ff-only
```

Khuyến nghị bật hỗ trợ đường dẫn dài cho repository trên Windows:

```powershell
git config core.longpaths true
```

Không đặt mã nguồn trong thư mục có đường dẫn quá dài, thư mục đồng bộ OneDrive hoặc thư mục có quyền ghi hạn chế.

---

## 5. Cài dependency đúng cách

### 5.1. Quy tắc lockfile

Tại thời điểm tài liệu này được lập, repository có thể chưa có `package-lock.json` hoàn chỉnh. Áp dụng quy tắc sau:

- Có `package-lock.json`: dùng `npm ci`.
- Chưa có `package-lock.json`: chỉ môi trường phát triển cục bộ được dùng `npm install`.
- CI và production phải tạo, kiểm tra và commit lockfile trước khi chuyển sang `npm ci` bắt buộc.
- Không tự tạo lockfile thủ công.

### 5.2. Linux — Bash

```bash
if [ -f package-lock.json ]; then
  npm ci --include=dev --ignore-scripts
else
  npm install --include=dev --ignore-scripts
fi
```

### 5.3. Windows — PowerShell

```powershell
if (Test-Path package-lock.json) {
    npm ci --include=dev --ignore-scripts
} else {
    npm install --include=dev --ignore-scripts
}
```

`--ignore-scripts` được dùng trong bước cài đặt kiểm soát. Các bước Prisma generate và kiểm tra được gọi rõ ràng ở phần sau.

### 5.4. Kiểm tra Prisma

```bash
npm run db:verify:prisma-version
```

Kết quả phải xác nhận Prisma CLI và Prisma Client cùng phiên bản `5.22.0`.

---

## 6. Cấu hình biến môi trường

### 6.1. Tạo file `.env`

Linux:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Không commit file `.env` có secret thật lên Git.

### 6.2. Tạo `SESSION_SECRET`

Lệnh sau dùng được trên cả Linux và Windows khi Node.js đã cài:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Sao chép kết quả vào:

```text
SESSION_SECRET=<GIÁ_TRỊ_NGẪU_NHIÊN>
```

### 6.3. Biến bắt buộc cho development

`npm run dev` kiểm tra ít nhất các biến:

```text
AUTH_DATABASE_URL
AI_DATABASE_URL
METRO_DATABASE_URL
OPS_DATABASE_URL
SESSION_SECRET
NEXT_PUBLIC_SETUP_COMPLETE
```

`DATABASE_URL`, `MONGODB_URI` và `REDIS_URL` cần thiết cho các chức năng sử dụng kho dữ liệu tương ứng.

### 6.4. `.env` cho app chạy native

Khi Node.js chạy trực tiếp trên Linux hoặc Windows, dùng địa chỉ máy cục bộ:

```dotenv
NEXT_PUBLIC_SETUP_COMPLETE=true
SESSION_SECRET=replace-with-generated-secret

AUTH_DATABASE_URL=postgresql://postgres:local-password@127.0.0.1:5432/hurc_auth
AI_DATABASE_URL=postgresql://postgres:local-password@127.0.0.1:5432/hurc_ai
METRO_DATABASE_URL=postgresql://postgres:local-password@127.0.0.1:5432/hurc_metro
OPS_DATABASE_URL=postgresql://postgres:local-password@127.0.0.1:5432/hurc_ops
DATABASE_URL=postgresql://postgres:local-password@127.0.0.1:5432/hurc_db

MONGODB_URI=mongodb://admin:local-password@127.0.0.1:27017/hurc?authSource=admin
REDIS_URL=redis://127.0.0.1:6379
```

Nếu mật khẩu có ký tự đặc biệt như `@`, `:`, `/`, `#`, phải URL-encode trước khi đưa vào connection string.

Không giữ `NODE_ENV=production` trong `.env` khi chạy `npm run dev`. Có thể xóa dòng này để Next.js tự xác định môi trường development.

### 6.5. `.env` cho Docker Compose

Khi app chạy trong Compose, giữ hostname nội bộ:

```dotenv
NEXT_PUBLIC_SETUP_COMPLETE=true
SESSION_SECRET=replace-with-generated-secret

DATABASE_USER=postgres
DATABASE_PASSWORD=replace-local-default
DATABASE_NAME=hurc_db
MONGO_USER=admin
MONGO_PASSWORD=replace-local-default

AUTH_DATABASE_URL=postgresql://postgres:replace-local-default@postgres:5432/hurc_auth
AI_DATABASE_URL=postgresql://postgres:replace-local-default@postgres:5432/hurc_ai
METRO_DATABASE_URL=postgresql://postgres:replace-local-default@postgres:5432/hurc_metro
OPS_DATABASE_URL=postgresql://postgres:replace-local-default@postgres:5432/hurc_ops
DATABASE_URL=postgresql://postgres:replace-local-default@postgres:5432/hurc_db

MONGODB_URI=mongodb://admin:replace-local-default@mongo:27017/hurc?authSource=admin
REDIS_URL=redis://redis:6379
```

Không dùng các giá trị mẫu của `.env.example` cho production.

---

## 7. Quy trình source build chung

Các lệnh dưới đây dùng giống nhau trong Bash và PowerShell:

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

Ý nghĩa:

| Lệnh | Mục đích |
|---|---|
| `db:verify:prisma-version` | Kiểm tra Prisma CLI/Client đúng phiên bản |
| `db:validate:all` | Validate toàn bộ Prisma schema |
| `db:generate:all` | Sinh Prisma Client vào `.prisma-runtime` |
| `import:gis-bim:dry-run` | Kiểm tra dữ liệu GIS/BIM không ghi database |
| `typecheck` | Kiểm tra TypeScript |
| `test:ai-governance` | Kiểm tra invariant AI Governance |
| `lint` | ESLint với tối đa 0 cảnh báo |
| `build` | Next.js production build |

`npm run build` có gọi lại Prisma version check và Prisma generate. Việc chạy riêng các bước ở trên giúp xác định chính xác bước bị lỗi.

### 7.1. Tiêu chí build thành công

Phải có đầy đủ:

- Không có TypeScript error.
- Không có ESLint error hoặc warning.
- Tất cả Prisma schema validate thành công.
- Thư mục `.prisma-runtime/` được tạo.
- Thư mục `.next/` được tạo.
- Next.js build kết thúc với exit code 0.

### 7.2. Chạy production build cục bộ

Terminal 1:

```bash
npm run start
```

Terminal 2 trên Linux:

```bash
curl -fsS http://127.0.0.1:3000/api/health
```

Terminal 2 trên Windows PowerShell:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/api/health
```

Có thể dùng `curl.exe` trên Windows để tránh alias `curl` của PowerShell:

```powershell
curl.exe -f http://127.0.0.1:3000/api/health
```

---

## 8. Build chi tiết trên Linux

Phần này minh họa cho Ubuntu/Debian. Với RHEL, Rocky Linux hoặc AlmaLinux, dùng package manager tương ứng.

### 8.1. Cài công cụ nền

```bash
sudo apt update
sudo apt install -y git curl ca-certificates python3 python3-pip build-essential openssl
```

Cài Node.js 20 LTS bằng công cụ quản lý phiên bản hoặc gói được tổ chức phê duyệt, sau đó xác nhận:

```bash
node --version
npm --version
```

### 8.2. Build không cần database

```bash
git switch main
git pull --ff-only

if [ -f package-lock.json ]; then
  npm ci --include=dev --ignore-scripts
else
  npm install --include=dev --ignore-scripts
fi

npm run db:verify:prisma-version
npm run db:validate:all
npm run db:generate:all
npm run typecheck
npm run test:ai-governance
npm run lint
npm run build
```

Nếu `.env` chưa tồn tại, build guard có thể tạo placeholder phục vụ build. Placeholder không được dùng để chạy production.

### 8.3. Chạy development

```bash
cp .env.example .env
# Chỉnh .env theo mục 6.4
npm run db:generate:all
npm run dev
```

Truy cập:

```text
http://127.0.0.1:3000
```

### 8.4. Quyền ghi thư mục

Nếu gặp `EACCES` tại `.next`, `.prisma-runtime`, `data` hoặc `logs`:

```bash
sudo chown -R "$USER":"$USER" .next .prisma-runtime data logs 2>/dev/null || true
```

Không chạy `npm install` hoặc `npm run build` bằng `sudo`, vì có thể làm sai quyền sở hữu toàn bộ repository.

### 8.5. Tăng bộ nhớ khi build

```bash
export NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

Máy có nhiều RAM có thể tăng lên `6144` hoặc `8192`.

---

## 9. Build chi tiết trên Windows

### 9.1. Công cụ khuyến nghị

- Windows 11 64-bit.
- PowerShell 7 hoặc Windows PowerShell 5.1.
- Git for Windows.
- Node.js 20 LTS.
- npm 10 hoặc 11.
- Python 3 nếu dùng AI Lab.
- Docker Desktop bật WSL2 backend nếu chạy container.
- Visual Studio Build Tools chỉ cần khi dependency native không có binary dựng sẵn.

Kiểm tra:

```powershell
node --version
npm --version
git --version
python --version
```

Nếu Windows dùng lệnh `py` thay vì `python`, các chức năng Python của ứng dụng có thể không tìm thấy executable. Cần bảo đảm `python.exe` nằm trong `PATH`.

### 9.2. Build không cần database

```powershell
git switch main
git pull --ff-only

if (Test-Path package-lock.json) {
    npm ci --include=dev --ignore-scripts
} else {
    npm install --include=dev --ignore-scripts
}

npm run db:verify:prisma-version
npm run db:validate:all
npm run db:generate:all
npm run typecheck
npm run test:ai-governance
npm run lint
npm run build
```

### 9.3. Chạy development

```powershell
Copy-Item .env.example .env
# Chỉnh .env theo mục 6.4
npm run db:generate:all
npm run dev
```

Truy cập:

```text
http://127.0.0.1:3000
```

### 9.4. Xử lý đường dẫn dài

```powershell
git config core.longpaths true
```

Nếu vẫn lỗi, chuyển repository về đường dẫn ngắn, ví dụ:

```text
C:\src\Hurc-cdhs
```

### 9.5. Xử lý tệp đang bị khóa

Trước khi xóa `.next` hoặc `node_modules`:

1. Dừng `npm run dev`.
2. Đóng terminal hoặc IDE đang giữ file.
3. Dừng tiến trình Node còn sót:

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### 9.6. Tăng bộ nhớ khi build

```powershell
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

Biến chỉ áp dụng trong phiên PowerShell hiện tại.

---

## 10. Chạy dịch vụ dữ liệu cho app native

### 10.1. PostgreSQL

Cần các database:

```text
hurc_db
hurc_auth
hurc_ai
hurc_metro
hurc_ops
```

`init-db.sh` của Compose tạo bốn database chuyên biệt ngoài database chính trong lần khởi tạo volume PostgreSQL đầu tiên.

Lưu ý: Prisma generate chỉ sinh client, không tạo bảng trong database. Migration phải theo quy trình migration được phê duyệt. Không chạy `prisma db push` vào database dùng chung hoặc production khi chưa có backup và phê duyệt.

### 10.2. Chạy database/cache bằng Docker nhưng app chạy native

Redis trong `docker-compose.yml` không xuất cổng ra host. Tạo file cục bộ `docker-compose.local.yml` và không commit nếu chỉ dùng riêng trên máy:

```yaml
services:
  redis:
    ports:
      - "6379:6379"
```

Khởi động các dịch vụ dữ liệu:

Linux:

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml --profile core up -d postgres mongo redis
```

Windows PowerShell:

```powershell
docker compose -f docker-compose.yml -f docker-compose.local.yml --profile core up -d postgres mongo redis
```

Khi app chạy native, `.env` phải dùng `127.0.0.1`, không dùng tên service Docker.

Kiểm tra:

```bash
docker compose ps
```

### 10.3. Volume đã tồn tại nhưng thiếu database

`init-db.sh` chỉ chạy khi PostgreSQL data volume được khởi tạo lần đầu. Nếu volume cũ đã tồn tại, việc sửa script không tự chạy lại.

Chỉ ở môi trường local không có dữ liệu cần giữ mới được xóa volume:

```bash
docker compose --profile core down
rm -rf data/postgres
```

Windows PowerShell:

```powershell
docker compose --profile core down
Remove-Item -Recurse -Force data\postgres
```

Thao tác này xóa toàn bộ dữ liệu PostgreSQL local. Không áp dụng cho staging hoặc production.

---

## 11. Build và chạy bằng Docker

### 11.1. Kiểm tra Docker

```bash
docker --version
docker compose version
```

### 11.2. Kiểm tra cấu hình Compose

Linux và Windows:

```bash
docker compose --profile core --profile tools config
```

Lệnh phải kết thúc với exit code 0 và không báo thiếu biến bắt buộc.

### 11.3. Build image app

```bash
docker compose --profile core build app
```

Dockerfile thực hiện:

1. Cài dependency.
2. Kiểm tra Prisma version.
3. Validate Prisma schema.
4. GIS/BIM dry-run.
5. Next.js production build.
6. Compile init script; lỗi bước này làm build thất bại.

### 11.4. Khởi động core stack

```bash
docker compose --profile core up -d
```

Theo dõi:

```bash
docker compose ps
docker compose logs -f app
```

### 11.5. Healthcheck

Linux:

```bash
curl -fsS http://127.0.0.1:3000/api/health
```

Windows PowerShell:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/api/health
```

Nginx dùng cổng 80 và 443. Nếu chưa có chứng thư hoặc cấu hình SSL phù hợp, kiểm tra app trực tiếp tại cổng 3000 trước.

### 11.6. Smoke test

Linux hoặc WSL/Git Bash:

```bash
bash scripts/smoke-deploy.sh core
```

PowerShell không chạy trực tiếp script Bash. Trên Windows chọn một trong hai cách:

```powershell
wsl bash scripts/smoke-deploy.sh core
```

hoặc chạy kiểm tra tương đương:

```powershell
docker compose ps
Invoke-RestMethod http://127.0.0.1:3000/api/health
docker compose logs --tail 200 app
```

### 11.7. Dừng stack

```bash
docker compose --profile core down
```

Không thêm `-v` nếu cần giữ dữ liệu local.

---

## 12. Quy trình kiểm tra tương đương CI

Chạy theo đúng thứ tự:

```bash
node scripts/check-changed-file-size-boundaries.js
node scripts/audit-module-boundaries.js
node scripts/audit-module-registry.js
npm run db:verify:prisma-version
npm run db:validate:all
npm run db:generate:all
npm run import:gis-bim:dry-run
npm run typecheck
npm run test:ai-governance
npm run lint
npm run build
```

Tên một số audit script có thể thay đổi theo pipeline. Khi tài liệu và workflow khác nhau, `.github/workflows/security-and-acceptance.yml` là nguồn đối chiếu cuối cùng.

Không kết luận build đạt chỉ vì `npm run build` thành công; tối thiểu phải kiểm tra typecheck, lint, governance test và healthcheck.

---

## 13. Clean build

### 13.1. Linux

```bash
rm -rf .next .prisma-runtime
npm run db:generate:all
npm run build
```

Clean toàn bộ dependency:

```bash
rm -rf node_modules .next .prisma-runtime
if [ -f package-lock.json ]; then
  npm ci --include=dev --ignore-scripts
else
  npm install --include=dev --ignore-scripts
fi
npm run db:generate:all
npm run build
```

### 13.2. Windows PowerShell

```powershell
Remove-Item -Recurse -Force .next,.prisma-runtime -ErrorAction SilentlyContinue
npm run db:generate:all
npm run build
```

Clean toàn bộ dependency:

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -Recurse -Force node_modules,.next,.prisma-runtime -ErrorAction SilentlyContinue

if (Test-Path package-lock.json) {
    npm ci --include=dev --ignore-scripts
} else {
    npm install --include=dev --ignore-scripts
}

npm run db:generate:all
npm run build
```

Không xóa `data/`, `backups/` hoặc database volume trong thao tác clean build thông thường.

---

## 14. Xử lý lỗi thường gặp

### 14.1. Sai phiên bản Node/npm

Dấu hiệu:

```text
Unsupported Node.js version
npm version outside supported range
```

Xử lý:

- Chuyển sang Node.js 20 LTS.
- Xác nhận npm 10 hoặc 11.
- Xóa `node_modules` và cài lại dependency.

### 14.2. Prisma CLI và Client lệch phiên bản

Dấu hiệu:

```text
Prisma version mismatch
```

Xử lý:

```bash
npm run db:verify:prisma-version
npm install --save-dev prisma@5.22.0 @prisma/client@5.22.0
npm run db:generate:all
```

Không dùng `npx prisma@latest`.

### 14.3. Thiếu `.prisma-runtime`

```bash
npm run db:generate:all
```

Sau đó xác nhận tồn tại:

```text
.prisma-runtime/auth
.prisma-runtime/ai
.prisma-runtime/metro
.prisma-runtime/ops
```

### 14.4. `npm run dev` báo thiếu `.env`

Linux:

```bash
cp .env.example .env
```

Windows:

```powershell
Copy-Item .env.example .env
```

Điền đủ các biến tại mục 6. Không dùng secret mẫu trong môi trường thật.

### 14.5. `P1001` hoặc không kết nối PostgreSQL

Kiểm tra:

- App native phải dùng `127.0.0.1`.
- App trong Docker phải dùng `postgres`.
- Cổng 5432 không bị chương trình khác chiếm.
- PostgreSQL container đã healthy.

Linux:

```bash
ss -ltnp | grep 5432 || true
docker compose ps postgres
```

Windows:

```powershell
netstat -ano | Select-String ':5432'
docker compose ps postgres
```

### 14.6. MongoDB authentication failed

Kiểm tra `authSource=admin`, username, password và hostname phù hợp với native/Docker.

### 14.7. Redis connection refused

Compose Redis mặc định chỉ nằm trong mạng Docker. App chạy native phải dùng Redis native hoặc file override xuất cổng 6379 như mục 10.2.

### 14.8. Docker báo port already allocated

Linux:

```bash
ss -ltnp | grep -E ':80|:443|:3000|:5432|:27017'
```

Windows:

```powershell
netstat -ano | Select-String ':80|:443|:3000|:5432|:27017'
```

Dừng dịch vụ chiếm cổng hoặc đổi mapping trong file override local. Không sửa cứng `docker-compose.yml` chỉ để giải quyết xung đột riêng của một máy.

### 14.9. Windows lỗi native module hoặc `node-gyp`

- Cài Python 3 và đưa vào `PATH`.
- Cài Visual Studio Build Tools với workload C++ nếu package cần biên dịch.
- Dùng Node 20 LTS thay vì phiên bản quá mới.
- Xóa `node_modules` và cài lại.

### 14.10. Windows lỗi CRLF với shell script

Ưu tiên chạy script Bash trong WSL2. Có thể cấu hình repository:

```powershell
git config core.autocrlf input
```

Không chuyển các file `.sh` sang CRLF.

### 14.11. Build hết bộ nhớ

Linux:

```bash
export NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

Windows:

```powershell
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### 14.12. `npm ci` báo thiếu lockfile

Đây là hành vi đúng. Trên máy phát triển có kiểm soát:

```bash
npm install --package-lock-only
npm install --include=dev --ignore-scripts
npm run typecheck
npm run lint
npm run build
```

Chỉ commit `package-lock.json` sau khi các bước kiểm tra đạt và diff dependency đã được rà soát. Sau đó CI/Docker mới chuyển sang `npm ci` bắt buộc.

---

## 15. Checklist nghiệm thu build

| Nội dung | PASS/FAIL | Bằng chứng |
|---|---|---|
| Node/npm đúng phiên bản |  | `node -v`, `npm -v` |
| Dependency cài thành công |  | Log npm |
| Prisma version đúng 5.22.0 |  | `db:verify:prisma-version` |
| Tất cả schema hợp lệ |  | `db:validate:all` |
| Prisma Client đã generate |  | `.prisma-runtime/` |
| Typecheck đạt |  | `npm run typecheck` |
| AI Governance test đạt |  | `npm run test:ai-governance` |
| Lint đạt, 0 warning |  | `npm run lint` |
| Next.js build đạt |  | `npm run build` |
| Docker image build đạt |  | `docker compose build app` |
| Healthcheck đạt |  | `/api/health` |
| Smoke test đạt |  | Log smoke test |
| Không dùng secret mẫu |  | Rà `.env`/secret store |

---

## 16. Lưu ý an toàn và production

1. Không đưa `.env`, API key, token hoặc mật khẩu thật vào Git.
2. Không sử dụng mật khẩu mặc định trong `.env.example` cho staging/production.
3. Không tự chạy migration phá hủy dữ liệu.
4. Không xóa Docker volume production để sửa lỗi khởi tạo.
5. Không dùng `npm install` trong CI/deploy sau khi lockfile đã được thiết lập.
6. Không kết luận production-ready khi GitHub Actions, Docker Acceptance và smoke test chưa xanh.
7. Build thành công không thay thế kiểm thử nghiệp vụ, bảo mật, backup/restore và rollback.

---

## 17. Tệp đối chiếu

```text
package.json
.env.example
Dockerfile
docker-compose.yml
init-db.sh
scripts/guard-install.js
src/scripts/build-env-guard.ts
src/scripts/local-preflight.ts
.github/workflows/security-and-acceptance.yml
.github/workflows/docker-acceptance.yml
```

Khi các tệp trên thay đổi, phải rà soát và cập nhật lại tài liệu này.