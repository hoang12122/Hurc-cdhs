import { AI_GOVERNANCE_CONFIG } from '../../config/ai-governance-profile';
import { IS_DATABASE_OFFLINE } from '../../prisma';
import {
  buildMemoryNamespace,
  classifyAiDomain,
  hasUnsafeLearningSignals,
  sanitizeAiText,
  sha256,
  type AiExpertRole,
} from '../ai/control-plane';
import { persistOfflineMemory } from './offline-storage';
import {
  findOnlineMemoryByChecksum,
  persistOnlineMemory,
} from './online-storage';
import { calculateExpiry, clamp } from './shared';
import type {
  AgentMemory,
  MemoryVerificationStatus,
  StoreExperienceOptions,
} from './types';

const DEFAULT_ROLE: AiExpertRole = 'TECHNICAL_ANALYST';

function resolveVerificationStatus(
  sourceType: StoreExperienceOptions['sourceType'],
  confidence: number,
  humanApproved: boolean,
  unsafe: boolean,
): MemoryVerificationStatus {
  const profile = AI_GOVERNANCE_CONFIG;
  if (unsafe) return 'quarantined';
  if (humanApproved || sourceType === 'human-approved' || sourceType === 'database') {
    return 'verified';
  }
  if (sourceType === 'ai-output' && !profile.agent.allowAiMemoryCandidates) {
    return 'quarantined';
  }
  return confidence >= profile.memory.provisionalThreshold ? 'provisional' : 'quarantined';
}

export async function storeExperience(
  userId: string,
  topic: string,
  context: string,
  importance = 5,
  options: StoreExperienceOptions = {},
): Promise<void> {
  const profile = AI_GOVERNANCE_CONFIG.memory;
  const normalizedTopic = sanitizeAiText(topic, profile.topicMaxChars);
  const normalizedContext = sanitizeAiText(context, profile.contextMaxChars);
  if (!userId || !normalizedTopic || !normalizedContext) return;

  const domain = options.domain
    ?? classifyAiDomain(`${normalizedTopic}\n${normalizedContext}`);
  const role = options.role ?? DEFAULT_ROLE;
  const namespace = options.namespace
    ?? buildMemoryNamespace(role, domain, userId);
  const sourceType = options.sourceType ?? 'ai-output';
  const confidence = clamp(
    options.humanApproved
      ? Math.max(
        options.confidence ?? profile.humanApprovedMinConfidence,
        profile.humanApprovedMinConfidence,
      )
      : options.confidence ?? profile.defaultConfidence,
    0,
    1,
  );
  const unsafe = hasUnsafeLearningSignals(
    `${normalizedTopic}\n${normalizedContext}`,
  );
  const verificationStatus = resolveVerificationStatus(
    sourceType,
    confidence,
    options.humanApproved === true,
    unsafe,
  );
  const checksum = sha256(
    `${namespace}\n${normalizedTopic}\n${normalizedContext}`,
  );
  const now = new Date().toISOString();
  const memoryId = `mem-${checksum.slice(0, 24)}`;

  try {
    if (!IS_DATABASE_OFFLINE) {
      const { log: existing, memory: existingMemory } =
        await findOnlineMemoryByChecksum(checksum);
      const resolvedImportance = Math.max(
        existingMemory?.importance ?? 1,
        clamp(importance, 1, 10),
      );
      const resolvedConfidence = Math.max(
        existingMemory?.confidence ?? 0,
        confidence,
      );
      const memory: AgentMemory = {
        id: existingMemory?.id ?? memoryId,
        userId,
        namespace,
        domain,
        agentRole: role,
        topic: normalizedTopic,
        context: normalizedContext,
        importance: resolvedImportance,
        confidence: resolvedConfidence,
        checksum,
        sourceType: existingMemory?.sourceType === 'human-approved'
          ? 'human-approved'
          : sourceType,
        sourceId: options.sourceId ?? existingMemory?.sourceId,
        sourceVersion: options.sourceVersion ?? existingMemory?.sourceVersion,
        provenanceIds: Array.from(new Set([
          ...(existingMemory?.provenanceIds ?? []),
          ...(options.provenanceIds ?? []),
        ])),
        verificationStatus: existing?.status === 'APPROVED'
          ? 'verified'
          : verificationStatus,
        reinforcementCount: (existingMemory?.reinforcementCount ?? 0) + 1,
        timestamp: existingMemory?.timestamp ?? now,
        lastSeenAt: now,
        expiresAt: calculateExpiry(
          resolvedImportance,
          resolvedConfidence,
          options.ttlDays,
        ),
      };
      await persistOnlineMemory(memory);
      return;
    }

    const memory: AgentMemory = {
      id: memoryId,
      userId,
      namespace,
      domain,
      agentRole: role,
      topic: normalizedTopic,
      context: normalizedContext,
      importance: clamp(importance, 1, 10),
      confidence,
      checksum,
      sourceType,
      sourceId: options.sourceId,
      sourceVersion: options.sourceVersion,
      provenanceIds: Array.from(new Set(options.provenanceIds ?? [])),
      verificationStatus,
      reinforcementCount: 1,
      timestamp: now,
      lastSeenAt: now,
      expiresAt: calculateExpiry(importance, confidence, options.ttlDays),
    };
    await persistOfflineMemory(memory, options.ttlDays);
  } catch (error) {
    console.warn(
      '[AI MEMORY] Store skipped:',
      error instanceof Error ? error.message : error,
    );
  }
}
