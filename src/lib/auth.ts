'use server';

import { getSessionUser, checkPermission } from "./services/auth-service";

/**
 * Checks if the current user has a specific permission.
 * Admins (P.KTAT) always return true.
 * This is a SERVER ACTION - safe to call from client components.
 */
export async function hasPermission(permission: string): Promise<boolean> {
  return await checkPermission(permission);
}

/**
 * Helper to get the current user profile (Server Action)
 */
export async function getCurrentUser() {
  return await getSessionUser();
}
