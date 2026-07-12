import type { AiDomain, AiExpertRole } from '../ai/control-plane';

export type MemoryVerificationStatus =
  | 'provisional'
  | 'verified'
  | 'quarantined'
  | 'superseded';

export type MemorySourceType =
  | 'ai-output'
  | 'database'
  | 'document'
  | 'human-approved'
  | 'system-event';

export interface AgentMemory {
  id: string;
  userId: string;
  namespace: string;
  domain: AiDomain;
  agentRole: AiExpertRole;
  topic: string;
  context: string;
  importance: number;
  confidence: number;
  checksum: string;
  sourceType: MemorySourceType;
  sourceId?: string;
  sourceVersion?: string;
  provenanceIds: string[];
  verificationStatus: MemoryVerificationStatus;
  reinforcementCount: number;
  timestamp: string;
  lastSeenAt: string;
  expiresAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoreExperienceOptions {
  role?: AiExpertRole;
  domain?: AiDomain;
  namespace?: string;
  confidence?: number;
  sourceType?: MemorySourceType;
  sourceId?: string;
  sourceVersion?: string;
  provenanceIds?: string[];
  humanApproved?: boolean;
  ttlDays?: number;
}

export interface RetrieveMemoryOptions {
  role?: AiExpertRole;
  domain?: AiDomain;
  namespace?: string;
  minimumConfidence?: number;
  includeProvisional?: boolean;
}

export type MemoryReviewDecision = 'approve' | 'quarantine' | 'supersede';

export interface MemoryHealth {
  store: 'json-memory-firewall' | 'postgres-ai-verification-log';
  active: number;
  verified: number;
  provisional: number;
  quarantined: number;
  superseded: number;
  expired: number;
  duplicateReinforcements: number;
}
