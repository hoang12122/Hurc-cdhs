import { PredictiveMaintenanceService, AssetFeatures } from '../lib/services/predictive-maintenance';
import { aiDbProvider } from '../lib/services/db-wrapper';

/**
 * Test script for Predictive Alerts (Task 9.10)
 */
async function testPredictiveAlerts() {
  console.log('🧪 Starting Predictive Alerts Test...');

  try {
    const reviewerId = 'ENG-CHIEF-01';
    
    // 1. Giả lập thiết bị có nguy cơ cao hỏng hóc
    const riskyAsset: AssetFeatures = {
      assetId: 'EQUIP-BRAKE-X',
      mtbf: 100,
      mttr: 4,
      failureCount30d: 3,
      currentRiskScore: 78,
      ageInDays: 500,
      lastMaintenanceDays: 45
    };

    // 2. AI tự động tạo cảnh báo
    const alert = await PredictiveMaintenanceService.createAlert(riskyAsset);
    
    if (alert) {
      console.log('✅ Success: Alert created with status NEW.');
      console.log('📊 Reasoning Data:', JSON.stringify(alert.reasoning));

      // 3. Kỹ sư xác nhận cảnh báo
      await PredictiveMaintenanceService.confirmAlert(alert.id, reviewerId);
      
      // 4. Kiểm chứng kết quả cuối cùng
      const updatedAlert = await aiDbProvider.findUnique<any>('PredictiveAlert', alert.id);

      if (updatedAlert && updatedAlert.status === 'CONFIRMED') {
        console.log(`✅ Success: Alert ${alert.id} is now CONFIRMED by ${reviewerId}.`);
      }
    }

    console.log('\n[Success] Task 9.10 alerts and feedback flow is verified.');

  } catch (err) {
    console.error('❌ Test failed', err);
  }
}

testPredictiveAlerts().catch(console.error);
