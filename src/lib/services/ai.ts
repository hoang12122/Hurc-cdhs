import { GoogleGenerativeAI } from "@google/generative-ai";
import { getTrustGraphClient, TrustGraphError } from "./trustgraph-client";
import { classifyQueryIntent, suggestCollection, extractQueryFocus, buildFocusedPrompt, type QueryIntent } from "./ai-smart-router";
import { getNemoClawClient } from "./nemoclaw-client";
import { buildUserContext } from "./user-context";

export const DEFAULT_AI_MODEL = process.env.NEXT_PUBLIC_HF_MODEL || 'google/gemma-7b-it';
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
} = {}) {
    const { model, systemPrompt, groundingContext, forceBackend, userId } = options;

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

// ============ MULTI-TURN AGENT CHAT (NEW) ============

export async function agentChat(question: string, options: {
    state?: any,
    history?: any[],
    collection?: string,
    user?: string,
} = {}): Promise<{ answer: string; state: any; history: any[]; source: string }> {
    const tg = getTrustGraphClient();

    try {
        if (await tg.isAvailable()) {
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
        console.warn("Agent chat failed:", error instanceof Error ? error.message : error);
    }

    // Fallback to simple Gemini
    const response = await askAI(question, { forceBackend: 'gemini' });
    return { answer: response, state: null, history: [], source: 'gemini-fallback' };
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
        huggingface: { available: !!process.env.HF_API_KEY },
        primaryBackend,
    };
}

// ============ EXISTING FUNCTIONS (Preserved) ============

export async function askHuggingFace(prompt: string, model: string = DEFAULT_AI_MODEL, systemPrompt?: string) {
    const hfToken = process.env.HF_API_KEY;
    
    const formattedPrompt = systemPrompt ? `${systemPrompt}\n\nHuman: ${prompt}\nAssistant:` : `Human: ${prompt}\nAssistant:`;

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(hfToken ? { "Authorization": `Bearer ${hfToken}` } : {})
        },
        signal: AbortSignal.timeout(30000), 
        body: JSON.stringify({
            inputs: formattedPrompt,
            parameters: {
                max_new_tokens: 500,
                temperature: 0.7,
                return_full_text: false
            }
        })
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        if (response.status === 503 && errorBody.includes('loading')) {
            throw new Error('Mô hình AI đang được khởi tạo. Vui lòng thử lại sau 20-30 giây.');
        }
        throw new Error(`AI Service Error (${response.status}): ${response.statusText}. ${errorBody.substring(0, 200)}`);
    }

    const data = await response.json();
    
    let resultText = '';
    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
        resultText = data[0].generated_text;
    } else if (data.generated_text) {
        resultText = data.generated_text;
    } else {
        resultText = JSON.stringify(data);
    }
    
    return resultText.trim();
}

export async function detectObjectsHF(imageBuffer: Buffer, model: string = 'keremberke/yolov8n-protective-equipment-detection') {
    const hfToken = process.env.HF_API_KEY;

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers: {
            "Content-Type": "image/jpeg",
            ...(hfToken ? { "Authorization": `Bearer ${hfToken}` } : {})
        },
        signal: AbortSignal.timeout(60000), // 60 second timeout for vision
        body: new Uint8Array(imageBuffer)
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        if (response.status === 503 && errorBody.includes('loading')) {
            throw new Error('Mô hình Vision AI đang được khởi tạo. Vui lòng thử lại sau 30-60 giây.');
        }
        throw new Error(`Vision AI Service Error (${response.status}): ${response.statusText}. ${errorBody.substring(0, 200)}`);
    }

    const data = await response.json();
    return data;
}
