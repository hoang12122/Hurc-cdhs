// scripts/guard-install.js - Cross-platform Local Guard Script for Enforcing npm ci in CI/Deploy Contexts
const env = process.env;

// 1. Identify CI or Deploy context
const isCIOrDeploy = (
  env.CI === 'true' ||
  env.CI === '1' ||
  env.GITHUB_ACTIONS !== undefined ||
  env.GITLAB_CI !== undefined ||
  env.JENKINS_URL !== undefined ||
  env.DEPLOY === 'true' ||
  env.NODE_ENV === 'production'
);

// 2. Identify the npm command being called
// In npm v7+, process.env.npm_command directly stores the command name (e.g. "install" or "ci")
let currentCommand = env.npm_command;

// Backward compatibility check for older npm versions using npm_config_argv
if (!currentCommand && env.npm_config_argv) {
  try {
    const argv = JSON.parse(env.npm_config_argv);
    if (argv && argv.original) {
      if (argv.original.includes('ci')) {
        currentCommand = 'ci';
      } else if (argv.original.includes('install') || argv.original.includes('i')) {
        currentCommand = 'install';
      }
    }
  } catch (e) {
    // Ignore JSON parse errors
  }
}

// 3. Enforce the invariant rule
if (isCIOrDeploy && currentCommand === 'install') {
  console.error("==========================================================================");
  console.error("🔴 LỖI VI PHẠM NGUYÊN TẮC BẤT BIẾN (INVARIANT VIOLATION):");
  console.error("Phát hiện hành vi chạy 'npm install' trong môi trường CI/Deploy!");
  console.error("Môi trường hiện tại: CI/Deploy Context Detected.");
  console.error("");
  console.error("👉 HƯỚNG DẪN ĐÚNG: Bạn BẮT BUỘC phải dùng câu lệnh sau để đồng bộ cài đặt:");
  console.error("   npm ci --include=dev");
  console.error("==========================================================================");
  process.exit(1);
}

process.exit(0);
