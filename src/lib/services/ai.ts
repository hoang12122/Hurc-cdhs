import { AI_CONFIG } from "../config/ai-config";
import { getTrustGraphClient, TrustGraphError } from "./trustgraph-client";
import { classifyQueryIntent, suggestCollection, extractQueryFocus, buildFocusedPrompt, type QueryIntent, AI_CLASSIFICATION_PROMPT } from "./ai-smart-router";
import { getNemoClawClient, type ChatMessage as NcChatMessage } from "./nemoclaw-client";
import { buildUserContext } from "./user-context";
import { detectObjects as callYoloService, type YoloResponse } from "./yolo";
import { executeCrmTool, openAiToolDeclarations } from "../ai-tools/crm-tools";
import { retrieveMemories, storeExperience } from "./agent-memory";
import { runReflectionLoop, STRICT_CONSTRAINT, manageAgentContext } from "./ai/anti-hallucination";
import { jsonDb } from "../db/json-db";

/**
 * HURC AI SERVICE (LOCAL-ONLY EDITION)
 * Chỉ sử dụng hạ tầng Local (NemoClaw/TrustGraph/YOLO) để đảm bảo bảo mật dữ liệu tuyệt đối.
 */

// ============ MAIN AI FUNCTION (Enhanced with TrustGraph) ============

export async function askAI(prompt: string, options: { 
    model?: string, 
    systemPrompt?: string, 
    groundingContext?: string,
    forceBackend?: 'nemoclaw' | 'trustgraph',
    userId?: string,
    image?: { data: string, mimeType: string },
    temperature?: number,
    reflect?: boolean, // New: Enable Self-Reflection (Task 2.1 AI-Hardening)
    skipReflection?: boolean, // Bypass reflection loop recursively
} = {}) {
    const { model, systemPrompt, groundingContext, forceBackend, userId, image, temperature, reflect, skipReflection } = options;

    // Retrieve Long-term Memory (TencentDB Agent Memory Logic)
    let memoryContext = "";
    if (userId && !image) {
        memoryContext = await retrieveMemories(userId, prompt.substring(0, 100));
    }

    if (image) {
        return askVisionAI(prompt, image, { model, systemPrompt, forceBackend, userId });
    }

    const enhancedSystemPrompt = systemPrompt 
        ? `${systemPrompt}\n\n${STRICT_CONSTRAINT}`
        : `Bạn là trợ lý kỹ thuật chuyên nghiệp của HURC1 CRM.\n\n${STRICT_CONSTRAINT}`;

    let rawResponse = "";

    // 0. Try NemoClaw first (highest priority)
    if (!forceBackend || forceBackend === 'nemoclaw') {
        try {
            const nc = getNemoClawClient();
            const enhancedPrompt = memoryContext 
                ? `${memoryContext}\n\n[CÂU HỎI HIỆN TẠI]: ${prompt}`
                : (groundingContext ? `[NGỮ CẢNH]\n${groundingContext}\n\n[CÂU HỎI] ${prompt}` : prompt);

            const result = await nc.ask(
                enhancedPrompt,
                {
                    systemPrompt: enhancedSystemPrompt,
                    userId,
                    temperature: temperature ?? 0.3,
                }
            );

            // Store this interaction in memory for future context
            if (userId) {
                await storeExperience(userId, prompt.substring(0, 50), result.content, 5);
            }

            rawResponse = result.content;
        } catch (error) {
            console.warn("NemoClaw request failed, trying TrustGraph fallback:", error instanceof Error ? error.message : error);
        }
    }
    
    // 1. Try TrustGraph
    if (!rawResponse && forceBackend !== 'nemoclaw') {
        try {
            const tg = getTrustGraphClient();
            const fullPrompt = groundingContext 
                ? `Sử dụng các thông tin sau làm ngữ cảnh để trả lời câu hỏi:\n\n${groundingContext}\n\nCâu hỏi: ${prompt}`
                : prompt;

            const result = await tg.textCompletion({
                prompt: fullPrompt,
                system: enhancedSystemPrompt,
            });
            let finalResponse = result.response.trim();

            // PHASE 3 - TASK 2.2: Self-Reflection Loop (AI-Hardening)
            if (reflect) {
                const reflectionPrompt = `Bạn vừa đưa ra câu trả lời sau:\n"${finalResponse}"\n\nHãy kiểm tra lại xem câu trả lời có chính xác, logic và đầy đủ dựa trên ngữ cảnh được cung cấp không. Nếu có lỗi, hãy sửa lại. Nếu đã tốt, hãy trả về nguyên văn câu trả lời.`;
                const reflected = await tg.textCompletion({
                    prompt: reflectionPrompt,
                    system: "Bạn là một kiểm soát viên AI cẩn trọng (AI Auditor).",
                });
                finalResponse = reflected.response.trim();
            }

            rawResponse = finalResponse;
        } catch (error) {
            console.warn("TrustGraph unavailable:", error instanceof Error ? error.message : error);
        }
    }

    if (!rawResponse) {
        // Chế độ dự phòng Core-Only (Không chạy dịch vụ AI): Trả về phản hồi thân thiện thay vì crash ứng dụng
        return "Tính năng AI tạm thời không khả dụng do hệ thống đang chạy ở chế độ tối giản hạ tầng (Core-Only).";
    }

    // Integrate the self-reflection loop if context is present and reflection not skipped
    if (groundingContext && !skipReflection) {
        return await runReflectionLoop(
            prompt,
            rawResponse,
            groundingContext,
            enhancedSystemPrompt,
            async (p, opts) => {
                return await askAI(p, {
                    ...options,
                    systemPrompt: enhancedSystemPrompt,
                    temperature: opts?.temperature ?? 0.1,
                    skipReflection: true
                });
            }
        );
    }

    return rawResponse;
}

// ============ RAG-POWERED QUERY ============

export async function askWithRAG(query: string, options: {
    collection?: string,
    systemPrompt?: string,
    forceIntent?: QueryIntent,
    user?: string,
}): Promise<{ response: string; intent: QueryIntent; source: string }> {
    if (!query || query.trim() === "") {
        return { response: "Vui lòng nhập câu hỏi của bạn.", intent: 'text_completion', source: 'guard-clause' };
    }
    const tg = getTrustGraphClient();
    
    // PHASE 0 - CONNECTION RESILIENCE (Startup Race Protection)
    let retries = 3;
    while (retries > 0) {
        try {
            if (await tg.isAvailable()) break;
        } catch (e) {}
        retries--;
        if (retries > 0) {
            console.warn(`⚠️ [AI-RESILIENCE] AI Service not ready, retrying... (${retries} left)`);
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    // 0. AI-driven Intent Classification (Hybrid)
    let intent: QueryIntent = options.forceIntent || 'text_completion';
    if (!options.forceIntent) {
        try {
            const aiClass = await askAI(AI_CLASSIFICATION_PROMPT.replace('{query}', query), { temperature: 0 });
            intent = aiClass.trim().toLowerCase() as QueryIntent;
            if (!['graph_rag', 'document_rag', 'agent', 'text_completion'].includes(intent)) {
                intent = classifyQueryIntent(query).intent; // Fallback to Regex
            }
        } catch {
            intent = classifyQueryIntent(query).intent; // Fallback to Regex
        }
    }
    
    const collection = options.collection || suggestCollection(query);

    // 1. Ensemble Mode (Parallel Graph + Doc)
    if (intent === 'graph_rag' || intent === 'document_rag') {
        try {
            const [graphRes, docRes] = await Promise.allSettled([
                tg.graphRag({ query, collection, user: options.user }),
                tg.documentRag({ query, collection, user: options.user })
            ]);

            const graphContext = graphRes.status === 'fulfilled' ? graphRes.value.response : "";
            const docContext = docRes.status === 'fulfilled' ? docRes.value.response : "";

                if (!graphContext && !docContext) {
                    return { 
                        response: "Hệ thống không tìm thấy dữ liệu kỹ thuật cụ thể cho yêu cầu này. Vui lòng cung cấp thêm chi tiết hoặc kiểm tra mã DNF.", 
                        intent: 'ensemble' as any, 
                        source: 'hard-refusal' 
                    };
                }
                
                const fusedPrompt = `Sử dụng dữ liệu từ hai nguồn sau để trả lời. Lưu ý: Dữ liệu từ Đồ thị (KNOWLEDGE_GRAPH) có độ tin cậy cao hơn nếu có mâu thuẫn.\n\n[SOURCE: KNOWLEDGE_GRAPH]\n${graphContext}\n\n[SOURCE: TECHNICAL_DOCUMENT]\n${docContext}\n\nCâu hỏi: ${query}`;
                const fusedResp = await askAI(fusedPrompt, { systemPrompt: options.systemPrompt });
                
                const contextStr = `[GRAPH]\n${graphContext}\n[DOC]\n${docContext}`;
                const currentResponse = await runReflectionLoop(
                    query,
                    fusedResp,
                    contextStr,
                    options.systemPrompt || "",
                    async (p, opts) => {
                        return await askAI(p, { systemPrompt: options.systemPrompt, temperature: opts?.temperature, skipReflection: true });
                    }
                );

                return { response: currentResponse, intent: 'ensemble' as any, source: 'trustgraph-ensemble' };
        } catch (e) {
            console.warn("Ensemble RAG failed, trying single path:", e);
        }
    }

    try {
        if (await tg.isAvailable()) {
            switch (intent) {
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
                    const textCompletionSystemPrompt = options.systemPrompt
                        ? `${options.systemPrompt}\n\n${STRICT_CONSTRAINT}`
                        : `Bạn là trợ lý kỹ thuật chuyên nghiệp của HURC1 CRM.\n\n${STRICT_CONSTRAINT}`;
                    const result = await tg.textCompletion({
                        prompt: query,
                        system: textCompletionSystemPrompt,
                    });
                    return { response: result.response, intent: 'text_completion', source: 'trustgraph' };
                }
            }
        }
    } catch (error) {
        console.warn("TrustGraph RAG failed, falling back:", error);
    }

    try {
        const fallbackResponse = await askAI(query, { systemPrompt: options.systemPrompt, forceBackend: 'nemoclaw' });
        return { response: fallbackResponse, intent: intent, source: 'local-fallback' };
    } catch (e) {
        console.error("AI Core Fatal Error:", e);
        return { response: "Hệ thống AI hiện đang bận hoặc gặp lỗi phân tích. Vui lòng thử lại sau.", intent: 'text_completion', source: 'error-handler' };
    }
}

// ============ AGENT CHAT ============

export async function agentChat(question: string, options: {
    state?: any,
    history?: any[],
    collection?: string,
    user?: string,
} = {}): Promise<{ answer: string; state: any; history: any[]; source: string; steps?: string[] }> {
    const tg = getTrustGraphClient();

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
        console.warn("TrustGraph Agent failed:", error);
    }

    const nc = getNemoClawClient();
    if (await nc.isAvailable()) {
        try {
            return await runRobustAgentLoop(question, { 
                history: options.history || [], 
                user: options.user,
                collection: options.collection 
            });
        } catch (e: any) {
            console.error("Robust Agent Loop failed:", e);
        }
    }

    const response = await askAI(question, { forceBackend: 'nemoclaw' });
    return { answer: response, state: null, history: [], source: 'local-fallback' };
}

// ============ VISION & OBJECT DETECTION ============

export async function askVisionAI(prompt: string, image: { data: string, mimeType: string }, options: {
    model?: string,
    systemPrompt?: string,
    forceBackend?: 'nemoclaw' | 'trustgraph',
    userId?: string,
} = {}) {
    return "Tính năng Vision qua LLM đang được phát triển Local. Vui lòng sử dụng YOLO để nhận diện lỗi kỹ thuật hiện tại.";
}

export async function detectObjectsLocal(imageBuffer: Buffer): Promise<YoloResponse | null> {
    try {
        return await callYoloService(imageBuffer);
    } catch (error) {
        console.error("Local YOLO Error:", error);
        return null;
    }
}

export async function detectObjects(imageBuffer: Buffer) {
    return await detectObjectsLocal(imageBuffer);
}

async function resolveContextMentions(prompt: string): Promise<string[]> {
    const mentions = prompt.match(/@([a-zA-Z0-9]+)-([a-zA-Z0-9.@_-]+)/g);
    if (!mentions) return [];

    const attachments: string[] = [];

    for (const mention of mentions) {
        const match = mention.match(/@([a-zA-Z0-9]+)-([a-zA-Z0-9.@_-]+)/);
        if (!match) continue;
        const [_, type, id] = match;
        
        try {
            if (type.toLowerCase() === 'dnf') {
                const item = await jsonDb.findFirst<any>('dnf_documents', (d: any) => d.id === id || d.failureReportNo === id);
                if (item) attachments.push(`[ATTACHMENT: DNF ${id}]\n${JSON.stringify(item, null, 2)}`);
            } else if (type.toLowerCase() === 'log') {
                const item = await jsonDb.findFirst<any>('system_logs', (l: any) => l.id === id);
                if (item) attachments.push(`[ATTACHMENT: LOG ${id}]\n${JSON.stringify(item, null, 2)}`);
            } else if (type.toLowerCase() === 'user') {
                const item = await jsonDb.findFirst<any>('users', (u: any) => u.id === id || u.email === id);
                if (item) attachments.push(`[ATTACHMENT: USER ${id}]\n${JSON.stringify({ ...item, password: '[REDACTED]' }, null, 2)}`);
            } else if (type.toLowerCase() === 'hazard') {
                const item = await jsonDb.findFirst<any>('hazards', (h: any) => h.id === id);
                if (item) attachments.push(`[ATTACHMENT: HAZARD ${id}]\n${JSON.stringify(item, null, 2)}`);
            }
        } catch (e) {
            console.error(`Lỗi khi trích xuất dữ liệu cho @${type}-${id}:`, e);
        }
    }

    return attachments;
}

// ============ ROBUST AGENT LOOP ============

async function runRobustAgentLoop(question: string, options: {
    history: any[],
    user?: string,
    collection?: string
}) {
    const nc = getNemoClawClient();
    const steps: string[] = [];
    let currentHistory: NcChatMessage[] = [...(options.history || []).map(h => ({
        role: (h.role === 'ai' || h.role === 'model') ? 'assistant' as const : h.role,
        content: h.content || h.text || ''
    }))];
    
    const attachments = await resolveContextMentions(question);
    if (attachments.length > 0) {
        currentHistory.push({ 
            role: 'system', 
            content: `Dữ liệu bổ sung từ @mentions:\n\n${attachments.join('\n\n')}` 
        });
    }

    currentHistory.push({ role: 'user', content: question });

    let iterations = 0;
    const MAX_AGENT_ITERATIONS = 12;

    while (iterations < MAX_AGENT_ITERATIONS) {
        iterations++;
        
        currentHistory = manageAgentContext(currentHistory);

        const agentSystemPrompt = `Bạn là HURC AI - Trợ lý quản trị kỹ thuật chuyên nghiệp. Hãy sử dụng công cụ để lấy dữ liệu. Hãy phân tích kỹ code và log trước khi trả lời.\n\n${STRICT_CONSTRAINT}`;

        const response = await nc.chatCompletion({
            messages: [
                { role: 'system', content: agentSystemPrompt },
                ...currentHistory
            ],
            tools: openAiToolDeclarations,
            tool_choice: 'auto',
            user: options.user
        });

        const choice = response.choices?.[0];
        const message = choice?.message;
        
        if (!message) throw new Error("Agent không phản hồi.");

        currentHistory.push({
            role: 'assistant',
            content: message.content,
            tool_calls: message.tool_calls
        });

        if (!message.tool_calls || message.tool_calls.length === 0) {
            const answer = message.content || "Xong.";

            // Gather context from system/tool responses in history
            const contextStr = currentHistory
                .filter(h => h.role === 'system' || h.role === 'tool')
                .map(h => h.content)
                .join("\n\n");

            const auditedAnswer = await runReflectionLoop(
                question,
                answer,
                contextStr,
                agentSystemPrompt,
                async (p, opts) => {
                    return await askAI(p, { systemPrompt: agentSystemPrompt, temperature: opts?.temperature ?? 0.1, skipReflection: true });
                }
            );

            return {
                answer: auditedAnswer,
                state: null,
                history: currentHistory,
                source: 'nemoclaw-robust-agent',
                steps
            };
        }

        const toolResults = await Promise.all(message.tool_calls.map(async (call) => {
            steps.push(`Đang thực thi công cụ: ${call.function.name}`);
            const result = await executeCrmTool(call.function.name, JSON.parse(call.function.arguments || '{}'));
            return {
                role: 'tool' as const,
                tool_call_id: call.id,
                name: call.function.name,
                content: JSON.stringify(result)
            };
        }));

        currentHistory.push(...toolResults);
    }

    return { answer: "Đạt giới hạn suy nghĩ.", state: null, history: currentHistory, source: 'nemoclaw-timeout', steps };
}

// ============ UTILS ============

export async function getAIHealthStatus() {
    const nc = getNemoClawClient();
    const tg = getTrustGraphClient();
    const [ncH, tgH] = await Promise.all([nc.healthCheck(), tg.healthCheck()]);
    return {
        nemoclaw: ncH,
        trustgraph: tgH,
        gemini: { available: false },
        huggingface: { available: false },
        primaryBackend: ncH.available ? 'NemoClaw (Local)' : 'TrustGraph (Local)'
    };
}

export async function analyzeWithGraph(query: string, options: any = {}) {
    const tg = getTrustGraphClient();
    try {
        if (await tg.isAvailable()) {
            const result = await tg.graphRag({ query, collection: options.collection || 'hurc-general' });
            return { response: result.response, source: 'trustgraph' };
        }
    } catch {}
    const resp = await askAI(query, { forceBackend: 'nemoclaw' });
    return { response: resp, source: 'local-fallback' };
}

export async function semanticSearch(query: string, options: any = {}): Promise<any[]> {
    const tg = getTrustGraphClient();
    try {
        if (await tg.isAvailable()) {
            const results = await tg.documentEmbeddingsQuery(query, { collection: options.collection, limit: options.limit || 10 });
            return results || [];
        }
    } catch {}
    return [];
}

export async function ingestDocument(content: string, docId: string, options: any = {}) {
    const tg = getTrustGraphClient();
    try {
        if (await tg.isAvailable()) {
            await tg.textLoad({ text: content, id: docId, collection: options.collection || 'hurc-general', user: options.user });
            return { success: true, source: 'trustgraph' };
        }
    } catch {}
    return { success: false, source: 'none' };
}

export async function ingestBinaryDocument(buffer: Buffer, docId: string, options: any = {}) {
    const tg = getTrustGraphClient();
    try {
        if (await tg.isAvailable()) {
            await tg.documentLoad({ data: buffer.toString('base64'), id: docId, collection: options.collection || 'hurc-general', user: options.user });
            return { success: true, source: 'trustgraph' };
        }
    } catch {}
    return { success: false, source: 'none' };
}

export async function askPersonalized(query: string, options: { userId: string, history?: any[] }): Promise<{ content: string; source: string; focus: string }> {
    const userContext = await buildUserContext(options.userId);
    const queryFocus = extractQueryFocus(query);
    const focusedPrompt = buildFocusedPrompt(query, queryFocus);
    try {
        const nc = getNemoClawClient();
        if (await nc.isAvailable()) {
            const result = await nc.askPersonalized(focusedPrompt, { userContext, userId: options.userId, history: options.history, temperature: 0.2 });
            return { content: result.content, source: 'nemoclaw', focus: queryFocus.focus };
        }
    } catch {}
    const fallback = await askAI(focusedPrompt, { systemPrompt: `AI CRM Context:\n${userContext}`, userId: options.userId });
    return { content: fallback, source: 'local-fallback', focus: queryFocus.focus };
}

// ============ AGENT UTILS ============

function estimateTokens(history: NcChatMessage[]): number {
    return Math.floor(history.reduce((acc, m) => acc + (m.content?.length || 0), 0) / 4);
}


