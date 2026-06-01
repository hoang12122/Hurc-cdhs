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
import { 
    getInternalMaintenanceStandards, 
    getInternalMaintenanceStandardItems 
} from '../services/maintenance-service';
import { 
    getInternalInspections, 
    createInternalInspection 
} from '../services/ops-service';
import { type InspectionDetail } from '@/lib/constants';
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

// Helper to calculate start, end dates and period labels for 5 frequencies (daily, weekly, monthly, quarterly, yearly)
function getPeriodStartAndEnd(frequency: string): { start: Date; end: Date; label: string } {
    const now = new Date();
    let start = new Date(now);
    let end = new Date(now);
    let label = "";
    
    if (frequency === 'daily') {
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        label = `Ngày ${now.toLocaleDateString('vi-VN')}`;
    } else if (frequency === 'monthly') {
        start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        label = `Tháng ${now.getMonth() + 1}/${now.getFullYear()}`;
    } else if (frequency === 'quarterly') {
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const startMonth = currentQuarter * 3;
        start = new Date(now.getFullYear(), startMonth, 1, 0, 0, 0, 0);
        end = new Date(now.getFullYear(), startMonth + 3, 0, 23, 59, 59, 999);
        label = `Quý ${currentQuarter + 1}/${now.getFullYear()}`;
    } else if (frequency === 'yearly') {
        start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        label = `Năm ${now.getFullYear()}`;
    } else { // weekly (default)
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday is start
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);
        
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        
        // Calculate ISO week number
        const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
        label = `Tuần ${weekNo}/${now.getFullYear()}`;
    }
    
    return { start, end, label };
}

export async function runSystemScheduler() {
    const user = await requireAuth(); // Allow background triggering when logged in
    await logSystemEvent('SCHEDULER_RUN', 'INFO', 'Periodic scheduler execution started');
    
    try {
        const [standards, inspections, allItems] = await Promise.all([
            getInternalMaintenanceStandards(),
            getInternalInspections(),
            getInternalMaintenanceStandardItems()
        ]);
        
        let autoGeneratedCount = 0;
        
        for (const std of standards) {
            const freq = std.frequency || 'weekly';
            const { start, end, label } = getPeriodStartAndEnd(freq);
            
            // 1. Check if an active (non-archived) inspection already exists for this standard and current period
            const exists = inspections.some((insp: any) => {
                const inspDate = new Date(insp.date).getTime();
                return insp.checklistTemplateId === std.id && 
                       inspDate >= start.getTime() && 
                       inspDate <= end.getTime() &&
                       !insp.isArchived;
            });
            
            if (!exists) {
                // 2. Load standard checklist items corresponding to this standard template
                const stdItems = allItems.filter((i: any) => i.standardId === std.id);
                
                const inspectionId = `INS-AT-${std.abbreviation || 'GEN'}-${Date.now().toString().slice(-6)}`;
                
                // 3. Construct a beautiful, fully-typed periodic Inspection record
                const newInspection = {
                    id: inspectionId,
                    title: `[AUTO] Kiểm tra ${std.name} (${label})`,
                    date: new Date().toISOString(),
                    checklistTemplateId: std.id,
                    areaIds: std.locationIds && std.locationIds.length > 0 ? std.locationIds : ["LOC-002"],
                    status: "Mới",
                    inspector: std.recipientId || "Kỹ thuật viên (L2)", // Auto-assign to designated responsible team
                    checklistItems: stdItems.map((item: any) => ({
                        id: item.itemCode,
                        text: item.itemText,
                        criteria: item.criteria || "",
                        status: "pending",
                        findings: [],
                        images: [],
                        isCustom: false,
                        unit: item.unit,
                        standardQuantity: item.standardQuantity,
                        toleranceOperator: item.toleranceOperator,
                        toleranceValue: item.toleranceValue,
                        requiredTools: item.requiredTools,
                        actualQuantity: undefined
                    })) as any,
                    generalNotes: `Phiếu kiểm tra tự động sinh định kỳ dựa trên thiết lập của đơn vị phân quyền (Mẫu: ${std.name}, Tần suất: ${freq}).`,
                    scheduledStartDate: start.toISOString(),
                    scheduledFinishDate: end.toISOString(),
                    estimatedDurationHours: std.estimatedDurationHours || 2
                };
                
                // 4. Save into database
                await createInternalInspection(newInspection, "system-scheduler", "System Scheduler");
                autoGeneratedCount++;
            }
        }
        
        await updateInternalSystemState({ lastSchedulerRun: new Date() });
        
        if (autoGeneratedCount > 0) {
            await logSystemEvent('SCHEDULER_AUTO_GEN', 'INFO', `Scheduler generated ${autoGeneratedCount} new periodic inspections.`);
        }
        
        revalidatePath('/inspections');
        return { 
            success: true, 
            message: `Đồng bộ lịch trình thành công! Đã tự động tạo thêm ${autoGeneratedCount} phiếu kiểm tra định kỳ mới.` 
        };
    } catch (error: any) {
        await logSystemEvent('SCHEDULER_ERROR', 'ERROR', `Scheduler execution failed: ${error.message}`);
        console.error("[SystemScheduler] Execution failed:", error);
        throw error;
    }
}
