import type { CorrectiveAction, DnfDocument } from '@/lib/types';

export type RamsTrendBucket = 'day' | 'week' | 'month';
export type RamsHotspotDimension = 'location' | 'subsystem' | 'equipment';
export type RamsRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RamsQuickInput {
  records: DnfDocument[];
  operatingMinutes?: number;
  trendBucket?: RamsTrendBucket;
  now?: Date;
}

export interface RamsQuickRecordScore {
  id: string;
  reference?: string;
  location?: string;
  subsystemIds: string[];
  equipment?: string;
  occurrenceTime?: string;
  serviceImpactScore: number;
  mttrMinutes: number;
  ramsTotal: number;
  riskLevel: RamsRiskLevel;
  highlightReasons: string[];
}

export interface RamsTrendPoint {
  bucket: string;
  recordCount: number;
  totalServiceImpactScore: number;
  averageMttrMinutes: number;
  averageRamsTotal: number;
  maxRamsTotal: number;
}

export interface RamsHotspot {
  dimension: RamsHotspotDimension;
  key: string;
  recordCount: number;
  averageRamsTotal: number;
  maxRamsTotal: number;
  totalServiceImpactScore: number;
  averageMttrMinutes: number;
  riskLevel: RamsRiskLevel;
  highlightReasons: string[];
}

export interface RamsQuickSummary {
  generatedAt: string;
  totalRecords: number;
  affectedServiceRecords: number;
  averageMttrMinutes: number;
  averageRamsTotal: number;
  totalServiceImpactScore: number;
  worstRiskLevel: RamsRiskLevel;
  records: RamsQuickRecordScore[];
  trends: RamsTrendPoint[];
  hotspots: RamsHotspot[];
  occHighlights: string[];
}

const DEFAULT_OPERATING_MINUTES = 18 * 60;

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function safeDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function minutesBetween(start?: string, end?: string) {
  const startDate = safeDate(start);
  const endDate = safeDate(end);
  if (!startDate || !endDate) return 0;
  return Math.max(0, Math.round((endDate.getTime() - startDate.getTime()) / 60000));
}

function average(values: number[]) {
  const valid = values.filter((value) => Number.isFinite(value));
  if (valid.length === 0) return 0;
  return Math.round(valid.reduce((sum, value) => sum + value, 0) / valid.length);
}

function maxRiskLevel(levels: RamsRiskLevel[]): RamsRiskLevel {
  const order: Record<RamsRiskLevel, number> = { low: 1, medium: 2, high: 3, critical: 4 };
  return levels.reduce<RamsRiskLevel>((worst, level) => (order[level] > order[worst] ? level : worst), 'low');
}

function riskLevelFromScore(score: number): RamsRiskLevel {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 35) return 'medium';
  return 'low';
}

function hazardScore(record: DnfDocument) {
  if (record.hazardLevelId === 'high') return 30;
  if (record.hazardLevelId === 'medium') return 18;
  if (record.hazardLevelId === 'low') return 8;
  return 0;
}

function calculateServiceImpactScore(record: DnfDocument) {
  let score = 0;
  const reasons: string[] = [];

  if (record.trainServiceAffected) {
    score += 25;
    reasons.push('Service affected');
  }

  if (record.trainWithdrawn) {
    score += 20;
    reasons.push('Train withdrawn');
  }

  const disruption = record.disruptionDuration || 0;
  if (disruption > 0) {
    score += Math.min(35, Math.ceil(disruption / 5));
    reasons.push(`Disruption ${disruption} min`);
  }

  const restoredMinutes = minutesBetween(record.dateTimeOfFailureOccurrence, record.systemRestoredTime);
  if (restoredMinutes >= 60) {
    score += 15;
    reasons.push(`Long restoration ${restoredMinutes} min`);
  } else if (restoredMinutes > 0) {
    score += 5;
    reasons.push(`Restoration ${restoredMinutes} min`);
  }

  score += hazardScore(record);

  return { score: clampScore(score), reasons };
}

function correctiveActionMinutes(action: CorrectiveAction) {
  const explicitTotal = action.totalDownTime || 0;
  if (explicitTotal > 0) return explicitTotal;

  const activityTotal = (action.diagnosisTime || 0) + (action.repairTime || 0) + (action.verificationTime || 0);
  if (activityTotal > 0) return activityTotal;

  return minutesBetween(action.dateTimeNotified, action.completedAt || action.updatedAt);
}

function calculateMttrMinutes(record: DnfDocument) {
  const actionMinutes = (record.correctiveActions || [])
    .map(correctiveActionMinutes)
    .filter((value) => value > 0);

  if (actionMinutes.length > 0) return average(actionMinutes);

  const restoredMinutes = minutesBetween(record.dateTimeOfFailureOccurrence, record.systemRestoredTime);
  if (restoredMinutes > 0) return restoredMinutes;

  const completedMinutes = minutesBetween(record.dateTimeOfFailureOccurrence, record.completedDate);
  if (completedMinutes > 0) return completedMinutes;

  return record.disruptionDuration || 0;
}

function calculateMaintainabilityPenalty(mttrMinutes: number) {
  if (mttrMinutes >= 240) return 30;
  if (mttrMinutes >= 120) return 24;
  if (mttrMinutes >= 60) return 16;
  if (mttrMinutes >= 30) return 10;
  if (mttrMinutes > 0) return 4;
  return 0;
}

function calculateReliabilityPenalty(record: DnfDocument) {
  const text = `${record.descriptionOfFailure || ''} ${record.impactAssessment || ''} ${record.immediateAction || ''}`.toLowerCase();
  if (/repeated|recurrence|repeat|lặp lại|tái diễn|lap lai|tai dien/.test(text)) return 18;
  return 6;
}

function calculateAvailabilityPenalty(record: DnfDocument, operatingMinutes: number) {
  const downtime = Math.max(record.disruptionDuration || 0, minutesBetween(record.dateTimeOfFailureOccurrence, record.systemRestoredTime));
  if (downtime <= 0) return 0;
  const unavailability = downtime / Math.max(1, operatingMinutes);
  return clampScore(unavailability * 100);
}

function scoreRecord(record: DnfDocument, operatingMinutes: number): RamsQuickRecordScore {
  const serviceImpact = calculateServiceImpactScore(record);
  const mttrMinutes = calculateMttrMinutes(record);
  const reliabilityPenalty = calculateReliabilityPenalty(record);
  const availabilityPenalty = calculateAvailabilityPenalty(record, operatingMinutes);
  const maintainabilityPenalty = calculateMaintainabilityPenalty(mttrMinutes);
  const safetyPenalty = hazardScore(record);

  const ramsTotal = clampScore(
    serviceImpact.score * 0.35 +
    reliabilityPenalty * 0.15 +
    availabilityPenalty * 0.15 +
    maintainabilityPenalty * 0.2 +
    safetyPenalty * 0.15,
  );

  const highlightReasons = [
    ...serviceImpact.reasons,
    mttrMinutes >= 60 ? `High MTTR ${mttrMinutes} min` : '',
    availabilityPenalty >= 10 ? `Availability loss ${availabilityPenalty}` : '',
    record.hazardLevelId ? `Hazard level ${record.hazardLevelId}` : '',
  ].filter(Boolean);

  return {
    id: record.id,
    reference: record.failureReportNo,
    location: record.locationOfFailure,
    subsystemIds: record.subsystemIds || [],
    equipment: record.failedComponentEquipmentLRUTrainNumber,
    occurrenceTime: record.dateTimeOfFailureOccurrence,
    serviceImpactScore: serviceImpact.score,
    mttrMinutes,
    ramsTotal,
    riskLevel: riskLevelFromScore(ramsTotal),
    highlightReasons,
  };
}

function getBucketKey(dateValue?: string, bucket: RamsTrendBucket = 'month') {
  const date = safeDate(dateValue) || new Date(0);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  if (bucket === 'day') return `${year}-${month}-${day}`;
  if (bucket === 'week') {
    const firstDay = new Date(Date.UTC(year, 0, 1));
    const dayOfYear = Math.floor((date.getTime() - firstDay.getTime()) / 86400000) + 1;
    const week = String(Math.ceil(dayOfYear / 7)).padStart(2, '0');
    return `${year}-W${week}`;
  }
  return `${year}-${month}`;
}

function buildTrends(records: RamsQuickRecordScore[], bucket: RamsTrendBucket): RamsTrendPoint[] {
  const groups = new Map<string, RamsQuickRecordScore[]>();

  for (const record of records) {
    const key = getBucketKey(record.occurrenceTime, bucket);
    groups.set(key, [...(groups.get(key) || []), record]);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([bucketKey, values]) => ({
      bucket: bucketKey,
      recordCount: values.length,
      totalServiceImpactScore: values.reduce((sum, item) => sum + item.serviceImpactScore, 0),
      averageMttrMinutes: average(values.map((item) => item.mttrMinutes)),
      averageRamsTotal: average(values.map((item) => item.ramsTotal)),
      maxRamsTotal: Math.max(...values.map((item) => item.ramsTotal)),
    }));
}

function buildHotspotsByDimension(records: RamsQuickRecordScore[], dimension: RamsHotspotDimension): RamsHotspot[] {
  const groups = new Map<string, RamsQuickRecordScore[]>();

  for (const record of records) {
    const keys = dimension === 'subsystem'
      ? record.subsystemIds.length > 0 ? record.subsystemIds : ['Unknown subsystem']
      : [dimension === 'location' ? record.location || 'Unknown location' : record.equipment || 'Unknown equipment'];

    for (const key of keys) {
      groups.set(key, [...(groups.get(key) || []), record]);
    }
  }

  return Array.from(groups.entries()).map(([key, values]) => {
    const averageRamsTotal = average(values.map((item) => item.ramsTotal));
    const riskLevel = riskLevelFromScore(Math.max(averageRamsTotal, Math.max(...values.map((item) => item.ramsTotal))));
    const reasons = Array.from(new Set(values.flatMap((item) => item.highlightReasons))).slice(0, 6);

    return {
      dimension,
      key,
      recordCount: values.length,
      averageRamsTotal,
      maxRamsTotal: Math.max(...values.map((item) => item.ramsTotal)),
      totalServiceImpactScore: values.reduce((sum, item) => sum + item.serviceImpactScore, 0),
      averageMttrMinutes: average(values.map((item) => item.mttrMinutes)),
      riskLevel,
      highlightReasons: reasons,
    };
  });
}

function buildHotspots(records: RamsQuickRecordScore[]): RamsHotspot[] {
  return [
    ...buildHotspotsByDimension(records, 'location'),
    ...buildHotspotsByDimension(records, 'subsystem'),
    ...buildHotspotsByDimension(records, 'equipment'),
  ]
    .sort((a, b) => b.maxRamsTotal - a.maxRamsTotal || b.recordCount - a.recordCount)
    .slice(0, 15);
}

function buildOccHighlights(summary: Omit<RamsQuickSummary, 'occHighlights'>) {
  const highlights: string[] = [];
  const criticalHotspots = summary.hotspots.filter((hotspot) => hotspot.riskLevel === 'critical' || hotspot.riskLevel === 'high').slice(0, 5);

  for (const hotspot of criticalHotspots) {
    highlights.push(`${hotspot.dimension.toUpperCase()} ${hotspot.key}: ${hotspot.riskLevel.toUpperCase()} RAMS hotspot, max score ${hotspot.maxRamsTotal}, avg MTTR ${hotspot.averageMttrMinutes} min.`);
  }

  const latestTrend = summary.trends[summary.trends.length - 1];
  const previousTrend = summary.trends[summary.trends.length - 2];
  if (latestTrend && previousTrend && latestTrend.averageRamsTotal > previousTrend.averageRamsTotal) {
    highlights.push(`RAMS trend is increasing from ${previousTrend.averageRamsTotal} to ${latestTrend.averageRamsTotal}. OCC should monitor escalation.`);
  }

  if (summary.affectedServiceRecords > 0) {
    highlights.push(`${summary.affectedServiceRecords}/${summary.totalRecords} records affected service operation.`);
  }

  return highlights.slice(0, 8);
}

export function calculateRamsQuickSummary(input: RamsQuickInput): RamsQuickSummary {
  const operatingMinutes = input.operatingMinutes || DEFAULT_OPERATING_MINUTES;
  const trendBucket = input.trendBucket || 'month';
  const scoredRecords = input.records.map((record) => scoreRecord(record, operatingMinutes));
  const trends = buildTrends(scoredRecords, trendBucket);
  const hotspots = buildHotspots(scoredRecords);

  const summaryWithoutHighlights: Omit<RamsQuickSummary, 'occHighlights'> = {
    generatedAt: (input.now || new Date()).toISOString(),
    totalRecords: scoredRecords.length,
    affectedServiceRecords: scoredRecords.filter((record) => record.serviceImpactScore > 0).length,
    averageMttrMinutes: average(scoredRecords.map((record) => record.mttrMinutes)),
    averageRamsTotal: average(scoredRecords.map((record) => record.ramsTotal)),
    totalServiceImpactScore: scoredRecords.reduce((sum, record) => sum + record.serviceImpactScore, 0),
    worstRiskLevel: maxRiskLevel(scoredRecords.map((record) => record.riskLevel)),
    records: scoredRecords,
    trends,
    hotspots,
  };

  return {
    ...summaryWithoutHighlights,
    occHighlights: buildOccHighlights(summaryWithoutHighlights),
  };
}
