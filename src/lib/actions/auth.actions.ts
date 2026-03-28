'use server';

// This file is largely obsolete as login is bypassed.
// The functions are kept for potential re-activation but are not actively used.

import { type User } from '@/lib/constants';
import bcrypt from 'bcryptjs';
import { logSystemEvent } from './system.actions';
import { cookies } from 'next/headers';
import { checkRateLimit } from '@/lib/rate-limit';
import { authDb } from '@/lib/prisma';

const SESSION_COOKIE_NAME = 'hurc_crm_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-secret-for-dev-only';

function sign(data: string): string {
    const crypto = require('crypto');
    if (!process.env.SESSION_SECRET) {
        console.error("CRITICAL: SESSION_SECRET is not defined in environment!");
    }
    const hmac = crypto.createHmac('sha256', SESSION_SECRET);
    hmac.update(data);
    const signature = hmac.digest('hex');
    return `${data}.${signature}`;
}

function verify(signedData: string): string | null {
    const crypto = require('crypto');
    const parts = signedData.split('.');
    if (parts.length !== 2) return null;
    
    const [data, signature] = parts;
    if (!data || !signature) return null;
    
    const hmac = crypto.createHmac('sha256', SESSION_SECRET);
    hmac.update(data);
    const expectedSignature = hmac.digest('hex');
    
    try {
        const signatureBuffer = Buffer.from(signature);
        const expectedBuffer = Buffer.from(expectedSignature);
        
        if (signatureBuffer.length === expectedBuffer.length && 
            crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
            return data;
        }
    } catch (e) {
        // Silently fail on buffer errors
    }
    return null;
}

export async function login(
  email: string,
  password?: string
): Promise<User | null> {
  if (!checkRateLimit(`login_${email}`, 10, 15 * 60 * 1000)) { // 10 attempts per 15 minutes
      throw new Error("Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau.");
  }

  const user = await authDb.user.findUnique({ where: { email } });

  if (!user || !password || !user.password) {
    if (user) { 
      await logSystemEvent('LOGIN_FAILED', 'WARNING', `Login attempt failed for user: ${email} (User found, but no password provided or stored).`);
    }
    return null;
  }
  
  console.log(`[AUTH DEBUG] Attempting login for: ${email}`);
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  console.log(`[AUTH DEBUG] Password match result: ${isPasswordCorrect}`);

  if (isPasswordCorrect) {
    const { password: _password, ...userWithoutPassword } = user;
    await logSystemEvent('LOGIN_SUCCESS', 'INFO', `User logged in successfully: ${email}`);
    
    // Set secure HTTP-only signed cookie
    const signedValue = sign(user.id);
    cookies().set(SESSION_COOKIE_NAME, signedValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 1 week
    });

    return {
      ...userWithoutPassword,
      createdAt: userWithoutPassword.createdAt.toISOString(),
      updatedAt: userWithoutPassword.updatedAt.toISOString(),
      passwordLastChangedAt: userWithoutPassword.passwordLastChangedAt?.toISOString(),
      otpExpiry: userWithoutPassword.otpExpiry?.toISOString(),
    } as unknown as User;
  }
  
  await logSystemEvent('LOGIN_FAILED', 'WARNING', `Login attempt failed for user: ${email} (Incorrect password).`);
  return null;
}

export async function getCurrentUser(): Promise<User | null> {
    const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) return null;
    
    const userId = verify(sessionCookie);
    if (!userId) {
        console.warn(`[AUTH] Invalid session signature detected for cookie.`);
        return null;
    }
    
    const user = await authDb.user.findUnique({ where: { id: userId } });
    if (!user) return null;
    
    const { password: _password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      passwordLastChangedAt: userWithoutPassword.passwordLastChangedAt?.toISOString(),
      otpExpiry: userWithoutPassword.otpExpiry?.toISOString(),
    } as unknown as User;
}

export async function logoutUser(): Promise<void> {
    cookies().delete(SESSION_COOKIE_NAME);
}
