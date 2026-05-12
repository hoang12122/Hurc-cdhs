// @ts-ignore - Module will be available after npx prisma generate
import { PrismaClient } from '@prisma/client';
import { DB_CONFIG } from './config/db-config';

// Backward compatibility for legacy services that haven't been refactored yet
export const IS_DATABASE_OFFLINE = DB_CONFIG.useFallback;

let prisma: PrismaClient | null = null;

if (!IS_DATABASE_OFFLINE) {
  const globalForPrisma = global as unknown as { prisma: PrismaClient };
  
  prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
      datasourceUrl: DB_CONFIG.postgres.opsUrl || '',
      log: ['error', 'warn'], // Minimized logs to reduce clutter
    });
    
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
} else {
  // Explicitly set to null to ensure no accidental calls succeed
  prisma = null;
}

// Will be null if fallback is enabled. Services should use db-wrapper instead of prisma directly.
export default prisma;

export const opsDb = prisma as any;
export const authDb = prisma as any;
export const aiDb = prisma as any;
export const metroDb = prisma as any;
