import opsDb from '@/lib/db/ops-db';
import { analyzeSimilarIncidents, formatIncidentLearningResult, type IncidentResolutionCase, type IncidentSubsystem } from '@/lib/incident-learning/similar-incident-engine';

type IncidentLearningResponse = {
  answer: string;
  dataSource: 'ops-database' | 'fallback-sample' | 'mixed';
  caseCount: number;
  matchCount: number;
  confidenceLabel: 'low' | 'medium' | 'high';
};

const MAX_RECORDS_PER_SOURCE = 80;

function compactText(...parts: Array<unknown>) {
  return parts
    .flatMap((part) => Array.isArray(part) ? part : [part])
    .filter((part) => part !== null && part !== undefined && String(part).trim().length > 0)
    .map((part) => String(part).replace(/\s+/g, ' ').trim())
    .join(' | ');
}

function compactList(...parts: Array<unknown>) {
  return parts
    .flatMap((part) => Array.isArray(part) ? part : [part])
    .filter((part) => part !== null && part !== undefined && String(part).trim().length > 0)
    .map((part) => String(part).replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(0, 8);
}

function jsonToText(value: unknown) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function buildTags(text: string, extra: string[] = []) {
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);

  return Array.from(new Set([...extra, ...normalized])).slice(0, 36);
}

function resolveSubsystem(...values: Array<unknown>): IncidentSubsystem {
  const text = compactText(...values).toLowerCase();
  if (/(afc|tvm|bom|pg|gate|fare|ticket|giao dịch|ket toan|kết toán)/i.test(text)) return 'AFC';
  if (/(psd|platform screen|door|cửa|ghd|eed|belt|dây đai)/i.test(text)) return 'PSD';
  if (/(train|rolling|toa|tàu|traction|bogie)/i.test(text)) return 'Rolling Stock';
  if (/(power|điện|dien|voltage|ups|occs|scada|cáp)/i.test(text)) return 'Power';
  if (/(signal|signaling|cbtc|ats|interlocking|tín hiệu|tin hieu)/i.test(text)) return 'Signaling';
  return 'General';
}

function confidenceFromRecord(base: number, ...signals: Array<unknown>) {
  const score = base + signals.reduce((total, signal) => {
    if (Array.isArray(signal)) return total + (signal.length > 0 ? 4 : 0);
    return total + (signal ? 4 : 0);
  }, 0);
  return Math.max(35, Math.min(score, 92));
}

function dnfToIncidentCase(dnf: any): IncidentResolutionCase {
  const correctiveActions = Array.isArray(dnf.correctiveActions) ? dnf.correctiveActions : [];
  const actionTexts = correctiveActions.map((action: any) => compactText(action.description, action.status, action.responsiblePersonOrUnit));
  const baseText = compactText(
    dnf.failureReportNo,
    dnf.locationOfFailure,
    dnf.failedComponentEquipmentLRUTrainNumber,
    dnf.descriptionOfFailure,
    dnf.impactAssessment,
    dnf.methodOfFailureDetection,
    dnf.resolutionDetails,
    dnf.immediateAction,
    actionTexts,
  );

  return {
    id: `DNF-${dnf.id}`,
    sourceType: 'DNF',
    sourceId: dnf.id,
    referenceLabel: dnf.failureReportNo ? `DNF ${dnf.failureReportNo}` : `DNF ${dnf.id}`,
    title: compactText(dnf.failureReportNo, dnf.descriptionOfFailure).slice(0, 180) || 'DNF chưa có mô tả',
    subsystem: resolveSubsystem(dnf.subsystemIds, dnf.descriptionOfFailure, dnf.failedComponentEquipmentLRUTrainNumber),
    station: dnf.locationOfFailure,
    symptoms: compactList(dnf.descriptionOfFailure, dnf.impactAssessment, dnf.failedComponentEquipmentLRUTrainNumber, dnf.methodOfFailureDetection),
    rootCauseHypothesis: compactText(dnf.resolutionDetails, dnf.immediateAction) || 'Cần đối chiếu mô tả lỗi, log, hiện trường và hành động khắc phục để xác định nguyên nhân.',
    actionsTaken: compactList(dnf.immediateAction, dnf.resolutionDetails, actionTexts, dnf.rectificationParty) || ['Kiểm tra hiện trường, log hệ thống, ảnh hưởng khai thác và biên bản xử lý liên quan.'],
    resolutionOutcome: compactText(dnf.resolutionDetails, dnf.status, dnf.completedDate ? `Hoàn thành: ${new Date(dnf.completedDate).toLocaleDateString('vi-VN')}` : '') || 'DNF chưa có kết quả xử lý chi tiết trong hệ thống.',
    safetyNotes: compactList(
      dnf.trainServiceAffected ? 'Có ảnh hưởng khai thác, cần đánh giá an toàn vận hành trước khi thao tác.' : '',
      dnf.trainWithdrawn ? 'Có ghi nhận rút tàu, cần đối chiếu OCC/vận hành.' : '',
      dnf.hazardLevelId ? `Mức hazard: ${dnf.hazardLevelId}` : '',
    ),
    evidenceTags: buildTags(baseText, ['dnf', dnf.status, dnf.priority, dnf.hazardLevelId].filter(Boolean)),
    confidence: confidenceFromRecord(58, dnf.resolutionDetails, dnf.immediateAction, correctiveActions, dnf.completedDate),
    updatedAt: dnf.updatedAt?.toISOString?.(),
  };
}

function hazardToIncidentCase(hazard: any): IncidentResolutionCase {
  const baseText = compactText(
    hazard.description,
    hazard.systemGroup,
    hazard.locationIds,
    hazard.source,
    hazard.potentialConsequence,
    hazard.currentControls,
    hazard.proposedActions,
    hazard.suggestedActions,
    hazard.closureDetails,
    hazard.verificationDetails,
  );

  return {
    id: `HAZARD-${hazard.id}`,
    sourceType: 'Hazard',
    sourceId: hazard.id,
    referenceLabel: `Hazard ${hazard.id}`,
    title: compactText('Mối nguy', hazard.description).slice(0, 180),
    subsystem: resolveSubsystem(hazard.systemGroup, hazard.description, hazard.currentControls),
    station: Array.isArray(hazard.locationIds) ? hazard.locationIds.join(', ') : undefined,
    symptoms: compactList(hazard.description, hazard.potentialConsequence, hazard.source),
    rootCauseHypothesis: compactText(hazard.potentialConsequence, hazard.source) || 'Cần xác định nguyên nhân mối nguy từ hiện trường và hồ sơ kiểm soát rủi ro.',
    actionsTaken: compactList(hazard.currentControls, hazard.proposedActions, hazard.suggestedActions, hazard.closureDetails, hazard.verificationDetails),
    resolutionOutcome: compactText(hazard.closureDetails, hazard.verificationDetails, hazard.status) || 'Mối nguy chưa có thông tin đóng/xác minh đầy đủ.',
    safetyNotes: compactList(hazard.riskLevelId ? `Mức rủi ro: ${hazard.riskLevelId}` : '', hazard.severityId, hazard.likelihoodId, hazard.currentControls),
    evidenceTags: buildTags(baseText, ['hazard', hazard.status, hazard.riskLevelId, hazard.severityId, hazard.likelihoodId].filter(Boolean)),
    confidence: confidenceFromRecord(54, hazard.currentControls, hazard.proposedActions, hazard.closureDetails, hazard.verificationDetails),
    updatedAt: hazard.updatedAt?.toISOString?.(),
  };
}

function taskToIncidentCase(task: any): IncidentResolutionCase {
  const baseText = compactText(task.title, task.description, task.status, task.priority, task.department, task.todoType, task.activityHistory);
  return {
    id: `TASK-${task.id}`,
    sourceType: 'Task',
    sourceId: task.id,
    referenceLabel: `Task ${task.title}`,
    title: compactText('Công việc', task.title).slice(0, 180),
    subsystem: resolveSubsystem(task.department, task.todoType, task.title, task.description),
    symptoms: compactList(task.title, task.description, task.department, task.todoType),
    rootCauseHypothesis: task.description || 'Task có thể là hành động xử lý/theo dõi sau sự cố; cần đối chiếu DNF/Hazard liên quan.',
    actionsTaken: compactList(task.description, task.activityHistory, task.assignedToName ? `Phân công: ${task.assignedToName}` : '', `Tiến độ: ${task.progress}%`),
    resolutionOutcome: compactText(task.status, task.progress !== undefined ? `Tiến độ ${task.progress}%` : '', task.updatedAt ? `Cập nhật ${new Date(task.updatedAt).toLocaleDateString('vi-VN')}` : ''),
    safetyNotes: compactList(task.priority ? `Ưu tiên: ${task.priority}` : '', task.deadline ? `Deadline: ${new Date(task.deadline).toLocaleDateString('vi-VN')}` : ''),
    evidenceTags: buildTags(baseText, ['task', task.status, task.priority, task.department, task.todoType].filter(Boolean)),
    confidence: confidenceFromRecord(45, task.description, task.activityHistory, task.progress >= 100),
    updatedAt: task.updatedAt?.toISOString?.(),
  };
}

function inspectionToIncidentCase(inspection: any): IncidentResolutionCase {
  const checklistText = jsonToText(inspection.checklistItems);
  const baseText = compactText(inspection.title, inspection.areaIds, inspection.generalNotes, inspection.approvalComments, checklistText, inspection.status);
  return {
    id: `INSPECTION-${inspection.id}`,
    sourceType: 'Inspection',
    sourceId: inspection.id,
    referenceLabel: `Inspection ${inspection.title}`,
    title: compactText('Kiểm tra', inspection.title).slice(0, 180),
    subsystem: resolveSubsystem(inspection.title, inspection.generalNotes, checklistText),
    station: Array.isArray(inspection.areaIds) ? inspection.areaIds.join(', ') : undefined,
    symptoms: compactList(inspection.title, inspection.generalNotes, inspection.approvalComments, checklistText.slice(0, 320)),
    rootCauseHypothesis: compactText(inspection.generalNotes, inspection.approvalComments) || 'Inspection có thể chứa phát hiện hiện trường; cần đối chiếu checklist và DNF phát sinh.',
    actionsTaken: compactList(inspection.approvalComments, inspection.generalNotes, checklistText.slice(0, 500)),
    resolutionOutcome: compactText(inspection.status, inspection.lastStatusUpdateBy ? `Cập nhật bởi ${inspection.lastStatusUpdateBy}` : ''),
    safetyNotes: compactList(inspection.status, inspection.scheduledStartDate ? `Kế hoạch: ${new Date(inspection.scheduledStartDate).toLocaleDateString('vi-VN')}` : ''),
    evidenceTags: buildTags(baseText, ['inspection', inspection.status].filter(Boolean)),
    confidence: confidenceFromRecord(42, inspection.generalNotes, inspection.approvalComments, inspection.checklistItems),
    updatedAt: inspection.lastStatusUpdateAt?.toISOString?.(),
  };
}

export async function getIncidentLearningCasesFromOpsDb(): Promise<IncidentResolutionCase[]> {
  if (!opsDb) return [];

  const [dnfs, hazards, tasks, inspections] = await Promise.all([
    opsDb.dnfDocument.findMany({
      where: { deletedAt: null, isArchived: false },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      take: MAX_RECORDS_PER_SOURCE,
      include: { correctiveActions: true },
    }),
    opsDb.hazardRecord.findMany({
      where: { deletedAt: null, isArchived: false },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      take: MAX_RECORDS_PER_SOURCE,
    }),
    opsDb.task.findMany({
      where: { deletedAt: null },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      take: MAX_RECORDS_PER_SOURCE,
    }),
    opsDb.inspectionDetail.findMany({
      where: { deletedAt: null, isArchived: false },
      orderBy: [{ lastStatusUpdateAt: 'desc' }, { date: 'desc' }],
      take: MAX_RECORDS_PER_SOURCE,
    }),
  ]);

  return [
    ...dnfs.map(dnfToIncidentCase),
    ...hazards.map(hazardToIncidentCase),
    ...tasks.map(taskToIncidentCase),
    ...inspections.map(inspectionToIncidentCase),
  ];
}

export async function analyzeIncidentLearningFromOperations(query: string): Promise<IncidentLearningResponse> {
  try {
    const realCases = await getIncidentLearningCasesFromOpsDb();
    const result = analyzeSimilarIncidents(query, realCases);
    return {
      answer: formatIncidentLearningResult(result),
      dataSource: result.dataSource,
      caseCount: result.caseCount,
      matchCount: result.matches.length,
      confidenceLabel: result.confidenceLabel,
    };
  } catch (error) {
    console.error('[incident-learning] OPS database query failed, fallback to sample memory:', error);
    const fallback = analyzeSimilarIncidents(query);
    return {
      answer: `${formatIncidentLearningResult(fallback)}\n\nGhi chú hệ thống: Không đọc được OPS database tại thời điểm truy vấn, đã sử dụng kho mẫu fallback để không gián đoạn AI Lab.`,
      dataSource: fallback.dataSource,
      caseCount: fallback.caseCount,
      matchCount: fallback.matches.length,
      confidenceLabel: fallback.confidenceLabel,
    };
  }
}
