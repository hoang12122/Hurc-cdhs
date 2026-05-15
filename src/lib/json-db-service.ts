
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db.json');

export function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { dnfs: [], inspections: [], roles: [], users: [], patrolLocations: [], hazardRecords: [] };
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { dnfs: [], inspections: [], roles: [], users: [], patrolLocations: [], hazardRecords: [] };
  }
}

export function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing db.json:', error);
  }
}

/**
 * Fallback helper for Prisma actions
 * Use this to simulate findMany, findUnique, etc. if needed
 */
export async function getJsonCollection(collection: string) {
  const db = readDb();
  return db[collection] || [];
}
