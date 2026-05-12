import { getOpsDbProvider, getAiDbProvider } from '../lib/services/db-wrapper';
import { askAI } from '../lib/services/ai/manager';
import * as fs from 'fs';
import * as path from 'path';

async function runComprehensiveAudit() {
  console.log('🔍 STARTING COMPREHENSIVE LOGIC AUDIT...');
  const report: any = {
    database: { status: 'PENDING', checks: [] },
    ai: { status: 'PENDING', checks: [] },
    integrity: { status: 'PENDING', checks: [] }
  };

  try {
    // 1. DATABASE ROUTING CHECK
    console.log('\n--- 1. Checking Database Routing ---');
    const isOffline = process.env.IS_DATABASE_OFFLINE === 'true';
    const ops = getOpsDbProvider();
    
    report.database.checks.push({
        name: 'Provider Alignment',
        expected: isOffline ? 'JsonProvider' : 'PrismaProvider',
        actual: ops.constructor.name,
        pass: (isOffline && ops.constructor.name === 'JsonProvider') || (!isOffline && ops.constructor.name === 'PrismaProvider')
    });

    // 2. AI RESILIENCE CHAIN CHECK
    console.log('\n--- 2. Checking AI Resilience Chain ---');
    try {
        // Test basic AI call (should at least return a string or warning)
        const aiResponse = await askAI("Test connection", { forceBackend: 'gemini' });
        report.ai.checks.push({
            name: 'Cloud AI Availability',
            status: aiResponse ? 'SUCCESS' : 'FAILED',
            pass: !!aiResponse
        });
    } catch (e: any) {
        report.ai.checks.push({
            name: 'Cloud AI Availability',
            status: 'ERROR',
            message: e.message,
            pass: false
        });
    }

    // 3. STORAGE NAMING CONSISTENCY (SNAKE_CASE)
    console.log('\n--- 3. Checking Storage Naming Consistency ---');
    const dbPath = path.join(process.cwd(), 'db.json');
    if (fs.existsSync(dbPath)) {
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        const legacyKeys = Object.keys(db).filter(key => /[A-Z]/.test(key));
        report.integrity.checks.push({
            name: 'No CamelCase in Storage',
            foundLegacyKeys: legacyKeys,
            pass: legacyKeys.length === 0
        });
    }

    // FINAL SUMMARY
    console.log('\n--- AUDIT SUMMARY ---');
    console.log(JSON.stringify(report, null, 2));

  } catch (err: any) {
    console.error('❌ Audit crashed:', err.message);
  }
}

runComprehensiveAudit();
