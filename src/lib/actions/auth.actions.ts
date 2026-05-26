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

import { getUser2FADevices, verifyTOTP, verifyAndUseBackupCode } from '../services/twofa-service';
import { getInternalUserById, updateInternalUser } from '../services/user-service';

/**
 * LOGIN: Consolidated and Service-Oriented (PostgreSQL + Fallback)
 * This is the ONLY entry point for authentication via Server Actions.
 */
export async function login(email: string, password?: string, rememberMe: boolean = false): Promise<{ user?: User; error?: string; requires2FA?: boolean; userId?: string }> {
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

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
        console.log(`[AUTH] User ${user.email} has 2FA enabled, redirecting to verify page.`);
        return { requires2FA: true, userId: user.id };
    }

    // Single Session: Generate new session ID and save it
    const activeSessionId = require('crypto').randomUUID();
    await updateInternalUser(user.id, { activeSessionId });

    // Create secure session cookie (signed with session ID)
    const signedValue = sign(`${user.id}:${activeSessionId}`);
    
    // Cookie duration: 4 hours (session) or 30 days (remember me)
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 4 * 60 * 60;

    const reqHeaders = headers();
    const isHttps = reqHeaders.get('x-forwarded-proto') === 'https' || reqHeaders.get('referer')?.startsWith('https://');

    cookies().set(SESSION_COOKIE_NAME, signedValue, {
        httpOnly: true,
        secure: isHttps,
        sameSite: 'lax',
        path: '/',
        maxAge: maxAge
    });

    await logSecurityEvent(user.id, "LOGIN_SUCCESS", `RememberMe: ${rememberMe}`);
    console.log(`[AUTH] Login success: ${user.email} (${user.role})`);
    
    return { user };
}

/**
 * 2FA LOGIN VERIFICATION
 */
export async function login2FA(userId: string, code: string, rememberMe: boolean = false): Promise<{ user?: User; error?: string }> {
    const user = await getInternalUserById(userId);
    if (!user) return { error: "Không tìm thấy người dùng." };

    let isCodeValid = false;

    // 1. Try to verify as TOTP code
    const devices = await getUser2FADevices(userId);
    const defaultDevice = devices.find(d => d.isDefault && d.confirmed);
    
    if (defaultDevice) {
        isCodeValid = verifyTOTP(defaultDevice.secret, code);
    }

    // 2. If not valid, try as backup code
    if (!isCodeValid) {
        isCodeValid = await verifyAndUseBackupCode(userId, code);
    }

    if (!isCodeValid) {
        await logSecurityEvent(userId, "2FA_LOGIN_FAILED", `Incorrect OTP/Backup code: ${code}`);
        return { error: "Mã xác thực 2FA không chính xác hoặc đã hết hạn." };
    }

    // Single Session: Generate new session ID and save it
    const activeSessionId = require('crypto').randomUUID();
    await updateInternalUser(userId, { activeSessionId });

    // Success - Create secure session cookie (signed with session ID)
    const signedValue = sign(`${userId}:${activeSessionId}`);
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 4 * 60 * 60;
    
    const reqHeaders = headers();
    const isHttps = reqHeaders.get('x-forwarded-proto') === 'https' || reqHeaders.get('referer')?.startsWith('https://');

    cookies().set(SESSION_COOKIE_NAME, signedValue, {
        httpOnly: true,
        secure: isHttps,
        sameSite: 'lax',
        path: '/',
        maxAge: maxAge
    });

    await logSecurityEvent(user.id, "2FA_LOGIN_SUCCESS", `2FA Login successful`);
    console.log(`[AUTH] 2FA Login success: ${user.email} (${user.role})`);
    
    // Omit password
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as any };
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
