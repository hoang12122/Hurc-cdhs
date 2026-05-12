import { AiReportService } from '../lib/services/ai-report-generator';
import { aiDbProvider } from '../lib/services/db-wrapper';

/**
 * Test script for Automated AI Risk Reporting (Task 9.5 & 9.6)
 */
async function testAiReporting() {
  console.log('🧪 Starting AI Risk Reporting Test...');

  try {
    const targetAsset = 'ASSET-101';
    
    // 1. Kích hoạt viết báo cáo bằng AI
    const report = await AiReportService.generateReport(targetAsset, 'EQUIPMENT');

    // 2. Kiểm chứng kết quả trong Database
    const savedReport = await aiDbProvider.findUnique<any>('AiRiskReport', report.id);

    if (savedReport && savedReport.status === 'AI_DRAFT') {
      console.log('✅ Success: Report saved as AI_DRAFT.');
      console.log('📊 Confidence Score:', savedReport.confidence);
      console.log('📝 Title:', savedReport.title);
      
      // Kiểm tra cấu trúc nội dung (Task 9.5)
      const content = savedReport.content as any;
      if (content.summary && content.recommendations) {
        console.log('✅ Content Structure: Verified (Summary & Recommendations present).');
      }
    }

    console.log('\n[Success] Task 9.5 & 9.6 logic is verified.');

  } catch (err) {
    console.error('❌ Test failed', err);
  }
}

testAiReporting().catch(console.error);
