// @ts-ignore - Module will be available after npx prisma generate
import { PrismaClient } from '@prisma/client';
import { DB_CONFIG } from './config/db-config';

let prisma: PrismaClient | null = null;

if (!DB_CONFIG.useFallback) {
  const globalForPrisma = global as unknown as { prisma: PrismaClient };
  
  prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
      datasourceUrl: DB_CONFIG.postgres.opsUrl || '',
      log: ['query', 'info', 'warn', 'error'],
    });
    
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
}

// Will be null if fallback is enabled. Services should use db-wrapper instead of prisma directly.
export default prisma;

// Backward compatibility for legacy services that haven't been refactored yet
export const IS_DATABASE_OFFLINE = DB_CONFIG.useFallback;
export const opsDb = prisma as any;
export const authDb = prisma as any;
export const aiDb = prisma as any;
export const metroDb = prisma as any;
