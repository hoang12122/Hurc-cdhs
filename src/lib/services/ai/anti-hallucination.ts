/**
 * ANTI-HALLUCINATION SERVICE (HURC1 AI-HARDENING)
 * Strict validation and self-reflection loops to ensure AI responses match CRM database facts.
 */

export const STRICT_CONSTRAINT = `
[LƯU Ý AN TOÀN QUAN TRỌNG - CHẾ ĐỘ CỐ VẤN THỤ ĐỘNG & CHỈ ĐỌC (READ-ONLY)]
1. VAI TRÒ CHÍNH (READ-ONLY): Bạn là một CỐ VẤN THỤ ĐỘNG (Advisory Only). Bạn tuyệt đối KHÔNG bao giờ được tự ý can thiệp trực tiếp, không ghi, sửa, tạo mới hoặc xóa bất kỳ dữ liệu cấu hình hay bản ghi nào của hệ thống. Bạn KHÔNG được thực hiện các hành động thay đổi trạng thái hệ thống.
2. NGUYÊN TẮC HOẠT ĐỘNG: Quyền hạn của bạn chỉ được phép: Ghi nhận thông tin, Học hỏi từ ngữ cảnh, và đưa ra Gợi ý/Đề xuất giải pháp ở mức độ siêu tinh vi, chính xác nhất để người vận hành (con người) xem xét và tự thực hiện thủ công.
3. CHỐNG ẢO TƯỞNG (ANTI-HALLUCINATION):
- Trả lời chính xác 100% dựa vào dữ liệu ngữ cảnh thực tế được cung cấp.
- Tuyệt đối không bịa đặt hoặc tự động thay đổi mã sự cố, mã mối nguy, mã kiểm tra (ví dụ DNF-XXX, HAZ-XXX, INS-XXX).
- Trạng thái, mức độ ưu tiên và các thông tin liên quan phải trùng khớp hoàn toàn với dữ liệu thực tế. Nếu không tìm thấy dữ liệu, phải báo rõ "Không tìm thấy thông tin phù hợp trong cơ sở dữ liệu". Không phỏng đoán, không bịa đặt.
4. TỐI ƯU HÓA NGỮ CẢNH: Hệ thống tự động thu gọn lịch sử khi vượt giới hạn để đảm bảo token được cập nhật và kiểm soát tối ưu.
`.trim();

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
    let chunk = context.substring(index, Math.min(index + 500, context.length));

    // Truncate chunk at the next entity ID to prevent attribute leakage from other entities
    const nextEntityMatches = chunk.substring(id.length).match(/(?:DNF|HAZ|INS|CA)-[A-Z0-9_-]+/i);
    if (nextEntityMatches && nextEntityMatches.index !== undefined) {
        chunk = chunk.substring(0, id.length + nextEntityMatches.index);
    }

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
 * Check if a matched keyword is negated in the response chunk to avoid false positives (e.g. "không còn đang xử lý" is NOT asserting "đang xử lý")
 */
function isNegated(chunk: string, keyword: string): boolean {
    const index = chunk.toLowerCase().indexOf(keyword.toLowerCase());
    if (index === -1) return false;
    const before = chunk.substring(Math.max(0, index - 30), index).toLowerCase();
    // Match negation words as complete words/phrases using regex to avoid sub-word matching (e.g., "chương" matching "chưa")
    return /(?:^|\s|[^a-z\u00C0-\u1EF9])(chưa|không|không còn|chưa được)(?:\s|$|[^a-z\u00C0-\u1EF9])/i.test(before);
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
        const idLower = id.toLowerCase();
        const idIndex = lowerResp.indexOf(idLower);
        
        if (idIndex !== -1) {
            // Check a window of 100 characters before and after the ID in response
            const windowStart = Math.max(0, idIndex - 100);
            const windowEnd = Math.min(lowerResp.length, idIndex + 100);
            const responseChunk = lowerResp.substring(windowStart, windowEnd);

            // Check closed mismatch
            if (statusLower.includes("đóng") || statusLower.includes("closed") || statusLower.includes("hủy")) {
                const assertsOpen = 
                    responseChunk.includes("chưa đóng") || 
                    responseChunk.includes("đang mở") || 
                    responseChunk.includes("chưa giải quyết") || 
                    (responseChunk.includes("đang xử lý") && !isNegated(responseChunk, "đang xử lý")) ||
                    responseChunk.includes("chưa được giải quyết");

                if (assertsOpen) {
                    return { 
                        isSafe: false, 
                        reason: `Phát hiện mâu thuẫn thông tin: Thực thể ${id} đã đóng/hủy trong cơ sở dữ liệu thực tế nhưng câu trả lời AI ghi là chưa đóng/đang mở/đang xử lý.` 
                    };
                }
            }

            // Check active mismatch
            if (statusLower.includes("mới") || statusLower.includes("đang xử lý") || statusLower.includes("open") || statusLower.includes("pending")) {
                const assertsClosed = 
                    (responseChunk.includes("đã đóng") && !isNegated(responseChunk, "đã đóng")) || 
                    (responseChunk.includes("đã được đóng") && !isNegated(responseChunk, "đã được đóng")) || 
                    (responseChunk.includes("đã giải quyết") && !isNegated(responseChunk, "đã giải quyết")) ||
                    (responseChunk.includes("giải quyết xong") && !isNegated(responseChunk, "giải quyết xong")) ||
                    (responseChunk.includes("hoàn thành") && !isNegated(responseChunk, "hoàn thành")) ||
                    (responseChunk.includes("đã xử lý xong") && !isNegated(responseChunk, "đã xử lý xong"));

                if (assertsClosed) {
                    return { 
                        isSafe: false, 
                        reason: `Phát hiện mâu thuẫn thông tin: Thực thể ${id} chưa đóng (đang xử lý/mới) trong cơ sở dữ liệu thực tế nhưng câu trả lời AI ghi là đã giải quyết/đã đóng.` 
                    };
                }
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
    const queryIds = extractEntityIds(query);
    const contextIds = extractEntityIds(context);
    // Prioritize IDs mentioned in the query; fall back to all context IDs if none are specified
    const targetIds = queryIds.length > 0 
        ? queryIds.filter(id => contextIds.includes(id)) 
        : contextIds;
    const uniqueIds = Array.from(new Set(targetIds));

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
            for (const l of descLines) {
                const trimmed = l.trim();
                // Stop if we hit a line containing another entity ID to prevent description leakage
                const entityMatches = trimmed.match(/(?:DNF|HAZ|INS|CA)-[A-Z0-9_-]+/gi);
                const containsOtherEntity = entityMatches && entityMatches.some(matchId => matchId.toUpperCase() !== id.toUpperCase());
                if (containsOtherEntity) {
                    break;
                }
                
                if ((trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.includes(':')) && 
                    !trimmed.toLowerCase().includes("report id") && 
                    !trimmed.toLowerCase().includes("hazard id")) {
                    fallbackMsg += `${l}\n`;
                }
            }
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

export interface NcChatMessage {
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string | null;
    [key: string]: any;
}

/**
 * Quản lý ngữ cảnh thông minh, tự động nén/thu gọn các tool output quá dài và kiểm soát số lượng token
 */
export function manageAgentContext(history: NcChatMessage[]): NcChatMessage[] {
    const threshold = 25000;
    const processedHistory = history.map(msg => {
        if (msg.content && msg.content.length > 5000) {
            const truncatedContent = msg.content.substring(0, 2000) + 
                "\n\n... [NỘI DUNG ĐƯỢC TỰ ĐỘNG THU GỌN ĐỂ TỐI ƯU HÓA TOKEN / CONTEXT WINDOW] ...\n\n" + 
                msg.content.substring(msg.content.length - 2000);
            return {
                ...msg,
                content: truncatedContent
            };
        }
        return msg;
    });

    const newTotalChars = processedHistory.reduce((acc, msg) => acc + (msg.content?.length || 0), 0);
    if (newTotalChars <= threshold) {
        return processedHistory;
    }

    const systemMsgs = processedHistory.filter(m => m.role === 'system');
    const recentMsgs = processedHistory.slice(-6);
    const filteredRecent = recentMsgs.filter(m => m.role !== 'system');
    
    return [
        ...systemMsgs,
        { role: 'assistant' as const, content: "[HỆ THỐNG]: Lịch sử hội thoại đã được tự động nén để tiết kiệm token và tránh tràn cửa sổ ngữ cảnh." },
        ...filteredRecent
    ];
}
