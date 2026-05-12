import { aiSafetyLogService } from "./ai-safety-log-service";
import { AI_SAFETY_RULES } from "../config/ai-safety-rules";

export type AIVerificationStatus = 'PROPOSED' | 'APPROVED' | 'REJECTED' | 'EDITED' | 'OVERRIDDEN';
export type AIRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AIVerificationLog {
    id: string;
    targetId: string;
    module: 'YOLO' | 'GEMMA' | 'RAG' | 'VOICE' | 'PREDICTIVE' | 'GRAPH';
    riskLevel: AIRiskLevel;
    requiredRole: string[]; // Các vai trò có quyền phê duyệt
    aiProposedContent: any;
    finalContent: any;
    status: AIVerificationStatus;
    verifiedBy: string;
    verifiedAt: number;
    reason?: string;
    modelVersion?: string;
}

class AIVerificationService {
    private logs: AIVerificationLog[] = [];

    /**
     * Ghi nhận một đề xuất mới từ AI
     */
    async propose(module: AIVerificationLog['module'], targetId: string, content: any, riskLevel: AIRiskLevel = 'MEDIUM', requiredRole: string[] = ['MANAGER'], modelVersion?: string) {
        const log: AIVerificationLog = {
            id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
            targetId,
            module,
            riskLevel,
            requiredRole,
            aiProposedContent: content,
            finalContent: null,
            status: 'PROPOSED',
            verifiedBy: '',
            verifiedAt: 0,
            modelVersion
        };
        
        this.logs.push(log);
        console.log(`[AI-VERIFY] New proposal from ${module} for target ${targetId}`);
        return log;
    }

    /**
     * Xác nhận kết quả AI (Approve)
     */
    async approve(logId: string, userId: string) {
        const log = this.logs.find(l => l.id === logId);
        if (!log) throw new Error('Log not found');

        log.status = 'APPROVED';
        log.finalContent = log.aiProposedContent;
        log.verifiedBy = userId;
        log.verifiedAt = Date.now();
        
        // Ghi vào AI Safety Log
        await aiSafetyLogService.log({
            userId,
            module: log.module,
            inputType: 'TEXT',
            inputData: log.targetId,
            aiProposal: log.aiProposedContent,
            modelInfo: { name: 'Gemma-2b-IT', version: log.modelVersion || '1.0' },
            finalStatus: 'APPROVED',
            confirmedBy: userId
        });

        return log;
    }

    /**
     * Chỉnh sửa kết quả AI (Edit)
     */
    async edit(logId: string, userId: string, newContent: any, reason?: string) {
        const log = this.logs.find(l => l.id === logId);
        if (!log) throw new Error('Log not found');

        log.status = 'EDITED';
        log.finalContent = newContent;
        log.verifiedBy = userId;
        log.verifiedAt = Date.now();
        log.reason = reason;

        // Ghi vào AI Safety Log
        await aiSafetyLogService.log({
            userId,
            module: log.module,
            inputType: 'TEXT',
            inputData: log.targetId,
            aiProposal: log.aiProposedContent,
            humanEditContent: newContent,
            modelInfo: { name: 'Gemma-2b-IT', version: log.modelVersion || '1.0' },
            finalStatus: 'EDITED',
            confirmedBy: userId,
            reason
        });
        
        return log;
    }

    /**
     * Từ chối kết quả AI (Reject)
     */
    async reject(logId: string, userId: string, reason: string) {
        const log = this.logs.find(l => l.id === logId);
        if (!log) throw new Error('Log not found');

        log.status = 'REJECTED';
        log.verifiedBy = userId;
        log.verifiedAt = Date.now();
        log.reason = reason;

        // Ghi vào AI Safety Log
        await aiSafetyLogService.log({
            userId,
            module: log.module,
            inputType: 'TEXT',
            inputData: log.targetId,
            aiProposal: log.aiProposedContent,
            modelInfo: { name: 'Gemma-2b-IT', version: log.modelVersion || '1.0' },
            finalStatus: 'REJECTED',
            confirmedBy: userId,
            reason
        });
        
        return log;
    }

    async getLogsByTarget(targetId: string) {
        return this.logs.filter(l => l.targetId === targetId);
    }
}

export const aiVerificationService = new AIVerificationService();
