'use server';

import { revalidatePath } from 'next/cache';
import { type User, type PasswordResetRequest } from '@/lib/constants';
import { internalLogSystemEvent as logSystemEvent } from '../services/log-service';
import { requirePermission, requireAuth, requireScopedPermission } from '@/lib/auth-enforcer';
import { sendVerificationEmail } from '../services/email';
import { 
    getInternalUsers, 
    createInternalUser, 
    updateInternalUser, 
    deleteInternalUser, 
    getInternalUserByEmail, 
    getInternalUserById,
    getInternalPasswordResetRequests,
    createInternalPasswordResetRequest,
    updateInternalPasswordResetRequest,
    generateRandomPassword,
    updateUserPassword as internalUpdateUserPassword
} from '../services/user-service';
import { sendPasswordResetEmail } from '../services/email';

// Internal helper for security
const omitPassword = (user: any): User => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
};

export async function getUsers(): Promise<User[]> {
    const currentUser = await requireAuth();
    const allUsers = await getInternalUsers();
    
    // SUPER_ADMIN or global users:manage → see all
    if (currentUser.role === 'SUPER_ADMIN' || currentUser.permissions?.includes('users:manage')) {
      return allUsers;
    }

    const userOuId = (currentUser as any).ouId;
    
    // Users with scoped permissions → see users in their OU hierarchy
    if (
      currentUser.permissions?.includes('users:view_scoped') ||
      currentUser.permissions?.includes('users:manage_scoped')
    ) {
      if (!userOuId) {
        return allUsers.filter((u: any) => u.id === currentUser.id);
      }
      const { OUScopeService } = await import('../services/ou-scope-service');
      const scopeOuIds = await OUScopeService.getOUWithDescendantIds(userOuId);
      return allUsers.filter((u: any) => u.ouId && scopeOuIds.includes(u.ouId));
    }

    // Default: users in same OU can see each other (for Chuyên viên L3 etc.)
    if (userOuId) {
      return allUsers.filter((u: any) => u.ouId === userOuId);
    }

    // No OU, no special permissions → only see self
    return allUsers.filter((u: any) => u.id === currentUser.id);
}

export async function addUser(user: Partial<User>): Promise<User> {
    try {
        await requirePermission('users:manage');
    } catch {
        await requireScopedPermission('users:manage_scoped', user.ouId);
    }
    const record = await createInternalUser(user);
    // Use welcome email logic if needed
    await logSystemEvent('CREATE_USER', 'INFO', `Created new user: ${record.name}`);
    revalidatePath('/admin/users');
    return omitPassword(record);
}

export async function updateUser(user: User): Promise<void> {
    const currentUser = await requireAuth();
    // Allow users to update themselves, otherwise require permission
    if (currentUser.id !== user.id) {
        try {
            await requirePermission('users:manage');
        } catch {
            await requireScopedPermission('users:manage_scoped', user.ouId);
        }
    }
    await updateInternalUser(user.id, user);
    await logSystemEvent('UPDATE_USER', 'INFO', `Updated user: ${user.name}`);
    revalidatePath('/admin/users');
    revalidatePath('/profile');
}

export async function deleteUser(userId: string) {
    const targetUser = await getInternalUserById(userId);
    if (!targetUser) throw new Error("Không tìm thấy người dùng.");
    
    try {
        const currentUser = await requirePermission('users:manage');
        if (currentUser?.id === userId) throw new Error("Cannot delete yourself.");
    } catch (e: any) {
        if (e.message === "Cannot delete yourself.") throw e;
        const currentUser = await requireScopedPermission('users:manage_scoped', targetUser.ouId);
        if (currentUser?.id === userId) throw new Error("Cannot delete yourself.");
    }

    await deleteInternalUser(userId);
    await logSystemEvent('DELETE_USER', 'WARNING', `Deleted user ID: ${userId}`);
    revalidatePath('/admin/users');
    return { success: true };
}

export async function verifyUserAccount(userId: string, otp: string): Promise<User> {
    // Public action (from email link)
    const user = await getInternalUserById(userId);
    if (!user) throw new Error("Không tìm thấy người dùng.");
    
    // Đối sánh khớp mã OTP thực tế và thời gian hiệu lực
    if (user.verificationOtp !== otp) {
        throw new Error("Mã xác thực (OTP) không chính xác.");
    }
    if (user.otpExpiry && new Date(user.otpExpiry) < new Date()) {
        throw new Error("Mã xác thực (OTP) đã hết hạn.");
    }

    await updateInternalUser(userId, { isVerified: true, status: 'active', verificationOtp: null, otpExpiry: null });
    const updated = await getInternalUserById(userId);
    return omitPassword(updated);
}

export async function resendVerificationOtp(userId: string): Promise<void> {
    // Không cho phép chạy và thông báo rõ ràng về SMTP
    throw new Error("Không thể gửi lại mã xác thực OTP. Hệ thống SMTP chưa được cấu hình. Vui lòng liên hệ Quản trị viên để xác minh tài khoản trực tiếp.");
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<User> {
    const currentUser = await requireAuth();
    const targetId = userId || currentUser.id;
    
    // Use the hardened service logic which handles history, expiry, and validation
    const updated = await internalUpdateUserPassword(targetId, newPassword, currentUser.id);
    
    await logSystemEvent('CHANGE_PASSWORD', 'INFO', `Changed password for user ID: ${targetId}`);
    
    // Revalidate paths that show user data
    revalidatePath('/admin/users');
    revalidatePath('/profile');
    
    return updated;
}

export async function requestPasswordReset(email: string): Promise<void> {
    throw new Error("Tính năng đặt lại mật khẩu bằng email đã bị vô hiệu hóa do hệ thống chưa cấu hình dịch vụ gửi email SMTP.");
}

export async function resetPassword(email: string, otp: string, newPassword: string): Promise<User> {
    throw new Error("Tính năng đặt lại mật khẩu đã bị vô hiệu hóa do hệ thống chưa cấu hình dịch vụ gửi email SMTP.");
}

export async function requestPasswordResetToAdmin(email: string) {
    throw new Error("Tính năng yêu cầu quản trị viên đặt lại mật khẩu tạm thời bị vô hiệu hóa do hệ thống chưa cấu hình dịch vụ gửi email SMTP.");
}

export async function getPendingPasswordResetRequests(): Promise<PasswordResetRequest[]> {
    await requirePermission('users:manage');
    return await getInternalPasswordResetRequests() as any;
}

export async function approvePasswordResetRequest(requestId: string): Promise<void> {
    await requirePermission('users:manage');
    
    // Find the request details first
    const requests = await getInternalPasswordResetRequests();
    const request = requests.find((r: any) => r.id === requestId);
    if (!request) throw new Error("Request not found");

    // Generate random password
    const tempPassword = generateRandomPassword();
    
    // 1. Cập nhật mật khẩu tạm thời cho người dùng
    await updateInternalUser(request.userId, { 
        password: tempPassword,
        mustChangePassword: true 
    });

    // 2. Cập nhật trạng thái yêu cầu reset password thành công
    await updateInternalPasswordResetRequest(requestId, 'approved');
    await logSystemEvent('APPROVE_RESET', 'INFO', `Approved password reset for ${request.userEmail}`);
    revalidatePath('/admin/users');

    // 3. Cố gắng gửi email (Nếu lỗi SMTP thì cảnh báo và ném lỗi hiển thị mật khẩu tạm cho admin)
    try {
        await sendPasswordResetEmail(request.userEmail, tempPassword);
    } catch (e: any) {
        console.warn("[approvePasswordResetRequest] Failed to send email via SMTP:", e);
        throw new Error(`Phê duyệt thành công! Tuy nhiên không thể gửi email tự động. MẬT KHẨU TẠM THỜI MỚI LÀ: ${tempPassword} (Hãy sao chép và gửi thủ công cho người dùng).`);
    }
}

export async function rejectPasswordResetRequest(requestId: string): Promise<void> {
    await requirePermission('users:manage');
    await updateInternalPasswordResetRequest(requestId, 'rejected');
    revalidatePath('/admin/users');
}

export async function adminResetUserPassword(userId: string, newPassword: string): Promise<void> {
    await requirePermission('users:manage');
    await updateInternalUser(userId, { password: newPassword });
    revalidatePath('/admin/users');
}
