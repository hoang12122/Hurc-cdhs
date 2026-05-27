import { dbProvider } from '../lib/services/db-wrapper';

async function main() {
  console.log('--- DIRECT DBPROVIDER FINDMANY ---');
  const ous = await dbProvider.findMany<any>('OrganizationalUnit');
  console.log('Total OUs in DB:', ous.length);
  for (const ou of ous) {
    console.log(`OU: ID="${ou.id}" | Name="${ou.name}" | ParentID="${ou.parentId || 'None'}"`);
  }
}

main().catch(console.error);
