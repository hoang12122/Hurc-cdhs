#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';

const read = path => readFileSync(path, 'utf8');
const failures = [];

const dnfAction = read('src/lib/actions/dnf.actions.ts');
const hazardAction = read('src/lib/actions/hazard.actions.ts');
const workflow = read('.github/workflows/vision-scada-data-exchange.yml');

const requireText = (content, text, message) => {
  if (!content.includes(text)) failures.push(message);
};

requireText(dnfAction, 'where.createdById', 'DNF creator scope must be applied in the database query.');
requireText(hazardAction, 'whereClause.createdById', 'Hazard creator scope must be applied in the database query.');
requireText(dnfAction, 'pages: Math.ceil(total / pagination.pageSize)', 'DNF page count must use the scoped database total.');
requireText(hazardAction, 'pages: Math.ceil(total / pagination.pageSize)', 'Hazard page count must use the scoped database total.');

if (dnfAction.includes('total: filtered.length') || hazardAction.includes('total: filtered.length')) {
  failures.push('Post-pagination application filtering must not define pagination totals.');
}

requireText(workflow, 'cache: npm', 'Workflow must use the npm dependency cache.');
requireText(workflow, 'npm ci', 'Workflow must use reproducible npm ci installation.');
requireText(workflow, 'cancel-in-progress: true', 'Workflow must cancel superseded runs.');

for (const path of [
  'src/app/(app)/dnf/loading.tsx',
  'src/app/(app)/hazards/loading.tsx',
]) {
  if (!existsSync(path)) failures.push(`Missing route loading state: ${path}`);
}

if (failures.length) {
  console.error('[operational-performance] FAILED');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('[operational-performance] PASS: scoped pagination, CI cache and route loading are enforced.');
