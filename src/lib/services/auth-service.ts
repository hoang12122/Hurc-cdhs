import { cookies } from 'next/headers';
import { type User, ROLE_SUPER_ADMIN } from '../constants';
import { jsonDb } from '../db/json-db';
import { findAccountById } from './account-service';
import { dbProvider } from './db-wrapper';

/**
 * AUTH SERVICE — Pure JSON (No Prisma)
 * Refactored for Phase 4: Standardized Keys & Atomic JSON operations.
 */

const SESSION_COOKIE_NAME = 'hurc_crm_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-secret-for-dev-only';

function verifySession(signedData: string): string | null {
    const crypto = require('crypto');
    const parts = signedData.split('.');
    if (parts.length !== 2) return null;
    
    const [data, signature] = parts;
    if (!data || !signature) return null;
    
    const hmac = crypto.createHmac('sha256', SESSION_SECRET);
    hmac.update(data);
    const expectedSig = hmac.digest('hex');
    
    try {
        const a = Buffer.from(signature);
        const b = Buffer.from(expectedSig);
        if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
            return data;
        }
    } catch { /* ignore */ }
    return null;
}

export async function getSessionUser(): Promise<User | null> {
    try {
        const cookieStore = cookies();
        const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

        if (!sessionCookie?.value) return null;

        const userId = verifySession(sessionCookie.value);
        if (!userId) return null;

        const dbUser = await findAccountById(userId);

        if (!dbUser || dbUser.status !== 'active') return null;

        // Fetch roles using dbProvider (which is now hardened via db-wrapper.ts)
        const roles: any[] = await dbProvider.findMany('Role');
        const userRole = roles.find((r: any) => r.id === dbUser.role || r.name === dbUser.role);
        const permissions = userRole?.permissions || [];

        return {
            id: dbUser._id?.toString() || dbUser.id || userId,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role as any,
            status: dbUser.status as any,
            department: dbUser.department,
            isVerified: true,
            mustChangePassword: false,
            passwordLastChangedAt: dbUser.updatedAt?.toISOString() || new Date().toISOString(),
            permissions,
        };
    } catch (e) {
        return null;
    }
}

export async function checkPermission(permission: string): Promise<boolean> {
  const currentUser = await getSessionUser();
  if (!currentUser) return false;
  
  if (currentUser.role === ROLE_SUPER_ADMIN) {
    return true;
  }
  
  if (currentUser.permissions?.includes(permission)) {
    return true;
  }

  // Atomic JSON Fallback for Roles
  const jsonRoles = await jsonDb.getCollection<any>('roles');
  const jsonRoleData = jsonRoles.find((r: any) => r.id === currentUser.role || r.name === currentUser.role);
  return jsonRoleData?.permissions?.includes(permission) || false;
}
