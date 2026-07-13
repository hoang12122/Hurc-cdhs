import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { authDb, IS_DATABASE_OFFLINE } from '../../prisma';
import { jsonDb } from '../../db/json-db';

const BACKUP_CODE_HASH_ROUNDS = 12;

function normalizeBackupCode(code: string): string {
  return String(code || '').toUpperCase().trim();
}

async function hashBackupCode(code: string): Promise<string> {
  return bcrypt.hash(normalizeBackupCode(code), BACKUP_CODE_HASH_ROUNDS);
}

async function verifyBackupCodeHash(code: string, storedHash: string): Promise<boolean> {
  const normalizedCode = normalizeBackupCode(code);

  // Only bcrypt hashes are accepted. Legacy fast hashes must be rotated.
  if (!/^\$2[aby]\$/.test(storedHash)) return false;
  return bcrypt.compare(normalizedCode, storedHash);
}

export async function getUserBackupCodes(userId: string) {
  if (!IS_DATABASE_OFFLINE) {
    try {
      return await authDb.backupCode.findMany({ where: { userId } });
    } catch {
      console.warn('[2FA-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }
  return jsonDb.findMany<any>('backup_codes', (item: any) => item.userId === userId);
}

export async function generateUserBackupCodes(userId: string): Promise<string[]> {
  const codes: string[] = [];
  const hashes: string[] = [];

  for (let i = 0; i < 8; i++) {
    const first = crypto.randomBytes(2).toString('hex').toUpperCase();
    const second = crypto.randomBytes(2).toString('hex').toUpperCase();
    const code = `${first}-${second}`;
    codes.push(code);
    hashes.push(await hashBackupCode(code));
  }

  if (!IS_DATABASE_OFFLINE) {
    try {
      await authDb.backupCode.deleteMany({ where: { userId } });
      await authDb.backupCode.createMany({
        data: hashes.map((codeHash) => ({ userId, codeHash })),
      });
      return codes;
    } catch {
      console.warn('[2FA-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }

  await jsonDb.delete('backup_codes', (item: any) => item.userId === userId);
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
        where: { userId, used: false },
      });
      for (const candidate of candidates) {
        if (await verifyBackupCodeHash(normalizedCode, candidate.codeHash)) {
          await authDb.backupCode.update({
            where: { id: candidate.id },
            data: { used: true },
          });
          return true;
        }
      }
      return false;
    } catch {
      console.warn('[2FA-SERVICE] DB unreachable, fallback to jsonDb.');
    }
  }

  const candidates = await jsonDb.findMany<any>(
    'backup_codes',
    (item: any) => item.userId === userId && !item.used,
  );
  for (const candidate of candidates) {
    if (await verifyBackupCodeHash(normalizedCode, candidate.codeHash)) {
      await jsonDb.updateRecord<any>('backup_codes', candidate.id, { used: true });
      return true;
    }
  }
  return false;
}
