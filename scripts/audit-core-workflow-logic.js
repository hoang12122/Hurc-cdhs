#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(file) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    return { exists: false, content: '' };
  }
  return { exists: true, content: fs.readFileSync(fullPath, 'utf8') };
}

const checks = [
  {
    group: 'DNF data source and dashboard refresh',
    file: 'src/lib/actions/dnf.actions.ts',
    required: ['export async function getDnfRecords', 'return await getDnfs()', "revalidatePath('/dashboard')"],
  },
  {
    group: 'DNF to Hazard normalized helper',
    file: 'src/lib/fracas/dnf-to-hazard-link.ts',
    required: [
      'buildDnfToHazardUrl',
      'originatingDnfId',
      'dnfHazardPrefill',
      'suggestedDescription',
      'suggestedConsequence',
      'suggestedControls',
      'suggestedSystemGroup',
      'suggestedProposedActions',
    ],
  },
  {
    group: 'Legacy DNF to Hazard link normalization',
    file: 'src/middleware.ts',
    required: ['originatingDnfId', 'dnfHazardPrefill', '/dnf/${originatingDnfId}/create-hazard', "matcher: ['/hazards/new']"],
  },
  {
    group: 'DNF to Hazard redirect route',
    file: 'src/app/(app)/dnf/[id]/create-hazard/page.tsx',
    required: ['getDnfById', 'buildDnfToHazardUrl', "redirect('/dnf')", 'redirect(buildDnfToHazardUrl(dnf))'],
  },
  {
    group: 'Hazard New form prefill',
    file: 'src/app/(app)/hazards/new/page.tsx',
    required: [
      'linkedDnfId',
      'suggestedDescription',
      'suggestedConsequence',
      'suggestedControls',
      'suggestedSystemGroup',
      'suggestedProposedActions',
      'potentialConsequence',
      'currentControls',
      'proposedActions',
    ],
  },
  {
    group: 'Hazard AI human review flow',
    file: 'src/components/hazards/hazard-form.tsx',
    required: ['assessHazardFlow', 'humanDecisionRequired', 'suggestedActions', 'potentialConsequence', 'currentControls'],
  },
  {
    group: 'Dashboard panels connected to DNF records',
    file: 'src/app/(app)/dashboard/layout.tsx',
    required: ['getDnfRecords', 'FracasPhaseTracker', 'RamsOccDashboardPanel', 'PredictiveRamsPanel'],
  },
  {
    group: 'FRACAS phase engine',
    file: 'src/lib/fracas/fracas-phase-tracker.ts',
    required: ['deriveFracasPhase', 'calculateFracasPhaseSummary', 'phase-1', 'phase-2', 'phase-3', 'phase-4', 'phase-5'],
  },
  {
    group: 'RAMS quick engine',
    file: 'src/lib/rams/rams-risk-engine.ts',
    required: ['calculateServiceImpactScore', 'calculateMttrMinutes', 'calculateRamsQuickSummary', 'buildTrends', 'buildHotspots'],
  },
  {
    group: 'Predictive RAMS engine',
    file: 'src/lib/rams/predictive-rams.ts',
    required: ['recurrenceScore', 'assetHealthScore', 'failureProbability', 'predictedHotspot', 'suggestedPreventiveAction'],
  },
  {
    group: 'CI linkage audit coverage',
    file: '.github/workflows/security-and-acceptance.yml',
    required: ['Software linkage audit', 'Six-step upgrade audit', 'Production route smoke test', 'Upload build phase logs'],
  },
];

const failures = [];
const results = [];

for (const check of checks) {
  const file = read(check.file);
  if (!file.exists) {
    failures.push(`${check.group}: missing file ${check.file}`);
    results.push({ ...check, status: 'failed', missing: ['file'] });
    continue;
  }

  const missing = check.required.filter((marker) => !file.content.includes(marker));
  if (missing.length > 0) {
    failures.push(`${check.group}: missing ${missing.join(', ')}`);
    results.push({ ...check, status: 'failed', missing });
  } else {
    results.push({ ...check, status: 'passed', missing: [] });
  }
}

console.log('[core-workflow-logic-audit] Results:');
for (const result of results) {
  console.log(`- ${result.status.toUpperCase()} ${result.group} (${result.file})`);
}

if (failures.length > 0) {
  console.error('[core-workflow-logic-audit] Failed checks:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('[core-workflow-logic-audit] OK');
