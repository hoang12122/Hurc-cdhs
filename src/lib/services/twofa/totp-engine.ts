import crypto from 'crypto';

/**
 * Node.js Crypto-based TOTP engine compatible with common authenticator apps.
 */
function decodeBase32(base32: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = base32.toUpperCase().replace(/=+$/, '');
  let bits = '';

  for (let i = 0; i < clean.length; i++) {
    const value = alphabet.indexOf(clean[i]);
    if (value === -1) throw new Error('Invalid base32 character');
    bits += value.toString(2).padStart(5, '0');
  }

  const bytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    if (i + 8 <= bits.length) {
      bytes.push(Number.parseInt(bits.substring(i, i + 8), 2));
    }
  }
  return Buffer.from(bytes);
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
  let temporaryCounter = BigInt(counter);

  for (let i = 7; i >= 0; i--) {
    buffer[i] = Number(temporaryCounter & BigInt(0xff));
    temporaryCounter >>= BigInt(8);
  }

  // RFC 6238 authenticator interoperability uses HMAC-SHA1.
  const hmac = crypto.createHmac('sha1', key);
  hmac.update(buffer);
  const result = hmac.digest();
  const offset = result[result.length - 1] & 0xf;
  const code =
    ((result[offset] & 0x7f) << 24) |
    ((result[offset + 1] & 0xff) << 16) |
    ((result[offset + 2] & 0xff) << 8) |
    (result[offset + 3] & 0xff);

  return (code % 1_000_000).toString().padStart(6, '0');
}

export function verifyTOTP(secret: string, token: string, window = 1): boolean {
  const currentCounter = Math.floor(Date.now() / 1000 / 30);
  const cleanToken = token.replace(/\s+/g, '');

  for (let offset = -window; offset <= window; offset++) {
    if (generateTOTP(secret, currentCounter + offset) === cleanToken) {
      return true;
    }
  }
  return false;
}
