'use server';

import { revalidatePath } from 'next/cache';
import { type User, type PasswordResetRequest } from '@/lib/constants';
import { internalLogSystemEvent as logSystemEvent } from '../services/log-service';
import { requirePermission, requireAuth, requireScopedPermission } from '@/lib/auth-enforcer';
import {
    getInternalUsers,
    createInternalUser,
    updateInternalUser,
    deleteInternalUser,
    getInternalUserById,
    getInternalPasswordResetRequests,
    updateInternalPasswordResetRequest,
    generateRandomPassword,
    updateUserPassword as internalUpdateUserPassword
} from '../services/user-service';
import { sendPasswordResetEmail } from '../services/email';

const omitPassword = (user: any): User => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
};

function pickFields(source: Record<string, any>, allowedFields: readonly string[]) {
    return Object.fromEntries(
        allowedFields
            .filter((field) => Object.prototype.hasOwnProperty.call(source, field))
            .map((field) => [field, source[field]])
    );
}

const SELF_EDITABLE_FIELDS = ['name', 'department', 'avatarUrl'] as const;
const SCOPED_ADMIN_EDITABLE_FIELDS = [
    'name', 'email', 'status', 'department', 'ouId', 'avatarUrl', 'assignedSubsystems'
] as const;
const GLOBAL_ADMIN_EDITABLE_FIELDS = [
    ...SCOPED_ADMIN_EDITABLE_FIELDS,
    'role', 'permissions', 'isVerified', 'mustChangePassword'
] as const;

export async function getUsers(): Promise<User[]> {
    const currentUser = await requireAuth();
    const allUsers = await getInternalUsers();

    if (currentUser.role === 'SUPER_ADMIN' || currentUser.permissions?.includes('users:manage')) {
      return allUsers;
    }

    const userOuId = (currentUser as any).ouId;
    if (
      currentUser.permissions?.includes('users:view_scoped') ||
      currentUser.permissions?.includes('users:manage_scoped')
    ) {
      if (!userOuId) return allUsers.filter((u: any) => u.id === currentUser.id);
      const { OUScopeService } = await import('../services/ou-scope-service');
      const scopeOuIds = await OUScopeService.getOUWithDescendantIds(userOuId);
      return allUsers.filter((u: any) => u.ouId && scopeOuIds.includes(u.ouId));
    }

    if (userOuId) return allUsers.filter((u: any) => u.ouId === userOuId);
    return allUsers.filter((u: any) => u.id === currentUser.id);
}

export async function addUser(user: Partial<User>): Promise<User> {
    try {
        await requirePermission('users:manage');
    } catch {
        await requireScopedPermission('users:manage_scoped', user.ouId);
    }
    const record = await createInternalUser(user);
    await logSystemEvent('CREATE_USER', 'INFO', `Created new user: ${record.name}`);
    revalidatePath('/admin/users');
    return omitPassword(record);
}

export async function updateUser(user: User): Promise<void> {
    const currentUser = await requireAuth();
    let safeUpdate: Record<string, any>;

    if (currentUser.id === user.id) {
        safeUpdate = pickFields(user as any, SELF_EDITABLE_FIELDS);
    } else {
        try {
            await requirePermission('users:manage');
            safeUpdate = pickFields(user as any, GLOBAL_ADMIN_EDITABLE_FIELDS);
        } catch {
            await requireScopedPermission('users:manage_scoped', user.ouId);
            safeUpdate = pickFields(user as any, SCOPED_ADMIN_EDITABLE_FIELDS);
        }
    }

    await updateInternalUser(user.id, safeUpdate);
    await logSystemEvent('UPDATE_USER', 'INFO', `Updated user ID: ${user.id}`);
    revalidatePath('/admin/users');
    revalidatePath('/profile');
}

export async function deleteUser(userId: string) {
    const targetUser = await getInternalUserById(userId);
    if (!targetUser) throw new Error('Không tìm thấy người dùng.');

    try {
        const currentUser = await requirePermission('users:manage');
        if (currentUser?.id === userId) throw new Error('Cannot delete yourself.');
    } catch (e: any) {
        if (e.message === 'Cannot delete yourself.') throw e;
        const currentUser = await requireScopedPermission('users:manage_scoped', targetUser.ouId);
        if (currentUser?.id === userId) throw new Error('Cannot delete yourself.');
    }

    await deleteInternalUser(userId);
    await logSystemEvent('DELETE_USER', 'WARNING', `Deleted user ID: ${userId}`);
    revalidatePath('/admin/users');
    return { success: true };
}

export async function verifyUserAccount(userId: string, otp: string): Promise<User> {
    const user = await getInternalUserById(userId);
    if (!user) throw new Error('Không tìm thấy người dùng.');
    if (user.verificationOtp !== otp) throw new Error('Mã xác thực (OTP) không chính xác.');
    if (user.otpExpiry && new Date(user.otpExpiry) < new Date()) {
        throw new Error('Mã xác thực (OTP) đã hết hạn.');
    }

    await updateInternalUser(userId, {
        isVerified: true,
        status: 'active',
        verificationOtp: null,
        otpExpiry: null
    });
    const updated = await getInternalUserById(userId);
    return omitPassword(updated);
}

export async function resendVerificationOtp(_userId: string): Promise<void> {
    throw new Error('Không thể gửi lại mã xác thực OTP. Hệ thống SMTP chưa được cấu hình. Vui lòng liên hệ Quản trị viên để xác minh tài khoản trực tiếp.');
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<User> {
    const currentUser = await requireAuth();
    const targetId = userId || currentUser.id;

    if (targetId !== currentUser.id) {
        await requirePermission('users:manage');
    }

    const updated = await internalUpdateUserPassword(targetId, newPassword, currentUser.id);
    await logSystemEvent('CHANGE_PASSWORD', 'INFO', `Changed password for user ID: ${targetId}`);
    revalidatePath('/admin/users');
    revalidatePath('/profile');
    return omitPassword(updated);
}

export async function requestPasswordReset(_email: string): Promise<void> {
    throw new Error('Tính năng đặt lại mật khẩu bằng email đã bị vô hiệu hóa do hệ thống chưa cấu hình dịch vụ gửi email SMTP.');
}

export async function resetPassword(_email: string, _otp: string, _newPassword: string): Promise<User> {
    throw new Error('Tính năng đặt lại mật khẩu đã bị vô hiệu hóa do hệ thống chưa cấu hình dịch vụ gửi email SMTP.');
}

export async function requestPasswordResetToAdmin(_email: string) {
    throw new Error('Tính năng yêu cầu quản trị viên đặt lại mật khẩu tạm thời bị vô hiệu hóa do hệ thống chưa cấu hình dịch vụ gửi email SMTP.');
}

export async function getPendingPasswordResetRequests(): Promise<PasswordResetRequest[]> {
    await requirePermission('users:manage');
    return await getInternalPasswordResetRequests() as any;
}

export async function approvePasswordResetRequest(requestId: string): Promise<void> {
    await requirePermission('users:manage');
    const requests = await getInternalPasswordResetRequests();
    const request = requests.find((r: any) => r.id === requestId);
    if (!request) throw new Error('Request not found');

    const tempPassword = generateRandomPassword();
    await updateInternalUser(request.userId, { password: tempPassword, mustChangePassword: true });
    await updateInternalPasswordResetRequest(requestId, 'approved');
    await logSystemEvent('APPROVE_RESET', 'INFO', `Approved password reset for ${request.userEmail}`);
    revalidatePath('/admin/users');

    try {
        await sendPasswordResetEmail(request.userEmail, tempPassword);
    } catch (e: any) {
        console.warn('[approvePasswordResetRequest] Failed to send email via SMTP:', e);
        throw new Error(`Phê duyệt thành công nhưng không thể gửi email tự động. Mật khẩu tạm thời: ${tempPassword}`);
    }
}

export async function rejectPasswordResetRequest(requestId: string): Promise<void> {
    await requirePermission('users:manage');
    await updateInternalPasswordResetRequest(requestId, 'rejected');
    revalidatePath('/admin/users');
}

export async function adminResetUserPassword(userId: string, newPassword: string): Promise<void> {
    await requirePermission('users:manage');
    await internalUpdateUserPassword(userId, newPassword);
    revalidatePath('/admin/users');
}
