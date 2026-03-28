'use server';

import { revalidatePath } from 'next/cache';
import { type Role } from '@/lib/constants';
import { logSystemEvent } from './system.actions';
import { hasPermission } from '../auth';
import { authDb } from '@/lib/prisma';

export async function getRoles(): Promise<Role[]> {
    const roles = await authDb.role.findMany();
    return roles as Role[];
}

export async function addRole(role: Role): Promise<void> {
    if (!await hasPermission('roles:manage')) {
        throw new Error("Permission denied: You do not have permission to add roles.");
    }
    
    await authDb.role.create({
        data: {
            id: role.id,
            name: role.name,
            description: role.description,
            permissions: role.permissions || []
        }
    });
    
    await logSystemEvent('CREATE_ROLE', 'INFO', `Created new role: ${role.name}`);
    revalidatePath('/admin/roles');
}

export async function updateRole(updatedRole: Role): Promise<void> {
    if (!await hasPermission('roles:manage')) {
        throw new Error("Permission denied: You do not have permission to update roles.");
    }

    await authDb.role.update({
        where: { id: updatedRole.id },
        data: {
            name: updatedRole.name,
            description: updatedRole.description,
            permissions: updatedRole.permissions || []
        }
    });

    await logSystemEvent('UPDATE_ROLE', 'INFO', `Updated role: ${updatedRole.name}`);
    revalidatePath('/admin/roles');
}

export async function deleteRole(roleId: string): Promise<void> {
     if (!await hasPermission('roles:manage')) {
        throw new Error("Permission denied: You do not have permission to delete roles.");
    }
    
    const roleToDelete = await authDb.role.findUnique({ where: { id: roleId } });
    
    if (roleToDelete) {
        await authDb.role.delete({ where: { id: roleId } });
        await logSystemEvent('DELETE_ROLE', 'WARNING', `Deleted role: ${roleToDelete.name}`);
    }
    
    revalidatePath('/admin/roles');
}
