#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const requiredFiles = [
  'docs/openmaint_comparison_and_improvement_plan.md',
  'src/lib/maintenance/openmaint-benchmark.ts',
  'docs/0_SOFTWARE_LIFECYCLE_MANUAL.md',
  'docs/6_MODULES_AND_FEATURES.md',
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));

if (missing.length > 0) {
  console.error('[openmaint-benchmark-audit] missing required evidence files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

console.log('[openmaint-benchmark-audit] OK');
