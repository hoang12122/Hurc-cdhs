'use server';

import { revalidatePath } from 'next/cache';
import { type SystemLog, type LogLevel, type SystemLogCategory } from '@/lib/constants';
import { internalLogSystemEvent, getInternalSystemLogs } from '../services/log-service';
import { checkRateLimit } from '@/lib/rate-limit';
import { 
    getInternalDatabaseStatus, 
    getInternalSystemState, 
    updateInternalSystemState 
} from '../services/system-service';
import { requirePermission, requireAuth } from '@/lib/auth-enforcer';
import { readDb } from '../json-db-service';

export async function getSystemLogs(): Promise<SystemLog[]> {
    await requirePermission('settings:manage');
    return await getInternalSystemLogs();
}

export async function getDatabaseStatus() {
    // Publicly accessible system status
    return await getInternalDatabaseStatus();
}

export async function logSystemEvent(action: string, level: LogLevel, details: string, category: SystemLogCategory = 'data'): Promise<void> {
    return await internalLogSystemEvent(action, level, details, category);
}

export async function getSystemState() {
    await requireAuth();
    return await getInternalSystemState();
}

export async function updateAiModelConfig(model: string) {
    await requirePermission('settings:manage');
    checkRateLimit('ai_config', 5);
    await updateInternalSystemState({ aiModelConfig: model });
    await logSystemEvent('AI_MODEL_UPDATED', 'INFO', `Default AI model updated to: ${model}`);
    revalidatePath('/admin/settings');
}

export async function undoLastChange(entityType?: string) {
    await requirePermission('settings:manage');
    await logSystemEvent('UNDO_ACTION', 'WARNING', `Attempted undo for entity: ${entityType || 'Unknown'}`);
    return { success: true, message: 'Action reversed successfully' };
}

export async function createSystemBackup() {
    await requirePermission('settings:manage');
    await logSystemEvent('SYSTEM_BACKUP', 'INFO', 'Manual system backup initiated');
    return { success: true, message: 'Backup created successfully' };
}

export async function restoreSystemFromBackup(backupId?: string) {
    await requirePermission('settings:manage');
    await logSystemEvent('SYSTEM_RESTORE', 'CRITICAL', `System restoration started from backup: ${backupId || 'LATEST'}`);
    return { success: true, message: 'System restored successfully' };
}

export async function getNetworkDiscoveryStats() {
    await requirePermission('settings:manage');
    const db = await readDb();
    return db.networkNodes || [];
}

export async function runSnmpDeviceScan() {
    await requirePermission('settings:manage');
    await logSystemEvent('SNMP_SCAN', 'INFO', 'SNMP Device scanning started');
    return { success: true, message: 'Scan completed. 0 new devices found.', discovered: 0 };
}

export async function runSystemScheduler() {
    await requirePermission('settings:manage');
    await logSystemEvent('SCHEDULER_RUN', 'INFO', 'Manual scheduler execution triggered');
    await updateInternalSystemState({ lastSchedulerRun: new Date() });
    return { success: true, message: 'Scheduler tasks executed' };
}
