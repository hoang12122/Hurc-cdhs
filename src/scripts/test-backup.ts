import { createBackup } from '../lib/services/backup-service';
import fs from 'fs/promises';
import path from 'path';

async function test() {
    console.log("🧪 Testing Backup Service...");
    const dummyFile = 'test_db.json';
    await fs.writeFile(dummyFile, JSON.stringify({ test: true }));
    
    const backupPath = await createBackup(dummyFile);
    if (backupPath && await fs.access(backupPath).then(() => true).catch(() => false)) {
        console.log("✅ Backup successfully created at:", backupPath);
        await fs.unlink(dummyFile);
        console.log("🧹 Cleanup done.");
    } else {
        console.error("❌ Backup failed!");
        process.exit(1);
    }
}

test().catch(console.error);
