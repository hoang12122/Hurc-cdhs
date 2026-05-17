# Scripts: Pull Local AI Models (Llama3 + Mistral)
# This script ensures that the Ollama container has the required models.

Write-Host "--- Kích hoạt quy trình tải mô hình AI Local cho HURC1.CRM ---" -ForegroundColor Cyan

# 1. Kiểm tra container Ollama có đang chạy không
$containerId = docker ps -qf "name=hurc_ollama"
if (-not $containerId) {
    Write-Host "[!] ERROR: Container 'hurc_ollama' chưa chạy. Vui lòng chạy 'docker compose up -d' trước." -ForegroundColor Red
    exit 1
}

# 2. Tải mô hình Gemma 2B (Mô hình siêu nhẹ cho RAG/Phân tích nhanh)
Write-Host "[>] Đang tải mô hình Gemma:2b (1.6GB)..." -ForegroundColor Yellow
docker exec -it hurc_ollama ollama pull gemma:2b

# 3. Tải mô hình Mistral (Mặc định, nhẹ)
Write-Host "[>] Đang tải mô hình Mistral (4GB)..." -ForegroundColor Yellow
docker exec -it hurc_ollama ollama pull mistral

# 4. Tải mô hình Llama3 (Dành cho phân tích sâu)
Write-Host "[>] Đang tải mô hình Llama3:8b (5GB)..." -ForegroundColor Yellow
docker exec -it hurc_ollama ollama pull llama3:8b

Write-Host "[V] HOÀN TẤT: Toàn bộ mô hình AI đã sẵn sàng cho chế độ Offline." -ForegroundColor Green
Write-Host "[*] Gợi ý: Bạn có thể đổi mô hình trong tệp .env thông qua biến LLM_ENDPOINT hoặc cấu hình cấu hình model." -ForegroundColor Cyan
