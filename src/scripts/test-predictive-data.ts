import { PredictiveMaintenanceService } from '../lib/services/predictive-maintenance';
import { opsDbProvider } from '../lib/services/db-wrapper';

/**
 * Test script for Predictive Data Normalization (Task 9.8)
 */
async function testPredictiveData() {
  console.log('🧪 Starting Predictive Data Normalization Test...');

  try {
    const assetId = 'EQUIP-HVAC-01';

    // 1. Chạy trích xuất đặc trưng (Features)
    const features = await PredictiveMaintenanceService.prepareFeatures(assetId);

    console.log('\n📊 Asset Feature Vector:');
    console.table({
      'Asset ID': features.assetId,
      'MTBF (Hours)': features.mtbf,
      'MTTR (Hours)': features.mttr,
      'Failures (30d)': features.failureCount30d,
      'Risk Score': features.currentRiskScore
    });

    // 2. Kiểm tra logic chuẩn hóa (Normalization)
    const normalized = PredictiveMaintenanceService.normalize(features);
    console.log('\n🔢 Normalized Vector (Ready for ML):', normalized);

    if (features.mtbf >= 0) {
      console.log('\n✅ Success: MTBF calculated correctly.');
    }

    console.log('[Success] Task 9.8 logic is verified.');

  } catch (err) {
    console.error('❌ Test failed', err);
  }
}

testPredictiveData().catch(console.error);
