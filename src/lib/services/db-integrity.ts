import { opsDbProvider, aiDbProvider } from './db-wrapper';

/**
 * Service to manage Cross-DB referential integrity
 * Focuses on Task 3.3: Detecting and marking orphan records in aiDb
 */
export class DbIntegrityService {
  /**
   * Scans AI logs for references to missing business entities
   * @returns Report of orphan records found and marked
   */
  static async checkOrphanRecords(jobId?: string) {
    console.log(`[IntegrityService] Starting comprehensive consistency check (Job: ${jobId || 'manual'})...`);
    const report = {
      aiVerificationLogs: { scanned: 0, orphansFound: 0, deletedRefs: 0 },
      aiSafetyLogs: { scanned: 0, orphansFound: 0, deletedRefs: 0 },
      aiRequestLogs: { scanned: 0, orphansFound: 0, deletedRefs: 0 },
      trustGraph: { scanned: 0, orphansFound: 0 },
      timestamp: new Date().toISOString()
    };

    // 1. Check AiVerificationLog
    const verificationLogs = await aiDbProvider.findMany<any>('AiVerificationLog');
    for (const log of verificationLogs) {
      if (log.targetId && log.targetType) {
        report.aiVerificationLogs.scanned++;
        const entity = await this.getEntity(log.targetType, log.targetId);
        
        if (!entity) {
          report.aiVerificationLogs.orphansFound++;
          await this.logIssue('ORPHAN_CHECK', log.targetType, log.targetId, `AiVerificationLog ${log.id} points to missing entity.`, jobId);
          await aiDbProvider.update('AiVerificationLog', log.id, { isOrphan: true });
        } else if (entity.deletedAt) {
          report.aiVerificationLogs.deletedRefs++;
          await this.logIssue('SOFT_DELETE_REF', log.targetType, log.targetId, `AiVerificationLog ${log.id} points to SOFT-DELETED entity.`, jobId);
        }
      }
    }

    // 2. Check AiSafetyLog
    const safetyLogs = await aiDbProvider.findMany<any>('AiSafetyLog');
    for (const log of safetyLogs) {
      if (log.targetId && log.targetType) {
        report.aiSafetyLogs.scanned++;
        const entity = await this.getEntity(log.targetType, log.targetId);
        if (!entity) {
          report.aiSafetyLogs.orphansFound++;
          await this.logIssue('ORPHAN_CHECK', log.targetType, log.targetId, `AiSafetyLog ${log.id} is orphan.`, jobId);
          await aiDbProvider.update('AiSafetyLog', log.id, { isOrphan: true });
        }
      }
    }

    // 3. Check TrustGraph Nodes (Source Consistency)
    const graphNodes = await aiDbProvider.findMany<any>('TrustGraphNode');
    for (const node of graphNodes) {
      if (node.sourceId && node.sourceType) {
        report.trustGraph.scanned++;
        const entity = await this.getEntity(node.sourceType, node.sourceId);
        if (!entity) {
          report.trustGraph.orphansFound++;
          await this.logIssue('ORPHAN_CHECK', node.sourceType, node.sourceId, `TrustGraph Node ${node.id} source is missing.`);
        }
      }
    }

    console.log('[IntegrityService] Consistency check complete.', report);
    
    // Task 6.6: Generate report and Check thresholds
    await this.generateReport(report);
    await this.checkAlertThresholds(report);

    return report;
  }

  /**
   * Generates a summary report of the consistency check (Task 6.6)
   */
  private static async generateReport(report: any) {
    const summary = `
      CONSISTENCY REPORT [${report.timestamp}]
      ----------------------------------------
      - AI Verification Logs: ${report.aiVerificationLogs.orphansFound} orphans, ${report.aiVerificationLogs.deletedRefs} soft-deleted refs.
      - AI Safety Logs: ${report.aiSafetyLogs.orphansFound} orphans.
      - TrustGraph Nodes: ${report.trustGraph.orphansFound} orphans.
      ----------------------------------------
      Total Issues Found: ${report.aiVerificationLogs.orphansFound + report.aiVerificationLogs.deletedRefs + report.aiSafetyLogs.orphansFound + report.trustGraph.orphansFound}
    `;
    console.log('[IntegrityService] Report Generated:', summary);
  }

  /**
   * Sends alerts if error count exceeds thresholds (Task 6.6)
   */
  private static async checkAlertThresholds(report: any) {
    const ORPHAN_THRESHOLD = 10;
    const totalOrphans = report.aiVerificationLogs.orphansFound + report.aiSafetyLogs.orphansFound + report.trustGraph.orphansFound;

    if (totalOrphans > ORPHAN_THRESHOLD) {
      console.error(`🚨 ALERT: High number of orphan records detected (${totalOrphans}). Immediate cleanup or sync rebuild required!`);
    }
  }

  /**
   * Helper to log consistency issues
   */
  private static async logIssue(type: string, targetType: string, targetId: string, details: string, jobId?: string) {
    try {
      await aiDbProvider.create('AuditConsistencyCheckLog', {
        checkType: type,
        targetType,
        targetId,
        issueDetails: details,
        severity: type === 'ORPHAN_CHECK' ? 'ERROR' : 'WARNING',
        jobId
      });
    } catch (e) {
      console.error('[IntegrityService] Failed to create consistency log', e);
    }
  }

  /**
   * Helper to fetch entity from respective DB
   */
  private static async getEntity(type: string, id: string): Promise<any | null> {
    try {
      const modelMapping: { [key: string]: string } = {
        'DNF': 'DnfDocument',
        'HAZARD': 'HazardRecord',
        'INSPECTION': 'InspectionDetail',
        'ASSET': 'Asset',
        'STATION': 'PatrolLocation',
        'USER': 'User'
      };

      const modelName = modelMapping[type.toUpperCase()] || type;
      return await opsDbProvider.findUnique<any>(modelName, id);
    } catch (error) {
      console.error(`[IntegrityService] Error fetching entity ${type}:${id}`, error);
      return null;
    }
  }
}
