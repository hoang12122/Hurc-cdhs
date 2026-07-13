import { authDb, IS_DATABASE_OFFLINE } from '../prisma';
import { jsonDb } from '../db/json-db';
import { type User } from '../constants';
import crypto from 'crypto';
import {
    hashPassword,
    isBcryptHash,
    passwordHashNeedsUpgrade,
    verifyPassword,
} from '../security/password-hashing';

export {
    createInternalPasswordResetRequest,
    createInternalRole,
    deleteInternalRole,
    getInternalPasswordResetRequests,
    getInternalRoles,
    updateInternalPasswordResetRequest,
    updateInternalRole,
} from './user-access-service';
export {
    generateRandomPassword,
    updateUserPassword,
    validatePassword,
} from './user-password-service';

/**
 * CORE LOGIC ONLY - NO 'use server'
 * Handles user persistence, credential verification, and account metadata.
 */

function omitPassword(user: any): User {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
}

/**
 * LOGIN VERIFICATION: Enhanced with Brute Force Protection & Metadata Updates
 */
export async function verifyInternalCredentials(
    email: string,
    password?: string,
    ip?: string,
): Promise<{ user?: User; error?: string }> {
    if (!password) return { error: 'Mật khẩu không được để trống.' };

    let dbUser: any = null;
    const now = new Date();

    if (!IS_DATABASE_OFFLINE) {
        try {
            dbUser = await authDb.user.findUnique({ where: { email } });
        } catch (error) {
            console.warn('[USER-SERVICE] DB unreachable during login, checking local store.');
        }
    }

    if (!dbUser) {
        dbUser = await jsonDb.findFirst<any>('users', (user: any) => user.email === email);
    }

    if (!dbUser) return { error: 'Email hoặc mật khẩu không chính xác.' };

    if (dbUser.status !== 'active') {
        return { error: 'Tài khoản đã bị vô hiệu hóa hoặc tạm khóa. Vui lòng liên hệ quản trị viên.' };
    }

    if (dbUser.lockoutUntil && new Date(dbUser.lockoutUntil) > now) {
        const remaining = Math.ceil(
            (new Date(dbUser.lockoutUntil).getTime() - now.getTime()) / 60000,
        );
        return { error: `Tài khoản đã bị khóa. Vui lòng thử lại sau ${remaining} phút.` };
    }

    const isValid = await verifyPassword(password, dbUser.password);

    if (!isValid) {
        const failedAttempts = (dbUser.failedLoginAttempts || 0) + 1;
        const updateData: any = { failedLoginAttempts: failedAttempts };

        if (failedAttempts >= 5) {
            updateData.lockoutUntil = new Date(now.getTime() + 15 * 60000).toISOString();
            updateData.failedLoginAttempts = 0;
        }

        await updateInternalUser(dbUser.id, updateData);
        return { error: 'Email hoặc mật khẩu không chính xác.' };
    }

    const updateSuccess: any = {
        failedLoginAttempts: 0,
        lockoutUntil: null,
        lastLoginAt: now.toISOString(),
        lastLoginIp: ip || 'unknown',
    };

    if (passwordHashNeedsUpgrade(dbUser.password)) {
        try {
            updateSuccess.password = await hashPassword(password);
        } catch (error) {
            // Rehash failure must not prevent an otherwise valid login.
            console.error('[USER-SERVICE] Password hash upgrade failed:', error);
        }
    }

    await updateInternalUser(dbUser.id, updateSuccess);
    return { user: omitPassword({ ...dbUser, ...updateSuccess }) };
}

export async function getInternalUsers(): Promise<User[]> {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const users = await authDb.user.findMany({ orderBy: { name: 'asc' } });
            return users.map(omitPassword) as unknown as User[];
        } catch (error) {}
    }

    const users = await jsonDb.getCollection<any>('users');
    return users.map(omitPassword) as unknown as User[];
}

export async function createInternalUser(user: Partial<User>) {
    const hashedPassword = await hashPassword(user.password || 'default123');
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 15 * 60000);

    const record: any = {
        id: user.id || `user-${Date.now()}`,
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        status: 'active',
        department: user.department,
        ouId: user.ouId || null,
        isVerified: user.isVerified !== false,
        verificationOtp: otp,
        otpExpiry: expiry.toISOString(),
        mustChangePassword: user.mustChangePassword || false,
        passwordLastChangedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    if (!IS_DATABASE_OFFLINE) {
        try {
            return await authDb.user.create({
                data: {
                    id: record.id,
                    name: record.name,
                    email: record.email,
                    password: record.password,
                    role: record.role,
                    status: record.status,
                    department: record.department,
                    ouId: record.ouId,
                    isVerified: record.isVerified,
                    verificationOtp: record.verificationOtp,
                    otpExpiry: new Date(record.otpExpiry),
                    passwordLastChangedAt: new Date(record.passwordLastChangedAt),
                    createdAt: new Date(record.createdAt),
                    updatedAt: new Date(record.updatedAt),
                    permissions: user.permissions || [],
                    assignedSubsystems: user.assignedSubsystems || [],
                },
            });
        } catch (error) {
            console.error('[USER-SERVICE] PostgreSQL create user failed:', error);
            throw error;
        }
    }

    return jsonDb.insertRecord<any>('users', record);
}

export async function updateInternalUser(id: string, data: any) {
    if (data.password && !isBcryptHash(data.password)) {
        data.password = await hashPassword(data.password);
    }

    const updatePayload = {
        ...data,
        updatedAt: new Date().toISOString(),
    };

    if (!IS_DATABASE_OFFLINE) {
        const pgPayload: any = {};
        const allowedFields = [
            'name',
            'email',
            'password',
            'role',
            'status',
            'department',
            'ouId',
            'isVerified',
            'passwordLastChangedAt',
            'permissions',
            'assignedSubsystems',
            'avatarUrl',
            'verificationOtp',
            'otpExpiry',
            'deletedAt',
            'activeSessionId',
        ];

        for (const key of allowedFields) {
            if (!(key in updatePayload)) continue;

            if (
                ['passwordLastChangedAt', 'otpExpiry', 'deletedAt'].includes(key) &&
                updatePayload[key]
            ) {
                pgPayload[key] = new Date(updatePayload[key]);
            } else {
                pgPayload[key] = updatePayload[key];
            }
        }

        try {
            return await authDb.user.update({
                where: { id },
                data: pgPayload,
            });
        } catch (error) {
            console.error('[USER-SERVICE] PostgreSQL update user failed:', error);
            throw error;
        }
    }

    return jsonDb.updateRecord<any>('users', id, updatePayload);
}

export async function deleteInternalUser(id: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await authDb.user.delete({ where: { id } });
        } catch (error) {
            console.error('[USER-SERVICE] PostgreSQL delete user failed:', error);
            throw error;
        }
    }

    return jsonDb.delete('users', (user: any) => user.id === id);
}

export async function getInternalUserByEmail(email: string): Promise<User | null> {
    let dbUser: any = null;

    if (!IS_DATABASE_OFFLINE) {
        try {
            dbUser = await authDb.user.findUnique({ where: { email } });
        } catch (error) {
            console.warn(
                '[USER-SERVICE] DB unreachable during getInternalUserByEmail, checking local store.',
            );
        }
    }

    if (!dbUser) {
        dbUser = await jsonDb.findFirst<any>('users', (user: any) => user.email === email);
    }

    return dbUser ? omitPassword(dbUser) : null;
}

export async function getInternalUserById(id: string): Promise<User | null> {
    let dbUser: any = null;

    if (!IS_DATABASE_OFFLINE) {
        try {
            dbUser = await authDb.user.findUnique({ where: { id } });
        } catch (error) {
            console.warn(
                '[USER-SERVICE] DB unreachable during getInternalUserById, checking local store.',
            );
        }
    }

    if (!dbUser) {
        dbUser = await jsonDb.findFirst<any>('users', (user: any) => user.id === id);
    }

    return dbUser ? omitPassword(dbUser) : null;
}
