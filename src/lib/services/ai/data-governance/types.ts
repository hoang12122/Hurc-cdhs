import type { AiDomain } from '../control-plane';

export type DataSourceType =
  | 'human-approved'
  | 'database'
  | 'system-event'
  | 'document'
  | 'sensor'
  | 'ai-output'
  | 'unknown';

export type DataDecision =
  | 'accept'
  | 'review'
  | 'quarantine'
  | 'duplicate'
  | 'reject';

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
