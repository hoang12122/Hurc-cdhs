import { authDb, IS_DATABASE_OFFLINE } from '../prisma';
import { jsonDb } from '../db/json-db';

export async function getInternalPasswordResetRequests() {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await authDb.passwordResetRequest.findMany({ where: { status: 'pending' } });
        } catch (e) {}
    }

    const all = await jsonDb.getCollection<any>('password_reset_requests');
    return all.filter((request: any) => request.status === 'pending');
}

export async function createInternalPasswordResetRequest(
    userId: string,
    email: string,
    name: string,
) {
    const record = {
        id: `pwr-${Date.now()}`,
        userId,
        userEmail: email,
        userName: name,
        status: 'pending',
        createdAt: new Date().toISOString(),
    };

    if (!IS_DATABASE_OFFLINE) {
        try {
            await authDb.passwordResetRequest.create({
                data: {
                    ...record,
                    createdAt: new Date(record.createdAt),
                },
            });
            return;
        } catch (error) {
            console.error('[USER-ACCESS] PostgreSQL create password reset request failed:', error);
            throw error;
        }
    }

    await jsonDb.insertRecord<any>('password_reset_requests', record);
}

export async function updateInternalPasswordResetRequest(id: string, status: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            await authDb.passwordResetRequest.update({
                where: { id },
                data: { status },
            });
            return;
        } catch (error) {
            console.error('[USER-ACCESS] PostgreSQL update password reset request failed:', error);
            throw error;
        }
    }

    await jsonDb.updateRecord<any>('password_reset_requests', id, { status });
}

export async function getInternalRoles() {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const roles = await authDb.role.findMany();
            if (roles.length > 0) return roles;
        } catch (error) {
            console.warn('[USER-ACCESS] DB unreachable during getInternalRoles, checking local store.');
        }
    }

    return jsonDb.getCollection<any>('roles');
}

export async function createInternalRole(data: any) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            await authDb.role.create({ data });
            return;
        } catch (error) {
            console.error('[USER-ACCESS] PostgreSQL create role failed:', error);
            throw error;
        }
    }

    await jsonDb.insertRecord<any>('roles', data);
}

export async function updateInternalRole(id: string, data: any) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            await authDb.role.update({ where: { id }, data });
            return;
        } catch (error) {
            console.error('[USER-ACCESS] PostgreSQL update role failed:', error);
            throw error;
        }
    }

    await jsonDb.updateRecord<any>('roles', id, data);
}

export async function deleteInternalRole(id: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            await authDb.role.delete({ where: { id } });
            return;
        } catch (error) {
            console.error('[USER-ACCESS] PostgreSQL delete role failed:', error);
            throw error;
        }
    }

    await jsonDb.delete('roles', (role: any) => role.id === id);
}
