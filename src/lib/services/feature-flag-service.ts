/**
 * PHASE 11.0 - FEATURE FLAGS SYSTEM
 * Quản lý bật/tắt các tính năng AI & UI mới.
 */
export const AI_FEATURE_FLAGS = {
  RISK_SCORE_VISIBLE: true,      // Mức 1: Ưu tiên cao
  AI_SIDEBAR: true,             // Mức 1
  PREDICTIVE_MAINTENANCE: true,  // Mức 2: Trung hạn
  QUICK_ACTIONS: true,          // Mức 2
  AI_CHAT_ASSISTANT: true,      // Mức 2
  FULL_GLASSMORPHISM: false,    // Mức 3: Dài hạn (Đang thử nghiệm)
};

export class FeatureFlagService {
  static isEnabled(featureName: keyof typeof AI_FEATURE_FLAGS): boolean {
    // Trong thực tế, giá trị này có thể lấy từ Env hoặc Database
    return AI_FEATURE_FLAGS[featureName] ?? false;
  }

  static getActiveFeatures() {
    return Object.entries(AI_FEATURE_FLAGS)
      .filter(([_, enabled]) => enabled)
      .map(([name]) => name);
  }
}
