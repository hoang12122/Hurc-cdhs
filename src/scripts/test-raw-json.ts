import fs from 'fs/promises';
import path from 'path';

async function main() {
  const dbPath = path.join(process.cwd(), 'db.json');
  const raw = await fs.readFile(dbPath, 'utf-8');
  const db = JSON.parse(raw);
  console.log('Total OUs in raw JSON:', db.organizational_units?.length);
  for (const ou of db.organizational_units || []) {
    console.log(`OU: id=${ou.id} name=${ou.name}`);
  }
}

main().catch(console.error);
