import { AI_GOVERNANCE_CONFIG } from '../../../config/ai-governance-profile';
import {
  classifyAiDomain,
  detectPromptInjection,
  hasUnsafeLearningSignals,
} from '../control-plane';
import {
  canonicalizeData,
  clampScore,
  computeDataFingerprint,
  flattenText,
  getPath,
  hasPlaceholderValue,
  inferEntityId,
  inferEntityType,
  parseTimestamp,
} from './canonical';
import type {
  DataAssessmentOptions,
  DataProvenance,
  DataSourceType,
  GovernedDataEnvelope,
} from './types';

const SOURCE_TRUST: Record<DataSourceType, number> = {
  'human-approved': 1,
  database: 0.92,
  'system-event': 0.88,
  sensor: 0.82,
  document: 0.75,
  'ai-output': 0.45,
  unknown: 0.25,
};

export function assessDataCandidate<T extends Record<string, unknown>>(
  rawData: T,
  options: DataAssessmentOptions = {},
): GovernedDataEnvelope<T> {
  const data = canonicalizeData(rawData) as T;
  const text = flattenText(data);
  const entityType = options.entityType ?? inferEntityType(data);
  const entityId = options.entityId ?? inferEntityId(data);
  const domain = options.domain ?? classifyAiDomain(`${entityType} ${text}`);
  const namespace = options.namespace ?? `${domain}:${entityType}`;
  const version = options.version
    ?? String(data.version ?? data.revision ?? data.updatedAt ?? 'unversioned');
  const sourceType = options.provenance?.sourceType ?? 'unknown';
  const collectedAt = options.provenance?.collectedAt ?? new Date().toISOString();
  const provenance: DataProvenance = {
    sourceType,
    sourceId: options.provenance?.sourceId ?? 'unspecified',
    sourceVersion: options.provenance?.sourceVersion,
    collectedAt,
    effectiveAt: options.provenance?.effectiveAt,
    approvedBy: options.provenance?.approvedBy,
    checksum: options.provenance?.checksum,
  };

  const issues: string[] = [];
  let qualityScore = 100;
  let trustScore = SOURCE_TRUST[sourceType] * 100;

  if (!entityId || entityId.startsWith('unidentified-')) {
    issues.push('missing-stable-entity-id');
    qualityScore -= 20;
  }
  if (version === 'unversioned') {
    issues.push('missing-version');
    qualityScore -= 12;
  }
  if (!provenance.sourceId || provenance.sourceId === 'unspecified') {
    issues.push('missing-source-id');
    trustScore -= 20;
  }
  if (!provenance.sourceVersion) {
    issues.push('missing-source-version');
    trustScore -= 8;
  }
  if (sourceType === 'ai-output') {
    issues.push('ai-output-is-not-authoritative');
  }

  for (const field of options.requiredFields ?? []) {
    const value = getPath(data, field);
    if (value === undefined || value === null || value === '' || hasPlaceholderValue(value)) {
      issues.push(`missing-required-field:${field}`);
      qualityScore -= 12;
    }
  }

  const futureLimit = Date.now() + 5 * 60_000;
  const collectedTime = parseTimestamp(collectedAt);
  if (!collectedTime) {
    issues.push('invalid-collected-at');
    qualityScore -= 10;
  } else if (collectedTime > futureLimit) {
    issues.push('future-collected-at');
    qualityScore -= 18;
  }

  const effectiveTime = parseTimestamp(provenance.effectiveAt);
  if (effectiveTime && effectiveTime > Date.now() + 365 * 24 * 60 * 60_000) {
    issues.push('implausible-effective-at');
    qualityScore -= 12;
  }

  const injectionSignals = detectPromptInjection(text);
  if (injectionSignals.length > 0) {
    issues.push(...injectionSignals.map(signal => `prompt-injection:${signal}`));
    trustScore -= 35;
  }
  if (hasUnsafeLearningSignals(text)) {
    issues.push('unsafe-learning-content');
    trustScore -= 25;
  }

  const emptyFields = Object.values(data).filter(value => (
    value === ''
    || value === null
    || value === undefined
    || hasPlaceholderValue(value)
  )).length;
  const totalFields = Math.max(1, Object.keys(data).length);
  if (emptyFields / totalFields > 0.5) {
    issues.push('excessive-empty-fields');
    qualityScore -= 20;
  }

  qualityScore = clampScore(Math.round(qualityScore));
  trustScore = clampScore(Math.round(trustScore));
  const fingerprint = computeDataFingerprint({
    entityType,
    entityId,
    version,
    data,
    provenance,
  });

  const threshold = AI_GOVERNANCE_CONFIG.data;
  let decision: GovernedDataEnvelope<T>['decision'] = 'accept';
  if (trustScore < threshold.quarantineTrustBelow || injectionSignals.length > 0) {
    decision = 'quarantine';
  } else if (
    qualityScore < threshold.reviewQualityBelow
    || trustScore < threshold.reviewTrustBelow
    || issues.length >= threshold.reviewIssueCount
  ) {
    decision = 'review';
  }

  return {
    entityType,
    entityId,
    domain,
    namespace,
    version,
    data,
    provenance,
    fingerprint,
    qualityScore,
    trustScore,
    decision,
    issues,
  };
}
