#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();

const checks = [
  ['src/lib/fracas/fracas-phase-tracker.ts', 'calculateFracasPhaseSummary'],
  ['src/components/fracas/fracas-phase-tracker.tsx', 'FracasPhaseTracker'],
  ['src/lib/fracas/dnf-to-hazard-link.ts', 'buildDnfToHazardUrl'],
  ['src/lib/fracas/dnf-to-hazard-link.ts', 'suggestedConsequence'],
  ['src/lib/fracas/dnf-to-hazard-link.ts', 'suggestedControls'],
  ['src/lib/fracas/dnf-to-hazard-link.ts', 'suggestedSystemGroup'],
  ['src/lib/fracas/dnf-to-hazard-link.ts', 'suggestedProposedActions'],
  ['src/app/(app)/hazards/new/page.tsx', 'suggestedConsequence'],
  ['src/app/(app)/hazards/new/page.tsx', 'suggestedControls'],
  ['src/app/(app)/hazards/new/page.tsx', 'suggestedSystemGroup'],
  ['src/app/(app)/hazards/new/page.tsx', 'suggestedProposedActions'],
  ['src/app/(app)/dnf/[id]/create-hazard/page.tsx', 'buildDnfToHazardUrl'],
  ['src/lib/rams/predictive-rams.ts', 'calculatePredictiveRamsSummary'],
  ['src/components/rams/predictive-rams-panel.tsx', 'PredictiveRamsPanel'],
  ['src/lib/i18n/domain-dictionary.ts', 'DOMAIN_DICTIONARY'],
  ['src/lib/demo/fracas-demo-case-study.ts', 'FRACAS_DEMO_CASE_STUDY'],
  ['src/app/(app)/fracas-risk-management/demo-case-study/page.tsx', 'Workflow demo end-to-end'],
  ['src/app/(app)/fracas-risk-management/shamma-benchmark/page.tsx', 'Shamma Metro Benchmark'],
  ['src/app/(app)/dashboard/layout.tsx', 'PredictiveRamsPanel'],
];

const missing = [];

for (const [file, marker] of checks) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    missing.push(`${file} missing`);
    continue;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  if (!content.includes(marker)) missing.push(`${file} missing marker ${marker}`);
}

if (missing.length > 0) {
  console.error('[six-step-upgrades-audit] failed');
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log('[six-step-upgrades-audit] OK');
