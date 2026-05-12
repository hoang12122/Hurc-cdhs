// src/lib/db/ai-db.ts
import { PrismaClient } from '../../../.prisma-runtime/ai';
import { DB_CONFIG } from '../config/db-config';

/**
 * Singleton instance for AI & Audit Database (aiDb)
 * Responsible for: AI Safety Logs, Verification Logs, AI Agents, Conversations.
 */

const globalForAi = global as unknown as { aiDb: PrismaClient };

// Prepare URL with timeouts safely
const aiUrlStr = process.env.AI_DATABASE_URL || DB_CONFIG.postgres.aiUrl;
let aiUrl: URL;

try {
  // Use a placeholder if the URL is missing to prevent build-time crashes (ERR_INVALID_URL)
  aiUrl = new URL(aiUrlStr || 'postgresql://localhost:5432/unused');
} catch (e) {
  aiUrl = new URL('postgresql://localhost:5432/unused');
}

aiUrl.searchParams.set('connect_timeout', DB_CONFIG.resiliency.ai.connectTimeout.toString());
aiUrl.searchParams.set('pool_timeout', DB_CONFIG.resiliency.ai.poolTimeout.toString());

export const aiDb =
  globalForAi.aiDb ||
  new PrismaClient({
    datasourceUrl: aiUrl.toString(),
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForAi.aiDb = aiDb;

// Check connection count and log warning if abnormal on startup
if (process.env.NODE_ENV === 'development' && !DB_CONFIG.useFallback) {
  aiDb.$connect()
    .then(() => {
      console.log('[aiDb] Connected successfully.');
    })
    .catch(err => {
      // Chỉ log lỗi nếu thực sự mong muốn kết nối (không phải fallback)
      console.error('[aiDb] Connection failed:', err.message);
    });
}

export default aiDb;

/**
 * Health check for aiDb
 */
export async function checkAiDbHealth() {
  try {
    await aiDb.$queryRaw`SELECT 1`;
    return { status: 'healthy', database: 'aiDb' };
  } catch (error) {
    console.error('[aiDb] Health check failed:', error);
    return { status: 'unhealthy', database: 'aiDb', error: String(error) };
  }
}
