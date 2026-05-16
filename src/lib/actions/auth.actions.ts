'use server';

import { cookies } from 'next/headers';
import { type User } from '../constants';
import { getSessionUser, checkPermission } from '../services/auth-service';
import { verifyInternalCredentials } from '../services/user-service';

const SESSION_COOKIE_NAME = 'hurc_crm_session';
let SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error("FATAL SECURITY ERROR: SESSION_SECRET is not set in production environment.");
    } else {
        console.warn("WARNING: Using insecure fallback SESSION_SECRET for development.");
        SESSION_SECRET = 'fallback-secret-for-dev-only-v2';
    }
}

function sign(data: string): string {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', SESSION_SECRET);
    hmac.update(data);
    const signature = hmac.digest('hex');
    return `${data}.${signature}`;
}

import { internalLogSystemEvent } from '../services/log-service';
import { checkRateLimit } from '../rate-limit';
import { headers } from 'next/headers';

/**
 * AUDIT LOGGING: Standardized security event logger
 */
async function logSecurityEvent(userId: string, event: string, details?: string) {
    await internalLogSystemEvent(event, 'INFO', details || `User ${userId}`, 'security');
}

/**
 * LOGIN: Consolidated and Service-Oriented (PostgreSQL + Fallback)
 * This is the ONLY entry point for authentication via Server Actions.
 */
export async function login(email: string, password?: string, rememberMe: boolean = false): Promise<{ user?: User; error?: string }> {
    const ip = headers().get('x-forwarded-for') || 'unknown';
    const identifier = `${ip}-${email}`;
    
    // Anti Brute-Force & DDoS
    if (!checkRateLimit(identifier, 5, 15 * 60 * 1000)) { // 5 requests per 15 minutes
        console.warn(`[SECURITY] Rate limit exceeded for login: ${identifier}`);
        return { error: "Bạn đã đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút." };
    }

    const result = await verifyInternalCredentials(email, password);

    if (result.error) {
        console.log(`[AUTH] Login failed for ${email}: ${result.error}`);
        return { error: result.error };
    }

    const { user } = result;
    if (!user) return { error: "Lỗi hệ thống không xác định." };

    // Create secure session cookie (signed)
    const signedValue = sign(user.id);
    
    // Cookie duration: 4 hours (session) or 30 days (remember me)
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 4 * 60 * 60;

    cookies().set(SESSION_COOKIE_NAME, signedValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: maxAge
    });

    await logSecurityEvent(user.id, "LOGIN_SUCCESS", `RememberMe: ${rememberMe}`);
    console.log(`[AUTH] Login success: ${user.email} (${user.role})`);
    
    return { user };
}

/**
 * SESSION HELPERS: Consolidated from the deleted auth.ts
 * Safe to call from Client Components.
 */

export async function hasPermission(permission: string): Promise<boolean> {
    return await checkPermission(permission);
}

export async function getCurrentUser(): Promise<User | null> {
    return await getSessionUser();
}

/**
 * LOGOUT: Clears the session cookie
 */
export async function logoutUser(): Promise<void> {
    const user = await getSessionUser();
    if (user) {
        await logSecurityEvent(user.id, "LOGOUT");
    }
    cookies().delete(SESSION_COOKIE_NAME);
}
