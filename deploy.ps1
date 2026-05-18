# HURC1 CRM Deployment Standard
# -----------------------------
# Chú ý: Script này tự động hóa việc dọn dẹp, sinh schema Prisma, và build sản phẩm.
# Use: .\deploy.ps1

Write-Host "--- Starting Deployment Process for HURC NO.1 CDHS ---" -ForegroundColor Cyan

# 1. Clean Build Caches (Crucial for Windows/Next.js)
Write-Host "--- Cleaning build caches and standalone output ---" -ForegroundColor Yellow
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "artifacts") { Remove-Item -Recurse -Force "artifacts" }

# 1.5. Ensure Dependencies are Installed (Resolves 'next: not found' & missing types)
Write-Host "--- Verifying node_modules and dependencies ---" -ForegroundColor Yellow
if (-not (Test-Path "node_modules") -or 
    -not (Test-Path "node_modules/.bin/next") -or
    -not (Test-Path "node_modules/.bin/tsc")) {
    Write-Host "Critical tools, types, or binaries missing. Restoring dependencies..." -ForegroundColor Cyan
    npm ci --include=dev
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Package installation failed with exit code $LASTEXITCODE. Aborting." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "node_modules and essential build tools (.bin/next, .bin/tsc) are present and verified." -ForegroundColor Gray
}

# 2. Sync Database Schemas (Multi-schema support)
Write-Host "--- Syncing database schemas (AI, Auth, Metro, Ops) ---" -ForegroundColor Yellow
npx prisma generate --schema=prisma/ai/schema.prisma
npx prisma generate --schema=prisma/auth/schema.prisma
npx prisma generate --schema=prisma/metro/schema.prisma
npx prisma generate --schema=prisma/ops/schema.prisma

# 3. Create Optimized Production Build
Write-Host "--- Creating optimized production build ---" -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed. System encountered a fatal error." -ForegroundColor Red
    exit 1
}

Write-Host "--- Deployment build successful! ---" -ForegroundColor Green
Write-Host "--- Standalone package ready in .next/standalone ---" -ForegroundColor Green
Write-Host "--- Run 'node .next/standalone/server.js' to start. ---" -ForegroundColor White
