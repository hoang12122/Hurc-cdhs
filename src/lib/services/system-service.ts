import { authDb, opsDb, IS_DATABASE_OFFLINE } from '../prisma';
import { jsonDb } from '../db/json-db';
import { createErrorResponse, handleJsonDbError } from '../utils/error-handler';
import { readAllLogs, clearLogs } from './log-writer';

/**
 * CORE LOGIC ONLY - NO 'use server'
 * Refactored for Phase 4: Standardized Keys & Atomic JSON operations.
 */

export async function getInternalDatabaseStatus() {
    try {
        if (IS_DATABASE_OFFLINE) return { isOffline: true };
        await opsDb.$queryRaw`SELECT 1`;
        return { isOffline: false };
    } catch (e) {
        return { isOffline: true };
    }
}

export async function getInternalSystemState() {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const state = await opsDb.systemState.findFirst();
            return state || { id: 1, lastSchedulerRun: null, aiModelConfig: 'gemini-1.5-pro' };
        } catch (e) { /* fallback */ }
    }
    return { id: 1, lastSchedulerRun: null, aiModelConfig: 'gemini-1.5-pro' };
}

export async function updateInternalSystemState(data: any) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const existing = await opsDb.systemState.findFirst();
            if (existing) {
                return await opsDb.systemState.update({
                    where: { id: existing.id },
                    data
                });
            } else {
                return await opsDb.systemState.create({
                    data: { id: 1, ...data }
                });
            }
        } catch (e) { /* fallback */ }
    }
    return { id: 1, ...data };
}

export async function getInternalAdminStats() {
    let stats = {
        totalUsers: 0,
        activeUsers: 0,
        totalRoles: 0,
        totalLogs: 0,
        recentLogs: [] as any[],
        dbSize: 0,
        lastBackup: 'N/A',
        isMaintenanceMode: false,
        isDatabaseOffline: false
    };

    if (!IS_DATABASE_OFFLINE) {
        try {
            const [userCount, activeCount, roleCount, logCount, recentLogs] = await Promise.all([
                authDb.user.count(),
                authDb.user.count({ where: { status: 'active' } }),
                authDb.role.count(),
                opsDb.systemLog.count(),
                opsDb.systemLog.findMany({ take: 5, orderBy: { timestamp: 'desc' } })
            ]);

            stats.totalUsers = userCount;
            stats.activeUsers = activeCount;
            stats.totalRoles = roleCount;
            stats.totalLogs = logCount;
            stats.recentLogs = recentLogs.map((l: any) => ({ ...l, timestamp: l.timestamp.toISOString() }));
            return stats;
        } catch (e) { /* fallback */ }
    }

    try {
        // Offline Fallback
        const [users, logs] = await Promise.all([
            jsonDb.getCollection<any>('users'),
            readAllLogs()
        ]);

        stats.totalUsers = users.length;
        stats.activeUsers = users.filter((u: any) => u.status === 'active').length;
        stats.totalRoles = 0; // Simplified for offline
        stats.totalLogs = logs.length;
        stats.recentLogs = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
        stats.isDatabaseOffline = true;
        
        return stats;
    } catch (e) {
        return handleJsonDbError(e);
    }
}

export async function toggleInternalMaintenanceMode(enabled: boolean) {
    try {
        // Storing maintenance mode in systemSettings collection
        await jsonDb.updateRecord<any>('systemSettings', 'global', { isMaintenanceMode: enabled });
        return { success: true, enabled };
    } catch (e) {
        return handleJsonDbError(e);
    }
}

export async function getInternalRawDatabase() {
    try {
        // This provides the full JSON for debug/export
        const all = await jsonDb.getCollection<any>('dnf_documents'); // Just a sample or we'd need a multi-get
        return JSON.stringify({ dnfDocuments: all }, null, 2);
    } catch (e) {
        return handleJsonDbError(e);
    }
}

export async function resetInternalSystemLogs() {
    try {
        await clearLogs();
        return { success: true };
    } catch (e) {
        return handleJsonDbError(e);
    }
}

/**
 * DATABASE MAINTENANCE: Cleanup & Vacuum (Online-Only)
 * TODO: Implement offline JSON compaction in Phase 5.
 */
export async function cleanupDatabaseInternal() {
    if (IS_DATABASE_OFFLINE) {
        return createErrorResponse(
            "OFFLINE_UNSUPPORTED",
            "This feature (Database Cleanup) is not available in Offline Mode.",
            { hint: "Dọn dẹp bộ nhớ JSON (db.json) chưa được triển khai." }
        );
    }
    
    try {
        await opsDb.$executeRaw`VACUUM FULL;`;
        return { success: true, message: "Database vacuumed successfully." };
    } catch (e: any) {
        return createErrorResponse("INTERNAL_ERROR", e.message);
    }
}
