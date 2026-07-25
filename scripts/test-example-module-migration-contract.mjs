import assert from 'node:assert/strict';
import fs from 'node:fs';

const registry = JSON.parse(fs.readFileSync('architecture/migration-registry.json', 'utf8'));
const moduleRecord = registry.modules.find((item) => item.id === 'example-module');

assert.ok(moduleRecord, 'example-module must exist in migration registry');
assert.equal(moduleRecord.state, 'isolated', 'pilot must remain isolated before shadow traffic');
assert.equal(moduleRecord.publicContract, 'backend/contracts/example-module/v1.ts');
assert.ok(moduleRecord.featureFlag, 'feature flag is required');
assert.ok(moduleRecord.rollbackManifest, 'rollback manifest is required');

for (const requiredPath of [
  'backend/contracts/example-module/v1.ts',
  'backend/services/example-module/application/example-module-service.ts',
  'frontend/features/example-module/api/example-module-client.ts',
  moduleRecord.rollbackManifest,
]) {
  assert.ok(fs.existsSync(requiredPath), `missing migration evidence: ${requiredPath}`);
}

const legacy = fs.readFileSync('src/lib/services/example-module-service.ts', 'utf8');
const backbone = fs.readFileSync(
  'backend/services/example-module/application/example-module-service.ts',
  'utf8',
);

for (const invariant of ['example-001', 'Kiểm tra cấu trúc module mới', 'Developer Guide']) {
  assert.ok(legacy.includes(invariant), `legacy characterization lost: ${invariant}`);
  assert.ok(backbone.includes(invariant), `backbone behavior mismatch: ${invariant}`);
}

console.log('Example module isolated migration contract passed; no cutover claimed.');
