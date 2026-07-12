import { jsonDb } from '../db/json-db';
import { aiDb, IS_DATABASE_OFFLINE } from '../prisma';
import {
    appendGovernanceAudit,
    buildMemoryNamespace,
    classifyAiDomain,
    hasUnsafeLearningSignals,
    sanitizeAiText,
    sha256,
    type AiDomain,
    type AiExpertRole,
} from './ai/control-plane';

/**
 * GOVERNED AGENT MEMORY FIREWALL
 *
 * AI output is never authoritative by default. Memories are namespaced,
 * deduplicated, time-bounded and either provisional, verified, quarantined or
 * superseded. Offline mode uses atomic JSON storage; PostgreSQL mode reuses
 * AiVerificationLog so every learned item has an explicit review state.
 */

export type MemoryVerificationStatus = 'provisional' | 'verified' | 'quarantined' | 'superseded';
export type MemorySourceType = 'ai-output' | 'database' | 'document' | 'human-approved' | 'system-event';

export interface AgentMemory {
    id: string;
    userId: string;
    namespace: string;
    domain: AiDomain;
    agentRole: AiExpertRole;
    topic: string;
    context: string;
    importance: number;
    confidence: number;
    checksum: string;
    sourceType: MemorySourceType;
    sourceId?: string;
    sourceVersion?: string;
    provenanceIds: string[];
    verificationStatus: MemoryVerificationStatus;
    reinforcementCount: number;
    timestamp: string;
    lastSeenAt: string;
    expiresAt: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface StoreExperienceOptions {
    role?: AiExpertRole;
    domain?: AiDomain;
    namespace?: string;
    confidence?: number;
    sourceType?: MemorySourceType;
    sourceId?: string;
    sourceVersion?: string;
    provenanceIds?: string[];
    humanApproved?: boolean;
    ttlDays?: number;
}

export interface RetrieveMemoryOptions {
    role?: AiExpertRole;
    domain?: AiDomain;
    namespace?: string;
    minimumConfidence?: number;
    includeProvisional?: boolean;
}

const ACTIVE_COLLECTION = 'ai_longterm_memory';
const QUARANTINE_COLLECTION = 'ai_memory_quarantine';
const DEFAULT_ROLE: AiExpertRole = 'TECHNICAL_ANALYST';
const ONLINE_MEMORY_TARGET_TYPE = 'AI_MEMORY';
const ONLINE_MEMORY_SOURCE_MODULE = 'MEMORY_FIREWALL';

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function tokenize(value: string): Set<string> {
    const tokens = sanitizeAiText(value, 20_000)
        .toLocaleLowerCase('vi')
        .split(/[^a-z0-9\u00c0-\u1ef9_-]+/i)
        .map(token => token.trim())
        .filter(token => token.length >= 3);
    return new Set(tokens);
}

function lexicalSimilarity(query: string, memoryText: string): number {
    const queryTokens = tokenize(query);
    const memoryTokens = tokenize(memoryText);
    if (queryTokens.size === 0 || memoryTokens.size === 0) return 0;

    let intersection = 0;
    for (const token of queryTokens) {
        if (memoryTokens.has(token)) intersection += 1;
    }
    return intersection / Math.max(queryTokens.size, 1);
}

function extractEntityIds(value: string): Set<string> {
    const matches = value.match(/(?:DNF|HAZ|INS|CA|EQ|AST)-[A-Z0-9_-]+/gi) ?? [];
    return new Set(matches.map(item => item.toUpperCase()));
}

function entityOverlap(query: string, memoryText: string): number {
    const queryIds = extractEntityIds(query);
    if (queryIds.size === 0) return 0;
    const memoryIds = extractEntityIds(memoryText);
    let matches = 0;
    for (const id of queryIds) {
        if (memoryIds.has(id)) matches += 1;
    }
    return matches / queryIds.size;
}

function calculateExpiry(importance: number, confidence: number, ttlDays?: number): string {
    const computedDays = ttlDays ?? Math.round(30 + importance * 18 + confidence * 120);
    const expires = new Date();
    expires.setUTCDate(expires.getUTCDate() + clamp(computedDays, 30, 365));
    return expires.toISOString();
}

function isAgentMemory(value: unknown): value is AgentMemory {
    if (!value || typeof value !== 'object') return false;
    const record = value as Partial<AgentMemory>;
    return Boolean(
        record.id
        && record.userId
        && record.namespace
        && record.topic
        && record.context
        && record.checksum
        && record.verificationStatus,
    );
}

function memoryFromVerificationLog(log: {
    status: string;
    aiProposedContent: unknown;
    finalContent: unknown;
}): AgentMemory | null {
    const candidate = log.status === 'APPROVED' && log.finalContent
        ? log.finalContent
        : log.aiProposedContent;
    if (!isAgentMemory(candidate)) return null;

    const verificationStatus: MemoryVerificationStatus = log.status === 'APPROVED'
        ? 'verified'
        : log.status === 'REJECTED'
          ? candidate.verificationStatus === 'superseded' ? 'superseded' : 'quarantined'
          : 'provisional';

    return {
        ...candidate,
        verificationStatus,
    };
}

function onlineStatusForMemory(status: MemoryVerificationStatus): 'PROPOSED' | 'APPROVED' | 'REJECTED' {
    if (status === 'verified') return 'APPROVED';
    if (status === 'quarantined' || status === 'superseded') return 'REJECTED';
    return 'PROPOSED';
}

async function safeAudit(input: Parameters<typeof appendGovernanceAudit>[0]): Promise<void> {
    if (!IS_DATABASE_OFFLINE) return;
    try {
        await appendGovernanceAudit(input);
    } catch (error) {
        console.warn('[AI MEMORY] Governance audit persistence unavailable:', error instanceof Error ? error.message : error);
    }
}

async function loadOnlineMemories(statuses: string[] = ['PROPOSED', 'APPROVED'], take = 2_000): Promise<AgentMemory[]> {
    const logs = await aiDb.aiVerificationLog.findMany({
        where: {
            targetType: ONLINE_MEMORY_TARGET_TYPE,
            status: { in: statuses },
        },
        orderBy: { createdAt: 'desc' },
        take,
        select: {
            status: true,
            aiProposedContent: true,
            finalContent: true,
        },
    });

    return logs
        .map(memoryFromVerificationLog)
        .filter((memory): memory is AgentMemory => memory !== null);
}

async function persistOnlineMemory(memory: AgentMemory): Promise<void> {
    const status = onlineStatusForMemory(memory.verificationStatus);
    const existing = await aiDb.aiVerificationLog.findFirst({
        where: {
            targetType: ONLINE_MEMORY_TARGET_TYPE,
            modelVersion: memory.checksum,
        },
        orderBy: { createdAt: 'desc' },
    });

    if (existing) {
        const existingMemory = memoryFromVerificationLog(existing);
        const preservedStatus = existing.status === 'APPROVED' ? 'APPROVED' : status;
        const merged: AgentMemory = {
            ...(existingMemory ?? memory),
            ...memory,
            confidence: Math.max(existingMemory?.confidence ?? 0, memory.confidence),
            importance: Math.max(existingMemory?.importance ?? 1, memory.importance),
            reinforcementCount: Math.max(existingMemory?.reinforcementCount ?? 1, memory.reinforcementCount),
            verificationStatus: preservedStatus === 'APPROVED' ? 'verified' : memory.verificationStatus,
        };

        await aiDb.aiVerificationLog.update({
            where: { id: existing.id },
            data: {
                targetVersion: merged.reinforcementCount,
                targetDisplayCode: merged.topic.slice(0, 200),
                aiProposedContent: merged as any,
                finalContent: preservedStatus === 'APPROVED' ? merged as any : undefined,
                status: preservedStatus,
                riskLevel: preservedStatus === 'APPROVED' ? 'LOW' : merged.verificationStatus === 'quarantined' ? 'HIGH' : 'MEDIUM',
                verifiedAt: preservedStatus === 'APPROVED' ? existing.verifiedAt ?? new Date() : undefined,
            },
        });
        return;
    }

    await aiDb.aiVerificationLog.create({
        data: {
            targetId: memory.id,
            targetType: ONLINE_MEMORY_TARGET_TYPE,
            targetDisplayCode: memory.topic.slice(0, 200),
            targetVersion: memory.reinforcementCount,
            sourceModule: ONLINE_MEMORY_SOURCE_MODULE,
            aiProposedContent: memory as any,
            finalContent: status === 'APPROVED' ? memory as any : undefined,
            status,
            riskLevel: status === 'REJECTED' ? 'HIGH' : status === 'PROPOSED' ? 'MEDIUM' : 'LOW',
            requiredRole: 'AI_GOVERNANCE_ADMIN',
            verifiedBy: status === 'APPROVED' ? 'governance-policy' : undefined,
            verifiedAt: status === 'APPROVED' ? new Date() : undefined,
            modelVersion: memory.checksum,
            isOrphan: false,
        },
    });
}

export async function storeExperience(
    userId: string,
    topic: string,
    context: string,
    importance = 5,
    options: StoreExperienceOptions = {},
): Promise<void> {
    const normalizedTopic = sanitizeAiText(topic, 500);
    const normalizedContext = sanitizeAiText(context, 12_000);
    if (!userId || !normalizedTopic || !normalizedContext) return;

    const domain = options.domain ?? classifyAiDomain(`${normalizedTopic}\n${normalizedContext}`);
    const role = options.role ?? DEFAULT_ROLE;
    const namespace = options.namespace ?? buildMemoryNamespace(role, domain, userId);
    const sourceType = options.sourceType ?? 'ai-output';
    const confidence = clamp(
        options.humanApproved ? Math.max(options.confidence ?? 0.95, 0.95) : (options.confidence ?? 0.68),
        0,
        1,
    );
    const unsafe = hasUnsafeLearningSignals(`${normalizedTopic}\n${normalizedContext}`);
    const verificationStatus: MemoryVerificationStatus = unsafe
        ? 'quarantined'
        : options.humanApproved || sourceType === 'human-approved' || sourceType === 'database'
          ? 'verified'
          : confidence >= 0.65
            ? 'provisional'
            : 'quarantined';
    const checksum = sha256(`${namespace}\n${normalizedTopic}\n${normalizedContext}`);
    const now = new Date().toISOString();
    const memoryId = `mem-${checksum.slice(0, 24)}`;

    try {
        if (!IS_DATABASE_OFFLINE) {
            const existing = await aiDb.aiVerificationLog.findFirst({
                where: {
                    targetType: ONLINE_MEMORY_TARGET_TYPE,
                    modelVersion: checksum,
                },
                orderBy: { createdAt: 'desc' },
            });
            const existingMemory = existing ? memoryFromVerificationLog(existing) : null;
            const memory: AgentMemory = {
                id: existingMemory?.id ?? memoryId,
                userId,
                namespace,
                domain,
                agentRole: role,
                topic: normalizedTopic,
                context: normalizedContext,
                importance: Math.max(existingMemory?.importance ?? 1, clamp(importance, 1, 10)),
                confidence: Math.max(existingMemory?.confidence ?? 0, confidence),
                checksum,
                sourceType: existingMemory?.sourceType === 'human-approved' ? 'human-approved' : sourceType,
                sourceId: options.sourceId ?? existingMemory?.sourceId,
                sourceVersion: options.sourceVersion ?? existingMemory?.sourceVersion,
                provenanceIds: Array.from(new Set([...(existingMemory?.provenanceIds ?? []), ...(options.provenanceIds ?? [])])),
                verificationStatus: existing?.status === 'APPROVED' ? 'verified' : verificationStatus,
                reinforcementCount: (existingMemory?.reinforcementCount ?? 0) + 1,
                timestamp: existingMemory?.timestamp ?? now,
                lastSeenAt: now,
                expiresAt: calculateExpiry(
                    Math.max(existingMemory?.importance ?? 1, importance),
                    Math.max(existingMemory?.confidence ?? 0, confidence),
                    options.ttlDays,
                ),
            };
            await persistOnlineMemory(memory);
            return;
        }

        const targetCollection = verificationStatus === 'quarantined' ? QUARANTINE_COLLECTION : ACTIVE_COLLECTION;
        const existing = await jsonDb.findFirst<AgentMemory>(
            targetCollection,
            memory => memory.checksum === checksum && memory.namespace === namespace,
        );

        if (existing) {
            await jsonDb.updateRecord<AgentMemory>(targetCollection, existing.id, {
                importance: Math.max(existing.importance, clamp(importance, 1, 10)),
                confidence: Math.max(existing.confidence, confidence),
                reinforcementCount: (existing.reinforcementCount ?? 1) + 1,
                lastSeenAt: now,
                expiresAt: calculateExpiry(Math.max(existing.importance, importance), Math.max(existing.confidence, confidence), options.ttlDays),
            });

            await safeAudit({
                requestId: existing.id,
                phase: 'memory-store',
                operation: 'reinforce-memory',
                agentId: role,
                domain,
                namespace,
                riskLevel: verificationStatus === 'quarantined' ? 'high' : 'low',
                riskScore: verificationStatus === 'quarantined' ? 70 : 10,
                fingerprint: checksum,
                summary: `Reinforced memory: ${normalizedTopic}`,
                decision: verificationStatus === 'quarantined' ? 'quarantine' : 'allow',
                confidence,
            });
            return;
        }

        const memory: AgentMemory = {
            id: memoryId,
            userId,
            namespace,
            domain,
            agentRole: role,
            topic: normalizedTopic,
            context: normalizedContext,
            importance: clamp(importance, 1, 10),
            confidence,
            checksum,
            sourceType,
            sourceId: options.sourceId,
            sourceVersion: options.sourceVersion,
            provenanceIds: Array.from(new Set(options.provenanceIds ?? [])),
            verificationStatus,
            reinforcementCount: 1,
            timestamp: now,
            lastSeenAt: now,
            expiresAt: calculateExpiry(importance, confidence, options.ttlDays),
        };

        await jsonDb.insertRecord(targetCollection, memory);
        await safeAudit({
            requestId: memory.id,
            phase: verificationStatus === 'quarantined' ? 'quarantine' : 'memory-store',
            operation: 'store-memory',
            agentId: role,
            domain,
            namespace,
            riskLevel: verificationStatus === 'quarantined' ? 'high' : 'low',
            riskScore: verificationStatus === 'quarantined' ? 70 : 10,
            fingerprint: checksum,
            summary: `${verificationStatus}: ${normalizedTopic}`,
            decision: verificationStatus === 'quarantined' ? 'quarantine' : 'allow',
            confidence,
        });
    } catch (error) {
        // Memory persistence must never make the primary AI request fail.
        console.warn('[AI MEMORY] Store skipped:', error instanceof Error ? error.message : error);
    }
}

export async function retrieveMemories(
    userId: string,
    query: string,
    limit = 5,
    options: RetrieveMemoryOptions = {},
): Promise<string> {
    const normalizedQuery = sanitizeAiText(query, 2_000);
    if (!userId || !normalizedQuery) return '';

    try {
        const domain = options.domain ?? classifyAiDomain(normalizedQuery);
        const role = options.role ?? DEFAULT_ROLE;
        const namespace = options.namespace ?? buildMemoryNamespace(role, domain, userId);
        const minimumConfidence = clamp(options.minimumConfidence ?? 0.65, 0, 1);
        const now = Date.now();
        const memories = IS_DATABASE_OFFLINE
            ? await jsonDb.getCollection<AgentMemory>(ACTIVE_COLLECTION)
            : await loadOnlineMemories(['PROPOSED', 'APPROVED']);

        const relevant = memories
            .filter(memory => memory.userId === userId)
            .filter(memory => memory.namespace === namespace)
            .filter(memory => memory.verificationStatus === 'verified' || (options.includeProvisional !== false && memory.verificationStatus === 'provisional'))
            .filter(memory => memory.confidence >= minimumConfidence)
            .filter(memory => !memory.expiresAt || new Date(memory.expiresAt).getTime() > now)
            .map(memory => {
                const text = `${memory.topic}\n${memory.context}`;
                const lexical = lexicalSimilarity(normalizedQuery, text);
                const entity = entityOverlap(normalizedQuery, text);
                const ageDays = Math.max(0, (now - new Date(memory.lastSeenAt || memory.timestamp).getTime()) / 86_400_000);
                const recency = Math.exp(-ageDays / 120);
                const score = lexical * 0.45 + entity * 0.25 + memory.confidence * 0.18 + (memory.importance / 10) * 0.08 + recency * 0.04;
                return { memory, score };
            })
            .filter(item => item.score >= 0.2)
            .sort((a, b) => b.score - a.score || b.memory.confidence - a.memory.confidence)
            .slice(0, clamp(limit, 1, 10));

        await safeAudit({
            requestId: `memread-${sha256(`${namespace}:${normalizedQuery}`).slice(0, 20)}`,
            phase: 'memory-retrieve',
            operation: 'retrieve-memory',
            agentId: role,
            domain,
            namespace,
            riskLevel: 'low',
            riskScore: 5,
            fingerprint: sha256(`${namespace}:${normalizedQuery}`),
            summary: `Retrieved ${relevant.length} governed memories`,
            decision: 'allow',
            confidence: relevant.length > 0 ? relevant[0].memory.confidence : 0,
        });

        if (relevant.length === 0) return '';

        return '\n[NGỮ CẢNH QUÁ KHỨ ĐÃ QUA MEMORY FIREWALL]:\n' + relevant
            .map(({ memory, score }) => {
                const status = memory.verificationStatus === 'verified' ? 'ĐÃ XÁC MINH' : 'TẠM THỜI';
                return `- [${status}; confidence=${memory.confidence.toFixed(2)}; relevance=${score.toFixed(2)}; source=${memory.sourceType}] ${memory.topic}: ${memory.context}`;
            })
            .join('\n');
    } catch (error) {
        console.warn('[AI MEMORY] Retrieval skipped:', error instanceof Error ? error.message : error);
        return '';
    }
}

export async function reviewMemory(
    memoryId: string,
    decision: 'approve' | 'quarantine' | 'supersede',
): Promise<AgentMemory | null> {
    if (!IS_DATABASE_OFFLINE) {
        const log = await aiDb.aiVerificationLog.findFirst({
            where: {
                targetType: ONLINE_MEMORY_TARGET_TYPE,
                OR: [
                    { id: memoryId },
                    { targetId: memoryId },
                ],
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!log) return null;

        const memory = memoryFromVerificationLog(log);
        if (!memory) return null;
        const now = new Date().toISOString();

        if (decision === 'approve') {
            const approved: AgentMemory = {
                ...memory,
                confidence: Math.max(memory.confidence, 0.95),
                sourceType: 'human-approved',
                verificationStatus: 'verified',
                lastSeenAt: now,
            };
            await aiDb.aiVerificationLog.update({
                where: { id: log.id },
                data: {
                    aiProposedContent: approved as any,
                    finalContent: approved as any,
                    status: 'APPROVED',
                    riskLevel: 'LOW',
                    verifiedBy: 'AI_GOVERNANCE_ADMIN',
                    verifiedAt: new Date(),
                },
            });
            return approved;
        }

        const verificationStatus: MemoryVerificationStatus = decision === 'supersede' ? 'superseded' : 'quarantined';
        const updated: AgentMemory = {
            ...memory,
            verificationStatus,
            lastSeenAt: now,
        };
        await aiDb.aiVerificationLog.update({
            where: { id: log.id },
            data: {
                aiProposedContent: updated as any,
                status: 'REJECTED',
                riskLevel: decision === 'quarantine' ? 'HIGH' : 'MEDIUM',
                verifiedBy: 'AI_GOVERNANCE_ADMIN',
                verifiedAt: new Date(),
            },
        });
        return updated;
    }

    const active = await jsonDb.findFirst<AgentMemory>(ACTIVE_COLLECTION, memory => memory.id === memoryId);
    const quarantined = active ? null : await jsonDb.findFirst<AgentMemory>(QUARANTINE_COLLECTION, memory => memory.id === memoryId);
    const memory = active ?? quarantined;
    if (!memory) return null;

    const fromCollection = active ? ACTIVE_COLLECTION : QUARANTINE_COLLECTION;
    if (decision === 'approve') {
        const approved: AgentMemory = {
            ...memory,
            confidence: Math.max(memory.confidence, 0.95),
            sourceType: 'human-approved',
            verificationStatus: 'verified',
            lastSeenAt: new Date().toISOString(),
        };
        if (fromCollection === QUARANTINE_COLLECTION) {
            await jsonDb.insertRecord(ACTIVE_COLLECTION, approved);
            await jsonDb.delete<AgentMemory>(QUARANTINE_COLLECTION, item => item.id === memoryId);
        } else {
            await jsonDb.updateRecord(ACTIVE_COLLECTION, memoryId, approved);
        }
        return approved;
    }

    const status: MemoryVerificationStatus = decision === 'supersede' ? 'superseded' : 'quarantined';
    const updated = { ...memory, verificationStatus: status, lastSeenAt: new Date().toISOString() };
    if (fromCollection === ACTIVE_COLLECTION && status === 'quarantined') {
        await jsonDb.insertRecord(QUARANTINE_COLLECTION, updated);
        await jsonDb.delete<AgentMemory>(ACTIVE_COLLECTION, item => item.id === memoryId);
        return updated;
    }
    return jsonDb.updateRecord(fromCollection, memoryId, updated);
}

export async function getQuarantinedMemories(limit = 100): Promise<AgentMemory[]> {
    if (!IS_DATABASE_OFFLINE) {
        const logs = await aiDb.aiVerificationLog.findMany({
            where: {
                targetType: ONLINE_MEMORY_TARGET_TYPE,
                status: 'REJECTED',
            },
            orderBy: { createdAt: 'desc' },
            take: clamp(limit, 1, 500),
            select: {
                status: true,
                aiProposedContent: true,
                finalContent: true,
            },
        });
        return logs
            .map(memoryFromVerificationLog)
            .filter((memory): memory is AgentMemory => memory !== null);
    }

    const records = await jsonDb.getCollection<AgentMemory>(QUARANTINE_COLLECTION);
    return [...records].reverse().slice(0, clamp(limit, 1, 500));
}

export async function getMemoryHealth() {
    const active = IS_DATABASE_OFFLINE
        ? await jsonDb.getCollection<AgentMemory>(ACTIVE_COLLECTION)
        : await loadOnlineMemories(['PROPOSED', 'APPROVED']);
    const quarantine = IS_DATABASE_OFFLINE
        ? await jsonDb.getCollection<AgentMemory>(QUARANTINE_COLLECTION)
        : await loadOnlineMemories(['REJECTED']);
    const now = Date.now();

    return {
        store: IS_DATABASE_OFFLINE ? 'json-memory-firewall' : 'postgres-ai-verification-log',
        active: active.filter(item => item.verificationStatus !== 'superseded').length,
        verified: active.filter(item => item.verificationStatus === 'verified').length,
        provisional: active.filter(item => item.verificationStatus === 'provisional').length,
        quarantined: quarantine.filter(item => item.verificationStatus === 'quarantined').length,
        superseded: quarantine.filter(item => item.verificationStatus === 'superseded').length,
        expired: active.filter(item => item.expiresAt && new Date(item.expiresAt).getTime() <= now).length,
        duplicateReinforcements: active.reduce((sum, item) => sum + Math.max(0, (item.reinforcementCount ?? 1) - 1), 0),
    };
}

/**
 * Integrate governed memory into an AI request without changing existing callers.
 */
export async function askAIWithMemory(prompt: string, userId: string, options: any = {}) {
    const pastContext = await retrieveMemories(userId, prompt.substring(0, 200), 5, {
        role: options.role,
        domain: options.domain,
        namespace: options.namespace,
    });
    const fullPrompt = pastContext ? `${pastContext}\n\n[CÂU HỎI HIỆN TẠI]: ${prompt}` : prompt;

    const { askAI } = await import('./ai/manager');
    return askAI(fullPrompt, { ...options, userId });
}
