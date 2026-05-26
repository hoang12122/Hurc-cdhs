import crypto from 'crypto';
import { authDb, IS_DATABASE_OFFLINE } from '../prisma';
import { jsonDb } from '../db/json-db';

/**
 * Access Tokens Service for Hurc-cdhs
 * Supports: API, iCalendar, Meeting iCalendar, OAuth, RSS
 * Uses SHA-256 Hashing for secure storage
 */

export interface TokenCreateInput {
  userId: string;
  type: 'api' | 'icalendar' | 'meeting_ical' | 'oauth' | 'rss';
  name: string;
  calendar?: string;
  project?: string;
  expiresInDays?: number; // optional, null = never
}

export async function generateAndSaveToken(input: TokenCreateInput): Promise<{ rawToken: string; token: any }> {
  // Generate random secure token of length 48 (hex bytes)
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  let expiresAt: Date | null = null;
  if (input.expiresInDays && input.expiresInDays > 0) {
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + input.expiresInDays);
  }

  const tokenPayload = {
    userId: input.userId,
    type: input.type,
    name: input.name,
    tokenHash,
    calendar: input.calendar || null,
    project: input.project || null,
    active: true,
    expiresAt: expiresAt ? expiresAt.toISOString() : null,
    lastRefreshedAt: null,
  };

  let tokenRecord: any = null;

  if (!IS_DATABASE_OFFLINE) {
    try {
      tokenRecord = await authDb.accessToken.create({
        data: {
          ...tokenPayload,
          expiresAt: expiresAt,
        }
      });
    } catch (e) {
      console.warn('[TOKEN-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }

  if (!tokenRecord) {
    tokenRecord = await jsonDb.insertRecord<any>('access_tokens', tokenPayload);
  }

  return {
    rawToken,
    token: tokenRecord
  };
}

export async function getUserTokens(userId: string, type: 'api' | 'icalendar' | 'meeting_ical' | 'oauth' | 'rss') {
  if (!IS_DATABASE_OFFLINE) {
    try {
      return await authDb.accessToken.findMany({
        where: { userId, type },
        orderBy: { createdAt: 'desc' }
      });
    } catch (e) {
      console.warn('[TOKEN-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }
  return await jsonDb.findMany<any>('access_tokens', (t: any) => t.userId === userId && t.type === type);
}

export async function revokeToken(tokenId: string) {
  if (!IS_DATABASE_OFFLINE) {
    try {
      await authDb.accessToken.delete({
        where: { id: tokenId }
      });
      return { success: true };
    } catch (e) {
      console.warn('[TOKEN-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }

  await jsonDb.delete('access_tokens', (t: any) => t.id === tokenId);
  return { success: true };
}

export async function verifyToken(rawToken: string, type: 'api' | 'icalendar' | 'meeting_ical' | 'oauth' | 'rss'): Promise<any | null> {
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  let match: any = null;

  if (!IS_DATABASE_OFFLINE) {
    try {
      match = await authDb.accessToken.findUnique({
        where: { tokenHash },
        include: { user: true }
      });
    } catch (e) {
      console.warn('[TOKEN-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }

  if (!match) {
    const jsonMatch = await jsonDb.findFirst<any>('access_tokens', (t: any) => t.tokenHash === tokenHash);
    if (jsonMatch) {
      const user = await jsonDb.findFirst<any>('users', (u: any) => u.id === jsonMatch.userId);
      match = { ...jsonMatch, user };
    }
  }

  if (!match) return null;
  if (match.type !== type || !match.active) return null;

  // Check Expiry
  if (match.expiresAt && new Date(match.expiresAt) < new Date()) {
    return null; // Expired
  }

  // Update lastRefreshedAt
  const now = new Date().toISOString();
  if (!IS_DATABASE_OFFLINE) {
    try {
      await authDb.accessToken.update({
        where: { id: match.id },
        data: { lastRefreshedAt: new Date() }
      });
    } catch (e) {}
  } else {
    await jsonDb.updateRecord<any>('access_tokens', match.id, { lastRefreshedAt: now });
  }

  return match.user;
}
