import { dbProvider } from '../lib/services/db-wrapper';
import { DB_CONFIG } from '../lib/config/db-config';

async function main() {
  console.log('process.env.DATABASE_JSON_PATH:', process.env.DATABASE_JSON_PATH);
  console.log('process.env.MOCK_DB_PATH:', process.env.MOCK_DB_PATH);
  
  const ous = await dbProvider.findMany<any>('OrganizationalUnit');
  console.log('OUs found:', ous.length);
  for (const ou of ous) {
    console.log(`- ${ou.id}`);
  }
}

main().catch(console.error);
