/**
 * ANTI-HALLUCINATION SERVICE (HURC1 AI-HARDENING)
 * Strict validation and self-reflection loops to ensure AI responses match CRM database facts.
 */

export interface AuditResult {
    isSafe: boolean;
    reason?: string;
}

export interface EntityAttributes {
    id: string;
    status?: string;
    priority?: string;
}

/**
 * Extract entity IDs (e.g. DNF-001, HAZ-002, etc.) using regex
 */
export function extractEntityIds(text: string): string[] {
    if (!text) return [];
    const idMatches = text.match(/(?:DNF|HAZ|INS|CA)-[A-Z0-9_-]+/gi);
    if (!idMatches) return [];
    // Normalize case and remove duplicates
    return Array.from(new Set(idMatches.map(id => id.toUpperCase())));
}

/**
 * Extract key attributes for a specific ID from the context string
 */
export function extractAttributesForId(id: string, context: string): EntityAttributes {
    const attrs: EntityAttributes = { id };
    if (!context) return attrs;

    const idUpper = id.toUpperCase();
    const index = context.toUpperCase().indexOf(idUpper);
    if (index === -1) return attrs;

    // Grab a chunk of 500 characters around the ID in the context to parse attributes
    const chunk = context.substring(index, Math.min(index + 500, context.length));

    // 1. Parse Status (Trạng thái)
    // Matches: "status": "active" OR "- Status: Mới" or "Trạng thái: Đang xử lý"
    const statusMatch = chunk.match(/(?:status|trạng thái|trạng thái:)\s*["'\s:-]*\s*([\w\d\s\u00C0-\u1EF9()]+)/i);
    if (statusMatch) {
        attrs.status = statusMatch[1].trim().replace(/["',]/g, '');
    }

    // 2. Parse Priority (Độ ưu tiên)
    // Matches: "priority": "Cao" OR "- Priority: Thấp" or "Độ ưu tiên: Cao"
    const priorityMatch = chunk.match(/(?:priority|độ ưu tiên|độ ưu tiên:)\s*["'\s:-]*\s*([\w\d\s\u00C0-\u1EF9()]+)/i);
    if (priorityMatch) {
        attrs.priority = priorityMatch[1].trim().replace(/["',]/g, '');
    }

    return attrs;
}

/**
 * Audit AI response against query and context
 */
export async function auditResponse(query: string, response: string, context: string): Promise<AuditResult> {
    if (!response) {
        return { isSafe: false, reason: "Phản hồi rỗng." };
    }

    const responseIds = extractEntityIds(response);
    const contextIds = extractEntityIds(context);
    const queryIds = extractEntityIds(query);

    // 1. CHECK FOR HALLUCINATED IDs (IDs mentioned in response but not in context or query)
    for (const id of responseIds) {
        if (!contextIds.includes(id) && !queryIds.includes(id)) {
            return { 
                isSafe: false, 
                reason: `Phát hiện mã thực thể giả mạo (hallucinated ID) không tồn tại trong dữ liệu hệ thống: ${id}` 
            };
        }
    }

    // 2. CHECK FOR FALSE REFUSAL (Database has info, but AI claims it doesn't know)
    const lowerResp = response.toLowerCase();
    const hasRelevantData = contextIds.some(id => queryIds.includes(id) || query.toUpperCase().includes(id));
    if (hasRelevantData && (
        lowerResp.includes("tôi không biết") || 
        lowerResp.includes("không có thông tin") || 
        lowerResp.includes("không tìm thấy dữ liệu") || 
        lowerResp.includes("không thể trả lời")
    )) {
        return { 
            isSafe: false, 
            reason: "Phát hiện lỗi từ chối sai (False Refusal): Cơ sở dữ liệu có thông tin về thực thể được hỏi nhưng AI trả lời là không có/không biết." 
        };
    }

    // 3. CHECK FOR CONTRADICTION OF ATTRIBUTES (Status, Priority mismatch)
    for (const id of responseIds) {
        const actual = extractAttributesForId(id, context);
        if (!actual.status) continue;

        const statusLower = actual.status.toLowerCase();
        
        // Check closed mismatch
        if (statusLower.includes("đóng") || statusLower.includes("closed") || statusLower.includes("hủy")) {
            if (lowerResp.includes("chưa đóng") || 
                lowerResp.includes("đang mở") || 
                lowerResp.includes("chưa giải quyết") || 
                lowerResp.includes("đang xử lý")) {
                return { 
                    isSafe: false, 
                    reason: `Phát hiện mâu thuẫn thông tin: Thực thể ${id} đã đóng/hủy trong cơ sở dữ liệu thực tế nhưng câu trả lời AI ghi là đang mở/chưa giải quyết/đang xử lý.` 
                };
            }
        }

        // Check active mismatch
        if (statusLower.includes("mới") || statusLower.includes("đang xử lý") || statusLower.includes("open") || statusLower.includes("pending")) {
            if (lowerResp.includes(`thực thể ${id.toLowerCase()} đã đóng`) || 
                lowerResp.includes(`sự cố ${id.toLowerCase()} đã đóng`) || 
                lowerResp.includes(`đã được giải quyết hoàn toàn`)) {
                return { 
                    isSafe: false, 
                    reason: `Phát hiện mâu thuẫn thông tin: Thực thể ${id} chưa đóng (đang xử lý/mới) trong cơ sở dữ liệu thực tế nhưng câu trả lời AI ghi là đã giải quyết/đã đóng.` 
                };
            }
        }
    }

    // 4. CHECK FOR MISSING CITATION
    for (const qId of queryIds) {
        if (contextIds.includes(qId) && !responseIds.includes(qId)) {
            return {
                isSafe: false,
                reason: `Phát hiện thiếu trích dẫn nguồn: Câu hỏi hỏi trực tiếp về ${qId} có sẵn dữ liệu nhưng câu trả lời không nhắc đến mã thực thể này.`
            };
        }
    }

    return { isSafe: true };
}

/**
 * Generate safe, deterministic fallback response by parsing the context thâu
 */
export function generateSafeFallbackResponse(query: string, context: string): string {
    const queryIds = extractEntityIds(query).concat(extractEntityIds(context));
    const uniqueIds = Array.from(new Set(queryIds));

    if (uniqueIds.length === 0) {
        return "⚠️ [CHẾ ĐỘ AN TOÀN - HỆ THỐNG BẢO VỆ]\n\nHệ thống phát hiện mâu thuẫn thông tin liên tục khi tạo câu trả lời và đã kích hoạt Chế độ An toàn (Safe-Mode). Vui lòng kiểm tra lại câu hỏi hoặc truy cập hồ sơ chi tiết để có thông tin chính xác.";
    }

    let fallbackMsg = "⚠️ [CHẾ ĐỘ AN TOÀN - TRỰC TIẾP TRUY XUẤT CSDL]\n";
    fallbackMsg += "Hệ thống phát hiện khả năng ảo tưởng thông tin từ mô hình AI nên đã tự động chuyển sang trích xuất dữ liệu trực tiếp từ cơ sở dữ liệu:\n\n";

    let foundInfo = false;
    for (const id of uniqueIds) {
        const attrs = extractAttributesForId(id, context);
        // If we can't find it in the context, skip
        if (context.toUpperCase().indexOf(id) === -1) continue;

        foundInfo = true;
        fallbackMsg += `### Thực thể: ${id}\n`;
        if (attrs.status) fallbackMsg += `- Trạng thái thực tế: **${attrs.status}**\n`;
        if (attrs.priority) fallbackMsg += `- Độ ưu tiên thực tế: **${attrs.priority}**\n`;

        // Search context for description lines of this ID
        const lines = context.split('\n');
        const idLineIndex = lines.findIndex(l => l.toUpperCase().includes(id));
        if (idLineIndex !== -1) {
            const descLines = lines.slice(idLineIndex + 1, idLineIndex + 8);
            descLines.forEach(l => {
                const trimmed = l.trim();
                if ((trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.includes(':')) && 
                    !trimmed.toLowerCase().includes("report id") && 
                    !trimmed.toLowerCase().includes("hazard id")) {
                    fallbackMsg += `${l}\n`;
                }
            });
        }
        fallbackMsg += "\n";
    }

    if (!foundInfo) {
        return "⚠️ [CHẾ ĐỘ AN TOÀN - BẢO VỆ]\n\nKhông tìm thấy thông tin phù hợp với mã sự cố được yêu cầu trong cơ sở dữ liệu.";
    }

    return fallbackMsg.trim();
}

/**
 * Execute the Self-Reflection Loop with retry
 */
export async function runReflectionLoop(
    query: string,
    initialResponse: string,
    context: string,
    systemPrompt: string,
    askFn: (prompt: string, options?: any) => Promise<string>
): Promise<string> {
    let currentResponse = initialResponse;
    let reflectionCount = 0;
    const MAX_REFLECTION_RETRY = 3;

    while (reflectionCount < MAX_REFLECTION_RETRY) {
        const audit = await auditResponse(query, currentResponse, context);
        if (audit.isSafe) {
            return currentResponse;
        }

        console.warn(`⚠️ [ANTI-HALLUCINATION] Hallucination detected: "${audit.reason}" (Attempt ${reflectionCount + 1}). Triggering AI rewrite...`);

        const correctionPrompt = `
[BÁO CÁO KIỂM DUYỆT HỆ THỐNG]
Hệ thống phát hiện câu trả lời trước của bạn có lỗi ảo tưởng (hallucination) hoặc mâu thuẫn dữ liệu:
-> Lý do lỗi: ${audit.reason}

[YÊU CẦU NGHIÊM NGẶT]
Hãy viết lại câu trả lời chính xác 100% dựa trên NGỮ CẢNH HỆ THỐNG đã cung cấp bên dưới.
- KHÔNG tự ý bịa đặt hoặc thay đổi mã sự cố (ví dụ DNF-XXX, HAZ-XXX) không có trong ngữ cảnh.
- Đảm bảo các thuộc tính như Trạng thái (status) hoặc Độ ưu tiên (priority) trùng khớp hoàn toàn với dữ liệu thực tế dưới đây.
- Nếu không tìm thấy thông tin của thực thể trong ngữ cảnh, hãy trả lời rõ: "Không tìm thấy thông tin phù hợp trong cơ sở dữ liệu".

[NGỮ CẢNH DỮ LIỆU THỰC TẾ]
${context}

[CÂU HỎI CỦA NGƯỜI DÙNG]
${query}

[CÂU TRẢ LỜI BỊ LỖI TRƯỚC ĐÓ]
${currentResponse}
`.trim();

        currentResponse = await askFn(correctionPrompt, { temperature: 0.1 });
        reflectionCount++;
    }

    // Fallback if AI cannot fix itself after maximum retries
    console.error("❌ [ANTI-HALLUCINATION] Max reflection attempts reached. Triggering Safe-Mode Fallback.");
    return generateSafeFallbackResponse(query, context);
}
