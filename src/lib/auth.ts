
'use server';

import { getRoles } from "./actions/role.actions";
import { type Role, type User } from "./constants";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import { logSystemEvent } from "./actions/system.actions";

/**
 * Checks if the current user has a specific permission.
 * Admins (P.KTAT) always return true.
 * This is a SERVER ACTION - safe to call from client components.
 * @param permission - The permission string to check for.
 * @returns Promise<boolean> - True if the user has the permission, false otherwise.
 */
export const hasPermission = async (permission: string): Promise<boolean> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return false;
  if (currentUser.role === "Admin (P.KTAT)") {
    return true;
  }
  
  // Check user-level permissions first
  if (currentUser.permissions?.includes(permission)) {
    return true;
  }

  try {
    const roles = await getRoles();
    const userRoleData = roles.find(r => r.id === currentUser.role);

    if (!userRoleData || !userRoleData.permissions) {
      await logSystemEvent('PERMISSION_DENIED', 'WARNING', `User ${currentUser.name} (${currentUser.id}) denied access to permission '${permission}' due to missing role data.`);
      return false;
    }
    
    const hasPerm = userRoleData.permissions.includes(permission);
    if (!hasPerm) {
      await logSystemEvent('PERMISSION_DENIED', 'WARNING', `User ${currentUser.name} (${currentUser.id}) denied access to permission '${permission}'.`);
    }
    return hasPerm;
  } catch (error) {
    console.error("Error fetching roles for permission check:", error);
    return false; // Fail safely
  }
};
