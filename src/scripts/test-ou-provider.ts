import { dbProvider } from '../lib/services/db-wrapper';
import { DB_CONFIG } from '../lib/config/db-config';

async function main() {
  console.log('Constructor Name:', dbProvider.constructor.name);
  console.log('DB_CONFIG.useFallback:', DB_CONFIG.useFallback);
  console.log('DB_CONFIG.mockDbPath:', DB_CONFIG.mockDbPath);
  
  const ous = await dbProvider.findMany<any>('OrganizationalUnit');
  console.log('OUs found:', ous.length);
  for (const ou of ous) {
    console.log(`- ${ou.id}`);
  }
}

main().catch(console.error);
