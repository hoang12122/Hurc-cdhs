import { GoogleGenerativeAI } from "@google/generative-ai";
import { DEFAULT_AI_MODEL } from "../constants";
import { getTrustGraphClient, TrustGraphError } from "./trustgraph-client";
import { classifyQueryIntent, suggestCollection, extractQueryFocus, buildFocusedPrompt, type QueryIntent } from "./ai-smart-router";
import { getNemoClawClient, type ChatMessage as NcChatMessage } from "./nemoclaw-client";
import { buildUserContext } from "./user-context";
import { detectObjects as callYoloService, type YoloResponse } from "./yolo";
import { crmToolDeclarations, executeCrmTool, openAiToolDeclarations } from "../ai-tools/crm-tools";


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini if key exists
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// ============ MAIN AI FUNCTION (Enhanced with TrustGraph) ============

export async function askAI(prompt: string, options: { 
    model?: string, 
    systemPrompt?: string, 
    groundingContext?: string,
    forceBackend?: 'nemoclaw' | 'trustgraph' | 'gemini' | 'huggingface',
    userId?: string,
    image?: { data: string, mimeType: string }, // Added for vision support
} = {}) {
    const { model, systemPrompt, groundingContext, forceBackend, userId, image } = options;

    if (image) {
        return askVisionAI(prompt, image, { model, systemPrompt, forceBackend, userId });
    }

    // 0. Try NemoClaw first (highest priority)
    if (!forceBackend || forceBackend === 'nemoclaw') {
        try {
            const nc = getNemoClawClient();
            if (await nc.isAvailable()) {
                const result = await nc.ask(
                    groundingContext 
                        ? `[NGỮ CẢNH]\n${groundingContext}\n\n[CÂU HỎI] ${prompt}`
                        : prompt,
                    {
                        systemPrompt,
                        userId,
                        temperature: 0.3,
                    }
                );
                return result.content;
            }
        } catch (error) {
            console.warn("NemoClaw unavailable, falling back:", error instanceof Error ? error.message : error);
        }
    }
    
    // 1. Try TrustGraph
    if (forceBackend !== 'gemini' && forceBackend !== 'huggingface') {
        try {
            const tg = getTrustGraphClient();
            if (await tg.isAvailable()) {
                const fullPrompt = groundingContext 
                    ? `Sử dụng các thông tin sau làm ngữ cảnh để trả lời câu hỏi:\n\n${groundingContext}\n\nCâu hỏi: ${prompt}`
                    : prompt;

                const result = await tg.textCompletion({
                    prompt: fullPrompt,
                    system: systemPrompt,
                });
                return result.response.trim();
            }
        } catch (error) {
            console.warn("TrustGraph unavailable, falling back to Gemini:", error instanceof Error ? error.message : error);
        }
    }

    // 2. Try Gemini if API Key is available
    if (forceBackend !== 'huggingface' && genAI && (!model || model.startsWith('gemini'))) {
        try {
            const geminiModel = genAI.getGenerativeModel({ 
                model: model || "gemini-1.5-flash",
                systemInstruction: systemPrompt
            });

            const fullPrompt = groundingContext 
                ? `Sử dụng các thông tin sau làm ngữ cảnh để trả lời câu hỏi:\n\n${groundingContext}\n\nCâu hỏi: ${prompt}`
                : prompt;

            const result = await geminiModel.generateContent(fullPrompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error("Gemini Error, falling back to HF:", error);
        }
    }

    // 3. Fallback to Hugging Face
    return askHuggingFace(prompt, model || DEFAULT_AI_MODEL, systemPrompt);
}

// ============ RAG-POWERED QUERY (NEW) ============

export async function askWithRAG(query: string, options: {
    collection?: string,
    systemPrompt?: string,
    forceIntent?: QueryIntent,
    user?: string,
} = {}): Promise<{ response: string; intent: QueryIntent; source: string }> {
    const tg = getTrustGraphClient();
    
    // Classify query intent
    const classification = options.forceIntent 
        ? { intent: options.forceIntent, confidence: 1, reason: 'Forced' }
        : classifyQueryIntent(query);
    
    const collection = options.collection || suggestCollection(query);

    // Try TrustGraph RAG
    try {
        if (await tg.isAvailable()) {
            switch (classification.intent) {
                case 'graph_rag': {
                    const result = await tg.graphRag({
                        query,
                        collection,
                        user: options.user,
                        'entity-limit': 50,
                        'triple-limit': 30,
                        'max-subgraph-size': 1000,
                        'max-path-length': 2,
                    });
                    return { response: result.response, intent: 'graph_rag', source: 'trustgraph' };
                }
                
                case 'document_rag': {
                    const result = await tg.documentRag({
                        query,
                        collection,
                        user: options.user,
                        'doc-limit': 20,
                    });
                    return { response: result.response, intent: 'document_rag', source: 'trustgraph' };
                }
                
                case 'agent': {
                    const result = await tg.agent({
                        question: query,
                        collection,
                        user: options.user,
                    });
                    return { response: result.answer, intent: 'agent', source: 'trustgraph' };
                }
                
                default: {
                    const result = await tg.textCompletion({
                        prompt: query,
                        system: options.systemPrompt,
                    });
                    return { response: result.response, intent: 'text_completion', source: 'trustgraph' };
                }
            }
        }
    } catch (error) {
        console.warn("TrustGraph RAG failed, falling back:", error instanceof Error ? error.message : error);
    }

    // Fallback to standard AI
    const fallbackResponse = await askAI(query, { 
        systemPrompt: options.systemPrompt, 
        forceBackend: 'gemini' 
    });
    return { response: fallbackResponse, intent: classification.intent, source: 'gemini-fallback' };
}

// ============ GRAPH ANALYSIS (NEW) ============

export async function analyzeWithGraph(query: string, options: {
    collection?: string,
    entityLimit?: number,
    maxPathLength?: number,
} = {}): Promise<{ response: string; source: string }> {
    const tg = getTrustGraphClient();

    try {
        if (await tg.isAvailable()) {
            const result = await tg.graphRag({
                query,
                collection: options.collection || 'hurc-general',
                'entity-limit': options.entityLimit || 100,
                'max-path-length': options.maxPathLength || 3,
                'max-subgraph-size': 2000,
            });
            return { response: result.response, source: 'trustgraph-graph-rag' };
        }
    } catch (error) {
        console.warn("Graph analysis failed:", error instanceof Error ? error.message : error);
    }

    // Fallback
    const systemPrompt = "Bạn là chuyên gia phân tích mối quan hệ dữ liệu. Hãy phân tích các mối liên quan giữa các thực thể được đề cập.";
    const response = await askAI(query, { systemPrompt, forceBackend: 'gemini' });
    return { response, source: 'gemini-fallback' };
}

// ============ SEMANTIC SEARCH (NEW) ============

export async function semanticSearch(query: string, options: {
    collection?: string,
    limit?: number,
    type?: 'graph' | 'document' | 'all',
} = {}): Promise<any[]> {
    const tg = getTrustGraphClient();

    try {
        if (await tg.isAvailable()) {
            const results: any[] = [];

            if (options.type !== 'document') {
                try {
                    const graphResults = await tg.graphEmbeddingsQuery({
                        query,
                        collection: options.collection,
                        limit: options.limit || 10,
                    });
                    if (Array.isArray(graphResults)) {
                        results.push(...graphResults.map((r: any) => ({ ...r, _source: 'graph' })));
                    }
                } catch { /* skip if graph embeddings unavailable */ }
            }

            if (options.type !== 'graph') {
                try {
                    const docResults = await tg.documentEmbeddingsQuery(query, {
                        collection: options.collection,
                        limit: options.limit || 10,
                    });
                    if (Array.isArray(docResults)) {
                        results.push(...docResults.map((r: any) => ({ ...r, _source: 'document' })));
                    }
                } catch { /* skip if document embeddings unavailable */ }
            }

            return results;
        }
    } catch (error) {
        console.warn("Semantic search failed:", error instanceof Error ? error.message : error);
    }

    return [];
}

// ============ CONTEXT MENTIONS (PAPERCLIP STYLE) ============

/**
 * Quét chuỗi prompt để tìm các thực thể @entity-id và lấy dữ liệu tương ứng.
 * Hỗ trợ: @dnf-ID, @log-ID, @user-EMAIL
 */
async function resolveContextMentions(prompt: string): Promise<string[]> {
    const mentions = prompt.match(/@([a-zA-Z0-9]+)-([a-zA-Z0-9.@_-]+)/g);
    if (!mentions) return [];

    const attachments: string[] = [];
    const { getJsonCollection, readDb } = await import('../json-db-service');
    const db = readDb();

    for (const mention of mentions) {
        const [_, type, id] = mention.match(/@([a-zA-Z0-aligned]+)-([a-zA-Z0-9.@_-]+)/)!;
        
        try {
            if (type.toLowerCase() === 'dnf') {
                const dnfs = db.dnfs || [];
                const item = dnfs.find((d: any) => d.id === id || d.failureReportNo === id);
                if (item) attachments.push(`[ATTACHMENT: DNF ${id}]\n${JSON.stringify(item, null, 2)}`);
            } else if (type.toLowerCase() === 'log') {
                const { readAllLogs } = await import('./log-writer');
                const logs = await readAllLogs();
                const item = logs.find((l: any) => l.id === id);
                if (item) attachments.push(`[ATTACHMENT: LOG ${id}]\n${JSON.stringify(item, null, 2)}`);
            } else if (type.toLowerCase() === 'user') {
                const users = db.users || [];
                const item = users.find((u: any) => u.id === id || u.email === id);
                if (item) attachments.push(`[ATTACHMENT: USER ${id}]\n${JSON.stringify({ ...item, password: '[REDACTED]' }, null, 2)}`);
            }
        } catch (e) {
            console.error(`Lỗi khi trích xuất dữ liệu cho @${type}-${id}:`, e);
        }
    }

    return attachments;
}

// ============ MULTI-TURN AGENT CHAT (NEW, WITH TOOLS) ============

export async function agentChat(question: string, options: {
    state?: any,
    history?: any[],
    collection?: string,
    user?: string,
} = {}): Promise<{ answer: string; state: any; history: any[]; source: string; steps?: string[] }> {
    const tg = getTrustGraphClient();

    // 1. Try Legacy TrustGraph Agent if specifically requested
    try {
        if (await tg.isAvailable() && options.collection) {
            const result = await tg.agent({
                question,
                state: options.state,
                history: options.history,
                collection: options.collection,
                user: options.user,
            });
            return {
                answer: result.answer,
                state: result.state,
                history: result.history || [],
                source: 'trustgraph-agent',
            };
        }
    } catch (error) {
        console.warn("TrustGraph Agent chat failed, sliding to Robust Loop:", error instanceof Error ? error.message : error);
    }

    // 2. Robust NemoClaw Agent Loop (GoClaw Model)
    const nc = getNemoClawClient();
    if (await nc.isAvailable()) {
        try {
            const result = await runRobustAgentLoop(question, { 
                history: options.history || [], 
                user: options.user,
                collection: options.collection 
            });
            return result;
        } catch (e: any) {
            console.error("Robust Agent Loop failed, falling back to Gemini:", e);
        }
    }

    // 3. Fallback to Gemini if NemoClaw failed or unavailable
    if (genAI) {
        try {
            const model = genAI.getGenerativeModel({
                model: DEFAULT_AI_MODEL || "gemini-1.5-flash",
                tools: [{ functionDeclarations: crmToolDeclarations }],
                systemInstruction: "Bạn là HURC AI - Trợ lý quản trị kỹ thuật đóng vai trò là Cố vấn (Advisor) cho con người. Bạn sẽ KHÔNG được phép tự ý thay đổi hay hành động lên dữ liệu. Nhiệm vụ của bạn là sử dụng CÔNG CỤ (Tools) để đọc dữ liệu hệ thống (ví dụ: tìm DNF, đọc cấu hình mạng), sau đó phân tích và định hướng giải quyết. Hãy luôn cung cấp phân tích khách quan và hướng dẫn người dùng tự thực thi thao tác trên giao diện, hoặc chờ người dùng phê duyệt trước bất kỳ hành động nào. Không bao giờ khẳng định bạn đã xóa/sửa dữ liệu."
            });

            // Flatten and convert history format for Gemini
            const geminiHistory = (options.history || []).map(msg => ({
                role: msg.role === 'model' || msg.role === 'ai' ? 'model' : 'user',
                parts: [{ text: msg.content || msg.text || '' }] // Prevent breaking gemini SDK
            })).filter(h => h.parts[0].text);

            const chat = model.startChat({ history: geminiHistory });
            const result = await chat.sendMessage(question);

            // Reasoning Loop: Check if AI Agent wants to use its Hands
            const functionCalls = result.response.functionCalls();
            
            if (functionCalls && functionCalls.length > 0) {
                const call = functionCalls[0];
                console.log(`[AI AGENT] Quyết định gọi công cụ: ${call.name}`, call.args);
                
                // Thực thi Tools (Lớp MCP/Hands)
                const apiResponse = await executeCrmTool(call.name, call.args);
                
                // Trả kết quả về cho bộ não sinh ra ngôn ngữ từ nhiên
                const result2 = await chat.sendMessage([{
                    functionResponse: {
                        name: call.name,
                        response: apiResponse
                    }
                }]);

                return { 
                    answer: result2.response.text(), 
                    state: options.state, 
                    history: [...(options.history || []), { role: 'user', content: question }, { role: 'ai', content: result2.response.text(), tool_used: call.name }], 
                    source: 'gemini-agent-tools' 
                };
            }

            // Simple text response (No tools needed)
            return { 
                answer: result.response.text(), 
                state: options.state, 
                history: [...(options.history || []), { role: 'user', content: question }, { role: 'ai', content: result.response.text() }], 
                source: 'gemini-agent' 
            };
        } catch (e: any) {
            console.error("Gemini Agent Tools failed:", e);
        }
    }

    // 4. Absolute Fallback
    const response = await askAI(question, { forceBackend: 'huggingface' });
    return { answer: response, state: null, history: [], source: 'huggingface-fallback' };
}

// ============ DOCUMENT INGESTION (NEW) ============

export async function ingestDocument(content: string, docId: string, options: {
    collection?: string,
    user?: string,
} = {}): Promise<{ success: boolean; source: string }> {
    const tg = getTrustGraphClient();

    try {
        if (await tg.isAvailable()) {
            await tg.textLoad({
                text: content,
                id: docId,
                collection: options.collection || 'hurc-general',
                user: options.user,
            });
            return { success: true, source: 'trustgraph' };
        }
    } catch (error) {
        console.warn("Document ingestion to TrustGraph failed:", error instanceof Error ? error.message : error);
    }

    return { success: false, source: 'none' };
}

export async function ingestBinaryDocument(buffer: Buffer, docId: string, options: {
    collection?: string,
    user?: string,
} = {}): Promise<{ success: boolean; source: string }> {
    const tg = getTrustGraphClient();

    try {
        if (await tg.isAvailable()) {
            const base64Data = buffer.toString('base64');
            await tg.documentLoad({
                data: base64Data,
                id: docId,
                collection: options.collection || 'hurc-general',
                user: options.user,
            });
            return { success: true, source: 'trustgraph' };
        }
    } catch (error) {
        console.warn("Binary document ingestion failed:", error instanceof Error ? error.message : error);
    }

    return { success: false, source: 'none' };
}

// ============ PERSONALIZED AI QUERY (NEW — NemoClaw) ============

export async function askPersonalized(query: string, options: {
    userId: string;
    history?: import('./nemoclaw-client').ChatMessage[];
} = {} as any): Promise<{ content: string; source: string; focus: string }> {
    const userId = options.userId;

    // 1. Build per-user CRM context
    const userContext = await buildUserContext(userId);

    // 2. Analyze query intent and focus
    const queryFocus = extractQueryFocus(query);

    // 3. Build focused prompt (structured, precise)
    const focusedPrompt = buildFocusedPrompt(query, queryFocus);

    // 4. Try NemoClaw with full personalization
    try {
        const nc = getNemoClawClient();
        if (await nc.isAvailable()) {
            const result = await nc.askPersonalized(focusedPrompt, {
                userContext,
                userId,
                history: options.history,
                temperature: 0.2,
            });
            return {
                content: result.content,
                source: 'nemoclaw',
                focus: queryFocus.focus,
            };
        }
    } catch (error) {
        console.warn('NemoClaw personalized query failed:', error instanceof Error ? error.message : error);
    }

    // 5. Fallback: use standard askAI with context injection
    const fallbackResponse = await askAI(focusedPrompt, {
        systemPrompt: `Bạn là trợ lý AI CRM. Trả lời CHÍNH XÁC, NGẮN GỌN, có CẤU TRÚC.\n\nThông tin user:\n${userContext}`,
        userId,
    });
    return {
        content: fallbackResponse,
        source: genAI ? 'gemini-fallback' : 'huggingface-fallback',
        focus: queryFocus.focus,
    };
}

// ============ HEALTH CHECK (Enhanced) ============

export async function getAIHealthStatus() {
    const nc = getNemoClawClient();
    const tg = getTrustGraphClient();
    
    const [nemoClawHealth, trustgraphHealth] = await Promise.all([
        nc.healthCheck(),
        tg.healthCheck(),
    ]);
    
    // Determine primary backend
    let primaryBackend = 'HuggingFace';
    if (nemoClawHealth.available) primaryBackend = 'NemoClaw';
    else if (trustgraphHealth.available) primaryBackend = 'TrustGraph';
    else if (GEMINI_API_KEY) primaryBackend = 'Gemini';

    return {
        nemoclaw: nemoClawHealth,
        trustgraph: trustgraphHealth,
        gemini: { available: !!GEMINI_API_KEY },
        huggingface: { available: !!(process.env.HF_API_KEY || process.env.HF_TOKEN) },
        primaryBackend,
    };
}

// ============ EXISTING FUNCTIONS (Preserved) ============

import { InferenceClient } from "@huggingface/inference";

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
        throw new Error(`HF Error: ${error.message || error}`);
    }
}

export async function detectObjectsHF(imageBuffer: Buffer, model: string = 'keremberke/yolov8n-protective-equipment-detection') {
    const hfToken = process.env.HF_API_KEY || process.env.HF_TOKEN;
    const client = new InferenceClient(hfToken);

    try {
        const result = await client.objectDetection({
            model: model,
            data: imageBuffer.buffer.slice(imageBuffer.byteOffset, imageBuffer.byteOffset + imageBuffer.byteLength) as ArrayBuffer,
        });
        return result;
    } catch (error: any) {
        console.error("HF Object Detection Error:", error);
        return [];
    }
}

/**
 * TEXT-TO-IMAGE (HF Implementation)
 */
export async function generateImageHF(prompt: string, model: string = 'black-forest-labs/FLUX.1-dev') {
    const hfToken = process.env.HF_API_KEY || process.env.HF_TOKEN;
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            ...(hfToken ? { "Authorization": `Bearer ${hfToken}` } : {}) 
        },
        body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) throw new Error(`Image Generation Error: ${response.status}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return `data:image/png;base64,${base64}`;
}

/**
 * Perform object detection using the local YOLOv8 sidecar service.
 * Highly recommended for real-time safety and maintenance monitoring.
 */
export async function detectObjectsLocal(imageBuffer: Buffer): Promise<YoloResponse | null> {
    try {
        return await callYoloService(imageBuffer);
    } catch (error) {
        console.error("Local YOLO Error:", error);
        return null;
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
        const localResult = await detectObjectsLocal(imageBuffer);
        if (localResult) return localResult;
    }
    
    // Fallback to HF
    return await detectObjectsHF(imageBuffer, options.hfModel);
}

/**
 * Ask an Open Multi-modal Model (Vision-Language Model)
 */
export async function askVisionAI(prompt: string, image: { data: string, mimeType: string }, options: {
    model?: string,
    systemPrompt?: string,
    forceBackend?: 'nemoclaw' | 'gemini' | 'huggingface' | 'trustgraph',
    userId?: string,
} = {}) {
    const { model, systemPrompt, forceBackend } = options;

    // 1. Try Gemini if available (as fallback/primary depending on ENV)
    if (forceBackend === 'gemini' || (genAI && !forceBackend)) {
        try {
            const geminiModel = genAI!.getGenerativeModel({ model: model || "gemini-1.5-flash" });
            const result = await geminiModel.generateContent([
                { text: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt },
                {
                    inlineData: {
                        data: image.data,
                        mimeType: image.mimeType
                    }
                }
            ]);
            return (await result.response).text().trim();
        } catch (error) {
            console.error("Gemini Vision Error:", error);
            if (forceBackend === 'gemini') throw error;
        }
    }

    // 2. Default to Hugging Face Open Model (Idefics2 or SmolVLM)
    const hfModel = model || 'HuggingFaceM4/Idefics2-8b';
    const hfToken = process.env.HF_API_KEY;

    try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${hfModel}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(hfToken ? { "Authorization": `Bearer ${hfToken}` } : {})
            },
            body: JSON.stringify({
                inputs: {
                    query: prompt,
                    image: image.data // Base64
                },
                parameters: { max_new_tokens: 500 }
            })
        });

        if (response.ok) {
            const data = await response.json();
            return Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
        }
    } catch (error) {
        console.error("HF Vision Error:", error);
    }

    return "Không thể phân tích hình ảnh bằng các model Open lúc này.";
}

// ============ AGENT LOOP MANAGEMENT (GO-CLAW IMPLEMENTATION) ============

const MAX_AGENT_ITERATIONS = 12; // Mặc định từ user
const CONTEXT_WINDOW_THRESHOLD = 30000; // Ngưỡng ký tự (ước lượng cho local LLM)

/**
 * Robust Agent Loop — Triển khai mô hình GoClaw giúp Agent hoạt động ổn định, 
 * tránh vòng lặp và tối ưu hóa ngữ cảnh hội thoại.
 */
async function runRobustAgentLoop(question: string, options: {
    history: any[],
    user?: string,
    collection?: string
}): Promise<{ answer: string; state: any; history: any[]; source: string; steps?: string[] }> {
    const nc = getNemoClawClient();
    const steps: string[] = [];
    let currentHistory: NcChatMessage[] = [...options.history.map(h => ({
        role: (h.role === 'ai' || h.role === 'model') ? 'assistant' : h.role,
        content: h.content || h.text || ''
    }))];
    
    // Thêm câu hỏi hiện tại vào lịch sử
    currentHistory.push({ role: 'user', content: question });

    // --- PHASE 0: RESOLVE MENTIONS (Paperclip Style) ---
    const attachments = await resolveContextMentions(question);
    if (attachments.length > 0) {
        console.log(`[AI THOUGHT] Phát hiện ${attachments.length} attachments từ @mentions.`);
        steps.push(`Đã đính kèm (clipped) ${attachments.length} thực thể từ @mentions.`);
        currentHistory.push({ 
            role: 'system', 
            content: `Dưới đây là các dữ liệu thực thể bạn vừa "kẹp" (clipped) vào hội thoại thông qua @mention:\n\n${attachments.join('\n\n')}` 
        });
    }

    let iterations = 0;
    const toolLoopState = new Map<string, number>(); // Tracking identical calls

    while (iterations < MAX_AGENT_ITERATIONS) {
        iterations++;
        
        // --- PHASE 1 & 2: CONTEXT DEFENSE ---
        currentHistory = manageAgentContext(currentHistory);

        console.log(`[AI THOUGHT] Bắt đầu vòng lặp #${iterations}. Ngữ cảnh hiện tại: ${estimateTokens(currentHistory)} tokens.`);

        // --- PHASE 2.5: Inject Project Context (Claw-Code Style) ---
        const projectContext = `
[PROJECT CONTEXT]
- CWD: ${process.cwd()}
- DATE: ${new Date().toLocaleString()}
- ROLE: Bạn là HURC AI Technical Agent (Claw). 
- MISSION: Giúp người dùng phân tích, tìm kiếm và hiểu mã nguồn dự án HURC1-CRM.
- TOOLS: Bạn có các công cụ 'claw_ls', 'claw_read', 'claw_grep' để tự mình khám phá code. Đừng bao giờ phỏng đoán logic nếu bạn có thể tự đọc file.
`.trim();

        // --- STEP 1: Build filtered tools & Send request ---
        const response = await nc.chatCompletion({
            messages: [
                { role: 'system', content: `Bạn là HURC AI - Trợ lý quản trị kỹ thuật chuyên nghiệp. \n\n${projectContext}\n\nHãy sử dụng các công cụ có sẵn để lấy dữ liệu trước khi trả lời. Ưu tiên sử dụng 'claw_ls' để xem cấu trúc và 'claw_read' để hiểu logic.` },
                ...currentHistory
            ],
            tools: openAiToolDeclarations,
            tool_choice: 'auto',
            user: options.user
        });

        const choice = response.choices?.[0];
        const message = choice?.message;
        
        if (!message) throw new Error("Agent không phản hồi.");

        // Thêm phản hồi của AI (assistant) vào lịch sử
        currentHistory.push({
            role: 'assistant',
            content: message.content,
            tool_calls: message.tool_calls
        });

        // --- STEP 2: Check if loop stops (No tool calls) ---
        if (!message.tool_calls || message.tool_calls.length === 0) {
            console.log(`[AI THOUGHT] Agent hoàn thành nhiệm vụ tại vòng lặp #${iterations}.`);
            steps.push("Đã hoàn thành phân tích và chuẩn bị câu trả lời.");
            return {
                answer: message.content || "Tôi đã xử lý xong yêu cầu của bạn.",
                state: null,
                history: currentHistory,
                source: 'nemoclaw-robust-agent',
                steps
            };
        }

        // --- STEP 3: Parallel Tool Execution ---
        console.log(`[AI THOUGHT] Agent quyết định gọi ${message.tool_calls.length} công cụ song song.`);
        
        const toolResults = await Promise.all(message.tool_calls.map(async (call) => {
            const toolId = call.id;
            const functionName = call.function.name;
            const args = JSON.parse(call.function.arguments || '{}');
            
            // --- LOOP SAFETY CHECK ---
            const callFingerprint = `${functionName}:${JSON.stringify(args)}`;
            const callCount = (toolLoopState.get(callFingerprint) || 0) + 1;
            toolLoopState.set(callFingerprint, callCount);

            if (callCount >= 5) {
                console.warn(`[AI THOUGHT] PHÁT HIỆN STUCK LOOP: Công cụ ${functionName} bị gọi lặp lại 5 lần.`);
                return {
                    role: 'tool' as const,
                    tool_call_id: toolId,
                    content: "LỖI: Hệ thống phát hiện vòng lặp vô tận. Vui lòng dừng gọi công cụ này và báo cáo kết quả hiện tại cho người dùng."
                } as NcChatMessage;
            }

            if (callCount >= 3) {
                console.log(`[AI THOUGHT] CẢNH BÁO: Phât hiện vòng lặp tiềm năng cho ${functionName}.`);
            }

            // Execute
            steps.push(`Đang thực thi công cụ: ${functionName} (${JSON.stringify(args)})`);
            const result = await executeCrmTool(functionName, args);
            return {
                role: 'tool' as const,
                tool_call_id: toolId,
                name: functionName,
                content: JSON.stringify(result)
            } as NcChatMessage;
        }));

        // Thêm kết quả tool vào lịch sử
        currentHistory.push(...toolResults);
    }

    return {
        answer: "Xin lỗi, tôi đã đạt giới hạn suy nghĩ tối đa (12 bước) cho yêu cầu này nhưng vẫn chưa hoàn thành. Đây là những gì tôi biết: " + (currentHistory[currentHistory.length-1]?.content || ""),
        state: null,
        history: currentHistory,
        source: 'nemoclaw-robust-agent-timeout',
        steps
    };
}

/**
 * Quản lý ngữ cảnh: Cắt tỉa (Prune) và Nén (Compact) tự động.
 */
function manageAgentContext(history: NcChatMessage[]): NcChatMessage[] {
    const totalChars = history.reduce((acc, msg) => acc + (msg.content?.length || 0), 0);
    
    // Phase 2: Compact (Nén lịch sử khi vượt 100% threshold)
    if (totalChars > CONTEXT_WINDOW_THRESHOLD) {
        console.log(`[AI THOUGHT] CONTEXT DEFENSE (Phase 2): Vượt ngưỡng ${CONTEXT_WINDOW_THRESHOLD} chars. Tiến hành nén lịch sử...`);
        const systemMsg = history.find(m => m.role === 'system');
        const recentMsgs = history.slice(-5); // Giữ lại 5 tin nhắn gần nhất
        const toCompact = history.slice(systemMsg ? 1 : 0, -5);
        
        const summary = ` tóm tắt các bước trước đó: Agent đã thực hiện ${toCompact.filter(m => m.role === 'tool').length} lần gọi công cụ và phân tích dữ liệu DNF/Health.`;
        
        return [
            ...(systemMsg ? [systemMsg] : []),
            { role: 'assistant', content: "[Hệ thống tự động nén ngữ cảnh]: " + summary },
            ...recentMsgs
        ];
    }
    
    // Phase 1: Soft Prune (Cắt tỉa nhẹ khi vượt 70%)
    if (totalChars > CONTEXT_WINDOW_THRESHOLD * 0.7) {
        console.log(`[AI THOUGHT] CONTEXT DEFENSE (Phase 1): Ngữ cảnh đang phình to. Cắt tỉa các phản hồi tool quá dài.`);
        return history.map(msg => {
            if (msg.role === 'tool' && (msg.content?.length || 0) > 2000) {
                return { ...msg, content: msg.content!.substring(0, 1000) + "... [Dữ liệu đã được cắt tỉa để tối ưu ngữ cảnh]" };
            }
            return msg;
        });
    }

    return history;
}

function estimateTokens(history: NcChatMessage[]): number {
    return Math.floor(history.reduce((acc, m) => acc + (m.content?.length || 0), 0) / 4);
}
