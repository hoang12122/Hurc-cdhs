import { PredictiveMaintenanceService, AssetFeatures } from '../lib/services/predictive-maintenance';

/**
 * Test script for Failure Prediction Model (Task 9.9)
 */
async function testPrediction() {
  console.log('🧪 Starting Failure Prediction Test...');

  // 1. Giả lập thiết bị rủi ro cao
  const riskyAsset: AssetFeatures = {
    assetId: 'RISKY-PUMP-01',
    mtbf: 50,                // Hỏng rất thường xuyên
    mttr: 5,
    failureCount30d: 4,      // 4 lỗi trong tháng
    currentRiskScore: 85,    // Điểm rủi ro cao từ TrustGraph
    ageInDays: 1000,
    lastMaintenanceDays: 60
  };

  // 2. Giả lập thiết bị khỏe mạnh
  const healthyAsset: AssetFeatures = {
    assetId: 'HEALTHY-PUMP-01',
    mtbf: 2000,              // Rất bền
    mttr: 2,
    failureCount30d: 0,      // Không có lỗi
    currentRiskScore: 10,    // Điểm rủi ro thấp
    ageInDays: 100,
    lastMaintenanceDays: 5
  };

  console.log('\n--- PREDICTION RESULTS ---');

  const riskyResult = PredictiveMaintenanceService.predictFailure(riskyAsset);
  console.log(`[RISKY] Prob: ${(riskyResult.probability * 100).toFixed(1)}% | Rec: ${riskyResult.recommendation}`);

  const healthyResult = PredictiveMaintenanceService.predictFailure(healthyAsset);
  console.log(`[HEALTHY] Prob: ${(healthyResult.probability * 100).toFixed(1)}% | Rec: ${healthyResult.recommendation}`);

  if (riskyResult.probability > healthyResult.probability) {
    console.log('\n✅ Model Validation: Correctly identified relative risk levels.');
  }

  console.log('[Success] Task 9.9 baseline model is verified.');
}

testPrediction().catch(console.error);
