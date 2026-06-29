'use server';

import { requirePermission } from '@/lib/auth-enforcer';
import { analyzeIncidentLearningFromOperations, syncIncidentMemoryFromOperations } from '@/lib/services/incident-learning-service';

export async function incidentLearningQuery(query: string) {
  await requirePermission('ai:use');

  const safeQuery = String(query || '').trim();
  if (!safeQuery) {
    return {
      answer: 'Vui lòng nhập mô tả sự cố cần đối chiếu.',
      dataSource: 'fallback-sample' as const,
      caseCount: 0,
      matchCount: 0,
      confidenceLabel: 'low' as const,
    };
  }

  return analyzeIncidentLearningFromOperations(safeQuery);
}

export async function syncIncidentMemory() {
  await requirePermission('ai:use');
  return syncIncidentMemoryFromOperations();
}
