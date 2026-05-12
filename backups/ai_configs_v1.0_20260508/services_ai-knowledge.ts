import { readDb } from '../json-db-service';
import { getTrustGraphClient } from './trustgraph-client';

/**
 * AI KNOWLEDGE SERVICE — Pure JSON (No Prisma)
 */

export async function getGroundedContext(recordIds: string[], types: ('dnf' | 'hazard' | 'inspection' | 'standard' | 'snippet')[], agentId?: string) {
    let context = "# KNOWLEDGE SOURCES FOR HURC1 CRM (OFFLINE MODE)\n\n";
    const db = readDb();

    if (agentId) {
        const agent = (db.agents || []).find((a: any) => a.id === agentId);
        if (agent) {
            context += `## AI AGENT ROLE: ${agent.name} (${agent.subsystem})\n`;
            context += `Constraint/Persona: ${agent.systemPrompt}\n\n`;
        }
    }

    if (types.includes('dnf')) {
        const dnfs = (db.dnfs || []).filter((d: any) => recordIds.includes(d.id));
        if (dnfs.length > 0) {
            context += "## FAILURE REPORTS (DNF)\n";
            dnfs.forEach((dnf: any) => {
                context += `### Report ID: ${dnf.id}\n`;
                context += `- Status: ${dnf.status}\n`;
                context += `- Location: ${dnf.locationOfFailure}\n`;
                context += `- Description: ${dnf.descriptionOfFailure}\n`;
                context += `- Resolution: ${dnf.resolutionDetails || 'Pending'}\n\n`;
            });
        }
    }

    if (types.includes('hazard')) {
        const hazards = (db.hazards || []).filter((h: any) => recordIds.includes(h.id));
        if (hazards.length > 0) {
            context += "## SAFETY HAZARDS\n";
            hazards.forEach((hazard: any) => {
                context += `### Hazard ID: ${hazard.id}\n`;
                context += `- Status: ${hazard.status}\n`;
                context += `- Description: ${hazard.description}\n`;
                context += `- Risk Level: ${hazard.riskLevelId}\n\n`;
            });
        }
    }

    if (types.includes('snippet')) {
        const snippets = (db.knowledgeSnippets || []).filter((s: any) => recordIds.includes(s.id));
        if (snippets.length > 0) {
            context += "## CUSTOM KNOWLEDGE SNIPPETS\n";
            snippets.forEach((snippet: any) => {
                context += `### Snippet ID: ${snippet.id}\n`;
                context += `- Content: ${snippet.content}\n\n`;
            });
        }
    }

    return context;
}

export async function syncToTrustGraph(options: any = {}) {
    console.log("[AI KNOWLEDGE] TrustGraph sync is disabled in pure JSON mode.");
    return { synced: 0, errors: 0, skipped: 0 };
}

export async function semanticKnowledgeSearch(query: string, options: any = {}) {
    console.log("[AI KNOWLEDGE] Semantic search falls back to keyword match in pure JSON mode.");
    return [];
}

export async function getRelatedEntities(query: string, options: any = {}) {
    return [];
}
