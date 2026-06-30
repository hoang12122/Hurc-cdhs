#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const guidePath = path.join(root, 'docs/3_DEVELOPER_GUIDE.md');
const workflowPath = path.join(root, '.github/workflows/security-and-acceptance.yml');

const expectedFiles = [
  'docs/3_DEVELOPER_GUIDE.md',
  'src/lib/navigation.ts',
  'src/lib/mfe/module-registry.ts',
  'src/lib/mfe/service-bus.ts',
  'src/components/mfe/cross-module-service-bus-bridge.tsx',
  'src/lib/services/offline-sync.ts',
  'src/scripts/local-preflight.ts',
  'src/scripts/build-env-guard.ts',
  'package.json',
];

const expectedGuideSnippets = [
  'Modular Monolith theo hướng Micro-Frontend-ready',
  'MAIN_NAV_ITEMS',
  'ADMIN_NAV_ITEMS',
  'IndexedDB',
  'build-env-guard',
  'db:validate:all',
  'db:generate:all',
];

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

const missingFiles = expectedFiles.filter((file) => !exists(file));
if (missingFiles.length > 0) {
  console.warn('[developer-guide-audit] Missing expected evidence files:');
  for (const file of missingFiles) console.warn(`- ${file}`);
}

if (fs.existsSync(guidePath)) {
  const guide = fs.readFileSync(guidePath, 'utf8');
  const missingSnippets = expectedGuideSnippets.filter((snippet) => !guide.includes(snippet));
  if (missingSnippets.length > 0) {
    console.warn('[developer-guide-audit] Developer Guide may be missing current implementation references:');
    for (const snippet of missingSnippets) console.warn(`- ${snippet}`);
  } else {
    console.log('[developer-guide-audit] OK: Developer Guide references current implementation contracts.');
  }
}

if (fs.existsSync(workflowPath)) {
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  if (!workflow.includes('Developer Guide traceability audit')) {
    console.warn('[developer-guide-audit] CI does not include Developer Guide traceability audit yet.');
  }
}
