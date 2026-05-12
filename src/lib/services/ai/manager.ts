import { GoogleGenerativeAI } from "@google/generative-ai";
import { DEFAULT_AI_MODEL } from "../../constants";
import { getTrustGraphClient } from "../trustgraph-client";
import { classifyQueryIntent, suggestCollection, extractQueryFocus, buildFocusedPrompt, type QueryIntent } from "./router";
import { getNemoClawClient, type NemoClawHealthStatus } from "./nemoclaw";
import { runRobustAgentLoop } from "./loop";
import { buildUserContext } from "../user-context";
import { performLightweightSearch, formatLightweightContext } from "./lightweight-search";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * GEMMA-NEMO SPECIALIZED AGENTS
 */
export type ExpertRole = 'ASSET_MANAGER' | 'TECHNICAL_ANALYST' | 'EXECUTIVE_BRAIN' | 'RAG_SPECIALIST';

interface AgentConfig {
    name: string;
    model: string;
    backend: 'nemoclaw' | 'gemini' | 'huggingface';
    description: string;
    systemPrompt: string;
}

const AGENTS: Record<ExpertRole | 'SYSTEM_OPTIMIZER', AgentConfig> = {
    ASSET_MANAGER: {
        name: "Gemma 4 E2B (Asset Expert)",
        model: "google/gemma-4-E2B-it",
        backend: 'nemoclaw',
        description: "Chuyên gia về thiết bị và tra cứu dữ liệu nhanh.",
        systemPrompt: "Bạn là Asset Manager Agent (Gemma 4 E2B). Hãy tập trung vào việc tra cứu thông tin thiết bị và trả lời ngắn gọn, chính xác."
    },
    TECHNICAL_ANALYST: {
        name: "Gemma 4 E4B (Technical Analyst)",
        model: "google/gemma-4-E4B-it",
        backend: 'nemoclaw',
        description: "Chuyên gia phân tích kỹ thuật và báo cáo bảo trì.",
        systemPrompt: "Bạn là Technical Analyst Agent (Gemma 4 E4B). Hãy phân tích sâu các báo cáo bảo trì (DNF) và xác định rủi ro kỹ thuật."
    },
    EXECUTIVE_BRAIN: {
        name: "Gemma 4 31B (Strategic Brain)",
        model: "gemini-1.5-pro",
        backend: 'gemini',
        description: "Bộ não chiến lược với khả năng lập luận 256K context.",
        systemPrompt: "Bạn là Strategic Executive Agent (Gemma 4 31B). Hãy sử dụng khả năng lập luận đa tầng để đưa ra các chiến lược an toàn và tối ưu hóa hệ thống Metro."
    },
    SYSTEM_OPTIMIZER: {
        name: "Gemma 4 E2B (Resource Optimizer)",
        model: "google/gemma-4-E2B-it",
        backend: 'nemoclaw',
        description: "Chuyên gia tối ưu hóa tài nguyên và dọn dẹp dữ liệu.",
        systemPrompt: "Bạn là System Optimizer Agent (Gemma 4 E2B). Nhiệm vụ của bạn là phân tích dữ liệu cũ, xác định các bản ghi trùng lặp hoặc không quan trọng và đề xuất các biện pháp dọn dẹp để tiết kiệm dung lượng ổ đĩa và RAM."
    },
    RAG_SPECIALIST: {
        name: "Granite RAG (Knowledge Specialist)",
        model: "ibm-granite/granitelib-rag-r1.0",
        backend: 'huggingface',
        description: "Chuyên gia truy vấn kiến thức và phân tích tài liệu kỹ thuật.",
        systemPrompt: "Bạn là Knowledge Specialist Agent (IBM Granite RAG). Bạn có khả năng phân tích ngữ cảnh từ tài liệu cực tốt. Hãy trả lời dựa trên các dữ liệu được cung cấp (Grounding Context) một cách chính xác và khách quan."
    }
};

/**
 * CENTRAL AI MANAGER — Handles all requests with Gemma-Nemo Orchestration
 */
export async function askAI(prompt: string, options: { 
    model?: string, 
    systemPrompt?: string, 
    groundingContext?: string,
    forceBackend?: 'nemoclaw' | 'trustgraph' | 'gemini' | 'huggingface',
    role?: ExpertRole | 'SYSTEM_OPTIMIZER',
    userId?: string,
    image?: { data: string, mimeType: string },
} = {}) {
    const { model, systemPrompt, groundingContext, forceBackend, role, userId, image } = options;

    // Orchestration Logic: Choose agent based on requested role
    const agent = role ? AGENTS[role] : null;
    const finalBackend = forceBackend || (agent ? agent.backend : 'nemoclaw');
    const finalModel = model || (agent ? agent.model : DEFAULT_AI_MODEL);
    const finalSystem = systemPrompt || (agent ? agent.systemPrompt : "Bạn là HURC AI Advisor.");

    if (image) {
        return askVisionAI(prompt, image, { model, systemPrompt, forceBackend, userId });
    }

    // 1. Try NemoClaw (Local AI) with Resilience Guard
    if (!forceBackend || forceBackend === 'nemoclaw') {
        try {
            const nc = getNemoClawClient();
            const result = await nc.ask(
                groundingContext 
                    ? `[NGỮ CẢNH]\n${groundingContext}\n\n[CÂU HỎI] ${prompt}`
                    : prompt,
                { systemPrompt, userId, temperature: 0.3 }
            );
            return result.content;
        } catch (error: any) {
            // DOCKER DOWN GRACEFUL FALLBACK
            if (error.statusCode === 503 || error.message?.includes('DOCKER_UNREACHABLE')) {
                console.warn("[AI RESILIENCE] Local AI (Docker) is down. Falling back to Cloud...");
                if (forceBackend === 'nemoclaw') throw error; // Don't fallback if strictly forced
            } else {
                console.error("[AI ERROR] NemoClaw request failed:", error.message);
            }
        }
    }
    
    // 2. Try Gemini (Primary Cloud Fallback)
    if (forceBackend !== 'huggingface' && genAI && (!model || model.startsWith('gemini'))) {
        try {
            const geminiModel = genAI.getGenerativeModel({ 
                model: model || "gemini-1.5-flash",
                systemInstruction: systemPrompt
            });

            const fullPrompt = groundingContext 
                ? `Context:\n${groundingContext}\n\nQuestion: ${prompt}`
                : prompt;

            const result = await geminiModel.generateContent(fullPrompt);
            return (await result.response).text().trim();
        } catch (error) {
            console.error("[AI ERROR] Gemini Fallback failed:", error);
        }
    }

    // 3. Absolute Fallback to HuggingFace
    return askHuggingFace(prompt, model || DEFAULT_AI_MODEL, systemPrompt);
}

/**
 * AGENT CHAT — Orchestrates multi-step reasoning
 */
export async function agentChat(question: string, options: {
    state?: any,
    history?: any[],
    user?: string,
    collection?: string,
} = {}): Promise<{ answer: string; state?: any; history: any[]; source: string; steps?: string[] }> {
    
    const nc = getNemoClawClient();
    
    // Attempt Robust NemoClaw Loop
    try {
        const result = await runRobustAgentLoop(question, { 
            state: options.state,
            history: options.history || [], 
            user: options.user,
            collection: options.collection
        });
        return result;
    } catch (e: any) {
        console.warn("[AI RESILIENCE] Robust Agent Loop failed or Docker down. Falling back to Basic Gemini Agent...", e.message);
    }

    // Basic Gemini Fallback
    const answer = await askAI(question, { 
        userId: options.user, 
        forceBackend: 'gemini',
        systemPrompt: "Bạn là HURC AI Advisor. Hiện tại hệ thống phân tích kỹ thuật đang ngoại tuyến, tôi sẽ hỗ trợ bạn bằng kiến thức tổng quát."
    });

    return {
        answer,
        state: options.state,
        history: [...(options.history || []), { role: 'user', content: question }, { role: 'ai', content: answer }],
        source: 'gemini-fallback',
        steps: ["Phát hiện hệ thống Local offline - Chuyển vùng sang Cloud Advisor."]
    };
}

/**
 * RAG-POWERED QUERY — Integrated with TrustGraph
 */
export async function askWithRAG(query: string, options: {
    collection?: string,
    systemPrompt?: string,
    forceIntent?: QueryIntent,
    user?: string,
} = {}): Promise<{ response: string; intent: QueryIntent; source: string }> {
    const tg = getTrustGraphClient();
    const classification = options.forceIntent 
        ? { intent: options.forceIntent, confidence: 1, reason: 'Forced' }
        : classifyQueryIntent(query);
    
    try {
        if (await tg.isAvailable()) {
            const result = await tg.textCompletion({ prompt: query, system: options.systemPrompt });
            return { response: result.response, intent: classification.intent, source: 'trustgraph' };
        }
    } catch (e) { /* fallback */ }

    const fallback = await askAI(query, { systemPrompt: options.systemPrompt, forceBackend: 'gemini' });
    return { response: fallback, intent: classification.intent, source: 'gemini-fallback' };
}

/**
 * PERSONALIZED QUERY — User-centric AI
 */
export async function askPersonalized(query: string, options: { userId: string, history?: any[] }) {
    const userContext = await buildUserContext(options.userId);
    const queryFocus = extractQueryFocus(query);
    const focusedPrompt = buildFocusedPrompt(query, queryFocus, userContext);
    
    try {
        const nc = getNemoClawClient();
        const result = await nc.ask(focusedPrompt, { userId: options.userId, history: options.history });
        return { content: result.content, source: 'nemoclaw', focus: queryFocus.focus };
    } catch (e) {
        const content = await askAI(focusedPrompt, { forceBackend: 'gemini' });
        return { content, source: 'gemini-fallback', focus: queryFocus.focus };
    }
}

/**
 * GRAPH ANALYSIS
 */
export async function analyzeWithGraph(query: string, options: { collection?: string } = {}) {
    return { 
        response: await askAI(query, { systemPrompt: "Analyze graph relationships." }), 
        source: 'ai-manager-simulated-graph' 
    };
}

/**
 * IMAGE DETECTION (HF Fallback)
 */
export async function detectObjectsHF(buffer: Buffer, model: string = 'keremberke/yolov8n-protective-equipment-detection') {
    const hfToken = process.env.HF_API_KEY || process.env.HF_TOKEN;
    const client = new InferenceClient(hfToken);

    try {
        const result = await client.objectDetection({
            model: model,
            data: buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer,
        });
        return result;
    } catch (error: any) {
        console.error("HF Object Detection Error:", error);
        return [];
    }
}

/**
 * Unified object detection function.
 * Prioritizes local YOLO service, falls back to Hugging Face.
 */
export async function detectObjects(imageBuffer: Buffer, options: { 
    useLocal?: boolean,
    hfModel?: string 
} = { useLocal: true }) {
    if (options.useLocal) {
        try {
            const { detectObjects: callYoloService } = await import('../yolo');
            const localResult = await callYoloService(imageBuffer);
            if (localResult) return localResult;
        } catch (e) { console.warn("Local YOLO failed, falling back to HF."); }
    }
    return await detectObjectsHF(imageBuffer, options.hfModel);
}

/**
 * Health Check Aggregator
 */
export async function getAIHealthStatus() {
    const nc = getNemoClawClient();
    const tg = getTrustGraphClient();
    
    const [ncHealth, tgHealth] = await Promise.all([
        nc.healthCheck(),
        tg.healthCheck(),
    ]);
    
    return {
        nemoclaw: ncHealth,
        trustgraph: tgHealth,
        gemini: { available: !!GEMINI_API_KEY },
        huggingface: { available: !!(process.env.HF_API_KEY || process.env.HF_TOKEN) },
        status: ncHealth.available ? 'OFFLINE_LOCAL_READY' : 'CLOUD_FALLBACK_ACTIVE'
    };
}

import { InferenceClient } from "@huggingface/inference";

// Reuse existing HF logic
export async function askHuggingFace(prompt: string, model: string = DEFAULT_AI_MODEL, systemPrompt?: string) {
    const hfToken = process.env.HF_API_KEY || process.env.HF_TOKEN;
    const client = new InferenceClient(hfToken);
    
    const formattedPrompt = systemPrompt ? `${systemPrompt}\n\nHuman: ${prompt}\nAssistant:` : `Human: ${prompt}\nAssistant:`;

    try {
        const result = await client.chatCompletion({
            model: model,
            messages: [{ role: "user", content: formattedPrompt }],
            max_tokens: 500,
            temperature: 0.7,
        });

        return (result.choices[0]?.message?.content || "").trim();
    } catch (error: any) {
        console.warn(`[AI SERVICE WARNING] HF Error: ${error.message || error}`);
        return "AI Service is temporarily unavailable. Please try again later.";
    }
}

/**
 * Simple Vision Fallback
 */
export async function askVisionAI(prompt: string, image: { data: string, mimeType: string }, options: any = {}) {
    if (genAI) {
        const model = genAI.getGenerativeModel({ model: options.model || "gemini-1.5-flash" });
        const result = await model.generateContent([
            { text: options.systemPrompt ? `${options.systemPrompt}\n\n${prompt}` : prompt },
            { inlineData: { data: image.data, mimeType: image.mimeType } }
        ]);
        return (await result.response).text().trim();
    }
    return "Vision AI requires Gemini API key.";
}
