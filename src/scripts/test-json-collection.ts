import { jsonDb } from '../lib/db/json-db';

async function main() {
  const collection = await jsonDb.getCollection<any>('organizational_units');
  console.log('Collection Length:', collection.length);
  for (const ou of collection) {
    console.log(`OU: ${ou.id} (deletedAt=${ou.deletedAt})`);
  }
}

main().catch(console.error);
