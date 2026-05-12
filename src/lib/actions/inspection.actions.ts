'use server';

import { revalidatePath } from 'next/cache';
import { type InspectionDetail } from '@/lib/constants';
import { internalLogSystemEvent as logSystemEvent } from '../services/log-service';
import { requirePermission, requireAuth } from '@/lib/auth-enforcer';
import { 
    getInternalInspections, 
    getInternalInspectionsPaginated,
    createInternalInspection,
    updateInternalInspection,
    deleteInternalInspection,
    archiveInternalInspections,
    getInternalInspectionById
} from '../services/ops-service';

export async function getInspectionsPaginated(params: any) {
    await requireAuth();
    const skip = (params.page - 1) * params.pageSize;
    let whereClause: any = { isArchived: false };
    // Build where clause from params...
    const { total, records } = await getInternalInspectionsPaginated(skip, params.pageSize, whereClause);
    return {
        data: records as unknown as InspectionDetail[],
        metadata: { total, pages: Math.ceil(total / params.pageSize), currentPage: params.page }
    };
}

export async function getInspections(): Promise<InspectionDetail[]> {
    await requireAuth();
    return await getInternalInspections() as any;
}

export async function getInspectionById(id: string): Promise<InspectionDetail | null> {
    await requireAuth();
    return await getInternalInspectionById(id) as unknown as InspectionDetail;
}

export async function addInspection(inspectionData: Omit<InspectionDetail, 'id'>): Promise<InspectionDetail> {
    const user = await requirePermission('inspection:create');
    const record = await createInternalInspection(inspectionData, user.id, user.name);
    await logSystemEvent('CREATE_INSPECTION', 'INFO', `Created inspection: ${record.title}`);
    revalidatePath('/inspections');
    return record as unknown as InspectionDetail;
}

export async function updateInspection(updatedInspection: InspectionDetail): Promise<void> {
    const user = await requireAuth();
    await updateInternalInspection(updatedInspection.id, updatedInspection, user.name);
    await logSystemEvent('UPDATE_INSPECTION', 'INFO', `Updated inspection: ${updatedInspection.title}`);
    revalidatePath('/inspections');
}

export async function deleteInspection(id: string): Promise<void> {
    await requirePermission('inspection:delete');
    await deleteInternalInspection(id);
    await logSystemEvent('DELETE_INSPECTION', 'WARNING', `Deleted inspection ID: ${id}`);
    revalidatePath('/inspections');
}

export async function archiveCompletedInspections(): Promise<number> {
    const records = await getInternalInspections();
    const toArchiveIds = records.filter((i: any) => (i.status === 'Hoàn thành' || i.status === 'Đã duyệt') && !i.isArchived).map((i: any) => i.id);
    if (toArchiveIds.length > 0) {
        await archiveInternalInspections(toArchiveIds, '[DỮ LIỆU ĐÃ LƯU TRỮ]');
        await logSystemEvent('ARCHIVE_INSPECTION', 'INFO', `Archived ${toArchiveIds.length} inspections`);
        revalidatePath('/inspections');
    }
    return toArchiveIds.length;
}
