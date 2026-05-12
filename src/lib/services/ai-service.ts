import { aiDb, opsDb, IS_DATABASE_OFFLINE } from '../prisma';
import { ingestDocument } from './ai';
import { jsonDb } from '../db/json-db';

/**
 * CORE LOGIC ONLY - NO 'use server'
 * Refactored for Phase 4: Standardized AI Operations & Atomic JSON storage.
 */

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
    if (!IS_DATABASE_OFFLINE) {
        try {
            const snippet = await aiDb.aiKnowledgeSnippet.create({
                data: {
                    content,
                    source,
                    tags
                }
            });

            // Auto-sync to TrustGraph (fire-and-forget)
            ingestDocument(content, `snippet-${snippet.id}`, { collection: 'hurc-knowledge' })
                .catch(err => console.warn('TrustGraph auto-sync failed:', err));

            return snippet;
        } catch (e) { /* fallback */ }
    }

    const record = {
        id: `snippet-${Date.now()}`,
        content,
        source,
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    return await jsonDb.insertRecord<any>('ai_knowledge_snippets', record);
}

export async function deleteInternalKnowledgeSnippet(id: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await aiDb.aiKnowledgeSnippet.delete({
                where: { id }
            });
        } catch (e) {}
    }
    return await jsonDb.delete('ai_knowledge_snippets', (s: any) => s.id === id);
}

// Agents
export async function getInternalAgents() {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await aiDb.aiAgent.findMany({
                orderBy: { name: 'asc' }
            });
        } catch (e) { /* fallback */ }
    }
    
    const agents = await jsonDb.getCollection<any>('ai_agents');
    if (agents.length === 0) {
        return [
            { 
                id: '1', 
                name: 'Trợ lý Báo cáo (Offline)', 
                subsystem: 'Tất cả', 
                systemPrompt: 'Hoạt động ở chế độ Offline', 
                aiModel: 'gemini-1.5-flash', 
                isDefault: true, 
                createdAt: new Date().toISOString(), 
                updatedAt: new Date().toISOString() 
            }
        ];
    }
    return agents;
}

export async function createInternalAgent(data: { name: string, subsystem: string, systemPrompt: string }) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await aiDb.aiAgent.create({ data });
        } catch (e) { /* fallback */ }
    }

    const agent = {
        ...data,
        id: `agent-${Date.now()}`,
        aiModel: 'gemini-1.5-flash',
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    return await jsonDb.insertRecord<any>('ai_agents', agent);
}

// System Snapshots for AI Synthesis
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
        console.warn("[AI-SERVICE] Snapshot failed, returning zero state.");
        return { activeDnfs: 0, severeDnfs: 0, activeHazards: 0 };
    }
}

// Data Lists for AI Context
export async function getInternalRecentDnfDocs(limit: number = 30) {
    if (IS_DATABASE_OFFLINE) {
        const all = await jsonDb.getCollection<any>('dnf_documents');
        return [...all].reverse().slice(0, limit);
    }

    try {
        return await opsDb.dnfDocument.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    } catch (e) {
        return [];
    }
}

export async function getInternalRecentHazardDocs(limit: number = 30) {
    if (IS_DATABASE_OFFLINE) {
        const all = await jsonDb.getCollection<any>('hazards');
        return [...all].reverse().slice(0, limit);
    }

    try {
        return await opsDb.hazardRecord.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    } catch (e) {
        return [];
    }
}
