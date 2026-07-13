import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { type User } from '../../constants';
import { jsonDb } from '../../db/json-db';
import { authDb, IS_DATABASE_OFFLINE } from '../../prisma';

function omitPassword(user: any): User {
  const { password: _password, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
}

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
    } catch {
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
      (new Date(dbUser.lockoutUntil).getTime() - now.getTime()) / 60_000,
    );
    return { error: `Tài khoản đã bị khóa. Vui lòng thử lại sau ${remaining} phút.` };
  }

  const isValid = await bcrypt.compare(password, dbUser.password);
  if (!isValid) {
    const failedAttempts = (dbUser.failedLoginAttempts || 0) + 1;
    const updateData: any = { failedLoginAttempts: failedAttempts };

    if (failedAttempts >= 5) {
      updateData.lockoutUntil = new Date(now.getTime() + 15 * 60_000).toISOString();
      updateData.failedLoginAttempts = 0;
    }

    await updateInternalUser(dbUser.id, updateData);
    return { error: 'Email hoặc mật khẩu không chính xác.' };
  }

  const updateSuccess = {
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
      const users = await authDb.user.findMany({ orderBy: { name: 'asc' } });
      return users.map(omitPassword) as unknown as User[];
    } catch {
      // Fall through to the offline store.
    }
  }
  const users = await jsonDb.getCollection<any>('users');
  return users.map(omitPassword) as unknown as User[];
}

export async function createInternalUser(user: Partial<User>) {
  const hashedPassword = await bcrypt.hash(user.password || 'default123', 10);
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiry = new Date(Date.now() + 15 * 60_000);
  const now = new Date().toISOString();

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
    passwordLastChangedAt: now,
    createdAt: now,
    updatedAt: now,
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
        } as any,
      });
    } catch (error) {
      console.error('[USER-SERVICE] PostgreSQL create user failed:', error);
      throw error;
    }
  }

  return jsonDb.insertRecord<any>('users', record);
}

export async function updateInternalUser(id: string, data: any) {
  const normalizedData = { ...data };
  if (normalizedData.password && !normalizedData.password.startsWith('$2b$')) {
    normalizedData.password = await bcrypt.hash(normalizedData.password, 10);
  }

  const updatePayload = {
    ...normalizedData,
    updatedAt: new Date().toISOString(),
  };

  if (!IS_DATABASE_OFFLINE) {
    const pgPayload: any = {};
    const allowedFields = [
      'name', 'email', 'password', 'role', 'status', 'department', 'ouId',
      'isVerified', 'passwordLastChangedAt', 'permissions', 'assignedSubsystems',
      'avatarUrl', 'verificationOtp', 'otpExpiry', 'deletedAt', 'activeSessionId',
      'failedLoginAttempts', 'lockoutUntil', 'lastLoginAt', 'lastLoginIp',
      'mustChangePassword',
    ];

    for (const key of allowedFields) {
      if (!(key in updatePayload)) continue;
      if (
        ['passwordLastChangedAt', 'otpExpiry', 'deletedAt', 'lockoutUntil', 'lastLoginAt'].includes(key)
        && updatePayload[key]
      ) {
        pgPayload[key] = new Date(updatePayload[key]);
      } else {
        pgPayload[key] = updatePayload[key];
      }
    }

    try {
      return await authDb.user.update({ where: { id }, data: pgPayload });
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
    } catch {
      console.warn('[USER-SERVICE] DB unreachable during getInternalUserByEmail, checking local store.');
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
    } catch {
      console.warn('[USER-SERVICE] DB unreachable during getInternalUserById, checking local store.');
    }
  }
  if (!dbUser) {
    dbUser = await jsonDb.findFirst<any>('users', (user: any) => user.id === id);
  }
  return dbUser ? omitPassword(dbUser) : null;
}
