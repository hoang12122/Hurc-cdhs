import { OrganizationService } from './src/lib/services/organization-service';
async function run() {
  await OrganizationService.seedDefaultOrganization();
  console.log('Seeded successfully!');
}
run().catch(console.error).finally(() => process.exit(0));