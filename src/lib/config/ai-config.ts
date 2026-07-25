/**
 * AI configuration and controlled feature flags.
 */

export const AI_CONFIG = {
  VERSION: 'v1.1.0',

  SOVEREIGNTY: {
    LOCAL_ONLY: true,
    ALLOW_PUBLIC_AI: false,
    ALLOW_RUNTIME_MODEL_DOWNLOAD: false,
    REQUIRE_MODEL_ALLOWLIST: true,
  },

  EXPERIMENTAL_MODE: process.env.NEXT_PUBLIC_AI_EXPERIMENTAL_MODE === 'true',

  YOLO: {
    STABLE_MODEL: 'yolov8n',
    EXPERIMENTAL_MODEL: 'yolov8_metro_v1',
    ENDPOINT: process.env.YOLO_ENDPOINT || 'http://yolo-service:5005/detect',
  },

  LLM: {
    STABLE_MODEL: 'nemotron-3-ultra',
    GRANITE_DENSE: 'granite3-dense:8b',
    EXPERIMENTAL_MODEL: process.env.NEXT_PUBLIC_LLM_EXPERIMENTAL_MODEL
      || 'chiennv/Orthrus-Qwen3-8B',
    ENDPOINT: process.env.LLM_ENDPOINT || 'http://ollama:11434/v1/chat/completions',
  },

  VOICE: {
    ENABLED: process.env.NEXT_PUBLIC_VOICE_ENABLED === 'true',
  },
} as const;

export function getActiveYoloModel(): string {
  return AI_CONFIG.EXPERIMENTAL_MODE
    ? AI_CONFIG.YOLO.EXPERIMENTAL_MODEL
    : AI_CONFIG.YOLO.STABLE_MODEL;
}

export function getActiveLLMModel(): string {
  return AI_CONFIG.EXPERIMENTAL_MODE
    ? AI_CONFIG.LLM.EXPERIMENTAL_MODEL
    : AI_CONFIG.LLM.STABLE_MODEL;
}
