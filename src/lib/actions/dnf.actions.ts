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
import { OUScopeService } from '../services/ou-scope-service';

const MAX_PAGE_SIZE = 100;

function normalizePagination(page: number, pageSize: number) {
    const normalizedPage = Math.max(1, Math.trunc(Number(page) || 1));
    const normalizedPageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Math.trunc(Number(pageSize) || 20)));
    return {
        page: normalizedPage,
        pageSize: normalizedPageSize,
        skip: (normalizedPage - 1) * normalizedPageSize,
    };
}

async function applyCreatorScope(where: Record<string, unknown>, currentUser: Awaited<ReturnType<typeof requireAuth>>) {
    if (currentUser.role === 'SUPER_ADMIN' || currentUser.permissions?.includes('dnf:view_all')) return;

    const userOuId = (currentUser as typeof currentUser & { ouId?: string | null }).ouId;
    const scopedUserIds = userOuId ? await OUScopeService.getUsersInScope(userOuId) : [];
    where.createdById = { in: Array.from(new Set([...scopedUserIds, currentUser.id])) };
}

function resolveSubsystemScope(requested?: string[], assigned?: string[]) {
    if (!assigned?.length) return requested?.length ? requested : undefined;
    if (!requested?.length) return assigned;
    const allowed = new Set(assigned);
    return requested.filter(id => allowed.has(id));
}

/** FETCH ALL DNFS */
export async function getDnfs(): Promise<DnfDocument[]> {
    const currentUser = await requireAuth();
    const all = await getDnfsInternal();

    if (currentUser.role !== 'SUPER_ADMIN' && !currentUser.permissions?.includes('dnf:view_all')) {
        const userOuId = (currentUser as typeof currentUser & { ouId?: string | null }).ouId;
        const scopedUserIds = userOuId ? await OUScopeService.getUsersInScope(userOuId) : [];
        const allowedIds = new Set([...scopedUserIds, currentUser.id]);
        return all.filter(record => allowedIds.has(record.createdById));
    }
    return all;
}

/** FETCH PAGINATED DNFS WITH FILTERS */
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
    const currentUser = await requireAuth();
    const pagination = normalizePagination(params.page, params.pageSize);
    const where: Record<string, unknown> = { isArchived: false };

    await applyCreatorScope(where, currentUser);

    const searchTerm = params.searchTerm?.trim();
    if (searchTerm) {
        where.OR = [
            { id: { contains: searchTerm, mode: 'insensitive' } },
            { descriptionOfFailure: { contains: searchTerm, mode: 'insensitive' } },
            { locationOfFailure: { contains: searchTerm, mode: 'insensitive' } }
        ];
    }

    if (params.statuses?.length) where.status = { in: params.statuses };
    const scopedSubsystems = resolveSubsystemScope(params.subsystems, params.assignedSubsystems);
    if (scopedSubsystems) where.subsystemIds = { hasSome: scopedSubsystems };
    if (params.hazardLevels?.length) where.hazardLevelId = { in: params.hazardLevels };

    if (params.startDate || params.endDate) {
        const dateRange: { gte?: Date; lte?: Date } = {};
        if (params.startDate) dateRange.gte = new Date(params.startDate);
        if (params.endDate) dateRange.lte = new Date(params.endDate);
        where.dateTimeOfFailureOccurrence = dateRange;
    }

    const { total, dnfs } = await getDnfsPaginatedInternal(pagination.skip, pagination.pageSize, where);
    return {
        data: dnfs,
        metadata: {
            total,
            pages: Math.max(1, Math.ceil(total / pagination.pageSize)),
            currentPage: pagination.page,
            pageSize: pagination.pageSize,
        }
    };
}

/** FETCH DNF BY ID */
export async function getDnfById(id: string): Promise<DnfDocument | null> {
    await requireAuth();
    const dnf = await getDnfByIdInternal(id);
    return (dnf as unknown as DnfDocument) || null;
}

/** ADD NEW DNF RECORD */
export async function addDnf(dnf: Omit<DnfDocument, 'id'|'createdAt'|'updatedAt'|'createdById'|'statusHistory'|'isArchived'|'correctiveActions'>): Promise<DnfDocument> {
    const user = await requirePermission('dnf:manage');
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

/** UPDATE DNF RECORD */
export async function updateDnf(updatedDnf: DnfDocument): Promise<void> {
    await requirePermission('dnf:manage');
    await updateDnfInternal(updatedDnf.id, updatedDnf);
    await logSystemEvent('UPDATE_DNF', 'INFO', `Updated DNF record: ${updatedDnf.id}`);
    revalidatePath('/dnf');
    revalidatePath(`/dnf/${updatedDnf.id}`);
    revalidatePath('/dashboard');
}

/** DELETE DNF RECORD */
export async function deleteDnf(dnfId: string): Promise<void> {
    await requirePermission('dnf:manage');
    await deleteDnfInternal(dnfId);
    await logSystemEvent('DELETE_DNF', 'WARNING', `Deleted DNF record ID: ${dnfId}`);
    revalidatePath('/dnf');
    revalidatePath('/dashboard');
}

/** BATCH IMPORT DNFS */
export async function addManyDnfs(dnfs: unknown[]) {
    const user = await requirePermission('dnf:manage');
    let imported = 0;
    for (const rawDnf of dnfs) {
        const dnf = rawDnf as Partial<DnfDocument>;
        const sys = dnf.subsystemIds?.[0] || 'GEN';
        const count = await countDnfsByPrefixInternal(`DNF-${sys}-`);
        const newId = `DNF-${sys}-${String(count + 1).padStart(3, '0')}`;
        await createDnfInternal(newId, dnf, user.id);
        imported++;
    }
    revalidatePath('/dnf');
    return { success: true, count: imported };
}

/** CORRECTIVE ACTIONS */
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

/** COMPATIBILITY ALIASES */
export async function updateMockDnf(data: DnfDocument) {
    return await updateDnf(data);
}

export async function deleteMockDnf(id: string) {
    return await deleteDnf(id);
}

export async function getDnfRecords(): Promise<DnfDocument[]> {
    return await getDnfs();
}
