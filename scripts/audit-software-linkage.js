#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();

const requiredLinks = [
  {
    file: 'src/lib/hazards/hazard-ai-flow-assessment.ts',
    checks: [
      'export function assessHazardFlow',
      'humanDecisionRequired: true',
      'riskClass',
      'matrixScore',
    ],
  },
  {
    file: 'src/components/hazards/hazard-form.tsx',
    checks: [
      'assessHazardFlow',
      'AI danh gia nhanh Hazard Log',
      'AI danh gia nhanh',
      'suggestedActions',
      'humanDecisionRequired',
    ],
  },
  {
    file: 'src/components/dnf/dnf-form.tsx',
    checks: [
      'assessHazardFlow',
      'AI danh gia nhanh lien quan Hazard',
      'riskToHazardLevel',
      'riskToPriority',
      'impactAssessment',
    ],
  },
  {
    file: 'src/lib/rams/rams-risk-engine.ts',
    checks: [
      'export function calculateRamsQuickSummary',
      'calculateServiceImpactScore',
      'calculateMttrMinutes',
      'buildHotspots',
      'buildOccHighlights',
    ],
  },
  {
    file: 'src/lib/rams/index.ts',
    checks: [
      "export * from './rams-risk-engine'",
    ],
  },
  {
    file: 'src/components/rams/rams-occ-dashboard-panel.tsx',
    checks: [
      'calculateRamsQuickSummary',
      'RAMS Total Trending',
      'RAMS Hotspot',
      'OCC Highlights',
      'href="/dnf"',
    ],
  },
  {
    file: 'src/app/(app)/dashboard/layout.tsx',
    checks: [
      'RamsOccDashboardPanel',
      'getDnfRecords',
      '<RamsOccDashboardPanel records={records} />',
    ],
  },
  {
    file: 'src/app/(app)/fracas-risk-management/page.tsx',
    checks: [
      'Lộ trình FRACAS, Automation và AI',
      '05 Phase triển khai FRACAS',
      'Hướng tự động hóa',
      'Hướng ứng dụng AI',
      'Lộ trình kỹ thuật tiếp theo',
      'href="/dnf"',
      'href="/hazards"',
      'href="/dashboard"',
    ],
  },
  {
    file: 'src/lib/navigation.ts',
    checks: [
      '/fracas-risk-management',
      'FRACAS / Risk Management',
      'FRACAS / Quản lý rủi ro',
    ],
  },
  {
    file: 'src/lib/actions/dnf.actions.ts',
    checks: [
      'export async function getDnfRecords',
      'return await getDnfs()',
      "revalidatePath('/dashboard')",
    ],
  },
  {
    file: 'docs/hazard_ai_flow_assessment.md',
    checks: [
      'AI hỗ trợ đánh giá nhanh Hazard Log',
      'humanDecisionRequired',
      'Quyết định cuối cùng',
    ],
  },
  {
    file: 'docs/risk_management_rams_occ_highlight.md',
    checks: [
      'RAMS quick calculation cho OCC',
      '6 và 10',
      '8 và 9',
      '16',
      'Đã thực hiện',
    ],
  },
  {
    file: 'docs/fracas_phase_automation_ai_roadmap.md',
    checks: [
      'Nghiên cứu triển khai FRACAS theo Phase, Automation và AI',
      'Phase 1',
      'Phase 5',
      'Hướng ứng dụng AI',
    ],
  },
];

const missingFiles = [];
const missingChecks = [];

for (const item of requiredLinks) {
  const absolutePath = path.join(root, item.file);
  if (!fs.existsSync(absolutePath)) {
    missingFiles.push(item.file);
    continue;
  }

  const content = fs.readFileSync(absolutePath, 'utf8');
  for (const check of item.checks) {
    if (!content.includes(check)) {
      missingChecks.push(`${item.file} :: ${check}`);
    }
  }
}

if (missingFiles.length > 0 || missingChecks.length > 0) {
  if (missingFiles.length > 0) {
    console.error('[software-linkage-audit] missing required linked files:');
    for (const file of missingFiles) console.error(`- ${file}`);
  }

  if (missingChecks.length > 0) {
    console.error('[software-linkage-audit] missing required linkage markers:');
    for (const check of missingChecks) console.error(`- ${check}`);
  }

  process.exit(1);
}

console.log('[software-linkage-audit] OK');
