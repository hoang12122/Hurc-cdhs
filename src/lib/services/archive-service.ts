import { opsDb, IS_DATABASE_OFFLINE } from '../prisma';
import { jsonDb } from '../db/json-db';
import { internalLogSystemEvent } from './log-service';

/**
 * CORE LOGIC ONLY - NO 'use server'
 * Refactored for Phase 4: Standardized Archiving & Atomic JSON operations.
 */

export async function archiveCompletedDnfs() {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const result = await opsDb.dnfDocument.updateMany({
                where: {
                    status: 'Đã đóng',
                    isArchived: false,
                    completedDate: {
                        lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days old
                    }
                },
                data: { isArchived: true }
            });
            if (result.count > 0) {
                await internalLogSystemEvent('ARCHIVE_DNF', 'INFO', `Archived ${result.count} closed DNFs.`);
            }
            return result.count;
        } catch (e) { /* fallback */ }
    }

    // Offline Archiving Logic
    const threshold = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime();
    const dnfs = await jsonDb.getCollection<any>('dnf_documents');
    const toArchive = dnfs.filter((d: any) => 
        d.status === 'Đã đóng' && 
        !d.isArchived && 
        new Date(d.completedDate || 0).getTime() < threshold
    );

    for (const dnf of toArchive) {
        await jsonDb.updateRecord<any>('dnf_documents', dnf.id, { isArchived: true });
    }

    if (toArchive.length > 0) {
        await internalLogSystemEvent('ARCHIVE_DNF_OFFLINE', 'INFO', `Archived ${toArchive.length} closed DNFs in JSON.`);
    }
    return toArchive.length;
}

export async function archiveCompletedInspections() {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const result = await opsDb.inspectionDetail.updateMany({
                where: {
                    status: { in: ['Hoàn thành', 'Đã xem xét'] },
                    isArchived: false,
                    date: {
                        lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    }
                },
                data: { isArchived: true }
            });
            if (result.count > 0) {
                await internalLogSystemEvent('ARCHIVE_INSPECTION', 'INFO', `Archived ${result.count} completed inspections.`);
            }
            return result.count;
        } catch (e) { /* fallback */ }
    }

    // Offline Archiving
    const threshold = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime();
    const inspections = await jsonDb.getCollection<any>('inspections');
    const toArchive = inspections.filter((i: any) => 
        ['Hoàn thành', 'Đã xem xét'].includes(i.status) && 
        !i.isArchived && 
        new Date(i.date || 0).getTime() < threshold
    );

    for (const insp of toArchive) {
        await jsonDb.updateRecord<any>('inspections', insp.id, { isArchived: true });
    }

    if (toArchive.length > 0) {
        await internalLogSystemEvent('ARCHIVE_INSPECTION_OFFLINE', 'INFO', `Archived ${toArchive.length} completed inspections in JSON.`);
    }
    return toArchive.length;
}

export async function archiveCompletedHazards() {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const result = await opsDb.hazardRecord.updateMany({
                where: {
                    status: 'Đã đóng',
                    isArchived: false,
                    createdAt: {
                        lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days
                    }
                },
                data: { isArchived: true }
            });
            if (result.count > 0) {
                await internalLogSystemEvent('ARCHIVE_HAZARD', 'INFO', `Archived ${result.count} closed hazards.`);
            }
            return result.count;
        } catch (e) { /* fallback */ }
    }

    // Offline Archiving
    const threshold = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).getTime();
    const hazards = await jsonDb.getCollection<any>('hazards');
    const toArchive = hazards.filter((h: any) => 
        h.status === 'Đã đóng' && 
        !h.isArchived && 
        new Date(h.createdAt || 0).getTime() < threshold
    );

    for (const h of toArchive) {
        await jsonDb.updateRecord<any>('hazards', h.id, { isArchived: true });
    }

    if (toArchive.length > 0) {
        await internalLogSystemEvent('ARCHIVE_HAZARD_OFFLINE', 'INFO', `Archived ${toArchive.length} closed hazards in JSON.`);
    }
    return toArchive.length;
}
