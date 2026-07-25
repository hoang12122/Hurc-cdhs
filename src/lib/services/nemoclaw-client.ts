/**
 * NemoClaw local inference client.
 *
 * The wire format is OpenAI-compatible, but the endpoint and model policy are
 * strictly private/local. Public AI providers and Internet endpoints are
 * rejected before any request is sent.
 */

import { AI_CONFIG, getActiveLLMModel } from '../config/ai-config';
import { assertLocalAiEndpoint, normalizeLocalAiBaseUrl } from './ai/local-endpoint-policy';
import { buildPrecisionSystemPrompt } from './nemoclaw-prompt';
import {
  NemoClawError,
  type ChatCompletionRequest,
  type ChatCompletionResponse,
  type ChatMessage,
  type NemoClawHealthStatus,
} from './nemoclaw-types';

const RAW_API_URL = process.env.NEMOCLAW_API_URL
  || process.env.LLM_ENDPOINT
  || 'http://ollama:11434';
const API_KEY = process.env.NEMOCLAW_API_KEY || '';
const DEFAULT_MODEL = process.env.NEMOCLAW_MODEL || AI_CONFIG.LLM.STABLE_MODEL;
const MAX_MESSAGES = 64;
const MAX_HISTORY_MESSAGES = 24;
const MAX_MESSAGE_CHARS = 32_000;
const MAX_TOTAL_PROMPT_CHARS = 120_000;
const MAX_OUTPUT_TOKENS = 4_096;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function getAllowedModels(): Set<string> {
  const configured = (process.env.LOCAL_LLM_ALLOWED_MODELS || '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);
  return new Set([
    AI_CONFIG.LLM.STABLE_MODEL,
    AI_CONFIG.LLM.EXPERIMENTAL_MODEL,
    AI_CONFIG.LLM.GRANITE_DENSE,
    DEFAULT_MODEL,
    ...configured,
  ]);
}

function assertAllowedModel(model: string): string {
  const normalized = model.trim();
  if (!normalized || normalized.length > 160 || !getAllowedModels().has(normalized)) {
    throw new NemoClawError(`LOCAL_MODEL_NOT_ALLOWED: ${normalized || '(empty)'}`, 400);
  }
  return normalized;
}

function normalizeMessages(messages: ChatMessage[]): ChatMessage[] {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    throw new NemoClawError(`INVALID_MESSAGE_COUNT: expected 1-${MAX_MESSAGES}`, 400);
  }

  let totalChars = 0;
  return messages.map(message => {
    const content = message.content === null ? null : String(message.content).slice(0, MAX_MESSAGE_CHARS);
    totalChars += content?.length ?? 0;
    if (totalChars > MAX_TOTAL_PROMPT_CHARS) {
      throw new NemoClawError('PROMPT_TOO_LARGE', 413);
    }
    return {
      ...message,
      content,
      name: message.name?.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64),
      tool_call_id: message.tool_call_id?.slice(0, 160),
    };
  });
}

function normalizeBaseUrl(rawUrl: string): string {
  const localUrl = normalizeLocalAiBaseUrl(rawUrl, 'NemoClaw endpoint');
  return localUrl
    .replace(/\/v1\/chat\/completions$/i, '')
    .replace(/\/v1$/i, '');
}

class NemoClawClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly model: string;
  private lastHealthCheck: NemoClawHealthStatus | null = null;
  private healthCheckExpiry = 0;

  constructor() {
    this.baseUrl = normalizeBaseUrl(RAW_API_URL);
    this.apiKey = API_KEY;
    this.model = assertAllowedModel(DEFAULT_MODEL);
  }

  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const url = `${this.baseUrl}/v1/chat/completions`;
    assertLocalAiEndpoint(url, 'NemoClaw chat endpoint');

    const body: Record<string, unknown> = {
      model: assertAllowedModel(request.model || getActiveLLMModel()),
      messages: normalizeMessages(request.messages),
      temperature: clamp(Number(request.temperature ?? 0.3), 0, 1),
      max_tokens: clamp(Number(request.max_tokens ?? 2_048), 1, MAX_OUTPUT_TOKENS),
      stream: false,
    };
    if (request.tools) body.tools = request.tools.slice(0, 32);
    if (request.tool_choice) body.tool_choice = request.tool_choice;
    if (request.user) body.user = request.user.replace(/[^a-zA-Z0-9_.@-]/g, '_').slice(0, 128);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify(body),
        redirect: 'error',
        signal: AbortSignal.timeout(90_000),
      });

      if (!response.ok) {
        await response.body?.cancel().catch(() => undefined);
        throw new NemoClawError(`NemoClaw returned HTTP ${response.status}`, response.status);
      }

      const result = await response.json() as ChatCompletionResponse;
      if (!Array.isArray(result.choices) || result.choices.length === 0) {
        throw new NemoClawError('INVALID_LOCAL_AI_RESPONSE', 502);
      }
      return result;
    } catch (error: any) {
      if (error instanceof NemoClawError) throw error;
      if (error?.name === 'AbortError'
        || error?.name === 'TimeoutError'
        || error?.cause?.code === 'ECONNREFUSED'
        || error?.message?.includes('fetch failed')) {
        throw new NemoClawError(
          'NEMOCLAW_SERVER_UNREACHABLE: Dịch vụ AI local chưa khởi động hoặc bị gián đoạn.',
          503,
        );
      }
      throw new NemoClawError('LOCAL_AI_REQUEST_FAILED', 502);
    }
  }

  async ask(prompt: string, options: {
    systemPrompt?: string;
    userId?: string;
    history?: ChatMessage[];
    temperature?: number;
    maxTokens?: number;
  } = {}): Promise<{ content: string; model: string; usage?: unknown }> {
    const messages: ChatMessage[] = [];
    if (options.systemPrompt) messages.push({ role: 'system', content: options.systemPrompt });
    if (options.history?.length) messages.push(...options.history.slice(-MAX_HISTORY_MESSAGES));
    messages.push({ role: 'user', content: prompt });

    const result = await this.chatCompletion({
      messages,
      user: options.userId,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
    });
    const content = result.choices[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) {
      throw new NemoClawError('EMPTY_LOCAL_AI_RESPONSE', 502);
    }
    return { content: content.trim(), model: result.model, usage: result.usage };
  }

  async askPersonalized(prompt: string, options: {
    userContext: string;
    userId: string;
    history?: ChatMessage[];
    temperature?: number;
  }): Promise<{ content: string; model: string; source: string }> {
    const result = await this.ask(prompt, {
      systemPrompt: buildPrecisionSystemPrompt(options.userContext),
      userId: options.userId,
      history: options.history,
      temperature: options.temperature ?? 0.2,
    });
    return { content: result.content, model: result.model, source: 'nemoclaw-local' };
  }

  async healthCheck(): Promise<NemoClawHealthStatus> {
    const now = Date.now();
    if (this.lastHealthCheck && now < this.healthCheckExpiry) return this.lastHealthCheck;

    const started = now;
    try {
      const url = `${this.baseUrl}/v1/models`;
      assertLocalAiEndpoint(url, 'NemoClaw health endpoint');
      const response = await fetch(url, {
        headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
        redirect: 'error',
        signal: AbortSignal.timeout(5_000),
      });
      this.lastHealthCheck = {
        available: response.ok,
        gateway: this.baseUrl,
        model: this.model,
        latencyMs: Date.now() - started,
        ...(!response.ok ? { error: `HTTP ${response.status}` } : {}),
      };
    } catch (error: any) {
      const isDockerIssue = error?.cause?.code === 'ECONNREFUSED' || error?.message?.includes('fetch failed');
      this.lastHealthCheck = {
        available: false,
        gateway: this.baseUrl,
        model: this.model,
        isDockerIssue,
        error: isDockerIssue ? 'HURC1_DOCKER_DOWN' : 'LOCAL_ENDPOINT_UNAVAILABLE',
      };
    }
    this.healthCheckExpiry = Date.now() + 15_000;
    return this.lastHealthCheck;
  }

  async isAvailable(): Promise<boolean> {
    return (await this.healthCheck()).available;
  }
}

let instance: NemoClawClient | null = null;

export function getNemoClawClient(): NemoClawClient {
  if (!instance) instance = new NemoClawClient();
  return instance;
}

export { NemoClawError } from './nemoclaw-types';
export type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatCompletionTool,
  ChatMessage,
  NemoClawHealthStatus,
} from './nemoclaw-types';
