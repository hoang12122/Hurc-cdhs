#!/bin/bash
# Scripts: Pull Local AI Models (Gemma + Mistral + Llama3)
# This script ensures that the Ollama container has the required models.

echo -e "\e[36m--- Kích hoạt quy trình tải mô hình AI Local cho HURC1.CRM ---\e[0m"

# 1. Kiểm tra container Ollama có đang chạy không
containerId=$(docker ps -qf "name=hurc_ollama")
if [ -z "$containerId" ]; then
    echo -e "\e[31m[!] ERROR: Container 'hurc_ollama' chưa chạy. Vui lòng chạy 'docker compose up -d' trước.\e[0m"
    exit 1
fi

# 2. Tải mô hình Gemma 2B
echo -e "\e[33m[>] Đang tải mô hình Gemma:2b (1.6GB)...\e[0m"
docker exec -it hurc_ollama ollama pull gemma:2b

# 3. Tải mô hình Mistral
echo -e "\e[33m[>] Đang tải mô hình Mistral (4GB)...\e[0m"
docker exec -it hurc_ollama ollama pull mistral

# 4. Tải mô hình Llama3
echo -e "\e[33m[>] Đang tải mô hình Llama3:8b (5GB)...\e[0m"
docker exec -it hurc_ollama ollama pull llama3:8b

echo -e "\e[32m[V] HOÀN TẤT: Toàn bộ mô hình AI đã sẵn sàng cho chế độ Offline.\e[0m"
echo -e "\e[36m[*] Gợi ý: Bạn có thể đổi mô hình trong tệp .env thông qua biến LLM_ENDPOINT hoặc cấu hình cấu hình model.\e[0m"
