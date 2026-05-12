import { opsDbProvider, aiDbProvider } from './db-wrapper';

/**
 * PHASE 9 - TASK 9.8: Predictive Maintenance Service
 * Handles data normalization and feature engineering for ML models.
 */
export interface AssetFeatures {
  assetId: string;
  mtbf: number;         // Mean Time Between Failures (hours)
  mttr: number;         // Mean Time To Repair (hours)
  failureCount30d: number;
  currentRiskScore: number;
  ageInDays: number;
  lastMaintenanceDays: number;
}

export class PredictiveMaintenanceService {
  /**
   * Prepare Feature Vector for a specific Asset
   */
  static async prepareFeatures(assetId: string): Promise<AssetFeatures> {
    console.log(`[PredictiveAI] Preparing features for Asset: ${assetId}`);

    // 1. Lấy lịch sử DNF từ OpsDb
    const dnfs = await opsDbProvider.findMany<any>('DnfDocument', {
      locationOfFailure: assetId,
      deletedAt: null
    });

    // 2. Tính toán MTBF (Giả định đơn giản dựa trên khoảng cách giữa các bản ghi)
    let mtbf = 0;
    if (dnfs.length >= 2) {
      const sortedDnfs = dnfs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      const totalGap = new Date(sortedDnfs[sortedDnfs.length - 1].createdAt).getTime() - new Date(sortedDnfs[0].createdAt).getTime();
      mtbf = (totalGap / (dnfs.length - 1)) / (1000 * 60 * 60); // Convert to hours
    }

    // 3. Tính toán MTTR (Giả định dựa trên thời gian từ lúc tạo đến lúc đóng DNF)
    // Tạm thời để giá trị mặc định nếu dữ liệu chưa đủ
    const mttr = 4.5; 

    // 4. Lấy Risk Score hiện tại từ TrustGraph
    const nodes = await aiDbProvider.findMany<any>('TrustGraphNode', {
      sourceId: assetId
    });
    const node = nodes.length > 0 ? nodes[0] : null;

    return {
      assetId,
      mtbf: Math.round(mtbf),
      mttr,
      failureCount30d: dnfs.filter(d => new Date(d.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
      currentRiskScore: node?.riskScore || 0,
      ageInDays: 365, // Giả định tuổi đời thiết bị
      lastMaintenanceDays: 15 // Giả định từ lần bảo trì cuối
    };
  }

  /**
   * Normalize data for ML (Scaling to 0-1 range)
   */
  static normalize(features: AssetFeatures) {
    return {
      x1_reliability: Math.min(1, features.mtbf / 1000),
      x2_severity: Math.min(1, features.currentRiskScore / 100),
      x3_urgency: Math.min(1, features.failureCount30d / 5)
    };
  }

  /**
   * Predict Failure Probability (Task 9.9)
   * Uses a Weighted Probabilistic Model as Baseline.
   */
  static predictFailure(features: AssetFeatures) {
    const norm = this.normalize(features);
    
    // Trọng số mô hình dự báo
    const weights = {
      reliability: 0.3, // MTBF càng thấp rủi ro càng cao
      severity: 0.4,    // Risk Score hiện tại
      urgency: 0.3      // Tần suất lỗi gần đây
    };

    // Tính toán xác suất (0-1)
    // Càng gần 1 thì khả năng hỏng hóc trong 7 ngày tới càng cao
    const probability = (
      ((1 - norm.x1_reliability) * weights.reliability) + 
      (norm.x2_severity * weights.severity) + 
      (norm.x3_urgency * weights.urgency)
    );

    return {
      probability: Math.min(1, Math.max(0, probability)),
      confidence: 0.75, // Độ tin cậy của mô hình Baseline
      predictionWindow: '7 Days',
      recommendation: probability > 0.7 ? 'IMMEDIATE_INSPECTION' : 
                      probability > 0.4 ? 'SCHEDULED_MAINTENANCE' : 'MONITOR'
    };
  }

  /**
   * Create a Predictive Alert in Database (Task 9.10)
   */
  static async createAlert(features: AssetFeatures) {
    const prediction = this.predictFailure(features);
    
    // Chỉ tạo cảnh báo nếu xác suất hỏng hóc đáng kể (> 40%)
    if (prediction.probability >= 0.4) {
      const alert = await (aiDbProvider as any).create('PredictiveAlert', {
        targetId: features.assetId,
        probability: prediction.probability,
        recommendation: prediction.recommendation,
        reasoning: {
          mtbf: features.mtbf,
          riskScore: features.currentRiskScore,
          recentFailures: features.failureCount30d,
          confidence: prediction.confidence
        },
        status: 'NEW'
      });

      console.log(`⚠️ Predictive ALERT created for ${features.assetId}: Prob ${(prediction.probability * 100).toFixed(1)}%`);
      return alert;
    }
    return null;
  }

  /**
   * Confirm an alert by an Engineer
   */
  static async confirmAlert(alertId: string, reviewerId: string) {
    await (aiDbProvider as any).update('PredictiveAlert', 
      { id: alertId }, 
      { status: 'CONFIRMED', reviewedBy: reviewerId, updatedAt: new Date() }
    );
    console.log(`✅ Alert ${alertId} CONFIRMED by ${reviewerId}.`);
  }

  /**
   * Ignore an alert (Requires reason)
   */
  static async ignoreAlert(alertId: string, reviewerId: string) {
    await (aiDbProvider as any).update('PredictiveAlert', 
      { id: alertId }, 
      { status: 'IGNORED', reviewedBy: reviewerId, updatedAt: new Date() }
    );
    console.log(`🚫 Alert ${alertId} IGNORED by ${reviewerId}.`);
  }
}
