import { IS_DATABASE_OFFLINE } from '../../prisma';
import {
  appendGovernanceAudit,
  sanitizeAiText,
} from '../ai/control-plane';
import type {
  AgentMemory,
  MemoryVerificationStatus,
} from './types';

export const ACTIVE_COLLECTION = 'ai_longterm_memory';
export const QUARANTINE_COLLECTION = 'ai_memory_quarantine';
export const ONLINE_MEMORY_TARGET_TYPE = 'AI_MEMORY';
export const ONLINE_MEMORY_SOURCE_MODULE = 'MEMORY_FIREWALL';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function calculateExpiry(
  importance: number,
  confidence: number,
  ttlDays?: number,
): string {
  const computedDays = ttlDays ?? Math.round(30 + importance * 18 + confidence * 120);
  const expires = new Date();
  expires.setUTCDate(expires.getUTCDate() + clamp(computedDays, 30, 365));
  return expires.toISOString();
}

function tokenize(value: string): Set<string> {
  const tokens = sanitizeAiText(value, 20_000)
    .toLocaleLowerCase('vi')
    .split(/[^a-z0-9\u00c0-\u1ef9_-]+/i)
    .map(token => token.trim())
    .filter(token => token.length >= 3);
  return new Set(tokens);
}

export function lexicalSimilarity(query: string, memoryText: string): number {
  const queryTokens = tokenize(query);
  const memoryTokens = tokenize(memoryText);
  if (queryTokens.size === 0 || memoryTokens.size === 0) return 0;

  let intersection = 0;
  for (const token of queryTokens) {
    if (memoryTokens.has(token)) intersection += 1;
  }
  return intersection / Math.max(queryTokens.size, 1);
}

function extractEntityIds(value: string): Set<string> {
  const matches = value.match(/(?:DNF|HAZ|INS|CA|EQ|AST)-[A-Z0-9_-]+/gi) ?? [];
  return new Set(matches.map(item => item.toUpperCase()));
}

export function entityOverlap(query: string, memoryText: string): number {
  const queryIds = extractEntityIds(query);
  if (queryIds.size === 0) return 0;

  const memoryIds = extractEntityIds(memoryText);
  let matches = 0;
  for (const id of queryIds) {
    if (memoryIds.has(id)) matches += 1;
  }
  return matches / queryIds.size;
}

export function isAgentMemory(value: unknown): value is AgentMemory {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<AgentMemory>;
  return Boolean(
    record.id
      && record.userId
      && record.namespace
      && record.topic
      && record.context
      && record.checksum
      && record.verificationStatus,
  );
}

export function memoryFromVerificationLog(log: {
  status: string;
  aiProposedContent: unknown;
  finalContent: unknown;
}): AgentMemory | null {
  const candidate = log.status === 'APPROVED' && log.finalContent
    ? log.finalContent
    : log.aiProposedContent;
  if (!isAgentMemory(candidate)) return null;

  const verificationStatus: MemoryVerificationStatus = log.status === 'APPROVED'
    ? 'verified'
    : log.status === 'REJECTED'
      ? candidate.verificationStatus === 'superseded'
        ? 'superseded'
        : 'quarantined'
      : 'provisional';

  return {
    ...candidate,
    verificationStatus,
  };
}

export function onlineStatusForMemory(
  status: MemoryVerificationStatus,
): 'PROPOSED' | 'APPROVED' | 'REJECTED' {
  if (status === 'verified') return 'APPROVED';
  if (status === 'quarantined' || status === 'superseded') return 'REJECTED';
  return 'PROPOSED';
}

export async function safeAudit(
  input: Parameters<typeof appendGovernanceAudit>[0],
): Promise<void> {
  if (!IS_DATABASE_OFFLINE) return;
  try {
    await appendGovernanceAudit(input);
  } catch (error) {
    console.warn(
      '[AI MEMORY] Governance audit persistence unavailable:',
      error instanceof Error ? error.message : error,
    );
  }
}
