// @ts-ignore
import { PrismaClient as AuthClient } from '@/lib/generated/auth';
// @ts-ignore
import { PrismaClient as OpsClient } from '@/lib/generated/ops';
// @ts-ignore
import { PrismaClient as AiClient } from '@/lib/generated/ai';
// @ts-ignore
import { PrismaClient as MetroClient } from '@/lib/generated/metro';

/**
 * Database Connection Pool Configuration
 * 
 * Data Classification:
 * - T1 CRITICAL (authDb): User auth, roles, sessions — small pool, fast queries
 * - T2 HIGH (opsDb): DNF, hazards, inspections — larger pool for concurrent ops
 * - T3 STANDARD (aiDb): AI conversations, knowledge — moderate pool
 * - T4 LOW (metroDb): Telemetry, assets — moderate pool with longer timeouts
 */

const LOG_LEVELS: any[] = process.env.NODE_ENV === 'development' 
    ? ['warn', 'error'] 
    : ['error'];

const authClientSingleton = () => {
    return new AuthClient({
        log: LOG_LEVELS,
        datasources: { db: { url: process.env.AUTH_DATABASE_URL } },
    });
}

const opsClientSingleton = () => {
    return new OpsClient({
        log: LOG_LEVELS,
        datasources: { db: { url: process.env.OPS_DATABASE_URL } },
    });
}

const aiClientSingleton = () => {
    return new AiClient({
        log: LOG_LEVELS,
        datasources: { db: { url: process.env.AI_DATABASE_URL } },
    });
}

const metroClientSingleton = () => {
    return new MetroClient({
        log: LOG_LEVELS,
        datasources: { db: { url: process.env.METRO_DATABASE_URL } },
    });
}

declare global {
    var prismaAuthGlobalV2: undefined | ReturnType<typeof authClientSingleton>;
    var prismaOpsGlobalV2: undefined | ReturnType<typeof opsClientSingleton>;
    var prismaAiGlobal: undefined | ReturnType<typeof aiClientSingleton>;
    var prismaMetroGlobal: undefined | ReturnType<typeof metroClientSingleton>;
}

export const authDb = globalThis.prismaAuthGlobalV2 ?? authClientSingleton();
export const opsDb = globalThis.prismaOpsGlobalV2 ?? opsClientSingleton();
export const aiDb = globalThis.prismaAiGlobal ?? aiClientSingleton();
export const metroDb = globalThis.prismaMetroGlobal ?? metroClientSingleton();

if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaAuthGlobalV2 = authDb;
    globalThis.prismaOpsGlobalV2 = opsDb;
    globalThis.prismaAiGlobal = aiDb;
    globalThis.prismaMetroGlobal = metroDb;
}

// ============ CONNECTION HEALTH ============

/**
 * Check all database connections. Useful for health endpoints.
 */
export async function checkDatabaseConnections(): Promise<{
    auth: boolean;
    ops: boolean;
    ai: boolean;
    metro: boolean;
}> {
    const check = async (db: any, label: string): Promise<boolean> => {
        try {
            await db.$queryRaw`SELECT 1`;
            return true;
        } catch (e) {
            console.error(`[DB] ${label} connection failed:`, e);
            return false;
        }
    };

    const [auth, ops, ai, metro] = await Promise.all([
        check(authDb, 'Auth'),
        check(opsDb, 'Ops'),
        check(aiDb, 'AI'),
        check(metroDb, 'Metro'),
    ]);

    return { auth, ops, ai, metro };
}

// ============ GRACEFUL SHUTDOWN ============

async function disconnectAll() {
    await Promise.allSettled([
        authDb.$disconnect(),
        opsDb.$disconnect(),
        aiDb.$disconnect(),
        metroDb.$disconnect(),
    ]);
}

if (typeof process !== 'undefined') {
    process.on('beforeExit', disconnectAll);
}
