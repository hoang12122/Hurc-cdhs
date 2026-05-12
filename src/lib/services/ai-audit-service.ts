import { aiDbProvider } from './db-wrapper';

/**
 * PHASE 11.0 - AI AUDIT LOGGING SERVICE
 * Ghi lại mọi quyết định của con người đối với đề xuất AI.
 */
export class AiAuditService {
  /**
   * Ghi log quyết định của người dùng
   */
  static async logDecision(params: {
    suggestionId: string;
    action: 'APPROVE' | 'REJECT';
    userId: string;
    remarks?: string;
  }) {
    const logEntry = {
      ...params,
      timestamp: new Date().toISOString(),
      source: 'HUMAN_IN_THE_LOOP',
      version: '1.0'
    };

    console.log(`[AI-AUDIT] User ${params.userId} ${params.action} suggestion ${params.suggestionId}`);
    
    // Lưu vào bảng audit_logs trong aiDb thông qua Wrapper
    try {
      await aiDbProvider.create('audit_logs', {
        action: `AI_SUGGESTION_${params.action}`,
        details: JSON.stringify(logEntry),
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Failed to persist AI Audit Log:', error);
    }

    return logEntry;
  }
}
