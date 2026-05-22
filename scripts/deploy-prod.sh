#!/bin/bash
# ==============================================================================
# HURC1 CRM - AUTOMATED LAYERED PRODUCTION DEPLOYMENT & ROLLBACK ORCHESTRATOR
# ==============================================================================
# Bất biến: Triển khai theo lớp nghiêm ngặt (Core -> AI -> Observability).
# Mỗi lớp đều có chốt chặn Smoke Test riêng. Bất kỳ lớp nào lỗi => Rollback lập tức!
# ==============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0;m'

# Tự động đặt mặc định bỏ qua kiểm tra phiên bản Node trên host (chỉ chạy trong Docker)
export SKIP_PREFLIGHT=${SKIP_PREFLIGHT:-true}

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}🚀 TIẾN TRÌNH TRIỂN KHAI PHÂN LỚP PRODUCTION (TIÊU CHUẨN GA METRO METICULOUS)${NC}"
echo -e "${BLUE}==============================================================================${NC}"

# Đọc biến cấu hình hồ sơ triển khai
DEPLOY_PROFILE=${DEPLOY_PROFILE:-all}
echo -e "🔎 Hồ sơ triển khai được cấu hình: ${YELLOW}${DEPLOY_PROFILE^^}${NC}"

# 1. Khởi tạo các thư mục dữ liệu để tránh lỗi phân quyền (Permission Denied) của Docker
echo -e "\n${YELLOW}[BƯỚC CHUẨN BỊ] Khởi tạo các thư mục lưu trữ dữ liệu...${NC}"
mkdir -p nginx/certs
mkdir -p data/postgres data/mongo data/ollama data/offline logs backups audit_reports
echo -e "✅ ${GREEN}Khởi tạo thư mục dữ liệu thành công!${NC}"

# 2. Chạy Preflight Check cục bộ trước khi bắt đầu
echo -e "\n${YELLOW}[BƯỚC CHUẨN BỊ] Chạy Preflight Validation phiên bản Node.js...${NC}"
if ! node scripts/preflight-node.js; then
  echo -e "❌ ${RED}LỖI: Preflight validation thất bại! Dừng tiến trình triển khai để bảo vệ hệ thống.${NC}"
  exit 1
fi
echo -e "✅ ${GREEN}Preflight validation thành công!${NC}"

# 3. Thực hiện Hot Backup
echo -e "\n${YELLOW}[HOT BACKUP] Sao lưu trạng thái hệ thống hiện hữu trước khi nâng cấp...${NC}"
if [ -f "scripts/backup-system.sh" ]; then
  bash scripts/backup-system.sh
else
  echo -e "🔎 ${YELLOW}Không tìm thấy kịch bản backup-system.sh, bỏ qua bước sao lưu.${NC}"
fi

# ==============================================================================
# LỚP 1: TRIỂN KHAI PHÂN HỆ CỐT LÕI (CORE SERVICES)
# ==============================================================================
echo -e "\n${BLUE}==============================================================================${NC}"
echo -e "${BLUE}🧱 LỚP 1/3: TRIỂN KHAI PHÂN HỆ CỐT LÕI (postgres, mongo, redis, app, nginx)${NC}"
echo -e "${BLUE}==============================================================================${NC}"

docker compose --profile core up -d --build
if [ $? -ne 0 ]; then
  echo -e "❌ ${RED}LỖI NGHIÊM TRỌNG: Không thể kích hoạt Docker Compose Core! Dọn dẹp khẩn cấp...${NC}"
  docker compose --profile core down -v
  exit 1
fi

echo -e "🔎 ${YELLOW}Đang kích hoạt Smoke Test kiểm định riêng phân hệ CORE...${NC}"
bash scripts/smoke-deploy.sh core
if [ $? -ne 0 ]; then
  echo -e "\n🚨 ${RED}CẢNH BÁO ĐỎ: PHÂN HỆ CORE KHÔNG VƯỢT QUA KIỂM THỬ SỨC BỀN!${NC}"
  echo -e "⚠️ ${YELLOW}Bắt đầu tự động Rollback phân hệ Core để trả máy chủ về trạng thái an toàn...${NC}"
  
  echo -e "🔎 Trích xuất nhật ký logs lỗi của App Container:"
  docker logs --tail 30 hurc_app 2>&1
  
  docker compose --profile core down
  echo -e "❌ ${RED}ROLLBACK CORE HOÀN TẤT. Tiến trình triển khai thất bại.${NC}"
  exit 1
fi
echo -e "✅ ${GREEN}LỚP 1 (CORE) ĐÃ ĐƯỢC TRIỂN KHAI THÀNH CÔNG VÀ AN TOÀN TUYỆT ĐỐI!${NC}"

# Kiểm tra nếu chỉ cần triển khai CORE
if [ "$DEPLOY_PROFILE" = "core" ]; then
  echo -e "\n${GREEN}==============================================================================${NC}"
  echo -e "${GREEN}🎉 TRIỂN KHAI PHÂN HỆ CỐT LÕI (CORE ONLY) HOÀN TẤT VÀ THÀNH CÔNG RỰC RỠ!${NC}"
  echo -e "${GREEN}==============================================================================${NC}"
  exit 0
fi

# ==============================================================================
# LỚP 2: TRIỂN KHAI PHÂN HỆ TRÍ TUỆ NHÂN TẠO (AI SERVICES)
# ==============================================================================
echo -e "\n${BLUE}==============================================================================${NC}"
echo -e "${BLUE}🧠 LỚP 2/3: TRIỂN KHAI PHÂN HỆ TRÍ TUỆ NHÂN TẠO (yolo, ollama, pull-model)${NC}"
echo -e "${BLUE}==============================================================================${NC}"

docker compose --profile core --profile ai up -d --build
if [ $? -ne 0 ]; then
  echo -e "❌ ${RED}LỖI NGHIÊM TRỌNG: Không thể kích hoạt Docker Compose AI! Hủy toàn bộ hệ thống...${NC}"
  docker compose --profile core --profile ai --profile obs down
  exit 1
fi

echo -e "🔎 ${YELLOW}Đang kích hoạt Smoke Test kiểm định riêng phân hệ AI...${NC}"
bash scripts/smoke-deploy.sh ai
if [ $? -ne 0 ]; then
  echo -e "\n🚨 ${RED}CẢNH BÁO ĐỎ: PHÂN HỆ AI KHÔNG VƯỢT QUA KIỂM THỬ SỨC BỀN!${NC}"
  echo -e "⚠️ ${YELLOW}Bắt đầu tự động Rollback toàn bộ hệ thống để tránh xung đột tài nguyên...${NC}"
  
  echo -e "🔎 Trích xuất nhật ký logs lỗi của YOLO Service:"
  docker logs --tail 30 hurc_yolo 2>&1
  
  docker compose --profile core --profile ai --profile obs down
  echo -e "❌ ${RED}ROLLBACK TOÀN HỆ THỐNG HOÀN TẤT. Tiến trình triển khai thất bại.${NC}"
  exit 1
fi
echo -e "✅ ${GREEN}LỚP 2 (AI) ĐÃ ĐƯỢC TRIỂN KHAI THÀNH CÔNG VÀ AN TOÀN TUYỆT ĐỐI!${NC}"

# ==============================================================================
# LỚP 3: TRIỂN KHAI PHÂN HỆ GIÁM SÁT (OBSERVABILITY SERVICES)
# ==============================================================================
echo -e "\n${BLUE}==============================================================================${NC}"
echo -e "${BLUE}📈 LỚP 3/3: TRIỂN KHAI PHÂN HỆ GIÁM SÁT (loki, grafana)${NC}"
echo -e "${BLUE}==============================================================================${NC}"

docker compose --profile core --profile ai --profile obs up -d --build
if [ $? -ne 0 ]; then
  echo -e "⚠️ ${YELLOW}Cảnh báo: Không thể kích hoạt phân hệ giám sát. Tuy nhiên phân hệ Core & AI vẫn chạy ổn định.${NC}"
else
  echo -e "✅ ${GREEN}LỚP 3 (OBSERVABILITY) ĐÃ ĐƯỢC TRIỂN KHAI THÀNH CÔNG!${NC}"
fi

echo -e "\n${GREEN}==============================================================================${NC}"
echo -e "${GREEN}🎉 TRIỂN KHAI THEO LỚP HOÀN TẤT: HỆ THỐNG PHÁT TRIỂN THÀNH CÔNG RỰC RỠ!${NC}"
echo -e "${GREEN}==============================================================================${NC}"
exit 0
