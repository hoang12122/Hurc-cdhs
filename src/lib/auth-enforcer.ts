/**
 * CENTRALIZED AUTHENTICATION & AUTHORIZATION ENFORCER
 * Refactored to avoid higher-order function wrappers that confuse the Next.js Flight manifest generator.
 */

import { getSessionUser } from './services/auth-service';
import { hasPermission } from './auth';
import { redirect } from 'next/navigation';

import { cookies } from 'next/headers';

export class UnauthorizedError extends Error {
    constructor(message = "Unauthorized: Access denied") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

/**
 * Procedural check for authentication and permission.
 * Call this inside any Server Action or Server Component.
 */
export async function requirePermission(permission: string | null = null) {
    const user = await getSessionUser();
    
    if (!user) {
        const hasCookie = cookies().has("hurc_crm_session");
        if (hasCookie) {
            redirect("/login?reason=concurrent_session");
        } else {
            redirect("/login");
        }
    }

    if (permission) {
        const authorized = await hasPermission(permission);
        if (!authorized) {
            throw new UnauthorizedError(`Bạn không có quyền thực hiện: ${permission}`);
        }
    }
    
    return user;
}

/**
 * Basic login check.
 */
export async function requireAuth() {
    const user = await getSessionUser();
    if (!user) {
        const hasCookie = cookies().has("hurc_crm_session");
        if (hasCookie) {
            redirect("/login?reason=concurrent_session");
        } else {
            redirect("/login");
        }
    }
    return user;
}

/**
 * Scoped permission check: validates both permission AND OU hierarchy scope.
 * SUPER_ADMIN bypasses all scope checks.
 * If targetOuId is null/undefined, only the permission is checked (global scope).
 */
export async function requireScopedPermission(permission: string, targetOuId?: string | null) {
    const user = await requirePermission(permission);
    
    // SUPER_ADMIN bypasses scope check
    if (user.role === 'SUPER_ADMIN') {
        return user;
    }
    
    // If no target OU specified, no scope restriction needed
    if (!targetOuId) {
        return user;
    }
    
    // If user has no OU assigned, they cannot access scoped resources
    const userOuId = (user as any).ouId;
    if (!userOuId) {
        throw new UnauthorizedError('Bạn chưa được gán vào đơn vị tổ chức nào. Liên hệ Quản trị viên.');
    }
    
    // Dynamic import to avoid circular dependency
    const { OUScopeService } = await import('./services/ou-scope-service');
    const inScope = await OUScopeService.isOUInScope(userOuId, targetOuId);
    if (!inScope) {
        throw new UnauthorizedError('Bạn không có quyền truy cập tài nguyên ngoài phạm vi đơn vị tổ chức của bạn.');
    }
    
    return user;
}
