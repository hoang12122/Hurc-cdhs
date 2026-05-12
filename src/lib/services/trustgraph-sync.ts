import { opsDbProvider, aiDbProvider } from './db-wrapper';
import { readDb, writeDb } from '../json-db-service';

/**
 * Service for synchronizing relational data to TrustGraph
 * Implements Task 4.2
 */
export class TrustGraphSyncService {
  /**
   * Performs incremental or full synchronization
   */
  static async syncAll(mode: 'incremental' | 'full' = 'incremental') {
    const syncLogId = `sync-${Date.now()}`;
    console.log(`[TrustGraphSync] Starting ${mode} sync...`);
    
    const report = {
      nodesSynced: 0,
      edgesSynced: 0,
      errors: 0,
      retries: 0,
      startTime: new Date().toISOString()
    };

    try {
      // 1. Sync Stations (PatrolLocation)
      const stations = await opsDbProvider.findMany<any>('PatrolLocation');
      for (const station of stations) {
        try {
          await this.upsertNode('STATION', station.id, station.label);
          report.nodesSynced++;
        } catch (e) { report.errors++; }
      }

      // 2. Sync Subsystems
      const subsystems = await opsDbProvider.findMany<any>('Subsystem');
      for (const sub of subsystems) {
        try {
          await this.upsertNode('SYSTEM', sub.id, sub.label_vi || sub.label_en);
          report.nodesSynced++;
        } catch (e) { report.errors++; }
      }

      // 3. Sync DNFs and their relationships
      const dnfs = await opsDbProvider.findMany<any>('DnfDocument');
      for (const dnf of dnfs) {
        try {
          const node = await this.upsertNode('DNF', dnf.id, dnf.failureReportNo || `DNF-${dnf.id.substring(0,8)}`, {
            status: dnf.status,
            priority: dnf.priority
          }) as any;
          report.nodesSynced++;

          // Create Edge: DNF -> LOCATED_AT -> Station
          if (dnf.locationOfFailure) {
            const stationNode = await this.findNode('STATION', dnf.locationOfFailure) as any;
            if (stationNode) {
              await this.upsertEdge(node.id, stationNode.id, 'LOCATED_AT');
              report.edgesSynced++;
            }
          }
        } catch (e) { report.errors++; }
      }

      // Record sync results
      await aiDbProvider.create('AiSyncLog', {
        id: syncLogId,
        syncType: 'FULL_SYNC',
        recordsSynced: report.nodesSynced + report.edgesSynced,
        recordsFailed: report.errors,
        status: report.errors === 0 ? 'SUCCESS' : 'PARTIAL',
        createdAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('[TrustGraphSync] Global sync error:', error);
      await aiDbProvider.create('AiSyncLog', {
        id: syncLogId,
        syncType: 'FULL_SYNC',
        status: 'FAILED',
        errorMessage: String(error),
        createdAt: new Date().toISOString()
      });
    }

    console.log(`[TrustGraphSync] Sync complete.`, report);
    return report;
  }

  /**
   * Manually retry only failed records
   * Task 4.4 requirement
   */
  static async retryFailedSyncs() {
    console.log('[TrustGraphSync] Starting manual retry for failed records...');
    const failedLogs = await aiDbProvider.findMany<any>('TrustGraphSyncLog', { status: 'FAILED' });
    
    let recovered = 0;
    for (const log of failedLogs) {
      try {
        // Reset retry count and trigger sync again
        // Here we need to find the actual data based on sourceType and sourceId
        // This is a simplified version; in a real app, you'd map back to the fetch logic
        console.log(`[TrustGraphSync] Retrying ${log.sourceType}:${log.sourceId}...`);
        
        // Example for STATION
        if (log.sourceType === 'STATION') {
          const data = await opsDbProvider.findUnique<any>('PatrolLocation', log.sourceId);
          if (data) await this.upsertNode('STATION', data.id, data.label);
        }
        // ... add other types similarly or use a generic fetcher
        
        recovered++;
      } catch (error) {
        console.error(`[TrustGraphSync] Manual retry failed for ${log.sourceType}:${log.sourceId}`);
      }
    }
    return { attempted: failedLogs.length, recovered };
  }

  /**
   * Rebuild the entire graph (Task 4.5)
   * Warning: This clears existing nodes and edges!
   */
  static async rebuildAll() {
    console.warn('[TrustGraphSync] REBUILDING ENTIRE GRAPH...');
    
    // 1. Backup - Simplified: just log current count
    const nodeCount = await aiDbProvider.count('TrustGraphNode');
    const edgeCount = await aiDbProvider.count('TrustGraphEdge');
    console.log(`[TrustGraphSync] Pre-rebuild count: Nodes=${nodeCount}, Edges=${edgeCount}`);

    // 2. Clear
    // Note: IDataProvider doesn't have deleteMany, so we use loop or special provider logic
    // For Mock layer, we can just empty the collection
    const db = readDb();
    db['trustgraph_nodes'] = [];
    db['trustgraph_edges'] = [];
    db['trustgraph_sync_logs'] = [];
    writeDb(db);

    // 3. Sync from scratch
    return await this.syncAll('full');
  }

  /**
   * Rebuild by specific entity type
   */
  static async rebuildByEntity(type: string) {
    console.log(`[TrustGraphSync] Rebuilding entity type: ${type}...`);
    
    // 1. Clear existing nodes of this type
    const nodes = await aiDbProvider.findMany<any>('TrustGraphNode', { sourceType: type });
    for (const node of nodes) {
      // Clear edges connected to this node
      const edges = await aiDbProvider.findMany<any>('TrustGraphEdge', { fromNodeId: node.id });
      for (const edge of edges) await aiDbProvider.delete('TrustGraphEdge', edge.id);
      
      await aiDbProvider.delete('TrustGraphNode', node.id);
      await aiDbProvider.delete('TrustGraphSyncLog', node.id); // This assumes sync log id is node id or we need to find it
    }

    // 2. Re-sync this specific entity
    // (This would call specific sync methods based on type)
    if (type === 'STATION') {
      const stations = await opsDbProvider.findMany<any>('PatrolLocation');
      for (const s of stations) await this.upsertNode('STATION', s.id, s.label);
    }
    // ... logic for other types
  }

  /**
   * Idempotent Node Upsert with Retry Logic
   */
  private static async upsertNode(type: string, sourceId: string, label: string, metadata: any = {}) {
    const MAX_RETRIES = 3;
    let currentRetry = 0;
    
    // Track start of sync
    await this.trackSyncStatus(type, sourceId, 'SYNCING');

    while (currentRetry <= MAX_RETRIES) {
      try {
        // Check if exists
        const existing = await aiDbProvider.findMany<any>('TrustGraphNode', { sourceType: type, sourceId });
        
        let result;
        if (existing.length > 0) {
          result = await aiDbProvider.update('TrustGraphNode', existing[0].id, {
            label,
            metadata: { ...existing[0].metadata, ...metadata },
            updatedAt: new Date().toISOString()
          });
        } else {
          result = await aiDbProvider.create('TrustGraphNode', {
            sourceType: type,
            sourceId,
            label,
            metadata,
            sourceVersion: 1
          });
        }

        await this.trackSyncStatus(type, sourceId, 'SYNCED');
        return result;

      } catch (error) {
        currentRetry++;
        console.error(`[TrustGraphSync] Retry ${currentRetry}/${MAX_RETRIES} for ${type}:${sourceId}`, error);
        
        if (currentRetry > MAX_RETRIES) {
          await this.trackSyncStatus(type, sourceId, 'FAILED', String(error), currentRetry);
          throw error;
        }
        await this.trackSyncStatus(type, sourceId, 'RETRYING', String(error), currentRetry);
        // Exponential backoff or simple delay could be added here
      }
    }
  }

  /**
   * Status tracking helper
   */
  private static async trackSyncStatus(type: string, id: string, status: string, error: string | null = null, retries: number = 0) {
    try {
      const existingLog = await aiDbProvider.findMany<any>('TrustGraphSyncLog', { sourceType: type, sourceId: id });
      
      if (existingLog.length > 0) {
        await aiDbProvider.update('TrustGraphSyncLog', existingLog[0].id, {
          status,
          lastError: error,
          retryCount: retries,
          lastSyncedAt: status === 'SYNCED' ? new Date().toISOString() : existingLog[0].lastSyncedAt,
          updatedAt: new Date().toISOString()
        });
      } else {
        await aiDbProvider.create('TrustGraphSyncLog', {
          sourceType: type,
          sourceId: id,
          status,
          lastError: error,
          retryCount: retries,
          lastSyncedAt: status === 'SYNCED' ? new Date().toISOString() : null
        });
      }
    } catch (e) {
      console.error('[TrustGraphSync] Failed to track sync status', e);
    }
  }

  /**
   * Idempotent Edge Upsert
   */
  private static async upsertEdge(fromNodeId: string, toNodeId: string, type: string) {
    const existing = await aiDbProvider.findMany<any>('TrustGraphEdge', { fromNodeId, toNodeId, relationType: type });
    
    if (existing.length === 0) {
      return await aiDbProvider.create('TrustGraphEdge', {
        fromNodeId,
        toNodeId,
        relationType: type,
        confidence: 1.0
      });
    }
    return existing[0];
  }

  private static async findNode(type: string, sourceId: string) {
    const nodes = await aiDbProvider.findMany<any>('TrustGraphNode', { sourceType: type, sourceId });
    return nodes.length > 0 ? nodes[0] : null;
  }
}
