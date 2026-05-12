// src/lib/db/ai-db.ts
import { PrismaClient } from '../../../.prisma-runtime/ai';
import { DB_CONFIG } from '../config/db-config';
import { IS_DATABASE_OFFLINE } from '../config/database-mode';

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
  (!IS_DATABASE_OFFLINE
    ? new PrismaClient({
        datasourceUrl: aiUrl.toString(),
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
    : (null as any));

if (process.env.NODE_ENV !== 'production' && aiDb) globalForAi.aiDb = aiDb;

// Check connection count only in ONLINE mode
 if (process.env.NODE_ENV === 'development' && !IS_DATABASE_OFFLINE && aiDb) {
   aiDb.$connect()
     .then(() => {
       console.log('[aiDb] Connected successfully.');
     })
     .catch(err => {
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
