import { AI_GOVERNANCE_CONFIG } from '../../config/ai-governance-profile';
import { aiDb, opsDb, IS_DATABASE_OFFLINE } from '../../prisma';
import { jsonDb } from '../../db/json-db';
import {
    detectPromptInjection,
    getRegisteredAiAgents,
    sanitizeAiText,
} from './control-plane';
import {
    assessDataCandidate,
    quarantineDataCandidate,
} from './data-governance';

/**
 * AI Context Service — Governed CRM data ingestion and agent registry.
 */
function effectiveCapabilities(capabilities: string[]) {
    return capabilities.filter(capability => {
        if (capability === 'tool-read') return AI_GOVERNANCE_CONFIG.agent.allowToolRead;
        if (capability === 'memory-write-candidate') {
            return AI_GOVERNANCE_CONFIG.agent.allowAiMemoryCandidates;
        }
        return capability !== 'write';
    });
}

function getBuiltInAgents() {
    const now = new Date().toISOString();
    return getRegisteredAiAgents().map(agent => ({
        id: agent.id,
        name: agent.displayName,
        subsystem: agent.domains.join(', '),
        systemPrompt: agent.systemPolicy,
        aiModel: 'local-governed',
        isDefault: agent.role === 'TECHNICAL_ANALYST',
        isBuiltIn: true,
        role: agent.role,
        capabilities: effectiveCapabilities(agent.capabilities),
        collections: agent.collections,
        memoryNamespace: agent.memoryNamespace,
        governanceProfile: {
            runtime: AI_GOVERNANCE_CONFIG.runtimeProfile,
            assurance: AI_GOVERNANCE_CONFIG.assuranceProfile,
            allowWrite: false,
        },
        createdAt: now,
        updatedAt: now,
    }));
}

function mergeAgents(persisted: any[]) {
    const builtIn = getBuiltInAgents();
    const ids = new Set(builtIn.map(agent => agent.id));
    return [...builtIn, ...persisted.filter(agent => !ids.has(agent.id))];
}

export async function getInternalKnowledgeSnippets(limit: number = 50) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await aiDb.aiKnowledgeSnippet.findMany({
                orderBy: { createdAt: 'desc' },
                take: limit
            });
        } catch (e) { /* fallback */ }
    }
    const all = await jsonDb.getCollection<any>('ai_knowledge_snippets');
    return [...all].reverse().slice(0, limit);
}

export async function createInternalKnowledgeSnippet(content: string, source: string, tags: string[]) {
    const normalizedContent = sanitizeAiText(content, AI_GOVERNANCE_CONFIG.uploads.textExtractionMaxBytes);
    const normalizedSource = sanitizeAiText(source, 500);
    const normalizedTags = Array.from(new Set((tags ?? [])
        .map(tag => sanitizeAiText(tag, 80).toLocaleLowerCase('vi'))
        .filter(Boolean)))
        .slice(0, 30);

    const envelope = assessDataCandidate(
        {
            entityType: 'knowledge-snippet',
            content: normalizedContent,
            source: normalizedSource,
            tags: normalizedTags,
            recordedAt: new Date().toISOString(),
        },
        {
            entityType: 'knowledge-snippet',
            namespace: 'knowledge:curated',
            provenance: {
                sourceType: 'document',
                sourceId: normalizedSource || 'unspecified',
                sourceVersion: 'ingestion-v1',
                collectedAt: new Date().toISOString(),
            },
            requiredFields: ['content', 'source'],
        },
    );

    if (envelope.decision === 'quarantine' || envelope.decision === 'reject') {
        await quarantineDataCandidate(envelope, 'Knowledge candidate failed ingestion policy');
        throw new Error(`Knowledge candidate quarantined: ${envelope.issues.join(', ')}`);
    }

    if (!IS_DATABASE_OFFLINE) {
        try {
            return await aiDb.aiKnowledgeSnippet.create({
                data: { content: normalizedContent, source: normalizedSource, tags: normalizedTags }
            });
        } catch (e) { /* fallback */ }
    }

    const snippet = {
        id: `snippet-${envelope.fingerprint.slice(0, 24)}`,
        content: normalizedContent,
        source: normalizedSource,
        tags: normalizedTags,
        governance: {
            runtimeProfile: AI_GOVERNANCE_CONFIG.runtimeProfile,
            assuranceProfile: AI_GOVERNANCE_CONFIG.assuranceProfile,
            fingerprint: envelope.fingerprint,
            qualityScore: envelope.qualityScore,
            trustScore: envelope.trustScore,
            decision: envelope.decision,
            issues: envelope.issues,
            provenance: envelope.provenance,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    return await jsonDb.insertRecord<any>('ai_knowledge_snippets', snippet);
}

export async function deleteInternalKnowledgeSnippet(id: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await aiDb.aiKnowledgeSnippet.delete({ where: { id } });
        } catch (e) { /* fallback */ }
    }
    return await jsonDb.delete('ai_knowledge_snippets', (s: any) => s.id === id);
}

export async function getInternalAgents() {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const agents = await aiDb.aiAgent.findMany({
                orderBy: { name: 'asc' }
            });
            return mergeAgents(agents);
        } catch (e) { /* fallback */ }
    }

    const agents = await jsonDb.getCollection<any>('ai_agents');
    return mergeAgents(agents);
}

export async function createInternalAgent(data: { name: string, subsystem: string, systemPrompt: string }) {
    const name = sanitizeAiText(data.name, 120);
    const subsystem = sanitizeAiText(data.subsystem, 250);
    const requestedPrompt = sanitizeAiText(data.systemPrompt, 4_000);
    const injectionSignals = detectPromptInjection(requestedPrompt);

    if (!name || !subsystem || !requestedPrompt) {
        throw new Error('Agent name, subsystem and system prompt are required.');
    }
    if (injectionSignals.length > 0) {
        throw new Error(`Agent prompt rejected by governance policy: ${injectionSignals.join(', ')}`);
    }
    if (/\b(write|delete|drop|truncate|execute|shutdown|ghi|xóa|thực thi|tắt hệ thống)\b/i.test(requestedPrompt)) {
        throw new Error('Custom agents are advisory-only and cannot request data-write or system-control authority.');
    }

    const systemPrompt = [
        requestedPrompt,
        '[IMMUTABLE CUSTOM AGENT POLICY]',
        'Chỉ được đọc, phân tích và đề xuất. Không tự ý ghi, sửa, xóa dữ liệu hoặc điều khiển hệ thống.',
        'Mọi kết luận phải nêu nguồn, độ tin cậy và phần chưa được xác minh.',
    ].join('\n\n');
    const governedData = { name, subsystem, systemPrompt };

    if (!IS_DATABASE_OFFLINE) {
        try {
            return await aiDb.aiAgent.create({ data: governedData });
        } catch (e) { /* fallback */ }
    }

    const agent = {
        ...governedData,
        id: `agent-${Date.now()}`,
        aiModel: 'local-governed',
        isDefault: false,
        isBuiltIn: false,
        governanceMode: 'advisory-only',
        governanceProfile: {
            runtime: AI_GOVERNANCE_CONFIG.runtimeProfile,
            assurance: AI_GOVERNANCE_CONFIG.assuranceProfile,
            allowWrite: false,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    return await jsonDb.insertRecord<any>('ai_agents', agent);
}

export async function getInternalSystemSnapshot() {
    if (IS_DATABASE_OFFLINE) {
        const dnfs = await jsonDb.getCollection<any>('dnf_documents');
        const hazards = await jsonDb.getCollection<any>('hazards');

        const activeDnfs = dnfs.filter((d: any) => !['Đã đóng', 'Hủy'].includes(d.status)).length;
        const severeDnfs = dnfs.filter((d: any) => d.priority === 'Cao' && !['Đã đóng', 'Hủy'].includes(d.status)).length;
        const activeHazards = hazards.filter((h: any) => !['Đã đóng', 'Hủy'].includes(h.status)).length;

        return { activeDnfs, severeDnfs, activeHazards };
    }

    try {
        const [activeDnfs, severeDnfs, activeHazards] = await Promise.all([
            opsDb.dnfDocument.count({ where: { status: { notIn: ['Đã đóng', 'Hủy'] } } }),
            opsDb.dnfDocument.count({ where: { priority: 'Cao', status: { notIn: ['Đã đóng', 'Hủy'] } } }),
            opsDb.hazardRecord.count({ where: { status: { notIn: ['Đã đóng', 'Hủy'] } } })
        ]);

        return { activeDnfs, severeDnfs, activeHazards };
    } catch (e) {
        return { activeDnfs: 0, severeDnfs: 0, activeHazards: 0 };
    }
}

export async function getInternalRecentDnfDocs(limit: number = 30) {
    if (IS_DATABASE_OFFLINE) {
        const all = await jsonDb.getCollection<any>('dnf_documents');
        return [...all].reverse().slice(0, limit);
    }
    try {
        const dnfs = await opsDb.dnfDocument.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit
        });
        return dnfs;
    } catch (e) { return []; }
}

export async function getInternalRecentHazardDocs(limit: number = 30) {
    if (IS_DATABASE_OFFLINE) {
        const all = await jsonDb.getCollection<any>('hazards');
        return [...all].reverse().slice(0, limit);
    }
    try {
        const hazards = await opsDb.hazardRecord.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit
        });
        return hazards;
    } catch (e) { return []; }
}
