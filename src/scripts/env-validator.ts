/**
 * ENVIRONMENTAL GUARD (HURC1 VALIDATION TOOL)
 * Scans codebase for process.env usage and verifies against .env file.
 */

import fs from 'fs/promises';
import path from 'path';

export async function validateEnvParity(projectRoot: string) {
    console.log("🔍 Running Environmental Guard...");
    
    // 1. Load actual .env manually to avoid dependency issues
    const envContent = await fs.readFile(path.join(projectRoot, '.env'), 'utf-8').catch(() => "");
    const configuredKeys = new Set<string>();
    envContent.split('\n').forEach(line => {
        const match = line.trim().match(/^([A-Z0-9_]+)=/);
        if (match) configuredKeys.add(match[1]);
    });
    
    // 2. Scan for usage
    const srcDir = path.join(projectRoot, 'src');
    const missingKeys: string[] = [];
    
    async function scanDir(dir: string) {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory() && entry.name !== 'node_modules') {
                await scanDir(fullPath);
            } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
                const content = await fs.readFile(fullPath, 'utf-8');
                const matches = content.matchAll(/process\.env\.([A-Z0-9_]+)/g);
                for (const match of matches) {
                    const key = match[1];
                    // Skip common node envs
                    if (['NODE_ENV', 'PORT'].includes(key)) continue;
                    if (!configuredKeys.has(key) && !process.env[key]) {
                        missingKeys.push(`${key} (Found in ${entry.name})`);
                    }
                }
            }
        }
    }
    
    await scanDir(srcDir);
    return [...new Set(missingKeys)];
}
