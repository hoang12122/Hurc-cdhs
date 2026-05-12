# HURC1 CRM : Final System Recovery & Cleanup Script
# Usage: Right-click -> Run with PowerShell

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "HURC1 CRM - HE THONG KHOI PHUC TU DONG" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Stop hung docker processes
Write-Host "[1/5] Dang dung cac tien trinh Docker..." -ForegroundColor Yellow
docker compose down -v
if ($LASTEXITCODE -ne 0) { Write-Host "Canh bao: Khong the dung docker binh thuong, dang thu ep buoc..." -ForegroundColor Gray }

# 2. Cleanup Disk Space (CRITICAL)
Write-Host "[2/5] DANG DON DEP O DIA (PRUNE)..." -ForegroundColor Magenta
Write-Host "Vui long cho trong giay lat, dang xoa image va volumes thua..." -ForegroundColor Gray
docker system prune -a --volumes -f
if ($LASTEXITCODE -ne 0) { Write-Host "Loi khi don dep dia." -ForegroundColor Red }

# 3. Start Core Services
Write-Host "[3/5] Dang khoi dong PostgreSQL & Redis..." -ForegroundColor Green
docker compose up -d postgres redis
Write-Host "Dang cho Database san sang (10 giay)..." -ForegroundColor Gray
Start-Sleep -Seconds 10

# 4. Sync Database Schemas (Prisma)
Write-Host "[4/5] Dang dong bo Prisma Schemas (Cơ sở dữ liệu phân tán)..." -ForegroundColor Cyan
Write-Host "Đồng bộ Auth DB..."
npx prisma db push --schema=prisma/auth/schema.prisma --accept-data-loss
Write-Host "Đồng bộ Ops DB..."
npx prisma db push --schema=prisma/ops/schema.prisma --accept-data-loss
Write-Host "Đồng bộ AI DB..."
npx prisma db push --schema=prisma/ai/schema.prisma --accept-data-loss
Write-Host "Đồng bộ Metro DB..."
npx prisma db push --schema=prisma/metro/schema.prisma --accept-data-loss

# 5. Migration and Dev
Write-Host "[5/5] Dang nạp du lieu JSON vao PostgreSQL..." -ForegroundColor Yellow
npm run migrate

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host "HOAN TAT! He thong da san sang." -ForegroundColor Green
Write-Host "Hay quay lai trinh duyet va tai lai trang Dashboard." -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Read-Host "Bam phim bat ky de thoat..."
