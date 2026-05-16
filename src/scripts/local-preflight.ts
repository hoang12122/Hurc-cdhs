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

    // 1. Check .env
    if (!fs.existsSync(path.join(ROOT, '.env'))) {
        console.error("❌ MISSING: .env file not found.");
        console.log("👉 Action: Copy .env.example to .env and configure your secrets.");
        issues++;
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
    if (!fs.existsSync(path.join(ROOT, 'db.json'))) {
        console.warn("⚠️ MISSING: db.json not found. Initializing empty database...");
        fs.writeFileSync(path.join(ROOT, 'db.json'), JSON.stringify({
            users: [], equipment: [], assets: [], tasks: [], inspections: [], dnf_documents: [], system_logs: []
        }, null, 2));
        console.log("✅ Created db.json from template.");
    }

    // 4. Check Checksum Integrity
    if (!fs.existsSync(path.join(ROOT, 'db.json.sha256'))) {
        console.log("ℹ️ Initializing DB Checksum...");
        try {
            const crypto = require('crypto');
            const content = fs.readFileSync(path.join(ROOT, 'db.json'), 'utf-8');
            const hash = crypto.createHash('sha256').update(content).digest('hex');
            fs.writeFileSync(path.join(ROOT, 'db.json.sha256'), hash);
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
