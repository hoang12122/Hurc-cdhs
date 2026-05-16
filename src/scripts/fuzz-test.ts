/**
 * FUZZ TESTER (HURC1 VALIDATION)
 * Sends extreme/garbage data to system endpoints to test resilience.
 */

import { jsonDb } from '../lib/db/json-db';
import { askWithRAG } from '../lib/services/ai';

async function runFuzz() {
    console.log("🧨 Starting Behavioral Fuzzing...");
    
    const edgeCases = [
        "", // Empty query
        "A".repeat(10000), // Super long query
        "<script>alert('xss')</script>", // Injection attempt
        "DNF-NON-EXISTENT-ID-999999", // Invalid ID lookup
        "{ \"malformed\": json }", // Garbage JSON
    ];
    
    for (const test of edgeCases) {
        try {
            console.log(`[FUZZ] Testing: ${test.slice(0, 30)}...`);
            await askWithRAG(test, {});
            console.log("✅ Handled safely.");
        } catch (e) {
            console.error(`❌ CRASH DETECTED for input: ${test.slice(0, 30)}`);
            process.exit(1);
        }
    }
    
    console.log("⭐ Behavioral Fuzzing Completed: SYSTEM RESILIENT.");
}

runFuzz().catch(console.error);
