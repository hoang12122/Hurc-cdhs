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

export interface HazardPaginationParams {
    page: number;
    pageSize: number;
    status?: string; // singular (for backward compatibility if any)
    statuses?: string[]; // plural (used in table client)
    priority?: string;
    riskLevel?: string; // singular
    riskLevels?: string[]; // plural
    searchTerm?: string;
    startDate?: string;
    endDate?: string;
}

export async function getHazardRecordsPaginated(params: HazardPaginationParams) {
    await requireAuth();
    const skip = (params.page - 1) * params.pageSize;
    
    // Construct where clause for service layer
    let whereClause: any = { isArchived: false };
    
    if (params.status) whereClause.status = params.status;
    if (params.statuses && params.statuses.length > 0) whereClause.status = { in: params.statuses };
    if (params.riskLevel) whereClause.riskLevelId = params.riskLevel;
    if (params.riskLevels && params.riskLevels.length > 0) whereClause.riskLevelId = { in: params.riskLevels };
    if (params.searchTerm) {
        whereClause.OR = [
            { id: { contains: params.searchTerm, mode: 'insensitive' } },
            { description: { contains: params.searchTerm, mode: 'insensitive' } },
            { systemGroup: { contains: params.searchTerm, mode: 'insensitive' } }
        ];
    }
    if (params.startDate || params.endDate) {
        whereClause.identificationDate = {};
        if (params.startDate) whereClause.identificationDate.gte = new Date(params.startDate);
        if (params.endDate) whereClause.identificationDate.lte = new Date(params.endDate);
    }
    
    const { total, records } = await getInternalHazardsPaginated(skip, params.pageSize, whereClause);
    return {
        data: records as unknown as HazardRecord[],
        metadata: { total, pages: Math.ceil(total / params.pageSize), currentPage: params.page }
    };
}

export async function getHazardRecords(): Promise<HazardRecord[]> {
  await requireAuth();
  return await getInternalHazards();
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
