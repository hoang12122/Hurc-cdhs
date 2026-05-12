/**
 * NemoClaw Client — OpenAI-Compatible REST Client
 * 
 * Part of the CRM AI Modular Architecture.
 * Routes inference to local Ollama or fallback to cloud providers.
 */

const NEMOCLAW_API_URL = process.env.NEMOCLAW_API_URL || 'http://localhost:3002';
const NEMOCLAW_API_KEY = process.env.NEMOCLAW_API_KEY || '';
const NEMOCLAW_MODEL = process.env.NEMOCLAW_MODEL || 'llama3:8b';

interface ChatMessage {
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string | null;
    name?: string;
    tool_calls?: any[];
    tool_call_id?: string;
}

interface ChatCompletionTool {
    type: 'function';
    function: {
        name: string;
        description?: string;
        parameters?: any;
    };
}

interface ChatCompletionRequest {
    model?: string;
    messages: ChatMessage[];
    tools?: ChatCompletionTool[];
    tool_choice?: 'auto' | 'none' | { type: 'function', function: { name: string } };
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
    user?: string; 
}

interface ChatCompletionChoice {
    index: number;
    message: ChatMessage;
    finish_reason: string;
}

interface ChatCompletionResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: ChatCompletionChoice[];
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

interface NemoClawHealthStatus {
    available: boolean;
    gateway: string;
    model: string;
    latencyMs?: number;
    error?: string;
    isDockerIssue?: boolean;
}

class NemoClawClient {
    private baseUrl: string;
    private apiKey: string;
    private model: string;
    private _lastHealthCheck: NemoClawHealthStatus | null = null;
    private _healthCheckExpiry = 0;

    constructor() {
        this.baseUrl = NEMOCLAW_API_URL.replace(/\/$/, '');
        this.apiKey = NEMOCLAW_API_KEY;
        this.model = NEMOCLAW_MODEL;
    }

    /**
     * Send a chat completion request with connection resilience
     */
    async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
        const url = `${this.baseUrl}/v1/chat/completions`;
        
        const body: any = {
            model: request.model || this.model,
            messages: request.messages,
            temperature: request.temperature ?? 0.3,
            max_tokens: request.max_tokens ?? 2048,
            stream: false,
        };

        if (request.tools) body.tools = request.tools;
        if (request.tool_choice) body.tool_choice = request.tool_choice;
        if (request.user) body.user = request.user;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}),
                },
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(30000), // Shorter timeout for resilience
            });

            if (!response.ok) {
                const errorText = await response.text().catch(() => '');
                throw new NemoClawError(
                    `NemoClaw API error (${response.status}): ${errorText.substring(0, 200)}`,
                    response.status
                );
            }

            return response.json();
        } catch (error: any) {
            // DETECT NATIVE SERVER DOWN / CONNECTION REFUSED
            if (error.name === 'AbortError' || error.cause?.code === 'ECONNREFUSED' || error.message?.includes('fetch failed')) {
                throw new NemoClawError(
                    'NEMOCLAW_SERVER_UNREACHABLE: Dịch vụ AI Local (Native Spine) chưa khởi động hoặc bị gián đoạn.',
                    503
                );
            }
            throw error;
        }
    }

    /**
     * Simple ask
     */
    async ask(prompt: string, options: {
        systemPrompt?: string;
        userId?: string;
        history?: ChatMessage[];
        temperature?: number;
    } = {}): Promise<{ content: string; model: string; usage?: any }> {
        const messages: ChatMessage[] = [];

        if (options.systemPrompt) {
            messages.push({ role: 'system', content: options.systemPrompt });
        }

        if (options.history?.length) {
            messages.push(...options.history);
        }

        messages.push({ role: 'user', content: prompt });

        const result = await this.chatCompletion({
            messages,
            user: options.userId,
            temperature: options.temperature,
        });

        const choice = result.choices?.[0];
        if (!choice) throw new NemoClawError('Empty response from NemoClaw', 0);

        return {
            content: (choice.message.content || '').trim(),
            model: result.model,
            usage: result.usage,
        };
    }

    /**
     * Health check with Docker Detection
     */
    async healthCheck(): Promise<NemoClawHealthStatus> {
        const now = Date.now();
        if (this._lastHealthCheck && now < this._healthCheckExpiry) {
            return this._lastHealthCheck;
        }

        const startTime = now;
        try {
            const response = await fetch(`${this.baseUrl}/v1/models`, {
                method: 'GET',
                headers: this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {},
                signal: AbortSignal.timeout(3000),
            });

            const latencyMs = Date.now() - startTime;

            this._lastHealthCheck = {
                available: response.ok,
                gateway: this.baseUrl,
                model: this.model,
                latencyMs,
                error: response.ok ? undefined : `HTTP ${response.status}`,
            };
        } catch (error: any) {
            const isDockerIssue = error.cause?.code === 'ECONNREFUSED' || error.message?.includes('fetch failed');
            this._lastHealthCheck = {
                available: false,
                gateway: this.baseUrl,
                model: this.model,
                isDockerIssue,
                error: isDockerIssue ? 'HURC1_DOCKER_DOWN' : (error instanceof Error ? error.message : 'Connection failed'),
            };
        }

        this._healthCheckExpiry = Date.now() + 15_000;
        return this._lastHealthCheck;
    }
}

export class NemoClawError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
        this.name = 'NemoClawError';
    }
}

let _instance: NemoClawClient | null = null;

export function getNemoClawClient(): NemoClawClient {
    if (!_instance) _instance = new NemoClawClient();
    return _instance;
}

export type { ChatMessage, ChatCompletionResponse, NemoClawHealthStatus, ChatCompletionRequest, ChatCompletionTool };
