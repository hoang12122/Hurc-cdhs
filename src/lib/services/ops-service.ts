import { opsDb, aiDb, IS_DATABASE_OFFLINE } from '../prisma';
import { jsonDb } from '../db/json-db';
import { aiDbProvider } from './db-wrapper';

/**
 * CORE LOGIC ONLY - NO 'use server'
 * This service handles operational entities: Hazards, Inspections, Comments, Improvements.
 * Refactored for Robust Offline Mode (Phase 3).
 */

import { type HazardRecord, type InspectionDetail } from '../types';

/**
 * HAZARD MAPPER: Standardizes HazardRecord for UI Consistency
 */
export function mapInternalHazardToUi(hazard: any): HazardRecord {
    if (!hazard) return hazard;

    // 1. Core Identifiers & Metadata
    const id = hazard.id;
    
    // 2. Risk Level Mapping (Standardization)
    const riskLevelId = hazard.riskLevelId || hazard.riskLevel;

    // 3. Time Formatting (Ensure ISO Strings)
    const identificationDate = typeof hazard.identificationDate === 'object' ? hazard.identificationDate.toISOString() : hazard.identificationDate;
    const dueDate = typeof hazard.dueDate === 'object' ? hazard.dueDate.toISOString() : hazard.dueDate;
    const createdAt = typeof hazard.createdAt === 'object' ? hazard.createdAt.toISOString() : (hazard.createdAt || new Date().toISOString());
    const updatedAt = typeof hazard.updatedAt === 'object' ? hazard.updatedAt.toISOString() : (hazard.updatedAt || new Date().toISOString());

    return {
        ...hazard,
        id,
        riskLevelId,
        riskLevel: riskLevelId, // Keep both for UI compatibility
        identificationDate,
        dueDate: dueDate || null,
        status: hazard.status || 'Mới lập',
        createdAt,
        updatedAt,
        isArchived: hazard.isArchived || false,
        locationIds: hazard.locationIds || []
    } as unknown as HazardRecord;
}

/**
 * INSPECTION MAPPER: Standardizes InspectionDetail for UI Consistency
 */
export function mapInternalInspectionToUi(inspection: any): InspectionDetail {
    if (!inspection) return inspection;

    // 1. Core Metadata
    const id = inspection.id;
    const date = typeof inspection.date === 'object' ? inspection.date.toISOString() : inspection.date;
    const createdAt = typeof inspection.createdAt === 'object' ? inspection.createdAt.toISOString() : (inspection.createdAt || new Date().toISOString());
    const updatedAt = typeof inspection.updatedAt === 'object' ? inspection.updatedAt.toISOString() : (inspection.updatedAt || new Date().toISOString());
    const lastStatusUpdateAt = typeof inspection.lastStatusUpdateAt === 'object' ? inspection.lastStatusUpdateAt.toISOString() : inspection.lastStatusUpdateAt;

    return {
        ...inspection,
        id,
        date,
        inspectionDate: date, // Alias for UI consistency if needed
        createdAt,
        updatedAt,
        lastStatusUpdateAt,
        status: inspection.status || 'Draft',
        isArchived: inspection.isArchived || false,
        areaIds: inspection.areaIds || (inspection.stationId ? [inspection.stationId] : [])
    } as unknown as InspectionDetail;
}

// --- HAZARDS ---
export async function getInternalHazards(): Promise<HazardRecord[]> {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const records = await opsDb.hazardRecord.findMany({ 
                where: { isArchived: false },
                orderBy: { identificationDate: 'desc' } 
            });
            return records.map(mapInternalHazardToUi);
        } catch (e) { 
            console.warn("[OFFLINE-GUARD] Prisma failed for getInternalHazards, falling back to JSON.");
        }
    }
    const all = await jsonDb.getCollection<any>('hazards');
    return all.filter((h: any) => !h.isArchived).map(mapInternalHazardToUi);
}

export async function getInternalHazardsPaginated(skip: number, take: number, where: any) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const [total, records] = await Promise.all([
                opsDb.hazardRecord.count({ where }),
                opsDb.hazardRecord.findMany({
                    where,
                    orderBy: { identificationDate: 'desc' },
                    skip,
                    take,
                })
            ]);
            return { total, records: records.map(mapInternalHazardToUi) };
        } catch (e) { /* fallback */ }
    }
    
    const all = await jsonDb.getCollection<any>('hazards');
    const filtered = await jsonDb.applyFilters(all, {
        status: where?.status,
        priority: where?.priority,
        riskLevel: where?.riskLevelId,
        isArchived: false as any
    });
    
    const page = Math.floor(skip / take) + 1;
    const result = await jsonDb.paginate(filtered, page, take);
    return { total: result.total, records: result.data.map(mapInternalHazardToUi) };
}

export async function createInternalHazard(data: any, userId: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const hazard = await opsDb.hazardRecord.create({
                data: {
                    ...data,
                    createdById: userId,
                    identificationDate: new Date(data.identificationDate),
                    dueDate: data.dueDate ? new Date(data.dueDate) : null,
                    isArchived: false
                }
            });
            return mapInternalHazardToUi(hazard);
        } catch (e) { /* fallback */ }
    }

    const hazard = await jsonDb.insertRecord('hazards', {
        ...data,
        id: data.id || undefined, // Let helper generate UUID if missing
        createdById: userId,
        identificationDate: new Date(data.identificationDate).toISOString(),
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        statusHistory: [],
        isArchived: false
    });
    return mapInternalHazardToUi(hazard);
}

export async function updateInternalHazard(id: string, data: any) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const hazard = await opsDb.hazardRecord.update({
                where: { id },
                data: {
                    ...data,
                    identificationDate: data.identificationDate ? new Date(data.identificationDate) : undefined,
                    dueDate: data.dueDate ? new Date(data.dueDate) : null,
                }
            });
            return mapInternalHazardToUi(hazard);
        } catch (e) { /* fallback */ }
    }

    const hazard = await jsonDb.updateRecord('hazards', id, {
        ...data,
        identificationDate: data.identificationDate ? new Date(data.identificationDate).toISOString() : undefined,
        dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate).toISOString() : null) : undefined,
    });
    return mapInternalHazardToUi(hazard);
}

export async function deleteInternalHazard(id: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            await opsDb.hazardRecord.delete({ where: { id } });
            return { id };
        } catch (e) { /* fallback */ }
    }
    await jsonDb.delete('hazards', (h: any) => h.id === id);
    return { id };
}

export async function getInternalHazardById(id: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const hazard = await opsDb.hazardRecord.findUnique({ where: { id } });
            return mapInternalHazardToUi(hazard);
        } catch (e) { /* fallback */ }
    }
    const hazard = await jsonDb.findFirst('hazards', (h: any) => h.id === id);
    return mapInternalHazardToUi(hazard);
}

export async function countHazardsByPrefix(prefix: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await opsDb.hazardRecord.count({ where: { id: { startsWith: prefix } } });
        } catch (e) { /* fallback */ }
    }
    const all = await jsonDb.getCollection('hazards');
    return all.filter((h: any) => h.id.startsWith(prefix)).length;
}

// --- INSPECTIONS ---
export async function getInternalInspections() {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const records = await opsDb.inspectionDetail.findMany({
                where: { isArchived: false },
                orderBy: { date: 'desc' },
                take: 100
            });
            return records.map(mapInternalInspectionToUi);
        } catch (e) { /* ignore */ }
    }
    const all = await jsonDb.getCollection<any>('inspections');
    return all.map(mapInternalInspectionToUi);
}

export async function getInternalInspectionsPaginated(skip: number, take: number, where: any) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const [total, records] = await Promise.all([
                opsDb.inspectionDetail.count({ where }),
                opsDb.inspectionDetail.findMany({
                    where,
                    orderBy: { date: 'desc' },
                    skip,
                    take,
                })
            ]);
            return { total, records: records.map(mapInternalInspectionToUi) };
        } catch (e) { 
            console.error("[OPS-SERVICE] Prisma query failed, falling back to JSON:", e);
        }
    }

    const all = await jsonDb.getCollection<any>('inspections');
    const filtered = await jsonDb.applyFilters(all, {
        status: where?.status,
        stationId: where?.stationId,
        isArchived: false as any
    });

    const page = Math.floor(skip / take) + 1;
    const result = await jsonDb.paginate(filtered, page, take);
    return { total: result.total, records: result.data.map(mapInternalInspectionToUi) };
}

export async function createInternalInspection(data: any, userId: string, userName: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const inspection = await opsDb.inspectionDetail.create({
                data: {
                    ...data,
                    id: data.id || `INS-${Date.now()}`,
                    inspector: data.inspector || userId,
                    date: new Date(data.date),
                    status: data.status || 'Draft',
                    isArchived: false,
                    lastStatusUpdateBy: userName,
                    lastStatusUpdateAt: new Date(),
                }
            });
            return mapInternalInspectionToUi(inspection);
        } catch (e) { /* fallback */ }
    }

    const inspection = await jsonDb.insertRecord('inspections', {
        ...data,
        inspector: data.inspector || userId,
        date: new Date(data.date).toISOString(),
        status: data.status || 'Draft',
        isArchived: false,
        lastStatusUpdateBy: userName,
        lastStatusUpdateAt: new Date().toISOString()
    });
    return mapInternalInspectionToUi(inspection);
}

export async function updateInternalInspection(id: string, data: any, userName: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const inspection = await opsDb.inspectionDetail.update({
                where: { id },
                data: {
                    ...data,
                    date: data.date ? new Date(data.date) : undefined,
                    lastStatusUpdateBy: userName,
                    lastStatusUpdateAt: new Date(),
                }
            });
            return mapInternalInspectionToUi(inspection);
        } catch (e) { /* fallback */ }
    }

    const inspection = await jsonDb.updateRecord('inspections', id, {
        ...data,
        date: data.date ? new Date(data.date).toISOString() : undefined,
        lastStatusUpdateBy: userName,
        lastStatusUpdateAt: new Date().toISOString()
    });
    return mapInternalInspectionToUi(inspection);
}

export async function deleteInternalInspection(id: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            await opsDb.inspectionDetail.delete({ where: { id } });
            return { id };
        } catch (e) { /* fallback */ }
    }
    await jsonDb.delete('inspections', (i: any) => i.id === id);
    return { id };
}

export async function getInternalInspectionById(id: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const inspection = await opsDb.inspectionDetail.findUnique({ 
                where: { id }
            });
            return mapInternalInspectionToUi(inspection);
        } catch (e) { /* fallback */ }
    }
    const inspection = await jsonDb.findFirst('inspections', (i: any) => i.id === id);
    return mapInternalInspectionToUi(inspection);
}

export async function archiveInternalInspections(ids: string[], placeholder: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            await opsDb.$transaction(
                ids.map((id) =>
                    opsDb.inspectionDetail.update({
                        where: { id },
                        data: {
                            isArchived: true,
                            generalNotes: placeholder,
                            approvalComments: placeholder,
                            checklistItems: [] as any
                        }
                    })
                )
            );
            return;
        } catch (e) { 
            console.warn("[OFFLINE-GUARD] Transaction failed for archiveInternalInspections, using manual JSON update loop.");
        }
    }

    // Offline Batch Update
    for (const id of ids) {
        await jsonDb.updateRecord<any>('inspections', id, {
            isArchived: true,
            generalNotes: placeholder,
            approvalComments: placeholder,
            checklistItems: []
        });
    }
}

// --- COMMENTS ---
export async function getInternalComments(entityId: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await opsDb.comment.findMany({
                where: { entityId },
                orderBy: { timestamp: 'asc' }
            });
        } catch (e) { /* fallback */ }
    }
    const all = await jsonDb.getCollection('comments');
    return all.filter((c: any) => c.entityId === entityId);
}

export async function createInternalComment(entityId: string, senderId: string, senderName: string, content: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await opsDb.comment.create({
                data: {
                    id: `CMT-${Date.now()}`,
                    entityId,
                    senderId,
                    senderName,
                    content,
                }
            });
        } catch (e) { /* fallback */ }
    }

    return await jsonDb.insertRecord<any>('comments', {
        entityId,
        senderId,
        senderName,
        content,
        timestamp: new Date().toISOString()
    });
}

// --- IMPROVEMENTS ---
export async function getInternalImprovements() {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await opsDb.improvement.findMany({ orderBy: { submissionDate: 'desc' } });
        } catch (e) { /* fallback */ }
    }
    return await jsonDb.getCollection('improvements');
}

export async function createInternalImprovement(data: any, userId: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await opsDb.improvement.create({
                data: {
                    ...data,
                    id: `IMP-${Date.now()}`,
                    createdById: userId,
                    submissionDate: new Date(),
                }
            });
        } catch (e) { /* fallback */ }
    }

    return await jsonDb.insertRecord('improvements', {
        ...data,
        createdById: userId,
        submissionDate: new Date().toISOString()
    });
}

export async function updateInternalImprovement(id: string, data: any) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await opsDb.improvement.update({
                where: { id },
                data
            });
        } catch (e) { /* fallback */ }
    }
    return await jsonDb.updateRecord('improvements', id, data);
}

export async function deleteInternalImprovement(id: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await opsDb.improvement.delete({ where: { id } });
        } catch (e) { /* fallback */ }
    }
    await jsonDb.delete('improvements', (i: any) => i.id === id);
    return { id };
}

// --- AI KNOWLEDGE ---
export async function getInternalKnowledge() {
    return await aiDbProvider.findMany<any>('AiKnowledgeSnippet');
}

// Global SSE
export async function sendGlobalNotify(payload: any) {
    if (IS_DATABASE_OFFLINE) {
        console.info("[OFFLINE] SSE Notification suppressed:", payload.action);
        return;
    }
    try {
        await opsDb.$executeRawUnsafe(`NOTIFY system_alerts, '${JSON.stringify(payload).replace(/'/g, "''")}'`);
    } catch(e) { console.error("SSE Notification Error:", e); }
}
