import fs from 'fs';
import path from 'path';

// This script migrates old systemLogs from db.backup.json to the new structured logs directory.
async function migrateLogs() {
    const dbPath = path.join(process.cwd(), 'db.backup.json');
    if (!fs.existsSync(dbPath)) {
        console.log('No db.backup.json found. Skipping migration.');
        return;
    }

    try {
        const dbContent = fs.readFileSync(dbPath, 'utf8');
        const db = JSON.parse(dbContent);
        
        if (!db.systemLogs || !Array.isArray(db.systemLogs) || db.systemLogs.length === 0) {
            console.log('No systemLogs found in db.backup.json. Skipping migration.');
            return;
        }

        console.log(`Found ${db.systemLogs.length} legacy logs. Migrating...`);
        
        // Ensure logs directory exists
        const logsDir = path.join(process.cwd(), 'logs', 'system');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        const txtPath = path.join(logsDir, 'log.txt');
        const jsonlPath = path.join(logsDir, 'log.jsonl');

        let migratedCount = 0;
        
        for (const log of db.systemLogs) {
            // Convert to new format
            const timestamp = typeof log.timestamp === 'string' ? log.timestamp : new Date(log.timestamp || Date.now()).toISOString();
            
            const structuredLog = {
                id: log.id || `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                timestamp: timestamp,
                userId: log.userId || 'system',
                userName: log.userName || 'System',
                action: log.action || 'UNKNOWN',
                level: log.level || 'INFO',
                details: log.details || '',
                category: log.category || 'system'
            };

            const logLine = `[${structuredLog.timestamp}] [${structuredLog.level}] [${structuredLog.category.toUpperCase()}] ${structuredLog.userName} (${structuredLog.userId}) - ${structuredLog.action}: ${structuredLog.details}\n`;
            
            fs.appendFileSync(txtPath, logLine);
            fs.appendFileSync(jsonlPath, JSON.stringify(structuredLog) + '\n');
            migratedCount++;
        }

        console.log(`Successfully migrated ${migratedCount} logs to ${logsDir}`);
        
        // Optional: Remove systemLogs from db.backup.json to save space
        // db.systemLogs = [];
        // fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        // console.log('Cleared legacy systemLogs from db.backup.json.');

    } catch (e) {
        console.error('Migration failed:', e);
    }
}

migrateLogs();
