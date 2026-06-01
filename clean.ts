import { PrismaClient } from '@prisma/client';
const authDb = new PrismaClient();
async function run() {
  await authDb.organizationalUnit.deleteMany({});
  console.log('Deleted OUs from authDb');
}
run().catch(console.error).finally(() => process.exit(0));