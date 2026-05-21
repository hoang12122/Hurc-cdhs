#!/bin/sh

# scripts/guard-install.sh - Local Guard Script for Enforcing npm ci in CI/Deploy Contexts

# 1. Phát hiện câu lệnh npm được gọi với độ chính xác cao nhất
IS_CI_COMMAND=false
IS_INSTALL_COMMAND=false

if [ "$npm_command" = "ci" ]; then
    IS_CI_COMMAND=true
elif [ "$npm_command" = "install" ] || [ "$npm_command" = "i" ] || [ "$npm_command" = "add" ]; then
    IS_INSTALL_COMMAND=true
fi

# Quét thêm biến legacy npm_config_argv
if [ -n "$npm_config_argv" ]; then
    if echo "$npm_config_argv" | grep -q '"ci"'; then
        IS_CI_COMMAND=true
    fi
    if echo "$npm_config_argv" | grep -q '"install"' || echo "$npm_config_argv" | grep -q '"i"' || echo "$npm_config_argv" | grep -q '"add"'; then
        IS_INSTALL_COMMAND=true
    fi
fi

# 2. Xác định ngữ cảnh CI hoặc Deploy
# Loại bỏ hoàn toàn NODE_ENV=production mơ hồ dễ gây false-positive ở local
IS_CI_OR_DEPLOY=false
if [ "$CI" = "true" ] || [ "$CI" = "1" ] || [ "$DEPLOY" = "true" ] || [ -n "$GITHUB_ACTIONS" ] || [ -n "$GITLAB_CI" ] || [ -n "$JENKINS_URL" ] || [ -n "$CIRCLECI" ] || [ -n "$TRAVIS" ]; then
    IS_CI_OR_DEPLOY=true
fi

# 3. Ép buộc nguyên tắc bất biến
# - Cho phép chắc chắn npm ci (thoát 0 ngay lập tức nếu phát hiện ci)
# - Chỉ chặn install khi xác định rõ là context CI/deploy và câu lệnh là install
if [ "$IS_CI_COMMAND" = "true" ]; then
    exit 0
fi

if [ "$IS_CI_OR_DEPLOY" = "true" ] && [ "$IS_INSTALL_COMMAND" = "true" ]; then
    echo "=========================================================================="
    echo "🔴 LỖI VI PHẠM NGUYÊN TẮC BẤT BIẾN (INVARIANT VIOLATION):"
    echo "Phát hiện hành vi chạy 'npm install' trong môi trường CI/Deploy!"
    echo "Môi trường hiện tại: CI/Deploy Context Detected."
    echo ""
    echo "👉 HƯỚNG DẪN ĐÚNG: Bạn BẮT BUỘC phải dùng câu lệnh sau để đồng bộ cài đặt:"
    echo "   npm ci --include=dev"
    echo "=========================================================================="
    exit 1
fi

exit 0
