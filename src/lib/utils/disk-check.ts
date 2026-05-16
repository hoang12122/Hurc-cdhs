/**
 * DISK UTILITY (HURC1 RELIABILITY)
 * Checks for available disk space before critical operations.
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function hasEnoughSpace(dir: string, minMb: number = 100): Promise<boolean> {
    try {
        // Lệnh check disk space trên Windows (PowerShell)
        const { stdout } = await execAsync(`powershell -Command "(Get-PSDrive -Name ${dir.split(':')[0]}).Free / 1MB"`);
        const freeMb = parseFloat(stdout.trim());
        return freeMb > minMb;
    } catch (e) {
        // Fallback: Nếu không check được, cho phép chạy nhưng log cảnh báo
        console.warn("[DISK-CHECK] Unable to determine free space, proceeding with caution.");
        return true;
    }
}
