'use server';

import { revalidatePath } from 'next/cache';
import { askAI, askWithRAG, agentChat, askPersonalized, analyzeWithGraph } from '@/lib/services/ai/manager';
// @ts-ignore
import { askVisionAI, askHuggingFace, detectObjectsHF } from '@/lib/services/ai/manager';
import { DEFAULT_AI_MODEL } from '@/lib/constants';
import { getGroundedContext, syncToTrustGraph, getRelatedEntities, semanticKnowledgeSearch } from '@/lib/services/ai/knowledge';
import { internalLogSystemEvent as logSystemEvent } from '../services/log-service';
import { getInternalSystemState as getSystemState } from '../services/system-service';
import { checkRateLimit } from '@/lib/rate-limit';
import { requirePermission, requireAuth } from '@/lib/auth-enforcer';
import { 
    getInternalAgents, 
    createInternalAgent,
    getInternalSystemSnapshot, 
    getInternalRecentDnfDocs, 
    getInternalRecentHazardDocs 
} from '../services/ai/context';

export async function analyzeTelemetryTrend(assetName: string, data: any) {
    await requirePermission('ai:use');
    const query = `Analyze telemetry for asset ${assetName}. Data: ${JSON.stringify(data)}`;
    return await askAI(query, { systemPrompt: "You are a telemetry analysis expert. Provide brief insights." });
}

// ============ AI HINT (Enhanced) ============

export async function generateAiHint(context: string, prompt: string, model?: string) {
    await requirePermission('ai:use');
    
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

// ============ EXECUTIVE SUMMARY (Decoupled) ============

export async function getExecutiveSummary(dnfs: any[], hazards: any[]) {
    await requirePermission('reports:view');
    try {
        const dataSummary = `
            Số lượng sự cố (DNF): ${dnfs.length}
            Số lượng mối nguy (Hazards): ${hazards.length}
            Mới nhất: ${dnfs.slice(0, 3).map(d => d.descriptionOfFailure).join('; ')}
        `;

        const query = `Phân tích tổng quan tình hình Metro HURC1. ${dataSummary}. Viết báo cáo chiến lược ngắn gọn.`;
        const result = await askWithRAG(query, {
            collection: 'hurc-general',
            forceIntent: 'graph_rag',
        });

        return result.response;
    } catch (e: any) {
        return "Không thể tổng hợp tri thức lúc này.";
    }
}

// ============ STRATEGIC EXECUTIVE SUMMARY (Decoupled) ============

export async function generateStrategicExecutiveSummary() {
    await requirePermission('reports:view');
    try {
        const snapshot = await getInternalSystemSnapshot();
        const query = `Dựa trên dữ liệu thực tế hiện tại:
        - Số sự cố (DNF) đang mở: ${snapshot.activeDnfs}
        - Sự cố nghiêm trọng: ${snapshot.severeDnfs}
        - Mối nguy (Hazard) đang mở: ${snapshot.activeHazards}
        
        Viết bản tóm tắt chiến lược kỹ thuật cho CEO/CTO.`;

        const result = await askWithRAG(query, {
            forceIntent: 'agent',
            systemPrompt: "Bạn là một CTO ảo chuyên gia về vận hành và bảo trì Metro."
        });

        return result.response;
    } catch (e: any) {
        return "Không thể tổng hợp báo cáo chiến lược lúc này.";
    }
}

// ============ PREDICTIVE INSIGHTS (Decoupled) ============

export async function predictiveInsights(category?: string) {
    await requirePermission('ai:use');
    try {
        const recentDnfs = await getInternalRecentDnfDocs();
        const recentHazards = await getInternalRecentHazardDocs();

        const dataSummary = JSON.stringify({
            dnfs: recentDnfs.map((d: any) => ({ desc: d.descriptionOfFailure, priority: d.priority })),
            hazards: recentHazards.map((h: any) => ({ desc: h.description, risk: h.riskLevelId })),
        });

        const query = `Dựa trên dữ liệu gần đây, hãy phân tích xu hướng và dự báo rủi ro. DỮ LIỆU: ${dataSummary}`;
        const result = await askWithRAG(query, { forceIntent: 'agent' });
        return { insights: result.response, source: result.source, error: null };
    } catch (e: any) {
        return { insights: [], error: "Không thể tạo dự báo lúc này." };
    }
}

// ============ AGENTS (Decoupled) ============

export async function getAgents() {
    await requireAuth();
    return await getInternalAgents();
}

export async function createAgent(data: { name: string, subsystem: string, systemPrompt: string }) {
    await requirePermission('admin:system');
    return await createInternalAgent(data);
}

// ============ DATA LISTS (Decoupled) ============

export async function getDnfShortList() {
    await requireAuth();
    return await getInternalRecentDnfDocs(50);
}

export async function getHazardShortList() {
    await requireAuth();
    return await getInternalRecentHazardDocs(50);
}

// ============ GROUNDED QUERY ============

export async function groundedQuery(recordIds: string[], types: any[], userQuery: string, agentId?: string) {
    await requirePermission('ai:use');
    try {
        const ragResult = await askWithRAG(userQuery, {
            systemPrompt: `Bạn là một chuyên gia hỗ trợ kỹ thuật tại HURC1.`,
        });
        if (ragResult.source !== 'gemini-fallback') return ragResult.response;
        const context = await getGroundedContext(recordIds, types, agentId);
        const result = await askAI(userQuery, { systemPrompt: `Context: ${context}` });
        return result;
    } catch (e: any) {
        return "Error";
    }
}

// ============ OTHER CORE AI ACTIONS ============

export async function graphQuery(query: string, collection?: string) {
    await requirePermission('ai:use');
    const result = await analyzeWithGraph(query, { collection });
    const relatedEntities = await getRelatedEntities(query, { collection, limit: 10 });
    return { response: result.response, source: result.source, entities: relatedEntities };
}

export async function personalizedQuery(query: string, history?: any[]) {
    const user = await requireAuth();
    return await askPersonalized(query, { userId: user.id, history });
}

export async function aiAgentChat(question: string, conversationState?: any, conversationHistory?: any[]) {
    await requireAuth();
    return await agentChat(question, { state: conversationState, history: conversationHistory, collection: 'hurc-general' });
}

export async function analyzeSafetyImage(formData: FormData) {
    await requirePermission('ai:use');
    try {
        const file = formData.get('image') as File;
        if (!file) return { error: "No image provided", detections: [] };
        
        const buffer = Buffer.from(await file.arrayBuffer());
        
        // --- STEP 1: VISUAL DETECTION (YOLO) ---
        // Try local YOLO service first, fallback to HuggingFace
        const yoloResult = await detectObjectsHF(buffer); 
        const detections = yoloResult?.detections || [];
        
        // --- STEP 2: REASONING (GEMMA 4 CO-INTELLIGENCE) ---
        const detectionContext = detections.map((d: any) => `${d.label} (confidence: ${Math.round((d.score || d.confidence) * 100)}%)`).join(', ');
        
        const prompt = `Dựa trên kết quả thị giác máy tính (YOLOv8) phát hiện các đối tượng sau: [${detectionContext}]. 
        Hãy thực hiện một "Audit An toàn" kỹ thuật. Tóm tắt các phát hiện và đưa ra dự báo rủi ro cho khu vực thi công Metro. Trả lời bằng tiếng Việt.`;

        const reasoningResult = await askAI(prompt, { 
            role: 'TECHNICAL_ANALYST', // Routes to Gemma 4 E4B
            groundingContext: `Detections: ${detectionContext}`
        });

        // Split response into summary and forecast if possible, or use defaults
        const summary = reasoningResult.split('\n\n')[0] || `Phát hiện ${detections.length} đối tượng.`;
        const forecast = reasoningResult.includes('\n\n') ? reasoningResult.split('\n\n').slice(1).join('\n\n') : reasoningResult;

        return { 
            detections, 
            summary,
            forecast,
            error: null 
        };
    } catch (e: any) {
        console.error("AI Vision Audit Error:", e);
        return { error: e.message || "Lỗi xử lý AI Vision", detections: [] };
    }
}

export async function analyzeHazardImageOpen(formData: FormData) {
    await requirePermission('ai:use');
    try {
        const file = formData.get('image') as File;
        if (!file) return { error: "No image provided" };

        const base64 = Buffer.from(await file.arrayBuffer()).toString('base64');
        const response = await askVisionAI(
            "Phân tích mối nguy trong ảnh này. Trả về định dạng JSON với các khóa: description, cause, consequence, severityId (S1-S4), likelihoodId (L1-L4), suggestedActions.", 
            { data: base64, mimeType: file.type }
        );

        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const data = JSON.parse(jsonMatch[0]);
                return { ...data, error: null, rawResponse: response };
            }
        } catch (e) { /* ignore */ }

        return { error: null, rawResponse: response, description: response };
    } catch (e: any) {
        return { error: e.message || "Lỗi AI Vision", rawResponse: null };
    }
}

export async function syncDataToTrustGraph(types?: any[]) {
    await requirePermission('admin:system');
    return await syncToTrustGraph({ types });
}

export async function getAIStatus() {
    await requireAuth();
    return await getSystemState();
}

export async function searchKnowledge(query: string, collection?: string) {
    await requireAuth();
    return await semanticKnowledgeSearch(query, { collection });
}

export async function generateSynthesis(recordIds: string[], types: any[]) {
    await requirePermission('ai:use');
    const groundingContext = await getGroundedContext(recordIds, types);
    return await askWithRAG("Synthesize data.", { systemPrompt: `Context: ${groundingContext}` });
}

// ============ MCP ACTIONS ============

export async function getMcpTools() {
    await requireAuth();
    const { mcpService } = await import('../services/ai/mcp-service');
    return await mcpService.listTools();
}

export async function callMcpTool(name: string, args: any) {
    await requirePermission('ai:use');
    const { mcpService } = await import('../services/ai/mcp-service');
    return await mcpService.callTool(name, args);
}

export async function getMcpTraces() {
    await requireAuth();
    const { mcpService } = await import('../services/ai/mcp-service');
    return mcpService.getTraces();
}

export async function clearMcpTraces() {
    await requirePermission('admin:system');
    const { mcpService } = await import('../services/ai/mcp-service');
    mcpService.clearTraces();
}

// ============ AI SAFETY LOGGING ============

export async function logAiAction(action: string, details: string, level: any = 'INFO') {
    try {
        await requireAuth();
        await logSystemEvent(action, level, details, 'ai');
    } catch (e) {
        // Logging should be non-blocking and safe
        console.error("[AI-LOG-ERROR]", e);
    }
}
