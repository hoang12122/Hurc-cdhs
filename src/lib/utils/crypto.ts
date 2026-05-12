import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

/**
 * Crypto Utility for Encryption at Rest (Task 7.2)
 */
export class CryptoUtility {
  private static getEncryptionKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY;
    if (!key || key.length < 32) {
      // For development only, in production this must be set in .env
      return Buffer.from('default_secure_key_32_chars_long_!!'.substring(0, 32));
    }
    return Buffer.from(key, 'hex');
  }

  /**
   * Encrypts a string into ciphertext:iv:authTag
   */
  static encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, this.getEncryptionKey(), iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${encrypted}:${iv.toString('hex')}:${authTag}`;
  }

  /**
   * Decrypts ciphertext:iv:authTag back to plain text
   */
  static decrypt(combined: string): string {
    try {
      const [encrypted, ivHex, authTagHex] = combined.split(':');
      if (!encrypted || !ivHex || !authTagHex) return combined; // Not encrypted or invalid format

      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const decipher = crypto.createDecipheriv(ALGORITHM, this.getEncryptionKey(), iv);
      
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (e) {
      console.warn('[Crypto] Decryption failed, returning original string');
      return combined;
    }
  }

  /**
   * Checks if a string looks like our encrypted format
   */
  static isEncrypted(text: string): boolean {
    return text.includes(':') && text.split(':').length === 3;
  }
}
