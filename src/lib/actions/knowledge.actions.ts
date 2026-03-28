'use server';

import { aiDb } from '@/lib/prisma';
import { hasPermission } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { parsePdf, parseDocx, parseXlsx } from '@/lib/services/file-parser';
import { ingestDocument, ingestBinaryDocument } from '@/lib/services/ai';

export async function pushKnowledgeSnippet(content: string, source: string = 'Local/Upload', tags: string[] = []) {
    if (!await hasPermission('ai:use')) {
        throw new Error("Unauthorized");
    }

    if (!content.trim()) {
        throw new Error("Content cannot be empty");
    }

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

    revalidatePath('/ai-lab');
    return snippet;
}

export async function getKnowledgeSnippets() {
    if (!await hasPermission('ai:use')) return [];
    
    return await aiDb.aiKnowledgeSnippet.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
    });
}

export async function deleteKnowledgeSnippet(id: string) {
    if (!await hasPermission('ai:use')) throw new Error("Unauthorized");

    await aiDb.aiKnowledgeSnippet.delete({
        where: { id }
    });

    revalidatePath('/ai-lab');
    return { success: true };
}

export async function processFileKnowledge(formData: FormData) {
    if (!await hasPermission('ai:use')) throw new Error("Unauthorized");

    const file = formData.get('file') as File;
    if (!file) throw new Error("No file provided");

    const buffer = Buffer.from(await file.arrayBuffer());
    let content = "";
    const extension = file.name.split('.').pop()?.toLowerCase();

    try {
        // Try TrustGraph Document Load for supported binary formats
        if (extension === 'pdf') {
            const tgResult = await ingestBinaryDocument(buffer, `file-${Date.now()}-${file.name}`, {
                collection: 'hurc-knowledge',
            });
            
            if (tgResult.success) {
                // Also store locally for fallback
                content = await parsePdf(buffer);
            } else {
                content = await parsePdf(buffer);
            }
        } else if (extension === 'docx') {
            content = await parseDocx(buffer);
        } else if (extension === 'xlsx' || extension === 'xls') {
            content = await parseXlsx(buffer);
        } else if (extension === 'txt' || extension === 'md') {
            content = buffer.toString('utf-8');
        } else {
            throw new Error(`Unsupported file format: .${extension}`);
        }

        if (!content.trim()) throw new Error("Could not extract any text from file.");

        const snippet = await aiDb.aiKnowledgeSnippet.create({
            data: {
                content,
                source: `File: ${file.name}`,
                tags: [extension || 'file']
            }
        });

        // Auto-sync extracted text to TrustGraph
        ingestDocument(content, `file-snippet-${snippet.id}`, { collection: 'hurc-knowledge' })
            .catch(err => console.warn('TrustGraph file sync failed:', err));

        revalidatePath('/ai-lab');
        return { success: true, id: snippet.id };
    } catch (error: any) {
        console.error("File Ingestion Error:", error);
        throw new Error(error.message || "Failed to process file.");
    }
}
