import { aiDb, opsDb, IS_DATABASE_OFFLINE } from '../../prisma';
import { jsonDb } from '../../db/json-db';

/**
 * AI Context Service — Fetches CRM data for AI Ingestion
 * Refactored for Phase 4: Standardized Keys & Atomic JSON operations.
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
            return await aiDb.aiKnowledgeSnippet.create({
                data: { content, source, tags }
            });
        } catch (e) { /* fallback */ }
    }

    const snippet = {
        id: `snippet-${Date.now()}`,
        content,
        source,
        tags,
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
                createdAt: new Date().toISOString() 
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
