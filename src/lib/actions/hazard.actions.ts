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

export async function getHazardRecordsPaginated(params: any) {
    await requireAuth();
    const skip = (params.page - 1) * params.pageSize;
    let whereClause: any = { isArchived: false };
    // Simplified where clause
    const { total, records } = await getInternalHazardsPaginated(skip, params.pageSize, whereClause);
    return {
        data: records as unknown as HazardRecord[],
        metadata: { total, pages: Math.ceil(total / params.pageSize), currentPage: params.page }
    };
}

export async function getHazardRecords(): Promise<HazardRecord[]> {
  await requireAuth();
  return await getInternalHazards() as any;
}

export async function addHazardRecord(data: any): Promise<HazardRecord> {
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
