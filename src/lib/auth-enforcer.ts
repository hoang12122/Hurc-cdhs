/**
 * CENTRALIZED AUTHENTICATION & AUTHORIZATION ENFORCER
 * Refactored to avoid higher-order function wrappers that confuse the Next.js Flight manifest generator.
 */

import { getSessionUser } from './services/auth-service';
import { hasPermission } from './auth';
import { redirect } from 'next/navigation';

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
        redirect("/login");
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
        redirect("/login");
    }
    return user;
}
