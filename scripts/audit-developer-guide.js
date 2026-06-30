#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const requiredFiles = [
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
  'scripts/audit-module-registry.js',
  '.github/workflows/security-and-acceptance.yml',
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length > 0) {
  console.error('[guide-audit] Missing required files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

console.log('[guide-audit] OK: required guide evidence files exist.');
