import { jsonDb } from '../db/json-db';

/**
 * TENCENTDB AGENT MEMORY (LOCAL EDITION)
 * Giúp AI không bị "quên" ngữ cảnh và học hỏi từ các tương tác trước.
 */

export interface AgentMemory {
    id: string;
    userId: string;
    topic: string;
    context: string;
    importance: number; // 1-10
    timestamp: string;
}

export async function storeExperience(userId: string, topic: string, context: string, importance = 5): Promise<void> {
    const memory: AgentMemory = {
        id: `mem-${Date.now()}`,
        userId,
        topic,
        context,
        importance,
        timestamp: new Date().toISOString()
    };
    
    await jsonDb.insertRecord('ai_longterm_memory', memory);
}

export async function retrieveMemories(userId: string, query: string, limit = 5): Promise<string> {
    const memories = await jsonDb.getCollection<AgentMemory>('ai_longterm_memory');
    
    // Simple relevance check (in production this would use vector search)
    const relevant = memories
        .filter(m => m.userId === userId && (m.topic.includes(query) || m.context.includes(query)))
        .sort((a, b) => b.importance - a.importance)
        .slice(0, limit);

    if (relevant.length === 0) return "";

    return "\n[NGỮ CẢNH QUÁ KHỨ]:\n" + relevant.map(m => `- ${m.topic}: ${m.context}`).join('\n');
}

/**
 * Tích hợp vào luồng hỏi AI
 */
export async function askAIWithMemory(prompt: string, userId: string, options: any = {}) {
    const pastContext = await retrieveMemories(userId, prompt.substring(0, 50));
    const fullPrompt = pastContext ? `${pastContext}\n\n[CÂU HỎI HIỆN TẠI]: ${prompt}` : prompt;
    
    const { askAI } = await import('./ai');
    return askAI(fullPrompt, { ...options, userId });
}
