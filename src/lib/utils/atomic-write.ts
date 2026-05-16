/**
 * ATOMIC WRITE UTILITY (HURC1 RELIABILITY)
 * Ensures database files are never corrupted by partial writes or crashes.
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function atomicWrite(filePath: string, content: string) {
    // 1. Zero-Byte Guard (Brutal Audit Fix)
    if (!content || content.trim() === "" || content === "{}" || content === "[]") {
        throw new Error("[ATOMIC-WRITE] Refusing to write empty or invalid data.");
    }

    const tempPath = `${filePath}.tmp`;
    let fileHandle;
    try {
        // 2. Write to temporary file first
        await fs.writeFile(tempPath, content, 'utf-8');
        
        // 3. Force sync to disk (ensure data is physically written)
        fileHandle = await fs.open(tempPath, 'r+');
        await fileHandle.sync();

        // 4. Atomic rename
        await fs.rename(tempPath, filePath);

        // 5. Generate Checksum (Brutal Audit Fix: Bit Rot Protection)
        const checksum = crypto.createHash('sha256').update(content).digest('hex');
        await fs.writeFile(`${filePath}.sha256`, checksum, 'utf-8');
    } catch (e) {
        // Cleanup temp file on failure
        await fs.unlink(tempPath).catch(() => {});
        throw e;
    } finally {
        if (fileHandle) await fileHandle.close();
    }
}
