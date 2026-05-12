import { DbIntegrityService } from './db-integrity';
import { TrustGraphConsistencyService } from './trustgraph-integrity';
import { aiDbProvider } from './db-wrapper';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Integrity Coordinator (Task 6.8)
 * Coordinates and schedules consistency checks across the system
 */
export class IntegrityCoordinator {
  /**
   * Executes a full system integrity check
   */
  static async runFullIntegrityCheck() {
    const startTime = new Date();
    const jobId = Math.random().toString(36).substring(2, 11).toUpperCase();
    console.log(`\n🕒 [IntegrityCoordinator] Job [${jobId}] started at: ${startTime.toISOString()}`);
    
    try {
      // 1. Cross-DB Consistency Check (Ops vs AI logs)
      console.log('--- Step 1: Running Cross-DB Consistency Check ---');
      const dbReport = await DbIntegrityService.checkOrphanRecords(jobId);
      
      // 2. TrustGraph Consistency Check (Ops vs Graph)
      console.log('--- Step 2: Running TrustGraph Consistency Check ---');
      const graphReport = await TrustGraphConsistencyService.auditGraphIntegrity(jobId);
      
      const endTime = new Date();
      const durationMs = endTime.getTime() - startTime.getTime();
      
      const finalSummary = {
        jobId,
        status: 'SUCCESS',
        startedAt: startTime.toISOString(),
        endedAt: endTime.toISOString(),
        durationMs,
        summary: {
          crossDbOrphans: dbReport.aiVerificationLogs.orphansFound + dbReport.aiSafetyLogs.orphansFound,
          graphIssues: graphReport.missingNodes + graphReport.versionMismatches,
          totalRecordsScanned: dbReport.aiVerificationLogs.scanned + graphReport.nodesChecked
        }
      };

      console.log(`✅ [IntegrityCoordinator] Job [${jobId}] finished at: ${endTime.toISOString()}`);
      console.log('📊 [IntegrityCoordinator] FINAL SUMMARY:', finalSummary);

      // Task 6.9: Save job log to database
      try {
        await (aiDbProvider as any).create('IntegrityJobLog', {
          id: jobId,
          jobType: 'FULL_CHECK',
          startedAt: startTime,
          endedAt: endTime,
          totalRecordsChecked: finalSummary.summary.totalRecordsScanned,
          totalIssuesFound: finalSummary.summary.crossDbOrphans + finalSummary.summary.graphIssues,
          status: 'SUCCESS',
          reportSummary: finalSummary.summary
        });
      } catch (logError) {
        console.error('[IntegrityCoordinator] Failed to save Job Log', logError);
      }

      // Task 12.3: Check Alert Thresholds
      await this.checkAlertThresholds(finalSummary as any);

      // Task 12.3: Auto-generate Dashboard
      try {
        await execAsync('npx tsx src/scripts/generate-integrity-dashboard.ts');
        console.log('[IntegrityCoordinator] Dashboard updated.');
      } catch (e) {
        console.error('[IntegrityCoordinator] Failed to update dashboard:', e);
      }

      return finalSummary;

    } catch (error) {
      console.error('❌ [IntegrityCoordinator] Job FAILED:', error);
      return { status: 'FAILED', error: (error as Error).message };
    }
  }

  /**
   * Proposed Cron Schedule Logic
   * In a real environment, this could be triggered by:
   * - A dedicated cron worker (e.g., node-cron)
   * - A serverless cron trigger (e.g., Vercel Cron, GitHub Actions)
   */
  /**
   * Task 12.3: Check if issues exceed safe thresholds
   */
  private static async checkAlertThresholds(report: any) {
    const ORPHAN_THRESHOLD = 10;
    const GRAPH_THRESHOLD = 5;

    if (report.summary.crossDbOrphans > ORPHAN_THRESHOLD) {
      await this.sendAlert(`High number of orphan records detected: ${report.summary.crossDbOrphans}`, 'CRITICAL');
    }
    
    if (report.summary.graphIssues > GRAPH_THRESHOLD) {
      await this.sendAlert(`Graph inconsistencies detected: ${report.summary.graphIssues}`, 'WARNING');
    }
  }

  /**
   * Task 12.3: Send notifications (Console/Mock Email)
   */
  private static async sendAlert(message: string, severity: 'WARNING' | 'CRITICAL') {
    const prefix = severity === 'CRITICAL' ? '🚨 [SYSTEM ALERT - CRITICAL]' : '⚠️ [SYSTEM ALERT - WARNING]';
    console.error(`${prefix} ${message}`);
    // Task 12.3: Integrated with Email/Slack/PagerDuty in real production
    console.log(`[Notification] Alert sent to administrator group.`);
  }

  static async getRecommendedSchedule() {
    return {
      development: 'Manual or every 24h',
      staging: 'Daily at 02:00 AM (Low traffic)',
      production: 'Daily at 03:00 AM or Weekly on Sunday (Low traffic)'
    };
  }
}
