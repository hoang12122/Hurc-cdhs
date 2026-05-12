import { getNemoClawClient, type ChatMessage as NcChatMessage } from "./nemoclaw";
import { crmToolDeclarations, executeCrmTool, openAiToolDeclarations } from "../../ai-tools/crm-tools";
import { mcpService } from "./mcp-service";
import { jsonDb } from "../../db/json-db";

const MAX_AGENT_ITERATIONS = 12;

/**
 * Quét chuỗi prompt để tìm các thực thể @entity-id và lấy dữ liệu tương ứng.
 * Refactored for Phase 4: Standardized Keys & Atomic JSON operations.
 */
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

/**
 * Quản lý ngữ cảnh để tránh tràn context window
 */
function manageAgentContext(history: NcChatMessage[]): NcChatMessage[] {
    const contextLimit = 15;
    if (history.length > contextLimit) {
        const systemMessages = history.filter(m => m.role === 'system');
        const recentMessages = history.slice(-contextLimit);
        return [...systemMessages, ...recentMessages.filter(m => m.role !== 'system')];
    }
    return history;
}

/**
 * Robust Agent Loop — Triển khai mô hình GoClaw giúp Agent hoạt động ổn định.
 */
export async function runRobustAgentLoop(question: string, options: {
    state?: any,
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
    
    currentHistory.push({ role: 'user', content: question });
    
    // TRACE: Start Execution
    mcpService.clearTraces();
    mcpService.addManualTrace("Query Received", question, 'input');

    // --- PHASE 0: RESOLVE MENTIONS (Paperclip Style) ---
    const attachments = await resolveContextMentions(question);
    if (attachments.length > 0) {
        steps.push(`Đã đính kèm (clipped) ${attachments.length} thực thể từ @mentions.`);
        currentHistory.push({ 
            role: 'system', 
            content: `Dưới đây là các dữ liệu thực thể bạn vừa "kẹp" (clipped) vào hội thoại thông qua @mention:\n\n${attachments.join('\n\n')}` 
        });
    }

    let iterations = 0;
    const toolLoopState = new Map<string, number>();

    while (iterations < MAX_AGENT_ITERATIONS) {
        iterations++;
        currentHistory = manageAgentContext(currentHistory);

        const projectContext = `
[PROJECT CONTEXT]
- CWD: ${process.cwd()}
- DATE: ${new Date().toLocaleString()}
- MISSION: Giúp người dùng phân tích, tìm kiếm và hiểu mã nguồn dự án HURC1-CRM.
- TOOLS: Bạn có các công cụ 'claw_ls', 'claw_read', 'claw_grep' để tự mình khám phá code.
`.trim();

        // Get dynamic MCP tools
        const mcpTools = await mcpService.listTools();
        const mcpToolDecls = mcpTools.map(t => ({
            type: 'function',
            function: {
                name: t.name,
                description: `[REMOTE MCP] ${t.description}`,
                parameters: t.inputSchema
            }
        }));

        const response = await nc.chatCompletion({
            messages: [
                { role: 'system', content: `Bạn là trợ lý kỹ thuật HURC1. \n\n${projectContext}` },
                ...currentHistory
            ],
            tools: [...openAiToolDeclarations, ...mcpToolDecls] as any,
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

        if (message.content) {
            mcpService.addManualTrace("Agent Reasoning", message.content, 'thought');
        }

        if (!message.tool_calls || message.tool_calls.length === 0) {
            steps.push("Đã hoàn thành phân tích và chuẩn bị câu trả lời.");
            const answer = message.content || "Tôi đã xử lý xong yêu cầu của bạn.";
            mcpService.addManualTrace("Final Answer", answer, 'final_answer');
            return {
                answer,
                state: null,
                history: currentHistory,
                source: 'nemoclaw-robust-agent',
                steps
            };
        }

        const toolResults = await Promise.all(message.tool_calls.map(async (call) => {
            const toolId = call.id;
            const functionName = call.function.name;
            let args: any;
            try {
                args = JSON.parse(call.function.arguments || '{}');
            } catch (e: any) {
                console.error(`Malformed tool arguments from AI for ${functionName}:`, call.function.arguments);
                return {
                    role: 'tool' as const,
                    tool_call_id: toolId,
                    content: `LỖI: Định dạng tham số không chuẩn JSON. Vui lòng kiểm tra lại cấu trúc: ${e.message}`
                };
            }
            
            const callFingerprint = `${functionName}:${JSON.stringify(args)}`;
            const callCount = (toolLoopState.get(callFingerprint) || 0) + 1;
            toolLoopState.set(callFingerprint, callCount);

            if (callCount >= 5) {
                return {
                    role: 'tool' as const,
                    tool_call_id: toolId,
                    content: "LỖI: Hệ thống phát hiện vòng lặp vô tận. Dừng công cụ này."
                };
            }

            try {
                steps.push(`Đang thực thi công cụ: ${functionName}`);
                
                // Route to MCP or Local CRM Tool
                const isMcp = mcpTools.some(t => t.name === functionName);
                let result;

                if (isMcp) {
                    mcpService.addManualTrace("MCP Call", `Calling remote tool: ${functionName}`, 'tool_call');
                    result = await mcpService.callTool(functionName, args);
                } else {
                    result = await executeCrmTool(functionName, args);
                }

                return {
                    role: 'tool' as const,
                    tool_call_id: toolId,
                    content: typeof result === 'string' ? result : JSON.stringify(result)
                };
            } catch (e: any) {
                return {
                    role: 'tool' as const,
                    tool_call_id: toolId,
                    content: `Lỗi công cụ: ${e.message}`
                };
            }
        }));

        currentHistory.push(...(toolResults as NcChatMessage[]));
    }

    mcpService.addManualTrace("Timeout Limit", "Đã đạt giới hạn số lần phân tích.", 'error');
    return {
        answer: "Tôi đã đạt đến giới hạn phân tích (12 bước). Đây là kết quả hiện tại.",
        state: null,
        history: currentHistory,
        source: 'nemoclaw-robust-agent-timeout',
        steps: [...steps, "CẢNH BÁO: Đã đạt giới hạn số lần phân tích."]
    };
}
