// src/lib/actions/assign-ou.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { requirePermission, requireScopedPermission, requireAuth } from '@/lib/auth-enforcer';
import { getInternalUsers, updateInternalUser, getInternalUserById } from '../services/user-service';
import { OrganizationService } from '../services/organization-service';
import { OUScopeService } from '../services/ou-scope-service';
import { internalLogSystemEvent as logSystemEvent } from '../services/log-service';
import { ROLE_SUPER_ADMIN } from '@/lib/constants';

/**
 * Assign a single user to an Organizational Unit
 */
export async function assignUserToOU(userId: string, ouId: string) {
  try {
    const currentUser = await requirePermission('users:manage');

    // Verify OU exists
    const allOus = await OrganizationService.getOrganizationalUnits();
    const targetOu = allOus.find(ou => ou.id === ouId);
    if (!targetOu) {
      return { success: false, error: 'Đơn vị tổ chức không tồn tại.' };
    }

    // Scope check: if not SUPER_ADMIN, can only assign to OUs within scope
    if (currentUser.role !== ROLE_SUPER_ADMIN) {
      const userOuId = (currentUser as any).ouId;
      if (userOuId) {
        const inScope = await OUScopeService.isOUInScope(userOuId, ouId);
        if (!inScope) {
          return { success: false, error: 'Bạn không có quyền gán người dùng vào đơn vị tổ chức ngoài phạm vi của bạn.' };
        }
      }
    }

    // Get OU path for department auto-fill
    const ouPath = await OUScopeService.getOUScopePath(ouId);
    const shortName = targetOu.name;

    await updateInternalUser(userId, { ouId, department: shortName });

    await logSystemEvent('ASSIGN_USER_OU', 'INFO', `Assigned user ${userId} to OU: ${shortName}`);
    revalidatePath('/admin/users');
    revalidatePath('/admin/organization');
    return { success: true, ouPath };
  } catch (error: any) {
    console.error('[ASSIGN-OU] assignUserToOU failed:', error);
    return { success: false, error: error.message || 'Lỗi không xác định.' };
  }
}

/**
 * Remove a user from their current Organizational Unit
 */
export async function removeUserFromOU(userId: string) {
  try {
    await requirePermission('users:manage');

    await updateInternalUser(userId, { ouId: null, department: '' });

    await logSystemEvent('REMOVE_USER_OU', 'INFO', `Removed user ${userId} from their OU`);
    revalidatePath('/admin/users');
    revalidatePath('/admin/organization');
    return { success: true };
  } catch (error: any) {
    console.error('[ASSIGN-OU] removeUserFromOU failed:', error);
    return { success: false, error: error.message || 'Lỗi không xác định.' };
  }
}

/**
 * Batch assign multiple users to an Organizational Unit
 */
export async function batchAssignUsersToOU(userIds: string[], ouId: string) {
  try {
    const currentUser = await requirePermission('users:manage');

    // Verify OU exists
    const allOus = await OrganizationService.getOrganizationalUnits();
    const targetOu = allOus.find(ou => ou.id === ouId);
    if (!targetOu) {
      return { success: false, error: 'Đơn vị tổ chức không tồn tại.' };
    }

    // Scope check
    if (currentUser.role !== ROLE_SUPER_ADMIN) {
      const userOuId = (currentUser as any).ouId;
      if (userOuId) {
        const inScope = await OUScopeService.isOUInScope(userOuId, ouId);
        if (!inScope) {
          return { success: false, error: 'Bạn không có quyền gán người dùng vào đơn vị tổ chức ngoài phạm vi của bạn.' };
        }
      }
    }

    const shortName = targetOu.name;
    let successCount = 0;
    const errors: string[] = [];

    for (const userId of userIds) {
      try {
        await updateInternalUser(userId, { ouId, department: shortName });
        successCount++;
      } catch (err: any) {
        errors.push(`User ${userId}: ${err.message}`);
      }
    }

    await logSystemEvent('BATCH_ASSIGN_OU', 'INFO', `Batch assigned ${successCount}/${userIds.length} users to OU: ${shortName}`);
    revalidatePath('/admin/users');
    revalidatePath('/admin/organization');
    return { success: true, count: successCount, errors: errors.length > 0 ? errors : undefined };
  } catch (error: any) {
    console.error('[ASSIGN-OU] batchAssignUsersToOU failed:', error);
    return { success: false, error: error.message || 'Lỗi không xác định.' };
  }
}

/**
 * Move a user between Organizational Units
 */
export async function moveUserBetweenOUs(userId: string, toOuId: string) {
  try {
    const currentUser = await requirePermission('users:manage');

    // Verify target OU exists
    const allOus = await OrganizationService.getOrganizationalUnits();
    const targetOu = allOus.find(ou => ou.id === toOuId);
    if (!targetOu) {
      return { success: false, error: 'Đơn vị tổ chức đích không tồn tại.' };
    }

    // Get current user info
    const targetUser = await getInternalUserById(userId);
    if (!targetUser) {
      return { success: false, error: 'Người dùng không tồn tại.' };
    }

    // Scope check for both source and destination
    if (currentUser.role !== ROLE_SUPER_ADMIN) {
      const adminOuId = (currentUser as any).ouId;
      if (adminOuId) {
        if (targetUser.ouId) {
          const fromScope = await OUScopeService.isOUInScope(adminOuId, targetUser.ouId);
          if (!fromScope) {
            return { success: false, error: 'Bạn không có quyền di chuyển người dùng từ OU ngoài phạm vi.' };
          }
        }
        const toScope = await OUScopeService.isOUInScope(adminOuId, toOuId);
        if (!toScope) {
          return { success: false, error: 'Bạn không có quyền di chuyển người dùng đến OU ngoài phạm vi.' };
        }
      }
    }

    const shortName = targetOu.name;
    await updateInternalUser(userId, { ouId: toOuId, department: shortName });

    await logSystemEvent('MOVE_USER_OU', 'INFO', `Moved user ${targetUser.name} to OU: ${shortName}`);
    revalidatePath('/admin/users');
    revalidatePath('/admin/organization');
    return { success: true };
  } catch (error: any) {
    console.error('[ASSIGN-OU] moveUserBetweenOUs failed:', error);
    return { success: false, error: error.message || 'Lỗi không xác định.' };
  }
}

/**
 * Get users by OU with scope checking
 */
export async function getUsersByOU(ouId: string) {
  try {
    const currentUser = await requirePermission('users:view_scoped');

    // Scope check
    if (currentUser.role !== ROLE_SUPER_ADMIN) {
      const userOuId = (currentUser as any).ouId;
      if (userOuId) {
        const inScope = await OUScopeService.isOUInScope(userOuId, ouId);
        if (!inScope) {
          return { success: false, error: 'Bạn không có quyền xem người dùng ngoài phạm vi OU.' };
        }
      }
    }

    const allUsers = await getInternalUsers();
    // Include users in this OU and all descendant OUs
    const ouIds = await OUScopeService.getOUWithDescendantIds(ouId);
    const filteredUsers = allUsers.filter((u: any) => u.ouId && ouIds.includes(u.ouId));

    return {
      success: true,
      users: filteredUsers.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        ouId: u.ouId,
        department: u.department,
      }))
    };
  } catch (error: any) {
    console.error('[ASSIGN-OU] getUsersByOU failed:', error);
    return { success: false, error: error.message || 'Lỗi không xác định.' };
  }
}

/**
 * Get scoped users for the current session user
 * Returns all users visible to the current user based on their OU scope
 */
export async function getScopedUsers() {
  try {
    const currentUser = await requireAuth();
    const allUsers = await getInternalUsers();

    // SUPER_ADMIN or users with global 'users:manage' → see all
    if (currentUser.role === ROLE_SUPER_ADMIN) {
      return allUsers.map((u: any) => ({ ...u, password: undefined }));
    }

    const userOuId = (currentUser as any).ouId;
    
    // If user has 'users:manage' (global) → see all
    if (currentUser.permissions?.includes('users:manage')) {
      return allUsers.map((u: any) => ({ ...u, password: undefined }));
    }

    // If user has 'users:view_scoped' or 'users:manage_scoped' → see OU scope
    if (
      currentUser.permissions?.includes('users:view_scoped') ||
      currentUser.permissions?.includes('users:manage_scoped')
    ) {
      if (!userOuId) {
        // No OU assigned → can only see themselves
        return allUsers.filter((u: any) => u.id === currentUser.id).map((u: any) => ({ ...u, password: undefined }));
      }
      const scopeOuIds = await OUScopeService.getOUWithDescendantIds(userOuId);
      return allUsers
        .filter((u: any) => u.ouId && scopeOuIds.includes(u.ouId))
        .map((u: any) => ({ ...u, password: undefined }));
    }

    // Default: user sees users in same OU (for Chuyên viên L3 etc.)
    if (userOuId) {
      return allUsers
        .filter((u: any) => u.ouId === userOuId)
        .map((u: any) => ({ ...u, password: undefined }));
    }

    // No OU, no scope permissions → only see self
    return allUsers.filter((u: any) => u.id === currentUser.id).map((u: any) => ({ ...u, password: undefined }));
  } catch (error: any) {
    console.error('[ASSIGN-OU] getScopedUsers failed:', error);
    return [];
  }
}
