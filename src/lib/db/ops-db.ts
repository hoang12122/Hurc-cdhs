// src/lib/db/ops-db.ts
import { PrismaClient } from '../../../.prisma-runtime/ops';
import { DB_CONFIG } from '../config/db-config';
import { IS_DATABASE_OFFLINE } from '../config/database-mode';

/**
 * Singleton instance for Operations Database (opsDb)
 * Responsible for business logic: DNF, Hazards, Inspections, etc.
 */

const globalForOps = global as unknown as { opsDb: PrismaClient };

// Prepare URL with timeouts safely
const opsUrlStr = process.env.OPS_DATABASE_URL || DB_CONFIG.postgres.opsUrl;
let opsUrl: URL;

try {
  // Use a placeholder if the URL is missing to prevent build-time crashes (ERR_INVALID_URL)
  opsUrl = new URL(opsUrlStr || 'postgresql://localhost:5432/unused');
} catch (e) {
  opsUrl = new URL('postgresql://localhost:5432/unused');
}

opsUrl.searchParams.set('connect_timeout', DB_CONFIG.resiliency.ops.connectTimeout.toString());
opsUrl.searchParams.set('pool_timeout', DB_CONFIG.resiliency.ops.poolTimeout.toString());

export const opsDb =
  globalForOps.opsDb ||
  (!IS_DATABASE_OFFLINE
    ? new PrismaClient({
        datasourceUrl: opsUrl.toString(),
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
    : (null as any));

if (process.env.NODE_ENV !== 'production' && opsDb) globalForOps.opsDb = opsDb;

// Check connection count only in ONLINE mode
 if (process.env.NODE_ENV === 'development' && !IS_DATABASE_OFFLINE && opsDb) {
   opsDb.$connect()
     .then(() => {
       console.log('[opsDb] Connected successfully.');
     })
     .catch(err => {
       console.error('[opsDb] Connection failed:', err.message);
     });
 }

export default opsDb;

/**
 * Health check for opsDb
 */
export async function checkOpsDbHealth() {
  try {
    await opsDb.$queryRaw`SELECT 1`;
    return { status: 'healthy', database: 'opsDb' };
  } catch (error) {
    console.error('[opsDb] Health check failed:', error);
    return { status: 'unhealthy', database: 'opsDb', error: String(error) };
  }
}
