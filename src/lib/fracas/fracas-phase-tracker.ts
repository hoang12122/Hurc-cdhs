import type { DnfDocument } from '@/lib/types';

export type FracasPhaseId = 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4' | 'phase-5';
export type FracasPhaseRisk = 'normal' | 'watch' | 'overdue' | 'critical';

export interface FracasPhaseDefinition {
  id: FracasPhaseId;
  label: string;
  description: string;
}

export interface FracasPhaseRecord {
  id: string;
  reference?: string;
  title: string;
  status?: string;
  phaseId: FracasPhaseId;
  ageDays: number;
  risk: FracasPhaseRisk;
  reason: string;
}

export interface FracasPhaseSummaryItem extends FracasPhaseDefinition {
  count: number;
  overdueCount: number;
  criticalCount: number;
  records: FracasPhaseRecord[];
}

export interface FracasPhaseSummary {
  generatedAt: string;
  totalRecords: number;
  openRecords: number;
  overdueRecords: number;
  criticalRecords: number;
  phases: FracasPhaseSummaryItem[];
  highlights: string[];
}

export const FRACAS_PHASES: FracasPhaseDefinition[] = [
  {
    id: 'phase-1',
    label: 'Phase 1 - Intake / Classification',
    description: 'Tiếp nhận, ghi nhận, phân loại kỹ thuật và đánh giá ảnh hưởng ban đầu.',
  },
  {
    id: 'phase-2',
    label: 'Phase 2 - Short-term Corrective Action',
    description: 'Điều phối, sửa chữa tạm thời, khôi phục kỹ thuật và khôi phục dịch vụ.',
  },
  {
    id: 'phase-3',
    label: 'Phase 3 - Root Cause Analysis',
    description: 'Rà soát sự cố lặp lại, phân tích nguyên nhân gốc rễ và liên kết Hazard Log.',
  },
  {
    id: 'phase-4',
    label: 'Phase 4 - Long-term Action / Approval',
    description: 'Đề xuất biện pháp lâu dài, xác định đơn vị chịu trách nhiệm và phê duyệt.',
  },
  {
    id: 'phase-5',
    label: 'Phase 5 - Verification / Closure',
    description: 'Xác minh hiệu lực, cập nhật RAMS/Hazard và đóng hồ sơ khi đủ căn cứ.',
  },
];

function safeDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function ageDaysFrom(value?: string, now = new Date()) {
  const date = safeDate(value);
  if (!date) return 0;
  return Math.max(0, Math.floor((now.getTime() - date.getTime()) / 86400000));
}

function hasRcaSignal(record: DnfDocument) {
  const text = `${record.descriptionOfFailure || ''} ${record.impactAssessment || ''} ${record.resolutionDetails || ''}`.toLowerCase();
  return /root cause|rca|fta|fmea|fmeca|nguyên nhân gốc|nguyen nhan goc|lặp lại|lap lai|tái diễn|tai dien|repeated|recurrence/.test(text);
}

function hasLongTermActionSignal(record: DnfDocument) {
  const text = `${record.resolutionDetails || ''} ${record.impactAssessment || ''} ${record.immediateAction || ''}`.toLowerCase();
  return /long[- ]term|preventive|phòng ngừa|phong ngua|biện pháp lâu dài|bien phap lau dai|approval|phê duyệt|phe duyet/.test(text);
}

export function deriveFracasPhase(record: DnfDocument): FracasPhaseId {
  if (record.status === 'Đóng' || record.status === 'Hủy') return 'phase-5';
  if (record.status === 'Phản hồi' || hasLongTermActionSignal(record)) return 'phase-4';
  if (hasRcaSignal(record)) return 'phase-3';
  if (record.status === 'Xử lý' || record.correctiveActions?.length) return 'phase-2';
  return 'phase-1';
}

function deriveRisk(record: DnfDocument, ageDays: number): { risk: FracasPhaseRisk; reason: string } {
  if (record.hazardLevelId === 'high' && record.trainServiceAffected) {
    return { risk: 'critical', reason: 'High hazard with service impact' };
  }

  if (ageDays >= 14 && record.status !== 'Đóng' && record.status !== 'Hủy') {
    return { risk: 'overdue', reason: `Open for ${ageDays} days` };
  }

  if (record.trainServiceAffected || record.trainWithdrawn || (record.disruptionDuration || 0) > 0) {
    return { risk: 'watch', reason: 'Service impact recorded' };
  }

  return { risk: 'normal', reason: 'No urgent FRACAS signal' };
}

function buildHighlights(phases: FracasPhaseSummaryItem[]) {
  const highlights: string[] = [];
  const overdue = phases.flatMap((phase) => phase.records.filter((record) => record.risk === 'overdue'));
  const critical = phases.flatMap((phase) => phase.records.filter((record) => record.risk === 'critical'));
  const busiest = [...phases].sort((a, b) => b.count - a.count)[0];

  if (critical.length > 0) highlights.push(`${critical.length} FRACAS records require critical attention.`);
  if (overdue.length > 0) highlights.push(`${overdue.length} FRACAS records are overdue and should be reviewed.`);
  if (busiest && busiest.count > 0) highlights.push(`${busiest.label} has the highest workload with ${busiest.count} records.`);

  return highlights;
}

export function calculateFracasPhaseSummary(records: DnfDocument[], now = new Date()): FracasPhaseSummary {
  const phaseRecords = records.map<FracasPhaseRecord>((record) => {
    const phaseId = deriveFracasPhase(record);
    const ageDays = ageDaysFrom(record.updatedAt || record.createdAt || record.dateTimeOfFailureOccurrence, now);
    const riskInfo = deriveRisk(record, ageDays);

    return {
      id: record.id,
      reference: record.failureReportNo,
      title: record.descriptionOfFailure || record.failedComponentEquipmentLRUTrainNumber || record.locationOfFailure || record.id,
      status: record.status,
      phaseId,
      ageDays,
      risk: riskInfo.risk,
      reason: riskInfo.reason,
    };
  });

  const phases = FRACAS_PHASES.map<FracasPhaseSummaryItem>((phase) => {
    const values = phaseRecords.filter((record) => record.phaseId === phase.id);
    return {
      ...phase,
      count: values.length,
      overdueCount: values.filter((record) => record.risk === 'overdue').length,
      criticalCount: values.filter((record) => record.risk === 'critical').length,
      records: values.slice(0, 8),
    };
  });

  return {
    generatedAt: now.toISOString(),
    totalRecords: records.length,
    openRecords: records.filter((record) => record.status !== 'Đóng' && record.status !== 'Hủy').length,
    overdueRecords: phaseRecords.filter((record) => record.risk === 'overdue').length,
    criticalRecords: phaseRecords.filter((record) => record.risk === 'critical').length,
    phases,
    highlights: buildHighlights(phases),
  };
}
