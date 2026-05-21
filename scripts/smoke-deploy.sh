#!/bin/bash

# ==============================================================================
# HURC1 METRO DEPLOYMENT SMOKE TEST RUNNER
# ==============================================================================
# Bất biến: Triển khai chỉ pass khi smoke test runtime pass hoàn toàn.
# Tự động hóa kiểm thử: Container, CSDL, Caching, Nginx, App Health, và Log Scan.
# Hỗ trợ cấu hình phân tách theo lớp: core vs ai
# ==============================================================================

# Thiết lập màu hiển thị chuyên nghiệp
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0;m' # No Color

PROFILE=${1:-all}

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}🚀 HỆ THỐNG KIỂM THỬ SỨC BỀN (SMOKE TEST) - HỒ SƠ: ${YELLOW}${PROFILE^^}${NC}"
echo -e "${BLUE}==============================================================================${NC}"

# Hằng số định cấu hình
MAX_ATTEMPTS=12
SLEEP_INTERVAL=5
HEALTH_URL="http://localhost:3000/api/health"
NGINX_URL="http://localhost:80"

# ------------------------------------------------------------------------------
# BƯỚC 1: KIỂM TRA TRẠNG THÁI CONTAINER
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[BƯỚC 1] Kiểm tra trạng thái các Container (docker compose ps)...${NC}"
docker compose ps

if [ "$PROFILE" = "core" ]; then
  TARGET_CONTAINERS=("hurc_postgres" "hurc_mongo" "hurc_redis" "hurc_app" "hurc_nginx")
elif [ "$PROFILE" = "ai" ]; then
  TARGET_CONTAINERS=("hurc_yolo" "hurc_ollama" "hurc_ollama_pull")
else
  TARGET_CONTAINERS=("hurc_postgres" "hurc_mongo" "hurc_redis" "hurc_app" "hurc_nginx" "hurc_yolo" "hurc_ollama" "hurc_ollama_pull")
fi

for CONTAINER in "${TARGET_CONTAINERS[@]}"; do
  STATE=$(docker inspect -f '{{.State.Status}}' "$CONTAINER" 2>/dev/null)
  if [ -z "$STATE" ]; then
    # Bỏ qua nếu container không tồn tại (trong trường hợp không deploy profile này)
    if [ "$PROFILE" = "all" ]; then
      continue
    fi
    echo -e "❌ ${RED}LỖI NGHIÊM TRỌNG: Không tìm thấy container $CONTAINER!${NC}"
    exit 1
  fi
  
  echo -e "🔎 Container $CONTAINER: ${GREEN}$STATE${NC}"
  if [ "$STATE" = "restarting" ] || [ "$STATE" = "exited" ] || [ "$STATE" = "dead" ]; then
    # Đặc cách cho hurc_ollama_pull exited thành công với ExitCode 0
    if [ "$CONTAINER" = "hurc_ollama_pull" ] && [ "$STATE" = "exited" ]; then
      EXIT_CODE=$(docker inspect -f '{{.State.ExitCode}}' "$CONTAINER" 2>/dev/null)
      if [ "$EXIT_CODE" = "0" ]; then
        echo -e "ℹ️ Container $CONTAINER đã hoàn tất nhiệm vụ và dừng thành công (ExitCode 0)."
        continue
      fi
    fi
    echo -e "❌ ${RED}LỖI NGHIÊM TRỌNG: Container $CONTAINER đang ở trạng thái lỗi: $STATE!${NC}"
    exit 1
  fi
done
echo -e "✅ ${GREEN}Tất cả Container thuộc hồ sơ $PROFILE đều hoạt động bình thường.${NC}"

# ------------------------------------------------------------------------------
# BƯỚC 2: KIỂM TRA CHI TIẾT THEO HỒ SƠ
# ------------------------------------------------------------------------------

if [ "$PROFILE" = "core" ] || [ "$PROFILE" = "all" ]; then
  echo -e "\n${YELLOW}[BƯỚC 2] Ping kiểm tra kết nối các CSDL & Cache (Postgres, Mongo, Redis)...${NC}"
  
  # 2.1: Ping PostgreSQL
  echo -n "🔎 Đang kiểm tra PostgreSQL (hurc_postgres)... "
  if docker exec hurc_postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${GREEN}ĐÃ SẴN SÀNG (pg_isready -OK)${NC}"
  else
    echo -e "${RED}THẤT BẠI! PostgreSQL không phản hồi.${NC}"
    exit 1
  fi

  # 2.2: Ping MongoDB
  echo -n "🔎 Đang kiểm tra MongoDB (hurc_mongo)... "
  if docker exec hurc_mongo mongosh --eval "db.runCommand({ping:1})" --quiet > /dev/null 2>&1; then
    echo -e "${GREEN}ĐÃ SẴN SÀNG (mongosh ping -OK)${NC}"
  elif docker exec hurc_mongo mongo --eval "db.runCommand({ping:1})" --quiet > /dev/null 2>&1; then
    echo -e "${GREEN}ĐÃ SẴN SÀNG (mongo legacy ping -OK)${NC}"
  else
    echo -e "${RED}THẤT BẠI! MongoDB không phản hồi.${NC}"
    exit 1
  fi

  # 2.3: Ping Redis
  echo -n "🔎 Đang kiểm tra Redis (hurc_redis)... "
  REDIS_PING=$(docker exec hurc_redis redis-cli ping 2>/dev/null | tr -d '\r' | tr -d '\n')
  if [ "$REDIS_PING" = "PONG" ]; then
    echo -e "${GREEN}ĐÃ SẴN SÀNG (redis-cli PING -> PONG)${NC}"
  else
    echo -e "${RED}THẤT BẠI! Redis không phản hồi (Nhận được: $REDIS_PING).${NC}"
    exit 1
  fi

  # 2.4: HTTP Check App Health Endpoint
  echo -e "\n${YELLOW}[BƯỚC 3] HTTP Check App Health Endpoint (/api/health)...${NC}"
  ATTEMPT=1
  SUCCESS=0
  while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo -n "🔎 Thử lần $ATTEMPT/$MAX_ATTEMPTS kết nối đến $HEALTH_URL... "
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || echo "000")
    if [[ "$HTTP_STATUS" =~ ^[23][0-9][0-9]$ ]]; then
      echo -e "${GREEN}THÀNH CÔNG (HTTP $HTTP_STATUS)${NC}"
      SUCCESS=1
      break
    else
      echo -e "${YELLOW}Chưa sẵn sàng (HTTP $HTTP_STATUS). Thử lại sau ${SLEEP_INTERVAL}s...${NC}"
      sleep $SLEEP_INTERVAL
      ATTEMPT=$((ATTEMPT + 1))
    fi
  done

  if [ $SUCCESS -ne 1 ]; then
    echo -e "❌ ${RED}LỖI NGHIÊM TRỌNG: Ứng dụng chính không phản hồi trạng thái khỏe mạnh sau $((MAX_ATTEMPTS * SLEEP_INTERVAL)) giây!${NC}"
    echo -e "🔎 Nhật ký logs 50 dòng cuối của hurc_app:"
    docker logs --tail 50 hurc_app
    exit 1
  fi

  # 2.5: HTTP Check Nginx Reverse Proxy
  echo -e "\n${YELLOW}[BƯỚC 4] HTTP Check Nginx Reverse Proxy (Port 80)...${NC}"
  NGINX_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$NGINX_URL" || echo "000")
  echo -e "🔎 Kết nối thử đến cổng Nginx: $NGINX_URL -> HTTP Code: ${GREEN}$NGINX_STATUS${NC}"
  if [[ ! "$NGINX_STATUS" =~ ^[23][0-9][0-9]$ ]]; then
    echo -e "❌ ${RED}LỖI NGHIÊM TRỌNG: Nginx Reverse Proxy lỗi! (HTTP Code: $NGINX_STATUS)${NC}"
    docker logs --tail 30 hurc_nginx
    exit 1
  fi
  echo -e "✅ ${GREEN}Nginx Reverse Proxy hoạt động hoàn hảo.${NC}"

  # 2.6: Log Scan App Container
  echo -e "\n${YELLOW}[BƯỚC 5] Quét nhật ký Log App Container để bắt lỗi sập vòng lặp (Crash Loop)...${NC}"
  RESTART_COUNT=$(docker inspect -f '{{.State.RestartCount}}' hurc_app)
  echo -e "🔎 Số lần tự động khởi động lại của hurc_app: ${GREEN}$RESTART_COUNT${NC}"
  if [ "$RESTART_COUNT" -gt 0 ]; then
    echo -e "❌ ${RED}LỖI NGHIÊM TRỌNG: Phát hiện sập vòng lặp (Crash Loop) trên hurc_app!${NC}"
    exit 1
  fi

  echo "🔎 Quét nhật ký logs tìm kiếm crash signature..."
  APP_LOGS=$(docker logs --since 5m hurc_app 2>&1)
  FATAL_ERRORS=$(echo "$APP_LOGS" | grep -Ei "panic|fatal|uncaughtException|unhandledRejection|Unhandled|EADDRINUSE|Cannot find module|FATAL ERROR")
  if [ ! -z "$FATAL_ERRORS" ]; then
    echo -e "❌ ${RED}LỖI NGHIÊM TRỌNG: Phát hiện crash signature trong logs!${NC}"
    echo -e "${RED}$FATAL_ERRORS${NC}"
    exit 1
  fi
  echo -e "✅ ${GREEN}Nhật ký log App Container an toàn.${NC}"
fi

if [ "$PROFILE" = "ai" ] || [ "$PROFILE" = "all" ]; then
  echo -e "\n${YELLOW}[BƯỚC 3 (AI)] Kiểm nghiệm tích hợp sâu các Dịch vụ Trí tuệ Nhân tạo (YOLO, Ollama)...${NC}"

  # 3.1: Kiểm tra YOLO Service API
  echo -n "🔎 Đang kết nối thử đến YOLO Service API (cổng 5005)... "
  YOLO_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5005/health" || echo "000")
  if [ "$YOLO_STATUS" = "200" ]; then
    echo -e "${GREEN}THÀNH CÔNG (HTTP 200)${NC}"
  else
    echo -e "${RED}THẤT BẠI! YOLO Service không phản hồi (HTTP Code: $YOLO_STATUS).${NC}"
    exit 1
  fi

  # 3.2: Kiểm tra Ollama CLI ping
  echo -n "🔎 Đang kiểm tra Ollama Engine (hurc_ollama CLI)... "
  if docker exec hurc_ollama ollama list > /dev/null 2>&1; then
    echo -e "${GREEN}ĐÃ SẴN SÀNG (ollama list -OK)${NC}"
  else
    echo -e "${RED}THẤT BẠI! Ollama Engine không hoạt động.${NC}"
    exit 1
  fi

  # 3.3: Quét nhật ký logs AI Services
  echo "🔎 Quét nhật ký logs YOLO & Ollama để phát hiện crash signature..."
  YOLO_LOGS=$(docker logs --since 5m hurc_yolo 2>&1)
  OLLAMA_LOGS=$(docker logs --since 5m hurc_ollama 2>&1)
  AI_ERRORS=$(echo -e "$YOLO_LOGS\n$OLLAMA_LOGS" | grep -Ei "panic|fatal|uncaughtException|unhandledRejection|Unhandled|EADDRINUSE|Cannot find module|FATAL ERROR")
  if [ ! -z "$AI_ERRORS" ]; then
    echo -e "❌ ${RED}LỖI NGHIÊM TRỌNG: Phát hiện crash signature trong logs dịch vụ AI!${NC}"
    echo -e "${RED}$AI_ERRORS${NC}"
    exit 1
  fi
  echo -e "✅ ${GREEN}Nhật ký logs các dịch vụ AI an toàn.${NC}"
fi

echo -e "\n${GREEN}==============================================================================${NC}"
echo -e "${GREEN}🎉 HOÀN THÀNH: HỒ SƠ ${PROFILE^^} ĐẠT CHUẨN AN TOÀN TUYỆT ĐỐI!${NC}"
echo -e "${GREEN}==============================================================================${NC}"
exit 0
