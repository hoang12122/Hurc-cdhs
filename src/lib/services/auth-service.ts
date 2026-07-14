import { cookies } from 'next/headers';
import { type User, ROLE_SUPER_ADMIN } from '../constants';
import { getInternalUserById, getInternalRoles } from './user-service';

const SESSION_COOKIE_NAME = 'hurc_crm_session';
let SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error("FATAL SECURITY ERROR: SESSION_SECRET is not set in production environment.");
    }
    console.warn("WARNING: Using insecure fallback SESSION_SECRET for development.");
    SESSION_SECRET = 'fallback-secret-for-dev-only-v2';
}

function verifySession(signedData: string): string | null {
    const crypto = require('crypto');
    const parts = signedData.split('.');
    if (parts.length !== 2) {
        console.warn("[AUTH-SERVICE] verifySession failed: cookie value split length is not 2. Value length:", signedData?.length);
        return null;
    }

    const [data, signature] = parts;
    if (!data || !signature) {
        console.warn("[AUTH-SERVICE] verifySession failed: data or signature missing.");
        return null;
    }

    const hmac = crypto.createHmac('sha256', SESSION_SECRET);
    hmac.update(data);
    const expectedSig = hmac.digest('hex');

    try {
        const a = Buffer.from(signature);
        const b = Buffer.from(expectedSig);
        if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
            return data;
        }
        console.warn("[AUTH-SERVICE] verifySession failed: signatures do not match.");
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("[AUTH-SERVICE] verifySession error in timingSafeEqual:", message);
    }
    return null;
}

export async function getSessionUser(): Promise<User | null> {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

        if (!sessionCookie?.value) {
            console.debug("[AUTH-SERVICE] No session cookie found in request headers.");
            return null;
        }

        const verifiedData = verifySession(sessionCookie.value);
        if (!verifiedData) {
            console.warn("[AUTH-SERVICE] Session validation failed for cookie value.");
            return null;
        }

        let userId = verifiedData;
        let activeSessionId: string | null = null;
        if (verifiedData.includes(':')) {
            const parts = verifiedData.split(':');
            userId = parts[0];
            activeSessionId = parts[1];
        }

        const dbUser = await getInternalUserById(userId);
        if (!dbUser) {
            console.warn(`[AUTH-SERVICE] User with ID ${userId} not found in database.`);
            return null;
        }

        if (dbUser.status !== 'active') {
            console.warn(`[AUTH-SERVICE] User ${dbUser.email} (ID: ${userId}) has inactive status: ${dbUser.status}`);
            return null;
        }

        if (activeSessionId && dbUser.activeSessionId && dbUser.activeSessionId !== activeSessionId) {
            console.warn(`[AUTH-SERVICE] Concurrent session superseded for user ${dbUser.email}. DB: ${dbUser.activeSessionId}, Cookie: ${activeSessionId}`);
            return null;
        }

        const roles: any[] = await getInternalRoles();
        const userRole = roles.find((role: any) => role.id === dbUser.role || role.name === dbUser.role);
        const rolePermissions = userRole?.permissions || [];

        return {
            id: dbUser.id || userId,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role as any,
            status: dbUser.status as any,
            department: dbUser.department,
            isVerified: dbUser.isVerified ?? true,
            mustChangePassword: dbUser.mustChangePassword ?? false,
            passwordLastChangedAt: typeof dbUser.passwordLastChangedAt === 'string'
                ? dbUser.passwordLastChangedAt
                : (dbUser.passwordLastChangedAt as any)?.toISOString?.() || new Date().toISOString(),
            permissions: Array.from(new Set([
                ...rolePermissions,
                ...(dbUser.permissions || [])
            ])),
            activeSessionId: dbUser.activeSessionId,
            ouId: dbUser.ouId || null,
        };
    } catch (error) {
        const message = error instanceof Error ? error.stack || error.message : String(error);
        console.error("[AUTH-SERVICE] getSessionUser error:", message);
        return null;
    }
}

export async function checkPermission(permission: string): Promise<boolean> {
    const currentUser = await getSessionUser();
    if (!currentUser) return false;
    if (currentUser.role === ROLE_SUPER_ADMIN) return true;
    return currentUser.permissions?.includes(permission) || false;
}
