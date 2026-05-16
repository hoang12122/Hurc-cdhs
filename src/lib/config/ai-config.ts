/**
 * AI Configuration & Feature Flags
 * Thiết lập cơ chế kiểm soát phiên bản và nâng cấp AI an toàn
 */

export const AI_CONFIG = {
    // Phiên bản hiện tại của AI
    VERSION: 'v1.0.0',
    
    // Feature Flag: Bật chế độ thử nghiệm AI (chạy model mới)
    // Có thể cấu hình qua biến môi trường hoặc UI
    EXPERIMENTAL_MODE: process.env.NEXT_PUBLIC_AI_EXPERIMENTAL_MODE === 'true' || false,

    // Cấu hình module Nhận diện hình ảnh (YOLO)
    YOLO: {
        STABLE_MODEL: 'yolov8n',
        EXPERIMENTAL_MODEL: 'yolov8_metro_v1', // Model sẽ được fine-tune để nhận diện nứt/rỉ sét
        ENDPOINT: process.env.YOLO_ENDPOINT || process.env.NEXT_PUBLIC_YOLO_ENDPOINT || 'http://yolo-service:5005/detect',
    },

    // Cấu hình module Xử lý ngôn ngữ (Gemma/RAG)
    LLM: {
        STABLE_MODEL: 'google/gemma-4-E2B-it',
        EXPERIMENTAL_MODEL: 'google/gemma-4-E4B-it',
        ENDPOINT: process.env.LLM_ENDPOINT || process.env.NEXT_PUBLIC_LLM_ENDPOINT || 'http://ollama:11434/v1/chat/completions',
    },
    
    // Cấu hình module Nhận diện giọng nói (Speech-to-Text)
    VOICE: {
        ENABLED: process.env.NEXT_PUBLIC_VOICE_ENABLED === 'true' || false,
    }
};

/**
 * Trả về model YOLO đang được active
 */
export function getActiveYoloModel() {
    return AI_CONFIG.EXPERIMENTAL_MODE ? AI_CONFIG.YOLO.EXPERIMENTAL_MODEL : AI_CONFIG.YOLO.STABLE_MODEL;
}

/**
 * Trả về model LLM đang được active
 */
export function getActiveLLMModel() {
    return AI_CONFIG.EXPERIMENTAL_MODE ? AI_CONFIG.LLM.EXPERIMENTAL_MODEL : AI_CONFIG.LLM.STABLE_MODEL;
}
