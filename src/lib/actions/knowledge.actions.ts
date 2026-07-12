'use server';

import { revalidatePath } from 'next/cache';
import { requirePermission, requireAuth } from '@/lib/auth-enforcer';
import {
    getInternalKnowledgeSnippets,
    createInternalKnowledgeSnippet,
    deleteInternalKnowledgeSnippet
} from '../services/ai/context';
import { parsePdf, parseDocx, parseXlsx } from '@/lib/services/file-parser';
import { checkRateLimit } from '@/lib/rate-limit';

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const MAX_TEXT_BYTES = 2 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(['pdf', 'docx', 'xlsx', 'xls', 'txt', 'md']);

export async function pushKnowledgeSnippet(content: string, source = 'Local/Upload', tags: string[] = []) {
    const user = await requirePermission('knowledge:submit');
    if (!checkRateLimit(`knowledge-submit:${user.id}`, 20, 60_000)) throw new Error('Too many knowledge submissions');
    if (!content.trim()) throw new Error('Content cannot be empty');
    const snippet = await createInternalKnowledgeSnippet(content, source, tags);
    revalidatePath('/ai-lab');
    return snippet;
}

export async function getKnowledgeSnippets() {
    await requireAuth();
    return getInternalKnowledgeSnippets();
}

export async function deleteKnowledgeSnippet(id: string) {
    await requirePermission('knowledge:delete');
    await deleteInternalKnowledgeSnippet(id);
    revalidatePath('/ai-lab');
    return { success: true };
}

export async function processFileKnowledge(formData: FormData) {
    const user = await requirePermission('knowledge:submit');
    if (!checkRateLimit(`knowledge-upload:${user.id}`, 10, 60_000)) throw new Error('Too many uploads');

    const file = formData.get('file') as File | null;
    if (!file) throw new Error('No file provided');
    if (file.size > MAX_UPLOAD_BYTES) throw new Error('File is too large. Maximum size is 15MB.');

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.has(extension)) throw new Error(`Unsupported file format: .${extension}`);
    if ((extension === 'txt' || extension === 'md') && file.size > MAX_TEXT_BYTES) {
        throw new Error('Text file is too large. Maximum size is 2MB.');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let content = '';
    if (extension === 'pdf') content = await parsePdf(buffer);
    else if (extension === 'docx') content = await parseDocx(buffer);
    else if (extension === 'xlsx' || extension === 'xls') content = await parseXlsx(buffer);
    else content = buffer.toString('utf-8');

    if (!content.trim()) throw new Error('Could not extract any text from file.');
    const snippet = await createInternalKnowledgeSnippet(content, `File: ${file.name.slice(0, 255)}`, [extension]);
    revalidatePath('/ai-lab');
    return { success: true, id: snippet.id };
}
