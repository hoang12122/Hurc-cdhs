// scripts/guard-install.js - Cross-platform Local Guard Script for Enforcing npm ci in CI/Deploy Contexts
const env = process.env;

// 1. Identify the npm command being called with maximum robustness
// We check multiple sources to ensure we can identify the command across npm versions.
let isCiCommand = false;
let isInstallCommand = false;

// Source A: Modern npm (v7+) npm_command variable
if (env.npm_command === 'ci') {
  isCiCommand = true;
} else if (env.npm_command === 'install' || env.npm_command === 'i' || env.npm_command === 'add') {
  isInstallCommand = true;
}

// Source B: Legacy npm (v6-) npm_config_argv variable
if (env.npm_config_argv) {
  try {
    const argv = JSON.parse(env.npm_config_argv);
    if (argv && argv.original && Array.isArray(argv.original)) {
      if (argv.original.includes('ci')) {
        isCiCommand = true;
      }
      if (argv.original.includes('install') || argv.original.includes('i') || argv.original.includes('add')) {
        isInstallCommand = true;
      }
    }
  } catch (e) {
    // Ignore JSON parse errors
  }
}

// 2. Identify CI or Deploy context
// We do NOT use vague indicators like NODE_ENV === 'production' because developers run production builds locally.
// Instead, we check explicit, standard CI/Deploy environment variables.
const isCIOrDeploy = (
  env.CI === 'true' ||
  env.CI === '1' ||
  env.DEPLOY === 'true' ||
  env.GITHUB_ACTIONS !== undefined ||
  env.GITLAB_CI !== undefined ||
  env.JENKINS_URL !== undefined ||
  env.CIRCLECI !== undefined ||
  env.TRAVIS !== undefined
);

// 3. Enforce the invariant rule
// - Definitely allow 'npm ci' (bypass immediately if ci command is detected)
// - Only block when it is explicitly an 'install' command AND in a verified CI/Deploy context
if (isCiCommand) {
  // Definitely allow 'npm ci'
  process.exit(0);
}

if (isCIOrDeploy && isInstallCommand) {
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
