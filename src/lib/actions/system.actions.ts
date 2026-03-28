'use server';

import { revalidatePath } from 'next/cache';
import { type SystemLog, type LogLevel, type SystemLogCategory } from '@/lib/constants';
import { hasPermission } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { getMaintenanceStandards } from './maintenance.actions';
import { format } from 'date-fns';
import * as snmp from 'net-snmp';
import { archiveCompletedDnfs } from './dnf.actions';
import { archiveCompletedInspections } from './inspection.actions';
import { archiveCompletedHazards } from './hazard.actions';
import { opsDb } from '@/lib/prisma';
import { runTelemetryPoller } from '@/lib/services/telemetry-poller';
import { protectedAction, authenticatedAction } from '../auth-enforcer';

export async function saveSetupConfig(data: any): Promise<{success: boolean; error?: string}> {
    return protectedAction('settings:manage', async () => {
        return { success: false, error: "Setup feature is disabled." };
    });
}

export async function getSystemLogs(): Promise<SystemLog[]> {
    return protectedAction('settings:manage', async () => {
        const logs = await opsDb.systemLog.findMany({
            orderBy: { timestamp: 'desc' },
            take: 500
        });
        return logs.map((l: any) => ({ ...l, timestamp: l.timestamp.toISOString() })) as SystemLog[];
    });
}

export async function logSystemEvent(action: string, level: LogLevel, details: string, category: SystemLogCategory = 'data'): Promise<void> {
    const { getCurrentUser } = await import('./auth.actions');
    const user = await getCurrentUser();
    
    await opsDb.systemLog.create({
        data: {
            id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            timestamp: new Date(),
            userId: user?.id || 'system',
            userName: user?.name || 'System',
            action,
            level,
            details,
            category
        }
    });

    revalidatePath('/admin/system-logs');
}

export async function createSystemBackup(): Promise<boolean> {
    return protectedAction('settings:manage', async () => {
        try {
            // In a real Postgres environment, backup is handled externally (e.g. pg_dump)
            await logSystemEvent('SYSTEM_BACKUP', 'INFO', 'Manual backup triggered (Not implemented in DB mode).', 'network');
            return true;
        } catch(e) {
            console.error("Manual backup failed:", e);
            await logSystemEvent('SYSTEM_BACKUP_FAILED', 'CRITICAL', 'Manual system data backup failed.', 'network');
            return false;
        }
    });
}

export async function restoreSystemFromBackup(): Promise<boolean> {
    return protectedAction('settings:manage', async () => {
        // Restoration is handled via external DB tools.
        await logSystemEvent('SYSTEM_RESTORE_FAILED', 'ERROR', 'Restore is not supported in DB mode via this UI.', 'network');
        revalidatePath('/');
        return false;
    });
}

export async function getSystemState() {
    const state = await opsDb.systemState.findFirst();
    return state ? { aiModelConfig: state.aiModelConfig, lastSchedulerRun: state.lastSchedulerRun?.toISOString() } : {};
}

export async function updateAiModelConfig(model: string) {
    return protectedAction('settings:manage', async () => {
        await checkRateLimit('ai_config', 5);
        
        const existing = await opsDb.systemState.findFirst();
        if (existing) {
            await opsDb.systemState.update({
                where: { id: existing.id },
                data: { aiModelConfig: model }
            });
        } else {
            await opsDb.systemState.create({
                data: { id: 1, aiModelConfig: model }
            });
        }

        await logSystemEvent('AI_MODEL_UPDATED', 'INFO', `Default AI model updated to: ${model}`);
        revalidatePath('/admin/settings');
    });
}

export async function undoLastChange(entityType: string): Promise<boolean> {
    return authenticatedAction(async () => {
        // Not supported in Postgres without a complex audit log/event sourcing setup
        await logSystemEvent('UNDO_ACTION', 'WARNING', `Undo not supported in current database mode.`);
        return false;
    });
}

interface DeviceInfo {
    ip: string;
    sysName?: string;
    sysDescr?: string;
    macAddress?: string;
}

async function queryDevice(host: string, community: string): Promise<DeviceInfo | null> {
    return new Promise((resolve) => {
        const session = snmp.createSession(host, community, { timeout: 2000, version: snmp.Version2c });
        const oids = {
            sysName: '1.3.6.1.2.1.1.5.0',
            sysDescr: '1.3.6.1.2.1.1.1.0',
            ifPhysAddress: '1.3.6.1.2.1.2.2.1.6',
        };

        const deviceInfo: DeviceInfo = { ip: host };

        session.get([oids.sysName, oids.sysDescr], (error: any, varbinds: any) => {
            if (error) {
                session.close();
                return resolve(null); // Device is likely unreachable or not an SNMP device
            }

            varbinds.forEach((vb: any) => {
                if (snmp.isVarbindError(vb)) {
                    console.error(`Error in varbind for ${host}: ${snmp.varbindError(vb)}`);
                } else {
                    if (vb.oid === oids.sysName) deviceInfo.sysName = vb.value.toString();
                    if (vb.oid === oids.sysDescr) deviceInfo.sysDescr = vb.value.toString();
                }
            });

            if (!deviceInfo.sysName && !deviceInfo.sysDescr) {
                 session.close();
                 return resolve(null);
            }
            
            session.subtree(oids.ifPhysAddress, (error: any, macVarbinds: any) => {
                if (error) {
                    // Not a critical error
                } else {
                     const firstValidMac = macVarbinds
                        .map((vb: any) => {
                            if (!vb.value || vb.value.length === 0) return null;
                            const mac = Buffer.isBuffer(vb.value) ? vb.value.toString('hex').match(/../g)?.join(':') : vb.value.toString();
                            return mac && mac !== "00:00:00:00:00:00" && mac.length > 0 ? mac : null;
                        })
                        .find((mac: any) => mac !== null);
                    deviceInfo.macAddress = firstValidMac || undefined;
                }
                
                session.close();
                resolve(deviceInfo);
            });
        });
    });
}

function parseCidr(cidr: string): string[] {
    const [ip, prefixStr] = cidr.split('/');
    const prefix = parseInt(prefixStr, 10);

    if (!ip || isNaN(prefix) || prefix < 0 || prefix > 32) {
        return [];
    }

    const ipParts = ip.split('.').map(Number);
    if (ipParts.length !== 4 || ipParts.some(isNaN)) {
        return [];
    }

    const startIpNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
    const mask = -1 << (32 - prefix);
    const network = startIpNum & mask;
    const broadcast = network | ~mask;
    
    const ips = [];
    for (let i = network + 1; i < broadcast; i++) {
        const ipStr = `${(i >> 24) & 255}.${(i >> 16) & 255}.${(i >> 8) & 255}.${i & 255}`;
        ips.push(ipStr);
    }
    return ips;
}

export async function runSnmpDeviceScan(isAutoScan: boolean = false): Promise<{ discovered: number }> {
    const performScan = async () => {
        const subnets = process.env.SNMP_SUBNETS;
        const community = process.env.SNMP_COMMUNITY || 'public';

        if (!subnets) {
            await logSystemEvent('SNMP_SCAN_FAILED', 'ERROR', 'SNMP_SUBNETS is not configured in .env file.', 'network');
            return { discovered: 0 };
        }

        const subnetList = subnets.split(',').map(s => s.trim());
        const ipRangeToScan = subnetList.flatMap(parseCidr);

        if (ipRangeToScan.length === 0) {
            await logSystemEvent('SNMP_SCAN_FAILED', 'ERROR', 'Could not parse any valid IP addresses from SNMP_SUBNETS.', 'network');
            return { discovered: 0 };
        }

        await logSystemEvent('SNMP_SCAN_STARTED', 'INFO', `Starting SNMP scan for subnets: ${subnets}`, 'network');

        const scanPromises = ipRangeToScan.map(ip => queryDevice(ip, community));
        const results = await Promise.all(scanPromises);
        const discoveredDevices = results.filter((device): device is DeviceInfo => device !== null);

        if (discoveredDevices.length > 0) {
            for (const device of discoveredDevices) {
                await logSystemEvent('SNMP_DEVICE_DISCOVERED', 'INFO', `Found device: ${device.sysName || 'N/A'} | IP: ${device.ip}`, 'network');
            }
        }

        await logSystemEvent('SNMP_SCAN_COMPLETE', 'INFO', `Scan finished. Discovered ${discoveredDevices.length} devices.`, 'network');
        revalidatePath('/admin/system-logs');
        return { discovered: discoveredDevices.length };
    };

    if (isAutoScan) {
        return performScan();
    }
    
    return protectedAction('settings:manage', performScan);
}

export const runSystemScheduler = async (): Promise<void> => {
    let state = await opsDb.systemState.findFirst();
    if (!state) {
        state = await opsDb.systemState.create({ data: { id: 1 } });
    }
    
    const now = new Date();
    const lastRun = state.lastSchedulerRun ? state.lastSchedulerRun : new Date(0);
    const runInterval = 60 * 1000;

    if (now.getTime() - lastRun.getTime() < runInterval) {
        return;
    }
    
    console.log("Running System Scheduler...");
    
    // --- TASK 1: Run Preventive Maintenance Inspection Creator ---
    console.log("Scheduler: Checking for preventive maintenance inspections to create...");
    const standards = await getMaintenanceStandards();
    const standardsToSchedule = standards.filter(s => s.frequency && s.frequency !== 'general');
    
    for (const standard of standardsToSchedule) {
        const existingInspectionsForStandard = await opsDb.inspectionDetail.findMany({
            where: { checklistTemplateId: standard.id }
        });
        
        let shouldCreate = false;
        
        const today = new Date(new Date().toLocaleString('en-US', { timeZone: "Asia/Ho_Chi_Minh" }));
        today.setHours(0, 0, 0, 0);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        
        const lastCreatedAutoInspection = existingInspectionsForStandard
            .filter((i: any) => i.title.startsWith('[AUTO]'))
            .sort((a: any, b: any) => a.date.getTime() - b.date.getTime())
            .pop();

        let scheduledTimeToday = new Date(today);
        if (standard.scheduledTime) {
            const [hours, minutes] = standard.scheduledTime.split(':');
            scheduledTimeToday.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        } else {
            scheduledTimeToday.setHours(7, 0, 0, 0); // Default to 7 AM
        }

        if (now < scheduledTimeToday) {
            continue;
        }

        switch(standard.frequency) {
            case 'daily':
                if (!lastCreatedAutoInspection || lastCreatedAutoInspection.date.toDateString() !== today.toDateString()) {
                    shouldCreate = true;
                }
                break;
            case 'weekly':
                if (!lastCreatedAutoInspection || lastCreatedAutoInspection.date < startOfWeek) {
                    shouldCreate = true;
                }
                break;
            case 'monthly':
                if (!lastCreatedAutoInspection || lastCreatedAutoInspection.date.getMonth() !== today.getMonth()) {
                    shouldCreate = true;
                }
                break;
        }

        if (shouldCreate && standard.locationIds && standard.locationIds.length > 0) {
             const datePart = format(today, 'ddMMyy');
             const abbreviation = standard.abbreviation || standard.name.substring(0, 3).toUpperCase();
             const idPrefix = `INS-AT-${abbreviation}-${datePart}-`;
             
             const todaysAutoInspections = await opsDb.inspectionDetail.count({
                 where: { id: { startsWith: idPrefix } }
             });
             
             const newCounter = todaysAutoInspections + 1;
             const newId = `${idPrefix}${String(newCounter).padStart(4, '0')}`;

             const newInspectionData = {
                id: newId,
                title: `[AUTO] ${standard.name}`,
                areaIds: standard.locationIds,
                checklistTemplateId: standard.id,
                date: today,
                scheduledStartDate: today,
                scheduledFinishDate: new Date(today.getTime() + (standard.estimatedDurationHours || 24*7) * 3600 * 1000),
                status: 'Chưa thực hiện',
                inspector: 'L2 Technician', 
                generalNotes: `Automatically generated based on ${standard.frequency} schedule.`,
                checklistItems: [] as any,
                estimatedDurationHours: standard.estimatedDurationHours,
                isArchived: false
            };
            
            await opsDb.inspectionDetail.create({ data: newInspectionData });
            await logSystemEvent('CREATE_INSPECTION_AUTO', 'INFO', `Scheduler created inspection: ${newInspectionData.title}`);
        }
    }

    // --- TASK 2: Daily Backup at 00:00 AM ---
    let backupSucceeded = true;
    const currentHourInVN = new Date(now.toLocaleString('en-US', { timeZone: "Asia/Ho_Chi_Minh" })).getHours();
    const lastRunHourInVN = lastRun ? new Date(lastRun.toLocaleString('en-US', { timeZone: "Asia/Ho_Chi_Minh" })).getHours() : -1;

    if (currentHourInVN === 0 && lastRunHourInVN !== 0) {
        console.log("Scheduler: Running daily backup... (Skip in Postgres)");
        await logSystemEvent('SYSTEM_BACKUP_AUTO', 'INFO', 'Automatic daily backup simulated.', 'network');
    }

    // --- TASK 3: Hourly Data Archiving (only if backup did not fail) ---
    if (backupSucceeded && lastRunHourInVN !== currentHourInVN) {
        console.log("Scheduler: Running hourly data archive...");
        const dnfCount = await archiveCompletedDnfs();
        const inspCount = await archiveCompletedInspections();
        const hazCount = await archiveCompletedHazards();
        if (dnfCount > 0 || inspCount > 0 || hazCount > 0) {
            await logSystemEvent('ARCHIVE_DATA_AUTO', 'INFO', `Archived ${dnfCount} DNFs, ${inspCount} inspections, ${hazCount} hazards.`, 'network');
        }
    }
    
    // --- TASK 4: Continuous SNMP Scan ---
    console.log("Scheduler: Running periodic SNMP scan...");
    await runSnmpDeviceScan(true);

    // --- TASK 5: Metro Telemetry Polling ---
    console.log("Scheduler: Running Metro Telemetry Poller...");
    await runTelemetryPoller();
    
    await opsDb.systemState.update({
        where: { id: state.id },
        data: { lastSchedulerRun: now }
    });
    console.log("System Scheduler finished.");
};
