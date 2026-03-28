'use server';

import { revalidatePath } from 'next/cache';
import { type User, type PasswordResetRequest, ROLE_ADMIN_PKTAT } from '@/lib/constants';
import { logSystemEvent } from './system.actions';
import { hasPermission } from '../auth';
import { sendVerificationEmail } from '../services/email';
import bcrypt from 'bcryptjs';
import { authDb } from '@/lib/prisma';
import crypto from 'crypto';

// Helper to remove password from user object
function omitPassword(user: any): Omit<User, 'password'> {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword as Omit<User, 'password'>;
}

export async function getUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await authDb.user.findMany();
    return users.map(omitPassword);
}

export async function addUser(user: Omit<User, 'id' | 'isVerified' | 'passwordLastChangedAt' | 'status'>): Promise<User> {
    const { checkRateLimit } = await import('../rate-limit');
    await checkRateLimit('add_user', 10);
    if (!await hasPermission('users:manage')) {
        throw new Error("Permission denied: You do not have permission to add users.");
    }

    const hashedPassword = await bcrypt.hash(user.password!, 10);
    const otpStr = crypto.randomInt(100000, 999999).toString();
    const expiryDate = new Date(Date.now() + 15 * 60000);

    const newRecord = await authDb.user.create({
        data: {
          id: `user-${Date.now()}`,
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          status: "active",
          department: user.department,
          isVerified: false,
          verificationOtp: otpStr,
          otpExpiry: expiryDate,
          passwordLastChangedAt: new Date(),
        }
    });

    await sendVerificationEmail(newRecord.email, otpStr);
    await logSystemEvent('CREATE_USER', 'INFO', `Created new user: ${newRecord.name}`);
    
    revalidatePath('/admin/users');
    return omitPassword(newRecord) as User;
}

export async function updateUser(updatedUser: User): Promise<void> {
    const { getCurrentUser } = await import('./auth.actions');
    const currentUser = await getCurrentUser();
    
    if (!await hasPermission('users:manage') && currentUser?.id !== updatedUser.id) {
        throw new Error("Permission denied: You do not have permission to update this user.");
    }
    
    const originalUser = await authDb.user.findUnique({ where: { id: updatedUser.id } });
    if (!originalUser) throw new Error("User not found");

    await authDb.user.update({
        where: { id: updatedUser.id },
        data: {
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            status: updatedUser.status,
            department: updatedUser.department,
            isVerified: updatedUser.isVerified,
            permissions: updatedUser.permissions,
            password: updatedUser.password ? await bcrypt.hash(updatedUser.password, 10) : originalUser.password
        }
    });

    await logSystemEvent('UPDATE_USER', 'INFO', `Updated user: ${updatedUser.name}`);
    revalidatePath('/admin/users');
    revalidatePath('/profile');
}

export async function deleteUser(userId: string): Promise<{ success: boolean, message: string }> {
     if (!await hasPermission('users:manage')) {
        return { success: false, message: 'Permission denied: You do not have permission to delete users.' };
    }
    const { getCurrentUser } = await import('./auth.actions');
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, message: 'Must be logged in to delete users.' };

    const userToDelete = await authDb.user.findUnique({ where: { id: userId } });
    if (!userToDelete) {
        return { success: false, message: 'User not found.' };
    }

    if (userToDelete.id === currentUser.id) {
        const message = `User ${currentUser.name} attempted to delete their own account.`;
        await logSystemEvent('DELETE_USER_FAILED', 'WARNING', message);
        return { success: false, message: 'Bạn không thể tự xóa tài khoản của chính mình.' };
    }

    if (userToDelete.role === ROLE_ADMIN_PKTAT && currentUser.email !== 'superadmin@hurc.cdhs') {
         const message = `User ${currentUser.name} attempted to delete admin ${userToDelete.name}. This is not allowed.`;
         await logSystemEvent('DELETE_USER_FAILED', 'CRITICAL', message);
         return { success: false, message: 'Không thể xóa tài khoản Quản trị viên trừ khi bạn là Super Admin.' };
    }
    
    await authDb.user.delete({ where: { id: userId } });
    await logSystemEvent('DELETE_USER', 'WARNING', `User ${currentUser.name} deleted user: ${userToDelete.name} (ID: ${userId})`);
    
    revalidatePath('/admin/users');
    return { success: true, message: 'User deleted successfully.' };
}


export async function verifyUserAccount(userId: string, otp: string): Promise<User> {
    const user = await authDb.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found during verification.");

    if (user.verificationOtp !== otp) {
        throw new Error("Mã OTP không hợp lệ.");
    }
    if (user.otpExpiry && new Date() > new Date(user.otpExpiry)) {
         throw new Error("Mã OTP đã hết hạn.");
    }

    const updatedUser = await authDb.user.update({
        where: { id: userId },
        data: {
            isVerified: true,
            status: 'active',
            verificationOtp: null,
            otpExpiry: null
        }
    });

    await sendVerificationEmail(updatedUser.email, "Tài khoản của bạn đã được xác thực thành công");
    await logSystemEvent('VERIFY_USER_ACCOUNT', 'INFO', `User account verified: ${updatedUser.name}`);
    return omitPassword(updatedUser) as User;
}

export async function resendVerificationOtp(userId: string): Promise<void> {
    const { checkRateLimit } = await import('../rate-limit');
    await checkRateLimit(`resend_otp_${userId}`, 3, 10 * 60 * 1000); // 3 resends per 10 mins

    const user = await authDb.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found.");
    if (user.isVerified) throw new Error("User is already verified.");

    const otpStr = crypto.randomInt(100000, 999999).toString();
    const expiryDate = new Date(Date.now() + 15 * 60000);

    await authDb.user.update({
        where: { id: userId },
        data: {
            verificationOtp: otpStr,
            otpExpiry: expiryDate
        }
    });

    await sendVerificationEmail(user.email, otpStr);
    await logSystemEvent('RESEND_OTP', 'INFO', `Resent verification OTP to user ID: ${userId}`);
}

export async function updateUserPassword(userId: string, newPassword?: string): Promise<User> {
    const user = await authDb.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found to update password.");
    
    const updateData: any = { passwordLastChangedAt: new Date() };
    if (newPassword) {
        updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await authDb.user.update({
        where: { id: userId },
        data: updateData
    });
    
    await sendVerificationEmail(updatedUser.email, "******", "Mật khẩu của bạn đã được thay đổi");
    await logSystemEvent('UPDATE_USER_PASSWORD', 'INFO', `User password updated for: ${updatedUser.name}`);
    
    revalidatePath('/profile');
    revalidatePath('/admin/users');
    return omitPassword(updatedUser) as User;
}

export async function requestPasswordReset(email: string): Promise<void> {
    const { checkRateLimit } = await import('@/lib/rate-limit');
    if (!checkRateLimit(`reset_${email}`, 3, 15 * 60 * 1000)) { // 3 requests per 15 minutes
        throw new Error("Quá nhiều yêu cầu. Vui lòng thử lại sau.");
    }
    
    const otpStr = crypto.randomInt(100000, 999999).toString();
    const expiryDate = new Date(Date.now() + 15 * 60000);

    const user = await authDb.user.findUnique({ where: { email } });
    if (user) {
        await authDb.user.update({
            where: { email },
            data: {
                verificationOtp: otpStr,
                otpExpiry: expiryDate
            }
        });
        await sendVerificationEmail(email, otpStr, "Sử dụng mã OTP này để đặt lại mật khẩu của bạn");
        await logSystemEvent('PASSWORD_RESET_REQUESTED', 'INFO', `Password reset OTP sent to: ${email}`);
    } else {
        await logSystemEvent('PASSWORD_RESET_FAILED', 'WARNING', `Password reset requested for non-existent user: ${email}`);
    }
}

export async function resetPassword(email: string, otp: string, newPassword: string): Promise<User> {
    const user = await authDb.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found or OTP invalid.");

    if (user.verificationOtp !== otp) {
        throw new Error("Mã OTP không hợp lệ.");
    }
    if (user.otpExpiry && new Date() > new Date(user.otpExpiry)) {
         throw new Error("Mã OTP đã hết hạn.");
    }

    const updatedUser = await authDb.user.update({
        where: { email },
        data: {
            password: await bcrypt.hash(newPassword, 10),
            passwordLastChangedAt: new Date(),
            verificationOtp: null,
            otpExpiry: null
        }
    });
    
    await sendVerificationEmail(updatedUser.email, "******", "Mật khẩu của bạn đã được đặt lại thành công");
    await logSystemEvent('RESET_USER_PASSWORD', 'INFO', `User password reset successfully for: ${updatedUser.name}`);
    
    return omitPassword(updatedUser) as User;
}

// ======= PASSWORD RESET REQUEST FEATURE =======

export async function requestPasswordResetToAdmin(email: string): Promise<{ success: boolean; message: string } | undefined> {
    const { checkRateLimit } = await import('@/lib/rate-limit');
    await checkRateLimit(`pwd_reset_req_${email}`, 3, 15 * 60 * 1000);

    const user = await authDb.user.findUnique({ where: { email } });
    if (!user) {
        return; // Silent response
    }

    const existing = await authDb.passwordResetRequest.findFirst({
        where: { userEmail: email, status: 'pending' }
    });
    
    if (existing) {
        return; 
    }

    await authDb.passwordResetRequest.create({
        data: {
            id: `pwr-${Date.now()}`,
            userId: user.id,
            userEmail: user.email,
            userName: user.name,
            status: 'pending',
        }
    });

    await logSystemEvent('PASSWORD_RESET_REQUEST', 'INFO', `Password reset request submitted for email: ${email}`);
    return { success: true, message: 'Yêu cầu đặt lại mật khẩu đã được gửi đến quản trị viên.' };
}

export async function getPendingPasswordResetRequests(): Promise<PasswordResetRequest[]> {
    if (!await hasPermission('users:manage')) {
        throw new Error("Permission denied.");
    }
    const requests = await authDb.passwordResetRequest.findMany({ where: { status: 'pending' } });
    return requests.map((r: any) => ({ ...r, createdAt: r.createdAt.toISOString() })) as PasswordResetRequest[];
}

export async function approvePasswordResetRequest(requestId: string, newPassword: string): Promise<void> {
    if (!await hasPermission('users:manage')) {
        throw new Error("Permission denied.");
    }
    
    const request = await authDb.passwordResetRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new Error("Yêu cầu không tồn tại.");

    await authDb.user.update({
        where: { id: request.userId },
        data: {
            password: await bcrypt.hash(newPassword, 10),
            passwordLastChangedAt: new Date()
        }
    });

    await authDb.passwordResetRequest.update({
        where: { id: requestId },
        data: { status: 'approved' }
    });

    await logSystemEvent('APPROVE_PASSWORD_RESET', 'INFO', `Approved password reset request: ${requestId}`);
    revalidatePath('/admin/users');
}

export async function rejectPasswordResetRequest(requestId: string): Promise<void> {
    if (!await hasPermission('users:manage')) {
        throw new Error("Permission denied.");
    }

    await authDb.passwordResetRequest.update({
        where: { id: requestId },
        data: { status: 'rejected' }
    });

    await logSystemEvent('REJECT_PASSWORD_RESET', 'WARNING', `Rejected password reset request: ${requestId}`);
    revalidatePath('/admin/users');
}

export async function adminResetUserPassword(userId: string, newPassword: string): Promise<void> {
    if (!await hasPermission('users:manage')) {
        throw new Error("Permission denied: Bạn không có quyền đặt lại mật khẩu.");
    }
    
    const updatedUser = await authDb.user.update({
        where: { id: userId },
        data: {
            password: await bcrypt.hash(newPassword, 10),
            passwordLastChangedAt: new Date()
        }
    });

    await logSystemEvent('ADMIN_RESET_PASSWORD', 'WARNING', `Admin reset password for user: ${updatedUser.name} (ID: ${userId})`);
    revalidatePath('/admin/users');
}
