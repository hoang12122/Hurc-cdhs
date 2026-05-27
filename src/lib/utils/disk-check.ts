/**
 * DISK UTILITY (HURC1 RELIABILITY)
 * Checks for available disk space before critical operations.
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Cache PSDrive check to prevent sequential PowerShell spawning overhead
let lastCheckTime = 0;
let lastCheckResult = true;

export async function hasEnoughSpace(dir: string, minMb: number = 100): Promise<boolean> {
    const now = Date.now();
    if (now - lastCheckTime < 60000) {
        return lastCheckResult;
    }

    try {
        // Lệnh check disk space trên Windows (PowerShell)
        const { stdout } = await execAsync(`powershell -Command "(Get-PSDrive -Name ${dir.split(':')[0]}).Free / 1MB"`);
        const freeMb = parseFloat(stdout.trim());
        lastCheckResult = freeMb > minMb;
        lastCheckTime = now;
        return lastCheckResult;
    } catch (e) {
        // Fallback: Nếu không check được, cho phép chạy nhưng log cảnh báo
        console.warn("[DISK-CHECK] Unable to determine free space, proceeding with caution.");
        return true;
    }
}

