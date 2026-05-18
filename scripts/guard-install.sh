#!/bin/sh

# scripts/guard-install.sh - Local Guard Script for Enforcing npm ci in CI/Deploy Contexts

# 1. Xác định ngữ cảnh CI hoặc Deploy
# Các biến môi trường thường gặp trong CI/CD: CI, GITHUB_ACTIONS, GITLAB_CI, JENKINS_URL, DEPLOY, hoặc NODE_ENV=production trong một số môi trường deploy.
IS_CI_OR_DEPLOY=false

if [ "$CI" = "true" ] || [ "$CI" = "1" ] || [ -n "$GITHUB_ACTIONS" ] || [ -n "$GITLAB_CI" ] || [ -n "$JENKINS_URL" ] || [ "$DEPLOY" = "true" ] || [ "$NODE_ENV" = "production" ]; then
    IS_CI_OR_DEPLOY=true
fi

# 2. Phát hiện câu lệnh npm được gọi
# Trong npm v7+, biến môi trường $npm_command lưu trữ trực tiếp tên câu lệnh đang chạy (ví dụ: "install" hoặc "ci").
# Hỗ trợ thêm cơ chế quét ngược lại biến legacy $npm_config_argv phòng trường hợp chạy npm cũ.
CURRENT_COMMAND="$npm_command"

if [ -z "$CURRENT_COMMAND" ] && [ -n "$npm_config_argv" ]; then
    # Quét biến legacy npm_config_argv (dạng JSON string: {"remain":[],"cooked":["install"],"original":["install"]})
    if echo "$npm_config_argv" | grep -q '"ci"'; then
        CURRENT_COMMAND="ci"
    elif echo "$npm_config_argv" | grep -q '"install"'; then
        CURRENT_COMMAND="install"
    fi
fi

# 3. Ép buộc nguyên tắc bất biến
# Nếu đang ở trong ngữ cảnh CI hoặc Deploy, và người dùng hoặc tiến trình cố gắng chạy "npm install" thay vì "npm ci" -> báo lỗi và ngắt tiến trình.
if [ "$IS_CI_OR_DEPLOY" = "true" ] && [ "$CURRENT_COMMAND" = "install" ]; then
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
