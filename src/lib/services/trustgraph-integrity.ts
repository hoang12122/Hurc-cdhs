import { opsDbProvider, aiDbProvider } from './db-wrapper';

/**
 * TrustGraph Consistency Service (Task 6.7)
 * Ensures Graph data matches Source data in opsDb
 */
export class TrustGraphConsistencyService {
  /**
   * Main audit job for TrustGraph
   */
  static async auditGraphIntegrity(jobId?: string) {
    console.log(`[GraphIntegrity] Starting TrustGraph audit (Job: ${jobId || 'manual'})...`);
    const report = {
      nodesChecked: 0,
      missingNodes: 0,
      versionMismatches: 0,
      timestamp: new Date().toISOString()
    };

    // 1. Audit DNF Documents -> Nodes
    const dnfs = await opsDbProvider.findMany<any>('DnfDocument');
    for (const dnf of dnfs) {
      report.nodesChecked++;
      const nodes = await aiDbProvider.findMany<any>('TrustGraphNode', { 
        sourceType: 'DNF', 
        sourceId: dnf.id 
      });
      const node = nodes[0] || null;

      if (!node) {
        report.missingNodes++;
        await this.logGraphIssue('MISSING_NODE', 'DNF', dnf.id, `DNF ${dnf.id} exists in Ops but no node in Graph.`, undefined, undefined, jobId);
      } else if (node.sourceVersion !== (dnf.version || 1)) {
        report.versionMismatches++;
        await this.logGraphIssue('VERSION_MISMATCH', 'DNF', dnf.id, 
          `Version mismatch: Graph v${node.sourceVersion} vs Source v${dnf.version || 1}`, 
          dnf.version || 1, node.sourceVersion, jobId);
      }
    }

    // 2. Audit Hazards -> Nodes
    const hazards = await opsDbProvider.findMany<any>('HazardRecord');
    for (const hazard of hazards) {
      report.nodesChecked++;
      const nodes = await aiDbProvider.findMany<any>('TrustGraphNode', { 
        sourceType: 'HAZARD', 
        sourceId: hazard.id 
      });
      const node = nodes[0] || null;

      if (!node) {
        report.missingNodes++;
        await this.logGraphIssue('MISSING_NODE', 'HAZARD', hazard.id, `Hazard ${hazard.id} missing in Graph.`, undefined, undefined, jobId);
      }
    }

    console.log('[GraphIntegrity] Audit complete.', report);
    return report;
  }

  /**
   * Helper to log graph issues
   */
  private static async logGraphIssue(
    type: string, 
    sourceType: string, 
    sourceId: string, 
    details: string,
    expected?: number,
    actual?: number,
    jobId?: string
  ) {
    try {
      await aiDbProvider.create('GraphConsistencyLog', {
        issueType: type,
        sourceType,
        sourceId,
        details,
        expectedVersion: expected,
        actualVersion: actual,
        jobId
      });
    } catch (e) {
      console.error('[GraphIntegrity] Failed to log issue', e);
    }
  }

  /**
   * Admin function to trigger re-sync for all records with issues
   */
  static async resolvePendingIssues() {
    const issues = await aiDbProvider.findMany<any>('GraphConsistencyLog', { status: 'PENDING' });
    console.log(`[GraphIntegrity] Attempting to resolve ${issues.length} pending issues...`);
    
    // In a real implementation, this would call TrustGraphSyncService.syncEntity()
    // for each sourceId/sourceType found in the issues list.
    return issues.length;
  }
}
