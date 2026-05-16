import { readRawDb } from '../lib/db/json-db';
import { opsDb } from '../lib/db/ops-db';
import { aiDb } from '../lib/db/ai-db';

/**
 * REVERSE SYNC UTILITY (HURC1 DB-HARDENING)
 * Exports data from db.json to PostgreSQL.
 */

async function syncCollection(collectionName: string, prismaModel: any, dbName: string) {
    console.log(`[SYNC] Starting sync for ${collectionName} -> ${dbName}...`);
    
    try {
        const db = await readRawDb();
        const items = db[collectionName] || [];
        
        if (items.length === 0) {
            console.log(`[SYNC] Collection ${collectionName} is empty. Skipping.`);
            return;
        }

        let synced = 0;
        let skipped = 0;

        for (const item of items) {
            try {
                // Use upsert to handle existing records
                await prismaModel.upsert({
                    where: { id: item.id },
                    update: item,
                    create: item,
                });
                synced++;
            } catch (e) {
                console.error(`[SYNC] Error syncing item ${item.id}:`, e);
                skipped++;
            }
        }

        console.log(`[SYNC] Finished ${collectionName}: ${synced} synced, ${skipped} skipped.`);
    } catch (error) {
        console.error(`[SYNC] Failed to read collection ${collectionName}:`, error);
    }
}

async function main() {
    console.log("=== HURC1 DATABASE REVERSE SYNC ===");
    
    // Sync Operational Data
    await syncCollection('dnf_documents', opsDb.dnfDocument, 'OpsDB');
    await syncCollection('hazards', opsDb.hazardRecord, 'OpsDB');
    await syncCollection('inspections', opsDb.inspectionDetail, 'OpsDB');
    await syncCollection('corrective_actions', opsDb.correctiveAction, 'OpsDB');
    
    // Sync AI/Memory Data
    await syncCollection('ai_longterm_memory', aiDb.aiAgent, 'AiDB'); // Simplified mapping

    console.log("=== SYNC COMPLETED ===");
    process.exit(0);
}

main();
