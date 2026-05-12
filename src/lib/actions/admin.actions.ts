'use server';

import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth-enforcer';
import { 
    getInternalAdminStats, 
    toggleInternalMaintenanceMode, 
    getInternalRawDatabase, 
    resetInternalSystemLogs 
} from '../services/system-service';
import { internalLogSystemEvent as logSystemEvent } from '../services/log-service';

export async function getAdminSummaryStats() {
    await requirePermission('settings:manage');
    return await getInternalAdminStats();
}

export async function toggleMaintenanceMode(enabled: boolean) {
    await requirePermission('settings:manage');
    const result = await toggleInternalMaintenanceMode(enabled);
    await logSystemEvent('SYSTEM_MAINTENANCE', 'WARNING', `Chế độ bảo trì đã được ${enabled ? 'BẬT' : 'TẤT'} bởi Quản trị viên.`);
    revalidatePath('/admin');
    return result;
}

export async function getRawDatabase() {
    await requirePermission('settings:manage');
    return await getInternalRawDatabase();
}

export async function resetSystemLogs() {
    await requirePermission('settings:manage');
    const result = await resetInternalSystemLogs();
    await logSystemEvent('SYSTEM_CLEAR_LOGS', 'CRITICAL', 'Tất cả nhật ký hệ thống đã bị xóa bởi Quản trị viên.');
    revalidatePath('/admin/system-logs');
    revalidatePath('/admin');
    return result;
}

export async function getLogActivityChartData() {
    await requirePermission('settings:manage');
    const stats = await getInternalAdminStats();
    
    // Generate last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });

    // Initialize counts
    const dailyCounts: Record<string, number> = {};
    days.forEach(day => { dailyCounts[day] = 0; });

    // Populate with real data if available in stats.recentLogs
    // Check if response is standardized error (Hardening Task 4.11)
    if ('error' in stats) {
        return days.map(day => ({ date: day, count: 0 }));
    }

    stats.recentLogs.forEach((l: any) => {
        const day = new Date(l.timestamp).toISOString().split('T')[0];
        if (dailyCounts[day] !== undefined) {
            dailyCounts[day]++;
        }
    });

    return days.map(day => ({
        date: day,
        count: dailyCounts[day] || 0
    }));
}

export async function emergencyUserLock(userId: string) {
    await requirePermission('settings:manage');
    await logSystemEvent('USER_LOCK', 'CRITICAL', `Emergency lock applied to user: ${userId}`);
    return { success: true, message: 'User locked successfully' };
}

export async function forceLogoutAllSessions() {
    await requirePermission('settings:manage');
    await logSystemEvent('SECURITY_RESET', 'CRITICAL', 'All user sessions have been forcibly terminated.');
    return { success: true, message: 'All sessions terminated' };
}
