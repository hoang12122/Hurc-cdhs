import { DbIntegrityService } from './db-integrity';
import { TrustGraphConsistencyService } from './trustgraph-integrity';
import { aiDbProvider } from './db-wrapper';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

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
        await this.generateDashboard();
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
   * Task 12.3: Auto-generate Dashboard (In-Process)
   */
  private static async generateDashboard() {
    console.log('📊 [IntegrityCoordinator] Generating Integrity Dashboard...');
    
    const lastJobs = await aiDbProvider.findMany<any>('IntegrityJobLog', {}, true);
    const orphans = await aiDbProvider.findMany<any>('AuditConsistencyCheckLog', { status: 'detected' });
    const graphIssues = await aiDbProvider.findMany<any>('GraphConsistencyLog', { status: 'detected' });

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hurc1CRM | Database Integrity Dashboard</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f7f6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: auto; }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 5px solid #3498db; }
        .card.danger { border-left-color: #e74c3c; }
        .card.warning { border-left-color: #f1c40f; }
        .card h3 { margin-top: 0; color: #7f8c8d; font-size: 0.9rem; text-transform: uppercase; }
        .card .value { font-size: 2rem; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #34495e; color: white; }
        tr:hover { background: #f9f9f9; }
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; }
        .badge-error { background: #ffdada; color: #cc0000; }
        .badge-warning { background: #fff4d1; color: #856404; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Database Integrity Dashboard</h1>
            <div>Last Updated: ${new Date().toLocaleString()}</div>
        </div>

        <div class="stats-grid">
            <div class="card">
                <h3>Total Scans</h3>
                <div class="value">${lastJobs.length}</div>
            </div>
            <div class="card danger">
                <h3>Active Orphans</h3>
                <div class="value">${orphans.length}</div>
            </div>
            <div class="card warning">
                <h3>Graph Issues</h3>
                <div class="value">${graphIssues.length}</div>
            </div>
            <div class="card">
                <h3>System Health</h3>
                <div class="value">${orphans.length > 10 ? '🔴 CRITICAL' : orphans.length > 0 ? '🟡 ATTENTION' : '🟢 HEALTHY'}</div>
            </div>
        </div>

        <h2>Active Issues (Orphan Records)</h2>
        <table>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Target ID</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Detected At</th>
                </tr>
            </thead>
            <tbody>
                ${orphans.map((o: any) => `
                <tr>
                    <td>${o.targetType}</td>
                    <td><code>${o.targetId}</code></td>
                    <td><span class="badge ${o.severity === 'ERROR' ? 'badge-error' : 'badge-warning'}">${o.severity}</span></td>
                    <td>${o.status}</td>
                    <td>${new Date(o.createdAt).toLocaleString()}</td>
                </tr>`).join('')}
            </tbody>
        </table>

        <h2 style="margin-top: 40px;">Graph Inconsistencies</h2>
        <table>
            <thead>
                <tr>
                    <th>Source Type</th>
                    <th>Source ID</th>
                    <th>Issue</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                ${graphIssues.map((g: any) => `
                <tr>
                    <td>${g.sourceType}</td>
                    <td><code>${g.sourceId}</code></td>
                    <td>${g.issueType}</td>
                    <td>${g.details || 'N/A'}</td>
                </tr>`).join('')}
            </tbody>
        </table>
    </div>
</body>
</html>
    `;

    const reportDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir);
    
    const filePath = path.join(reportDir, 'integrity-dashboard.html');
    fs.writeFileSync(filePath, html);
    
    console.log(`✅ [IntegrityCoordinator] Dashboard generated successfully at: ${filePath}`);
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
