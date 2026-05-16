import fs from 'fs/promises';
import path from 'path';
import { hasEnoughSpace } from '../utils/disk-check';

/**
 * BACKUP SERVICE (HURC1 DB-HARDENING)
 * Manages rotating backups for db.json to prevent data loss.
 */

const BACKUP_DIR = path.join(process.cwd(), 'backups');
const MAX_BACKUPS = 5;

export async function ensureBackupDir() {
    try {
        await fs.mkdir(BACKUP_DIR, { recursive: true });
    } catch (e) {}
}

export async function createBackup(sourcePath: string) {
    await ensureBackupDir();
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = path.basename(sourcePath);
    const backupPath = path.join(BACKUP_DIR, `${filename}.${timestamp}.bak`);
    
    try {
        // CHECK DISK SPACE (Brutal Audit Fix)
        if (!await hasEnoughSpace(BACKUP_DIR)) {
            throw new Error("Insufficient disk space for backup.");
        }
        await fs.copyFile(sourcePath, backupPath);
        await rotateBackups(filename);
        return backupPath;
    } catch (error) {
        console.error("[BACKUP-SERVICE] Failed to create backup:", error);
        return null;
    }
}

async function rotateBackups(originalFilename: string) {
    try {
        const files = await fs.readdir(BACKUP_DIR);
        // Remove older backups exceeding limit (Brutal Audit Fix: Clean any .bak)
        const allBakFiles = files
            .filter(f => f.endsWith('.bak'))
            .map(f => ({ name: f, path: path.join(BACKUP_DIR, f), time: 0 }));
            
        for (const b of allBakFiles) {
            const stats = await fs.stat(b.path);
            b.time = stats.mtimeMs;
        }
        
        allBakFiles.sort((a, b) => b.time - a.time);
        
        if (allBakFiles.length > MAX_BACKUPS) {
            const toDelete = allBakFiles.slice(MAX_BACKUPS);
            for (const b of toDelete) {
                await fs.unlink(b.path);
            }
        }
    } catch (e) {
        console.error("[BACKUP-SERVICE] Rotation failed:", e);
    }
}
