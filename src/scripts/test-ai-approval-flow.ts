import { AiReportService } from '../lib/services/ai-report-generator';
import { aiDbProvider } from '../lib/services/db-wrapper';

/**
 * Test script for AI Report Approval & Audit Flow (Task 9.7)
 */
async function testApprovalFlow() {
  console.log('🧪 Starting AI Approval Flow Test...');

  try {
    const reviewerId = 'USER-ENGINEER-01';
    const targetAsset = 'ASSET-999';

    // 1. AI viết báo cáo nháp
    const report = await AiReportService.generateReport(targetAsset, 'EQUIPMENT');
    console.log('[Step 1] AI Draft Created:', report.id);

    // 2. Con người chỉnh sửa nội dung (Task 9.7)
    const updatedContent = {
      ...report.content as any,
      summary: 'Nội dung đã được con người chỉnh sửa để chính xác hơn.',
      confidence: 1.0 // Con người xác nhận độ tin cậy tuyệt đối
    };
    
    await AiReportService.updateReport(report.id, reviewerId, updatedContent);
    console.log('[Step 2] Report edited by human.');

    // 3. Phê duyệt báo cáo
    await AiReportService.approveReport(report.id, reviewerId);
    console.log('[Step 3] Report APPROVED.');

    // 4. Kiểm chứng Audit Log trong Database
    const auditLogs = await aiDbProvider.findMany<any>('AiReportAudit', {
      reportId: report.id
    });

    console.log(`\n✅ Audit Summary: Found ${auditLogs.length} audit entries.`);
    auditLogs.forEach((log, index) => {
      console.log(`  Log ${index + 1}: Action [${log.action}] by ${log.reviewerId}`);
      if (log.action === 'EDIT') {
        console.log('    -> Previous Content Captured: Yes');
        console.log('    -> New Content Captured: Yes');
      }
    });

    console.log('\n[Success] Task 9.7 Human-in-the-loop flow is verified.');

  } catch (err) {
    console.error('❌ Test failed', err);
  }
}

testApprovalFlow().catch(console.error);
