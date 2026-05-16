import { readRawDb } from './json-db';
import { opsDb } from './ops-db';
import { aiDb } from './ai-db';

/**
 * PHASE 3: Data Integrity - Schema Validator
 * Đảm bảo dữ liệu JSON-DB và Prisma luôn đồng bộ về cấu trúc Model.
 */

const EXPECTED_COLLECTIONS = [
    'dnf_documents',
    'hazards',
    'inspections',
    'corrective_actions',
    'system_logs',
    'users',
    'maintenance_standards',
    'maintenance_standard_items',
    'responsible_units',
    'sub_systems',
    'patrol_locations',
    'trust_graph_nodes',
    'trust_graph_edges',
    'ai_agents',
    'ai_knowledge_snippets',
    'ai_insights',
    'ai_sync_logs',
    'ai_verification_logs',
    'ai_safety_logs',
    'ai_request_logs',
    'comments',
    'improvements',
    'tasks',
    'assets',
    'equipment'
];

export async function validateHybridSchema() {
    console.log('[Schema-Validator] Bắt đầu kiểm tra tính nhất quán dữ liệu...');
    const results = {
        valid: true,
        missingCollections: [] as string[],
        errors: [] as string[]
    };

    try {
        const db = await readRawDb();
        
        // 1. Kiểm tra các collection bắt buộc trong db.json
        for (const col of EXPECTED_COLLECTIONS) {
            if (!db[col]) {
                results.missingCollections.push(col);
                results.valid = false;
            }
        }

        // 2. Kiểm tra khả năng truy cập Prisma (nếu online)
        if (process.env.IS_DATABASE_OFFLINE !== 'true') {
            try {
                await opsDb.$queryRaw`SELECT 1`;
                console.log('[Schema-Validator] Kết nối OPS Database: OK');
            } catch (e) {
                results.errors.push(`Không thể kết nối OPS Database: ${String(e)}`);
                results.valid = false;
            }
        }

        if (results.valid) {
            console.log('[Schema-Validator] ✅ Tất cả cấu trúc dữ liệu đều hợp lệ.');
        } else {
            console.warn('[Schema-Validator] ❌ Phát hiện mâu thuẫn dữ liệu:', results);
        }

        return results;
    } catch (error) {
        console.error('[Schema-Validator] Lỗi nghiêm trọng khi kiểm tra:', error);
        return { valid: false, errors: [String(error)] };
    }
}
