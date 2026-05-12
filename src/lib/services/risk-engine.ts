/**
 * PHASE 9 - TASK 9.1: Risk Propagation Engine
 * Risk Engine Service for calculating risk scores across entities.
 */

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM_LOW = 'MEDIUM_LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface RiskScoreResult {
  score: number; // 0 - 100
  level: RiskLevel;
  factors: {
    factor: string;
    impact: number;
    description: string;
  }[];
  timestamp: Date;
}

export const RISK_WEIGHTS = {
  SEVERITY: 0.4,       // Mức độ nghiêm trọng của lỗi
  FREQUENCY: 0.3,      // Tần suất lỗi lặp lại
  EQUIPMENT_AGE: 0.1,  // Tuổi đời thiết bị
  MAINTENANCE_GAP: 0.2 // Khoảng cách từ lần bảo trì cuối
};

export const PROPAGATION_FACTORS: Record<string, number> = {
  'PART_OF': 0.8,        // Linh kiện hỏng -> Thiết bị rủi ro rất cao
  'CONNECTED_TO': 0.5,   // Hệ thống liên quan hỏng -> Ảnh hưởng trung bình
  'MAINTAINED_BY': 0.3,  // Đội bảo trì kém -> Ảnh hưởng nhẹ đến các máy khác
  'LOCATED_AT': 0.2,     // Khu vực có sự cố -> Ảnh hưởng thấp đến toàn khu vực
  'DEFAULT': 0.1
};

export class RiskEngine {
  /**
   * Determine Risk Level based on score
   */
  static getRiskLevel(score: number): RiskLevel {
    if (score <= 20) return RiskLevel.LOW;
    if (score <= 40) return RiskLevel.MEDIUM_LOW;
    if (score <= 60) return RiskLevel.MEDIUM;
    if (score <= 80) return RiskLevel.HIGH;
    return RiskLevel.CRITICAL;
  }

  /**
   * Calculate Risk Score for an Equipment
   * Formula: Score = (S * Ws) + (F * Wf) + (A * Wa) + (M * Wm)
   */
  static calculateEquipmentRisk(data: {
    avgSeverity: number;     // 0-100
    failureFrequency: number; // 0-100 (normalized rate)
    ageFactor: number;       // 0-100
    maintenanceGapFactor: number; // 0-100
  }): RiskScoreResult {
    const score = Math.min(100, Math.max(0,
      (data.avgSeverity * RISK_WEIGHTS.SEVERITY) +
      (data.failureFrequency * RISK_WEIGHTS.FREQUENCY) +
      (data.ageFactor * RISK_WEIGHTS.EQUIPMENT_AGE) +
      (data.maintenanceGapFactor * RISK_WEIGHTS.MAINTENANCE_GAP)
    ));

    const factors = [
      { factor: 'Severity', impact: data.avgSeverity * RISK_WEIGHTS.SEVERITY, description: 'Impact of past failure severity' },
      { factor: 'Frequency', impact: data.failureFrequency * RISK_WEIGHTS.FREQUENCY, description: 'Rate of recurring failures' },
      { factor: 'Age', impact: data.ageFactor * RISK_WEIGHTS.EQUIPMENT_AGE, description: 'Equipment lifecycle stage' },
      { factor: 'Maintenance', impact: data.maintenanceGapFactor * RISK_WEIGHTS.MAINTENANCE_GAP, description: 'Time since last preventive maintenance' }
    ];

    return {
      score: Math.round(score),
      level: this.getRiskLevel(score),
      factors,
      timestamp: new Date()
    };
  }

  /**
   * Calculate Propagated Risk from a source node
   * Score = SourceScore * RelationFactor * (Decay ^ Distance)
   */
  static calculatePropagatedScore(
    sourceScore: number, 
    relationType: string, 
    distance: number
  ): number {
    const factor = PROPAGATION_FACTORS[relationType] || PROPAGATION_FACTORS.DEFAULT;
    const decay = 0.7; // Rủi ro giảm 30% sau mỗi cấp độ lan truyền
    
    return Math.round(sourceScore * factor * Math.pow(decay, distance - 1));
  }
}
