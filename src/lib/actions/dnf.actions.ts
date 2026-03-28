'use server';

import { revalidatePath } from 'next/cache';
import type { CorrectiveAction, DnfDocument } from '@/lib/types';
import { logSystemEvent } from './system.actions';
import { hasPermission } from '../auth';
import { opsDb } from '@/lib/prisma';
import { protectedAction, authenticatedAction } from '../auth-enforcer';

export async function getDnfsPaginated(params: {
    page: number;
    pageSize: number;
    searchTerm?: string;
    statuses?: string[];
    subsystems?: string[];
    hazardLevels?: string[];
    startDate?: string;
    endDate?: string;
    priorities?: number[];
    assignedSubsystems?: string[];
}) {
    return authenticatedAction(async () => {
        const skip = (params.page - 1) * params.pageSize;
        
        let whereClause: any = { isArchived: false };

        if (params.statuses && params.statuses.length > 0) {
            whereClause.status = { in: params.statuses };
        }
        
        if (params.subsystems && params.subsystems.length > 0) {
            whereClause.subsystemIds = { hasSome: params.subsystems };
        } else if (params.assignedSubsystems && params.assignedSubsystems.length > 0) {
            whereClause.subsystemIds = { hasSome: params.assignedSubsystems };
        }

        if (params.hazardLevels && params.hazardLevels.length > 0) {
            whereClause.hazardLevelId = { in: params.hazardLevels };
        }

        if (params.startDate || params.endDate) {
            whereClause.dateTimeOfFailureOccurrence = {};
            if (params.startDate) whereClause.dateTimeOfFailureOccurrence.gte = new Date(params.startDate);
            if (params.endDate) {
                const end = new Date(params.endDate);
                end.setHours(23, 59, 59, 999);
                whereClause.dateTimeOfFailureOccurrence.lte = end;
            }
        }

        if (params.searchTerm) {
            const term = params.searchTerm;
            whereClause.OR = [
                { id: { contains: term, mode: 'insensitive' } },
                { descriptionOfFailure: { contains: term, mode: 'insensitive' } },
                { staffWhoIdentifiedFailure: { contains: term, mode: 'insensitive' } },
                { locationOfFailure: { contains: term, mode: 'insensitive' } },
            ];
        }

        if (params.priorities && params.priorities.length > 0) {
            const priorityMap: Record<number, string> = { 1: "Thấp", 2: "Trung bình", 3: "Cao" };
            const dbPriorities = params.priorities.map(p => priorityMap[p]).filter(Boolean);
            if (dbPriorities.length > 0) {
                whereClause.priority = { in: dbPriorities };
            }
        }

        const [total, dnfs] = await Promise.all([
             opsDb.dnfDocument.count({ where: whereClause }),
             opsDb.dnfDocument.findMany({
                 where: whereClause,
                 orderBy: { createdAt: 'desc' },
                 skip,
                 take: params.pageSize,
             })
        ]);

        return {
            data: dnfs as unknown as DnfDocument[],
            metadata: { total, pages: Math.ceil(total / params.pageSize), currentPage: params.page }
        };
    });
}

export async function getDnfs(): Promise<DnfDocument[]> {
  return authenticatedAction(async () => {
    const dnfs = await opsDb.dnfDocument.findMany({
      where: { isArchived: false },
      include: { correctiveActions: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return dnfs as unknown as DnfDocument[];
  });
}

export async function getDnfById(id: string): Promise<DnfDocument | undefined> {
    return authenticatedAction(async (user) => {
        const dnf = await opsDb.dnfDocument.findUnique({
            where: { id },
            include: { correctiveActions: true }
        });

        if (!dnf) return undefined;

        if (dnf.isArchived) {
            const canViewArchived = await hasPermission('dnf:view_all');
            if (!canViewArchived) return undefined;
        }

        return dnf as unknown as DnfDocument;
    });
}

export async function addDnf(dnfData: Omit<DnfDocument, 'id'|'createdAt'|'updatedAt'|'createdById'|'statusHistory'|'isArchived'|'correctiveActions'>): Promise<DnfDocument> {
    return protectedAction('dnf:create', async (user) => {
        const subsystemGroup = dnfData.subsystemIds?.[0]?.toUpperCase().replace(/[^A-Z0-9_]/g, '') || 'GEN';
        
        let newRecord;
        let attempts = 0;
        
        while (attempts < 5) {
            try {
                const existingCount = await opsDb.dnfDocument.count({
                    where: { id: { startsWith: `DNF-${subsystemGroup}-` } }
                });
                
                const newCounter = existingCount + 1 + attempts;
                const newId = `DNF-${subsystemGroup}-${String(newCounter).padStart(4, '0')}`;

                newRecord = await opsDb.dnfDocument.create({
                    data: {
                        id: newId,
                        locationOfFailure: dnfData.locationOfFailure,
                        descriptionOfFailure: dnfData.descriptionOfFailure,
                        staffWhoIdentifiedFailure: dnfData.staffWhoIdentifiedFailure,
                        dateTimeOfFailureOccurrence: new Date(dnfData.dateTimeOfFailureOccurrence),
                        methodOfFailureDetection: dnfData.methodOfFailureDetection,
                        status: dnfData.status,
                        createdById: user.id,
                        
                        failureReportNo: dnfData.failureReportNo || null,
                        failedComponentEquipmentLRUTrainNumber: dnfData.failedComponentEquipmentLRUTrainNumber || null,
                        subsystemIds: dnfData.subsystemIds || [],
                        impactAssessment: dnfData.impactAssessment || null,
                        hazardLevelId: dnfData.hazardLevelId || null,
                        attachments: dnfData.attachments as any || [],
                        statusHistory: [] as any,
                        isArchived: false,
                        resolutionDetails: dnfData.resolutionDetails || null,
                        assignedTo: dnfData.assignedTo || null,
                        priority: dnfData.priority || null,
                        completedDate: dnfData.completedDate ? new Date(dnfData.completedDate) : null,
                        originatingInspectionId: dnfData.originatingInspectionId || null,
                        originatingFindingId: dnfData.originatingFindingId || null,
                        immediateAction: dnfData.immediateAction || null,
                        problemResettable: dnfData.problemResettable || null,
                        trainServiceAffected: dnfData.trainServiceAffected || null,
                        trainWithdrawn: dnfData.trainWithdrawn || null,
                        systemRestoredTime: dnfData.systemRestoredTime ? new Date(dnfData.systemRestoredTime) : null,
                        disruptionDuration: dnfData.disruptionDuration || null,
                        trainKm: dnfData.trainKm || null,
                        rectificationParty: dnfData.rectificationParty || null,
                    }
                });
                break; // Success!
            } catch (e: any) {
                if (e.code === 'P2002') { // Unique constraint violation
                    attempts++;
                    continue;
                }
                throw e;
            }
        }

        if (!newRecord) throw new Error("Could not generate a unique ID after 5 attempts.");

        await logSystemEvent('CREATE_DNF', 'INFO', `Created DNF with ID: ${newRecord.id}`);
        
        // Bắn sự kiện Real-time SSE
        if (newRecord.priority === 'Cao' || newRecord.hazardLevelId === 'CRITICAL' || newRecord.hazardLevelId === 'HIGH') {
            const payload = {
                title: '⚡ Sự cố mức độ cao',
                message: `DNF ${newRecord.id} vừa được lập: ${newRecord.descriptionOfFailure.substring(0, 50)}...`,
                level: 'CRITICAL',
                link: `/dnf/${newRecord.id}`
            };
            try {
                await opsDb.$executeRawUnsafe(`NOTIFY system_alerts, '${JSON.stringify(payload).replace(/'/g, "''")}'`);
            } catch(e) { console.error("SSE Notification Error:", e); }
        }

        revalidatePath('/dnf');
        return newRecord as unknown as DnfDocument;
    });
}

export async function addManyDnfs(newDnfsData: (Omit<DnfDocument, 'id'|'createdAt'|'updatedAt'|'createdById'|'statusHistory'|'isArchived'|'correctiveActions'>)[]): Promise<void> {
    return protectedAction('dnf:create', async () => {
        for (const dnfData of newDnfsData) {
            await addDnf(dnfData);
        }
        await logSystemEvent('CREATE_DNF_BULK', 'INFO', `Bulk added ${newDnfsData.length} DNFs.`);
        revalidatePath('/dnf');
    });
}


export async function updateDnf(updatedDnf: DnfDocument): Promise<void> {
    return authenticatedAction(async (user) => {
        const canEditAll = await hasPermission('dnf:edit_all');
        const originalDnf = await opsDb.dnfDocument.findUnique({ where: { id: updatedDnf.id } });
        if (!originalDnf) throw new Error("DNF not found");

        if (!canEditAll && originalDnf.createdById !== user.id) {
            throw new Error("Bạn không có quyền chỉnh sửa sự cố này.");
        }

        let statusHistory = (updatedDnf.statusHistory || []) as any;
        if (originalDnf.status !== updatedDnf.status) {
            statusHistory.push({
                from: originalDnf.status,
                to: updatedDnf.status,
                timestamp: new Date().toISOString(),
                userId: user.id,
                userName: user.name,
            });
        }

        await opsDb.dnfDocument.update({
            where: { id: updatedDnf.id },
            data: {
                failureReportNo: updatedDnf.failureReportNo,
                locationOfFailure: updatedDnf.locationOfFailure,
                failedComponentEquipmentLRUTrainNumber: updatedDnf.failedComponentEquipmentLRUTrainNumber,
                subsystemIds: updatedDnf.subsystemIds,
                descriptionOfFailure: updatedDnf.descriptionOfFailure,
                impactAssessment: updatedDnf.impactAssessment,
                staffWhoIdentifiedFailure: updatedDnf.staffWhoIdentifiedFailure,
                dateTimeOfFailureOccurrence: new Date(updatedDnf.dateTimeOfFailureOccurrence),
                methodOfFailureDetection: updatedDnf.methodOfFailureDetection,
                hazardLevelId: updatedDnf.hazardLevelId,
                status: updatedDnf.status,
                attachments: updatedDnf.attachments as any,
                statusHistory: statusHistory,
                resolutionDetails: updatedDnf.resolutionDetails,
                assignedTo: updatedDnf.assignedTo,
                priority: updatedDnf.priority,
                completedDate: updatedDnf.completedDate ? new Date(updatedDnf.completedDate) : null,
                originatingInspectionId: updatedDnf.originatingInspectionId,
                originatingFindingId: updatedDnf.originatingFindingId,
                immediateAction: updatedDnf.immediateAction,
                problemResettable: updatedDnf.problemResettable,
                trainServiceAffected: updatedDnf.trainServiceAffected,
                trainWithdrawn: updatedDnf.trainWithdrawn,
                systemRestoredTime: updatedDnf.systemRestoredTime ? new Date(updatedDnf.systemRestoredTime) : null,
                disruptionDuration: updatedDnf.disruptionDuration,
                trainKm: updatedDnf.trainKm,
                rectificationParty: updatedDnf.rectificationParty,
            }
        });

        await logSystemEvent('UPDATE_DNF', 'INFO', `Updated DNF with ID: ${updatedDnf.id}`);
        revalidatePath('/dnf');
        revalidatePath(`/dnf/${updatedDnf.id}`);
    });
}
// Alias for backward compatibility
export const updateMockDnf = updateDnf;

export async function deleteDnf(dnfId: string): Promise<void> {
    return protectedAction('dnf:delete', async (user) => {
        const dnfToDelete = await opsDb.dnfDocument.findUnique({ where: { id: dnfId } });
        
        if (dnfToDelete) {
            await opsDb.correctiveAction.deleteMany({ where: { dnfId } });
            await opsDb.dnfDocument.delete({ where: { id: dnfId } });
            await logSystemEvent('DELETE_DNF', 'WARNING', `Deleted DNF: ${dnfToDelete.descriptionOfFailure.substring(0, 30)}... (ID: ${dnfId})`);
        }
        revalidatePath('/dnf');
    });
}
// Alias for backward compatibility
export const deleteMockDnf = deleteDnf;

export async function archiveCompletedDnfs(): Promise<number> {
    const DATA_ARCHIVED_PLACEHOLDER = '[DỮ LIỆU ĐÃ LƯU TRỮ]';
    
    // Get IDs to archive
    const toArchiveIds = await opsDb.dnfDocument.findMany({
      where: { status: 'Đã đóng', isArchived: false },
      select: { id: true },
    });

    if (toArchiveIds.length === 0) return 0;

    // Batch update using transaction
    await opsDb.$transaction(
      toArchiveIds.map(({ id }: { id: string }) =>
        opsDb.dnfDocument.update({
          where: { id },
          data: {
            isArchived: true,
            descriptionOfFailure: DATA_ARCHIVED_PLACEHOLDER,
            impactAssessment: DATA_ARCHIVED_PLACEHOLDER,
            resolutionDetails: DATA_ARCHIVED_PLACEHOLDER,
            attachments: [] as any
          }
        })
      )
    );

    const archivedCount = toArchiveIds.length;
    if (archivedCount > 0) {
        await logSystemEvent('ARCHIVE_DNF_DATA', 'INFO', `Archived ${archivedCount} DNFs.`, 'network');
        revalidatePath('/dnf');
        revalidatePath('/admin/settings');
    }
    
    return archivedCount;
}


// Corrective Action logic moved here
export async function addCorrectiveAction(dnfId: string, actionData: Omit<CorrectiveAction, 'id' | 'createdAt' | 'status' | 'dnfId'>): Promise<CorrectiveAction> {
  return protectedAction('dnf:edit_all', async () => {
    const newAction = await opsDb.correctiveAction.create({
      data: {
        id: `CA-${Date.now()}`,
        dnfId: dnfId,
        description: actionData.description,
        responsiblePersonOrUnit: actionData.responsiblePersonOrUnit,
        status: 'Mới',
        
        completedAt: actionData.completedAt ? new Date(actionData.completedAt) : null,
        dateTimeNotified: actionData.dateTimeNotified ? new Date(actionData.dateTimeNotified) : null,
        dateTimeArrival: actionData.dateTimeArrival ? new Date(actionData.dateTimeArrival) : null,
        diagnosisTime: actionData.diagnosisTime,
        repairTime: actionData.repairTime,
        verificationTime: actionData.verificationTime,
        totalDownTime: actionData.totalDownTime
      }
    });

    await logSystemEvent('CREATE_CORRECTIVE_ACTION', 'INFO', `Created Corrective Action for DNF ${dnfId}`);
    revalidatePath(`/dnf/${dnfId}`);
    return { ...newAction, createdAt: newAction.createdAt.toISOString(), updatedAt: newAction.updatedAt.toISOString(), completedAt: newAction.completedAt?.toISOString(), dateTimeNotified: newAction.dateTimeNotified?.toISOString(), dateTimeArrival: newAction.dateTimeArrival?.toISOString() } as CorrectiveAction;
  });
}

export async function updateCorrectiveAction(dnfId: string, updatedAction: CorrectiveAction): Promise<void> {
  return protectedAction('dnf:edit_all', async () => {
    await opsDb.correctiveAction.update({
      where: { id: updatedAction.id },
      data: {
        description: updatedAction.description,
        responsiblePersonOrUnit: updatedAction.responsiblePersonOrUnit,
        status: updatedAction.status,
        completedAt: updatedAction.completedAt ? new Date(updatedAction.completedAt) : null,
        dateTimeNotified: updatedAction.dateTimeNotified ? new Date(updatedAction.dateTimeNotified) : null,
        dateTimeArrival: updatedAction.dateTimeArrival ? new Date(updatedAction.dateTimeArrival) : null,
        diagnosisTime: updatedAction.diagnosisTime,
        repairTime: updatedAction.repairTime,
        verificationTime: updatedAction.verificationTime,
        totalDownTime: updatedAction.totalDownTime
      }
    });

    await logSystemEvent('UPDATE_CORRECTIVE_ACTION', 'INFO', `Updated Corrective Action ${updatedAction.id}`);
    revalidatePath(`/dnf/${dnfId}`);
  });
}

export async function deleteCorrectiveAction(dnfId: string, actionId: string): Promise<void> {
  return protectedAction('dnf:edit_all', async () => {
    await opsDb.correctiveAction.delete({ where: { id: actionId } });
    await logSystemEvent('DELETE_CORRECTIVE_ACTION', 'WARNING', `Deleted Corrective Action ${actionId} from DNF ${dnfId}`);
    revalidatePath(`/dnf/${dnfId}`);
  });
}
