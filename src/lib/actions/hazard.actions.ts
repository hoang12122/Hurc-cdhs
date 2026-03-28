'use server';

import { revalidatePath } from 'next/cache';
import { type HazardRecord } from '@/lib/constants';
import { logSystemEvent } from './system.actions';
import { opsDb } from '@/lib/prisma';
import { protectedAction, authenticatedAction } from '../auth-enforcer';

export async function getHazardRecordsPaginated(params: {
    page: number;
    pageSize: number;
    searchTerm?: string;
    statuses?: string[];
    riskLevels?: string[];
    startDate?: string;
    endDate?: string;
}) {
    return authenticatedAction(async () => {
        const skip = (params.page - 1) * params.pageSize;
        let whereClause: any = { isArchived: false };

        if (params.statuses && params.statuses.length > 0) {
            whereClause.status = { in: params.statuses };
        }
        
        if (params.riskLevels && params.riskLevels.length > 0) {
            whereClause.riskLevelId = { in: params.riskLevels };
        }

        if (params.startDate || params.endDate) {
            whereClause.identificationDate = {};
            if (params.startDate) whereClause.identificationDate.gte = new Date(params.startDate);
            if (params.endDate) {
                const end = new Date(params.endDate);
                end.setHours(23, 59, 59, 999);
                whereClause.identificationDate.lte = end;
            }
        }

        if (params.searchTerm) {
            const term = params.searchTerm;
            whereClause.OR = [
                { id: { contains: term, mode: 'insensitive' } },
                { description: { contains: term, mode: 'insensitive' } },
                { identifiedBy: { contains: term, mode: 'insensitive' } },
            ];
        }

        const [total, records] = await Promise.all([
             opsDb.hazardRecord.count({ where: whereClause }),
             opsDb.hazardRecord.findMany({
                 where: whereClause,
                 orderBy: { createdAt: 'desc' },
                 skip,
                 take: params.pageSize,
             })
        ]);

        return {
            data: records as unknown as HazardRecord[],
            metadata: { total, pages: Math.ceil(total / params.pageSize), currentPage: params.page }
        };
    });
}

export async function getHazardRecords(): Promise<HazardRecord[]> {
  return authenticatedAction(async () => {
    const records = await opsDb.hazardRecord.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return records as unknown as HazardRecord[];
  });
}

export async function getHazardById(id: string): Promise<HazardRecord | undefined> {
    return authenticatedAction(async () => {
        const hazard = await opsDb.hazardRecord.findUnique({ where: { id } });
        if (!hazard) return undefined;
        return hazard as unknown as HazardRecord;
    });
}

export async function addHazardRecord(hazardData: Omit<HazardRecord, 'id' | 'createdAt' | 'updatedAt' | 'riskLevelId' | 'createdById'>): Promise<HazardRecord> {
  return protectedAction('hazard:create', async (user) => {
    const systemGroup = hazardData.systemGroup?.toUpperCase().replace(/[^A-Z0-9_]/g, '') || 'GEN';
    
    let newRecord;
    let attempts = 0;
    
    while (attempts < 5) {
      try {
        const existingCount = await opsDb.hazardRecord.count({
          where: { id: { startsWith: `HAZ-${systemGroup}-` } }
        });

        const newCounter = existingCount + 1 + attempts;
        const newId = `HAZ-${systemGroup}-${String(newCounter).padStart(3, '0')}`;

        newRecord = await opsDb.hazardRecord.create({
          data: {
            id: newId,
            description: hazardData.description,
            systemGroup: hazardData.systemGroup || null,
            locationIds: hazardData.locationIds || [],
            source: hazardData.source || null,
            potentialConsequence: hazardData.potentialConsequence || null,
            identifiedBy: hazardData.identifiedBy,
            identificationDate: new Date(hazardData.identificationDate),
            severityId: hazardData.severityId || null,
            likelihoodId: hazardData.likelihoodId || null,
            riskLevelId: null,
            currentControls: hazardData.currentControls,
            proposedActions: hazardData.proposedActions || null,
            suggestedActions: hazardData.suggestedActions || null,
            responsiblePersonOrUnit: hazardData.responsiblePersonOrUnit || null,
            coordinatingUnits: hazardData.coordinatingUnits || [],
            dueDate: hazardData.dueDate ? new Date(hazardData.dueDate) : null,
            status: hazardData.status,
            closureDetails: hazardData.closureDetails || null,
            verificationDetails: hazardData.verificationDetails || null,
            attachments: hazardData.attachments as any || [],
            linkedDnfId: hazardData.linkedDnfId || null,
            createdById: user.id,
            statusHistory: [] as any,
          }
        });
        break;
      } catch (e: any) {
        if (e.code === 'P2002') {
          attempts++;
          continue;
        }
        throw e;
      }
    }

    if (!newRecord) throw new Error("Could not generate a unique Hazard ID after 5 attempts.");

    await logSystemEvent('CREATE_HAZARD', 'INFO', `Created new hazard record with ID: ${newRecord.id}`);

    // Bắn sự kiện Real-time SSE
    if (newRecord.severityId === 'CATASTROPHIC' || newRecord.severityId === 'CRITICAL' || newRecord.severityId === 'MARGINAL') {
        const payload = {
            title: '⚠️ Mối nguy Đỏ (Khẩn cấp)',
            message: `Mối nguy ${newRecord.id} vừa được lập: ${newRecord.description.substring(0, 50)}...`,
            level: 'CRITICAL',
            link: `/hazards/${newRecord.id}`
        };
        try {
            await opsDb.$executeRawUnsafe(`NOTIFY system_alerts, '${JSON.stringify(payload).replace(/'/g, "''")}'`);
        } catch(e) { console.error("SSE Notification Error:", e); }
    }

    revalidatePath('/hazards');
    return newRecord as unknown as HazardRecord;
  });
}

export async function updateHazardRecord(updatedHazard: HazardRecord): Promise<void> {
  return protectedAction('hazard:edit_all', async () => {
    const originalHazard = await opsDb.hazardRecord.findUnique({ where: { id: updatedHazard.id } });
    if (!originalHazard) throw new Error("Hazard not found");

    await opsDb.hazardRecord.update({
      where: { id: updatedHazard.id },
      data: {
        description: updatedHazard.description,
        systemGroup: updatedHazard.systemGroup,
        locationIds: updatedHazard.locationIds,
        source: updatedHazard.source,
        potentialConsequence: updatedHazard.potentialConsequence,
        identifiedBy: updatedHazard.identifiedBy,
        identificationDate: new Date(updatedHazard.identificationDate),
        severityId: updatedHazard.severityId,
        likelihoodId: updatedHazard.likelihoodId,
        riskLevelId: updatedHazard.riskLevelId,
        currentControls: updatedHazard.currentControls,
        proposedActions: updatedHazard.proposedActions,
        suggestedActions: updatedHazard.suggestedActions,
        responsiblePersonOrUnit: updatedHazard.responsiblePersonOrUnit,
        coordinatingUnits: updatedHazard.coordinatingUnits,
        dueDate: updatedHazard.dueDate ? new Date(updatedHazard.dueDate) : null,
        status: updatedHazard.status,
        closureDetails: updatedHazard.closureDetails,
        verificationDetails: updatedHazard.verificationDetails,
        attachments: updatedHazard.attachments as any,
        linkedDnfId: updatedHazard.linkedDnfId,
        statusHistory: updatedHazard.statusHistory as any
      }
    });

    await logSystemEvent('UPDATE_HAZARD', 'INFO', `Updated hazard record with ID: ${updatedHazard.id}`);
    revalidatePath('/hazards');
    revalidatePath(`/hazards/${updatedHazard.id}`);
  });
}

export async function deleteHazardRecord(hazardId: string): Promise<void> {
  return protectedAction('hazard:delete', async () => {
    const hazardToDelete = await opsDb.hazardRecord.findUnique({ where: { id: hazardId } });
    
    if (hazardToDelete) {
      await opsDb.hazardRecord.delete({ where: { id: hazardId } });
      await logSystemEvent('DELETE_HAZARD', 'WARNING', `Deleted hazard record: ${hazardToDelete.description.substring(0, 30)}... (ID: ${hazardId})`);
    }
    revalidatePath('/hazards');
  });
}

export async function archiveCompletedHazards(): Promise<number> {
    const DATA_ARCHIVED_PLACEHOLDER = '[DỮ LIỆU ĐÃ LƯU TRỮ]';
    const terminalStatuses = ['Đã đóng', 'Hủy'];

    const toArchiveIds = await opsDb.hazardRecord.findMany({
        where: {
            status: { in: terminalStatuses },
            isArchived: false
        },
        select: { id: true },
    });

    if (toArchiveIds.length === 0) return 0;

    // Batch update using transaction
    await opsDb.$transaction(
        toArchiveIds.map(({ id }: { id: string }) =>
            opsDb.hazardRecord.update({
                where: { id },
                data: {
                    isArchived: true,
                    description: DATA_ARCHIVED_PLACEHOLDER,
                    potentialConsequence: DATA_ARCHIVED_PLACEHOLDER,
                    currentControls: DATA_ARCHIVED_PLACEHOLDER,
                    proposedActions: DATA_ARCHIVED_PLACEHOLDER,
                    suggestedActions: DATA_ARCHIVED_PLACEHOLDER,
                    closureDetails: DATA_ARCHIVED_PLACEHOLDER,
                    verificationDetails: DATA_ARCHIVED_PLACEHOLDER,
                    attachments: [] as any
                }
            })
        )
    );

    const archivedCount = toArchiveIds.length;
    if (archivedCount > 0) {
        await logSystemEvent('ARCHIVE_HAZARD_DATA', 'INFO', `Archived ${archivedCount} hazards.`, 'network');
        revalidatePath('/hazards');
        revalidatePath('/admin/settings');
    }

    return archivedCount;
}
