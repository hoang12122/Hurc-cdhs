import crypto from 'node:crypto';
import { internalLogSystemEvent as logSystemEvent } from '../log-service';
import { redactSensitiveData, sanitizeAiText } from './control-plane';

export interface McpTool {
    name: string;
    description: string;
    inputSchema: any;
}

export interface McpTraceNode {
    id: string;
    type: 'input' | 'thought' | 'tool_call' | 'tool_output' | 'error' | 'final_answer';
    label: string;
    content: string;
    timestamp: number;
    parentId?: string;
}

const WRITE_TOOL_PATTERN = /(^|[_-])(create|add|insert|upsert|update|edit|patch|delete|remove|drop|truncate|write|execute|run|restart|shutdown|deploy|push|merge|approve|reject|assign|send|publish|upload|sync|migrate)([_-]|$)/i;
const DANGEROUS_ARGUMENT_PATTERN = /\b(drop\s+table|truncate\s+table|delete\s+from|update\s+\w+\s+set|insert\s+into|rm\s+-rf|shutdown|reboot|systemctl|kubectl\s+(apply|delete)|docker\s+(rm|stop|restart)|git\s+(push|merge)|powershell|cmd\.exe|\/bin\/sh)\b/i;
const MAX_ARGUMENT_CHARS = 50_000;
const MAX_RESPONSE_CHARS = 1_000_000;
const MCP_TIMEOUT_MS = 20_000;

function isReadOnlyTool(tool: Pick<McpTool, 'name' | 'description'>): boolean {
    const combined = `${tool.name} ${tool.description}`;
    return !WRITE_TOOL_PATTERN.test(combined);
}

function serializeAndValidateArgs(args: unknown): string {
    let serialized: string;
    try {
        serialized = JSON.stringify(args ?? {});
    } catch {
        throw new Error('MCP arguments must be valid JSON-serializable data.');
    }

    if (serialized.length > MAX_ARGUMENT_CHARS) {
        throw new Error(`MCP arguments exceed the ${MAX_ARGUMENT_CHARS}-character safety limit.`);
    }
    if (DANGEROUS_ARGUMENT_PATTERN.test(serialized)) {
        throw new Error('MCP arguments contain a blocked command or data-write expression.');
    }
    return serialized;
}

function safeTraceContent(value: unknown, maxChars = 8_000): string {
    const serialized = (typeof value === 'string' ? value : JSON.stringify(value, null, 2)) ?? '';
    return redactSensitiveData(sanitizeAiText(serialized, maxChars)).text;
}

class McpService {
    private baseUrl: string = process.env.GRAPUCO_MCP_URL || 'https://api.grapuco.com/mcp';
    private apiKey: string = process.env.GRAPUCO_API_KEY || '';
    private traces: McpTraceNode[] = [];
    private blockedTools: string[] = [];

    async listTools(): Promise<McpTool[]> {
        try {
            const response = await fetch(`${this.baseUrl}/tools`, {
                headers: {
                    'X-Api-Key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                signal: AbortSignal.timeout(MCP_TIMEOUT_MS),
            });

            if (!response.ok) throw new Error(`MCP Error: ${response.statusText}`);
            const rawText = await response.text();
            if (rawText.length > MAX_RESPONSE_CHARS) {
                throw new Error('MCP tool registry response exceeded safety size limit.');
            }
            const data = JSON.parse(rawText);
            const tools = Array.isArray(data.tools) ? data.tools as McpTool[] : [];
            const allowed: McpTool[] = [];
            const blocked: string[] = [];

            for (const tool of tools) {
                if (!tool?.name || !isReadOnlyTool(tool)) {
                    blocked.push(tool?.name || 'unnamed-tool');
                    continue;
                }
                allowed.push({
                    name: sanitizeAiText(tool.name, 120),
                    description: sanitizeAiText(tool.description ?? '', 1_000),
                    inputSchema: tool.inputSchema ?? { type: 'object', properties: {} },
                });
            }

            this.blockedTools = blocked;
            if (blocked.length > 0) {
                console.warn(`[MCP TOOL FIREWALL] Blocked ${blocked.length} non-read-only tools: ${blocked.join(', ')}`);
            }
            return allowed;
        } catch (error: any) {
            console.error('[MCP SERVICE] List tools failed:', error.message);
            return [];
        }
    }

    async callTool(name: string, args: any, parentId?: string): Promise<any> {
        const safeName = sanitizeAiText(name, 120);
        const traceId = crypto.randomUUID();

        if (!safeName || !isReadOnlyTool({ name: safeName, description: '' })) {
            const message = `Tool '${safeName || 'unnamed'}' is blocked by the read-only MCP policy.`;
            this.addTrace({
                id: `${traceId}-blocked`,
                type: 'error',
                label: 'MCP Tool Blocked',
                content: message,
                timestamp: Date.now(),
                parentId,
            });
            await logSystemEvent('AI_MCP_TOOL_BLOCKED', 'WARNING', message).catch(() => undefined);
            throw new Error(message);
        }

        let serializedArgs: string;
        try {
            serializedArgs = serializeAndValidateArgs(args);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.addTrace({
                id: `${traceId}-blocked-args`,
                type: 'error',
                label: `Blocked arguments: ${safeName}`,
                content: message,
                timestamp: Date.now(),
                parentId,
            });
            await logSystemEvent('AI_MCP_ARGUMENTS_BLOCKED', 'WARNING', `${safeName}: ${message}`).catch(() => undefined);
            throw error;
        }

        this.addTrace({
            id: traceId,
            type: 'tool_call',
            label: `Calling: ${safeName}`,
            content: safeTraceContent(serializedArgs),
            timestamp: Date.now(),
            parentId
        });

        try {
            const response = await fetch(`${this.baseUrl}/tools/call`, {
                method: 'POST',
                headers: {
                    'X-Api-Key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: safeName, arguments: JSON.parse(serializedArgs) }),
                signal: AbortSignal.timeout(MCP_TIMEOUT_MS),
            });

            if (!response.ok) throw new Error(`MCP Tool Call Error: ${response.statusText}`);
            const rawText = await response.text();
            if (rawText.length > MAX_RESPONSE_CHARS) {
                throw new Error('MCP tool response exceeded safety size limit.');
            }
            const data = JSON.parse(rawText);
            const content = data.content;

            this.addTrace({
                id: `${traceId}-output`,
                type: 'tool_output',
                label: `Output: ${safeName}`,
                content: safeTraceContent(content),
                timestamp: Date.now(),
                parentId: traceId
            });

            return content;
        } catch (error: any) {
            this.addTrace({
                id: `${traceId}-error`,
                type: 'error',
                label: `Error: ${safeName}`,
                content: sanitizeAiText(error.message, 2_000),
                timestamp: Date.now(),
                parentId: traceId
            });
            throw error;
        }
    }

    private addTrace(node: McpTraceNode) {
        this.traces.push(node);
        if (this.traces.length > 100) this.traces.shift();
    }

    getTraces(): McpTraceNode[] {
        return [...this.traces];
    }

    getFirewallStatus() {
        return {
            mode: 'read-only',
            blockedTools: [...this.blockedTools],
            timeoutMs: MCP_TIMEOUT_MS,
            maxArgumentChars: MAX_ARGUMENT_CHARS,
            maxResponseChars: MAX_RESPONSE_CHARS,
        };
    }

    clearTraces() {
        this.traces = [];
    }

    addManualTrace(label: string, content: string, type: McpTraceNode['type'] = 'thought', parentId?: string) {
        this.addTrace({
            id: crypto.randomUUID(),
            type,
            label: sanitizeAiText(label, 200),
            content: safeTraceContent(content),
            timestamp: Date.now(),
            parentId
        });
    }
}

export const mcpService = new McpService();
