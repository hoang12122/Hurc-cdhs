'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth-enforcer';
import { internalLogSystemEvent as logSystemEvent } from '../services/log-service';
import { 
  generateAndSaveToken, 
  getUserTokens, 
  revokeToken 
} from '../services/token-service';

export async function getTokens(type: 'api' | 'icalendar' | 'meeting_ical' | 'oauth' | 'rss') {
  const currentUser = await requireAuth();
  
  const tokens = await getUserTokens(currentUser.id, type);
  
  // Format token output to hide hashes and only return metadata
  return tokens.map(t => ({
    id: t.id,
    name: t.name,
    calendar: t.calendar,
    project: t.project,
    active: t.active,
    expiresAt: t.expiresAt,
    lastRefreshedAt: t.lastRefreshedAt,
    createdAt: t.createdAt,
  }));
}

export async function createToken(data: {
  type: 'api' | 'icalendar' | 'meeting_ical' | 'oauth' | 'rss';
  name: string;
  calendar?: string;
  project?: string;
  expiresInDays?: number;
}) {
  const currentUser = await requireAuth();

  if (!data.name || data.name.trim() === '') {
    throw new Error('Tên mã thông báo không được để trống.');
  }

  const result = await generateAndSaveToken({
    userId: currentUser.id,
    type: data.type,
    name: data.name.trim(),
    calendar: data.calendar,
    project: data.project,
    expiresInDays: data.expiresInDays,
  });

  await logSystemEvent('TOKEN_CREATE', 'INFO', `User ${currentUser.email} created a new ${data.type.toUpperCase()} token: ${data.name}`);
  revalidatePath('/profile');

  // Return rawToken only once to the client
  return {
    rawToken: result.rawToken,
    token: {
      id: result.token.id,
      name: result.token.name,
      createdAt: result.token.createdAt,
      expiresAt: result.token.expiresAt,
    }
  };
}

export async function deleteToken(tokenId: string, type: string) {
  const currentUser = await requireAuth();

  await revokeToken(tokenId);

  await logSystemEvent('TOKEN_REVOKE', 'WARNING', `User ${currentUser.email} revoked token ID: ${tokenId} (${type.toUpperCase()})`);
  revalidatePath('/profile');

  return { success: true };
}
