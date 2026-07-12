import {
    askAI as askBaseAI,
    askWithRAG as askBaseRAG,
    agentChat as baseAgentChat,
    askPersonalized as baseAskPersonalized,
} from "../ai";
import {
    finalizeGovernedText,
    getRegisteredAiAgents,
    prepareGovernedRequest,
    type AiExpertRole,
    type GovernedAiOptions,
} from "./control-plane";

/**
 * CENTRAL AI MANAGER — GOVERNED LOCAL-ONLY CONTROL PLANE
 *
 * Every AI request must pass through deterministic routing, risk scoring,
 * prompt-injection screening, data redaction and hash-chained audit events.
 */

export type ExpertRole = AiExpertRole;

type ManagerOptions = GovernedAiOptions & Record<string, any>;

function governedOptions(context: Awaited<ReturnType<typeof prepareGovernedRequest>>, options: ManagerOptions) {
    return {
        ...options,
        role: context.agent.role,
        systemPrompt: context.systemPrompt,
        groundingContext: context.groundingContext,
    };
}

export async function askAI(prompt: string, options: ManagerOptions = {}) {
    const context = await prepareGovernedRequest('askAI', prompt, options);
    console.log(`[AI CONTROL PLANE] ${context.requestId} -> ${context.agent.role}/${context.domain}/${context.riskLevel}`);

    const response = await askBaseAI(context.prompt, governedOptions(context, options));
    return finalizeGovernedText(context, response, { source: 'local-ai-core' });
}

export async function agentChat(question: string, options: ManagerOptions = {}) {
    const context = await prepareGovernedRequest('agentChat', question, options);
    const response = await baseAgentChat(context.prompt, {
        ...options,
        collection: options.collection,
        user: options.user,
    });

    return {
        ...response,
        answer: await finalizeGovernedText(context, response.answer, { source: response.source }),
        governance: {
            requestId: context.requestId,
            agentId: context.agent.id,
            domain: context.domain,
            riskLevel: context.riskLevel,
            requiresHumanApproval: context.requiresHumanApproval,
        },
    };
}

export async function askWithRAG(query: string, options: ManagerOptions = {}) {
    const context = await prepareGovernedRequest('askWithRAG', query, options);
    const response = await askBaseRAG(context.prompt, {
        ...options,
        systemPrompt: context.systemPrompt,
    });

    return {
        ...response,
        response: await finalizeGovernedText(context, response.response, { source: response.source }),
        governance: {
            requestId: context.requestId,
            agentId: context.agent.id,
            domain: context.domain,
            riskLevel: context.riskLevel,
            requiresHumanApproval: context.requiresHumanApproval,
        },
    };
}

export async function askPersonalized(query: string, options: ManagerOptions = {}) {
    const context = await prepareGovernedRequest('askPersonalized', query, {
        ...options,
        userId: options.userId ?? options.user,
    });
    const response = await baseAskPersonalized(context.prompt, governedOptions(context, options));
    return finalizeGovernedText(context, response, { source: 'personalized-local-ai' });
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
        },
    };
}

export async function getAIAgentRegistry() {
    return getRegisteredAiAgents();
}

export async function analyzeWithGraph(query: string, options: ManagerOptions = {}) {
    const context = await prepareGovernedRequest('analyzeWithGraph', query, {
        ...options,
        role: options.role ?? 'RAG_SPECIALIST',
    });
    const { analyzeWithGraph: baseGraph } = await import('../ai');
    const response = await baseGraph(context.prompt, {
        ...options,
        systemPrompt: context.systemPrompt,
    });

    return {
        ...response,
        response: await finalizeGovernedText(context, response.response, { source: response.source ?? 'trustgraph' }),
        governance: {
            requestId: context.requestId,
            agentId: context.agent.id,
            domain: context.domain,
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
    const context = await prepareGovernedRequest('askVisionAI', prompt, {
        ...options,
        role: options.role ?? 'SAFETY_AUDITOR',
        source: 'vision',
    });
    const { askVisionAI: baseVision } = await import('../ai');
    const response = await baseVision(context.prompt, image, governedOptions(context, options));
    return finalizeGovernedText(context, response, { source: 'local-vision-ai' });
}

export async function askHuggingFace(prompt: string, options: ManagerOptions = {}) {
    console.log('[AI CONTROL PLANE] HuggingFace request routed to governed local expert.');
    return askAI(prompt, options);
}

export async function detectObjectsHF(imageBuffer: Buffer, options: ManagerOptions = {}) {
    return detectObjects(imageBuffer, options);
}
