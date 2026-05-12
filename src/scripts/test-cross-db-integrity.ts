import { opsDbProvider, aiDbProvider } from '../lib/services/db-wrapper';
import { IntegrityCoordinator } from '../lib/services/integrity-coordinator';

/**
 * TASK 8.3: Kiểm thử Cross-DB Relationships
 */
async function runIntegrityTest() {
  console.log('--- STARTING TASK 8.3: CROSS-DB INTEGRITY TEST ---');
  
  const results = {
    createOrphan: false,
    detectOrphan: false,
    logVerification: false,
    alertThreshold: false
  };

  try {
    // 1. Tạo bản ghi AI "ma" (không có thực thể gốc)
    console.log('[Test] Injecting Orphan AI log...');
    const ghostId = `GHOST-ID-${Date.now()}`;
    await aiDbProvider.create('AiVerificationLog', {
      targetType: 'DNF',
      targetId: ghostId,
      status: 'PENDING',
      isOrphan: false
    });
    results.createOrphan = true;

    // 2. Chạy Full Integrity Check
    console.log('[Test] Running Integrity Job...');
    const report = await IntegrityCoordinator.runFullIntegrityCheck() as any;
    
    // 3. Kiểm tra xem lỗi có được phát hiện không
    if (report.status === 'SUCCESS' && report.summary.crossDbOrphans > 0) {
      console.log(`[Success] Detected ${report.summary.crossDbOrphans} orphans.`);
      results.detectOrphan = true;
    }

    // 4. Kiểm tra bảng AuditConsistencyCheckLog
    console.log('[Test] Verifying Audit Logs...');
    const logs = await aiDbProvider.findMany<any>('AuditConsistencyCheckLog', { 
      targetId: ghostId,
      checkType: 'ORPHAN_CHECK'
    });
    if (logs.length > 0) {
      console.log('[Success] Error correctly logged in audit_consistency_check_logs.');
      results.logVerification = true;
    }

    // 5. Kiểm tra cảnh báo (Tạo 15 lỗi để vượt ngưỡng 10)
    console.log('[Test] Stress testing alerts (Creating 15 orphans)...');
    for (let i = 0; i < 15; i++) {
      await aiDbProvider.create('AiSafetyLog', {
        targetType: 'HAZARD',
        targetId: `GHOST-${i}-${Date.now()}`,
        isOrphan: false
      });
    }
    const stressReport = await IntegrityCoordinator.runFullIntegrityCheck() as any;
    if (stressReport.status === 'SUCCESS' && stressReport.summary.crossDbOrphans >= 15) {
      console.log('[Success] Alert threshold test complete. (Check console for 🚨 ALERT)');
      results.alertThreshold = true;
    }

  } catch (err) {
    console.error('[Critical] Integrity Test failed', err);
  }

  console.log('\n--- FINAL RESULTS TASK 8.3 ---');
  console.table(results);
  
  if (Object.values(results).every(v => v === true)) {
    console.log('✅ TASK 8.3 PASSED SUCCESSFULLY');
  } else {
    console.log('❌ TASK 8.3 FAILED SOME TESTS');
  }
}

runIntegrityTest().catch(console.error);
