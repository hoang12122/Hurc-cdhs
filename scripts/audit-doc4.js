#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const files = [
  'docs/4_DEPLOYMENT_AND_OPS.md',
  'Dockerfile',
  'docker-compose.yml',
  '.github/workflows/security-and-acceptance.yml',
  '.github/workflows/docker-acceptance.yml',
  'scripts/production-smoke-test.js',
  'scripts/smoke-deploy.sh',
];

const missing = files.filter((file) => !fs.existsSync(path.join(root, file)));

if (missing.length > 0) {
  console.error('[doc4-audit] missing required evidence files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

console.log('[doc4-audit] OK');
