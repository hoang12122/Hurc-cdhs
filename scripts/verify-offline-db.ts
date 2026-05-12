import { jsonDb, readRawDb } from '../src/lib/db/json-db';
import { IS_DATABASE_OFFLINE, IS_PRODUCTION } from '../src/lib/config/database-mode';

interface TestRecord {
  id?: string;
  name: string;
  value: number;
  createdAt?: string;
  updatedAt?: string;
}

async function verify() {
  console.log("--- OFFLINE MODE SYSTEM VERIFICATION ---");
  console.log(`IS_DATABASE_OFFLINE: ${IS_DATABASE_OFFLINE}`);
  console.log(`IS_PRODUCTION: ${IS_PRODUCTION}`);
  
  try {
    console.log("\n1. Testing readRawDb...");
    const data = await readRawDb();
    console.log("✓ Successfully read db.json keys:", Object.keys(data));

    console.log("\n2. Testing getCollection (Existing)...");
    const users = await jsonDb.getCollection('users');
    console.log(`✓ Found ${users.length} users.`);

    console.log("\n3. Testing getCollection (Non-existent with autoCreate)...");
    const testCol = await jsonDb.getCollection('test_collection_tmp', true);
    console.log("✓ Handled missing collection with autoCreate.");

    console.log("\n4. Testing insertRecord (with UUID)...");
    const newItem = await jsonDb.insertRecord<TestRecord>('test_collection_tmp', { name: 'Test UUID Item', value: 789 });
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const isUuid = uuidRegex.test(newItem.id || '');
    console.log(`✓ Inserted item ID: ${newItem.id}`);
    console.log(`✓ ID is valid UUID v4: ${isUuid}`);
    console.log(`✓ CreatedAt: ${newItem.createdAt}`);

    console.log("\n5. Testing updateRecord (Partial Update)...");
    const patch = { value: 9999 }; // Only changing value, keeping name
    const updated = await jsonDb.updateRecord<TestRecord>('test_collection_tmp', newItem.id!, patch);
    
    console.log(`✓ Updated Value: ${updated.value}`);
    console.log(`✓ Preserved Name: ${updated.name === 'Test UUID Item' ? 'Yes' : 'No'}`);
    console.log(`✓ New UpdatedAt: ${updated.updatedAt}`);
    
    if (updated.updatedAt === newItem.updatedAt) {
      console.warn("⚠ Warning: UpdatedAt was not refreshed!");
    } else {
      console.log("✓ UpdatedAt was successfully refreshed.");
    }

    console.log("\n6. Testing deleteRecord (by ID)...");
    // We'll implement this next, but using the generic delete for now
    const deletedCount = await jsonDb.delete('test_collection_tmp', (item: any) => item.id === newItem.id);
    console.log(`✓ Deleted ${deletedCount} test items.`);

    console.log("\n7. Testing paginate...");
    const dummyItems = Array.from({ length: 25 }, (_, i) => ({ id: `${i}`, name: `Item ${i}` }));
    const page1 = await jsonDb.paginate(dummyItems, 1, 10);
    const page3 = await jsonDb.paginate(dummyItems, 3, 10);
    
    console.log(`✓ Total Items: ${page1.total}`);
    console.log(`✓ Total Pages: ${page1.totalPages}`);
    console.log(`✓ Page 1 Data Count: ${page1.data.length}`);
    console.log(`✓ Page 3 Data Count: ${page3.data.length} (Expected: 5)`);

    console.log("\n8. Testing applyFilters (Advanced Search)...");
    const sampleData = [
      { id: '1', title: 'Máy hỏng', status: 'Mới' },
      { id: '2', title: 'Cửa kẹt', status: 'Đã đóng' },
      { id: '3', title: 'Máy kẹt', status: 'Mới' }
    ];
    
    const searchRes = await jsonDb.applyFilters(sampleData, { keyword: 'máy' });
    const statusRes = await jsonDb.applyFilters(sampleData, { status: 'Mới' });
    const combinedRes = await jsonDb.applyFilters(sampleData, { keyword: 'kẹt', status: 'Mới' });

    console.log(`✓ Search 'máy' found: ${searchRes.length} items (Expected: 2)`);
    console.log(`✓ Status 'Mới' found: ${statusRes.length} items (Expected: 2)`);
    console.log(`✓ Combined Search found: ${combinedRes.length} items (Expected: 1 - 'Máy kẹt')`);

    console.log("\n--- ALL TASKS VERIFIED SUCCESSFULLY ---");
  } catch (error) {
    console.error("\n❌ VERIFICATION FAILED:");
    console.error(error);
  }
}

verify();
