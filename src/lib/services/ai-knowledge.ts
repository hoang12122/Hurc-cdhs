import { opsDb, aiDb } from '@/lib/prisma';
import { getTrustGraphClient } from './trustgraph-client';
import { formatCrmDataForIngestion } from './ai-smart-router';

// ============ GROUNDED CONTEXT (Original + Enhanced) ============

export async function getGroundedContext(recordIds: string[], types: ('dnf' | 'hazard' | 'inspection' | 'standard' | 'snippet')[], agentId?: string) {
    let context = "# KNOWLEDGE SOURCES FOR HURC1 CRM\n\n";

    if (agentId) {
        const agent = await aiDb.aiAgent.findUnique({ where: { id: agentId } });
        if (agent) {
            context += `## AI AGENT ROLE: ${agent.name} (${agent.subsystem})\n`;
            context += `Constraint/Persona: ${agent.systemPrompt}\n\n`;
        }
    }

    if (types.includes('dnf')) {
        const dnfs = await opsDb.dnfDocument.findMany({
            where: { id: { in: recordIds } },
            include: { correctiveActions: true }
        });
        
        if (dnfs.length > 0) {
            context += "## FAILURE REPORTS (DNF)\n";
            dnfs.forEach((dnf: any) => {
                context += `### Report ID: ${dnf.id}\n`;
                context += `- Status: ${dnf.status}\n`;
                context += `- Location: ${dnf.locationOfFailure}\n`;
                context += `- Description: ${dnf.descriptionOfFailure}\n`;
                context += `- Impact: ${dnf.impactAssessment || 'N/A'}\n`;
                context += `- Resolution: ${dnf.resolutionDetails || 'Pending'}\n`;
                if (dnf.correctiveActions.length > 0) {
                    context += `- Corrective Actions:\n`;
                    dnf.correctiveActions.forEach((ca: any) => {
                        context += `  * [${ca.status}] ${ca.description} (Responsible: ${ca.responsiblePersonOrUnit})\n`;
                    });
                }
                context += "\n";
            });
        }
    }

    if (types.includes('hazard')) {
        const hazards = await opsDb.hazardRecord.findMany({
            where: { id: { in: recordIds } }
        });
        
        if (hazards.length > 0) {
            context += "## SAFETY HAZARDS\n";
            hazards.forEach((hazard: any) => {
                context += `### Hazard ID: ${hazard.id}\n`;
                context += `- Status: ${hazard.status}\n`;
                context += `- Description: ${hazard.description}\n`;
                context += `- Potential Consequence: ${hazard.potentialConsequence}\n`;
                context += `- Controls: ${hazard.currentControls}\n`;
                context += `- Risk Level: ${hazard.riskLevelId}\n\n`;
            });
        }
    }

    if (types.includes('inspection')) {
        const inspections = await opsDb.inspectionDetail.findMany({
            where: { id: { in: recordIds } }
        });
        
        if (inspections.length > 0) {
            context += "## INSPECTION REPORTS\n";
            inspections.forEach((insp: any) => {
                context += `### Inspection ID: ${insp.id}\n`;
                context += `- Title: ${insp.title}\n`;
                context += `- Status: ${insp.status}\n`;
                context += `- Inspector: ${insp.inspector}\n`;
                context += `- Notes: ${insp.generalNotes || 'None'}\n\n`;
            });
        }
    }
    if (types.includes('snippet')) {
        const snippets = await aiDb.aiKnowledgeSnippet.findMany({
            where: { id: { in: recordIds } }
        });
        
        if (snippets.length > 0) {
            context += "## CUSTOM KNOWLEDGE SNIPPETS (UPLOADED)\n";
            snippets.forEach((snippet: any) => {
                context += `### Snippet ID: ${snippet.id}\n`;
                context += `- Source: ${snippet.source}\n`;
                context += `- Content: ${snippet.content}\n\n`;
            });
        }
    }

    return context;
}

// ============ TRUSTGRAPH SYNC (NEW) ============

/**
 * Sync CRM data to TrustGraph knowledge base for semantic search & GraphRAG
 */
export async function syncToTrustGraph(options: {
    types?: ('dnf' | 'hazard' | 'inspection')[],
    limit?: number,
} = {}): Promise<{ synced: number; errors: number; skipped: number }> {
    const tg = getTrustGraphClient();
    
    if (!await tg.isAvailable()) {
        return { synced: 0, errors: 0, skipped: 0 };
    }

    const types = options.types || ['dnf', 'hazard', 'inspection'];
    const limit = options.limit || 100;
    let synced = 0;
    let errors = 0;

    // Sync DNF records
    if (types.includes('dnf')) {
        const dnfs = await opsDb.dnfDocument.findMany({
            include: { correctiveActions: true },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });

        for (const dnf of dnfs) {
            try {
                const content = formatCrmDataForIngestion('dnf', dnf);
                await tg.textLoad({
                    text: content,
                    id: `dnf-${dnf.id}`,
                    collection: 'hurc-dnf',
                });
                synced++;
            } catch (e) {
                errors++;
                console.error(`Failed to sync DNF ${dnf.id}:`, e);
            }
        }
    }

    // Sync Hazard records
    if (types.includes('hazard')) {
        const hazards = await opsDb.hazardRecord.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
        });

        for (const hazard of hazards) {
            try {
                const content = formatCrmDataForIngestion('hazard', hazard);
                await tg.textLoad({
                    text: content,
                    id: `hazard-${hazard.id}`,
                    collection: 'hurc-hazards',
                });
                synced++;
            } catch (e) {
                errors++;
                console.error(`Failed to sync Hazard ${hazard.id}:`, e);
            }
        }
    }

    // Sync Inspection records
    if (types.includes('inspection')) {
        const inspections = await opsDb.inspectionDetail.findMany({
            take: limit,
        });

        for (const insp of inspections) {
            try {
                const content = formatCrmDataForIngestion('inspection', insp);
                await tg.textLoad({
                    text: content,
                    id: `inspection-${insp.id}`,
                    collection: 'hurc-inspections',
                });
                synced++;
            } catch (e) {
                errors++;
                console.error(`Failed to sync Inspection ${insp.id}:`, e);
            }
        }
    }

    // Log sync result (only if schema has been migrated)
    try {
        await (aiDb as any).aiSyncLog?.create({
            data: {
                syncType: types.join(','),
                recordsSynced: synced,
                recordsFailed: errors,
                status: errors === 0 ? 'SUCCESS' : 'PARTIAL',
            }
        });
    } catch {
        // Schema might not be migrated yet, skip logging
        console.log('AiSyncLog not available, skipping sync log');
    }

    return { synced, errors, skipped: 0 };
}

// ============ SEMANTIC SEARCH (NEW) ============

/**
 * Search across TrustGraph knowledge base using semantic similarity
 */
export async function semanticKnowledgeSearch(query: string, options: {
    collection?: string,
    limit?: number,
} = {}): Promise<any[]> {
    const tg = getTrustGraphClient();

    try {
        if (await tg.isAvailable()) {
            const results = await tg.documentEmbeddingsQuery(query, {
                collection: options.collection,
                limit: options.limit || 10,
            });
            return Array.isArray(results) ? results : [];
        }
    } catch (error) {
        console.warn("Semantic search failed:", error);
    }

    return [];
}

// ============ RELATED ENTITIES (NEW) ============

/**
 * Find entities related to a query via knowledge graph embeddings
 */
export async function getRelatedEntities(query: string, options: {
    collection?: string,
    limit?: number,
} = {}): Promise<any[]> {
    const tg = getTrustGraphClient();

    try {
        if (await tg.isAvailable()) {
            const results = await tg.graphEmbeddingsQuery({
                query,
                collection: options.collection,
                limit: options.limit || 20,
            });
            return Array.isArray(results) ? results : [];
        }
    } catch (error) {
        console.warn("Related entities search failed:", error);
    }

    return [];
}
