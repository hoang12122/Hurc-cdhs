'use server';

import { revalidatePath } from 'next/cache';
import { type DnfDocument, type CorrectiveAction } from '@/lib/types';
import { internalLogSystemEvent as logSystemEvent } from '../services/log-service';
import { 
    getDnfsInternal, 
    getDnfByIdInternal,
    createDnfInternal, 
    updateDnfInternal, 
    deleteDnfInternal,
    getDnfsPaginatedInternal,
    countDnfsByPrefixInternal,
    notifyDnfAlertInternal,
    createCorrectiveActionInternal,
    updateCorrectiveActionInternal,
    deleteCorrectiveActionInternal
} from '../services/dnf-service';
import { requirePermission, requireAuth } from '@/lib/auth-enforcer';

/**
 * FETCH ALL DNFS
 */
export async function getDnfs(): Promise<DnfDocument[]> {
    await requireAuth();
    return await getDnfsInternal();
}

/**
 * FETCH PAGINATED DNFS WITH FILTERS
 */
export async function getDnfsPaginated(params: { 
    page: number; 
    pageSize: number; 
    searchTerm?: string;
    statuses?: string[];
    subsystems?: string[];
    assignedSubsystems?: string[];
    hazardLevels?: string[];
    startDate?: string;
    endDate?: string;
    priorities?: number[];
}) {
    await requireAuth();
    const skip = (params.page - 1) * params.pageSize;
    
    // Construct where clause
    const where: any = { isArchived: false };
    
    if (params.searchTerm) {
        where.OR = [
            { id: { contains: params.searchTerm, mode: 'insensitive' } },
            { descriptionOfFailure: { contains: params.searchTerm, mode: 'insensitive' } },
            { locationOfFailure: { contains: params.searchTerm, mode: 'insensitive' } }
        ];
    }
    
    if (params.statuses?.length) where.status = { in: params.statuses };
    if (params.subsystems?.length) where.subsystemIds = { hasSome: params.subsystems };
    if (params.assignedSubsystems?.length) where.subsystemIds = { hasSome: params.assignedSubsystems };
    if (params.hazardLevels?.length) where.hazardLevelId = { in: params.hazardLevels };
    
    if (params.startDate || params.endDate) {
        where.dateTimeOfFailureOccurrence = {};
        if (params.startDate) where.dateTimeOfFailureOccurrence.gte = new Date(params.startDate);
        if (params.endDate) where.dateTimeOfFailureOccurrence.lte = new Date(params.endDate);
    }
    
    const { total, dnfs } = await getDnfsPaginatedInternal(skip, params.pageSize, where);
    
    return {
        data: dnfs,
        metadata: {
            total,
            pages: Math.ceil(total / params.pageSize)
        }
    };
}

/**
 * FETCH DNF BY ID
 */
export async function getDnfById(id: string): Promise<DnfDocument | null> {
    await requireAuth();
    const dnf = await getDnfByIdInternal(id);
    return (dnf as unknown as DnfDocument) || null;
}

/**
 * ADD NEW DNF RECORD
 */
export async function addDnf(dnf: Omit<DnfDocument, 'id'|'createdAt'|'updatedAt'|'createdById'|'statusHistory'|'isArchived'|'correctiveActions'>): Promise<DnfDocument> {
    const user = await requirePermission('dnf:manage');
    
    // Generate ID
    const sys = dnf.subsystemIds?.[0] || 'GEN';
    const count = await countDnfsByPrefixInternal(`DNF-${sys}-`);
    const newId = `DNF-${sys}-${String(count + 1).padStart(3, '0')}`;
    
    const record = await createDnfInternal(newId, dnf, user.id);
    
    if (record.priority === 'Cao') {
        await notifyDnfAlertInternal(record.id, record.descriptionOfFailure);
    }
    
    await logSystemEvent('CREATE_DNF', 'INFO', `Created DNF record: ${record.id}`);
    revalidatePath('/dnf');
    revalidatePath('/dashboard');
    return record as unknown as DnfDocument;
}

/**
 * UPDATE DNF RECORD
 */
export async function updateDnf(updatedDnf: DnfDocument): Promise<void> {
    await requirePermission('dnf:manage');
    await updateDnfInternal(updatedDnf.id, updatedDnf);
    await logSystemEvent('UPDATE_DNF', 'INFO', `Updated DNF record: ${updatedDnf.id}`);
    revalidatePath('/dnf');
    revalidatePath(`/dnf/${updatedDnf.id}`);
    revalidatePath('/dashboard');
}

/**
 * DELETE DNF RECORD
 */
export async function deleteDnf(dnfId: string): Promise<void> {
    await requirePermission('dnf:manage');
    await deleteDnfInternal(dnfId);
    await logSystemEvent('DELETE_DNF', 'WARNING', `Deleted DNF record ID: ${dnfId}`);
    revalidatePath('/dnf');
    revalidatePath('/dashboard');
}

/**
 * BATCH IMPORT DNFS
 */
export async function addManyDnfs(dnfs: any[]) {
    const user = await requirePermission('dnf:manage');
    let imported = 0;
    for (const dnf of dnfs) {
        const sys = dnf.subsystemIds?.[0] || 'GEN';
        const count = await countDnfsByPrefixInternal(`DNF-${sys}-`);
        const newId = `DNF-${sys}-${String(count + 1).padStart(3, '0')}`;
        await createDnfInternal(newId, dnf, user.id);
        imported++;
    }
    revalidatePath('/dnf');
    return { success: true, count: imported };
}

/**
 * CORRECTIVE ACTIONS
 */
export async function addCorrectiveAction(dnfId: string, data: Omit<CorrectiveAction, 'id' | 'dnfId' | 'status' | 'createdAt' | 'updatedAt'>) {
    await requirePermission('dnf:manage');
    const result = await createCorrectiveActionInternal(dnfId, data);
    revalidatePath(`/dnf/${dnfId}`);
    return result;
}

export async function updateCorrectiveAction(id: string, data: Partial<CorrectiveAction>) {
    await requirePermission('dnf:manage');
    const result = await updateCorrectiveActionInternal(id, data);
    if (result.dnfId) revalidatePath(`/dnf/${result.dnfId}`);
    return result;
}

export async function deleteCorrectiveAction(id: string, dnfId: string) {
    await requirePermission('dnf:manage');
    await deleteCorrectiveActionInternal(id);
    revalidatePath(`/dnf/${dnfId}`);
}

/**
 * COMPATIBILITY ALIASES
 */
export async function updateMockDnf(data: DnfDocument) {
    return await updateDnf(data);
}

export async function deleteMockDnf(id: string) {
    return await deleteDnf(id);
}

// Added alias to satisfy dashboard page which I briefly broke
export async function getDnfRecords(): Promise<DnfDocument[]> {
    return await getDnfs();
}
