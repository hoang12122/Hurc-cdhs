/**
 * STALE LOCK DETECTOR (HURC1 RELIABILITY)
 * Prevents system startup failure due to leftover lock files after a crash.
 */

import fs from 'fs/promises';
import path from 'path';

const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export async function clearStaleLocks(dbPath: string) {
    const lockPath = `${dbPath}.lock`;
    try {
        const stats = await fs.stat(lockPath);
        const age = Date.now() - stats.mtimeMs;
        
        if (age > STALE_THRESHOLD_MS) {
            console.warn(`[JSON-DB] Stale lock file detected (Age: ${Math.round(age/1000)}s). Auto-clearing for recovery...`);
            await fs.unlink(lockPath);
        }
    } catch (e) {
        // Lock file doesn't exist, which is the normal state
    }
}
