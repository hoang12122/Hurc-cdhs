import crypto from 'crypto';
import { authDb, IS_DATABASE_OFFLINE } from '../prisma';
import { jsonDb } from '../db/json-db';
import { hashPassword } from '../security/password-hashing';

export function validatePassword(password: string): { isValid: boolean; message?: string } {
    if (password.length < 10) {
        return { isValid: false, message: 'Mật khẩu phải có ít nhất 10 ký tự.' };
    }
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, message: 'Mật khẩu phải chứa ít nhất một chữ hoa.' };
    }
    if (!/[a-z]/.test(password)) {
        return { isValid: false, message: 'Mật khẩu phải chứa ít nhất một chữ thường.' };
    }
    if (!/[0-9]/.test(password)) {
        return { isValid: false, message: 'Mật khẩu phải chứa ít nhất một chữ số.' };
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        return { isValid: false, message: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt.' };
    }

    return { isValid: true };
}

export function generateRandomPassword(length = 8): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let password = 'HURC-';

    for (let index = 0; index < length; index += 1) {
        password += chars.charAt(crypto.randomInt(0, chars.length));
    }

    return password;
}

export async function updateUserPassword(
    userId: string,
    newPassword: string,
    _adminId?: string,
) {
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
        throw new Error(validation.message);
    }

    const hashedPassword = await hashPassword(newPassword);
    const changedAt = new Date().toISOString();
    const updateData = {
        password: hashedPassword,
        passwordLastChangedAt: changedAt,
        mustChangePassword: false,
        updatedAt: changedAt,
    };

    if (!IS_DATABASE_OFFLINE) {
        try {
            return await authDb.user.update({
                where: { id: userId },
                data: {
                    password: updateData.password,
                    passwordLastChangedAt: new Date(changedAt),
                },
            });
        } catch (error) {
            console.error('[USER-PASSWORD] PostgreSQL update user password failed:', error);
            throw error;
        }
    }

    return jsonDb.updateRecord<any>('users', userId, updateData);
}
