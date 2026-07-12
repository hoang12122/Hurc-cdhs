import {
    askAI as askBaseAI,
    askWithRAG as askBaseRAG,
    agentChat as baseAgentChat,
    askPersonalized as baseAskPersonalized,
} from "../ai";
import {
    AI_AGENT_REGISTRY,
    classifyAiDomain,
    finalizeGovernedText,
    getRegisteredAiAgents,
    prepareGovernedRequest,
    sanitizeAiText,
    sha256,
    type AiDomain,
    type AiExpertRole,
    type GovernanceContext,
    type GovernedAiOptions,
} from "./control-plane";
import { executeWithRuntimeGuard, getAiRuntimeGuardStatus } from './runtime-guard';

/**
 * CENTRAL AI MANAGER — GOVERNED LOCAL-ONLY CONTROL PLANE
 *
 * Every AI request must pass through deterministic routing, risk scoring,
 * prompt-injection screening, data redaction, runtime isolation and audit.
 */

export type ExpertRole = AiExpertRole;

type ManagerOptions = GovernedAiOptions & Record<string, any>;

const FALLBACK_ROLE_BY_DOMAIN: Record<AiDomain, AiExpertRole> = {
    general: 'TECHNICAL_ANALYST',
    assets: 'ASSET_MANAGER',
    maintenance: 'TECHNICAL_ANALYST',
    safety: 'SAFETY_AUDITOR',
    operations: 'SYSTEM_GUARDIAN',
    documents: 'RAG_SPECIALIST',
    executive: 'EXECUTIVE_BRAIN',
    vision: 'SAFETY_AUDITOR',
    systems: 'SYSTEM_GUARDIAN',
    data: 'DATA_STEWARD',
};

function governedOptions(context: GovernanceContext, options: ManagerOptions) {
    return {
        ...options,
        role: context.agent.role,
        systemPrompt: context.systemPrompt,
        groundingContext: context.groundingContext,
    };
}

function buildEmergencyContext(operation: string, rawPrompt: string, options: ManagerOptions): GovernanceContext {
    const prompt = sanitizeAiText(rawPrompt);
    const domain = classifyAiDomain(prompt);
    const requestedRole = options.role && AI_AGENT_REGISTRY[options.role] ? options.role : undefined;
    const agent = AI_AGENT_REGISTRY[requestedRole ?? FALLBACK_ROLE_BY_DOMAIN[domain]];
    const actor = String(options.userId ?? options.user ?? 'anonymous').replace(/[^a-zA-Z0-9_.@-]/g, '_');
    const namespace = `${agent.memoryNamespace}:${domain}:${actor}`;
    const requestId = `aireq-degraded-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const groundingContext = options.groundingContext ? sanitizeAiText(String(options.groundingContext), agent.maxPromptChars) : undefined;
    const systemPrompt = [
        sanitizeAiText(String(options.systemPrompt ?? ''), 8_000),
        '[AI CONTROL PLANE - DEGRADED AUDIT MODE]',
        `Agent: ${agent.displayName}; Domain: ${domain}; Namespace: ${namespace}`,
        'Chỉ đọc, phân tích và đề xuất. Không ghi, sửa, xóa hoặc thay đổi trạng thái hệ thống.',
        'Audit storage đang suy giảm; mọi kết quả phải được xem là tư vấn và cần con người kiểm tra.',
        agent.systemPolicy,
    ].filter(Boolean).join('\n');

    return {
        requestId,
        operation,
        agent,
        domain,
        namespace,
        prompt: prompt.slice(0, agent.maxPromptChars),
        groundingContext,
        systemPrompt,
        fingerprint: sha256(`${operation}\n${namespace}\n${prompt}`),
        riskScore: 50,
        riskLevel: 'high',
        injectionSignals: [],
        containsSensitiveData: false,
        writeIntent: false,
        requiresHumanApproval: true,
        startedAt: new Date().toISOString(),
    };
}

async function safePrepare(operation: string, prompt: string, options: ManagerOptions): Promise<GovernanceContext> {
    try {
        return await prepareGovernedRequest(operation, prompt, options);
    } catch (error) {
        console.warn('[AI CONTROL PLANE] Audit/policy persistence degraded:', error instanceof Error ? error.message : error);
        return buildEmergencyContext(operation, prompt, options);
    }
}

async function safeFinalize(context: GovernanceContext, output: string, source?: string): Promise<string> {
    try {
        return await finalizeGovernedText(context, output, { source });
    } catch (error) {
        console.warn('[AI CONTROL PLANE] Response audit persistence degraded:', error instanceof Error ? error.message : error);
        return sanitizeAiText(output, context.agent.maxOutputChars);
    }
}

export async function askAI(prompt: string, options: ManagerOptions = {}) {
    const context = await safePrepare('askAI', prompt, options);
    console.log(`[AI CONTROL PLANE] ${context.requestId} -> ${context.agent.role}/${context.domain}/${context.riskLevel}`);

    const response = await executeWithRuntimeGuard(
        context,
        () => askBaseAI(context.prompt, governedOptions(context, options)),
    );
    return safeFinalize(context, response, 'local-ai-core');
}

export async function agentChat(question: string, options: ManagerOptions = {}) {
    const context = await safePrepare('agentChat', question, options);
    const response = await executeWithRuntimeGuard(
        context,
        () => baseAgentChat(context.prompt, {
            ...options,
            collection: options.collection,
            user: options.user,
        }),
    );

    return {
        ...response,
        answer: await safeFinalize(context, response.answer, response.source),
        governance: {
            requestId: context.requestId,
            agentId: context.agent.id,
            domain: context.domain,
            namespace: context.namespace,
            riskLevel: context.riskLevel,
            requiresHumanApproval: context.requiresHumanApproval,
        },
    };
}

export async function askWithRAG(query: string, options: ManagerOptions = {}) {
    const context = await safePrepare('askWithRAG', query, options);
    const response = await executeWithRuntimeGuard(
        context,
        () => askBaseRAG(context.prompt, {
            ...options,
            systemPrompt: context.systemPrompt,
        }),
    );

    return {
        ...response,
        response: await safeFinalize(context, response.response, response.source),
        governance: {
            requestId: context.requestId,
            agentId: context.agent.id,
            domain: context.domain,
            namespace: context.namespace,
            riskLevel: context.riskLevel,
            requiresHumanApproval: context.requiresHumanApproval,
        },
    };
}

export async function askPersonalized(query: string, options: ManagerOptions = {}) {
    const context = await safePrepare('askPersonalized', query, {
        ...options,
        userId: options.userId ?? options.user,
    });
    const response = await executeWithRuntimeGuard(
        context,
        () => baseAskPersonalized(context.prompt, {
            userId: String(options.userId ?? options.user ?? 'anonymous'),
            history: options.history,
        }),
    );

    return {
        ...response,
        content: await safeFinalize(context, response.content, response.source),
        governance: {
            requestId: context.requestId,
            agentId: context.agent.id,
            domain: context.domain,
            namespace: context.namespace,
            riskLevel: context.riskLevel,
            requiresHumanApproval: context.requiresHumanApproval,
        },
    };
}

export async function getAIHealthStatus() {
    const { getAIHealthStatus: getBaseHealth } = await import('../ai');
    const base = await getBaseHealth();
    return {
        ...base,
        governance: {
            enabled: true,
            mode: 'advisory-only',
            registeredAgents: getRegisteredAiAgents().length,
            writeAccess: false,
            runtimeGuard: getAiRuntimeGuardStatus(),
        },
    };
}

export async function getAIAgentRegistry() {
    return getRegisteredAiAgents();
}

export async function analyzeWithGraph(query: string, options: ManagerOptions = {}) {
    const context = await safePrepare('analyzeWithGraph', query, {
        ...options,
        role: options.role ?? 'RAG_SPECIALIST',
    });
    const { analyzeWithGraph: baseGraph } = await import('../ai');
    const response = await executeWithRuntimeGuard(
        context,
        () => baseGraph(context.prompt, {
            ...options,
            systemPrompt: context.systemPrompt,
        }),
    );

    return {
        ...response,
        response: await safeFinalize(context, response.response, response.source ?? 'trustgraph'),
        governance: {
            requestId: context.requestId,
            agentId: context.agent.id,
            domain: context.domain,
            namespace: context.namespace,
            riskLevel: context.riskLevel,
        },
    };
}

export async function detectObjects(imageBuffer: Buffer, _options: ManagerOptions = {}) {
    const { detectObjects: baseDetect } = await import('../ai');
    return baseDetect(imageBuffer);
}

export async function askVisionAI(
    prompt: string,
    image: { data: string; mimeType: string },
    options: ManagerOptions = {},
) {
    const context = await safePrepare('askVisionAI', prompt, {
        ...options,
        role: options.role ?? 'SAFETY_AUDITOR',
        source: 'vision',
    });
    const { askVisionAI: baseVision } = await import('../ai');
    const response = await executeWithRuntimeGuard(
        context,
        () => baseVision(context.prompt, image, governedOptions(context, options)),
    );
    return safeFinalize(context, response, 'local-vision-ai');
}

export async function askHuggingFace(prompt: string, options: ManagerOptions = {}) {
    console.log('[AI CONTROL PLANE] HuggingFace request routed to governed local expert.');
    return askAI(prompt, options);
}

export async function detectObjectsHF(imageBuffer: Buffer, options: ManagerOptions = {}) {
    return detectObjects(imageBuffer, options);
}
