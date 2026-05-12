import { opsDb } from './ops-db';
import { aiDb } from './ai-db';
import { DB_CONFIG } from '../config/db-config';

/**
 * Monitor database connection counts for PostgreSQL
 */
export async function getDbConnectionStats() {
  const stats = {
    opsDb: { active: 0, total: 0 },
    aiDb: { active: 0, total: 0 },
    timestamp: new Date().toISOString()
  };

  if (DB_CONFIG.useFallback) {
    return stats; // Return zero stats in fallback mode
  }

  try {
    // Query pg_stat_activity for opsDb
    const opsResult: any[] = await opsDb.$queryRaw`
      SELECT count(*) as count, state 
      FROM pg_stat_activity 
      WHERE datname = current_database() 
      GROUP BY state
    `;
    stats.opsDb.total = opsResult.reduce((acc, row) => acc + Number(row.count), 0);
    stats.opsDb.active = Number(opsResult.find(r => r.state === 'active')?.count || 0);

    // Query pg_stat_activity for aiDb
    const aiResult: any[] = await aiDb.$queryRaw`
      SELECT count(*) as count, state 
      FROM pg_stat_activity 
      WHERE datname = current_database() 
      GROUP BY state
    `;
    stats.aiDb.total = aiResult.reduce((acc, row) => acc + Number(row.count), 0);
    stats.aiDb.active = Number(aiResult.find(r => r.state === 'active')?.count || 0);

  } catch (error) {
    console.error('[DB-Monitor] Failed to fetch connection stats:', error);
  }

  return stats;
}

/**
 * Check for connection spikes and log warnings
 */
export async function monitorConnections(threshold = 50) {
  const stats = await getDbConnectionStats();
  
  if (stats.opsDb.total > threshold) {
    console.warn(`[CRITICAL] opsDb connection count is high: ${stats.opsDb.total} (Threshold: ${threshold})`);
  }
  
  if (stats.aiDb.total > threshold) {
    console.warn(`[CRITICAL] aiDb connection count is high: ${stats.aiDb.total} (Threshold: ${threshold})`);
  }

  return stats;
}
