#!/bin/bash
# ==============================================================================
# HURC1 CRM - AUTOMATED EMERGENCY ROLLBACK DRILL RUNNER
# ==============================================================================
# Bất biến: Tự động giả lập sự cố, kiểm chứng tốc độ rollback và ghi nhận vào lịch sử.
# ==============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0;m'

DRILL_ID="DRILL-$(date +%Y%m%d-%H%M%S)"

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}🎮 KHỞI CHẠY DIỄN TẬP ROLLBACK ĐỊNH KỲ (EMERGENCY ROLLBACK DRILL: $DRILL_ID)${NC}"
echo -e "${BLUE}==============================================================================${NC}"

# Bước 1: Chuẩn bị môi trường an toàn trước diễn tập
echo -e "\n${YELLOW}[BƯỚC 1/4] Chuẩn bị môi trường sạch để giả lập...${NC}"
docker compose down -v >/dev/null 2>&1
echo -e "✅ Môi trường đã sẵn sàng."

# Bước 2: Bắt đầu đo lường thời gian khôi phục thực tế
echo -e "\n${YELLOW}[BƯỚC 2/4] Kích hoạt giả lập sự cố triển khai (Simulating Deployment Failure)...${NC}"
START_TIME=$(date +%s)

# Giả lập sự cố: Tạo một cổng xung đột (Port Clash - EADDRINUSE) hoặc fake container crash
# Chúng ta sẽ chạy một service tạm chiếm dụng cổng 3000 để làm cho App Container không thể khởi động thành công
echo -e "🔎 Đang tạo xung đột cổng 3000 để giả lập lỗi chí mạng EADDRINUSE..."
docker run -d --name hurc_port_clash -p 3000:3000 alpine sleep 30 >/dev/null 2>&1

# Triển khai thử cụm Core
echo -e "🔎 Khởi chạy cổng triển khai production..."
docker compose --profile core up -d --build >/dev/null 2>&1

# Bước 3: Chạy smoke test, kiểm tra xem có bắt được lỗi không
echo -e "🔎 Thực thi Smoke Test..."
bash scripts/smoke-deploy.sh core
SMOKE_EXIT=$?

if [ $SMOKE_EXIT -eq 0 ]; then
  echo -e "❌ ${RED}LỖI DIỄN TẬP: Lỗi giả lập không hoạt động! Smoke Test vẫn pass.${NC}"
  docker rm -f hurc_port_clash >/dev/null 2>&1
  docker compose down >/dev/null 2>&1
  exit 1
fi

echo -e "✅ ${GREEN}Smoke Test đã phát hiện lỗi thành công! Khởi động quy trình dọn dẹp khẩn cấp...${NC}"
# Thực hiện khôi phục hệ thống (Rollback)
docker compose --profile core down >/dev/null 2>&1
docker rm -f hurc_port_clash >/dev/null 2>&1

# Khởi chạy lại phiên bản hoạt động ổn định
docker compose --profile core up -d >/dev/null 2>&1
bash scripts/smoke-deploy.sh core >/dev/null 2>&1
RECOVERY_EXIT=$?

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

if [ $RECOVERY_EXIT -ne 0 ]; then
  echo -e "❌ ${RED}LỖI DIỄN TẬP: Hệ thống không thể khôi phục lại trạng thái ổn định sau rollback!${NC}"
  exit 1
fi

echo -e "✅ ${GREEN}DIỄN TẬP THÀNH CÔNG! Hệ thống đã phục hồi trạng thái ổn định.${NC}"
echo -e "⏱️ Thời gian phục hồi thực tế (RTO): ${GREEN}$DURATION giây${NC} (Mục tiêu: < 900 giây)."

# Bước 4: Lưu ghi nhận nhật ký diễn tập vào lịch sử docs/rollback_drill_history.md
echo -e "\n${YELLOW}[BƯỚC 4/4] Đang ghi nhận kết quả vào lịch sử diễn tập...${NC}"
HISTORY_FILE="docs/rollback_drill_history.md"

if [ ! -f "$HISTORY_FILE" ]; then
  cat <<EOF > "$HISTORY_FILE"
# NHẬT KÝ DIỄN TẬP ROLLBACK ĐỊNH KỲ (ROLLBACK DRILL HISTORY)

Tài liệu này lưu trữ lịch sử các buổi diễn tập phục hồi hệ thống khẩn cấp nhằm đảm bảo chỉ số RTO/RPO luôn đạt tiêu chuẩn Metro Tuyến 1.

| Mã Diễn Tập (Drill ID) | Ngày Diễn Tập | Kịch Bản Giả Lập | Thời Gian Phục Hồi (RTO) | Kết Quả | Người Thực Hiện |
| :--- | :--- | :--- | :---: | :---: | :--- |
EOF
fi

echo "| $DRILL_ID | $(date +%Y-%m-%d) | Port Clash (Cổng 3000 EADDRINUSE) | $DURATION giây | ✅ THÀNH CÔNG | HURC1-IRONCLAD Engine |" >> "$HISTORY_FILE"
echo -e "✅ Kết quả diễn tập đã được lưu vết thành công vào: $HISTORY_FILE"

echo -e "\n${GREEN}==============================================================================${NC}"
echo -e "${GREEN}🎉 HOÀN THÀNH BUỔI DIỄN TẬP ROLLBACK ĐỊNH KỲ AN TOÀN TUYỆT ĐỐI!${NC}"
echo -e "${GREEN}==============================================================================${NC}"
exit 0
