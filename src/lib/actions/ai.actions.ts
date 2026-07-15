'use server';

import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import util from 'util';
import { askAI, askWithRAG, agentChat, askPersonalized, analyzeWithGraph, askVisionAI, detectObjectsHF } from '@/lib/services/ai/manager';
import { DEFAULT_AI_MODEL } from '@/lib/constants';
import { getGroundedContext, syncToTrustGraph, getRelatedEntities, semanticKnowledgeSearch } from '@/lib/services/ai/knowledge';
import { internalLogSystemEvent as logSystemEvent } from '../services/log-service';
import { getInternalSystemState as getSystemState } from '../services/system-service';
import { checkRateLimit } from '@/lib/rate-limit';
import { requirePermission, requireAuth } from '@/lib/auth-enforcer';
import {
    getInternalAgents,
    createInternalAgent,
    getInternalSystemSnapshot,
    getInternalRecentDnfDocs,
    getInternalRecentHazardDocs
} from '../services/ai/context';

const execPromise = util.promisify(execFile);
const PYTHON_TIMEOUT_MS = 30_000;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_NOTEBOOKS = new Set(['lstm_training_demo.ipynb', 'rag_engine_demo.ipynb']);

function validateImage(file: File | null): string | null {
    if (!file) return 'No image provided';
    if (!IMAGE_TYPES.has(file.type)) return 'Unsupported image type';
    if (file.size > MAX_IMAGE_BYTES) return 'Image is too large. Maximum size is 8MB.';
    return null;
}

export async function analyzeTelemetryTrend(assetName: string, data: any) {
    await requirePermission('ai:use');
    return askAI(`Analyze telemetry for asset ${assetName}. Data: ${JSON.stringify(data)}`, {
        systemPrompt: 'You are a telemetry analysis expert. Provide brief insights.'
    });
}

export async function generateAiHint(context: string, prompt: string, model?: string) {
    const user = await requirePermission('ai:use');
    if (!checkRateLimit(`ai_assist:${user.id}:${context.slice(0, 80)}`, 10, 60_000)) {
        return 'Bạn đang yêu cầu quá nhanh. Vui lòng thử lại sau một lát.';
    }
    try {
        const state = await getSystemState();
        const result = await askAI(prompt, {
            model: model || state?.aiModelConfig || DEFAULT_AI_MODEL,
            systemPrompt: 'Bạn là một trợ lý ảo chuyên tư vấn về các lỗi kỹ thuật và quản lý bảo trì cho dự án đường sắt đô thị HURC1. Hãy trả lời ngắn gọn, chuyên nghiệp, bằng tiếng Việt.'
        });
        await logSystemEvent('AI_ASSISTANT_USED', 'INFO', `User ${user.id} used AI for context: ${context.slice(0, 30)}`);
        return result;
    } catch (e: any) {
        console.error('AI Error:', e);
        await logSystemEvent('AI_ASSISTANT_ERROR', 'ERROR', `AI request failed: ${e.message}`);
        return 'Hệ thống AI đang quá tải hoặc cấu hình không chính xác. Xin vui lòng thử lại sau.';
    }
}

export async function getExecutiveSummary(dnfs: any[], hazards: any[]) {
    await requirePermission('reports:view');
    try {
        const dataSummary = `Số lượng sự cố (DNF): ${dnfs.length}; Số lượng mối nguy: ${hazards.length}; Mới nhất: ${dnfs.slice(0, 3).map(d => d.descriptionOfFailure).join('; ')}`;
        const result = await askWithRAG(`Phân tích tổng quan tình hình Metro HURC1. ${dataSummary}. Viết báo cáo chiến lược ngắn gọn.`, {
            collection: 'hurc-general', forceIntent: 'graph_rag'
        });
        return result.response;
    } catch {
        return 'Không thể tổng hợp tri thức lúc này.';
    }
}

export async function generateStrategicExecutiveSummary() {
    await requirePermission('reports:view');
    try {
        const s = await getInternalSystemSnapshot();
        const result = await askWithRAG(`Dữ liệu thực tế: DNF mở ${s.activeDnfs}; DNF nghiêm trọng ${s.severeDnfs}; Hazard mở ${s.activeHazards}. Viết bản tóm tắt chiến lược kỹ thuật cho CEO/CTO.`, {
            forceIntent: 'agent', systemPrompt: 'Bạn là một CTO ảo chuyên gia về vận hành và bảo trì Metro.'
        });
        return result.response;
    } catch {
        return 'Không thể tổng hợp báo cáo chiến lược lúc này.';
    }
}

export async function predictiveInsights(_category?: string) {
    await requirePermission('ai:use');
    try {
        const [dnfs, hazards] = await Promise.all([getInternalRecentDnfDocs(), getInternalRecentHazardDocs()]);
        const data = JSON.stringify({
            dnfs: dnfs.map((d: any) => ({ desc: d.descriptionOfFailure, priority: d.priority })),
            hazards: hazards.map((h: any) => ({ desc: h.description, risk: h.riskLevelId }))
        });
        const result = await askWithRAG(`Phân tích xu hướng và dự báo rủi ro. DỮ LIỆU: ${data}`, { forceIntent: 'agent' });
        return { insights: result.response, source: result.source, error: null };
    } catch {
        return { insights: [], error: 'Không thể tạo dự báo lúc này.' };
    }
}

export async function predictEquipmentHealthLSTM(equipmentData: { age_days: number; dnf_count: number; criticality: string }) {
    await requirePermission('ai:use');
    try {
        const script = path.join(process.cwd(), 'src', 'lib', 'ai', 'lstm_advanced.py');
        const { stdout, stderr } = await execPromise('python', [script, JSON.stringify(equipmentData)], {
            timeout: PYTHON_TIMEOUT_MS, maxBuffer: 1024 * 1024
        });
        if (stderr) console.error('LSTM Script Stderr:', stderr);
        return { ...JSON.parse(stdout), error: null };
    } catch (e) {
        console.error('LSTM Execution Error:', e);
        return { error: 'Không thể chạy mô hình LSTM lúc này.', failure_probability: 0, health_score: 100, predicted_days_to_failure: 365 };
    }
}

export async function getAgents() { await requireAuth(); return getInternalAgents(); }
export async function createAgent(data: { name: string; subsystem: string; systemPrompt: string }) { await requirePermission('admin:system'); return createInternalAgent(data); }
export async function getDnfShortList() { await requireAuth(); return getInternalRecentDnfDocs(50); }
export async function getHazardShortList() { await requireAuth(); return getInternalRecentHazardDocs(50); }

export async function groundedQuery(recordIds: string[], types: any[], userQuery: string, agentId?: string) {
    await requirePermission('ai:use');
    try {
        const rag = await askWithRAG(userQuery, { systemPrompt: 'Bạn là một chuyên gia hỗ trợ kỹ thuật tại HURC1.' });
        if (rag.source !== 'gemini-fallback') return rag.response;
        const context = await getGroundedContext(recordIds, types, agentId);
        return askAI(userQuery, { systemPrompt: `Context: ${context}` });
    } catch { return 'Error'; }
}

export async function graphQuery(query: string, collection?: string) {
    await requirePermission('ai:use');
    const result = await analyzeWithGraph(query, { collection });
    const entities = await getRelatedEntities(query, { collection, limit: 10 });
    return { response: result.response, source: result.source, entities };
}
export async function personalizedQuery(query: string, history?: any[]) { const u = await requireAuth(); return askPersonalized(query, { userId: u.id, history }); }
export async function aiAgentChat(question: string, conversationState?: any, conversationHistory?: any[]) { await requireAuth(); return agentChat(question, { state: conversationState, history: conversationHistory, collection: 'hurc-general' }); }

export async function analyzeSafetyImage(formData: FormData) {
    await requirePermission('ai:use');
    try {
        const file = formData.get('image') as File | null;
        const validationError = validateImage(file);
        if (validationError) return { error: validationError, detections: [] };
        const buffer = Buffer.from(await file!.arrayBuffer());
        const detections = (await detectObjectsHF(buffer))?.detections || [];
        const detectionContext = detections.map((d: any) => `${d.label} (${Math.round((d.score || d.confidence) * 100)}%)`).join(', ');
        const reasoning = await askAI(`Phát hiện: [${detectionContext}]. Thực hiện Audit An toàn kỹ thuật và dự báo rủi ro khu vực thi công Metro.`, {
            role: 'TECHNICAL_ANALYST', groundingContext: `Detections: ${detectionContext}`
        });
        const parts = reasoning.split('\n\n');
        return { detections, summary: parts[0] || `Phát hiện ${detections.length} đối tượng.`, forecast: parts.slice(1).join('\n\n') || reasoning, error: null };
    } catch (e: any) {
        console.error('AI Vision Audit Error:', e);
        return { error: 'Lỗi xử lý AI Vision', detections: [] };
    }
}

export async function analyzeHazardImageOpen(formData: FormData) {
    await requirePermission('ai:use');
    try {
        const file = formData.get('image') as File | null;
        const validationError = validateImage(file);
        if (validationError) return { error: validationError };
        const base64 = Buffer.from(await file!.arrayBuffer()).toString('base64');
        const response = await askVisionAI('Phân tích mối nguy trong ảnh. Trả về JSON: description, cause, consequence, severityId, likelihoodId, suggestedActions.', { data: base64, mimeType: file!.type });
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) return { ...JSON.parse(jsonMatch[0]), error: null, rawResponse: response };
        return { error: null, rawResponse: response, description: response };
    } catch { return { error: 'Lỗi AI Vision', rawResponse: null }; }
}

export async function syncDataToTrustGraph(types?: any[]) { await requirePermission('admin:system'); return syncToTrustGraph({ types }); }
export async function getAIStatus() { await requireAuth(); return getSystemState(); }
export async function searchKnowledge(query: string, collection?: string) { await requireAuth(); return semanticKnowledgeSearch(query, { collection }); }
export async function generateSynthesis(recordIds: string[], types: any[]) { await requirePermission('ai:use'); const c = await getGroundedContext(recordIds, types); return askWithRAG('Synthesize data.', { systemPrompt: `Context: ${c}` }); }

export async function getMcpTools() { await requireAuth(); const { mcpService } = await import('../services/ai/mcp-service'); return mcpService.listTools(); }
export async function callMcpTool(name: string, args: any) { const user = await requirePermission('ai:use'); const { mcpService } = await import('../services/ai/mcp-service'); return mcpService.callTool(name, args, undefined, user.id); }
export async function getMcpTraces() { const user = await requireAuth(); const { mcpService } = await import('../services/ai/mcp-service'); return mcpService.getTraces(user.id); }
export async function clearMcpTraces() { await requirePermission('admin:system'); const { mcpService } = await import('../services/ai/mcp-service'); mcpService.clearTraces(); }

export async function logAiAction(action: string, details: string, level: any = 'INFO') {
    try { await requireAuth(); await logSystemEvent(action, level, details, 'ai'); }
    catch (e) { console.error('[AI-LOG-ERROR]', e); }
}

export async function askCopilot(query: string) {
    const user = await requirePermission('ai:use');
    if (!checkRateLimit(`maintenance_copilot:${user.id}`, 12, 60_000)) {
        return {
            answer: 'Bạn đang gửi yêu cầu quá nhanh. Vui lòng thử lại sau một lát.',
            confidence: 0,
            engine: 'Secure RAG Rate Guard',
            sources: [],
        };
    }

    try {
        const rag = await askWithRAG(query, {
            role: 'ASSET_MANAGER',
            collection: 'hurc-maintenance',
            forceIntent: 'document_rag',
            user: user.id,
            userId: user.id,
            systemPrompt: 'Bạn là trợ lý bảo trì HURC1. Chỉ trả lời từ dữ liệu kỹ thuật được truy xuất, có nguồn và trong phạm vi bảo trì được cấp phép.',
            maxEvidenceChars: 16_000,
            maxEvidenceItems: 10,
        });
        const acceptedEvidence = rag.security?.acceptedEvidence ?? 0;
        return {
            answer: rag.response,
            confidence: rag.security?.blocked ? 0 : Math.min(0.95, 0.55 + acceptedEvidence * 0.05),
            engine: 'NemoClaw/Nemotron + TrustGraph Secure RAG',
            sources: rag.sources ?? [],
            security: rag.security,
            governance: rag.governance,
        };
    } catch (secureError) {
        console.warn('Secure Maintenance RAG unavailable, trying offline fallback:', secureError);
    }

    try {
        const script = path.join(process.cwd(), 'src', 'lib', 'ai', 'rag_engine.py');
        const { stdout, stderr } = await execPromise('python', [script, JSON.stringify({ query })], {
            timeout: PYTHON_TIMEOUT_MS, maxBuffer: 2 * 1024 * 1024
        });
        if (stderr && !stdout) throw new Error('Offline RAG engine returned an error');
        const fallback = JSON.parse(stdout);
        return { ...fallback, engine: `${fallback.engine || 'Offline RAG'} (degraded fallback)` };
    } catch (error) {
        console.error('askCopilot failed:', error);
        return { answer: 'AI Engine Offline.', error: 'AI engine unavailable', confidence: 0, sources: [] };
    }
}

export async function readNotebookFile(filename: string) {
    await requirePermission('ai:use');
    if (!ALLOWED_NOTEBOOKS.has(filename)) throw new Error('Notebook is not allowed');
    try {
        const notebookRoot = path.resolve(process.cwd(), 'src', 'lib', 'ai', 'notebooks');
        const filePath = path.resolve(notebookRoot, filename);
        if (!filePath.startsWith(`${notebookRoot}${path.sep}`)) throw new Error('Invalid notebook path');
        return JSON.parse(await fs.readFile(filePath, 'utf-8'));
    } catch (error) {
        console.error('Failed to read notebook', error);
        return null;
    }
}
