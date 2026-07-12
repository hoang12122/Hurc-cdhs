import { jsonDb } from '../../db/json-db';
import {
  classifyAiDomain,
  detectPromptInjection,
  hasUnsafeLearningSignals,
  sanitizeAiText,
  sha256,
  type AiDomain,
} from './control-plane';

export type DataSourceType = 'human-approved' | 'database' | 'system-event' | 'document' | 'sensor' | 'ai-output' | 'unknown';
export type DataDecision = 'accept' | 'review' | 'quarantine' | 'duplicate' | 'reject';

export interface DataProvenance {
  sourceType: DataSourceType;
  sourceId: string;
  sourceVersion?: string;
  collectedAt: string;
  effectiveAt?: string;
  approvedBy?: string;
  checksum?: string;
}

export interface GovernedDataEnvelope<T = Record<string, unknown>> {
  entityType: string;
  entityId: string;
  domain: AiDomain;
  namespace: string;
  version: string;
  data: T;
  provenance: DataProvenance;
  fingerprint: string;
  qualityScore: number;
  trustScore: number;
  decision: DataDecision;
  issues: string[];
}

export interface DataAssessmentOptions {
  entityType?: string;
  entityId?: string;
  namespace?: string;
  domain?: AiDomain;
  version?: string;
  provenance?: Partial<DataProvenance>;
  requiredFields?: string[];
  safetyCriticalFields?: string[];
}

export interface ReconciliationResult<T = Record<string, unknown>> {
  decision: DataDecision;
  winner?: GovernedDataEnvelope<T>;
  loser?: GovernedDataEnvelope<T>;
  reasons: string[];
  requiresHumanApproval: boolean;
}

const SOURCE_TRUST: Record<DataSourceType, number> = {
  'human-approved': 1,
  database: 0.92,
  'system-event': 0.88,
  sensor: 0.82,
  document: 0.75,
  'ai-output': 0.45,
  unknown: 0.25,
};

const DEFAULT_SAFETY_FIELDS = ['status', 'priority', 'riskLevel', 'severity', 'likelihood', 'isolationState', 'operationalState'];

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeString(value: string): string {
  return sanitizeAiText(value, 50_000)
    .replace(/\s+/g, ' ')
    .trim();
}

export function canonicalizeData(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return normalizeString(value);
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null;
    return Object.is(value, -0) ? 0 : value;
  }
  if (typeof value === 'boolean') return value;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(canonicalizeData);
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return Object.keys(record)
      .sort((a, b) => a.localeCompare(b))
      .reduce<Record<string, unknown>>((result, key) => {
        if (record[key] !== undefined) result[key] = canonicalizeData(record[key]);
        return result;
      }, {});
  }
  return String(value);
}

export function computeDataFingerprint(value: unknown): string {
  return sha256(JSON.stringify(canonicalizeData(value)));
}

function flattenText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(flattenText).join(' ');
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).map(flattenText).join(' ');
  }
  return value == null ? '' : String(value);
}

function hasPlaceholderValue(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  return /^(n\/a|na|none|null|undefined|unknown|tbd|todo|chưa rõ|không rõ|-+)$/i.test(value.trim());
}

function getPath(record: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') return undefined;
    return (current as Record<string, unknown>)[segment];
  }, record);
}

function inferEntityId(record: Record<string, unknown>): string {
  const candidate = record.id ?? record.entityId ?? record.code ?? record.failureReportNo ?? record.assetId ?? record.equipmentId;
  return candidate ? normalizeString(String(candidate)) : `unidentified-${computeDataFingerprint(record).slice(0, 16)}`;
}

function inferEntityType(record: Record<string, unknown>): string {
  return normalizeString(String(record.entityType ?? record.type ?? record.recordType ?? 'unknown-entity'));
}

function parseTimestamp(value: unknown): number | null {
  if (!value) return null;
  const parsed = new Date(String(value)).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

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
  const version = options.version ?? String(data.version ?? data.revision ?? data.updatedAt ?? 'unversioned');
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

  const emptyFields = Object.values(data).filter(value => value === '' || value === null || value === undefined || hasPlaceholderValue(value)).length;
  const totalFields = Math.max(1, Object.keys(data).length);
  if (emptyFields / totalFields > 0.5) {
    issues.push('excessive-empty-fields');
    qualityScore -= 20;
  }

  qualityScore = clamp(Math.round(qualityScore));
  trustScore = clamp(Math.round(trustScore));
  const fingerprint = computeDataFingerprint({ entityType, entityId, version, data, provenance });

  let decision: DataDecision = 'accept';
  if (trustScore < 40 || injectionSignals.length > 0) decision = 'quarantine';
  else if (qualityScore < 60 || trustScore < 65 || issues.length >= 4) decision = 'review';

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

function compareVersion(a: string, b: string): number {
  const aTime = parseTimestamp(a);
  const bTime = parseTimestamp(b);
  if (aTime && bTime) return aTime - bTime;
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function safetyFieldConflicts(
  existing: Record<string, unknown>,
  incoming: Record<string, unknown>,
  fields: string[],
): string[] {
  return fields.filter(field => {
    const oldValue = getPath(existing, field);
    const newValue = getPath(incoming, field);
    return oldValue !== undefined && newValue !== undefined && JSON.stringify(oldValue) !== JSON.stringify(newValue);
  });
}

/**
 * Deterministic conflict resolver. It never auto-overwrites safety-critical
 * fields and never lets AI-generated data replace verified operational data.
 */
export function reconcileDataCandidates<T extends Record<string, unknown>>(
  existing: GovernedDataEnvelope<T>,
  incoming: GovernedDataEnvelope<T>,
  safetyCriticalFields: string[] = DEFAULT_SAFETY_FIELDS,
): ReconciliationResult<T> {
  const reasons: string[] = [];

  if (existing.entityType !== incoming.entityType || existing.entityId !== incoming.entityId) {
    return {
      decision: 'reject',
      reasons: ['entity-identity-mismatch'],
      requiresHumanApproval: true,
    };
  }

  if (existing.fingerprint === incoming.fingerprint) {
    return {
      decision: 'duplicate',
      winner: existing,
      loser: incoming,
      reasons: ['identical-fingerprint'],
      requiresHumanApproval: false,
    };
  }

  const criticalConflicts = safetyFieldConflicts(existing.data, incoming.data, safetyCriticalFields);
  if (criticalConflicts.length > 0) {
    reasons.push(...criticalConflicts.map(field => `safety-critical-conflict:${field}`));
    return {
      decision: 'review',
      winner: existing,
      loser: incoming,
      reasons,
      requiresHumanApproval: true,
    };
  }

  if (existing.provenance.sourceType !== 'ai-output' && incoming.provenance.sourceType === 'ai-output') {
    return {
      decision: 'quarantine',
      winner: existing,
      loser: incoming,
      reasons: ['ai-output-cannot-overwrite-operational-source'],
      requiresHumanApproval: true,
    };
  }

  const versionComparison = compareVersion(incoming.version, existing.version);
  const incomingComposite = incoming.trustScore * 0.55 + incoming.qualityScore * 0.45;
  const existingComposite = existing.trustScore * 0.55 + existing.qualityScore * 0.45;

  if (versionComparison > 0 && incomingComposite >= existingComposite - 5) {
    return {
      decision: incoming.decision === 'accept' ? 'accept' : 'review',
      winner: incoming,
      loser: existing,
      reasons: ['newer-version-with-acceptable-trust'],
      requiresHumanApproval: incoming.decision !== 'accept',
    };
  }

  if (incomingComposite > existingComposite + 15 && incoming.provenance.approvedBy) {
    return {
      decision: 'accept',
      winner: incoming,
      loser: existing,
      reasons: ['materially-higher-trust-human-approved-source'],
      requiresHumanApproval: false,
    };
  }

  return {
    decision: 'review',
    winner: existing,
    loser: incoming,
    reasons: ['ambiguous-version-or-trust-precedence'],
    requiresHumanApproval: true,
  };
}

export function partitionGovernedContext<T extends Record<string, unknown>>(
  envelopes: GovernedDataEnvelope<T>[],
  maxChars = 24_000,
): string {
  const eligible = envelopes
    .filter(item => item.decision === 'accept' || item.decision === 'review')
    .sort((a, b) => b.trustScore - a.trustScore || b.qualityScore - a.qualityScore || a.entityId.localeCompare(b.entityId));

  const partitions = new Map<string, string[]>();
  for (const envelope of eligible) {
    const key = `${envelope.namespace}|${envelope.domain}`;
    const list = partitions.get(key) ?? [];
    list.push(JSON.stringify({
      entityType: envelope.entityType,
      entityId: envelope.entityId,
      version: envelope.version,
      provenance: envelope.provenance,
      trustScore: envelope.trustScore,
      qualityScore: envelope.qualityScore,
      data: envelope.data,
    }));
    partitions.set(key, list);
  }

  let output = '';
  for (const [partition, records] of partitions) {
    const block = `\n[DATA PARTITION: ${partition}]\n${records.join('\n')}\n`;
    if (output.length + block.length > maxChars) break;
    output += block;
  }
  return output.trim();
}

export async function quarantineDataCandidate<T extends Record<string, unknown>>(
  envelope: GovernedDataEnvelope<T>,
  reason?: string,
): Promise<void> {
  try {
    await jsonDb.insertRecord('ai_data_quarantine', {
      id: `dataq-${envelope.fingerprint.slice(0, 24)}`,
      ...envelope,
      decision: 'quarantine',
      quarantineReason: reason ?? envelope.issues.join('; '),
      quarantinedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('[AI DATA GOVERNANCE] Quarantine persistence unavailable:', error instanceof Error ? error.message : error);
  }
}
