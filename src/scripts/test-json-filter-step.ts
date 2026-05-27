import { jsonDb } from '../lib/db/json-db';

async function main() {
  const collection = await jsonDb.getCollection<any>('organizational_units');
  console.log('Collection length:', collection.length);
  
  const includeDeleted = false;
  let results = includeDeleted ? collection : collection.filter((item: any) => !item.deletedAt);
  console.log('After includeDeleted check:', results.length);
  
  const filter: any = {};
  results = results.filter((item: any) => {
    for (let key in filter) {
      const filterVal = filter[key];
      const itemVal = item[key];
      if (itemVal !== filterVal) {
        console.log(`Filtered out ${item.id} because key ${key} mismatch: ${itemVal} !== ${filterVal}`);
        return false;
      }
    }
    return true;
  });
  console.log('After filter check:', results.length);
  for (const ou of results) {
    console.log(`- ${ou.id}`);
  }
}

main().catch(console.error);
