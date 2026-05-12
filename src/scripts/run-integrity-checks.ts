import { IntegrityCoordinator } from '../lib/services/integrity-coordinator';

/**
 * Script to be called by Cron jobs or CI/CD
 */
async function main() {
  console.log('--- HURC1CRM INTEGRITY CHECK CLI ---');
  await IntegrityCoordinator.runFullIntegrityCheck();
}

main().catch(console.error);
