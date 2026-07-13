import { getPath, parseTimestamp } from './canonical';
import type {
  GovernedDataEnvelope,
  ReconciliationResult,
} from './types';

const DEFAULT_SAFETY_FIELDS = [
  'status',
  'priority',
  'riskLevel',
  'severity',
  'likelihood',
  'isolationState',
  'operationalState',
];

function compareVersion(a: string, b: string): number {
  const aTime = parseTimestamp(a);
  const bTime = parseTimestamp(b);
  if (aTime && bTime) return aTime - bTime;
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

function safetyFieldConflicts(
  existing: Record<string, unknown>,
  incoming: Record<string, unknown>,
  fields: string[],
): string[] {
  return fields.filter(field => {
    const oldValue = getPath(existing, field);
    const newValue = getPath(incoming, field);
    return oldValue !== undefined
      && newValue !== undefined
      && JSON.stringify(oldValue) !== JSON.stringify(newValue);
  });
}

export function reconcileDataCandidates<T extends Record<string, unknown>>(
  existing: GovernedDataEnvelope<T>,
  incoming: GovernedDataEnvelope<T>,
  safetyCriticalFields: string[] = DEFAULT_SAFETY_FIELDS,
): ReconciliationResult<T> {
  const reasons: string[] = [];

  if (
    existing.entityType !== incoming.entityType
    || existing.entityId !== incoming.entityId
  ) {
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

  const criticalConflicts = safetyFieldConflicts(
    existing.data,
    incoming.data,
    safetyCriticalFields,
  );
  if (criticalConflicts.length > 0) {
    reasons.push(...criticalConflicts.map(
      field => `safety-critical-conflict:${field}`,
    ));
    return {
      decision: 'review',
      winner: existing,
      loser: incoming,
      reasons,
      requiresHumanApproval: true,
    };
  }

  if (
    existing.provenance.sourceType !== 'ai-output'
    && incoming.provenance.sourceType === 'ai-output'
  ) {
    return {
      decision: 'quarantine',
      winner: existing,
      loser: incoming,
      reasons: ['ai-output-cannot-overwrite-operational-source'],
      requiresHumanApproval: true,
    };
  }

  const versionComparison = compareVersion(incoming.version, existing.version);
  const incomingComposite = incoming.trustScore * 0.55
    + incoming.qualityScore * 0.45;
  const existingComposite = existing.trustScore * 0.55
    + existing.qualityScore * 0.45;

  if (versionComparison > 0 && incomingComposite >= existingComposite - 5) {
    return {
      decision: incoming.decision === 'accept' ? 'accept' : 'review',
      winner: incoming,
      loser: existing,
      reasons: ['newer-version-with-acceptable-trust'],
      requiresHumanApproval: incoming.decision !== 'accept',
    };
  }

  if (
    incomingComposite > existingComposite + 15
    && incoming.provenance.approvedBy
  ) {
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
