import { getOpsDbProvider } from '../lib/services/db-wrapper';
import * as fs from 'fs';
import * as path from 'path';

/**
 * TASK 8.2: Kiểm thử Mock Layer
 */
async function runMockLayerTest() {
  console.log('--- STARTING TASK 8.2: MOCK LAYER TEST ---');
  
  // 1. Cưỡng bức chế độ Offline
  process.env.DATABASE_OFFLINE = 'true';
  (process.env as any).NODE_ENV = 'development';

  const mockProvider = getOpsDbProvider();
  const testId = `MOCK-TEST-${Date.now()}`;
  
  const results = {
    providerType: false,
    writeMock: false,
    readMock: false,
    filePersistence: false
  };

  try {
    // 1. Kiểm tra loại Provider
    console.log('[Test] Checking Provider type...');
    if (mockProvider.constructor.name === 'JsonProvider') {
      console.log('[Success] Mock Provider (JsonProvider) correctly initialized.');
      results.providerType = true;
    }

    // 2. Kiểm tra ghi dữ liệu Mock
    console.log('[Test] Writing Mock data...');
    const newItem = await mockProvider.create('DnfDocument', {
      id: testId,
      title: 'Mock Test Document',
      status: 'DRAFT'
    });
    if (newItem && (newItem as any).id === testId) {
      console.log('[Success] Mock data written successfully.');
      results.writeMock = true;
    }

    // 3. Kiểm tra đọc dữ liệu Mock
    console.log('[Test] Reading Mock data...');
    const foundItem = await mockProvider.findUnique<any>('DnfDocument', testId);
    if (foundItem && foundItem.title === 'Mock Test Document') {
      console.log('[Success] Mock data retrieved correctly.');
      results.readMock = true;
    }

    // 4. Kiểm tra sự tồn tại của tệp db.json
    console.log('[Test] Verifying File Persistence...');
    const dbPath = path.join(process.cwd(), 'db.json');
    if (fs.existsSync(dbPath)) {
      const content = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (content.dnf_documents && content.dnf_documents.some((i: any) => i.id === testId)) {
        console.log('[Success] db.json contains the mock data.');
        results.filePersistence = true;
      }
    }

  } catch (err) {
    console.error('[Critical] Mock Layer Test failed', err);
  }

  console.log('\n--- FINAL RESULTS TASK 8.2 ---');
  console.table(results);
  
  if (Object.values(results).every(v => v === true)) {
    console.log('✅ TASK 8.2 PASSED SUCCESSFULLY');
  } else {
    console.log('❌ TASK 8.2 FAILED SOME TESTS');
  }
}

runMockLayerTest().catch(console.error);
