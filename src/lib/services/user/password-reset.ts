import { jsonDb } from '../../db/json-db';
import { authDb, IS_DATABASE_OFFLINE } from '../../prisma';

export async function getInternalPasswordResetRequests() {
  if (!IS_DATABASE_OFFLINE) {
    try {
      return await authDb.passwordResetRequest.findMany({ where: { status: 'pending' } });
    } catch {
      // Fall through to the offline store.
    }
  }

  const requests = await jsonDb.getCollection<any>('password_reset_requests');
  return requests.filter((request: any) => request.status === 'pending');
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
      console.error('[USER-SERVICE] PostgreSQL create password reset request failed:', error);
      throw error;
    }
  }

  await jsonDb.insertRecord<any>('password_reset_requests', record);
}

export async function updateInternalPasswordResetRequest(id: string, status: string) {
  if (!IS_DATABASE_OFFLINE) {
    try {
      await authDb.passwordResetRequest.update({ where: { id }, data: { status } });
      return;
    } catch (error) {
      console.error('[USER-SERVICE] PostgreSQL update password reset request failed:', error);
      throw error;
    }
  }

  await jsonDb.updateRecord<any>('password_reset_requests', id, { status });
}
