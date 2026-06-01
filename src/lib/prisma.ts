import { DB_CONFIG } from './config/db-config';
import { IS_DATABASE_OFFLINE } from './config/database-mode';
import { opsDb } from './db/ops-db';
import { authDb } from './db/auth-db';
import { aiDb } from './db/ai-db';
import { metroDb } from './db/metro-db';

export { IS_DATABASE_OFFLINE, opsDb, authDb, aiDb, metroDb };

// Default export maps to opsDb for backward compatibility
export default opsDb;

/**
 * Task 17.2: Prisma Connection Timeout Wrapper
 * 
 * Races a Prisma query against a configurable timeout (default: 2500ms).
 * When the database is unreachable (e.g., during tunnel inspections without connectivity),
 * this prevents the application from freezing for the default 30-second TCP timeout.
 * 
 * Usage:
 *   const result = await runPrismaWithTimeout(prisma.user.findMany());
 * 
 * On timeout, throws an Error("Prisma Connection Timeout") which upstream
 * services can catch to fallback to jsonDb seamlessly.
 */
export async function runPrismaWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 2500
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error('Prisma Connection Timeout')),
        timeoutMs
      )
    ),
  ]);
}
