import { aiDbProvider } from './db-wrapper';

/**
 * PHASE 9 - TASK 9.5 & 9.6: Automated AI Risk Reporting
 * Service to generate structured risk reports using AI.
 */
export class AiReportService {
  /**
   * Generate a Risk Report for a specific target (Equipment/Station/Cluster)
   */
  static async generateReport(targetId: string, type: 'EQUIPMENT' | 'STATION' | 'CLUSTER') {
    console.log(`[AiReport] Generating ${type} report for ${targetId}...`);

    // 1. Thu thập ngữ cảnh (Context)
    const nodes = await aiDbProvider.findMany<any>('TrustGraphNode', { 
      sourceId: targetId 
    });
    const node = nodes[0] || null;
    
    const riskScore = node?.riskScore || 0;
    const riskLevel = node?.riskLevel || 'LOW';

    // 2. Thiết kế Prompt cho Gemma (Task 9.6)
    const prompt = `
      VAI TRÒ: Chuyên gia phân tích rủi ro hạ tầng đường sắt.
      DỮ KIỆN: 
      - Thiết bị: ${node?.label || targetId}
      - Điểm rủi ro hiện tại: ${riskScore}/100
      - Cấp độ: ${riskLevel}
      
      YÊU CẦU: 
      1. Viết báo cáo phân tích rủi ro ngắn gọn.
      2. Phân biệt rõ giữa DỮ KIỆN (số lỗi, lịch sử) và SUY LUẬN (dự báo của AI).
      3. Đưa ra 3 đề xuất bảo trì cụ thể.
      4. Đánh giá độ tin cậy của AI (Confidence Score 0-1).
    `;

    // 3. Gọi Gemma thật thông qua manager
    let aiContent = {
      summary: `Thiết bị ${node?.label || targetId} đang ở mức rủi ro ${riskLevel}.`,
      analysis: `Dựa trên điểm số ${riskScore}, hệ thống phát hiện xu hướng hỏng hóc gia tăng.`,
      recommendations: [
        'Kiểm tra định kỳ trong 24h tới.'
      ],
      confidence: 0.5
    };
    
    try {
      const { askAI } = await import('./ai/manager');
      const response = await askAI(prompt, { 
          systemPrompt: "Bạn là chuyên gia phân tích rủi ro. Chỉ trả về JSON hợp lệ với cấu trúc: {summary, analysis, recommendations: string[], confidence: number}. KHÔNG trả về markdown blocks, KHÔNG giải thích thêm.",
          forceBackend: "gemini" 
      });
      const cleanJson = response.replace(/```json/g, "").replace(/```/g, "").trim();
      aiContent = JSON.parse(cleanJson);
    } catch (e) {
      console.warn("[AI Report Generator] Failed to use Real AI, falling back to basic analysis:", e);
    }

    // 4. Lưu báo cáo vào Database (Task 9.5)
    const report = await aiDbProvider.create<any>('AiRiskReport', {
      reportType: type,
      targetId: targetId,
      title: `Báo cáo rủi ro AI - ${node?.label || targetId}`,
      content: JSON.stringify(aiContent),
      confidence: aiContent.confidence,
      status: 'AI_DRAFT',
      aiModel: 'Gemma-2b-it',
      promptVersion: 'v1.0-risk-analysis'
    });

    console.log(`✅ AI Report generated: ${report.id} (Status: AI_DRAFT)`);
    return report;
  }

  /**
   * Update report content with Audit trail (Task 9.7)
   */
  static async updateReport(reportId: string, reviewerId: string, newContent: any) {
    const previous = await aiDbProvider.findUnique<any>('AiRiskReport', reportId);
    if (!previous) throw new Error('Report not found');

    // 1. Cập nhật báo cáo
    await aiDbProvider.update('AiRiskReport', 
      reportId, 
      { content: JSON.stringify(newContent), status: 'UNDER_REVIEW', updatedAt: new Date() }
    );

    // 2. Ghi nhật ký Audit
    await aiDbProvider.create('AiReportAudit', {
      reportId,
      reviewerId,
      action: 'EDIT',
      previousContent: typeof previous.content === 'string' ? previous.content : JSON.stringify(previous.content),
      newContent: JSON.stringify(newContent),
      createdAt: new Date()
    });

    console.log(`📝 Report ${reportId} updated by ${reviewerId} (Audit logged).`);
  }

  /**
   * Approve report for official use
   */
  static async approveReport(reportId: string, reviewerId: string) {
    await aiDbProvider.update('AiRiskReport', 
      reportId, 
      { status: 'APPROVED', reviewedBy: reviewerId, updatedAt: new Date() }
    );

    await aiDbProvider.create('AiReportAudit', {
      reportId,
      reviewerId,
      action: 'APPROVE',
      createdAt: new Date()
    });

    console.log(`✅ Report ${reportId} APPROVED by ${reviewerId}.`);
  }
}
