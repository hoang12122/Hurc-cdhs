import { jsonDb } from '../../db/json-db';
import { authDb, IS_DATABASE_OFFLINE } from '../../prisma';

export async function getInternalRoles() {
  if (!IS_DATABASE_OFFLINE) {
    try {
      const roles = await authDb.role.findMany();
      if (roles.length > 0) return roles;
    } catch {
      console.warn('[USER-SERVICE] DB unreachable during getInternalRoles, checking local store.');
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
      console.error('[USER-SERVICE] PostgreSQL create role failed:', error);
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
      console.error('[USER-SERVICE] PostgreSQL update role failed:', error);
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
      console.error('[USER-SERVICE] PostgreSQL delete role failed:', error);
      throw error;
    }
  }
  await jsonDb.delete('roles', (role: any) => role.id === id);
}
