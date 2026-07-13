'use server';

import { cookies, headers } from 'next/headers';
import { type User } from '../constants';
import { AI_GOVERNANCE_CONFIG } from '../config/ai-governance-profile';
import { getSessionUser, checkPermission } from '../services/auth-service';
import { verifyInternalCredentials, getInternalUserById, updateInternalUser } from '../services/user-service';
import { internalLogSystemEvent } from '../services/log-service';
import { checkRateLimit } from '../rate-limit';
import { getUser2FADevices, verifyTOTP, verifyAndUseBackupCode } from '../services/twofa-service';

const SESSION_COOKIE_NAME = 'hurc_crm_session';
let SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
    if (process.env.NODE_ENV === 'production') throw new Error('FATAL SECURITY ERROR: SESSION_SECRET is not set in production environment.');
    console.warn('WARNING: Using insecure fallback SESSION_SECRET for development.');
    SESSION_SECRET = 'fallback-secret-for-dev-only-v2';
}

function sign(data: string): string {
    const crypto = require('crypto');
    const signature = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('hex');
    return `${data}.${signature}`;
}

async function logSecurityEvent(userId: string, event: string, details?: string) {
    await internalLogSystemEvent(event, 'INFO', details || `User ${userId}`, 'security');
}

function getClientIp(reqHeaders: Headers): string {
    return (reqHeaders.get('x-forwarded-for') || reqHeaders.get('x-real-ip') || 'unknown').split(',')[0].trim();
}

async function establishSession(user: any, rememberMe: boolean, reqHeaders: Headers) {
    const activeSessionId = require('crypto').randomUUID();
    await updateInternalUser(user.id, { activeSessionId });
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sign(`${user.id}:${activeSessionId}`), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' || reqHeaders.get('x-forwarded-proto') === 'https',
        sameSite: 'lax',
        path: '/',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : 4 * 60 * 60,
    });
}

export async function login(email: string, password?: string, rememberMe = false): Promise<{ user?: User; error?: string; requires2FA?: boolean; userId?: string }> {
    const reqHeaders = await headers();
    const ip = getClientIp(reqHeaders);
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const identifier = `login:${ip}:${normalizedEmail}`;
    const limits = AI_GOVERNANCE_CONFIG.rateLimits;

    if (!checkRateLimit(identifier, limits.loginAttempts, limits.loginWindowMs)) {
        return { error: 'Bạn đã đăng nhập sai quá nhiều lần. Vui lòng thử lại sau.' };
    }

    const result = await verifyInternalCredentials(normalizedEmail, password, ip);
    if (result.error) return { error: result.error };
    const { user } = result;
    if (!user) return { error: 'Lỗi hệ thống không xác định.' };

    if (user.twoFactorEnabled) {
        return { requires2FA: true, userId: user.id };
    }

    await establishSession(user, rememberMe, reqHeaders);
    await logSecurityEvent(user.id, 'LOGIN_SUCCESS', `RememberMe: ${rememberMe}; IP: ${ip}; Assurance: ${AI_GOVERNANCE_CONFIG.assuranceProfile}`);
    return { user };
}

export async function login2FA(userId: string, code: string, rememberMe = false): Promise<{ user?: User; error?: string }> {
    const reqHeaders = await headers();
    const ip = getClientIp(reqHeaders);
    const normalizedUserId = String(userId || '').trim();
    const normalizedCode = String(code || '').replace(/\s+/g, '').toUpperCase();
    const limits = AI_GOVERNANCE_CONFIG.rateLimits;

    if (!normalizedUserId || !normalizedCode) return { error: 'Thiếu thông tin xác thực.' };
    if (!checkRateLimit(`2fa:${ip}:${normalizedUserId}`, limits.twoFactorAttempts, limits.twoFactorWindowMs)) {
        await logSecurityEvent(normalizedUserId, '2FA_RATE_LIMITED', `IP: ${ip}; Assurance: ${AI_GOVERNANCE_CONFIG.assuranceProfile}`);
        return { error: 'Bạn đã nhập sai mã quá nhiều lần. Vui lòng thử lại sau.' };
    }

    const user = await getInternalUserById(normalizedUserId);
    if (!user) return { error: 'Không tìm thấy người dùng.' };
    if (!user.twoFactorEnabled) return { error: 'Xác thực hai lớp (2FA) chưa được kích hoạt trên tài khoản này.' };
    if (user.status !== 'active') return { error: 'Tài khoản đã bị vô hiệu hóa hoặc tạm khóa. Vui lòng liên hệ quản trị viên.' };

    let isCodeValid = false;
    const devices = await getUser2FADevices(normalizedUserId);
    const defaultDevice = devices.find(d => d.isDefault && d.confirmed);
    if (defaultDevice) isCodeValid = verifyTOTP(defaultDevice.secret, normalizedCode);
    if (!isCodeValid) isCodeValid = await verifyAndUseBackupCode(normalizedUserId, normalizedCode);

    if (!isCodeValid) {
        await logSecurityEvent(normalizedUserId, '2FA_LOGIN_FAILED', `Incorrect 2FA code; IP: ${ip}`);
        return { error: 'Mã xác thực 2FA không chính xác hoặc đã hết hạn.' };
    }

    await establishSession(user, rememberMe, reqHeaders);
    await logSecurityEvent(user.id, '2FA_LOGIN_SUCCESS', `IP: ${ip}`);
    const { password, ...userWithoutPassword } = user as any;
    return { user: userWithoutPassword as User };
}

export async function hasPermission(permission: string): Promise<boolean> {
    return checkPermission(permission);
}

export async function getCurrentUser(): Promise<User | null> {
    return getSessionUser();
}

export async function logoutUser(): Promise<void> {
    const user = await getSessionUser();
    if (user) {
        await logSecurityEvent(user.id, 'LOGOUT');
        await updateInternalUser(user.id, { activeSessionId: require('crypto').randomUUID() });
    }
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}
