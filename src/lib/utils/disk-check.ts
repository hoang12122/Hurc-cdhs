/**
 * DISK UTILITY (HURC1 RELIABILITY)
 * Checks for available disk space before critical operations without shell interpolation.
 */

import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

let lastCheckTime = 0;
let lastCheckResult = true;

function getSafeWindowsDriveName(dir: string): string | null {
    const match = dir.match(/^([A-Za-z]):/);
    return match ? match[1].toUpperCase() : null;
}

export async function hasEnoughSpace(dir: string, minMb: number = 100): Promise<boolean> {
    const now = Date.now();
    if (now - lastCheckTime < 60000) {
        return lastCheckResult;
    }

    try {
        if (process.platform !== 'win32') {
            console.warn('[DISK-CHECK] Disk check is currently implemented for Windows drives only.');
            return true;
        }

        const driveName = getSafeWindowsDriveName(dir);
        if (!driveName) {
            throw new Error('Invalid Windows drive path. Expected a path such as C:\\ or D:\\data.');
        }

        const { stdout } = await execFileAsync('powershell.exe', [
            '-NoProfile',
            '-NonInteractive',
            '-Command',
            `(Get-PSDrive -Name '${driveName}').Free / 1MB`,
        ]);

        const freeMb = Number.parseFloat(stdout.trim());
        if (!Number.isFinite(freeMb)) {
            throw new Error('Unable to parse free disk space.');
        }

        lastCheckResult = freeMb > minMb;
        lastCheckTime = now;
        return lastCheckResult;
    } catch (error) {
        console.warn('[DISK-CHECK] Unable to determine free space, proceeding with caution.');
        return true;
    }
}
