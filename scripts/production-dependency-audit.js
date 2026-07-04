#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const logDir = process.env.BUILD_PHASE_LOG_DIR || '.build-logs';
const reportPath = path.join(logDir, 'npm-audit-production.json');
const summaryPath = path.join(logDir, 'npm-audit-production-summary.json');
const failLevels = (process.env.PRODUCTION_AUDIT_FAIL_LEVELS || 'critical')
  .split(',')
  .map((level) => level.trim().toLowerCase())
  .filter(Boolean);

fs.mkdirSync(logDir, { recursive: true });

const result = spawnSync('npm', ['audit', '--omit=dev', '--json'], {
  encoding: 'utf8',
  shell: process.platform === 'win32',
});

const stdout = result.stdout || '';
const stderr = result.stderr || '';

if (stdout) fs.writeFileSync(reportPath, stdout);
if (stderr) process.stderr.write(stderr);

let report;
try {
  report = stdout ? JSON.parse(stdout) : {};
} catch (error) {
  console.error('[production-dependency-audit] Could not parse npm audit JSON output.');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

const metadata = report.metadata || {};
const vulnerabilities = report.vulnerabilities || {};
const counts = metadata.vulnerabilities || {};
const failing = [];

for (const [name, vulnerability] of Object.entries(vulnerabilities)) {
  const severity = String(vulnerability.severity || '').toLowerCase();
  if (failLevels.includes(severity)) {
    failing.push({
      name,
      severity,
      via: vulnerability.via,
      range: vulnerability.range,
      fixAvailable: vulnerability.fixAvailable,
    });
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  failLevels,
  counts,
  totalDependencies: metadata.dependencies || {},
  failingCount: failing.length,
  failing,
  reportPath,
  npmAuditExitCode: result.status,
};

fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);

console.log('[production-dependency-audit] Vulnerability counts:', JSON.stringify(counts));
console.log(`[production-dependency-audit] Failing levels: ${failLevels.join(', ') || 'none'}`);
console.log(`[production-dependency-audit] Full report: ${reportPath}`);
console.log(`[production-dependency-audit] Summary: ${summaryPath}`);

if (failing.length > 0) {
  console.error(`[production-dependency-audit] Found ${failing.length} production dependency vulnerability item(s) at failing level.`);
  for (const item of failing) {
    console.error(`- ${item.name} severity=${item.severity} fixAvailable=${JSON.stringify(item.fixAvailable)}`);
  }
  process.exit(1);
}

if (result.status !== 0) {
  console.warn('[production-dependency-audit] npm audit reported vulnerabilities below the configured failing level. Build continues with audit evidence saved.');
}

console.log('[production-dependency-audit] Gate passed.');
