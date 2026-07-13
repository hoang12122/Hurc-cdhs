#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const registryPath = path.join(root, 'src/lib/mfe/module-registry.ts');
const expectedRoutes = [
  '/dashboard',
  '/dnf',
  '/hazards',
  '/inspections',
  '/asset-360',
  '/ai-lab',
  '/rail-network',
  '/spatial-twin',
  '/iot',
  '/data-platform',
  '/mlops',
  '/evidence-ledger',
  '/example-module',
];

if (!fs.existsSync(registryPath)) {
  console.error('[module-registry-audit] Missing src/lib/mfe/module-registry.ts');
  process.exit(1);
}

const registry = fs.readFileSync(registryPath, 'utf8');
const missingRoutes = expectedRoutes.filter((route) => !registry.includes(`routePrefix: '${route}'`));
const requiredFields = ['id:', 'name:', 'routePrefix:', 'owner:', 'runtimeMode:', 'criticality:', 'dataBoundary:', 'productionReadiness:'];
const missingFields = requiredFields.filter((field) => !registry.includes(field));

if (missingRoutes.length > 0 || missingFields.length > 0) {
  console.error('[module-registry-audit] Module registry is missing required evidence.');
  for (const route of missingRoutes) console.error(`- missing route: ${route}`);
  for (const field of missingFields) console.error(`- missing field marker: ${field}`);
  process.exit(1);
}

console.log('[module-registry-audit] OK: module registry contains required routes and contract fields.');
