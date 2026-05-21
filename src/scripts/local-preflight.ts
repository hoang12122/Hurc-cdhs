/**
 * HURC1 LOCAL PRE-FLIGHT CHECK (Absolute Stability)
 * Verifies the environment before starting 'npm run dev'.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();

async function runCheck() {
    console.log("🚀 HURC1: Running Local Pre-flight Safety Check...");
    let issues = 0;
    const combinedEnv: Record<string, string | undefined> = { ...process.env };

    // 1. Check .env
    const envPath = path.join(ROOT, '.env');
    if (!fs.existsSync(envPath)) {
        console.error("❌ MISSING: .env file not found.");
        console.log("👉 Action: Copy .env.example to .env and configure your secrets.");
        issues++;
    } else {
        // Parse env file
        const envVars: Record<string, string> = {};
        const envContent = fs.readFileSync(envPath, 'utf-8');
        envContent.split(/\r?\n/).forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const index = trimmed.indexOf('=');
                if (index !== -1) {
                    const key = trimmed.substring(0, index).trim();
                    const val = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
                    envVars[key] = val;
                }
            }
        });

        // Merge into combinedEnv
        Object.assign(combinedEnv, envVars);

        const CRITICAL_VARS = [
            'AUTH_DATABASE_URL',
            'AI_DATABASE_URL',
            'METRO_DATABASE_URL',
            'OPS_DATABASE_URL',
            'SESSION_SECRET',
            'NEXT_PUBLIC_SETUP_COMPLETE'
        ];

        console.log("🔎 Verifying Critical Environment Variables...");
        for (const v of CRITICAL_VARS) {
            if (!combinedEnv[v]) {
                console.error(`❌ MISSING ENV VAR: '${v}' is not defined or is empty in .env.`);
                issues++;
            }
        }
    }

    // 2. Check Prisma Runtimes
    const prismaPaths = ['.prisma-runtime/auth', '.prisma-runtime/ai', '.prisma-runtime/metro', '.prisma-runtime/ops'];
    for (const p of prismaPaths) {
        if (!fs.existsSync(path.join(ROOT, p))) {
            console.warn(`⚠️ MISSING: Prisma runtime at ${p}.`);
            console.log("👉 Action: Run 'npx prisma generate' for all schemas.");
            issues++;
            break; 
        }
    }

    // 3. Check JSON DB
    const dbFileName = combinedEnv['DATABASE_JSON_PATH'] || 'db.json';
    const dbPath = path.isAbsolute(dbFileName) ? dbFileName : path.join(ROOT, dbFileName);
    const dbDir = path.dirname(dbPath);

    // Ensure parent directory exists
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    if (!fs.existsSync(dbPath)) {
        // If there's a db.json in ROOT, copy it
        const rootDbPath = path.join(ROOT, 'db.json');
        if (fs.existsSync(rootDbPath) && rootDbPath !== dbPath) {
            console.warn(`⚠️ COPYING: Copying existing db.json from root to ${dbFileName}...`);
            fs.copyFileSync(rootDbPath, dbPath);
        } else {
            console.warn(`⚠️ MISSING: db.json not found at ${dbFileName}. Initializing empty database...`);
            fs.writeFileSync(dbPath, JSON.stringify({
                users: [], equipment: [], assets: [], tasks: [], inspections: [], dnf_documents: [], system_logs: []
            }, null, 2));
            console.log(`✅ Created ${dbFileName} from template.`);
        }
    }

    // 4. Check Checksum Integrity
    const checksumPath = `${dbPath}.sha256`;
    if (!fs.existsSync(checksumPath)) {
        console.log(`ℹ️ Initializing DB Checksum for ${dbFileName}...`);
        try {
            const crypto = require('crypto');
            const content = fs.readFileSync(dbPath, 'utf-8');
            const hash = crypto.createHash('sha256').update(content).digest('hex');
            fs.writeFileSync(checksumPath, hash);
        } catch (e) {}
    }

    if (issues > 0) {
        console.error(`\n❌ Found ${issues} blocking issues. Please fix them before running dev server.`);
        process.exit(1);
    }

    console.log("✅ Local environment is ROCK SOLID. Starting dev server...\n");
}

runCheck().catch(err => {
    console.error("❌ Pre-flight check failed:", err);
    process.exit(1);
});
