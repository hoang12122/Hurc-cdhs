'use server';

import { askAI, askWithRAG, analyzeWithGraph, agentChat, ingestDocument, getAIHealthStatus, DEFAULT_AI_MODEL, askPersonalized } from '@/lib/services/ai';
import { getGroundedContext, syncToTrustGraph, semanticKnowledgeSearch, getRelatedEntities } from '@/lib/services/ai-knowledge';
import { logSystemEvent, getSystemState } from './system.actions';
import { checkRateLimit } from '@/lib/rate-limit';
import { getCurrentUser } from '@/lib/actions/auth.actions';

// ============ EXISTING: AI HINT (Enhanced) ============

export async function generateAiHint(context: string, prompt: string, model?: string) {
    const { hasPermission } = await import('@/lib/auth');
    if (!await hasPermission('ai:use')) {
        return "Bạn không có quyền sử dụng tính năng trợ lý AI.";
    }
    
    if (!checkRateLimit(`ai_assist_${context}`, 10, 60000)) { 
        return "Bạn đang yêu cầu quá nhanh. Vui lòng thử lại sau một lát.";
    }
    
    try {
        const state = await getSystemState();
        const configuredModel = state?.aiModelConfig;

        const systemPrompt = "Bạn là một trợ lý ảo chuyên tư vấn về các lỗi kỹ thuật và quản lý bảo trì cho dự án đường sắt đô thị HURC1. Hãy trả lời ngắn gọn, chuyên nghiệp, bằng tiếng Việt.";
        const result = await askAI(prompt, { 
            model: model || configuredModel || DEFAULT_AI_MODEL, 
            systemPrompt 
        });
        
        await logSystemEvent('AI_ASSISTANT_USED', 'INFO', `AI used for context: ${context.substring(0, 30)}`);
        return result;
    } catch (e: any) {
        console.error("AI Error:", e);
        await logSystemEvent('AI_ASSISTANT_ERROR', 'ERROR', `AI request failed: ${e.message}`);
        return "Hệ thống AI đang quá tải hoặc cấu hình không chính xác. Xin vui lòng thử lại sau.";
    }
}

// ============ EXISTING: EXECUTIVE SUMMARY (Enhanced with GraphRAG) ============

export async function getExecutiveSummary(dnfs: any[], hazards: any[]) {
    const { hasPermission } = await import('@/lib/auth');
    if (!await hasPermission('reports:view')) {
        return "Bạn không có quyền xem báo cáo tóm tắt chiến lược.";
    }

    if (!checkRateLimit(`ai_exec_summary`, 5, 60000)) { 
        return "Yêu cầu báo cáo chiến lược quá thường xuyên. Vui lòng thử lại sau 1 phút.";
    }

    try {
        const dataSummary = `
            Số lượng sự cố (DNF): ${dnfs.length}
            Sự cố nghiêm trọng: ${dnfs.filter(d => d.priority === 'Cao').length}
            Số lượng mối nguy (Hazards): ${hazards.length}
            Trạng thái hệ thống: ${dnfs.some(d => d.priority === 'Cao' && !['Đã đóng', 'Hủy'].includes(d.status)) ? 'BÁO ĐỘNG (Có lỗi nghiêm trọng chưa đóng)' : 'ỔN ĐỊNH'}
            Sự cố mới nhất: ${dnfs.slice(0, 3).map(d => d.descriptionOfFailure).join('; ')}
        `;

        // Try GraphRAG for deeper insights
        const query = `Phân tích tổng quan tình hình bảo trì Metro HURC1. ${dataSummary}. Hãy viết báo cáo chiến lược cho CEO/CTO (3-4 câu): đánh giá rủi ro, xu hướng, và khuyến nghị.`;
        
        const result = await askWithRAG(query, {
            collection: 'hurc-general',
            forceIntent: 'graph_rag',
        });

        return result.response;
    } catch (e: any) {
        // Fallback to simple AI
        try {
            const prompt = `Dựa trên dữ liệu: ${dnfs.length} sự cố, ${hazards.length} mối nguy. Viết báo cáo ngắn (3-4 câu) cho CEO/CTO.`;
            const systemPrompt = "Bạn là Giám đốc Công nghệ (CTO) ảo của dự án Metro. Hãy đưa ra nhận định chuyên môn, quyết đoán và mang tính chiến lược cao.";
            return await askAI(prompt, { systemPrompt });
        } catch {
            return "Không thể tổng hợp tri thức lúc này.";
        }
    }
}

// ============ EXISTING: GROUNDED QUERY (Enhanced with RAG) ============

export async function groundedQuery(recordIds: string[], types: any[], userQuery: string, agentId?: string) {
    const { hasPermission } = await import('@/lib/auth');
    if (!await hasPermission('ai:use')) return "Unauthorized";

    try {
        // Try TrustGraph RAG first
        const ragResult = await askWithRAG(userQuery, {
            systemPrompt: `Bạn là một chuyên gia hỗ trợ kỹ thuật tại HURC1. 
            Luôn trả lời bằng tiếng Việt chuyên nghiệp.
            Nếu không có thông tin, hãy nói rằng bạn không biết.`,
        });

        if (ragResult.source !== 'gemini-fallback') {
            return ragResult.response;
        }

        // Fallback: use grounded context from DB
        const { getGroundedContext } = await import('@/lib/services/ai-knowledge');
        const context = await getGroundedContext(recordIds, types, agentId);
        
        const systemPrompt = `Bạn là một chuyên gia hỗ trợ kỹ thuật tại HURC1. 
        Sử dụng thông tin dưới đây để trả lời câu hỏi. 
        Nếu không có thông tin trong tài liệu, hãy nói rằng bạn không biết, đừng tự bịa ra câu trả lời.
        Luôn trả lời bằng tiếng Việt chuyên nghiệp.
        
        DỮ LIỆU GỐC:
        ${context}`;

        const configuredModel = process.env.NEXT_PUBLIC_HF_MODEL;
        const result = await askAI(userQuery, { model: configuredModel || DEFAULT_AI_MODEL, systemPrompt });
        return result;
    } catch (e: any) {
        return "Không thể truy vấn AI lúc này.";
    }
}

// ============ NEW: GRAPH-POWERED QUERY ============

export async function graphQuery(query: string, collection?: string) {
    const { hasPermission } = await import('@/lib/auth');
    if (!await hasPermission('ai:use')) return { response: "Unauthorized", entities: [] };

    if (!checkRateLimit('ai_graph_query', 10, 60000)) {
        return { response: "Yêu cầu quá nhanh. Vui lòng thử lại sau.", entities: [] };
    }

    try {
        const result = await analyzeWithGraph(query, { collection });
        const relatedEntities = await getRelatedEntities(query, { collection, limit: 10 });

        return {
            response: result.response,
            source: result.source,
            entities: relatedEntities,
        };
    } catch (e: any) {
        return { response: "Không thể phân tích qua Knowledge Graph lúc này.", entities: [] };
    }
}

// ============ NEW: PERSONALIZED QUERY (NemoClaw) ============

export async function personalizedQuery(query: string, history?: any[]) {
    const { hasPermission } = await import('@/lib/auth');
    if (!await hasPermission('ai:use')) return { content: "Unauthorized", source: 'none', focus: 'general' };

    if (!checkRateLimit('ai_personalized_query', 15, 60000)) {
        return { content: "Yêu cầu quá nhanh. Vui lòng thử lại sau.", source: 'rate-limit', focus: 'general' };
    }

    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error("Not logged in");

        const result = await askPersonalized(query, {
            userId: currentUser.id,
            history,
        });

        await logSystemEvent('AI_PERSONALIZED_QUERY', 'INFO', `Personalized query for user ${currentUser.name}`);
        return result;
    } catch (e: any) {
        return { content: "Không thể kết nối với NemoClaw lúc này.", source: 'error', focus: 'general' };
    }
}

// ============ NEW: MULTI-TURN AGENT CHAT ============

export async function aiAgentChat(question: string, conversationState?: any, conversationHistory?: any[]) {
    const { hasPermission } = await import('@/lib/auth');
    if (!await hasPermission('ai:use')) return { answer: "Unauthorized", state: null, history: [] };

    if (!checkRateLimit('ai_agent_chat', 15, 60000)) {
        return { answer: "Yêu cầu quá nhanh. Vui lòng thử lại sau.", state: null, history: [] };
    }

    try {
        const result = await agentChat(question, {
            state: conversationState,
            history: conversationHistory,
            collection: 'hurc-general',
        });

        await logSystemEvent('AI_AGENT_CHAT', 'INFO', `Agent chat: ${question.substring(0, 50)}`);
        return result;
    } catch (e: any) {
        return { answer: "Không thể kết nối với AI Agent lúc này.", state: null, history: [] };
    }
}

// ============ NEW: CROSS-REFERENCE ANALYSIS ============

export async function analyzeCrossReferences(recordIds: string[], types: any[]) {
    const { hasPermission } = await import('@/lib/auth');
    if (!await hasPermission('ai:use')) return "Unauthorized";

    try {
        const context = await getGroundedContext(recordIds, types);
        
        const query = `Dựa trên dữ liệu sau, hãy phân tích mối liên hệ chéo (cross-reference) giữa các sự cố, mối nguy, và báo cáo kiểm tra. 
        Xác định:
        1. Các pattern lặp lại
        2. Mối liên hệ nhân quả (cause-effect)
        3. Vùng rủi ro tập trung
        4. Đề xuất hành động phòng ngừa
        
        DỮ LIỆU:
        ${context}`;

        const result = await askWithRAG(query, {
            forceIntent: 'graph_rag',
            collection: 'hurc-general',
        });

        return result.response;
    } catch (e: any) {
        return "Không thể phân tích cross-reference lúc này.";
    }
}

// ============ NEW: PREDICTIVE INSIGHTS ============

export async function predictiveInsights(category?: string) {
    const { hasPermission } = await import('@/lib/auth');
    if (!await hasPermission('ai:use')) return { insights: [], error: "Unauthorized" };

    try {
        const { opsDb } = await import('@/lib/prisma');
        
        // Get recent data for pattern analysis
        const recentDnfs = await opsDb.dnfDocument.findMany({
            orderBy: { createdAt: 'desc' },
            take: 30,
            select: {
                id: true,
                failureReportNo: true,
                descriptionOfFailure: true,
                locationOfFailure: true,
                priority: true,
                status: true,
                createdAt: true,
            }
        });

        const recentHazards = await opsDb.hazardRecord.findMany({
            orderBy: { createdAt: 'desc' },
            take: 30,
            select: {
                id: true,
                description: true,
                potentialConsequence: true,
                status: true,
                riskLevelId: true,
                createdAt: true,
            }
        });

        const dataSummary = JSON.stringify({
            dnfs: recentDnfs.map(d => ({
                desc: d.descriptionOfFailure?.substring(0, 100),
                location: d.locationOfFailure,
                priority: d.priority,
                status: d.status,
                date: d.createdAt,
            })),
            hazards: recentHazards.map(h => ({
                desc: h.description?.substring(0, 100),
                consequence: h.potentialConsequence?.substring(0, 100),
                risk: h.riskLevelId,
                status: h.status,
                date: h.createdAt,
            })),
        });

        const query = `Dựa trên ${recentDnfs.length} sự cố và ${recentHazards.length} mối nguy gần đây, hãy phân tích:

1. **Xu hướng sự cố**: Có pattern nào lặp lại không? Tần suất tăng hay giảm?
2. **Dự báo rủi ro**: Dự đoán các rủi ro tiềm ẩn trong 30 ngày tới
3. **Điểm nóng**: Vị trí/hệ thống nào có nhiều sự cố nhất?
4. **Khuyến nghị**: Top 3 hành động ưu tiên để giảm thiểu rủi ro

DỮ LIỆU:
${dataSummary}`;

        const systemPrompt = "Bạn là chuyên gia bảo trì dự báo (Predictive Maintenance). Phân tích dữ liệu chính xác, đưa ra insights dựa trên evidence. Trả lời bằng tiếng Việt, format Markdown.";

        const result = await askWithRAG(query, {
            systemPrompt,
            forceIntent: 'agent',
        });

        return { insights: result.response, source: result.source, error: null };
    } catch (e: any) {
        return { insights: [], error: "Không thể tạo dự báo lúc này." };
    }
}

// ============ NEW: DATA SYNC TO TRUSTGRAPH ============

export async function syncDataToTrustGraph(types?: ('dnf' | 'hazard' | 'inspection')[]) {
    const { hasPermission } = await import('@/lib/auth');
    if (!await hasPermission('admin:system')) return { error: "Unauthorized" };

    try {
        const result = await syncToTrustGraph({ types });
        await logSystemEvent('TRUSTGRAPH_SYNC', 'INFO', `Synced ${result.synced} records, ${result.errors} errors`);
        return result;
    } catch (e: any) {
        return { synced: 0, errors: 0, skipped: 0, error: e.message };
    }
}

// ============ NEW: AI HEALTH STATUS ============

export async function getAIStatus() {
    try {
        return await getAIHealthStatus();
    } catch {
        return {
            trustgraph: { available: false, latencyMs: 0, error: 'Check failed' },
            gemini: { available: false },
            huggingface: { available: false },
            primaryBackend: 'none',
        };
    }
}

// ============ NEW: SEMANTIC SEARCH ============

export async function searchKnowledge(query: string, collection?: string) {
    const { hasPermission } = await import('@/lib/auth');
    if (!await hasPermission('ai:use')) return [];

    try {
        return await semanticKnowledgeSearch(query, { collection, limit: 15 });
    } catch {
        return [];
    }
}

// ============ EXISTING: AGENTS ============

export async function getAgents() {
    const { aiDb } = await import('@/lib/prisma');
    return await aiDb.aiAgent.findMany({
        orderBy: { name: 'asc' }
    });
}

export async function createAgent(data: { name: string, subsystem: string, systemPrompt: string }) {
    const { aiDb } = await import('@/lib/prisma');
    return await aiDb.aiAgent.create({
        data
    });
}

// ============ EXISTING: SYNTHESIS (Enhanced) ============

export async function generateSynthesis(recordIds: string[], types: any[]) {
    const { hasPermission } = await import('@/lib/auth');
    if (!await hasPermission('ai:use')) return "Unauthorized";

    try {
        const groundingContext = await getGroundedContext(recordIds, types);

        // Try TrustGraph first
        const query = "Dựa trên các nguồn dữ liệu bảo trì đã chọn, hãy tạo một 'Tóm tắt Tri thức' bao gồm: 1. Tổng quan tình hình, 2. Các điểm rủi ro chính, 3. Đề xuất hành động ưu tiên. Trình bày bằng Markdown chuyên nghiệp.";
        
        const result = await askWithRAG(query, {
            systemPrompt: "Bạn là trợ lý tổng hợp tri thức kỹ thuật. Hãy trình bày thông tin một cách có cấu trúc và dễ hiểu.",
        });

        if (result.source !== 'gemini-fallback') {
            return result.response;
        }

        // Fallback with grounding context
        const state = await getSystemState();
        const configuredModel = state?.aiModelConfig;
        return await askAI(query, {
            model: configuredModel || "gemini-1.5-flash",
            systemPrompt: "Bạn là trợ lý tổng hợp tri thức kỹ thuật. Hãy trình bày thông tin một cách có cấu trúc và dễ hiểu.",
            groundingContext
        });
    } catch (e: any) {
        return "Không thể tổng hợp tri thức lúc này.";
    }
}

// ============ EXISTING: DATA LISTS ============

export async function getDnfShortList() {
    const { hasPermission } = await import('@/lib/auth');
    if (!await hasPermission('ai:use')) return [];
    
    const { opsDb } = await import('@/lib/prisma');
    return await opsDb.dnfDocument.findMany({
        select: { id: true, failureReportNo: true, descriptionOfFailure: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 50
    });
}

export async function getHazardShortList() {
    const { hasPermission } = await import('@/lib/auth');
    if (!await hasPermission('ai:use')) return [];

    const { opsDb } = await import('@/lib/prisma');
    return await opsDb.hazardRecord.findMany({
        select: { id: true, description: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 50
    });
}

// ============ EXISTING: SAFETY IMAGE ANALYSIS ============

export async function analyzeSafetyImage(formData: FormData) {
    const { hasPermission } = await import('@/lib/auth');
    if (!await hasPermission('ai:use')) {
        return { error: "Bạn không có quyền sử dụng tính năng phân tích hình ảnh AI." };
    }

    if (!checkRateLimit(`ai_vision`, 5, 60000)) {
        return { error: "Yêu cầu phân tích ảnh quá nhanh. Thử lại sau 1 phút." };
    }

    try {
        const file = formData.get('image') as File;
        if (!file) throw new Error("No image file provided");

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const { detectObjectsHF } = await import('@/lib/services/ai');
        const detections = await detectObjectsHF(buffer);

        if (detections && detections.error) {
            const errMsg = typeof detections.error === 'string' ? detections.error : JSON.stringify(detections.error);
            if (errMsg.includes('loading')) {
                return { error: "Mô hình AI đang được khởi tạo. Vui lòng thử lại sau 30 giây." };
            }
            return { error: `Lỗi từ dịch vụ AI: ${errMsg}` };
        }

        if (Array.isArray(detections) && detections.length > 0) {
            const confidentDetections = detections.filter((d: any) => d.score >= 0.5);
            const labels = confidentDetections.map((d: any) => d.label);
            const counts = labels.reduce((acc: any, curr: string) => {
                acc[curr] = (acc[curr] || 0) + 1;
                return acc;
            }, {});

            const detectionSummary = Object.entries(counts)
                .map(([label, count]) => `${count} ${label} (${Math.round((confidentDetections.find((d: any) => d.label === label)?.score || 0) * 100)}%)`)
                .join(', ');

            const violationLabels = ['no-helmet', 'no-vest', 'no-hardhat', 'no-safety-vest', 'no-mask', 'no-goggles'];
            const safeLabels = ['helmet', 'vest', 'hardhat', 'safety-vest', 'mask', 'goggles', 'person'];
            
            const violations = labels.filter((l: string) => violationLabels.some(vl => l.toLowerCase().includes(vl)));
            const safeItems = labels.filter((l: string) => safeLabels.some(sl => l.toLowerCase().includes(sl)));

            let forecast = "Kết quả phân tích YOLOv8:\n\n";
            if (violations.length > 0) {
                forecast += "🔴 CẢNH BÁO AN TOÀN:\n";
                forecast += violations.map(v => `  • Phát hiện vi phạm: ${v}`).join('\n');
            } else {
                forecast += "🟢 AN TOÀN: Đầy đủ trang bị.";
            }

            return { summary: detectionSummary, forecast, detections: confidentDetections };
        }
        return { summary: "Phân tích hoàn tất", forecast: "Không phát hiện đối tượng.", detections: [] };
    } catch (e: any) {
        return { error: `Lỗi phân tích: ${e.message}` };
    }
}

// ============ EXISTING: TELEMETRY ANALYSIS (Enhanced) ============

export async function analyzeTelemetryTrend(assetName: string, telemetryData: any[]) {
    const { hasPermission } = await import('@/lib/auth');
    if (!await hasPermission('ai:use')) return "Unauthorized";

    try {
        const dataSummary = telemetryData.map(t => `${t.timestamp}: ${t.value}${t.unit || ''}`).join('\n');
        
        const query = `Dựa trên chuỗi dữ liệu cảm biến của thiết bị "${assetName}" sau đây, hãy phân tích xu hướng và dự báo nguy cơ hỏng hóc. Nếu thấy chỉ số tăng/giảm bất thường, hãy cảnh báo ngay.
        
        DỮ LIỆU TELEMETRY:
        ${dataSummary}`;

        const result = await askWithRAG(query, {
            systemPrompt: "Bạn là chuyên gia về bảo trì dự báo (Predictive Maintenance). Hãy đưa ra nhận định kỹ thuật chính xác, cảnh báo sớm các dấu hiệu quá nhiệt, quá tải hoặc suy giảm hiệu suất.",
            forceIntent: 'agent',
        });

        return result.response;
    } catch (e: any) {
        return "Không thể phân tích xu hướng lúc này.";
    }
}
