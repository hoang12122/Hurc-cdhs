'use server';

import { revalidatePath } from 'next/cache';
import { type Improvement } from '@/lib/constants';
import { internalLogSystemEvent as logSystemEvent } from '../services/log-service';
import { requirePermission, requireAuth } from '@/lib/auth-enforcer';
import { 
    getInternalImprovements, 
    createInternalImprovement, 
    updateInternalImprovement, 
    deleteInternalImprovement 
} from '../services/ops-service';

export async function getImprovements(): Promise<Improvement[]> {
  await requireAuth();
  return await getInternalImprovements() as any;
}

export async function addImprovement(improvement: Omit<Improvement, 'id' | 'updatedAt' | 'createdById'>): Promise<Improvement> {
  const user = await requireAuth();
  const record = await createInternalImprovement(improvement, user.id);
  await logSystemEvent('CREATE_IMPROVEMENT', 'INFO', `Created improvement: ${record.title}`);
  revalidatePath('/improvements');
  return record as unknown as Improvement;
}

export async function updateImprovement(updatedImprovement: Improvement): Promise<void> {
  await requireAuth();
  await updateInternalImprovement(updatedImprovement.id, updatedImprovement);
  await logSystemEvent('UPDATE_IMPROVEMENT', 'INFO', `Updated improvement: ${updatedImprovement.title}`);
  revalidatePath('/improvements');
}

export async function deleteImprovement(id: string): Promise<void> {
  await requirePermission('improvement:delete');
  await deleteInternalImprovement(id);
  await logSystemEvent('DELETE_IMPROVEMENT', 'WARNING', `Deleted improvement: ${id}`);
  revalidatePath('/improvements');
}
