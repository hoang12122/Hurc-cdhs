import { AIRiskLevel } from "../services/ai-verification-service";

export interface AISafetyRule {
    actionType: string;
    riskLevel: AIRiskLevel;
    requiredRoles: string[];
    description: string;
}

export const AI_SAFETY_RULES: AISafetyRule[] = [
    {
        actionType: "DNF_DESCRIPTION_SUGGESTION",
        riskLevel: "LOW",
        requiredRoles: ["FIELD_ENGINEER", "TECH_OFFICER", "MANAGER"],
        description: "AI gợi ý tóm tắt nội dung sự cố."
    },
    {
        actionType: "ROOT_CAUSE_ANALYSIS",
        riskLevel: "MEDIUM",
        requiredRoles: ["TECH_OFFICER", "MANAGER"],
        description: "AI phân tích nguyên nhân sự cố kỹ thuật."
    },
    {
        actionType: "SPARE_PART_RECOMMENDATION",
        riskLevel: "MEDIUM",
        requiredRoles: ["TECH_OFFICER", "MAINTENANCE_LEADER"],
        description: "AI đề xuất thay thế vật tư phụ tùng."
    },
    {
        actionType: "SEVERITY_ASSESSMENT",
        riskLevel: "HIGH",
        requiredRoles: ["MANAGER", "MAINTENANCE_LEADER"],
        description: "AI đánh giá mức độ nghiêm trọng của sự cố."
    },
    {
        actionType: "STOP_EQUIPMENT_PROPOSAL",
        riskLevel: "CRITICAL",
        requiredRoles: ["MANAGER", "DIRECTOR"],
        description: "AI đề xuất dừng vận hành thiết bị để đảm bảo an toàn."
    },
    {
        actionType: "CLOSE_HAZARD_DNF",
        riskLevel: "HIGH",
        requiredRoles: ["MANAGER", "ADMIN"],
        description: "AI đề xuất đóng/hoàn tất hồ sơ sự cố."
    }
];

export function getSafetyRule(actionType: string): AISafetyRule | undefined {
    return AI_SAFETY_RULES.find(rule => rule.actionType === actionType);
}
