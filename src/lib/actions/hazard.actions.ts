'use server';

import { revalidatePath } from 'next/cache';
import { type HazardRecord } from '@/lib/constants';
import { internalLogSystemEvent as logSystemEvent } from '../services/log-service';
import { requirePermission, requireAuth } from '@/lib/auth-enforcer';
import {
    getInternalHazards,
    getInternalHazardsPaginated,
    createInternalHazard,
    updateInternalHazard,
    deleteInternalHazard,
    getInternalHazardById,
    countHazardsByPrefix,
    sendGlobalNotify
} from '../services/ops-service';
import { OUScopeService } from '../services/ou-scope-service';

const MAX_PAGE_SIZE = 100;

export interface HazardPaginationParams {
    page: number;
    pageSize: number;
    status?: string;
    statuses?: string[];
    priority?: string;
    riskLevel?: string;
    riskLevels?: string[];
    searchTerm?: string;
    startDate?: string;
    endDate?: string;
}

function normalizePagination(page: number, pageSize: number) {
    const normalizedPage = Math.max(1, Math.trunc(Number(page) || 1));
    const normalizedPageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Math.trunc(Number(pageSize) || 20)));
    return {
        page: normalizedPage,
        pageSize: normalizedPageSize,
        skip: (normalizedPage - 1) * normalizedPageSize,
    };
}

async function scopedCreatorIds(currentUser: Awaited<ReturnType<typeof requireAuth>>) {
    if (currentUser.role === 'SUPER_ADMIN' || currentUser.permissions?.includes('hazard:view_all')) return null;
    const userOuId = (currentUser as typeof currentUser & { ouId?: string | null }).ouId;
    const users = userOuId ? await OUScopeService.getUsersInScope(userOuId) : [];
    return Array.from(new Set([...users, currentUser.id]));
}

export async function getHazardRecordsPaginated(params: HazardPaginationParams) {
    const currentUser = await requireAuth();
    const pagination = normalizePagination(params.page, params.pageSize);
    const whereClause: Record<string, unknown> = { isArchived: false };
    const andFilters: Record<string, unknown>[] = [];

    const creatorIds = await scopedCreatorIds(currentUser);
    if (creatorIds) whereClause.createdById = { in: creatorIds };

    if (params.status) whereClause.status = params.status;
    if (params.statuses?.length) whereClause.status = { in: params.statuses };
    if (params.riskLevel) whereClause.riskLevelId = params.riskLevel;

    if (params.riskLevels?.length) {
        const concreteRiskLevels = params.riskLevels.filter(level => level !== 'none');
        const includeUnassessed = params.riskLevels.includes('none');
        if (includeUnassessed && concreteRiskLevels.length) {
            andFilters.push({
                OR: [
                    { riskLevelId: { in: concreteRiskLevels } },
                    { riskLevelId: null },
                ],
            });
        } else if (includeUnassessed) {
            whereClause.riskLevelId = null;
        } else {
            whereClause.riskLevelId = { in: concreteRiskLevels };
        }
    }

    const searchTerm = params.searchTerm?.trim();
    if (searchTerm) {
        andFilters.push({
            OR: [
                { id: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
                { systemGroup: { contains: searchTerm, mode: 'insensitive' } }
            ],
        });
    }

    if (andFilters.length) whereClause.AND = andFilters;

    if (params.startDate || params.endDate) {
        const dateRange: { gte?: Date; lte?: Date } = {};
        if (params.startDate) dateRange.gte = new Date(params.startDate);
        if (params.endDate) dateRange.lte = new Date(params.endDate);
        whereClause.identificationDate = dateRange;
    }

    const { total, records } = await getInternalHazardsPaginated(
        pagination.skip,
        pagination.pageSize,
        whereClause,
    );

    return {
        data: records as unknown as HazardRecord[],
        metadata: {
            total,
            pages: Math.max(1, Math.ceil(total / pagination.pageSize)),
            currentPage: pagination.page,
            pageSize: pagination.pageSize,
        }
    };
}

export async function getHazardRecords(): Promise<HazardRecord[]> {
    const currentUser = await requireAuth();
    const all = await getInternalHazards();
    const creatorIds = await scopedCreatorIds(currentUser);
    if (!creatorIds) return all;
    const allowedIds = new Set(creatorIds);
    return all.filter(record => allowedIds.has(record.createdById));
}

export async function addHazardRecord(data: Omit<HazardRecord, 'id' | 'createdAt' | 'updatedAt' | 'riskLevelId' | 'createdById'>): Promise<HazardRecord> {
    const user = await requirePermission('hazard:create');
    const systemGroup = data.systemGroup?.toUpperCase() || 'GEN';
    const count = await countHazardsByPrefix(`HAZ-${systemGroup}-`);
    const newId = `HAZ-${systemGroup}-${String(count + 1).padStart(3, '0')}`;

    const record = await createInternalHazard({ ...data, id: newId }, user.id);
    if (record.severityId === 'CRITICAL' || record.severityId === 'CATASTROPHIC') {
        await sendGlobalNotify({
            title: '⚠️ Mối nguy Đỏ (Khẩn cấp)',
            message: `Mối nguy ${record.id} vừa được lập: ${record.description.substring(0, 50)}...`,
            level: 'CRITICAL',
            link: `/hazards/${record.id}`
        });
    }
    await logSystemEvent('CREATE_HAZARD', 'INFO', `Created hazard record ${record.id}`);
    revalidatePath('/hazards');
    return record as unknown as HazardRecord;
}

export async function updateHazardRecord(updatedHazard: HazardRecord): Promise<void> {
    await requirePermission('hazard:edit_all');
    await updateInternalHazard(updatedHazard.id, updatedHazard);
    await logSystemEvent('UPDATE_HAZARD', 'INFO', `Updated hazard record ${updatedHazard.id}`);
    revalidatePath('/hazards');
}

export async function deleteHazardRecord(hazardId: string): Promise<void> {
    await requirePermission('hazard:delete');
    await deleteInternalHazard(hazardId);
    await logSystemEvent('DELETE_HAZARD', 'WARNING', `Deleted hazard record ${hazardId}`);
    revalidatePath('/hazards');
}

export async function getHazardById(id: string): Promise<HazardRecord | null> {
    await requireAuth();
    return await getInternalHazardById(id) as unknown as HazardRecord;
}
