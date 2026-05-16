import { opsDb, authDb } from '../prisma';

import { jsonDb } from '../db/json-db';

export interface StrategicScorecard {
    timestamp: string;
    metrics: {
        operations: {
            productivityIndex: number;    // DNF Resolved / Total Labor Hours
            utilizationRate: number;      // Active Equipment Time / Total
            costRatio: number;            // Actual Cost / Budgeted Cost
        };
        humanCapital: {
            retentionRate: number;        // Active Technicians / Total (monthly)
            laborProductivity: number;    // Work orders completed / FTE
        };
        quality: {
            serviceRecoveryRate: number;  // Resolved Failures / Total Failures
            healthScore: number;          // Weighted composite of safety/uptime
        };
        safety: {
            hazardMitigationRate: number; // Closed Hazards / Total Hazards
            criticalFailureRisk: number;  // Probabilistic score
        };
    };
    insights: string[]; // AI-generated actionable advice
}

/**
 * PHASE 1: Calculation Engine
 */

export async function calculateStrategicScorecard(): Promise<StrategicScorecard> {
    const isOffline = process.env.IS_DATABASE_OFFLINE === 'true';
    
    // 1. Thu thập dữ liệu thô
    const dnfs = await (isOffline ? jsonDb.getCollection<any>('dnf_documents') : opsDb.dnfDocument.findMany());
    const inspections = await (isOffline ? jsonDb.getCollection<any>('inspections') : opsDb.inspectionDetail.findMany());
    const correctiveActions = await (isOffline ? jsonDb.getCollection<any>('corrective_actions') : opsDb.correctiveAction.findMany());
    const users = await (isOffline ? jsonDb.getCollection<any>('users') : authDb.user.findMany());
    const hazards = await (isOffline ? jsonDb.getCollection<any>('hazards') : opsDb.hazardRecord.findMany());

    // 2. Tính toán Năng suất (Productivity)
    const resolvedDnfs = dnfs.filter((d: any) => d.status === 'Đóng' || d.status === 'Hoàn thành').length;
    // Task aggregation: kết hợp DNF, Kiểm tra, Hành động khắc phục
    const totalTasksCount = dnfs.length + inspections.length + correctiveActions.length;
    const productivityIndex = totalTasksCount > 0 ? (resolvedDnfs / totalTasksCount) * 100 : 0;

    // 3. Tính toán Tỉ lệ giữ chân (Retention)
    const activeUsers = users.filter((u: any) => u.status === 'active').length;
    const retentionRate = users.length > 0 ? (activeUsers / users.length) * 100 : 100;

    // 4. Tính toán Tỉ lệ phục hồi (Service Recovery Rate)
    const serviceRecoveryRate = dnfs.length > 0 ? (resolvedDnfs / dnfs.length) * 100 : 100;

    // 5. Tỉ lệ xử lý mối nguy (Hazard Mitigation)
    const closedHazards = hazards.filter((h: any) => h.status === 'Đóng' || h.status === 'Đã xử lý' || h.status === 'Phản hồi').length;
    const hazardMitigationRate = hazards.length > 0 ? (closedHazards / hazards.length) * 100 : 100;

    // 6. Tính toán Health Score (Chỉ số sức khỏe tổng hợp)
    const healthScore = (serviceRecoveryRate * 0.4) + (hazardMitigationRate * 0.4) + (retentionRate * 0.2);

    return {
        timestamp: new Date().toISOString(),
        metrics: {
            operations: {
                productivityIndex: Math.round(productivityIndex * 10) / 10,
                utilizationRate: 85.5, // Placeholder - cần telemetry dữ liệu máy móc
                costRatio: 0.92,       // Placeholder - cần module tài chính
            },
            humanCapital: {
                retentionRate: Math.round(retentionRate * 10) / 10,
                laborProductivity: Math.round((totalTasksCount / (activeUsers || 1)) * 10) / 10,
            },
            quality: {
                serviceRecoveryRate: Math.round(serviceRecoveryRate * 10) / 10,
                healthScore: Math.round(healthScore * 10) / 10,
            },
            safety: {
                hazardMitigationRate: Math.round(hazardMitigationRate * 10) / 10,
                criticalFailureRisk: hazards.filter((h: any) => h.severity === 'I').length > 0 ? 0.8 : 0.2,
            }
        },
        insights: []
    };
}

/**
 * PHASE 2: AI Integration (Gemma-4)
 */
export async function generateCEOInsights(scorecard: StrategicScorecard): Promise<string[]> {
    const { askAI } = await import('./ai');
    
    const prompt = `Bạn là Strategic AI Advisor của CEO hệ thống đường sắt HURC1. 
    Dựa trên các chỉ số KPI sau:
    - Năng suất: ${scorecard.metrics.operations.productivityIndex}
    - Sức khỏe hệ thống: ${scorecard.metrics.quality.healthScore}
    - Tỉ lệ xử lý mối nguy: ${scorecard.metrics.safety.hazardMitigationRate}
    - Rủi ro lỗi nghiêm trọng: ${scorecard.metrics.safety.criticalFailureRisk}
    
    Hãy đưa ra 3 lời khuyên chiến lược ngắn gọn, dứt khoát theo phong cách CEO Brain.`;

    try {
        const result = await askAI(prompt, { systemPrompt: "Bạn là bộ não chiến lược của CEO. Hãy phân tích dữ liệu và ra quyết định." });
        return result.split('\n').filter(line => line.trim().length > 0);
    } catch (e) {
        return ["AI Insight currently offline. Check local infrastructure."];
    }
}
