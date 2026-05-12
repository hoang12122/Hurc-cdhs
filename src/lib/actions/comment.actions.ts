'use server';

import { revalidatePath } from 'next/cache';
import { type Comment } from '@/lib/constants';
import { internalLogSystemEvent as logSystemEvent } from '../services/log-service';
import { requireAuth } from '@/lib/auth-enforcer';
import { getInternalComments, createInternalComment } from '../services/ops-service';

export async function getComments(entityId: string): Promise<Comment[]> {
  await requireAuth();
  const comments = await getInternalComments(entityId);
  return comments.map((c: any) => ({ ...c, timestamp: c.timestamp.toISOString() })) as unknown as Comment[];
}

export async function addComment(entityId: string, content: string): Promise<Comment> {
  const user = await requireAuth();
  const record = await createInternalComment(entityId, user.id, user.name, content);
  await logSystemEvent('ADD_COMMENT', 'INFO', `User ${user.name} added a comment to entity ${entityId}`);
  
  // Revalidate relevant paths
  revalidatePath(`/dnf/${entityId}`);
  revalidatePath(`/hazards/${entityId}`); 
  
  return { ...record, timestamp: record.timestamp.toISOString() } as unknown as Comment;
}
