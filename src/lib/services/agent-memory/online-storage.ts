import { aiDb } from '../../prisma';
import {
  memoryFromVerificationLog,
  onlineStatusForMemory,
  ONLINE_MEMORY_SOURCE_MODULE,
  ONLINE_MEMORY_TARGET_TYPE,
} from './shared';
import type {
  AgentMemory,
  MemoryReviewDecision,
  MemoryVerificationStatus,
} from './types';

export async function loadOnlineMemories(
  statuses: string[] = ['PROPOSED', 'APPROVED'],
  take = 2_000,
): Promise<AgentMemory[]> {
  const logs = await aiDb.aiVerificationLog.findMany({
    where: {
      targetType: ONLINE_MEMORY_TARGET_TYPE,
      status: { in: statuses },
    },
    orderBy: { createdAt: 'desc' },
    take,
    select: {
      status: true,
      aiProposedContent: true,
      finalContent: true,
    },
  });

  return logs
    .map(memoryFromVerificationLog)
    .filter((memory): memory is AgentMemory => memory !== null);
}

export async function findOnlineMemoryByChecksum(checksum: string) {
  const log = await aiDb.aiVerificationLog.findFirst({
    where: {
      targetType: ONLINE_MEMORY_TARGET_TYPE,
      modelVersion: checksum,
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    log,
    memory: log ? memoryFromVerificationLog(log) : null,
  };
}

export async function persistOnlineMemory(memory: AgentMemory): Promise<void> {
  const status = onlineStatusForMemory(memory.verificationStatus);
  const { log: existing, memory: existingMemory } = await findOnlineMemoryByChecksum(
    memory.checksum,
  );

  if (existing) {
    const preservedStatus = existing.status === 'APPROVED' ? 'APPROVED' : status;
    const merged: AgentMemory = {
      ...(existingMemory ?? memory),
      ...memory,
      confidence: Math.max(existingMemory?.confidence ?? 0, memory.confidence),
      importance: Math.max(existingMemory?.importance ?? 1, memory.importance),
      reinforcementCount: Math.max(
        existingMemory?.reinforcementCount ?? 1,
        memory.reinforcementCount,
      ),
      verificationStatus: preservedStatus === 'APPROVED'
        ? 'verified'
        : memory.verificationStatus,
    };

    await aiDb.aiVerificationLog.update({
      where: { id: existing.id },
      data: {
        targetVersion: merged.reinforcementCount,
        targetDisplayCode: merged.topic.slice(0, 200),
        aiProposedContent: merged as any,
        finalContent: preservedStatus === 'APPROVED' ? merged as any : undefined,
        status: preservedStatus,
        riskLevel: preservedStatus === 'APPROVED'
          ? 'LOW'
          : merged.verificationStatus === 'quarantined'
            ? 'HIGH'
            : 'MEDIUM',
        verifiedAt: preservedStatus === 'APPROVED'
          ? existing.verifiedAt ?? new Date()
          : undefined,
      },
    });
    return;
  }

  await aiDb.aiVerificationLog.create({
    data: {
      targetId: memory.id,
      targetType: ONLINE_MEMORY_TARGET_TYPE,
      targetDisplayCode: memory.topic.slice(0, 200),
      targetVersion: memory.reinforcementCount,
      sourceModule: ONLINE_MEMORY_SOURCE_MODULE,
      aiProposedContent: memory as any,
      finalContent: status === 'APPROVED' ? memory as any : undefined,
      status,
      riskLevel: status === 'REJECTED'
        ? 'HIGH'
        : status === 'PROPOSED'
          ? 'MEDIUM'
          : 'LOW',
      requiredRole: 'AI_GOVERNANCE_ADMIN',
      verifiedBy: status === 'APPROVED' ? 'governance-policy' : undefined,
      verifiedAt: status === 'APPROVED' ? new Date() : undefined,
      modelVersion: memory.checksum,
      isOrphan: false,
    },
  });
}

export async function reviewOnlineMemory(
  memoryId: string,
  decision: MemoryReviewDecision,
): Promise<AgentMemory | null> {
  const log = await aiDb.aiVerificationLog.findFirst({
    where: {
      targetType: ONLINE_MEMORY_TARGET_TYPE,
      OR: [{ id: memoryId }, { targetId: memoryId }],
    },
    orderBy: { createdAt: 'desc' },
  });
  if (!log) return null;

  const memory = memoryFromVerificationLog(log);
  if (!memory) return null;
  const now = new Date().toISOString();

  if (decision === 'approve') {
    const approved: AgentMemory = {
      ...memory,
      confidence: Math.max(memory.confidence, 0.95),
      sourceType: 'human-approved',
      verificationStatus: 'verified',
      lastSeenAt: now,
    };
    await aiDb.aiVerificationLog.update({
      where: { id: log.id },
      data: {
        aiProposedContent: approved as any,
        finalContent: approved as any,
        status: 'APPROVED',
        riskLevel: 'LOW',
        verifiedBy: 'AI_GOVERNANCE_ADMIN',
        verifiedAt: new Date(),
      },
    });
    return approved;
  }

  const verificationStatus: MemoryVerificationStatus = decision === 'supersede'
    ? 'superseded'
    : 'quarantined';
  const updated: AgentMemory = {
    ...memory,
    verificationStatus,
    lastSeenAt: now,
  };
  await aiDb.aiVerificationLog.update({
    where: { id: log.id },
    data: {
      aiProposedContent: updated as any,
      status: 'REJECTED',
      riskLevel: decision === 'quarantine' ? 'HIGH' : 'MEDIUM',
      verifiedBy: 'AI_GOVERNANCE_ADMIN',
      verifiedAt: new Date(),
    },
  });
  return updated;
}
