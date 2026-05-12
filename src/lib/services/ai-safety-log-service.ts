export interface AISafetyLogEntry {
    logId: string;
    timestamp: number;
    userId: string;
    module: 'YOLO' | 'GEMMA' | 'RAG' | 'VOICE' | 'PREDICTIVE' | 'GRAPH' | 'EDGE_AI';
    inputType: 'IMAGE' | 'AUDIO' | 'TEXT' | 'DNF' | 'INSPECTION' | 'HAZARD' | 'DOC';
    inputData: any;
    aiProposal: any;
    confidenceScore?: number;
    ruleId?: string;
    promptId?: string;
    modelInfo: {
        name: string;
        version: string;
    };
    finalStatus: 'PROPOSED' | 'EDITED' | 'APPROVED' | 'REJECTED' | 'OVERRIDDEN';
    confirmedBy?: string;
    humanEditContent?: any;
    reason?: string;
}

class AISafetyLogService {
    private logs: AISafetyLogEntry[] = [];
    private accessLogs: { timestamp: number, userId: string, action: string }[] = [];

    /**
     * Ghi một entry mới vào Nhật ký an toàn
     * CHỈ GHI THÊM (APPEND ONLY) - KHÔNG CHO PHÉP SỬA/XÓA
     */
    async log(entry: Omit<AISafetyLogEntry, 'logId' | 'timestamp'>) {
        const fullEntry: AISafetyLogEntry = {
            ...entry,
            logId: `LOG-AI-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            timestamp: Date.now()
        };

        this.logs.push(Object.freeze(fullEntry)); // Đóng băng object để chống sửa đổi trong runtime
        
        console.log(`[AI-SAFETY-LOG] [SECURE] Recorded activity for module: ${entry.module}`);
        return fullEntry;
    }

    /**
     * Truy xuất log kèm theo ghi nhật ký truy cập (Access Logging)
     */
    async getLogs(userId: string, filter?: Partial<AISafetyLogEntry>) {
        this.recordAccess(userId, "VIEW_LOG_LIST");
        return [...this.logs]; // Trả về bản sao để tránh can thiệp mảng gốc
    }

    async getLogById(userId: string, logId: string) {
        this.recordAccess(userId, `VIEW_LOG_DETAIL_${logId}`);
        return this.logs.find(l => l.logId === logId);
    }

    /**
     * Ghi nhật ký mọi hành vi truy cập hoặc xuất dữ liệu
     */
    private recordAccess(userId: string, action: string) {
        const accessEntry = { timestamp: Date.now(), userId, action };
        this.accessLogs.push(accessEntry);
        console.log(`[AI-SAFETY-ACCESS] User ${userId} performed ${action}`);
    }

    /**
     * Cấm tuyệt đối các thao tác xóa/sửa
     */
    async deleteLog() { throw new Error("CRITICAL: AI Safety Log is immutable. Deletion is prohibited by policy."); }
    async updateLog() { throw new Error("CRITICAL: AI Safety Log is immutable. Modification is prohibited by policy."); }
}

export const aiSafetyLogService = new AISafetyLogService();
