import { revalidatePath } from 'next/cache';
import { type LogLevel, type SystemLogCategory } from '../constants';
import { opsDb, IS_DATABASE_OFFLINE } from '../prisma';
import { readAllLogs, appendLog } from './log-writer';
import { getSessionUser } from './auth-service';
import { logToFullStack } from '../logger';

/**
 * CORE LOGIC ONLY - NO 'use server'
 * Refactored for Phase 4: Atomic Offline Logging.
 */
export async function internalLogSystemEvent(
    action: string, 
    level: LogLevel, 
    details: string, 
    category: SystemLogCategory = 'data'
): Promise<void> {
    try {
        const user = await getSessionUser();
        
        const newLog = {
            id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            timestamp: new Date().toISOString(),
            userId: user?.id || 'system',
            userName: user?.name || 'System',
            action,
            level,
            details,
            category,
        };

        // Ghi log sang Loki (Full Stack) - Try/Catch inside to prevent block
        try {
            await logToFullStack(level as any, `[${action}] ${details}`, { 
                userId: newLog.userId, 
                userName: newLog.userName,
                category 
            });
        } catch { /* Suppress Loki errors */ }

        if (!IS_DATABASE_OFFLINE) {
            try {
                await opsDb.systemLog.create({
                    data: { ...newLog }
                });
                try { revalidatePath('/admin/system-logs'); } catch {}
                return;
            } catch (dbError) {
                console.warn("[LOG-SERVICE] Primary DB failed, falling back to JSON for log entry.");
            }
        }

        // Persist to structured log files (always)
        await appendLog(newLog);

        
        try { revalidatePath('/admin/system-logs'); } catch {}
    } catch (e) {
        console.error("Critical error in internalLogSystemEvent:", e);
    }
}

export async function getInternalSystemLogs(): Promise<any[]> {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const logs = await opsDb.systemLog.findMany({
                orderBy: { timestamp: 'desc' },
                take: 2000,
            });
            return logs.map((l: any) => ({ ...l, timestamp: new Date(l.timestamp).toISOString() }));
        } catch (e) {
            console.warn("[LOG-SERVICE] Failed to fetch logs from Postgres, falling back to JSON.");
        }
    }
    
    // Fallback: read from structured log files
    const fileLogs = await readAllLogs();
    // Ensure newest first and limit
    return fileLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 2000);
}
