'use server';

import { 
  type UnifiedTask,
  ROLE_ADMIN_PKTAT,
  ROLE_L2_TECHNICIAN,
  calculateRiskLevelId,
} from '@/lib/constants';
import { getLocations, getSubsystems } from './category.actions';
import { getMaintenanceStandards } from './maintenance.actions';
import { opsDb } from '@/lib/prisma';

// Only select the fields we actually need — massive reduction in data transfer
const DNF_SELECT_FOR_TASKS = {
    id: true,
    descriptionOfFailure: true,
    status: true,
    assignedTo: true,
    priority: true,
    locationOfFailure: true,
    subsystemIds: true,
    createdAt: true,
    completedDate: true,
} as const;

const INSPECTION_SELECT_FOR_TASKS = {
    id: true,
    title: true,
    inspector: true,
    date: true,
    status: true,
    areaIds: true,
    checklistTemplateId: true,
} as const;

const HAZARD_SELECT_FOR_TASKS = {
    id: true,
    description: true,
    status: true,
    responsiblePersonOrUnit: true,
    systemGroup: true,
    severityId: true,
    likelihoodId: true,
    locationIds: true,
    dueDate: true,
} as const;

const CA_SELECT_FOR_TASKS = {
    id: true,
    dnfId: true,
    description: true,
    status: true,
    responsiblePersonOrUnit: true,
    createdAt: true,
    completedAt: true,
} as const;

export async function getTasksForCurrentUser(): Promise<UnifiedTask[]> {
  const { getCurrentUser } = await import('./auth.actions');
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];

  // Fetch reference data (cached) + ops data in parallel
  const [locations, standards, subsystems, inspectionsRaw, dnfsRaw, correctiveActionsRaw, hazardsRaw] = await Promise.all([
    getLocations(),
    getMaintenanceStandards(),
    getSubsystems(),
    // Only fetch non-terminal status records (skip archived/completed)
    opsDb.inspectionDetail.findMany({
      where: {
        status: { notIn: ['Hoàn thành', 'Hoàn thành (Có phát hiện)', 'Đã duyệt để tạo báo cáo', 'Đã xem xét'] },
        isArchived: false,
      },
      select: INSPECTION_SELECT_FOR_TASKS,
    }),
    opsDb.dnfDocument.findMany({
      where: {
        status: { notIn: ['Đã đóng', 'Hủy'] },
        isArchived: false,
      },
      select: DNF_SELECT_FOR_TASKS,
    }),
    opsDb.correctiveAction.findMany({
      where: { status: { not: 'Đã xác minh' } },
      select: CA_SELECT_FOR_TASKS,
    }),
    opsDb.hazardRecord.findMany({
      where: {
        status: { notIn: ['Đã xử lý/Giám sát', 'Đã đóng'] },
        isArchived: false,
        dueDate: { not: null },
      },
      select: HAZARD_SELECT_FOR_TASKS,
    }),
  ]);

  const tasks: UnifiedTask[] = [];
  const isAdmin = currentUser.role === ROLE_ADMIN_PKTAT;

  const getLocationLabel = (locationId?: string) => {
    if (!locationId) return undefined;
    return locations.find(l => l.id === locationId)?.label || locationId;
  };
  
  const getHazardPriority = (sev?: string, like?: string): "Cao" | "Trung bình" | "Thấp" => {
      const risk = calculateRiskLevelId(sev, like);
      if (risk === 'R1') return 'Cao';
      if (risk === 'R2') return 'Trung bình';
      return 'Thấp';
  }

  let inspectionsToProcess = inspectionsRaw;
  let dnfsToProcess = dnfsRaw;
  let correctiveActionsToProcess = correctiveActionsRaw;
  let hazardsToProcess = hazardsRaw;

  // L2 Technician Filtering Logic
  if (currentUser.role === ROLE_L2_TECHNICIAN && currentUser.assignedSubsystems && currentUser.assignedSubsystems.length > 0) {
      const userSubsystems = new Set(currentUser.assignedSubsystems);
      
      inspectionsToProcess = inspectionsToProcess.filter((insp: any) => {
          const standard = standards.find(std => std.id === insp.checklistTemplateId);
          if (!standard) return false;
          const standardSubsystem = subsystems.find(sub => (sub.label as any).vi === standard.name || sub.id === standard.abbreviation);
          return standardSubsystem ? userSubsystems.has(standardSubsystem.id) : false;
      });

      dnfsToProcess = dnfsToProcess.filter((dnf: any) => 
          (dnf.subsystemIds as string[])?.some(subId => userSubsystems.has(subId))
      );
      
      const filteredDnfIds = new Set(dnfsToProcess.map((d: any) => d.id));
      correctiveActionsToProcess = correctiveActionsToProcess.filter((ca: any) => filteredDnfIds.has(ca.dnfId));

      hazardsToProcess = hazardsToProcess.filter((hr: any) => hr.systemGroup && userSubsystems.has(hr.systemGroup));
  }

  // Build tasks — inspections
  const assignedInspections = inspectionsToProcess.filter(
    (insp: any) => isAdmin || insp.inspector === currentUser.name
  );
  tasks.push(
    ...assignedInspections.map(
      (insp: any): UnifiedTask => ({
        id: `insp-${insp.id}`,
        title: insp.title,
        dueDate: insp.date.toISOString(),
        type: 'Kiểm tra',
        status: insp.status,
        link: `/inspections/${insp.id}`,
        location: (insp.areaIds as string[])?.map(id => getLocationLabel(id)).join(', '),
      })
    )
  );

  // Build tasks — DNFs
  const assignedIncidents = dnfsToProcess.filter(
    (dnf: any) => isAdmin || dnf.assignedTo === currentUser.name
  );
  tasks.push(
    ...assignedIncidents.map((dnf: any): UnifiedTask => {
      const dueDate =
        dnf.completedDate ? dnf.completedDate.toISOString() :
        new Date(
          new Date(dnf.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000
        ).toISOString();
      return {
        id: `dnf-${dnf.id}`,
        title: dnf.descriptionOfFailure,
        dueDate: dueDate,
        type: 'Sự cố',
        status: dnf.status,
        link: `/dnf/${dnf.id}`,
        priority: (dnf.priority as "Cao" | "Trung bình" | "Thấp") || undefined,
        location: getLocationLabel(dnf.locationOfFailure || undefined),
      };
    })
  );
  
  // Build tasks — Corrective Actions
  const assignedCorrectiveActions = correctiveActionsToProcess.filter(
    (ca: any) => isAdmin || ca.responsiblePersonOrUnit === currentUser.name
  );
   tasks.push(
    ...assignedCorrectiveActions.map((ca: any): UnifiedTask => {
       const dnf = dnfsToProcess.find((d: any) => d.id === ca.dnfId);
       const dueDate =
        ca.completedAt ? ca.completedAt.toISOString() :
        new Date(
          new Date(ca.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000 
        ).toISOString();
       return {
        id: `ca-${ca.id}`,
        title: ca.description,
        dueDate: dueDate,
        type: 'Hành động Khắc phục',
        status: ca.status,
        link: `/dnf/${ca.dnfId}`,
        priority: (dnf?.priority as "Cao" | "Trung bình" | "Thấp") || undefined,
        location: getLocationLabel(dnf?.locationOfFailure || undefined),
      };
    })
  );

  // Build tasks — Hazards
  const assignedHazards = hazardsToProcess.filter(
    (hr: any) =>
      isAdmin ||
        hr.responsiblePersonOrUnit === currentUser.name ||
        (currentUser.department &&
          hr.responsiblePersonOrUnit === currentUser.department)
  );
  tasks.push(
    ...assignedHazards.map(
      (hr: any): UnifiedTask => ({
        id: `haz-${hr.id}`,
        title: hr.description.substring(0, 70) + '...',
        dueDate: hr.dueDate!.toISOString(),
        type: 'Mối nguy',
        status: hr.status,
        link: `/hazards/${hr.id}`,
        priority: getHazardPriority(hr.severityId || undefined, hr.likelihoodId || undefined),
        location: (hr.locationIds as string[]).map(id => getLocationLabel(id)).join(', '),
      })
    )
  );

  return tasks.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
}
