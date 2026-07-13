import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { jsonDb } from '../../db/json-db';
import { authDb, IS_DATABASE_OFFLINE } from '../../prisma';

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
  for (let index = 0; index < length; index++) {
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

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updateData = {
    password: hashedPassword,
    passwordLastChangedAt: new Date().toISOString(),
    mustChangePassword: false,
    updatedAt: new Date().toISOString(),
  };

  if (!IS_DATABASE_OFFLINE) {
    try {
      return await authDb.user.update({
        where: { id: userId },
        data: {
          password: updateData.password,
          passwordLastChangedAt: new Date(updateData.passwordLastChangedAt),
        },
      });
    } catch (error) {
      console.error('[USER-SERVICE] PostgreSQL update user password failed:', error);
      throw error;
    }
  }

  return jsonDb.updateRecord<any>('users', userId, updateData);
}
