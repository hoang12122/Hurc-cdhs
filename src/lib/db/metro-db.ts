// src/lib/db/metro-db.ts
import { PrismaClient } from '../../../.prisma-runtime/metro';
import { DB_CONFIG } from '../config/db-config';
import { IS_DATABASE_OFFLINE } from '../config/database-mode';

/**
 * Singleton instance for Metro & Telemetry Database (metroDb)
 * Responsible for: Assets, telemetry metrics, SNMP configurations.
 */

const globalForMetro = global as unknown as { metroDb: PrismaClient };

// Prepare URL with timeouts safely
const metroUrlStr = process.env.METRO_DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/hurc_metro?schema=public';
let metroUrl: URL;

try {
  // Use a placeholder if the URL is missing to prevent build-time crashes (ERR_INVALID_URL)
  metroUrl = new URL(metroUrlStr || 'postgresql://localhost:5432/unused');
} catch (e) {
  metroUrl = new URL('postgresql://localhost:5432/unused');
}

metroUrl.searchParams.set('connect_timeout', DB_CONFIG.resiliency.ops.connectTimeout.toString());
metroUrl.searchParams.set('pool_timeout', DB_CONFIG.resiliency.ops.poolTimeout.toString());

export const metroDb =
  globalForMetro.metroDb ||
  (!IS_DATABASE_OFFLINE
    ? new PrismaClient({
        datasourceUrl: metroUrl.toString(),
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
    : (null as any));

if (process.env.NODE_ENV !== 'production' && metroDb) globalForMetro.metroDb = metroDb;

// Check connection count only in ONLINE mode
if (process.env.NODE_ENV === 'development' && !IS_DATABASE_OFFLINE && metroDb) {
  metroDb.$connect()
    .then(() => {
      console.log('[metroDb] Connected successfully.');
    })
    .catch(err => {
      console.error('[metroDb] Connection failed:', err.message);
    });
}

export default metroDb;

/**
 * Health check for metroDb
 */
export async function checkMetroDbHealth() {
  try {
    await metroDb.$queryRaw`SELECT 1`;
    return { status: 'healthy', database: 'metroDb' };
  } catch (error) {
    console.error('[metroDb] Health check failed:', error);
    return { status: 'unhealthy', database: 'metroDb', error: String(error) };
  }
}
