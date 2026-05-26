'use server';

import { revalidatePath } from 'next/cache';
import QRCode from 'qrcode';
import { requireAuth } from '@/lib/auth-enforcer';
import { internalLogSystemEvent as logSystemEvent } from '../services/log-service';
import { 
  generateSecret, 
  create2FADevice, 
  getUser2FADevices, 
  confirm2FADevice as confirmDeviceInService,
  setDefault2FADevice as setDefaultDeviceInService,
  delete2FADevice as deleteDeviceInService,
  verifyTOTP,
  generateUserBackupCodes,
  getUserBackupCodes
} from '../services/twofa-service';

/**
 * Get the current 2FA status, devices, and check if backup codes exist
 */
export async function getTwoFAStatus() {
  const currentUser = await requireAuth();
  
  const devices = await getUser2FADevices(currentUser.id);
  const backupCodes = await getUserBackupCodes(currentUser.id);

  // Return non-sensitive device info
  const safeDevices = devices.map(d => ({
    id: d.id,
    type: d.type,
    name: d.name,
    isDefault: d.isDefault,
    confirmed: d.confirmed,
    createdAt: d.createdAt,
  }));

  return {
    twoFactorEnabled: currentUser.twoFactorEnabled || false,
    devices: safeDevices,
    hasBackupCodes: backupCodes.length > 0,
  };
}

/**
 * Generate a new draft 2FA device (TOTP)
 */
export async function setupNew2FADevice(name: string) {
  const currentUser = await requireAuth();
  const secret = generateSecret();

  const label = `HURC_CDHS:${currentUser.email}`;
  const issuer = 'HURC_CDHS';
  const otpauthUrl = `otpauth://totp/${encodeURIComponent(label)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;

  // Generate QR Code data URL (PNG)
  const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

  // Store in database as UNCONFIRMED
  const device = await create2FADevice(currentUser.id, name, secret);

  await logSystemEvent('2FA_INIT', 'INFO', `User ${currentUser.email} initiated 2FA setup for device ${name}`);

  return {
    deviceId: device.id,
    secret,
    qrCodeUrl,
  };
}

/**
 * Confirm a draft 2FA device using dynamic 6-digit TOTP validation
 */
export async function confirmTwoFADevice(deviceId: string, code: string) {
  const currentUser = await requireAuth();
  
  // Find device first to get secret
  const devices = await getUser2FADevices(currentUser.id);
  const device = devices.find(d => d.id === deviceId);
  
  if (!device) {
    throw new Error('Không tìm thấy thiết bị xác thực.');
  }

  // Verify TOTP token
  const isValid = verifyTOTP(device.secret, code);
  if (!isValid) {
    throw new Error('Mã xác nhận 2FA không chính xác hoặc đã hết hạn.');
  }

  // Confirm device in DB and enable user 2FA
  await confirmDeviceInService(deviceId);

  await logSystemEvent('2FA_CONFIRM', 'INFO', `User ${currentUser.email} verified and enabled 2FA for device ${device.name}`);
  revalidatePath('/profile');
  
  return { success: true };
}

/**
 * Set a device as default for 2FA
 */
export async function makeDeviceDefault(deviceId: string) {
  const currentUser = await requireAuth();
  
  const devices = await getUser2FADevices(currentUser.id);
  const device = devices.find(d => d.id === deviceId);
  
  if (!device) {
    throw new Error('Không tìm thấy thiết bị xác thực.');
  }

  await setDefaultDeviceInService(deviceId);
  
  await logSystemEvent('2FA_DEFAULT_CHANGE', 'INFO', `User ${currentUser.email} changed default 2FA device to ${device.name}`);
  revalidatePath('/profile');
  
  return { success: true };
}

/**
 * Delete / Revoke a 2FA device
 */
export async function revoke2FADevice(deviceId: string) {
  const currentUser = await requireAuth();

  const devices = await getUser2FADevices(currentUser.id);
  const device = devices.find(d => d.id === deviceId);
  
  if (!device) {
    throw new Error('Không tìm thấy thiết bị xác thực.');
  }

  await deleteDeviceInService(deviceId);

  await logSystemEvent('2FA_REVOKE', 'WARNING', `User ${currentUser.email} revoked 2FA device ${device.name}`);
  revalidatePath('/profile');
  
  return { success: true };
}

/**
 * Create/Recreate backup codes
 */
export async function createBackupCodes() {
  const currentUser = await requireAuth();

  // Create codes
  const rawCodes = await generateUserBackupCodes(currentUser.id);

  await logSystemEvent('2FA_BACKUP_CODES_GEN', 'WARNING', `User ${currentUser.email} generated new backup codes`);
  revalidatePath('/profile');

  return rawCodes;
}
