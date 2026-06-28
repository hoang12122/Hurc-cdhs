import { syncIncidentMemoryFromOperations } from '@/lib/services/incident-learning-service';

async function main() {
  console.log('[incident-memory] Sync started...');
  const result = await syncIncidentMemoryFromOperations();
  console.log('[incident-memory] Sync completed.');
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error('[incident-memory] Sync failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
