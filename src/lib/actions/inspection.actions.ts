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
    const currentUser = await requireAuth();
    const skip = (params.page - 1) * params.pageSize;
    let whereClause: any = { isArchived: false };
    // Build where clause from params...
    const { total, records } = await getInternalInspectionsPaginated(skip, params.pageSize, whereClause);
    
    // Apply OU scope filtering for non-admin users
    let filtered = records as unknown as InspectionDetail[];
    if (currentUser.role !== 'SUPER_ADMIN' && !currentUser.permissions?.includes('inspections:view_all')) {
        const userOuId = (currentUser as any).ouId;
        if (userOuId) {
            const { OUScopeService } = await import('../services/ou-scope-service');
            const scopedUserIds = await OUScopeService.getUsersInScope(userOuId);
            scopedUserIds.push(currentUser.id); // Always include self
            filtered = filtered.filter((r: any) => scopedUserIds.includes(r.inspector || r.createdById));
        }
    }
    
    return {
        data: filtered,
        metadata: { total: filtered.length, pages: Math.ceil(filtered.length / params.pageSize), currentPage: params.page }
    };
}

export async function getInspections(): Promise<InspectionDetail[]> {
    const currentUser = await requireAuth();
    const all = await getInternalInspections() as any;
    
    // Apply OU scope filtering for non-admin users
    if (currentUser.role !== 'SUPER_ADMIN' && !currentUser.permissions?.includes('inspections:view_all')) {
        const userOuId = (currentUser as any).ouId;
        if (userOuId) {
            const { OUScopeService } = await import('../services/ou-scope-service');
            const scopedUserIds = await OUScopeService.getUsersInScope(userOuId);
            scopedUserIds.push(currentUser.id);
            return all.filter((r: any) => scopedUserIds.includes(r.inspector || r.createdById));
        }
    }
    return all;
}

export async function getInspectionById(id: string): Promise<InspectionDetail | null> {
    await requireAuth();
    return await getInternalInspectionById(id) as unknown as InspectionDetail;
}

export async function addInspection(inspectionData: Omit<InspectionDetail, 'id'>): Promise<InspectionDetail> {
    const user = await requirePermission('inspections:create');
    const record = await createInternalInspection(inspectionData, user.id, user.name);
    await logSystemEvent('CREATE_INSPECTION', 'INFO', `Created inspection: ${record.title}`);
    revalidatePath('/inspections');
    return record as unknown as InspectionDetail;
}

export async function updateInspection(updatedInspection: InspectionDetail): Promise<void> {
    const user = await requireAuth();

    // Scoped Permission validation for updating inspections
    if (user.role !== 'SUPER_ADMIN' && !user.permissions?.includes('inspections:edit_all')) {
        const isOwner = updatedInspection.inspector === user.id || updatedInspection.inspector === user.name;
        const isLocked = ['Đóng', 'Hủy', 'Hoàn thành', 'Đã duyệt'].includes(updatedInspection.status);
        if (!isOwner) {
            throw new Error("Bạn không có quyền chỉnh sửa phiếu kiểm tra này.");
        }
        if (isLocked) {
            throw new Error("Phiếu kiểm tra đã được phê duyệt/khóa, không thể chỉnh sửa.");
        }
    }

    await updateInternalInspection(updatedInspection.id, updatedInspection, user.name);
    await logSystemEvent('UPDATE_INSPECTION', 'INFO', `Updated inspection: ${updatedInspection.title}`);
    revalidatePath('/inspections');
}

export async function deleteInspection(id: string): Promise<void> {
    await requirePermission('inspections:delete');
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
