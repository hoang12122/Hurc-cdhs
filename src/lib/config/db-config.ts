import { validateEnv } from './env-validator';
import { logDatabaseMode, assertDatabaseModeIsSafe, IS_DATABASE_OFFLINE } from './database-mode';

// Tự động kiểm tra môi trường và log trạng thái khi khởi động
validateEnv();
logDatabaseMode();
assertDatabaseModeIsSafe();

export const DB_CONFIG = {
  // PostgreSQL (prisma)
  postgres: {
    opsUrl: process.env.OPS_DATABASE_URL || process.env.DATABASE_URL || undefined,
    aiUrl: process.env.AI_DATABASE_URL || undefined,
  },
  
  // MongoDB (optional for some services)
  mongo: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    dbName: process.env.MONGODB_DB_NAME || 'hurc1crm',
  },
  
  // Chế độ Offline/Mock (Đã được chuẩn hóa trong database-mode.ts)
  useFallback: IS_DATABASE_OFFLINE,
  
  mockDbPath: process.env.MOCK_DB_PATH || 'db.json',

  // TrustGraph Config (Task 5.1)
  trustGraph: {
    enabled: process.env.TRUSTGRAPH_ENABLED !== 'false',
    syncIntervalMs: parseInt(process.env.TRUSTGRAPH_SYNC_INTERVAL || '300000', 10), // Default 5 mins
    retryLimit: parseInt(process.env.TRUSTGRAPH_RETRY_LIMIT || '3', 10),
  },

  // AI & Safety Observability
  observability: {
    aiAuditEnabled: process.env.AI_AUDIT_ENABLED !== 'false',
    aiSafetyLogEnabled: process.env.AI_SAFETY_LOG_ENABLED !== 'false',
    logLevel: process.env.LOG_LEVEL || 'info',
  },
  
  // Resiliency Config
  resiliency: {
    ops: {
      connectTimeout: parseInt(process.env.DATABASE_CONNECT_TIMEOUT_MS || '10000', 10),
      queryTimeout: parseInt(process.env.DATABASE_QUERY_TIMEOUT_MS || '30000', 10),
      poolTimeout: parseInt(process.env.DATABASE_POOL_TIMEOUT_MS || '10000', 10),
      maxRetries: 3,
    },
    ai: {
      connectTimeout: parseInt(process.env.AI_CONNECT_TIMEOUT || '5000', 10),
      poolTimeout: parseInt(process.env.AI_POOL_TIMEOUT_MS || '5000', 10),
      maxRetries: 2,
    }
  }
}
