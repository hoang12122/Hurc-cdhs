/**
 * NemoClaw Client — OpenAI-Compatible REST Client
 * 
 * Connects to the NemoClaw gateway (OpenShell) which routes inference
 * to configured providers (NVIDIA Nemotron, OpenAI, Anthropic, Gemini, Ollama).
 * 
 * Uses OpenAI Chat Completions API format for maximum compatibility.
 * Each user gets an isolated session via session-id.
 */

const NEMOCLAW_API_URL = process.env.NEMOCLAW_API_URL || 'http://localhost:3001';
const NEMOCLAW_API_KEY = process.env.NEMOCLAW_API_KEY || '';
const NEMOCLAW_MODEL = process.env.NEMOCLAW_MODEL || 'nvidia/nemotron-3-super-120b-a12b';

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface ChatCompletionRequest {
    model?: string;
    messages: ChatMessage[];
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
    user?: string; // Per-user session isolation
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
     * Send a chat completion request to NemoClaw gateway
     */
    async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
        const url = `${this.baseUrl}/v1/chat/completions`;
        
        const body: any = {
            model: request.model || this.model,
            messages: request.messages,
            temperature: request.temperature ?? 0.3, // Lower temp = more precise
            max_tokens: request.max_tokens ?? 2048,
            stream: false,
        };

        if (request.user) {
            body.user = request.user;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}),
            },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(60000),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            throw new NemoClawError(
                `NemoClaw API error (${response.status}): ${errorText.substring(0, 200)}`,
                response.status
            );
        }

        return response.json();
    }

    /**
     * Simple ask — builds messages array from prompt + optional system prompt
     */
    async ask(prompt: string, options: {
        systemPrompt?: string;
        userId?: string;
        history?: ChatMessage[];
        temperature?: number;
        maxTokens?: number;
    } = {}): Promise<{ content: string; model: string; usage?: any }> {
        const messages: ChatMessage[] = [];

        // System prompt for precision and structure
        if (options.systemPrompt) {
            messages.push({ role: 'system', content: options.systemPrompt });
        }

        // Conversation history
        if (options.history?.length) {
            messages.push(...options.history);
        }

        // Current user message
        messages.push({ role: 'user', content: prompt });

        const result = await this.chatCompletion({
            messages,
            user: options.userId,
            temperature: options.temperature,
            max_tokens: options.maxTokens,
        });

        const choice = result.choices?.[0];
        if (!choice) {
            throw new NemoClawError('Empty response from NemoClaw', 0);
        }

        return {
            content: choice.message.content.trim(),
            model: result.model,
            usage: result.usage,
        };
    }

    /**
     * Personalized ask — injects user context into system prompt
     */
    async askPersonalized(prompt: string, options: {
        userContext: string;    // Pre-built CRM context for this user
        userId: string;
        history?: ChatMessage[];
        temperature?: number;
    } = {} as any): Promise<{ content: string; model: string; source: string }> {
        const systemPrompt = buildPrecisionSystemPrompt(options.userContext);

        const result = await this.ask(prompt, {
            systemPrompt,
            userId: options.userId,
            history: options.history,
            temperature: options.temperature ?? 0.2, // Very precise for personalized
        });

        return {
            content: result.content,
            model: result.model,
            source: 'nemoclaw',
        };
    }

    /**
     * Health check — cached for 30 seconds
     */
    async healthCheck(): Promise<NemoClawHealthStatus> {
        const now = Date.now();
        if (this._lastHealthCheck && now < this._healthCheckExpiry) {
            return this._lastHealthCheck;
        }

        const startTime = now;
        try {
            // Try models endpoint first (standard OpenAI-compatible check)
            const response = await fetch(`${this.baseUrl}/v1/models`, {
                method: 'GET',
                headers: this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {},
                signal: AbortSignal.timeout(5000),
            });

            const latencyMs = Date.now() - startTime;

            if (response.ok) {
                this._lastHealthCheck = {
                    available: true,
                    gateway: this.baseUrl,
                    model: this.model,
                    latencyMs,
                };
            } else {
                this._lastHealthCheck = {
                    available: false,
                    gateway: this.baseUrl,
                    model: this.model,
                    latencyMs,
                    error: `HTTP ${response.status}`,
                };
            }
        } catch (error) {
            this._lastHealthCheck = {
                available: false,
                gateway: this.baseUrl,
                model: this.model,
                error: error instanceof Error ? error.message : 'Connection failed',
            };
        }

        this._healthCheckExpiry = Date.now() + 30_000;
        return this._lastHealthCheck;
    }

    /**
     * Check if NemoClaw gateway is reachable
     */
    async isAvailable(): Promise<boolean> {
        const health = await this.healthCheck();
        return health.available;
    }
}

// ============ PRECISION SYSTEM PROMPT ============

function buildPrecisionSystemPrompt(userContext: string): string {
    return `Bạn là trợ lý AI chuyên gia của hệ thống CRM quản lý bảo trì Metro HURC1.

## QUY TẮC BẮT BUỘC
1. Trả lời CHÍNH XÁC vấn đề được hỏi. KHÔNG lan man, KHÔNG thêm thông tin không liên quan.
2. Nếu câu hỏi về dữ liệu cụ thể (DNF, Hazard, Inspection), trả lời dựa trên dữ liệu thực có trong hệ thống.
3. Nếu không đủ dữ liệu để trả lời chính xác, nói rõ "Không có đủ dữ liệu" thay vì đoán.
4. Định dạng câu trả lời có cấu trúc: dùng bullet points, bảng, hoặc numbered lists.
5. Giữ câu trả lời ngắn gọn, súc tích. Tối đa 5-7 điểm chính.
6. Khi phân tích, luôn đưa ra kết luận rõ ràng.

## THÔNG TIN NGƯỜI DÙNG HIỆN TẠI
${userContext}

## ĐỊNH DẠNG TRẢ LỜI
- Câu hỏi về số liệu → Trả lời bằng số cụ thể + bảng
- Câu hỏi về quy trình → Trả lời bằng bước 1-2-3
- Câu hỏi phân tích → Trả lời: Vấn đề → Nguyên nhân → Đề xuất
- Câu hỏi có/không → Trả lời thẳng Có/Không trước, giải thích ngắn sau`;
}

// ============ ERROR CLASS ============

export class NemoClawError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
        this.name = 'NemoClawError';
    }
}

// ============ SINGLETON ============

let _instance: NemoClawClient | null = null;

export function getNemoClawClient(): NemoClawClient {
    if (!_instance) {
        _instance = new NemoClawClient();
    }
    return _instance;
}

export type { ChatMessage, ChatCompletionResponse, NemoClawHealthStatus };
