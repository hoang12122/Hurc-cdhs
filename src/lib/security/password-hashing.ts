import bcrypt from 'bcryptjs';

export const DEFAULT_BCRYPT_COST = 12;
export const MIN_BCRYPT_COST = 10;
export const MAX_BCRYPT_COST = 15;

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$(\d{2})\$/;

/**
 * Returns the configured bcrypt work factor.
 *
 * The bounded range prevents accidental weak settings and protects the
 * authentication service from an excessively expensive configuration.
 */
export function getPasswordHashCost(): number {
    const configuredCost = process.env.BCRYPT_COST?.trim();
    if (!configuredCost) return DEFAULT_BCRYPT_COST;

    const parsedCost = Number(configuredCost);
    if (
        !Number.isInteger(parsedCost) ||
        parsedCost < MIN_BCRYPT_COST ||
        parsedCost > MAX_BCRYPT_COST
    ) {
        throw new Error(
            `BCRYPT_COST must be an integer between ${MIN_BCRYPT_COST} and ${MAX_BCRYPT_COST}.`
        );
    }

    return parsedCost;
}

export function isBcryptHash(value: unknown): value is string {
    return typeof value === 'string' && BCRYPT_HASH_PATTERN.test(value);
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, getPasswordHashCost());
}

export async function verifyPassword(password: string, encodedHash: unknown): Promise<boolean> {
    if (!isBcryptHash(encodedHash)) return false;

    try {
        return await bcrypt.compare(password, encodedHash);
    } catch {
        // Treat malformed or unsupported hashes as invalid credentials.
        return false;
    }
}

/**
 * Existing hashes remain valid. A successful login can transparently replace
 * a lower-cost hash with the currently configured cost.
 */
export function passwordHashNeedsUpgrade(encodedHash: unknown): boolean {
    if (!isBcryptHash(encodedHash)) return false;

    const match = BCRYPT_HASH_PATTERN.exec(encodedHash);
    const currentCost = match ? Number(match[1]) : Number.NaN;
    return Number.isInteger(currentCost) && currentCost < getPasswordHashCost();
}
