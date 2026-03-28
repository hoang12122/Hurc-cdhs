'use server';

import { revalidatePath } from 'next/cache';
import { type Comment } from '@/lib/constants';
import { logSystemEvent } from './system.actions';
import { opsDb } from '@/lib/prisma';

export async function getComments(entityId: string): Promise<Comment[]> {
  const comments = await opsDb.comment.findMany({
    where: { entityId },
    orderBy: { timestamp: 'asc' }
  });
  return comments.map((c: any) => ({ ...c, timestamp: c.timestamp.toISOString() })) as Comment[];
}

export async function addComment(entityId: string, content: string): Promise<Comment> {
  const { getCurrentUser } = await import('./auth.actions');
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Must be logged in to add comments.");
  }

  const newRecord = await opsDb.comment.create({
    data: {
      id: `comment-${Date.now()}`,
      entityId,
      senderId: user.id,
      senderName: user.name, 
      timestamp: new Date(),
      content: content.trim(),
    }
  });

  await logSystemEvent('ADD_COMMENT', 'INFO', `User ${user.name} added a comment to entity ${entityId}`);
  revalidatePath(`/dnf/${entityId}`);
  revalidatePath(`/hazards/${entityId}`); 
  
  return { ...newRecord, timestamp: newRecord.timestamp.toISOString() } as Comment;
}
