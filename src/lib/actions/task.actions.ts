'use server';

import { type UnifiedTask } from '@/lib/constants';
import { requireAuth } from '../auth-enforcer';
import { getInternalTasks } from '../services/task-service';

export async function getTasksForCurrentUser(): Promise<UnifiedTask[]> {
  const currentUser = await requireAuth();
  // Thin wrapper around the task service
  return await getInternalTasks(currentUser);
}
