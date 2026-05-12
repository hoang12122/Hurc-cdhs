'use server';

import { revalidatePath } from 'next/cache';
import { type Role } from '@/lib/constants';
import { internalLogSystemEvent as logSystemEvent } from '../services/log-service';
import { requirePermission, requireAuth } from '@/lib/auth-enforcer';
import { 
    getInternalRoles, 
    createInternalRole, 
    updateInternalRole, 
    deleteInternalRole 
} from '../services/user-service';

export async function getRoles(): Promise<Role[]> {
    await requireAuth();
    return await getInternalRoles() as any;
}

export async function addRole(role: Role): Promise<void> {
    await requirePermission('roles:manage');
    await createInternalRole(role);
    await logSystemEvent('CREATE_ROLE', 'INFO', `Created new role: ${role.name}`);
    revalidatePath('/admin/roles');
}

export async function updateRole(updatedRole: Role): Promise<void> {
    await requirePermission('roles:manage');
    await updateInternalRole(updatedRole.id, updatedRole);
    await logSystemEvent('UPDATE_ROLE', 'INFO', `Updated role: ${updatedRole.name}`);
    revalidatePath('/admin/roles');
}

export async function deleteRole(roleId: string): Promise<void> {
    await requirePermission('roles:manage');
    await deleteInternalRole(roleId);
    await logSystemEvent('DELETE_ROLE', 'WARNING', `Deleted role: ${roleId}`);
    revalidatePath('/admin/roles');
}
