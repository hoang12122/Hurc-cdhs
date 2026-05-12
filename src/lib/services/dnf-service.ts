import { opsDb, IS_DATABASE_OFFLINE } from '../prisma';
import { jsonDb } from '../db/json-db';
import type { DnfDocument } from '../types';

/**
 * CORE LOGIC ONLY - NO 'use server'
 * Refactored for Robust Offline Mode (Phase 3 & 4).
 * Standards: Using 'dnf_documents' and 'corrective_actions' collections.
 * Schema Standardization (Task 4.3): Including both Prisma fields and UI-friendly aliases.
 */

/**
 * DNF MAPPER: Standardizes Internal Objects for UI Consistency
 */
export function mapInternalDnfToUi(dnf: any): DnfDocument {
    if (!dnf) return dnf;
    
    // 1. Core Identifiers
    const id = dnf.id || dnf.failureReportNo;
    const code = dnf.code || id;
    
    // 2. UI Friendly Fields
    const title = dnf.title || dnf.descriptionOfFailure?.substring(0, 100) || 'Untitled DNF';
    const description = dnf.description || dnf.descriptionOfFailure;
    
    // 3. Station/Equipment Mapping (Standardization Task 4.3)
    const stationId = dnf.stationId || dnf.locationOfFailure;
    const equipmentId = dnf.equipmentId || dnf.failedComponentEquipmentLRUTrainNumber;

    // 4. Time Formatting (Ensure ISO Strings)
    const createdAt = typeof dnf.createdAt === 'object' ? dnf.createdAt.toISOString() : (dnf.createdAt || new Date().toISOString());
    const updatedAt = typeof dnf.updatedAt === 'object' ? dnf.updatedAt.toISOString() : (dnf.updatedAt || new Date().toISOString());

    return {
        ...dnf,
        id,
        code,
        title,
        description,
        stationId,
        locationOfFailure: stationId,
        equipmentId,
        failedComponentEquipmentLRUTrainNumber: equipmentId,
        status: dnf.status || 'Mới lập',
        priority: dnf.priority || 'Trung bình',
        createdAt,
        updatedAt,
        isArchived: dnf.isArchived || false
    } as unknown as DnfDocument;
}

export async function getDnfsInternal(): Promise<DnfDocument[]> {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const dnfs = await opsDb.dnfDocument.findMany({
                where: { isArchived: false },
                include: { correctiveActions: true },
                orderBy: { createdAt: 'desc' },
                take: 200,
            });
            return dnfs.map(mapInternalDnfToUi);
        } catch (e) { /* fallback */ }
    }
    const all = await jsonDb.getCollection<any>('dnf_documents');
    return all.filter((d: any) => !d.isArchived).map(mapInternalDnfToUi);
}

export async function getDnfByIdInternal(id: string): Promise<DnfDocument | undefined> {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const dnf = await opsDb.dnfDocument.findUnique({
                where: { id },
                include: { correctiveActions: true }
            });
            if (dnf) return mapInternalDnfToUi(dnf);
        } catch (e) { /* fallback */ }
    }

    // Offline Detail with Relations
    const item = await jsonDb.findFirst<any>('dnf_documents', (d: any) => d.id === id);
    if (!item) return undefined;

    const cas = await jsonDb.getCollection<any>('corrective_actions');
    const relatedCas = cas.filter((ca: any) => ca.dnfId === id);

    return mapInternalDnfToUi({
        ...item,
        correctiveActions: relatedCas
    });
}

export async function createDnfInternal(newId: string, data: any, userId: string) {
    // 1. Basic Validation (Safety first)
    if (!data.descriptionOfFailure || !data.locationOfFailure) {
        throw new Error("Missing required DNF fields: descriptionOfFailure or locationOfFailure");
    }

    if (!IS_DATABASE_OFFLINE) {
        try {
            return await opsDb.dnfDocument.create({
                data: {
                    id: newId,
                    ...data,
                    createdById: userId,
                    dateTimeOfFailureOccurrence: new Date(data.dateTimeOfFailureOccurrence || Date.now()),
                    completedDate: data.completedDate ? new Date(data.completedDate) : null,
                    systemRestoredTime: data.systemRestoredTime ? new Date(data.systemRestoredTime) : null,
                    statusHistory: [] as any,
                    isArchived: false,
                }
            });
        } catch (e) { /* fallback */ }
    }

    // 2. Task 4.3: Standardized Schema mapping & Task 4.4: Default Status
    const standardizedData = {
        id: newId,
        code: newId, // Alias for ID/Report Number
        title: data.descriptionOfFailure?.substring(0, 100) || 'Untitled DNF', 
        description: data.descriptionOfFailure,
        stationId: data.locationOfFailure,
        equipmentId: data.failedComponentEquipmentLRUTrainNumber || 'N/A',
        status: data.status || 'Mới lập', // Enforce default status
        priority: data.priority || 'Trung bình',
        createdBy: userId,
        ...data,
        createdById: userId,
        dateTimeOfFailureOccurrence: new Date(data.dateTimeOfFailureOccurrence || Date.now()).toISOString(),
        completedDate: data.completedDate ? new Date(data.completedDate).toISOString() : null,
        systemRestoredTime: data.systemRestoredTime ? new Date(data.systemRestoredTime).toISOString() : null,
        statusHistory: [],
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    return await jsonDb.insertRecord<any>('dnf_documents', standardizedData);
}

export async function updateDnfInternal(id: string, data: any) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await opsDb.dnfDocument.update({
                where: { id },
                data: {
                    ...data,
                    dateTimeOfFailureOccurrence: data.dateTimeOfFailureOccurrence ? new Date(data.dateTimeOfFailureOccurrence) : undefined,
                    completedDate: data.completedDate ? new Date(data.completedDate) : null,
                    systemRestoredTime: data.systemRestoredTime ? new Date(data.systemRestoredTime) : null,
                }
            });
        } catch (e) { /* fallback */ }
    }

    // 1. Explicit existence check for "clear error" requirement
    const existing = await jsonDb.findFirst<any>('dnf_documents', (d: any) => d.id === id);
    if (!existing) {
        throw new Error(`Cannot update: DNF record with ID ${id} was not found in offline storage.`);
    }

    // 2. Task 4.3: Apply mapping to updates if fields are present
    const updatePayload: any = {
        ...data,
        updatedAt: new Date().toISOString()
    };

    if (data.descriptionOfFailure) {
        updatePayload.title = data.descriptionOfFailure.substring(0, 100);
        updatePayload.description = data.descriptionOfFailure;
    }
    if (data.locationOfFailure) updatePayload.stationId = data.locationOfFailure;
    if (data.failedComponentEquipmentLRUTrainNumber) updatePayload.equipmentId = data.failedComponentEquipmentLRUTrainNumber;

    if (data.dateTimeOfFailureOccurrence) {
        updatePayload.dateTimeOfFailureOccurrence = new Date(data.dateTimeOfFailureOccurrence).toISOString();
    }
    if (data.completedDate !== undefined) {
        updatePayload.completedDate = data.completedDate ? new Date(data.completedDate).toISOString() : null;
    }
    if (data.systemRestoredTime !== undefined) {
        updatePayload.systemRestoredTime = data.systemRestoredTime ? new Date(data.systemRestoredTime).toISOString() : null;
    }

    // 3. Perform partial update and return the full merged record
    return await jsonDb.updateRecord<any>('dnf_documents', id, updatePayload);
}

export async function deleteDnfInternal(id: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            await opsDb.correctiveAction.deleteMany({ where: { dnfId: id } });
            await opsDb.dnfDocument.delete({ where: { id } });
            return;
        } catch (e) { /* fallback */ }
    }

    await jsonDb.delete('dnf_documents', (d: any) => d.id === id);
    await jsonDb.delete('corrective_actions', (ca: any) => ca.dnfId === id);
}

export async function countDnfsByPrefixInternal(prefix: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await opsDb.dnfDocument.count({
                where: { id: { startsWith: prefix } }
            });
        } catch (e) { /* fallback */ }
    }
    const all = await jsonDb.getCollection<any>('dnf_documents');
    return all.filter((d: any) => d.id.startsWith(prefix)).length;
}

export async function notifyDnfAlertInternal(id: string, description: string) {
    if (IS_DATABASE_OFFLINE) {
        console.info("[OFFLINE] DNF Alert suppressed:", id);
        return;
    }
    const payload = {
        title: '⚡ Sự cố mức độ cao',
        message: `DNF ${id} vừa được lập: ${description.substring(0, 50)}...`,
        level: 'CRITICAL',
        link: `/dnf/${id}`
    };
    try {
        await opsDb.$executeRawUnsafe(`NOTIFY system_alerts, '${JSON.stringify(payload).replace(/'/g, "''")}'`);
    } catch(e) { console.error("SSE Notification Error:", e); }
}

export async function getDnfsPaginatedInternal(skip: number, take: number, whereClause: any) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const [total, dnfs] = await Promise.all([
                opsDb.dnfDocument.count({ where: whereClause }),
                opsDb.dnfDocument.findMany({
                    where: whereClause,
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take,
                })
            ]);
            return { total, dnfs: dnfs.map(mapInternalDnfToUi) };
        } catch (e) { /* fallback */ }
    }

    const all = await jsonDb.getCollection<any>('dnf_documents');
    
    // Advanced Offline Filtering (Task 4.4)
    const filtered = all.filter((d: any) => {
        // 1. Basic archived filter
        if (d.isArchived) return false;

        // 2. Status Filter
        if (whereClause?.status) {
            const statusFilter = whereClause.status;
            if (typeof statusFilter === 'string' && d.status !== statusFilter) return false;
            if (statusFilter.in && !statusFilter.in.includes(d.status)) return false;
            if (statusFilter.notIn && statusFilter.notIn.includes(d.status)) return false;
        }

        // 3. Station Filter (stationId or locationOfFailure)
        if (whereClause?.locationOfFailure && d.locationOfFailure !== whereClause.locationOfFailure) return false;
        if (whereClause?.stationId && d.stationId !== whereClause.stationId) return false;

        // 4. Equipment Filter (failedComponentEquipmentLRUTrainNumber or equipmentId)
        if (whereClause?.failedComponentEquipmentLRUTrainNumber && d.failedComponentEquipmentLRUTrainNumber !== whereClause.failedComponentEquipmentLRUTrainNumber) return false;
        if (whereClause?.equipmentId && d.equipmentId !== whereClause.equipmentId) return false;

        // 5. Keyword Search (OR logic across multiple fields)
        if (whereClause?.OR) {
            const searchTerms = whereClause.OR;
            const matches = searchTerms.some((term: any) => {
                const key = Object.keys(term)[0];
                const value = term[key]?.contains?.toLowerCase();
                if (!value) return false;
                
                // Search in title, description, code, or failure report number
                const target = (d[key] || '').toString().toLowerCase();
                return target.includes(value);
            });
            if (!matches) return false;
        }

        return true;
    });
    
    // Sort by createdAt desc manually for consistency
    const sorted = [...filtered].sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    const page = Math.floor(skip / take) + 1;
    const result = await jsonDb.paginate(sorted, page, take);
    return { total: result.total, dnfs: result.data.map(mapInternalDnfToUi) };
}

// Corrective Actions
export async function createCorrectiveActionInternal(dnfId: string, data: any) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await opsDb.correctiveAction.create({
                data: {
                    id: `CA-${Date.now()}`,
                    dnfId: dnfId,
                    ...data,
                    completedAt: data.completedAt ? new Date(data.completedAt) : null,
                    dateTimeNotified: data.dateTimeNotified ? new Date(data.dateTimeNotified) : null,
                    dateTimeArrival: data.dateTimeArrival ? new Date(data.dateTimeArrival) : null,
                }
            });
        } catch (e) { /* fallback */ }
    }

    return await jsonDb.insertRecord<any>('corrective_actions', {
        id: `CA-${Date.now()}`,
        dnfId,
        ...data,
        completedAt: data.completedAt ? new Date(data.completedAt).toISOString() : null,
        dateTimeNotified: data.dateTimeNotified ? new Date(data.dateTimeNotified).toISOString() : null,
        dateTimeArrival: data.dateTimeArrival ? new Date(data.dateTimeArrival).toISOString() : null,
    });
}

export async function updateCorrectiveActionInternal(id: string, data: any) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await opsDb.correctiveAction.update({
                where: { id },
                data: {
                    ...data,
                    completedAt: data.completedAt ? new Date(data.completedAt) : null,
                    dateTimeNotified: data.dateTimeNotified ? new Date(data.dateTimeNotified) : null,
                    dateTimeArrival: data.dateTimeArrival ? new Date(data.dateTimeArrival) : null,
                }
            });
        } catch (e) { /* fallback */ }
    }

    return await jsonDb.updateRecord<any>('corrective_actions', id, {
        ...data,
        completedAt: data.completedAt !== undefined ? (data.completedAt ? new Date(data.completedAt).toISOString() : null) : undefined,
        dateTimeNotified: data.dateTimeNotified !== undefined ? (data.dateTimeNotified ? new Date(data.dateTimeNotified).toISOString() : null) : undefined,
        dateTimeArrival: data.dateTimeArrival !== undefined ? (data.dateTimeArrival ? new Date(data.dateTimeArrival).toISOString() : null) : undefined,
    });
}

export async function deleteCorrectiveActionInternal(id: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            await opsDb.correctiveAction.delete({ where: { id } });
            return;
        } catch (e) { /* fallback */ }
    }
    await jsonDb.delete('corrective_actions', (ca: any) => ca.id === id);
}

export async function getDnfsToArchiveInternal() {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await opsDb.dnfDocument.findMany({
                where: { status: 'Đã đóng', isArchived: false },
                select: { id: true },
            });
        } catch(e) {}
    }
    const all = await jsonDb.getCollection<any>('dnf_documents');
    return all.filter((d: any) => d.status === 'Đã đóng' && !d.isArchived).map((d: any) => ({ id: d.id }));
}

export async function archiveDnfBatchInternal(ids: string[], placeholder: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            await opsDb.$transaction(
                ids.map((id) =>
                    opsDb.dnfDocument.update({
                        where: { id },
                        data: {
                            isArchived: true,
                            descriptionOfFailure: placeholder,
                            impactAssessment: placeholder,
                            resolutionDetails: placeholder,
                            attachments: [] as any
                        }
                    })
                )
            );
            return;
        } catch(e) {}
    }

    for (const id of ids) {
        await jsonDb.updateRecord<any>('dnf_documents', id, {
            isArchived: true,
            descriptionOfFailure: placeholder,
            impactAssessment: placeholder,
            resolutionDetails: placeholder,
            attachments: []
        });
    }
}
