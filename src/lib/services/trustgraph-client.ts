/**
 * TrustGraph REST API Client
 * Connects to TrustGraph API Gateway for GraphRAG, DocumentRAG, Agent, and more.
 * @see https://docs.trustgraph.ai/reference/apis/rest.html
 */

const TRUSTGRAPH_API_URL = process.env.TRUSTGRAPH_API_URL || 'http://localhost:8088';
const TRUSTGRAPH_API_KEY = process.env.TRUSTGRAPH_API_KEY || '';
const TRUSTGRAPH_FLOW_ID = process.env.TRUSTGRAPH_FLOW_ID || 'default';
const TRUSTGRAPH_TIMEOUT = 60000; // 60s

// ============ TYPES ============

export interface TrustGraphConfig {
    apiUrl: string;
    apiKey: string;
    flowId: string;
    timeout: number;
}

export interface AgentRequest {
    question: string;
    state?: any;
    history?: any[];
    group?: string[];
    streaming?: boolean;
    collection?: string;
    user?: string;
}

export interface AgentResponse {
    answer: string;
    state?: any;
    history?: any[];
    thoughts?: string[];
    actions?: any[];
}

export interface RagRequest {
    query: string;
    collection?: string;
    user?: string;
    'doc-limit'?: number;
    'entity-limit'?: number;
    'triple-limit'?: number;
    'max-subgraph-size'?: number;
    'max-path-length'?: number;
    streaming?: boolean;
}

export interface RagResponse {
    response: string;
    sources?: any[];
}

export interface TextLoadRequest {
    text: string;
    id: string;
    user?: string;
    collection?: string;
    charset?: string;
    metadata?: any[];
}

export interface DocumentLoadRequest {
    data: string; // base64
    id: string;
    user?: string;
    collection?: string;
    charset?: string;
    metadata?: any[];
}

export interface EmbeddingsRequest {
    text: string;
    collection?: string;
    user?: string;
}

export interface EmbeddingsResponse {
    vectors: number[][];
}

export interface GraphEmbeddingsQueryRequest {
    query: string;
    collection?: string;
    user?: string;
    limit?: number;
}

export interface TextCompletionRequest {
    system?: string;
    prompt: string;
    streaming?: boolean;
}

export interface TextCompletionResponse {
    response: string;
}

export interface HealthStatus {
    available: boolean;
    latencyMs: number;
    error?: string;
}

// ============ CLIENT ============

class TrustGraphClient {
    private config: TrustGraphConfig;
    private _healthCache: { status: HealthStatus; timestamp: number } | null = null;
    private readonly HEALTH_CACHE_TTL = 30000; // 30s

    constructor(config?: Partial<TrustGraphConfig>) {
        this.config = {
            apiUrl: config?.apiUrl || TRUSTGRAPH_API_URL,
            apiKey: config?.apiKey || TRUSTGRAPH_API_KEY,
            flowId: config?.flowId || TRUSTGRAPH_FLOW_ID,
            timeout: config?.timeout || TRUSTGRAPH_TIMEOUT,
        };
    }

    // ---- Helpers ----

    private get headers(): Record<string, string> {
        const h: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (this.config.apiKey) {
            h['Authorization'] = `Bearer ${this.config.apiKey}`;
        }
        return h;
    }

    private flowUrl(service: string): string {
        return `${this.config.apiUrl}/api/v1/flow/${this.config.flowId}/${service}`;
    }

    private globalUrl(path: string): string {
        return `${this.config.apiUrl}/api/v1/${path}`;
    }

    private async request<T>(url: string, body: any): Promise<T> {
        const response = await fetch(url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(this.config.timeout),
        });

        if (!response.ok) {
            const errorBody = await response.text().catch(() => '');
            throw new TrustGraphError(
                `TrustGraph API Error (${response.status}): ${response.statusText}. ${errorBody.substring(0, 300)}`,
                response.status
            );
        }

        return response.json() as Promise<T>;
    }

    private async requestGet<T>(url: string): Promise<T> {
        const response = await fetch(url, {
            method: 'GET',
            headers: this.headers,
            signal: AbortSignal.timeout(this.config.timeout),
        });

        if (!response.ok) {
            const errorBody = await response.text().catch(() => '');
            throw new TrustGraphError(
                `TrustGraph API Error (${response.status}): ${response.statusText}. ${errorBody.substring(0, 300)}`,
                response.status
            );
        }

        return response.json() as Promise<T>;
    }

    // ---- Health Check ----

    async healthCheck(): Promise<HealthStatus> {
        // Return cached if fresh
        if (this._healthCache && (Date.now() - this._healthCache.timestamp) < this.HEALTH_CACHE_TTL) {
            return this._healthCache.status;
        }

        const start = Date.now();
        try {
            // Try to hit the config endpoint as a health check
            await this.requestGet(this.globalUrl('config'));
            const status: HealthStatus = {
                available: true,
                latencyMs: Date.now() - start,
            };
            this._healthCache = { status, timestamp: Date.now() };
            return status;
        } catch (error: any) {
            const status: HealthStatus = {
                available: false,
                latencyMs: Date.now() - start,
                error: error.message,
            };
            this._healthCache = { status, timestamp: Date.now() };
            return status;
        }
    }

    async isAvailable(): Promise<boolean> {
        const health = await this.healthCheck();
        return health.available;
    }

    // ---- Agent Service ----

    async agent(request: AgentRequest): Promise<AgentResponse> {
        return this.request<AgentResponse>(this.flowUrl('agent'), {
            question: request.question,
            ...(request.state && { state: request.state }),
            ...(request.history && { history: request.history }),
            ...(request.group && { group: request.group }),
            ...(request.collection && { collection: request.collection }),
            ...(request.user && { user: request.user }),
            streaming: false,
        });
    }

    async *agentStream(request: AgentRequest): AsyncGenerator<string, AgentResponse | void, undefined> {
        const response = await fetch(this.flowUrl('agent'), {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                question: request.question,
                ...(request.state && { state: request.state }),
                ...(request.history && { history: request.history }),
                ...(request.group && { group: request.group }),
                ...(request.collection && { collection: request.collection }),
                ...(request.user && { user: request.user }),
                streaming: true,
            }),
            signal: AbortSignal.timeout(this.config.timeout),
        });

        if (!response.ok || !response.body) {
            throw new TrustGraphError(`Agent stream failed: ${response.status}`, response.status);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const data = JSON.parse(line);
                    if (data['end-of-stream']) {
                        return data as AgentResponse;
                    }
                    if (data.response) {
                        yield data.response;
                    }
                } catch {
                    // Skip non-JSON lines
                }
            }
        }
    }

    // ---- Document RAG ----

    async documentRag(request: RagRequest): Promise<RagResponse> {
        return this.request<RagResponse>(this.flowUrl('document-rag'), {
            query: request.query,
            ...(request.collection && { collection: request.collection }),
            ...(request.user && { user: request.user }),
            ...(request['doc-limit'] && { 'doc-limit': request['doc-limit'] }),
            streaming: false,
        });
    }

    async *documentRagStream(request: RagRequest): AsyncGenerator<string, void, undefined> {
        const response = await fetch(this.flowUrl('document-rag'), {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                query: request.query,
                ...(request.collection && { collection: request.collection }),
                ...(request.user && { user: request.user }),
                ...(request['doc-limit'] && { 'doc-limit': request['doc-limit'] }),
                streaming: true,
            }),
            signal: AbortSignal.timeout(this.config.timeout),
        });

        if (!response.ok || !response.body) {
            throw new TrustGraphError(`Document RAG stream failed: ${response.status}`, response.status);
        }

        yield* this.readStream(response);
    }

    // ---- Graph RAG ----

    async graphRag(request: RagRequest): Promise<RagResponse> {
        return this.request<RagResponse>(this.flowUrl('graph-rag'), {
            query: request.query,
            ...(request.collection && { collection: request.collection }),
            ...(request.user && { user: request.user }),
            ...(request['entity-limit'] && { 'entity-limit': request['entity-limit'] }),
            ...(request['triple-limit'] && { 'triple-limit': request['triple-limit'] }),
            ...(request['max-subgraph-size'] && { 'max-subgraph-size': request['max-subgraph-size'] }),
            ...(request['max-path-length'] && { 'max-path-length': request['max-path-length'] }),
            streaming: false,
        });
    }

    async *graphRagStream(request: RagRequest): AsyncGenerator<string, void, undefined> {
        const response = await fetch(this.flowUrl('graph-rag'), {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                query: request.query,
                ...(request.collection && { collection: request.collection }),
                ...(request.user && { user: request.user }),
                ...(request['entity-limit'] && { 'entity-limit': request['entity-limit'] }),
                ...(request['triple-limit'] && { 'triple-limit': request['triple-limit'] }),
                ...(request['max-subgraph-size'] && { 'max-subgraph-size': request['max-subgraph-size'] }),
                ...(request['max-path-length'] && { 'max-path-length': request['max-path-length'] }),
                streaming: true,
            }),
            signal: AbortSignal.timeout(this.config.timeout),
        });

        if (!response.ok || !response.body) {
            throw new TrustGraphError(`Graph RAG stream failed: ${response.status}`, response.status);
        }

        yield* this.readStream(response);
    }

    // ---- Text Completion ----

    async textCompletion(request: TextCompletionRequest): Promise<TextCompletionResponse> {
        return this.request<TextCompletionResponse>(this.flowUrl('text-completion'), {
            prompt: request.prompt,
            ...(request.system && { system: request.system }),
            streaming: false,
        });
    }

    // ---- Text Load (Document Ingestion) ----

    async textLoad(request: TextLoadRequest): Promise<void> {
        const base64Text = Buffer.from(request.text, 'utf-8').toString('base64');
        
        await this.request<any>(this.flowUrl('text-load'), {
            text: base64Text,
            id: request.id,
            ...(request.user && { user: request.user }),
            ...(request.collection && { collection: request.collection }),
            ...(request.charset && { charset: request.charset }),
            ...(request.metadata && { metadata: request.metadata }),
        });
    }

    // ---- Document Load (Binary — PDF, etc.) ----

    async documentLoad(request: DocumentLoadRequest): Promise<void> {
        await this.request<any>(this.flowUrl('document-load'), {
            data: request.data, // Already base64
            id: request.id,
            ...(request.user && { user: request.user }),
            ...(request.collection && { collection: request.collection }),
            ...(request.metadata && { metadata: request.metadata }),
        });
    }

    // ---- Embeddings ----

    async embeddings(request: EmbeddingsRequest): Promise<EmbeddingsResponse> {
        return this.request<EmbeddingsResponse>(this.flowUrl('embeddings'), {
            text: request.text,
            ...(request.collection && { collection: request.collection }),
            ...(request.user && { user: request.user }),
        });
    }

    // ---- Graph Embeddings Query ----

    async graphEmbeddingsQuery(request: GraphEmbeddingsQueryRequest): Promise<any> {
        return this.request<any>(this.flowUrl('graph-embeddings-query'), {
            query: request.query,
            ...(request.collection && { collection: request.collection }),
            ...(request.user && { user: request.user }),
            ...(request.limit && { limit: request.limit }),
        });
    }

    // ---- Document Embeddings Query ----

    async documentEmbeddingsQuery(query: string, options?: { collection?: string; user?: string; limit?: number }): Promise<any> {
        return this.request<any>(this.flowUrl('document-embeddings-query'), {
            query,
            ...(options?.collection && { collection: options.collection }),
            ...(options?.user && { user: options.user }),
            ...(options?.limit && { limit: options.limit }),
        });
    }

    // ---- Knowledge Core Management ----

    async listKnowledgeCores(): Promise<any[]> {
        return this.requestGet<any[]>(this.globalUrl('knowledge'));
    }

    async loadKnowledgeCore(coreId: string): Promise<void> {
        await this.request<any>(this.globalUrl(`knowledge/${coreId}/load`), {});
    }

    async unloadKnowledgeCore(coreId: string): Promise<void> {
        await this.request<any>(this.globalUrl(`knowledge/${coreId}/unload`), {});
    }

    // ---- Stream Reader Helper ----

    private async *readStream(response: Response): AsyncGenerator<string, void, undefined> {
        if (!response.body) return;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const data = JSON.parse(line);
                    if (data['end-of-stream']) return;
                    if (data.response) {
                        yield data.response;
                    }
                } catch {
                    // Skip non-JSON lines
                }
            }
        }
    }
}

// ============ ERROR CLASS ============

export class TrustGraphError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.name = 'TrustGraphError';
        this.statusCode = statusCode;
    }
}

// ============ SINGLETON ============

let _instance: TrustGraphClient | null = null;

export function getTrustGraphClient(): TrustGraphClient {
    if (!_instance) {
        _instance = new TrustGraphClient();
    }
    return _instance;
}

export { TrustGraphClient };
export default getTrustGraphClient;
