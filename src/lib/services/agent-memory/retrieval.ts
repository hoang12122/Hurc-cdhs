import { AI_GOVERNANCE_CONFIG } from '../../config/ai-governance-profile';
import { IS_DATABASE_OFFLINE } from '../../prisma';
import {
  buildMemoryNamespace,
  classifyAiDomain,
  sanitizeAiText,
  sha256,
  type AiExpertRole,
} from '../ai/control-plane';
import { buildLocalSemanticVector, selectWithMmr } from '../ai/local-vector';
import {
  loadOfflineActiveMemories,
  loadOfflineQuarantinedMemories,
} from './offline-storage';
import { loadOnlineMemories } from './online-storage';
import {
  clamp,
  entityOverlap,
  lexicalSimilarity,
  safeAudit,
} from './shared';
import type {
  AgentMemory,
  MemoryHealth,
  RetrieveMemoryOptions,
} from './types';

const DEFAULT_ROLE: AiExpertRole = 'TECHNICAL_ANALYST';
const MMR_LAMBDA = 0.78;

async function loadActiveMemories(): Promise<AgentMemory[]> {
  return IS_DATABASE_OFFLINE
    ? loadOfflineActiveMemories()
    : loadOnlineMemories(['PROPOSED', 'APPROVED']);
}

async function loadQuarantine(): Promise<AgentMemory[]> {
  return IS_DATABASE_OFFLINE
    ? loadOfflineQuarantinedMemories()
    : loadOnlineMemories(['REJECTED']);
}

export async function retrieveMemories(
  userId: string,
  query: string,
  limit = AI_GOVERNANCE_CONFIG.memory.retrievalLimit,
  options: RetrieveMemoryOptions = {},
): Promise<string> {
  const normalizedQuery = sanitizeAiText(query, 2_000);
  if (!userId || !normalizedQuery) return '';

  try {
    const profile = AI_GOVERNANCE_CONFIG.memory;
    const domain = options.domain ?? classifyAiDomain(normalizedQuery);
    const role = options.role ?? DEFAULT_ROLE;
    const namespace = options.namespace
      ?? buildMemoryNamespace(role, domain, userId);
    const minimumConfidence = clamp(
      options.minimumConfidence ?? profile.retrievalMinConfidence,
      0,
      1,
    );
    const includeProvisional = options.includeProvisional
      ?? profile.includeProvisional;
    const now = Date.now();
    const queryVector = buildLocalSemanticVector(normalizedQuery);
    const memories = await loadActiveMemories();

    const candidates = memories
      .filter(memory => memory.userId === userId)
      .filter(memory => memory.namespace === namespace)
      .filter(memory => memory.verificationStatus === 'verified'
        || (includeProvisional && memory.verificationStatus === 'provisional'))
      .filter(memory => memory.confidence >= minimumConfidence)
      .filter(memory => !memory.expiresAt
        || new Date(memory.expiresAt).getTime() > now)
      .map(memory => {
        const text = `${memory.topic}\n${memory.context}`;
        const vector = buildLocalSemanticVector(text);
        const semantic = vector.reduce(
          (sum, value, index) => sum + value * queryVector[index],
          0,
        );
        const lexical = lexicalSimilarity(normalizedQuery, text);
        const entity = entityOverlap(normalizedQuery, text);
        const ageDays = Math.max(
          0,
          (now - new Date(memory.lastSeenAt || memory.timestamp).getTime())
            / 86_400_000,
        );
        const recency = Math.exp(-ageDays / 120);
        const score = lexical * 0.28
          + Math.max(0, semantic) * 0.30
          + entity * 0.20
          + memory.confidence * 0.12
          + (memory.importance / 10) * 0.06
          + recency * 0.04;
        return {
          item: { memory, score, semantic: Math.max(0, semantic) },
          relevance: score,
          vector,
        };
      })
      .filter(candidate => candidate.item.score >= profile.relevanceThreshold)
      .sort((left, right) => right.relevance - left.relevance
        || right.item.memory.confidence - left.item.memory.confidence);

    const relevant = selectWithMmr(
      candidates,
      clamp(limit, 1, 10),
      MMR_LAMBDA,
    ).map(candidate => candidate.item);

    await safeAudit({
      requestId: `memread-${sha256(`${namespace}:${normalizedQuery}`).slice(0, 20)}`,
      phase: 'memory-retrieve',
      operation: 'retrieve-memory',
      agentId: role,
      domain,
      namespace,
      riskLevel: 'low',
      riskScore: 5,
      fingerprint: sha256(`${namespace}:${normalizedQuery}`),
      summary: `Retrieved ${relevant.length} governed memories using lexical, entity, local-vector and MMR ranking`,
      decision: 'allow',
      confidence: relevant.length > 0 ? relevant[0].memory.confidence : 0,
    });

    if (relevant.length === 0) return '';
    return '\n[NGỮ CẢNH QUÁ KHỨ ĐÃ QUA MEMORY FIREWALL]:\n'
      + relevant.map(({ memory, score, semantic }) => {
        const status = memory.verificationStatus === 'verified'
          ? 'ĐÃ XÁC MINH'
          : 'TẠM THỜI';
        return `- [${status}; confidence=${memory.confidence.toFixed(2)}; relevance=${score.toFixed(2)}; vector=${semantic.toFixed(2)}; source=${memory.sourceType}] ${memory.topic}: ${memory.context}`;
      }).join('\n');
  } catch (error) {
    console.warn(
      '[AI MEMORY] Retrieval skipped:',
      error instanceof Error ? error.message : error,
    );
    return '';
  }
}

export async function getReviewableMemories(
  limit = 100,
): Promise<AgentMemory[]> {
  const boundedLimit = clamp(limit, 1, 500);
  const [active, quarantine] = await Promise.all([
    loadActiveMemories(),
    loadQuarantine(),
  ]);
  return [...active, ...quarantine]
    .filter(memory => memory.verificationStatus === 'provisional'
      || memory.verificationStatus === 'quarantined')
    .sort((a, b) => new Date(b.lastSeenAt || b.timestamp).getTime()
      - new Date(a.lastSeenAt || a.timestamp).getTime())
    .slice(0, boundedLimit);
}

export async function getQuarantinedMemories(
  limit = 100,
): Promise<AgentMemory[]> {
  const boundedLimit = clamp(limit, 1, 500);
  if (!IS_DATABASE_OFFLINE) {
    return loadOnlineMemories(['REJECTED'], boundedLimit);
  }
  const records = await loadOfflineQuarantinedMemories();
  return [...records].reverse().slice(0, boundedLimit);
}

export async function getMemoryHealth(): Promise<MemoryHealth> {
  const [active, quarantine] = await Promise.all([
    loadActiveMemories(),
    loadQuarantine(),
  ]);
  const now = Date.now();

  return {
    store: IS_DATABASE_OFFLINE
      ? 'json-memory-firewall'
      : 'postgres-ai-verification-log',
    active: active.filter(item => item.verificationStatus !== 'superseded').length,
    verified: active.filter(item => item.verificationStatus === 'verified').length,
    provisional: active.filter(item => item.verificationStatus === 'provisional').length,
    quarantined: quarantine.filter(item => item.verificationStatus === 'quarantined').length,
    superseded: quarantine.filter(item => item.verificationStatus === 'superseded').length,
    expired: active.filter(item => item.expiresAt
      && new Date(item.expiresAt).getTime() <= now).length,
    duplicateReinforcements: active.reduce(
      (sum, item) => sum + Math.max(0, (item.reinforcementCount ?? 1) - 1),
      0,
    ),
  };
}
