#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const requiredFiles = [
  'docs/0_SOFTWARE_LIFECYCLE_MANUAL.md',
  'docs/1_SYSTEM_ARCHITECTURE.md',
  'docs/2_DESIGN_AND_CODING_RULES.md',
  'docs/3_DEVELOPER_GUIDE.md',
  'docs/4_DEPLOYMENT_AND_OPS.md',
  'docs/secure_external_integration_guide.md',
  'src/lib/mfe/module-registry.ts',
  'src/lib/mfe/service-bus.ts',
  'src/lib/integrations/secure-integration-gateway.ts',
  'src/lib/services/yolo-quality-gate.ts',
  '.github/workflows/security-and-acceptance.yml',
];

const redundantFiles = [
  'docs/software_docs_gap_summary.md',
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
const redundant = redundantFiles.filter((file) => fs.existsSync(path.join(root, file)));

if (missing.length > 0 || redundant.length > 0) {
  if (missing.length > 0) {
    console.error('[lifecycle-docs-audit] missing required lifecycle evidence:');
    for (const file of missing) console.error(`- ${file}`);
  }
  if (redundant.length > 0) {
    console.error('[lifecycle-docs-audit] redundant lifecycle summary files found:');
    for (const file of redundant) console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log('[lifecycle-docs-audit] OK');
