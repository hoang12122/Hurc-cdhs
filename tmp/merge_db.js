const fs = require('fs');
const path = require('path');

const BACKUP_PATH = 'd:/Hurc1CRM-main/Hurc-cdhs/db.backup.json';
const DB_PATH = 'd:/Hurc1CRM-main/Hurc-cdhs/db.json';

try {
  const backup = JSON.parse(fs.readFileSync(BACKUP_PATH, 'utf8'));
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

  console.log('--- Merging Data ---');
  
  // Collections to bring in from backup
  const collectionsToRestore = [
    'maintenanceStandards', 
    'maintenanceStandardItems', 
    'inspections', 
    'correctiveActions', 
    'dnfs', 
    'hazardRecords', 
    'improvements', 
    'subsystems', 
    'patrolLocations'
  ];

  collectionsToRestore.forEach(key => {
    const backupData = backup[key] || [];
    const dbData = db[key] || [];

    // Simple ID merge (don't overwrite if ID already exists, but for these it's likely empty)
    const existingIds = new Set(dbData.map(item => item.id));
    const newItems = backupData.filter(item => !existingIds.has(item.id));

    db[key] = [...dbData, ...newItems];
    console.log(`- ${key}: Added ${newItems.length} items`);
  });

  // Preserve current users and roles
  console.log('- Users/Roles conserved from current db.json');

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  console.log('\nSUCCESS: db.json updated with demo data.');
} catch (e) {
  console.error('MERGE ERROR:', e.message);
  process.exit(1);
}
