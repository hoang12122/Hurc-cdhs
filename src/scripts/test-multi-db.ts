import { opsDbProvider, aiDbProvider } from '../lib/services/db-wrapper';

/**
 * TASK 8.1: Kiểm thử Multi-Prisma Instances
 */
async function runMultiDbTest() {
  console.log('--- STARTING TASK 8.1: MULTI-PRISMA INSTANCES TEST ---');
  const results = {
    opsConnection: false,
    aiConnection: false,
    isolationOps: false,
    isolationAi: false,
    concurrency: false
  };

  try {
    // 1. Kiểm tra kết nối Ops
    console.log('[Test] Testing Ops Connection...');
    const opsCount = await opsDbProvider.count('DnfDocument');
    console.log(`[Success] Ops Connected. DNF Documents: ${opsCount}`);
    results.opsConnection = true;

    // 2. Kiểm tra kết nối AI
    console.log('[Test] Testing AI Connection...');
    const aiCount = await aiDbProvider.count('AuditConsistencyCheckLog');
    console.log(`[Success] AI Connected. Consistency Logs: ${aiCount}`);
    results.aiConnection = true;

    // 3. Kiểm tra tính biệt lập (Ops không được truy cập AI)
    console.log('[Test] Verifying Isolation: Ops should NOT access AI models...');
    try {
      await (opsDbProvider as any).count('AuditConsistencyCheckLog');
      console.error('[Failure] Ops accessed AI model!');
    } catch (e) {
      console.log('[Success] Ops isolation verified. Access denied to AI schema.');
      results.isolationOps = true;
    }

    // 4. Kiểm tra tính biệt lập (AI không được truy cập Ops - Nếu Prisma Schema khác nhau)
    console.log('[Test] Verifying Isolation: AI should NOT access Ops specific models...');
    try {
      await (aiDbProvider as any).count('DnfDocument');
      console.error('[Failure] AI accessed Ops model!');
    } catch (e) {
      console.log('[Success] AI isolation verified. Access denied to Ops schema.');
      results.isolationAi = true;
    }

    // 5. Kiểm tra tính đồng thời
    console.log('[Test] Testing Concurrency...');
    await Promise.all([
      opsDbProvider.findMany('DnfDocument', {}, true),
      aiDbProvider.findMany('AuditConsistencyCheckLog', {}, true)
    ]);
    console.log('[Success] Concurrent access successful.');
    results.concurrency = true;

  } catch (err) {
    console.error('[Critical] Multi-DB Test failed', err);
  }

  console.log('\n--- FINAL RESULTS TASK 8.1 ---');
  console.table(results);
  
  if (Object.values(results).every(v => v === true)) {
    console.log('✅ TASK 8.1 PASSED SUCCESSFULLY');
  } else {
    console.log('❌ TASK 8.1 FAILED SOME TESTS');
  }
}

runMultiDbTest().catch(console.error);
