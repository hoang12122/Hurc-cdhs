import { authDb, IS_DATABASE_OFFLINE } from '../../prisma';
import { jsonDb } from '../../db/json-db';

/**
 * Two-factor authentication device persistence for PostgreSQL and offline JSON DB.
 */
export async function getUser2FADevices(userId: string) {
  if (!IS_DATABASE_OFFLINE) {
    try {
      return await authDb.twoFADevice.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      console.warn('[2FA-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }
  return jsonDb.findMany<any>('two_fa_devices', (device: any) => device.userId === userId);
}

export async function create2FADevice(userId: string, name: string, secret: string) {
  const devicePayload = {
    userId,
    type: 'totp',
    name,
    secret,
    isDefault: false,
    confirmed: false,
  };

  if (!IS_DATABASE_OFFLINE) {
    try {
      return await authDb.twoFADevice.create({ data: devicePayload });
    } catch {
      console.warn('[2FA-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }
  return jsonDb.insertRecord<any>('two_fa_devices', devicePayload);
}

export async function confirm2FADevice(deviceId: string) {
  if (!IS_DATABASE_OFFLINE) {
    try {
      const device = await authDb.twoFADevice.findUnique({ where: { id: deviceId } });
      if (!device) throw new Error('Device not found');

      const updated = await authDb.twoFADevice.update({
        where: { id: deviceId },
        data: { confirmed: true, isDefault: true },
      });
      await authDb.twoFADevice.updateMany({
        where: { userId: device.userId, id: { not: deviceId } },
        data: { isDefault: false },
      });
      await authDb.user.update({
        where: { id: device.userId },
        data: { twoFactorEnabled: true },
      });
      return updated;
    } catch {
      console.warn('[2FA-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }

  const device = await jsonDb.findFirst<any>('two_fa_devices', (item: any) => item.id === deviceId);
  if (!device) throw new Error('Device not found');

  const updated = await jsonDb.updateRecord<any>('two_fa_devices', deviceId, {
    confirmed: true,
    isDefault: true,
  });
  const otherDevices = await jsonDb.findMany<any>(
    'two_fa_devices',
    (item: any) => item.userId === device.userId && item.id !== deviceId,
  );
  for (const otherDevice of otherDevices) {
    await jsonDb.updateRecord<any>('two_fa_devices', otherDevice.id, { isDefault: false });
  }
  await jsonDb.updateRecord<any>('users', device.userId, { twoFactorEnabled: true });
  return updated;
}

export async function setDefault2FADevice(deviceId: string) {
  if (!IS_DATABASE_OFFLINE) {
    try {
      const device = await authDb.twoFADevice.findUnique({ where: { id: deviceId } });
      if (!device) throw new Error('Device not found');

      const updated = await authDb.twoFADevice.update({
        where: { id: deviceId },
        data: { isDefault: true },
      });
      await authDb.twoFADevice.updateMany({
        where: { userId: device.userId, id: { not: deviceId } },
        data: { isDefault: false },
      });
      return updated;
    } catch {
      console.warn('[2FA-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }

  const device = await jsonDb.findFirst<any>('two_fa_devices', (item: any) => item.id === deviceId);
  if (!device) throw new Error('Device not found');

  const updated = await jsonDb.updateRecord<any>('two_fa_devices', deviceId, { isDefault: true });
  const otherDevices = await jsonDb.findMany<any>(
    'two_fa_devices',
    (item: any) => item.userId === device.userId && item.id !== deviceId,
  );
  for (const otherDevice of otherDevices) {
    await jsonDb.updateRecord<any>('two_fa_devices', otherDevice.id, { isDefault: false });
  }
  return updated;
}

export async function delete2FADevice(deviceId: string) {
  if (!IS_DATABASE_OFFLINE) {
    try {
      const device = await authDb.twoFADevice.findUnique({ where: { id: deviceId } });
      if (!device) throw new Error('Device not found');

      await authDb.twoFADevice.delete({ where: { id: deviceId } });
      const remaining = await authDb.twoFADevice.count({ where: { userId: device.userId } });
      if (remaining === 0) {
        await authDb.user.update({
          where: { id: device.userId },
          data: { twoFactorEnabled: false },
        });
        await authDb.backupCode.deleteMany({ where: { userId: device.userId } });
      }
      return { success: true };
    } catch {
      console.warn('[2FA-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }

  const device = await jsonDb.findFirst<any>('two_fa_devices', (item: any) => item.id === deviceId);
  if (!device) throw new Error('Device not found');

  await jsonDb.delete('two_fa_devices', (item: any) => item.id === deviceId);
  const remaining = await jsonDb.findMany<any>(
    'two_fa_devices',
    (item: any) => item.userId === device.userId,
  );
  if (remaining.length === 0) {
    await jsonDb.updateRecord<any>('users', device.userId, { twoFactorEnabled: false });
    await jsonDb.delete('backup_codes', (item: any) => item.userId === device.userId);
  }
  return { success: true };
}
