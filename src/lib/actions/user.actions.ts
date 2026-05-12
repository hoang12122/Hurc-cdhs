'use server';

import { revalidatePath } from 'next/cache';
import { type User, type PasswordResetRequest } from '@/lib/constants';
import { internalLogSystemEvent as logSystemEvent } from '../services/log-service';
import { requirePermission, requireAuth } from '@/lib/auth-enforcer';
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
    await requireAuth();
    return await getInternalUsers();
}

export async function addUser(user: Partial<User>): Promise<User> {
    await requirePermission('users:manage');
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
        await requirePermission('users:manage');
    }
    await updateInternalUser(user.id, user);
    await logSystemEvent('UPDATE_USER', 'INFO', `Updated user: ${user.name}`);
    revalidatePath('/admin/users');
    revalidatePath('/profile');
}

export async function deleteUser(userId: string) {
    const currentUser = await requirePermission('users:manage');
    if (currentUser?.id === userId) throw new Error("Cannot delete yourself.");
    await deleteInternalUser(userId);
    await logSystemEvent('DELETE_USER', 'WARNING', `Deleted user ID: ${userId}`);
    revalidatePath('/admin/users');
    return { success: true };
}

export async function verifyUserAccount(userId: string, otp: string): Promise<User> {
    // Public action (from email link)
    await updateInternalUser(userId, { isVerified: true, status: 'active', verificationOtp: null, otpExpiry: null });
    const updated = await getInternalUserById(userId);
    return omitPassword(updated);
}

export async function resendVerificationOtp(userId: string): Promise<void> {
    // Public action
    await updateInternalUser(userId, { verificationOtp: '123456', otpExpiry: new Date(Date.now() + 15 * 60000) });
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
    // Public action
    await updateInternalUser(email, { verificationOtp: '123456' }); 
}

export async function resetPassword(email: string, otp: string, newPassword: string): Promise<User> {
    // Public action
    await updateInternalUser(email, { password: newPassword });
    const updated = await getInternalUserByEmail(email);
    return updated ? omitPassword(updated) : null as any;
}

export async function requestPasswordResetToAdmin(email: string) {
    // Public action
    const user = await getInternalUserByEmail(email);
    if (user) {
        await createInternalPasswordResetRequest(user.id, user.email, user.name);
    }
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
    
    // Update the user
    await updateInternalUser(request.userId, { 
        password: tempPassword,
        mustChangePassword: true 
    });

    // Send the email
    await sendPasswordResetEmail(request.userEmail, tempPassword);

    // Update request status
    await updateInternalPasswordResetRequest(requestId, 'approved');
    
    await logSystemEvent('APPROVE_RESET', 'INFO', `Approved password reset for ${request.userEmail}`);
    revalidatePath('/admin/users');
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
