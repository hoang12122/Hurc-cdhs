'use server';

import { revalidatePath } from 'next/cache';
import { type InspectionDetail } from '@/lib/constants';
import { logSystemEvent } from './system.actions';
import { format } from 'date-fns';
import { opsDb } from '@/lib/prisma';
import { protectedAction, authenticatedAction } from '../auth-enforcer';

export async function getInspections(): Promise<InspectionDetail[]> {
    return authenticatedAction(async () => {
        const inspections = await opsDb.inspectionDetail.findMany({
            where: { isArchived: false },
            orderBy: { date: 'desc' },
            take: 200,
        });
        return inspections.map((inspection: any) => {
            if ((inspection as any).area && !inspection.areaIds) {
                return { ...inspection, areaIds: [(inspection as any).area] };
            }
            if (!inspection.areaIds) {
                return { ...inspection, areaIds: [] };
            }
            return inspection;
        }) as unknown as InspectionDetail[];
    });
}

export async function addInspection(inspectionData: Omit<InspectionDetail, 'id'>): Promise<InspectionDetail> {
    return protectedAction('inspection:create', async (user) => {
        const standard = await opsDb.maintenanceStandard.findUnique({
            where: { id: inspectionData.checklistTemplateId || '' }
        });
        
        const abbreviation = standard?.abbreviation || 'MANUAL';
        const datePart = format(new Date(), 'ddMMyy');
        const idPrefix = `INS-HM-${abbreviation}-${datePart}-`;

        let newRecord;
        let attempts = 0;
        
        while (attempts < 5) {
            try {
                const todaysCount = await opsDb.inspectionDetail.count({
                    where: { id: { startsWith: idPrefix } }
                });

                const newCounter = todaysCount + 1 + attempts;
                const newId = `${idPrefix}${String(newCounter).padStart(4, '0')}`;

                newRecord = await opsDb.inspectionDetail.create({
                    data: {
                        id: newId,
                        title: inspectionData.title,
                        areaIds: inspectionData.areaIds || [],
                        inspector: inspectionData.inspector,
                        date: new Date(inspectionData.date),
                        status: inspectionData.status,
                        checklistTemplateId: inspectionData.checklistTemplateId || null,
                        checklistItems: inspectionData.checklistItems as any || [],
                        generalNotes: inspectionData.generalNotes || null,
                        approvalComments: inspectionData.approvalComments || null,
                        lastStatusUpdateBy: user.name, // Tracking who created it in the update field too
                        lastStatusUpdateAt: new Date(),
                        scheduledStartDate: inspectionData.scheduledStartDate ? new Date(inspectionData.scheduledStartDate) : null,
                        scheduledFinishDate: inspectionData.scheduledFinishDate ? new Date(inspectionData.scheduledFinishDate) : null,
                        estimatedDurationHours: inspectionData.estimatedDurationHours || null,
                        isArchived: false,
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

        if (!newRecord) throw new Error("Could not generate a unique Inspection ID after 5 attempts.");

        await logSystemEvent('CREATE_INSPECTION', 'INFO', `Created new inspection: ${newRecord.title} (ID: ${newRecord.id})`);
        revalidatePath('/inspections');
        return newRecord as unknown as InspectionDetail;
    });
}

export async function updateInspection(updatedInspection: InspectionDetail): Promise<void> {
    return authenticatedAction(async (user) => {
        await opsDb.inspectionDetail.update({
            where: { id: updatedInspection.id },
            data: {
                title: updatedInspection.title,
                areaIds: updatedInspection.areaIds,
                inspector: updatedInspection.inspector,
                date: new Date(updatedInspection.date),
                status: updatedInspection.status,
                checklistTemplateId: updatedInspection.checklistTemplateId,
                checklistItems: updatedInspection.checklistItems as any,
                generalNotes: updatedInspection.generalNotes,
                approvalComments: updatedInspection.approvalComments,
                lastStatusUpdateBy: user.name,
                lastStatusUpdateAt: new Date(),
                scheduledStartDate: updatedInspection.scheduledStartDate ? new Date(updatedInspection.scheduledStartDate) : null,
                scheduledFinishDate: updatedInspection.scheduledFinishDate ? new Date(updatedInspection.scheduledFinishDate) : null,
                estimatedDurationHours: updatedInspection.estimatedDurationHours,
            }
        });

        await logSystemEvent('UPDATE_INSPECTION', 'INFO', `Updated inspection: ${updatedInspection.title} (ID: ${updatedInspection.id})`);
        revalidatePath('/inspections');
        revalidatePath(`/inspections/${updatedInspection.id}`);
    });
}

export async function deleteInspection(id: string): Promise<void> {
    return protectedAction('inspection:delete', async () => {
        const toDelete = await opsDb.inspectionDetail.findUnique({ where: { id } });
        
        if (toDelete) {
            await opsDb.inspectionDetail.delete({ where: { id } });
            await logSystemEvent('DELETE_INSPECTION', 'WARNING', `Deleted inspection: ${toDelete.title} (ID: ${id})`);
        }
        revalidatePath('/inspections');
    });
}

export async function archiveCompletedInspections(): Promise<number> {
    const DATA_ARCHIVED_PLACEHOLDER = '[DỮ LIỆU ĐÃ LƯU TRỮ]';
    const terminalStatuses = ['Đã duyệt để tạo báo cáo', 'Hoàn thành'];

    const toArchiveIds = await opsDb.inspectionDetail.findMany({
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
        opsDb.inspectionDetail.update({
          where: { id },
          data: {
            isArchived: true,
            generalNotes: DATA_ARCHIVED_PLACEHOLDER,
            approvalComments: DATA_ARCHIVED_PLACEHOLDER,
            checklistItems: [] as any
          }
        })
      )
    );

    const archivedCount = toArchiveIds.length;
    if (archivedCount > 0) {
        await logSystemEvent('ARCHIVE_INSPECTION_DATA', 'INFO', `Archived ${archivedCount} inspections.`, 'network');
        revalidatePath('/inspections');
        revalidatePath('/admin/settings');
    }

    return archivedCount;
}
