import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { authDb, IS_DATABASE_OFFLINE } from '../prisma';
import { jsonDb } from '../db/json-db';

/**
 * Node.js Crypto-based TOTP Engine (Google Authenticator Compatible)
 */

const BACKUP_CODE_HASH_ROUNDS = 12;

function decodeBase32(base32: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = base32.toUpperCase().replace(/=+$/, '');
  let bits = '';
  for (let i = 0; i < clean.length; i++) {
    const val = alphabet.indexOf(clean[i]);
    if (val === -1) throw new Error('Invalid base32 character');
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i < bits.length; i += 8) {
    if (i + 8 <= bits.length) {
      bytes.push(parseInt(bits.substring(i, i + 8), 2));
    }
  }
  return Buffer.from(bytes);
}

function normalizeBackupCode(code: string): string {
  return String(code || '').toUpperCase().trim();
}

async function hashBackupCode(code: string): Promise<string> {
  return bcrypt.hash(normalizeBackupCode(code), BACKUP_CODE_HASH_ROUNDS);
}

async function verifyBackupCodeHash(code: string, storedHash: string): Promise<boolean> {
  const normalizedCode = normalizeBackupCode(code);

  // Current secure format: bcrypt stores its algorithm and cost prefix in the hash.
  if (/^\$2[aby]\$/.test(storedHash)) {
    return bcrypt.compare(normalizedCode, storedHash);
  }

  // Backward compatibility only: accept legacy SHA-256 backup-code hashes so
  // existing issued codes can be consumed once, then replaced on regeneration.
  // New backup codes are never stored with fast general-purpose hashes.
  const legacySha256 = crypto.createHash('sha256').update(normalizedCode).digest('hex');
  return storedHash === legacySha256;
}

export function generateSecret(length = 32): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const randomBytes = crypto.randomBytes(length);
  let secret = '';
  for (let i = 0; i < length; i++) {
    secret += alphabet[randomBytes[i] % alphabet.length];
  }
  return secret;
}

export function generateTOTP(secret: string, counter: number): string {
  const key = decodeBase32(secret);
  const buffer = Buffer.alloc(8);
  let tempCounter = BigInt(counter);
  for (let i = 7; i >= 0; i--) {
    buffer[i] = Number(tempCounter & BigInt(0xff));
    tempCounter = tempCounter >> BigInt(8);
  }

  // TOTP/HOTP interoperability with authenticator apps uses HMAC-SHA1 by RFC 6238.
  // This is message authentication, not password hashing.
  const hmac = crypto.createHmac('sha1', key);
  hmac.update(buffer);
  const hmacResult = hmac.digest();

  const offset = hmacResult[hmacResult.length - 1] & 0xf;
  const code =
    ((hmacResult[offset] & 0x7f) << 24) |
    ((hmacResult[offset + 1] & 0xff) << 16) |
    ((hmacResult[offset + 2] & 0xff) << 8) |
    (hmacResult[offset + 3] & 0xff);

  const otp = code % 1000000;
  return otp.toString().padStart(6, '0');
}

export function verifyTOTP(secret: string, token: string, window = 1): boolean {
  const currentCounter = Math.floor(Date.now() / 1000 / 30);
  const cleanToken = token.replace(/\s+/g, '');
  
  for (let i = -window; i <= window; i++) {
    if (generateTOTP(secret, currentCounter + i) === cleanToken) {
      return true;
    }
  }
  return false;
}

/**
 * Service Layer Integrations for Dual DB Architecture (Postgres + Offline JSON-DB)
 */

export async function getUser2FADevices(userId: string) {
  if (!IS_DATABASE_OFFLINE) {
    try {
      return await authDb.twoFADevice.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
    } catch (e) {
      console.warn('[2FA-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }
  return await jsonDb.findMany<any>('two_fa_devices', (d: any) => d.userId === userId);
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
      return await authDb.twoFADevice.create({
        data: devicePayload
      });
    } catch (e) {
      console.warn('[2FA-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }
  return await jsonDb.insertRecord<any>('two_fa_devices', devicePayload);
}

export async function confirm2FADevice(deviceId: string) {
  if (!IS_DATABASE_OFFLINE) {
    try {
      // Find device
      const dev = await authDb.twoFADevice.findUnique({ where: { id: deviceId } });
      if (!dev) throw new Error('Device not found');
      
      // Update this device to confirmed
      const updated = await authDb.twoFADevice.update({
        where: { id: deviceId },
        data: { confirmed: true, isDefault: true }
      });

      // Clear default of other devices
      await authDb.twoFADevice.updateMany({
        where: { userId: dev.userId, id: { not: deviceId } },
        data: { isDefault: false }
      });

      // Update user 2FA state
      await authDb.user.update({
        where: { id: dev.userId },
        data: { twoFactorEnabled: true }
      });

      return updated;
    } catch (e) {
      console.warn('[2FA-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }

  const dev = await jsonDb.findFirst<any>('two_fa_devices', (d: any) => d.id === deviceId);
  if (!dev) throw new Error('Device not found');

  const updated = await jsonDb.updateRecord<any>('two_fa_devices', deviceId, { confirmed: true, isDefault: true });
  
  // Reset other defaults
  const otherDevices = await jsonDb.findMany<any>('two_fa_devices', (d: any) => d.userId === dev.userId && d.id !== deviceId);
  for (const od of otherDevices) {
    await jsonDb.updateRecord<any>('two_fa_devices', od.id, { isDefault: false });
  }

  // Update user
  await jsonDb.updateRecord<any>('users', dev.userId, { twoFactorEnabled: true });
  return updated;
}

export async function setDefault2FADevice(deviceId: string) {
  if (!IS_DATABASE_OFFLINE) {
    try {
      const dev = await authDb.twoFADevice.findUnique({ where: { id: deviceId } });
      if (!dev) throw new Error('Device not found');

      const updated = await authDb.twoFADevice.update({
        where: { id: deviceId },
        data: { isDefault: true }
      });

      await authDb.twoFADevice.updateMany({
        where: { userId: dev.userId, id: { not: deviceId } },
        data: { isDefault: false }
      });

      return updated;
    } catch (e) {
      console.warn('[2FA-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }

  const dev = await jsonDb.findFirst<any>('two_fa_devices', (d: any) => d.id === deviceId);
  if (!dev) throw new Error('Device not found');

  const updated = await jsonDb.updateRecord<any>('two_fa_devices', deviceId, { isDefault: true });
  
  const otherDevices = await jsonDb.findMany<any>('two_fa_devices', (d: any) => d.userId === dev.userId && d.id !== deviceId);
  for (const od of otherDevices) {
    await jsonDb.updateRecord<any>('two_fa_devices', od.id, { isDefault: false });
  }

  return updated;
}

export async function delete2FADevice(deviceId: string) {
  if (!IS_DATABASE_OFFLINE) {
    try {
      const dev = await authDb.twoFADevice.findUnique({ where: { id: deviceId } });
      if (!dev) throw new Error('Device not found');

      await authDb.twoFADevice.delete({ where: { id: deviceId } });

      // If no devices left, disable 2FA for user
      const count = await authDb.twoFADevice.count({ where: { userId: dev.userId } });
      if (count === 0) {
        await authDb.user.update({
          where: { id: dev.userId },
          data: { twoFactorEnabled: false }
        });
        // Cascading cleanup of dangling backup codes when disabling 2FA
        await authDb.backupCode.deleteMany({ where: { userId: dev.userId } });
      }
      return { success: true };
    } catch (e) {
      console.warn('[2FA-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }

  const dev = await jsonDb.findFirst<any>('two_fa_devices', (d: any) => d.id === deviceId);
  if (!dev) throw new Error('Device not found');

  await jsonDb.delete('two_fa_devices', (d: any) => d.id === deviceId);
  
  const remainDevices = await jsonDb.findMany<any>('two_fa_devices', (d: any) => d.userId === dev.userId);
  if (remainDevices.length === 0) {
    await jsonDb.updateRecord<any>('users', dev.userId, { twoFactorEnabled: false });
    // Cascading cleanup of dangling backup codes when disabling 2FA in jsonDb
    await jsonDb.delete('backup_codes', (b: any) => b.userId === dev.userId);
  }
  return { success: true };
}

/**
 * Backup Codes Management
 */

export async function getUserBackupCodes(userId: string) {
  if (!IS_DATABASE_OFFLINE) {
    try {
      return await authDb.backupCode.findMany({ where: { userId } });
    } catch (e) {
      console.warn('[2FA-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }
  return await jsonDb.findMany<any>('backup_codes', (b: any) => b.userId === userId);
}

export async function generateUserBackupCodes(userId: string): Promise<string[]> {
  const codes: string[] = [];
  const hashes: string[] = [];
  
  // Generate 8 codes of format XXXX-XXXX
  for (let i = 0; i < 8; i++) {
    const part1 = crypto.randomBytes(2).toString('hex').toUpperCase();
    const part2 = crypto.randomBytes(2).toString('hex').toUpperCase();
    const code = `${part1}-${part2}`;
    codes.push(code);
    hashes.push(await hashBackupCode(code));
  }

  if (!IS_DATABASE_OFFLINE) {
    try {
      // Invalidate old backup codes
      await authDb.backupCode.deleteMany({ where: { userId } });
      
      // Save new bcrypt hashes only. Bcrypt uses a per-hash salt and work factor.
      await authDb.backupCode.createMany({
        data: hashes.map(codeHash => ({ userId, codeHash }))
      });
      
      return codes;
    } catch (e) {
      console.warn('[2FA-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }

  // Fallback jsonDb
  await jsonDb.delete('backup_codes', (b: any) => b.userId === userId);
  for (const codeHash of hashes) {
    await jsonDb.insertRecord<any>('backup_codes', { userId, codeHash, used: false });
  }
  return codes;
}

export async function verifyAndUseBackupCode(userId: string, code: string): Promise<boolean> {
  const normalizedCode = normalizeBackupCode(code);
  if (!normalizedCode) return false;

  if (!IS_DATABASE_OFFLINE) {
    try {
      const candidates = await authDb.backupCode.findMany({
        where: { userId, used: false }
      });

      for (const candidate of candidates) {
        if (await verifyBackupCodeHash(normalizedCode, candidate.codeHash)) {
          await authDb.backupCode.update({
            where: { id: candidate.id },
            data: { used: true }
          });
          return true;
        }
      }
      return false;
    } catch (e) {
      console.warn('[2FA-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }

  const candidates = await jsonDb.findMany<any>('backup_codes', (b: any) => b.userId === userId && !b.used);
  for (const candidate of candidates) {
    if (await verifyBackupCodeHash(normalizedCode, candidate.codeHash)) {
      await jsonDb.updateRecord<any>('backup_codes', candidate.id, { used: true });
      return true;
    }
  }
  return false;
}
