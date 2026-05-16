import { AI_CONFIG } from "../../config/ai-config";
import { askAI as askBaseAI, askWithRAG as askBaseRAG, agentChat as baseAgentChat, askPersonalized as baseAskPersonalized } from "../ai";

/**
 * CENTRAL AI MANAGER (LOCAL-ONLY EDITION)
 * Proxy to the hardened AI service to ensure system-wide data sovereignty.
 */

export type ExpertRole = 'ASSET_MANAGER' | 'TECHNICAL_ANALYST' | 'EXECUTIVE_BRAIN' | 'RAG_SPECIALIST';

export async function askAI(prompt: string, options: any = {}) {
    console.log(`[AI MANAGER] Routing request to Local-Only core...`);
    return askBaseAI(prompt, options);
}

export async function agentChat(question: string, options: any = {}) {
    return baseAgentChat(question, options);
}

export async function askWithRAG(query: string, options: any = {}) {
    return askBaseRAG(query, options);
}

export async function askPersonalized(query: string, options: any = {}) {
    return baseAskPersonalized(query, options);
}

export async function getAIHealthStatus() {
    const { getAIHealthStatus: getBaseHealth } = await import('../ai');
    return getBaseHealth();
}

export async function analyzeWithGraph(query: string, options: any = {}) {
    const { analyzeWithGraph: baseGraph } = await import('../ai');
    return baseGraph(query, options);
}

export async function detectObjects(imageBuffer: Buffer, options: any = {}) {
    const { detectObjects: baseDetect } = await import('../ai');
    return baseDetect(imageBuffer);
}

export async function askVisionAI(prompt: string, image: { data: string, mimeType: string }, options: any = {}) {
    const { askVisionAI: baseVision } = await import('../ai');
    return baseVision(prompt, image, options);
}

export async function askHuggingFace(prompt: string, options: any = {}) {
    // Local-Only Fallback for HuggingFace requests
    console.log(`[AI MANAGER] HuggingFace request detected. Routing to Local Expert...`);
    return askAI(prompt, options);
}

export async function detectObjectsHF(imageBuffer: Buffer, options: any = {}) {
    // Proxy HF detection to Local YOLO for better reliability in Local-Only mode
    return detectObjects(imageBuffer, options);
}
