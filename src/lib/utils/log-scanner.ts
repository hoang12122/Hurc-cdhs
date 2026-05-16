/**
 * LOG FORENSIC ANALYZER (HURC1 VALIDATION TOOL)
 * Scans local log files for critical errors or fatal warnings.
 */

import fs from 'fs/promises';
import path from 'path';

export async function scanLogsForErrors(logDir: string) {
    console.log("🕵️ Running Log Forensic Analyzer...");
    const criticalErrors: string[] = [];
    
    try {
        await fs.access(logDir);
        const files = await fs.readdir(logDir);
        
        for (const file of files) {
            if (file.endsWith('.log') || file.endsWith('.txt')) {
                const content = await fs.readFile(path.join(logDir, file), 'utf-8');
                const lines = content.split('\n');
                
                lines.forEach((line, index) => {
                    if (line.includes('ERROR') || line.includes('FATAL') || line.includes('Exception')) {
                        criticalErrors.push(`[${file}:${index + 1}] ${line.trim()}`);
                    }
                });
            }
        }
    } catch (e) {
        // Log dir might not exist yet if fresh deploy, which is fine
        return [];
    }
    
    return criticalErrors;
}
