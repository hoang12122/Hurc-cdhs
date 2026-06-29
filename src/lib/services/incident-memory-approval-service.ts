import opsDb from '@/lib/db/ops-db';

export type IncidentMemoryVerificationState = 'draft' | 'reviewed' | 'verified' | 'rejected';

export interface IncidentMemoryApprovalInput {
  memoryId: string;
  verificationState: IncidentMemoryVerificationState;
  verifiedBy?: string;
}

export async function listIncidentMemoriesForApproval(limit = 80) {
  if (!opsDb) return [];

  const memories = await opsDb.incidentMemory.findMany({
    where: {
      verificationState: { in: ['draft', 'reviewed'] },
    },
    orderBy: [{ updatedAt: 'desc' }, { confidence: 'desc' }],
    take: limit,
  });

  return memories.map((memory) => ({
    id: memory.id,
    sourceType: memory.sourceType,
    sourceId: memory.sourceId,
    referenceLabel: memory.referenceLabel,
    title: memory.title,
    subsystem: memory.subsystem,
    station: memory.station,
    symptomSummary: memory.symptomSummary,
    rootCause: memory.rootCause,
    correctiveAction: memory.correctiveAction,
    preventiveAction: memory.preventiveAction,
    lessonLearned: memory.lessonLearned,
    confidence: memory.confidence,
    verificationState: memory.verificationState,
    updatedAt: memory.updatedAt.toISOString(),
  }));
}

export async function updateIncidentMemoryApproval(input: IncidentMemoryApprovalInput) {
  if (!opsDb) {
    throw new Error('OPS database is not available.');
  }

  const safeState = input.verificationState;
  if (!['draft', 'reviewed', 'verified', 'rejected'].includes(safeState)) {
    throw new Error('Invalid Incident Memory verification state.');
  }

  const shouldMarkVerified = safeState === 'verified';

  const updated = await opsDb.incidentMemory.update({
    where: { id: input.memoryId },
    data: {
      verificationState: safeState,
      verifiedBy: shouldMarkVerified ? input.verifiedBy || 'system' : null,
      verifiedAt: shouldMarkVerified ? new Date() : null,
    },
  });

  return {
    id: updated.id,
    verificationState: updated.verificationState,
    verifiedBy: updated.verifiedBy,
    verifiedAt: updated.verifiedAt?.toISOString() || null,
  };
}
