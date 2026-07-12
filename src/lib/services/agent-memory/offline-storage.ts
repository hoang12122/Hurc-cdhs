import { jsonDb } from '../../db/json-db';
import {
  ACTIVE_COLLECTION,
  calculateExpiry,
  QUARANTINE_COLLECTION,
  safeAudit,
} from './shared';
import type {
  AgentMemory,
  MemoryReviewDecision,
  MemoryVerificationStatus,
} from './types';

export async function loadOfflineActiveMemories(): Promise<AgentMemory[]> {
  return jsonDb.getCollection<AgentMemory>(ACTIVE_COLLECTION);
}

export async function loadOfflineQuarantinedMemories(): Promise<AgentMemory[]> {
  return jsonDb.getCollection<AgentMemory>(QUARANTINE_COLLECTION);
}

export async function persistOfflineMemory(
  memory: AgentMemory,
  ttlDays?: number,
): Promise<void> {
  const targetCollection = memory.verificationStatus === 'quarantined'
    ? QUARANTINE_COLLECTION
    : ACTIVE_COLLECTION;
  const existing = await jsonDb.findFirst<AgentMemory>(
    targetCollection,
    item => item.checksum === memory.checksum && item.namespace === memory.namespace,
  );

  if (existing) {
    const importance = Math.max(existing.importance, memory.importance);
    const confidence = Math.max(existing.confidence, memory.confidence);
    await jsonDb.updateRecord<AgentMemory>(targetCollection, existing.id, {
      importance,
      confidence,
      reinforcementCount: (existing.reinforcementCount ?? 1) + 1,
      lastSeenAt: memory.lastSeenAt,
      expiresAt: calculateExpiry(importance, confidence, ttlDays),
    });

    await safeAudit({
      requestId: existing.id,
      phase: 'memory-store',
      operation: 'reinforce-memory',
      agentId: memory.agentRole,
      domain: memory.domain,
      namespace: memory.namespace,
      riskLevel: memory.verificationStatus === 'quarantined' ? 'high' : 'low',
      riskScore: memory.verificationStatus === 'quarantined' ? 70 : 10,
      fingerprint: memory.checksum,
      summary: `Reinforced memory: ${memory.topic}`,
      decision: memory.verificationStatus === 'quarantined' ? 'quarantine' : 'allow',
      confidence: memory.confidence,
    });
    return;
  }

  await jsonDb.insertRecord(targetCollection, memory);
  await safeAudit({
    requestId: memory.id,
    phase: memory.verificationStatus === 'quarantined' ? 'quarantine' : 'memory-store',
    operation: 'store-memory',
    agentId: memory.agentRole,
    domain: memory.domain,
    namespace: memory.namespace,
    riskLevel: memory.verificationStatus === 'quarantined' ? 'high' : 'low',
    riskScore: memory.verificationStatus === 'quarantined' ? 70 : 10,
    fingerprint: memory.checksum,
    summary: `${memory.verificationStatus}: ${memory.topic}`,
    decision: memory.verificationStatus === 'quarantined' ? 'quarantine' : 'allow',
    confidence: memory.confidence,
  });
}

export async function reviewOfflineMemory(
  memoryId: string,
  decision: MemoryReviewDecision,
): Promise<AgentMemory | null> {
  const active = await jsonDb.findFirst<AgentMemory>(
    ACTIVE_COLLECTION,
    memory => memory.id === memoryId,
  );
  const quarantined = active
    ? null
    : await jsonDb.findFirst<AgentMemory>(
        QUARANTINE_COLLECTION,
        memory => memory.id === memoryId,
      );
  const memory = active ?? quarantined;
  if (!memory) return null;

  const fromCollection = active ? ACTIVE_COLLECTION : QUARANTINE_COLLECTION;
  if (decision === 'approve') {
    const approved: AgentMemory = {
      ...memory,
      confidence: Math.max(memory.confidence, 0.95),
      sourceType: 'human-approved',
      verificationStatus: 'verified',
      lastSeenAt: new Date().toISOString(),
    };
    if (fromCollection === QUARANTINE_COLLECTION) {
      await jsonDb.insertRecord(ACTIVE_COLLECTION, approved);
      await jsonDb.delete<AgentMemory>(
        QUARANTINE_COLLECTION,
        item => item.id === memoryId,
      );
    } else {
      await jsonDb.updateRecord(ACTIVE_COLLECTION, memoryId, approved);
    }
    return approved;
  }

  const status: MemoryVerificationStatus = decision === 'supersede'
    ? 'superseded'
    : 'quarantined';
  const updated: AgentMemory = {
    ...memory,
    verificationStatus: status,
    lastSeenAt: new Date().toISOString(),
  };
  if (fromCollection === ACTIVE_COLLECTION && status === 'quarantined') {
    await jsonDb.insertRecord(QUARANTINE_COLLECTION, updated);
    await jsonDb.delete<AgentMemory>(
      ACTIVE_COLLECTION,
      item => item.id === memoryId,
    );
    return updated;
  }
  return jsonDb.updateRecord(fromCollection, memoryId, updated);
}
