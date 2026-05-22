// src/lib/db/auth-db.ts
import { PrismaClient } from '../../../.prisma-runtime/auth';
import { DB_CONFIG } from '../config/db-config';
import { IS_DATABASE_OFFLINE } from '../config/database-mode';

/**
 * Singleton instance for Authentication Database (authDb)
 * Responsible for: User accounts, Roles, password resets.
 */

const globalForAuth = global as unknown as { authDb: PrismaClient };

// Prepare URL with timeouts safely
const authUrlStr = process.env.AUTH_DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/hurc_auth?schema=public';
let authUrl: URL;

try {
  // Use a placeholder if the URL is missing to prevent build-time crashes (ERR_INVALID_URL)
  authUrl = new URL(authUrlStr || 'postgresql://localhost:5432/unused');
} catch (e) {
  authUrl = new URL('postgresql://localhost:5432/unused');
}

authUrl.searchParams.set('connect_timeout', DB_CONFIG.resiliency.ops.connectTimeout.toString());
authUrl.searchParams.set('pool_timeout', DB_CONFIG.resiliency.ops.poolTimeout.toString());

export const authDb =
  globalForAuth.authDb ||
  (!IS_DATABASE_OFFLINE
    ? new PrismaClient({
        datasourceUrl: authUrl.toString(),
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
    : (null as any));

if (process.env.NODE_ENV !== 'production' && authDb) globalForAuth.authDb = authDb;

// Check connection count only in ONLINE mode
if (process.env.NODE_ENV === 'development' && !IS_DATABASE_OFFLINE && authDb) {
  authDb.$connect()
    .then(() => {
      console.log('[authDb] Connected successfully.');
    })
    .catch(err => {
      console.error('[authDb] Connection failed:', err.message);
    });
}

export default authDb;

/**
 * Health check for authDb
 */
export async function checkAuthDbHealth() {
  try {
    await authDb.$queryRaw`SELECT 1`;
    return { status: 'healthy', database: 'authDb' };
  } catch (error) {
    console.error('[authDb] Health check failed:', error);
    return { status: 'unhealthy', database: 'authDb', error: String(error) };
  }
}
