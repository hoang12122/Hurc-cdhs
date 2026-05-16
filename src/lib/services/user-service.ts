import { authDb, IS_DATABASE_OFFLINE } from '../prisma';
import { jsonDb } from '../db/json-db';
import { type User } from '../constants';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * CORE LOGIC ONLY - NO 'use server'
 * This service handles all data persistence and business logic for Users and Roles.
 * Refactored for Phase 4: Atomic Offline Operations.
 */

function omitPassword(user: any): User {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
}

/**
 * VALIDATION: Centralized password strength check
 */
export function validatePassword(password: string): { isValid: boolean; message?: string } {
    if (password.length < 10) return { isValid: false, message: "Mật khẩu phải có ít nhất 10 ký tự." };
    if (!/[A-Z]/.test(password)) return { isValid: false, message: "Mật khẩu phải chứa ít nhất một chữ hoa." };
    if (!/[a-z]/.test(password)) return { isValid: false, message: "Mật khẩu phải chứa ít nhất một chữ thường." };
    if (!/[0-9]/.test(password)) return { isValid: false, message: "Mật khẩu phải chứa ít nhất một chữ số." };
    if (!/[^A-Za-z0-9]/.test(password)) return { isValid: false, message: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt." };
    return { isValid: true };
}

/**
 * LOGIN VERIFICATION: Enhanced with Brute Force Protection & Metadata Updates
 */
export async function verifyInternalCredentials(email: string, password?: string, ip?: string): Promise<{ user?: User; error?: string }> {
    if (!password) return { error: "Mật khẩu không được để trống." };
    
    let dbUser: any = null;
    const now = new Date();

    if (!IS_DATABASE_OFFLINE) {
        try {
            dbUser = await authDb.user.findUnique({ where: { email } });
        } catch (e) {
            console.warn("[USER-SERVICE] DB unreachable during login, checking local store.");
        }
    }

    if (!dbUser) {
        dbUser = await jsonDb.findFirst<any>('users', (u: any) => u.email === email);
    }

    if (!dbUser) return { error: "Email hoặc mật khẩu không chính xác." };

    // Check Lockout
    if (dbUser.lockoutUntil && new Date(dbUser.lockoutUntil) > now) {
        const remaining = Math.ceil((new Date(dbUser.lockoutUntil).getTime() - now.getTime()) / 60000);
        return { error: `Tài khoản đã bị khóa. Vui lòng thử lại sau ${remaining} phút.` };
    }

    const isValid = await bcrypt.compare(password, dbUser.password);
    
    if (!isValid) {
        const failedAttempts = (dbUser.failedLoginAttempts || 0) + 1;
        const updateData: any = { failedLoginAttempts: failedAttempts };
        
        if (failedAttempts >= 5) {
            updateData.lockoutUntil = new Date(now.getTime() + 15 * 60000).toISOString();
            updateData.failedLoginAttempts = 0;
        }
        
        await updateInternalUser(dbUser.id, updateData);
        return { error: "Email hoặc mật khẩu không chính xác." };
    }

    // Success - Update Metadata
    const updateSuccess: any = {
        failedLoginAttempts: 0,
        lockoutUntil: null,
        lastLoginAt: now.toISOString(),
        lastLoginIp: ip || 'unknown',
    };
    
    await updateInternalUser(dbUser.id, updateSuccess);
    return { user: omitPassword({ ...dbUser, ...updateSuccess }) };
}

export async function getInternalUsers(): Promise<User[]> {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const users = await authDb.user.findMany({
                orderBy: { name: 'asc' }
            });
            return users.map(omitPassword) as unknown as User[];
        } catch (e) {}
    }
    const users = await jsonDb.getCollection<any>('users');
    return users.map(omitPassword) as unknown as User[];
}

export async function createInternalUser(user: Partial<User>) {
    const hashedPassword = await bcrypt.hash(user.password || 'default123', 10);
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 15 * 60000);

    const record: any = {
        id: user.id || `user-${Date.now()}`,
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        status: "active",
        department: user.department,
        isVerified: user.isVerified || false,
        verificationOtp: otp,
        otpExpiry: expiry.toISOString(),
        mustChangePassword: user.mustChangePassword || false,
        passwordLastChangedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    if (!IS_DATABASE_OFFLINE) {
        try {
            await authDb.user.create({ data: record });
            return record;
        } catch (e) {}
    }
    
    return await jsonDb.insertRecord<any>('users', record);
}

export async function updateInternalUser(id: string, data: any) {
    if (data.password && !data.password.startsWith('$2b$')) {
        data.password = await bcrypt.hash(data.password, 10);
    }

    const updatePayload = {
        ...data,
        updatedAt: new Date().toISOString()
    };

    if (!IS_DATABASE_OFFLINE) {
        try {
            return await authDb.user.update({
                where: { id },
                data: updatePayload
            });
        } catch (e) {}
    }

    return await jsonDb.updateRecord<any>('users', id, updatePayload);
}

export async function deleteInternalUser(id: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await authDb.user.delete({ where: { id } });
        } catch (e) {}
    }
    return await jsonDb.delete('users', (u: any) => u.id === id);
}

export async function getInternalUserByEmail(email: string): Promise<User | null> {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const user = await authDb.user.findUnique({ where: { email } });
            return user ? omitPassword(user) : null;
        } catch (e) {}
    }
    const user = await jsonDb.findFirst<any>('users', (u: any) => u.email === email);
    return user ? omitPassword(user) : null;
}

export async function getInternalUserById(id: string): Promise<User | null> {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const user = await authDb.user.findUnique({ where: { id } });
            return user ? omitPassword(user) : null;
        } catch (e) {}
    }
    const user = await jsonDb.findFirst<any>('users', (u: any) => u.id === id);
    return user ? omitPassword(user) : null;
}

// Password Reset Requests
export async function getInternalPasswordResetRequests() {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await authDb.passwordResetRequest.findMany({ where: { status: 'pending' } });
        } catch (e) {}
    }
    const all = await jsonDb.getCollection<any>('password_reset_requests');
    return all.filter((r: any) => r.status === 'pending');
}

export async function createInternalPasswordResetRequest(userId: string, email: string, name: string) {
    const record = {
        id: `pwr-${Date.now()}`,
        userId,
        userEmail: email,
        userName: name,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    if (!IS_DATABASE_OFFLINE) {
        try {
            await authDb.passwordResetRequest.create({ data: record });
            return;
        } catch (e) {}
    }
    await jsonDb.insertRecord<any>('password_reset_requests', record);
}

export async function updateInternalPasswordResetRequest(id: string, status: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            await authDb.passwordResetRequest.update({
                where: { id },
                data: { status }
            });
            return;
        } catch (e) {}
    }
    await jsonDb.updateRecord<any>('password_reset_requests', id, { status });
}

// Roles
export async function getInternalRoles() {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await authDb.role.findMany();
        } catch (e) {}
    }
    return await jsonDb.getCollection<any>('roles');
}

export async function createInternalRole(data: any) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            await authDb.role.create({ data });
            return;
        } catch (e) {}
    }
    await jsonDb.insertRecord<any>('roles', data);
}

export async function updateInternalRole(id: string, data: any) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            await authDb.role.update({ where: { id }, data });
            return;
        } catch (e) {}
    }
    await jsonDb.updateRecord<any>('roles', id, data);
}

export async function deleteInternalRole(id: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            await authDb.role.delete({ where: { id } });
            return;
        } catch (e) {}
    }
    await jsonDb.delete('roles', (r: any) => r.id === id);
}

export function generateRandomPassword(length: number = 8): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let password = 'HURC-';
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, chars.length);
        password += chars.charAt(randomIndex);
    }
    return password;
}

/**
 * PASSWORD UPDATE: Refactored with validation and hashing
 */
export async function updateUserPassword(userId: string, newPassword: string, adminId?: string) {
    // 1. Validation
    const check = validatePassword(newPassword);
    if (!check.isValid) {
        throw new Error(check.message);
    }

    // 2. Hash and Update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateData = {
        password: hashedPassword,
        passwordLastChangedAt: new Date().toISOString(),
        mustChangePassword: false,
        updatedAt: new Date().toISOString()
    };

    if (!IS_DATABASE_OFFLINE) {
        try {
            return await authDb.user.update({
                where: { id: userId },
                data: updateData
            });
        } catch (e) { /* fallback */ }
    }

    return await jsonDb.updateRecord<any>('users', userId, updateData);
}
