/**
 * CENTRALIZED AUTHENTICATION & AUTHORIZATION ENFORCER
 * Refactored to avoid higher-order function wrappers that confuse the Next.js Flight manifest generator.
 */

import { getSessionUser } from './services/auth-service';
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
        const cookieStore = await cookies();
        const hasCookie = cookieStore.has("hurc_crm_session");
        if (hasCookie) {
            redirect("/login?reason=concurrent_session");
        } else {
            redirect("/login");
        }
    }

    if (
        permission
        && user.role !== 'SUPER_ADMIN'
        && !user.permissions?.includes(permission)
    ) {
        throw new UnauthorizedError(`Bạn không có quyền thực hiện: ${permission}`);
    }

    return user;
}

/**
 * Basic login check.
 */
export async function requireAuth() {
    const user = await getSessionUser();
    if (!user) {
        const cookieStore = await cookies();
        const hasCookie = cookieStore.has("hurc_crm_session");
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

    if (user.role === 'SUPER_ADMIN') {
        return user;
    }

    if (!targetOuId) {
        return user;
    }

    const userOuId = (user as typeof user & { ouId?: string | null }).ouId;
    if (!userOuId) {
        throw new UnauthorizedError('Bạn chưa được gán vào đơn vị tổ chức nào. Liên hệ Quản trị viên.');
    }

    const { OUScopeService } = await import('./services/ou-scope-service');
    const inScope = await OUScopeService.isOUInScope(userOuId, targetOuId);
    if (!inScope) {
        throw new UnauthorizedError('Bạn không có quyền truy cập tài nguyên ngoài phạm vi đơn vị tổ chức của bạn.');
    }

    return user;
}
