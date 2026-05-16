/**
 * HURC1 CONTAINER INITIALIZATION (Zero-Failure Deploy)
 * Handles DB migrations and connectivity checks inside the container.
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function init() {
    console.log("🚀 HURC1: Container Initialization started...");
    
    const isOffline = process.env.IS_DATABASE_OFFLINE === 'true';
    
    if (isOffline) {
        console.log("📦 Mode: OFFLINE. Skipping Prisma migrations.");
        const dbPath = process.env.DATABASE_JSON_PATH || '/app/data/offline/db.json';
        const dbDir = path.dirname(dbPath);
        
        if (!fs.existsSync(dbDir)) {
            console.log(`Creating directory ${dbDir}...`);
            fs.mkdirSync(dbDir, { recursive: true });
        }
        
        if (!fs.existsSync(dbPath)) {
            console.log("Initializing empty db.json...");
            fs.writeFileSync(dbPath, JSON.stringify({
                users: [], equipment: [], assets: [], tasks: [], inspections: [], dnf_documents: [], system_logs: []
            }));
        }
    } else {
        console.log("🌐 Mode: ONLINE. Running Prisma migrations...");
        const schemas = ['auth', 'ai', 'metro', 'ops'];
        const MAX_RETRIES = 10;
        const RETRY_DELAY = 5000;

        for (const s of schemas) {
            let success = false;
            let attempts = 0;

            while (!success && attempts < MAX_RETRIES) {
                attempts++;
                console.log(`Migrating schema: ${s} (Attempt ${attempts}/${MAX_RETRIES})...`);
                try {
                    execSync(`npx prisma migrate deploy --schema=prisma/${s}/schema.prisma`, { stdio: 'inherit' });
                    success = true;
                } catch (e) {
                    if (attempts >= MAX_RETRIES) {
                        console.error(`❌ Migration failed for ${s} after ${MAX_RETRIES} attempts. Exiting.`);
                        process.exit(1);
                    }
                    console.warn(`⚠️ Migration attempt ${attempts} failed. Database might be booting. Retrying in 5s...`);
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                }
            }
        }
    }

    console.log("✅ Initialization complete. Handing over to Next.js...");
    execSync('node server.js', { stdio: 'inherit' });
}

init().catch(err => {
    console.error("❌ Container init failed:", err);
    process.exit(1);
});
