/**
 * Public 2FA service facade.
 *
 * Implementation is split by responsibility to keep each TypeScript module
 * within the design boundary while preserving existing imports.
 */
export {
  generateSecret,
  generateTOTP,
  verifyTOTP,
} from './twofa/totp-engine';

export {
  getUser2FADevices,
  create2FADevice,
  confirm2FADevice,
  setDefault2FADevice,
  delete2FADevice,
} from './twofa/devices';

export {
  getUserBackupCodes,
  generateUserBackupCodes,
  verifyAndUseBackupCode,
} from './twofa/backup-codes';
