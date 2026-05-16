'use server';

import { revalidatePath } from 'next/cache';
import { type Improvement } from '@/lib/constants';
import { internalLogSystemEvent as logSystemEvent } from '../services/log-service';
import { requirePermission, requireAuth, UnauthorizedError } from '@/lib/auth-enforcer';
import { 
    getInternalImprovements, 
    createInternalImprovement, 
    updateInternalImprovement, 
    deleteInternalImprovement,
    getInternalImprovementById
} from '../services/ops-service';

export async function getImprovements(): Promise<Improvement[]> {
  await requireAuth();
  return await getInternalImprovements() as any;
}

export async function addImprovement(improvement: Omit<Improvement, 'id' | 'updatedAt' | 'createdById'>): Promise<Improvement> {
  const user = await requireAuth();
  
  // Basic Sanitization (Injection Prevention)
  const safePayload = {
      title: String(improvement.title),
      description: String(improvement.description),
      category: String(improvement.category),
      status: String(improvement.status || 'Mới'),
      submittedBy: String(improvement.submittedBy),
      benefitAnalysis: improvement.benefitAnalysis ? String(improvement.benefitAnalysis) : undefined,
      estimatedCost: improvement.estimatedCost ? Number(improvement.estimatedCost) : undefined
  };

  const record = await createInternalImprovement(safePayload, user.id);
  await logSystemEvent('CREATE_IMPROVEMENT', 'INFO', `Created improvement: ${record.title}`);
  revalidatePath('/improvements');
  return record as unknown as Improvement;
}

export async function updateImprovement(updatedImprovement: Improvement): Promise<void> {
  const user = await requireAuth();
  const safeId = String(updatedImprovement.id);

  // IDOR Check
  const existing = await getInternalImprovementById(safeId);
  if (!existing) throw new Error("Improvement not found");
  if (existing.createdById !== user.id && user.role !== 'SUPER_ADMIN') {
      throw new UnauthorizedError("BOLA/IDOR Blocked: Bạn không thể sửa dữ liệu của người khác!");
  }

  // Sanitization
  const safePayload = {
      title: String(updatedImprovement.title),
      description: String(updatedImprovement.description),
      category: String(updatedImprovement.category),
      status: String(updatedImprovement.status),
      submittedBy: String(updatedImprovement.submittedBy),
      benefitAnalysis: updatedImprovement.benefitAnalysis ? String(updatedImprovement.benefitAnalysis) : undefined,
      estimatedCost: updatedImprovement.estimatedCost ? Number(updatedImprovement.estimatedCost) : undefined
  };

  await updateInternalImprovement(safeId, safePayload);
  await logSystemEvent('UPDATE_IMPROVEMENT', 'INFO', `Updated improvement: ${safePayload.title}`);
  revalidatePath('/improvements');
}

export async function deleteImprovement(id: string): Promise<void> {
  const user = await requirePermission('improvement:delete');
  const safeId = String(id);

  // IDOR Check
  const existing = await getInternalImprovementById(safeId);
  if (!existing) throw new Error("Improvement not found");
  if (existing.createdById !== user.id && user.role !== 'SUPER_ADMIN') {
      await logSystemEvent('SECURITY_ALERT', 'CRITICAL', `User ${user.id} attempted to delete improvement ${safeId} illegally (IDOR Attempt)`);
      throw new UnauthorizedError("BOLA/IDOR Blocked: Bạn không thể xóa dữ liệu của người khác!");
  }

  await deleteInternalImprovement(safeId);
  await logSystemEvent('DELETE_IMPROVEMENT', 'WARNING', `Deleted improvement: ${safeId}`);
  revalidatePath('/improvements');
}
