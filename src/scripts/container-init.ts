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
        // Ensure data directory and db.json exist
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
        
        for (const s of schemas) {
            console.log(`Migrating schema: ${s}...`);
            try {
                // Running migrate deploy instead of dev to ensure zero-interaction production safety
                execSync(`npx prisma migrate deploy --schema=prisma/${s}/schema.prisma`, { stdio: 'inherit' });
            } catch (e) {
                console.error(`❌ Migration failed for ${s}. Check your DATABASE_URL.`);
                // In production, we might want to exit(1) to prevent starting with broken schema
                process.exit(1);
            }
        }
    }

    console.log("✅ Initialization complete. Handing over to Next.js...");
    // Start the application
    execSync('node server.js', { stdio: 'inherit' });
}

init().catch(err => {
    console.error("❌ Container init failed:", err);
    process.exit(1);
});
