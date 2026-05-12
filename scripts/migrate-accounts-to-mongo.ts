import fs from 'fs';
import path from 'path';
import { getMongoDb, closeMongoDb } from '../src/lib/services/mongo-client';
import { AccountDoc } from '../src/lib/services/account-service';

const DB_PATH = path.join(process.cwd(), 'db.json');

async function migrate() {
  console.log('Starting migration of users from db.json to MongoDB accounts collection...');
  if (!fs.existsSync(DB_PATH)) {
    console.error('db.json not found!');
    process.exit(1);
  }

  const rawData = fs.readFileSync(DB_PATH, 'utf8');
  const db = JSON.parse(rawData);

  if (!db.users || !Array.isArray(db.users)) {
    console.log('No users found in db.json to migrate.');
    return;
  }

  try {
    const mongoDb = await getMongoDb();
    const accountsCollection = mongoDb.collection<AccountDoc>('accounts');

    console.log(`Migrating ${db.users.length} users...`);
    let migratedCount = 0;

    for (const u of db.users) {
      // Check if already exists
      const exists = await accountsCollection.findOne({ email: u.email });
      if (!exists) {
        await accountsCollection.insertOne({
          email: u.email,
          passwordHash: u.password || 'MIGRATED_NO_PASSWORD',
          role: u.role || 'USER',
          name: u.name || 'Unknown',
          department: u.department,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        migratedCount++;
      }
    }

    console.log(`Migrated ${migratedCount} new accounts to MongoDB successfully!`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await closeMongoDb();
  }
}

migrate();
