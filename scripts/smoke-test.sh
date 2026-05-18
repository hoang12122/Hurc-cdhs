#!/bin/bash
# ==============================================================================
# ⚠️ DEPRECATION WARNING ⚠️
# ==============================================================================
# Script này đã KHÔNG CÒN ĐƯỢC HỖ TRỢ (DEPRECATED).
# Nguồn sự thật vận hành duy nhất hiện tại là: scripts/smoke-deploy.sh
# Vui lòng sử dụng cú pháp sau để thay thế:
#   - Chạy smoke test Core: ./scripts/smoke-deploy.sh core
#   - Chạy smoke test AI:   ./scripts/smoke-deploy.sh ai
#   - Chạy smoke test All:  ./scripts/smoke-deploy.sh all
# ==============================================================================

RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0;m'

echo -e "${RED}==============================================================================${NC}"
echo -e "${RED}⚠️  LỖI: SCRIPT VẬN HÀNH ĐÃ BỊ LOẠI BỎ (DEPRECATED SCRIPT) ⚠️${NC}"
echo -e "${RED}==============================================================================${NC}"
echo -e "Tệp tin ${YELLOW}scripts/smoke-test.sh${NC} không còn là nguồn sự thật duy nhất."
echo -e "Vui lòng chuyển sang sử dụng kịch bản tiêu chuẩn mới:"
echo -e "👉 ${GREEN}./scripts/smoke-deploy.sh [core|ai|all]${NC}"
echo -e "${RED}==============================================================================${NC}"

exit 1
