# HURC1 DEPLOYMENT HELPER (PowerShell)
Write-Host "🚀 Starting HURC1 CRM Deployment Monitor..." -ForegroundColor Cyan

# 1. Check Docker status
Write-Host "[1/3] Checking Containers..." -ForegroundColor Yellow
docker compose ps

# 2. Check Database Readiness
Write-Host "[2/3] Verifying Offline DB (db.json)..." -ForegroundColor Yellow
if (Test-Path "./data/offline/db.json") {
    Write-Host "✅ db.json is present." -ForegroundColor Green
} else {
    Write-Host "⚠️ db.json missing! Initializing via Docker..." -ForegroundColor Red
}

# 3. Monitor Logs
Write-Host "[3/3] System Logs (Streaming)..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop monitoring." -ForegroundColor Gray
docker compose logs -f app
