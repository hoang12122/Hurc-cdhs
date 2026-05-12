import { opsDb, aiDb, IS_DATABASE_OFFLINE } from '../../prisma';
import { jsonDb } from '../../db/json-db';
import { getTrustGraphClient } from '../trustgraph-client';

/**
 * AI Knowledge Service — Context Grounding & Sync
 * Refactored for Phase 4: Standardized Keys & Atomic JSON operations.
 */

export async function getGroundedContext(recordIds: string[], types: ('dnf' | 'hazard' | 'inspection' | 'standard' | 'snippet')[], agentId?: string) {
    let context = "# KNOWLEDGE SOURCES FOR HURC1 CRM\n\n";

    if (agentId) {
        const agents = await jsonDb.getCollection<any>('ai_agents');
        const agent = agents.find((a: any) => a.id === agentId);
        if (agent) {
            context += `## AI AGENT ROLE: ${agent.name} (${agent.subsystem})\n`;
            context += `Constraint/Persona: ${agent.systemPrompt}\n\n`;
        }
    }

    if (types.includes('dnf')) {
        let dnfs: any[] = [];
        if (!IS_DATABASE_OFFLINE) {
            try {
                dnfs = await opsDb.dnfDocument.findMany({
                    where: { id: { in: recordIds } },
                    include: { correctiveActions: true }
                });
            } catch (e) { /* fallback */ }
        } 
        
        if (dnfs.length === 0) {
            const all = await jsonDb.getCollection<any>('dnf_documents');
            dnfs = all.filter((d: any) => recordIds.includes(d.id));
        }
        
        if (dnfs.length > 0) {
            context += "## FAILURE REPORTS (DNF)\n";
            dnfs.forEach((dnf: any) => {
                context += `### Report ID: ${dnf.id}\n`;
                context += `- Status: ${dnf.status}\n`;
                context += `- Description: ${dnf.descriptionOfFailure}\n`;
                context += `- Resolution: ${dnf.resolutionDetails || 'Pending'}\n\n`;
            });
        }
    }

    if (types.includes('hazard')) {
        let hazards: any[] = [];
        if (!IS_DATABASE_OFFLINE) {
            try {
                hazards = await opsDb.hazardRecord.findMany({ where: { id: { in: recordIds } } });
            } catch (e) { /* fallback */ }
        }
        
        if (hazards.length === 0) {
            const all = await jsonDb.getCollection<any>('hazards');
            hazards = all.filter((h: any) => recordIds.includes(h.id));
        }
        
        if (hazards.length > 0) {
            context += "## SAFETY HAZARDS\n";
            hazards.forEach((h: any) => {
                context += `### Hazard ID: ${h.id}\n- Status: ${h.status}\n- Description: ${h.description}\n\n`;
            });
        }
    }

    return context;
}

/**
 * Global Sync to TrustGraph (Suppressed in Offline)
 */
export async function syncToTrustGraph(options: {
    types?: ('dnf' | 'hazard' | 'inspection')[],
    limit?: number,
} = {}) {
    return { synced: 0, errors: 0, status: 'TRUSTGRAPH_SYNC_DISABLED_IN_OFFLINE_MODE' };
}

/**
 * Search across TrustGraph (Suppressed in Offline)
 */
export async function semanticKnowledgeSearch(query: string, options: {
    collection?: string,
    limit?: number,
} = {}): Promise<any[]> {
    const tg = getTrustGraphClient();
    try {
        if (!IS_DATABASE_OFFLINE && await tg.isAvailable()) {
            return await tg.documentEmbeddingsQuery(query, {
                collection: options.collection,
                limit: options.limit || 10,
            });
        }
    } catch (e) { /* ignore */ }
    return [];
}

export async function getRelatedEntities(query: string, options: {
    collection?: string,
    limit?: number,
} = {}): Promise<any[]> {
    const tg = getTrustGraphClient();
    try {
        if (!IS_DATABASE_OFFLINE && await tg.isAvailable()) {
            return await tg.graphEmbeddingsQuery({
                query,
                collection: options.collection,
                limit: options.limit || 20,
            });
        }
    } catch (e) { /* ignore */ }
    return [];
}
