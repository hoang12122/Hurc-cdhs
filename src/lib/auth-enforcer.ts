/**
 * CENTRALIZED AUTHENTICATION & AUTHORIZATION ENFORCER
 * This utility ensures that Server Actions are only executed by authorized users.
 */

import { getCurrentUser } from './actions/auth.actions';
import { hasPermission } from './auth';

/**
 * Standard Error for Unauthorized Access
 */
export class UnauthorizedError extends Error {
    constructor(message = "Unauthorized: Access denied") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

/**
 * Higher-order function to wrap server actions with security checks.
 * Logs out unauthenticated users automatically (at browser level via throw).
 * 
 * @param permission Optional permission required for this action.
 * @param action The function to execute if authorized.
 */
export async function protectedAction<T>(
    permission: string | null,
    action: (user: any) => Promise<T>
): Promise<T> {
    const user = await getCurrentUser();
    
    if (!user) {
        throw new UnauthorizedError("Vui lòng đăng nhập để thực hiện tác vụ này.");
    }

    if (permission) {
        const authorized = await hasPermission(permission);
        if (!authorized) {
            throw new UnauthorizedError(`Bạn không có quyền thực hiện: ${permission}`);
        }
    }

    // Execute the actual work
    return await action(user);
}

/**
 * Helper specifically for read-only actions that might not need granular permissions
 * but still require a valid login.
 */
export async function authenticatedAction<T>(
    action: (user: any) => Promise<T>
): Promise<T> {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();
    return await action(user);
}
