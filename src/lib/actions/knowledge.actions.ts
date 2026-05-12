'use server';

import { revalidatePath } from 'next/cache';
import { requirePermission, requireAuth } from '@/lib/auth-enforcer';
import { 
    getInternalKnowledgeSnippets, 
    createInternalKnowledgeSnippet, 
    deleteInternalKnowledgeSnippet 
} from '../services/ai/context';
import { parsePdf, parseDocx, parseXlsx } from '@/lib/services/file-parser';

export async function pushKnowledgeSnippet(content: string, source: string = 'Local/Upload', tags: string[] = []) {
    await requirePermission('ai:use');
    if (!content.trim()) throw new Error("Content cannot be empty");
    const snippet = await createInternalKnowledgeSnippet(content, source, tags);
    revalidatePath('/ai-lab');
    return snippet;
}

export async function getKnowledgeSnippets() {
    await requireAuth();
    return await getInternalKnowledgeSnippets();
}

export async function deleteKnowledgeSnippet(id: string) {
    await requirePermission('ai:use');
    await deleteInternalKnowledgeSnippet(id);
    revalidatePath('/ai-lab');
    return { success: true };
}

export async function processFileKnowledge(formData: FormData) {
    await requirePermission('ai:use');
    const file = formData.get('file') as File;
    if (!file) throw new Error("No file provided");

    const buffer = Buffer.from(await file.arrayBuffer());
    let content = "";
    const extension = file.name.split('.').pop()?.toLowerCase();

    // Try TrustGraph Document Load for supported binary formats
    if (extension === 'pdf') {
        content = await parsePdf(buffer);
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

    const snippet = await createInternalKnowledgeSnippet(content, `File: ${file.name}`, [extension || 'file']);
    revalidatePath('/ai-lab');
    return { success: true, id: snippet.id };
}
