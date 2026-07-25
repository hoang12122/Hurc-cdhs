import type { QueryIntent } from '../ai-smart-router';
import type { RagResponse } from '../trustgraph-client';
import type { GovernanceContext } from './control-plane';

export type SecureRagStage = 'before-retrieve' | 'after-retrieve' | 'before-generate' | 'after-generate';
export type EvidenceKind = 'graph' | 'document';

export interface SecureRagSource {
  id: string;
  kind: EvidenceKind;
  title?: string;
  documentCode?: string;
  version?: string;
  page?: string | number;
  collection: string;
  score?: number;
  hash: string;
}

export interface SecureEvidence extends SecureRagSource {
  content: string;
  trustWeight: number;
  injectionSignals: string[];
  quarantined: boolean;
  quarantineReason?: string;
}

export interface SecureRagSecurityReport {
  blocked: boolean;
  blockReason?: string;
  requestedCollection?: string;
  resolvedCollection: string;
  namespaceHash: string;
  retrievalBranches: number;
  acceptedEvidence: number;
  quarantinedEvidence: number;
  redactionsApplied: number;
  promptInjectionSignals: string[];
  answerGuardTriggered: boolean;
  elapsedMs: number;
  trace: Array<{ hook: string; stage: SecureRagStage; elapsedMs: number }>;
}

export interface SecureRagResult {
  response: string;
  intent: QueryIntent | 'ensemble';
  source: string;
  sources: SecureRagSource[];
  security: SecureRagSecurityReport;
}

export interface SecureRagOptions {
  collection?: string;
  forceIntent?: QueryIntent;
  user?: string;
  userId?: string;
  systemPrompt?: string;
  retrievalTimeoutMs?: number;
  generationTimeoutMs?: number;
  maxEvidenceChars?: number;
  maxEvidenceItems?: number;
  hooks?: SecureRagHook[];
}

export interface RawRetrievalBranch {
  kind: EvidenceKind;
  response?: RagResponse;
  error?: string;
}

export interface SecureRagState {
  governance: GovernanceContext;
  query: string;
  intent: QueryIntent;
  requestedCollection?: string;
  collection: string;
  userScope: string;
  rawBranches: RawRetrievalBranch[];
  evidence: SecureEvidence[];
  generationPrompt: string;
  output: string;
  outputSource: string;
  blocked: boolean;
  blockReason?: string;
  redactionsApplied: number;
  answerGuardTriggered: boolean;
  trace: SecureRagSecurityReport['trace'];
}

export interface SecureRagHook {
  name: string;
  beforeRetrieve?: (state: SecureRagState) => void | Promise<void>;
  afterRetrieve?: (state: SecureRagState) => void | Promise<void>;
  beforeGenerate?: (state: SecureRagState) => void | Promise<void>;
  afterGenerate?: (state: SecureRagState) => void | Promise<void>;
}
