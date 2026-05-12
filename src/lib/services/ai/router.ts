/**
 * AI Smart Router
 * Classifies user queries and routes them to the optimal AI backend.
 * Part of the Modular AI Architecture.
 */

export type QueryIntent = 'graph_rag' | 'document_rag' | 'agent' | 'text_completion';

interface ClassificationResult {
    intent: QueryIntent;
    confidence: number;
    reason: string;
}

const GRAPH_RAG_PATTERNS = [
    /mối quan hệ|liên quan|kết nối|ảnh hưởng|tác động|phụ thuộc/i,
    /relationship|related|connected|impact|depend|link/i,
    /giữa.*và|between.*and/i,
];

const DOCUMENT_RAG_PATTERNS = [
    /tài liệu|document|file|báo cáo|report/i,
    /quy trình|procedure|standard|tiêu chuẩn/i,
    /theo.*tài liệu|according.*to/i,
];

const AGENT_PATTERNS = [
    /phân tích.*toàn diện|comprehensive.*analysis/i,
    /lập kế hoạch|plan|strategy|chiến lược/i,
    /so sánh.*và.*đề xuất|compare.*recommend/i,
    /đánh giá.*rủi ro|risk.*assessment/i,
    /debug|troubleshoot|diagnose|khắc phục/i,
];

export function classifyQueryIntent(query: string): ClassificationResult {
    const normalizedQuery = query.trim().toLowerCase();
    const scores: Record<QueryIntent, number> = {
        graph_rag: 0,
        document_rag: 0,
        agent: 0,
        text_completion: 0,
    };

    for (const pattern of GRAPH_RAG_PATTERNS) if (pattern.test(normalizedQuery)) scores.graph_rag += 2;
    for (const pattern of DOCUMENT_RAG_PATTERNS) if (pattern.test(normalizedQuery)) scores.document_rag += 2;
    for (const pattern of AGENT_PATTERNS) if (pattern.test(normalizedQuery)) scores.agent += 2;

    if (normalizedQuery.length > 200) scores.agent += 1;
    if (normalizedQuery.length < 50) scores.text_completion += 1;

    scores.text_completion += 1;

    const entries = Object.entries(scores) as [QueryIntent, number][];
    entries.sort((a, b) => b[1] - a[1]);

    const [topIntent, topScore] = entries[0];
    const totalScore = entries.reduce((sum, [, s]) => sum + s, 0);
    const confidence = totalScore > 0 ? topScore / totalScore : 0.25;

    const reasons: Record<QueryIntent, string> = {
        graph_rag: 'Phân tích mối quan hệ thực thể',
        document_rag: 'Truy vấn dựa trên tài liệu/tiêu chuẩn',
        agent: 'Phân tích đa bước/lập kế hoạch',
        text_completion: 'Câu hỏi đơn giản',
    };

    return {
        intent: topIntent,
        confidence: Math.round(confidence * 100) / 100,
        reason: reasons[topIntent],
    };
}

export function suggestCollection(query: string): string {
    const q = query.toLowerCase();
    if (/dnf|failure|lỗi|sự cố|hỏng/i.test(q)) return 'hurc-dnf';
    if (/hazard|nguy|risk|rủi ro|an toàn/i.test(q)) return 'hurc-hazards';
    if (/inspect|kiểm tra|audit|thanh tra/i.test(q)) return 'hurc-inspections';
    return 'hurc-general';
}

export type QueryFocus = 'dnf' | 'hazard' | 'inspection' | 'maintenance' | 'asset' | 'user' | 'analytics' | 'general';

export function extractQueryFocus(query: string): { focus: QueryFocus; entities: string[]; action: string } {
    const q = query.toLowerCase();
    const entities: string[] = [];
    let focus: QueryFocus = 'general';
    let action = 'query';

    if (/dnf|sự cố|failure|lỗi|hỏng|hư hại/i.test(q)) focus = 'dnf';
    else if (/hazard|mối nguy|nguy hiểm|rủi ro|an toàn/i.test(q)) focus = 'hazard';
    else if (/inspect|kiểm tra|audit|thanh tra|checklist/i.test(q)) focus = 'inspection';
    else if (/maintenance|bảo trì|bảo dưỡng|sửa chữa/i.test(q)) focus = 'maintenance';
    else if (/user|người dùng|nhân viên/i.test(q)) focus = 'user';
    else if (/thống kê|báo cáo|analytics/i.test(q)) focus = 'analytics';

    if (/bao nhiêu|how many|count|tổng/i.test(q)) action = 'count';
    else if (/liệt kê|list|danh sách/i.test(q)) action = 'list';
    else if (/tại sao|why|nguyên nhân/i.test(q)) action = 'analyze';
    else if (/so sánh|compare/i.test(q)) action = 'compare';

    const idMatches = query.match(/(?:DNF|HAZ|INS|CA)-[A-Z0-9_-]+/gi);
    if (idMatches) entities.push(...idMatches);

    return { focus, entities, action };
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
                `Resolution: ${record.resolutionDetails || 'Pending'}`,
            ].filter(Boolean).join('\n');

        case 'hazard':
            return [
                `Hazard Record: ${record.id}`,
                `Status: ${record.status}`,
                `Description: ${record.description || 'N/A'}`,
                `Potential Consequence: ${record.potentialConsequence || 'N/A'}`,
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

export function buildFocusedPrompt(originalQuery: string, queryFocus: { focus: QueryFocus; entities: string[]; action: string }, crmContext?: string): string {
    const parts: string[] = [];
    if (crmContext) parts.push(`[DỮ LIỆU HỆ THỐNG]\n${crmContext}\n`);
    parts.push(`[PHẠM VI] Câu hỏi về: ${queryFocus.focus}`);
    if (queryFocus.entities.length > 0) parts.push(`[THỰC THỂ] ${queryFocus.entities.join(', ')}`);
    parts.push(`\n[CÂU HỎI] ${originalQuery}`);
    return parts.join('\n');
}
