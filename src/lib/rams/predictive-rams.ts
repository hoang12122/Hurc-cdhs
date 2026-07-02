import type { DnfDocument } from '@/lib/types';
import { calculateRamsQuickSummary } from '@/lib/rams/rams-risk-engine';

export interface PredictiveRamsSignal {
  key: string;
  dimension: 'location' | 'subsystem' | 'equipment';
  recurrenceScore: number;
  assetHealthScore: number;
  failureProbability: number;
  predictedHotspot: boolean;
  suggestedPreventiveAction: string;
  evidence: string[];
}

export interface PredictiveRamsSummary {
  generatedAt: string;
  signals: PredictiveRamsSignal[];
  topSignals: PredictiveRamsSignal[];
  overallPrediction: 'stable' | 'watch' | 'elevated' | 'critical';
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function groupRecords(records: DnfDocument[], dimension: PredictiveRamsSignal['dimension']) {
  const groups = new Map<string, DnfDocument[]>();

  for (const record of records) {
    const keys = dimension === 'subsystem'
      ? record.subsystemIds && record.subsystemIds.length > 0 ? record.subsystemIds : ['Unknown subsystem']
      : [dimension === 'location' ? record.locationOfFailure || 'Unknown location' : record.failedComponentEquipmentLRUTrainNumber || 'Unknown equipment'];

    for (const key of keys) {
      groups.set(key, [...(groups.get(key) || []), record]);
    }
  }

  return groups;
}

function buildSignal(key: string, dimension: PredictiveRamsSignal['dimension'], records: DnfDocument[]): PredictiveRamsSignal {
  const rams = calculateRamsQuickSummary({ records, trendBucket: 'week' });
  const serviceImpacts = records.filter((record) => record.trainServiceAffected || record.trainWithdrawn || (record.disruptionDuration || 0) > 0).length;
  const highHazards = records.filter((record) => record.hazardLevelId === 'high').length;
  const repeatedText = records.filter((record) => /repeated|recurrence|repeat|lặp lại|tái diễn|lap lai|tai dien/i.test(`${record.descriptionOfFailure || ''} ${record.impactAssessment || ''}`)).length;

  const recurrenceScore = clamp(records.length * 12 + repeatedText * 18 + serviceImpacts * 8);
  const assetHealthScore = clamp(100 - (rams.averageRamsTotal * 0.55 + highHazards * 10 + serviceImpacts * 6));
  const failureProbability = clamp(recurrenceScore * 0.45 + rams.averageRamsTotal * 0.35 + (100 - assetHealthScore) * 0.2);
  const predictedHotspot = failureProbability >= 60 || rams.worstRiskLevel === 'critical' || rams.worstRiskLevel === 'high';

  const suggestedPreventiveAction = predictedHotspot
    ? 'Prioritize preventive inspection, RCA review and corrective action verification for this hotspot.'
    : 'Continue monitoring through routine FRACAS/RAMS trend review.';

  const evidence = [
    `${records.length} related DNF records`,
    `${serviceImpacts} service-impact records`,
    `${highHazards} high-hazard records`,
    `Average RAMS ${rams.averageRamsTotal}`,
    `Average MTTR ${rams.averageMttrMinutes} min`,
  ];

  return {
    key,
    dimension,
    recurrenceScore,
    assetHealthScore,
    failureProbability,
    predictedHotspot,
    suggestedPreventiveAction,
    evidence,
  };
}

export function calculatePredictiveRamsSummary(records: DnfDocument[]): PredictiveRamsSummary {
  const signals: PredictiveRamsSignal[] = [];

  for (const dimension of ['location', 'subsystem', 'equipment'] as const) {
    const groups = groupRecords(records, dimension);
    for (const [key, values] of groups.entries()) {
      signals.push(buildSignal(key, dimension, values));
    }
  }

  const sortedSignals = signals.sort((a, b) => b.failureProbability - a.failureProbability || a.assetHealthScore - b.assetHealthScore);
  const topSignals = sortedSignals.slice(0, 10);
  const maxProbability = topSignals[0]?.failureProbability || 0;

  const overallPrediction = maxProbability >= 80 ? 'critical' : maxProbability >= 60 ? 'elevated' : maxProbability >= 35 ? 'watch' : 'stable';

  return {
    generatedAt: new Date().toISOString(),
    signals: sortedSignals,
    topSignals,
    overallPrediction,
  };
}
