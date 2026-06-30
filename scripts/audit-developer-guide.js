#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const guidePath = path.join(root, 'docs/3_DEVELOPER_GUIDE.md');
const workflowPath = path.join(root, '.github/workflows/security-and-acceptance.yml');
const navigationPath = path.join(root, 'src/lib/navigation.ts');

const expectedFiles = [
  'docs/3_DEVELOPER_GUIDE.md',
  'src/lib/navigation.ts',
  'src/lib/mfe/module-registry.ts',
  'src/lib/mfe/service-bus.ts',
  'src/components/mfe/cross-module-service-bus-bridge.tsx',
  'src/lib/services/offline-sync.ts',
  'src/lib/services/offline-entity-sync.ts',
  'src/app/(app)/example-module/page.tsx',
  'src/components/example-module/example-module-panel.tsx',
  'src/components/example-module/use-example-module-workflow.ts',
  'src/lib/actions/example-module.actions.ts',
  'src/lib/services/example-module-service.ts',
  'src/scripts/local-preflight.ts',
  'src/scripts/build-env-guard.ts',
  'scripts/audit-module-registry.js',
  'package.json',
];

const expectedGuideSnippets = [
  'Modular Monolith theo hướng Micro-Frontend-ready',
  'MAIN_NAV_ITEMS',
  'ADMIN_NAV_ITEMS',
  'IndexedDB',
  'offline-entity-sync.ts',
  'src/app/(app)/example-module',
  'audit-module-registry.js',
  'incident-memory:approve',
  'build-env-guard',
  'db:validate:all',
  'db:generate:all',
  'node scripts/audit-developer-guide.js',
  'Không dùng browser event rời rạc',
  'Incident Memory Approval',
];

const expectedWorkflowSnippets = [
  'Developer Guide traceability audit',
  'node scripts/audit-developer-guide.js',
  'Module registry audit',
  'node scripts/audit-module-registry.js',
];

const expectedNavigationSnippets = [
  '/ai-lab/incident-memory',
  'Incident Memory Approval',
  'Phê duyệt Incident Memory',
];

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function readIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

let failures = 0;

const missingFiles = expectedFiles.filter((file) => !exists(file));
if (missingFiles.length > 0) {
  failures += missingFiles.length;
  console.error('[developer-guide-audit] Missing expected evidence files:');
  for (const file of missingFiles) console.error(`- ${file}`);
}

const guide = readIfExists(guidePath);
const missingGuideSnippets = expectedGuideSnippets.filter((snippet) => !guide.includes(snippet));
if (missingGuideSnippets.length > 0) {
  failures += missingGuideSnippets.length;
  console.error('[developer-guide-audit] Developer Guide is missing current implementation references:');
  for (const snippet of missingGuideSnippets) console.error(`- ${snippet}`);
}

const workflow = readIfExists(workflowPath);
const missingWorkflowSnippets = expectedWorkflowSnippets.filter((snippet) => !workflow.includes(snippet));
if (missingWorkflowSnippets.length > 0) {
  failures += missingWorkflowSnippets.length;
  console.error('[developer-guide-audit] CI is missing Developer Guide audit wiring:');
  for (const snippet of missingWorkflowSnippets) console.error(`- ${snippet}`);
}

const navigation = readIfExists(navigationPath);
const missingNavigationSnippets = expectedNavigationSnippets.filter((snippet) => !navigation.includes(snippet));
if (missingNavigationSnippets.length > 0) {
  failures += missingNavigationSnippets.length;
  console.error('[developer-guide-audit] Navigation is missing Developer Guide referenced routes:');
  for (const snippet of missingNavigationSnippets) console.error(`- ${snippet}`);
}

if (failures > 0) {
  console.error(`[developer-guide-audit] FAILED with ${failures} missing evidence item(s).`);
  process.exit(1);
}

console.log('[developer-guide-audit] OK: Developer Guide matches current implementation contracts.');
