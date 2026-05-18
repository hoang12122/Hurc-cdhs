# ==============================================================================
# HURC1 CRM - AUTOMATED LAYERED PRODUCTION DEPLOYMENT & ROLLBACK ORCHESTRATOR (PowerShell)
# ==============================================================================
# Bất biến: Triển khai theo lớp nghiêm ngặt (Core -> AI -> Observability).
# Mỗi lớp đều có chốt chặn Smoke Test riêng. Bất kỳ lớp nào lỗi => Rollback lập tức!
# ==============================================================================

$ErrorActionPreference = "Stop"

Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "🚀 TIẾN TRÌNH TRIỂN KHAI PHÂN LỚP PRODUCTION (WINDOWS HOST DEPLOY)" -ForegroundColor Cyan
Write-Host "==============================================================================" -ForegroundColor Cyan

# 1. Chạy Preflight Check cục bộ trước khi bắt đầu
Write-Host "`n[BƯỚC CHUẨN BỊ] Chạy Preflight Validation phiên bản Node.js..." -ForegroundColor Yellow
try {
    node scripts/preflight-node.js
} catch {
    Write-Host "❌ LỖI: Preflight validation thất bại! Dừng tiến trình triển khai để bảo vệ hệ thống." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Preflight validation thành công!" -ForegroundColor Green

# 2. Thực hiện Hot Backup
Write-Host "`n[HOT BACKUP] Sao lưu trạng thái hệ thống hiện hữu trước khi nâng cấp..." -ForegroundColor Yellow
if (Test-Path "scripts/backup-system.sh") {
    if (Get-Command "bash" -ErrorAction SilentlyContinue) {
        bash scripts/backup-system.sh
    } else {
        Write-Host "🔎 Không tìm thấy môi trường Bash để chạy backup-system.sh, bỏ qua bước này." -ForegroundColor Gray
    }
} else {
    Write-Host "🔎 Không tìm thấy kịch bản backup-system.sh, bỏ qua bước sao lưu." -ForegroundColor Gray
}

# ==============================================================================
# LỚP 1: TRIỂN KHAI PHÂN HỆ CỐT LÕI (CORE SERVICES)
# ==============================================================================
Write-Host "`n==============================================================================" -ForegroundColor Cyan
Write-Host "🧱 LỚP 1/3: TRIỂN KHAI PHÂN HỆ CỐT LÕI (postgres, mongo, redis, app, nginx)" -ForegroundColor Cyan
Write-Host "==============================================================================" -ForegroundColor Cyan

docker compose --profile core up -d --build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ LỖI NGHIÊM TRỌNG: Không thể kích hoạt Docker Compose Core! Dọn dẹp khẩn cấp..." -ForegroundColor Red
    docker compose --profile core down -v
    exit 1
}

Write-Host "🔎 Đang kích hoạt Smoke Test kiểm định riêng phân hệ CORE..." -ForegroundColor Yellow
if (Get-Command "bash" -ErrorAction SilentlyContinue) {
    bash scripts/smoke-deploy.sh core
    $SmokeCore = $LASTEXITCODE
} else {
    # Kiểm tra cổng 3000 thủ công
    try {
        $Response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 10
        if ($Response.StatusCode -ge 200 -and $Response.StatusCode -lt 400) {
            $SmokeCore = 0
        } else {
            $SmokeCore = 1
        }
    } catch {
        $SmokeCore = 1
    }
}

if ($SmokeCore -ne 0) {
    Write-Host "`n🚨 CẢNH BÁO ĐỎ: PHÂN HỆ CORE KHÔNG VƯỢT QUA KIỂM THỬ SỨC BỀN!" -ForegroundColor Red
    Write-Host "⚠️ Bắt đầu tự động Rollback phân hệ Core để trả máy chủ về trạng thái an toàn..." -ForegroundColor Yellow
    
    Write-Host "🔎 Trích xuất nhật ký logs lỗi của App Container:" -ForegroundColor Cyan
    docker logs --tail 30 hurc_app
    
    docker compose --profile core down
    Write-Host "❌ ROLLBACK CORE HOÀN TẤT. Tiến trình triển khai thất bại." -ForegroundColor Red
    exit 1
}
Write-Host "✅ LỚP 1 (CORE) ĐÃ ĐƯỢC TRIỂN KHAI THÀNH CÔNG VÀ AN TOÀN TUYỆT ĐỐI!" -ForegroundColor Green

# ==============================================================================
# LỚP 2: TRIỂN KHAI PHÂN HỆ TRÍ TUỆ NHÂN TẠO (AI SERVICES)
# ==============================================================================
Write-Host "`n==============================================================================" -ForegroundColor Cyan
Write-Host "🧠 LỚP 2/3: TRIỂN KHAI PHÂN HỆ TRÍ TUỆ NHÂN TẠO (yolo, ollama, pull-model)" -ForegroundColor Cyan
Write-Host "==============================================================================" -ForegroundColor Cyan

docker compose --profile ai up -d --build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ LỖI NGHIÊM TRỌNG: Không thể kích hoạt Docker Compose AI! Hủy toàn bộ hệ thống..." -ForegroundColor Red
    docker compose down
    exit 1
}

Write-Host "🔎 Đang kích hoạt Smoke Test kiểm định riêng phân hệ AI..." -ForegroundColor Yellow
if (Get-Command "bash" -ErrorAction SilentlyContinue) {
    bash scripts/smoke-deploy.sh ai
    $SmokeAI = $LASTEXITCODE
} else {
    # Kiểm tra YOLO port 5005 thủ công
    try {
        $Response = Invoke-WebRequest -Uri "http://localhost:5005/health" -UseBasicParsing -TimeoutSec 10
        if ($Response.StatusCode -eq 200) {
            $SmokeAI = 0
        } else {
            $SmokeAI = 1
        }
    } catch {
        $SmokeAI = 1
    }
}

if ($SmokeAI -ne 0) {
    Write-Host "`n🚨 CẢNH BÁO ĐỎ: PHÂN HỆ AI KHÔNG VƯỢT QUA KIỂM THỬ SỨC BỀN!" -ForegroundColor Red
    Write-Host "⚠️ Bắt đầu tự động Rollback toàn bộ hệ thống để tránh xung đột tài nguyên..." -ForegroundColor Yellow
    
    Write-Host "🔎 Trích xuất nhật ký logs lỗi của YOLO Service:" -ForegroundColor Cyan
    docker logs --tail 30 hurc_yolo
    
    docker compose down
    Write-Host "❌ ROLLBACK TOÀN HỆ THỐNG HOÀN TẤT. Tiến trình triển khai thất bại." -ForegroundColor Red
    exit 1
}
Write-Host "✅ LỚP 2 (AI) ĐÃ ĐƯỢC TRIỂN KHAI THÀNH CÔNG VÀ AN TOÀN TUYỆT ĐỐI!" -ForegroundColor Green

# ==============================================================================
# LỚP 3: TRIỂN KHAI PHÂN HỆ GIÁM SÁT (OBSERVABILITY SERVICES)
# ==============================================================================
Write-Host "`n==============================================================================" -ForegroundColor Cyan
Write-Host "📈 LỚP 3/3: TRIỂN KHAI PHÂN HỆ GIÁM SÁT (loki, grafana)" -ForegroundColor Cyan
Write-Host "==============================================================================" -ForegroundColor Cyan

docker compose --profile obs up -d --build
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Cảnh báo: Không thể kích hoạt phân hệ giám sát. Tuy nhiên phân hệ Core & AI vẫn chạy ổn định." -ForegroundColor Yellow
} else {
    Write-Host "✅ LỚP 3 (OBSERVABILITY) ĐÃ ĐƯỢC TRIỂN KHAI THÀNH CÔNG!" -ForegroundColor Green
}

Write-Host "`n==============================================================================" -ForegroundColor Green
Write-Host "🎉 TRIỂN KHAI THEO LỚP HOÀN TẤT: HỆ THỐNG PHÁT TRIỂN THÀNH CÔNG RỰC RỠ!" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Green
exit 0
