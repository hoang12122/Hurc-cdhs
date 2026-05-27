import fs from 'fs/promises';
import path from 'path';

async function main() {
  const dbPath = path.join(process.cwd(), 'db.json');
  const raw = await fs.readFile(dbPath, 'utf-8');
  const db = JSON.parse(raw);
  const ou = db.organizational_units?.find((o: any) => o.id === 'ou-track-civil');
  console.log('ou-track-civil:', JSON.stringify(ou, null, 2));
}

main().catch(console.error);
