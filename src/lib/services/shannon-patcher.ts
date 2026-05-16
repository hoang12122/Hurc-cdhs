import { askAI } from './ai';
import fs from 'fs';
import path from 'path';

/**
 * SHANNON SECURITY PATCHER
 * Tự học và phân tích lỗ hổng logic, tự động đề xuất vá lỗi
 * Tuân thủ "Rule Bất Định": Không ảnh hưởng đến hoạt động cơ bản của hệ thống.
 */

export interface VulnerabilityReport {
    id: string;
    target: string;
    threatType: 'logic_leak' | 'data_integrity' | 'auth_bypass';
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
    patchDraft: string;
    timestamp: string;
}

export async function runShannonAudit(filePaths: string[]): Promise<VulnerabilityReport[]> {
    const reports: VulnerabilityReport[] = [];

    for (const filePath of filePaths) {
        if (!fs.existsSync(filePath)) continue;
        
        const content = fs.readFileSync(filePath, 'utf-8');
        const fileName = path.basename(filePath);

        const prompt = `Bạn là Shannon - Chuyên gia bảo mật AI. 
        Hãy phân tích file sau để tìm các lỗ hổng logic hoặc rủi ro rò rỉ dữ liệu:
        
        [FILE: ${fileName}]
        ${content.substring(0, 5000)} // Giới hạn context
        
        Yêu cầu:
        1. Tìm các đoạn code thiếu kiểm tra quyền (auth checks).
        2. Tìm các đoạn code có thể gây tràn bộ nhớ hoặc lỗi logic.
        3. Đề xuất bản vá (patch) cực kỳ an toàn, không làm thay đổi luồng hoạt động chính.
        
        Trả về định dạng JSON: { "threatType": "...", "severity": "...", "description": "...", "patchDraft": "..." }`;

        try {
            const aiResponse = await askAI(prompt, { systemPrompt: "Bạn là chuyên gia bảo mật Shannon. Chỉ tập trung vào bảo mật và tính ổn định." });
            const analysis = JSON.parse(aiResponse.substring(aiResponse.indexOf('{'), aiResponse.lastIndexOf('}') + 1));
            
            reports.push({
                id: `vult-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                target: fileName,
                ...analysis,
                timestamp: new Date().toISOString()
            });
        } catch (e) {
            console.error(`Shannon audit failed for ${fileName}:`, e);
        }
    }

    return reports;
}

/**
 * RULE BẤT ĐỊNH: Vá lỗi an toàn
 */
export async function applyShannonPatch(report: VulnerabilityReport): Promise<boolean> {
    console.log(`[SHANNON] Applying safety patch for ${report.id}: ${report.description}`);
    // Trong thực tế, đây sẽ là logic ghi đè file an toàn sau khi đã được human approve.
    // Hiện tại chúng ta log ra để CEO xem xét.
    return true;
}
