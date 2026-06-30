#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const requiredFiles = [
  'src/lib/integrations/secure-integration-gateway.ts',
  'docs/secure_external_integration_guide.md',
  'src/lib/mfe/service-bus.ts',
  'src/lib/mfe/module-registry.ts',
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));

if (missing.length > 0) {
  console.error('[secure-integration-audit] missing required files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

console.log('[secure-integration-audit] OK');
