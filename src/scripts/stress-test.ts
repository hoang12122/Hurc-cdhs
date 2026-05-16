import { readRawDb } from '../lib/db/json-db';

/**
 * STRESS TEST SIMULATOR (HURC1 VALIDATION)
 * Simulates high load to test Snapshot Caching performance.
 */

async function runStressTest() {
    console.log("=== HURC1 STRESS TEST SIMULATOR ===");
    
    const startTime = Date.now();
    const iterations = 1000;
    
    console.log(`[STRESS] Simulating ${iterations} rapid read operations...`);
    
    // Test Read Performance (Caching)
    for (let i = 0; i < iterations; i++) {
        await readRawDb();
    }
    
    const readTime = Date.now() - startTime;
    console.log(`[STRESS] Read Test Completed: ${readTime}ms (Avg: ${(readTime/iterations).toFixed(2)}ms/op)`);
    
    if (readTime < 500) {
        console.log("✅ Performance: EXCELLENT (Cache working effectively)");
    } else {
        console.warn("⚠️ Performance: SUBOPTIMAL (Disk I/O might be high)");
    }

    console.log("=== STRESS TEST COMPLETED ===");
}

runStressTest().catch(console.error);
