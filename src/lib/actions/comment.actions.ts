'use server';

import { revalidatePath } from 'next/cache';
import { type Comment } from '@/lib/constants';
import { internalLogSystemEvent as logSystemEvent } from '../services/log-service';
import { requireAuth } from '@/lib/auth-enforcer';
import { getInternalComments, createInternalComment } from '../services/ops-service';

export async function getComments(entityId: string): Promise<Comment[]> {
  await requireAuth();
  const safeId = String(entityId);
  const comments = await getInternalComments(safeId);
  return comments.map((c: any) => ({ ...c, timestamp: c.timestamp.toISOString() })) as unknown as Comment[];
}

export async function addComment(entityId: string, content: string): Promise<Comment> {
  const user = await requireAuth();
  const safeId = String(entityId);
  const safeContent = String(content);
  
  const record = await createInternalComment(safeId, user.id, user.name, safeContent);
  await logSystemEvent('ADD_COMMENT', 'INFO', `User ${user.name} added a comment to entity ${safeId}`);
  
  // Revalidate relevant paths
  revalidatePath(`/dnf/${safeId}`);
  revalidatePath(`/hazards/${safeId}`); 
  
  return { ...record, timestamp: record.timestamp.toISOString() } as unknown as Comment;
}
