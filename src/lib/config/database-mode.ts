/**
 * Database Mode Configuration
 * 
 * Đây là nguồn kiểm tra Offline Mode duy nhất cho toàn bộ hệ thống.
 * Tránh việc đọc trực tiếp process.env rải rác ở các service khác nhau.
 */

const normalizeBool = (val: any) => {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') {
    const s = val.toLowerCase().trim();
    return s === 'true' || s === '1' || s === 'yes';
  }
  return false;
};

export const IS_DATABASE_OFFLINE =
  normalizeBool(process.env.IS_DATABASE_OFFLINE) ||
  normalizeBool(process.env.DATABASE_OFFLINE) ||
  normalizeBool(process.env.USE_FALLBACK); // Keep compatibility with older configs

export const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Kiểm tra tính an toàn của chế độ database.
 * Không cho phép chạy Offline Mode (JSON-DB) trong môi trường Production.
 */
export function assertDatabaseModeIsSafe() {
  if (IS_PRODUCTION && IS_DATABASE_OFFLINE) {
    // Trong production, chúng ta khuyên dùng PostgreSQL. 
    // Tuy nhiên, nếu Ironclad Offline là mục tiêu (ví dụ: chạy local production), chúng ta cho phép.
    if (process.env.ALLOW_OFFLINE_PRODUCTION !== "true") {
      console.warn("\x1b[31m%s\x1b[0m", " [SECURITY] WARNING: Running in OFFLINE mode in PRODUCTION.");
      console.warn(" To disable this warning or enforce safety, check ALLOW_OFFLINE_PRODUCTION.");
    }
  }
}

/**
 * Log trạng thái database mode khi khởi động.
 * Giúp developer biết hệ thống đang chạy bằng db.json hay PostgreSQL.
 */
export function logDatabaseMode() {
  if (IS_DATABASE_OFFLINE) {
    console.log("\x1b[33m%s\x1b[0m", " [DATABASE MODE] OFFLINE - Using db.json. Prisma is bypassed.");
  } else {
    console.log("\x1b[32m%s\x1b[0m", " [DATABASE MODE] ONLINE - Using PostgreSQL via Prisma.");
  }
}
