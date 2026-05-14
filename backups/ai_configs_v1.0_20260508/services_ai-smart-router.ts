// @ts-nocheck
/**
 * AI Smart Router
 * Classifies user queries and routes them to the optimal AI backend:
 * - GraphRAG: Relationship & entity queries
 * - DocumentRAG: Document-specific questions
 * - Agent: Complex multi-step reasoning
 * - TextCompletion: Simple Q&A
 */

export type QueryIntent = 'graph_rag' | 'document_rag' | 'agent' | 'text_completion';

interface ClassificationResult {
    intent: QueryIntent;
    confidence: number;
    reason: string;
}

// Patterns for each query type
const GRAPH_RAG_PATTERNS = [
    /mối quan hệ|liên quan|kết nối|ảnh hưởng|tác động|phụ thuộc/i,
    /relationship|related|connected|impact|depend|link/i,
    /giữa.*và|between.*and/i,
    /nguyên nhân.*gốc|root.*cause/i,
    /chuỗi|chain|path|đường dẫn/i,
    /sơ đồ|graph|map|biểu đồ quan hệ/i,
    /how.*connected|cách.*liên kết/i,
    /cross.*reference|tham chiếu chéo/i,
    /pattern|mẫu.*lặp|recurring/i,
];

const DOCUMENT_RAG_PATTERNS = [
    /tài liệu|document|file|báo cáo|report/i,
    /quy trình|procedure|standard|tiêu chuẩn/i,
    /hướng dẫn|guide|manual|instruction/i,
    /quy định|regulation|policy|chính sách/i,
    /tìm.*trong|search.*in|look.*up/i,
    /theo.*tài liệu|according.*to/i,
    /trích dẫn|quote|cite|reference/i,
    /nội dung|content|chi tiết/i,
];

const AGENT_PATTERNS = [
    /phân tích.*toàn diện|comprehensive.*analysis/i,
    /lập kế hoạch|plan|strategy|chiến lược/i,
    /so sánh.*và.*đề xuất|compare.*recommend/i,
    /đánh giá.*rủi ro|risk.*assessment/i,
    /tổng hợp|synthesize|summarize.*multiple/i,
    /dự báo|forecast|predict|prediction/i,
    /hãy.*giải thích.*tại sao|explain.*why/i,
    /bước.*tiếp theo|next.*step|action.*plan/i,
    /đề xuất.*giải pháp|suggest.*solution/i,
    /debug|troubleshoot|diagnose|khắc phục/i,
];

/**
 * Classify query intent to determine optimal AI backend
 */
export function classifyQueryIntent(query: string): ClassificationResult {
    const normalizedQuery = query.trim().toLowerCase();

    // Score each intent
    const scores: Record<QueryIntent, number> = {
        graph_rag: 0,
        document_rag: 0,
        agent: 0,
        text_completion: 0,
    };

    // Check GraphRAG patterns
    for (const pattern of GRAPH_RAG_PATTERNS) {
        if (pattern.test(normalizedQuery)) scores.graph_rag += 2;
    }

    // Check DocumentRAG patterns
    for (const pattern of DOCUMENT_RAG_PATTERNS) {
        if (pattern.test(normalizedQuery)) scores.document_rag += 2;
    }

    // Check Agent patterns
    for (const pattern of AGENT_PATTERNS) {
        if (pattern.test(normalizedQuery)) scores.agent += 2;
    }

    // Query length heuristic: longer queries suggest complex reasoning
    if (normalizedQuery.length > 200) scores.agent += 1;
    if (normalizedQuery.length < 50) scores.text_completion += 1;

    // Question mark count: more = more complex
    const questionMarks = (normalizedQuery.match(/\?/g) || []).length;
    if (questionMarks > 1) scores.agent += 1;

    // Default base score for text completion (simple fallback)
    scores.text_completion += 1;

    // Find highest scoring intent
    const entries = Object.entries(scores) as [QueryIntent, number][];
    entries.sort((a, b) => b[1] - a[1]);

    const [topIntent, topScore] = entries[0];
    const totalScore = entries.reduce((sum, [, s]) => sum + s, 0);
    const confidence = totalScore > 0 ? topScore / totalScore : 0.25;

    const reasons: Record<QueryIntent, string> = {
        graph_rag: 'Query involves relationships, connections, or entity analysis',
        document_rag: 'Query seeks information from documents or standards',
        agent: 'Query requires complex reasoning, planning, or multi-step analysis',
        text_completion: 'Simple question suitable for direct LLM response',
    };

    return {
        intent: topIntent,
        confidence: Math.round(confidence * 100) / 100,
        reason: reasons[topIntent],
    };
}

/**
 * Suggest the best collection based on query content
 */
export function suggestCollection(query: string): string {
    const q = query.toLowerCase();

    if (/dnf|failure|lỗi|sự cố|hỏng/i.test(q)) return 'hurc-dnf';
    if (/hazard|nguy|risk|rủi ro|an toàn/i.test(q)) return 'hurc-hazards';
    if (/inspect|kiểm tra|audit|thanh tra/i.test(q)) return 'hurc-inspections';
    if (/maintenance|bảo trì|bảo dưỡng|sửa chữa/i.test(q)) return 'hurc-maintenance';
    if (/standard|tiêu chuẩn|quy trình|procedure/i.test(q)) return 'hurc-standards';

    return 'hurc-general';
}

/**
 * Format CRM data as context for TrustGraph ingestion
 */
export function formatCrmDataForIngestion(type: 'dnf' | 'hazard' | 'inspection', record: any): string {
    switch (type) {
        case 'dnf':
            return [
                `Failure Report: ${record.failureReportNo || record.id}`,
                `Status: ${record.status}`,
                `Location: ${record.locationOfFailure || 'N/A'}`,
                `Description: ${record.descriptionOfFailure || 'N/A'}`,
                `Priority: ${record.priority || 'N/A'}`,
                `Impact: ${record.impactAssessment || 'N/A'}`,
                `Resolution: ${record.resolutionDetails || 'Pending'}`,
                record.correctiveActions?.length > 0
                    ? `Corrective Actions: ${record.correctiveActions.map((ca: any) => `[${ca.status}] ${ca.description}`).join('; ')}`
                    : '',
            ].filter(Boolean).join('\n');

        case 'hazard':
            return [
                `Hazard Record: ${record.id}`,
                `Status: ${record.status}`,
                `Description: ${record.description || 'N/A'}`,
                `Potential Consequence: ${record.potentialConsequence || 'N/A'}`,
                `Current Controls: ${record.currentControls || 'N/A'}`,
                `Risk Level: ${record.riskLevelId || 'N/A'}`,
            ].filter(Boolean).join('\n');

        case 'inspection':
            return [
                `Inspection: ${record.title || record.id}`,
                `Status: ${record.status}`,
                `Inspector: ${record.inspector || 'N/A'}`,
                `Notes: ${record.generalNotes || 'N/A'}`,
            ].filter(Boolean).join('\n');

        default:
            return JSON.stringify(record, null, 2);
    }
}

// ============ INTENT REFINEMENT (for precise, non-rambling responses) ============

export type QueryFocus = 'dnf' | 'hazard' | 'inspection' | 'maintenance' | 'asset' | 'user' | 'analytics' | 'general';

/**
 * Extract specific data focus from query — what EXACTLY is the user asking about?
 */
export function extractQueryFocus(query: string): { focus: QueryFocus; entities: string[]; action: string } {
    const q = query.toLowerCase();
    const entities: string[] = [];
    let focus: QueryFocus = 'general';
    let action = 'query'; // default action

    // Detect data type focus
    if (/dnf|sự cố|failure|lỗi|hỏng|hư hại/i.test(q)) focus = 'dnf';
    else if (/hazard|mối nguy|nguy hiểm|rủi ro|an toàn/i.test(q)) focus = 'hazard';
    else if (/inspect|kiểm tra|audit|thanh tra|checklist/i.test(q)) focus = 'inspection';
    else if (/maintenance|bảo trì|bảo dưỡng|sửa chữa|preventive/i.test(q)) focus = 'maintenance';
    else if (/asset|thiết bị|tài sản|máy móc|train|toa/i.test(q)) focus = 'asset';
    else if (/user|người dùng|nhân viên|kỹ thuật viên|staff/i.test(q)) focus = 'user';
    else if (/thống kê|statistic|trend|xu hướng|báo cáo|report|analytics/i.test(q)) focus = 'analytics';

    // Detect action type
    if (/bao nhiêu|how many|count|số lượng|tổng/i.test(q)) action = 'count';
    else if (/liệt kê|list|danh sách|nào|which/i.test(q)) action = 'list';
    else if (/tại sao|why|nguyên nhân|cause|reason/i.test(q)) action = 'analyze';
    else if (/so sánh|compare|khác nhau|difference/i.test(q)) action = 'compare';
    else if (/xu hướng|trend|dự báo|predict|forecast/i.test(q)) action = 'predict';
    else if (/giải pháp|solution|khắc phục|fix|resolve/i.test(q)) action = 'recommend';
    else if (/trạng thái|status|tình trạng|progress/i.test(q)) action = 'status';

    // Extract specific entity IDs (DNF-xxx, HAZ-xxx, INS-xxx)
    const idMatches = query.match(/(?:DNF|HAZ|INS|CA)-[A-Z0-9_-]+/gi);
    if (idMatches) entities.push(...idMatches);

    return { focus, entities, action };
}

/**
 * Build a focused, precise prompt that forces structured answers
 */
export function buildFocusedPrompt(originalQuery: string, queryFocus: { focus: QueryFocus; entities: string[]; action: string }, crmContext?: string): string {
    const parts: string[] = [];

    // Inject CRM context if available
    if (crmContext) {
        parts.push(`[DỮ LIỆU HỆ THỐNG]\n${crmContext}\n`);
    }

    // Inject focus constraint
    const focusLabels: Record<QueryFocus, string> = {
        dnf: 'Sự cố/DNF',
        hazard: 'Mối nguy/Hazard',
        inspection: 'Kiểm tra/Inspection',
        maintenance: 'Bảo trì/Maintenance',
        asset: 'Thiết bị/Asset',
        user: 'Người dùng/User',
        analytics: 'Thống kê/Analytics',
        general: 'Tổng quát',
    };

    const actionInstructions: Record<string, string> = {
        count: 'Trả lời bằng CON SỐ CỤ THỂ. Format: "Tổng: X" rồi liệt kê chi tiết nếu cần.',
        list: 'Trả lời bằng DANH SÁCH có đánh số. Mỗi item 1 dòng, format: "[ID] Mô tả | Trạng thái".',
        analyze: 'Trả lời theo format: 1) Vấn đề 2) Nguyên nhân 3) Đề xuất. Mỗi phần tối đa 2-3 dòng.',
        compare: 'Trả lời bằng BẢNG SO SÁNH. Các cột: Tiêu chí | A | B.',
        predict: 'Trả lời theo format: 1) Xu hướng hiện tại 2) Dự báo 3) Khuyến nghị.',
        recommend: 'Trả lời theo format: 1) Vấn đề 2) Giải pháp đề xuất (ưu tiên) 3) Hành động tiếp theo.',
        status: 'Trả lời thẳng trạng thái hiện tại, tiếp theo là chi tiết ngắn gọn.',
        query: 'Trả lời ngắn gọn, chính xác. Không thêm thông tin không được hỏi.',
    };

    parts.push(`[PHẠM VI] Câu hỏi về: ${focusLabels[queryFocus.focus]}`);
    
    if (queryFocus.entities.length > 0) {
        parts.push(`[THỰC THỂ CỤ THỂ] ${queryFocus.entities.join(', ')}`);
    }

    parts.push(`[YÊU CẦU FORMAT] ${actionInstructions[queryFocus.action] || actionInstructions.query}`);
    parts.push(`\n[CÂU HỎI] ${originalQuery}`);

    return parts.join('\n');
}

