import {
    askAI as askBaseAI,
    agentChat as baseAgentChat,
    askPersonalized as baseAskPersonalized,
} from "../ai";
import { IS_DATABASE_OFFLINE } from '../../prisma';
import { getRegisteredAiAgents, type AiExpertRole } from "./control-plane";
import { executeWithRuntimeGuard, getAiRuntimeGuardStatus } from './runtime-guard';
import {
    finalizeManagerOutput,
    governedOptions,
    prepareManagerContext,
    type ManagerOptions,
} from './manager-governance';
import { runSecureRagPipeline } from './secure-rag-hooks';

/** Central governed local-only AI control plane. */
export type ExpertRole = AiExpertRole;

export async function askAI(prompt: string, options: ManagerOptions = {}) {
    const context = await prepareManagerContext('askAI', prompt, options);
    console.log(`[AI CONTROL PLANE] ${context.requestId} -> ${context.agent.role}/${context.domain}/${context.riskLevel}`);
    const response = await executeWithRuntimeGuard(
        context,
        () => askBaseAI(context.prompt, governedOptions(context, options)),
    );
    return finalizeManagerOutput(context, response, 'local-ai-core');
}

export async function agentChat(question: string, options: ManagerOptions = {}) {
    const context = await prepareManagerContext('agentChat', question, options);
    const response = await executeWithRuntimeGuard(context, () => baseAgentChat(context.prompt, {
        ...options, collection: options.collection, user: options.user,
    }));
    return {
        ...response,
        answer: await finalizeManagerOutput(context, response.answer, response.source),
        governance: {
            requestId: context.requestId, agentId: context.agent.id, domain: context.domain,
            namespace: context.namespace, riskLevel: context.riskLevel,
            requiresHumanApproval: context.requiresHumanApproval,
        },
    };
}

export async function askWithRAG(query: string, options: ManagerOptions = {}) {
    const context = await prepareManagerContext('askWithRAG', query, options);
    const response = await executeWithRuntimeGuard(context, () => runSecureRagPipeline(context, {
        collection: options.collection,
        forceIntent: options.forceIntent,
        user: options.user,
        userId: options.userId,
        systemPrompt: context.systemPrompt,
        retrievalTimeoutMs: options.retrievalTimeoutMs,
        generationTimeoutMs: options.generationTimeoutMs,
        maxEvidenceChars: options.maxEvidenceChars,
        maxEvidenceItems: options.maxEvidenceItems,
    }));
    if (response.security.acceptedEvidence > 0 && !context.groundingContext) {
        context.groundingContext = `[SECURE_RAG_EVIDENCE count=${response.security.acceptedEvidence}; collection=${response.security.resolvedCollection}]`;
    }
    return {
        ...response,
        response: await finalizeManagerOutput(context, response.response, response.source),
        governance: {
            requestId: context.requestId, agentId: context.agent.id, domain: context.domain,
            namespace: context.namespace, riskLevel: context.riskLevel,
            requiresHumanApproval: context.requiresHumanApproval,
        },
    };
}

export async function askPersonalized(query: string, options: ManagerOptions = {}) {
    const context = await prepareManagerContext('askPersonalized', query, {
        ...options, userId: options.userId ?? options.user,
    });
    const response = await executeWithRuntimeGuard(context, () => baseAskPersonalized(context.prompt, {
        userId: String(options.userId ?? options.user ?? 'anonymous'),
        history: options.history,
    }));
    return {
        ...response,
        content: await finalizeManagerOutput(context, response.content, response.source),
        governance: {
            requestId: context.requestId, agentId: context.agent.id, domain: context.domain,
            namespace: context.namespace, riskLevel: context.riskLevel,
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
            auditStore: IS_DATABASE_OFFLINE ? 'json-hash-chain' : 'postgres-ai-safety-log',
            mode: 'advisory-only',
            registeredAgents: getRegisteredAiAgents().length,
            writeAccess: false,
            runtimeGuard: getAiRuntimeGuardStatus(),
        },
    };
}

export async function getAIAgentRegistry() { return getRegisteredAiAgents(); }

export async function analyzeWithGraph(query: string, options: ManagerOptions = {}) {
    const context = await prepareManagerContext('analyzeWithGraph', query, {
        ...options, role: options.role ?? 'RAG_SPECIALIST',
    });
    const { analyzeWithGraph: baseGraph } = await import('../ai');
    const response = await executeWithRuntimeGuard(context, () => baseGraph(context.prompt, {
        ...options, systemPrompt: context.systemPrompt,
    }));
    return {
        ...response,
        response: await finalizeManagerOutput(context, response.response, response.source ?? 'trustgraph'),
        governance: {
            requestId: context.requestId, agentId: context.agent.id, domain: context.domain,
            namespace: context.namespace, riskLevel: context.riskLevel,
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
    const context = await prepareManagerContext('askVisionAI', prompt, {
        ...options, role: options.role ?? 'SAFETY_AUDITOR', source: 'vision',
    });
    const { askVisionAI: baseVision } = await import('../ai');
    const response = await executeWithRuntimeGuard(
        context,
        () => baseVision(context.prompt, image, governedOptions(context, options)),
    );
    return finalizeManagerOutput(context, response, 'local-vision-ai');
}

export async function askHuggingFace(prompt: string, options: ManagerOptions = {}) {
    console.log('[AI CONTROL PLANE] HuggingFace request routed to governed local expert.');
    return askAI(prompt, options);
}

export async function detectObjectsHF(imageBuffer: Buffer, options: ManagerOptions = {}) {
    return detectObjects(imageBuffer, options);
}
