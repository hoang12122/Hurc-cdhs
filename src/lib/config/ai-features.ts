/**
 * AI FEATURE FLAGS CONFIGURATION
 * 
 * Quản lý việc bật/tắt các tính năng AI mới nâng cấp.
 * Đảm bảo tiêu chí: "Tính năng mới có thể bật/tắt bằng cấu hình" để không ảnh hưởng luồng nghiệp vụ cũ (Task 7.1).
 */

export const AI_FEATURES = {
    // Phase 1 & 2: Core Vision & RAG
    ENABLE_YOLO_VISION: true,
    ENABLE_DOCUMENT_RAG: true,
    
    // Phase 3: Predictive Maintenance
    ENABLE_PREDICTIVE_MAINTENANCE: true,
    ENABLE_RELIABILITY_DASHBOARD: true,

    // Phase 4 & 6: Graph & Gemma Prompts
    ENABLE_KNOWLEDGE_GRAPH_RECOMMENDATION: true,
    ENABLE_GEMMA_FRACAS_PROMPTS: true,

    // Phase 5: Edge AI (Offline)
    ENABLE_EDGE_AI_OFFLINE_MODE: true,

    // Priority: Voice to text
    ENABLE_VOICE_TO_TEXT_INPUT: true,
};

export function isFeatureEnabled(featureName: keyof typeof AI_FEATURES): boolean {
    return AI_FEATURES[featureName] ?? false;
}
