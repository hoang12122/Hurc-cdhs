#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.cwd();
const maxLines = Number(process.env.MAX_TS_LINES || 300);
const baselinePath = path.join(root, 'scripts', 'file-size-baseline.json');
const targetExtensions = new Set(['.ts', '.tsx']);
const ignoredFiles = new Set(['src/lib/constants.ts', 'src/lib/types.ts']);

function runGit(command) {
  return execSync(command, { encoding: 'utf8', cwd: root })
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function getTrackedTypeScriptFiles() {
  try {
    return runGit('git ls-files').map(toPosix).filter((file) => targetExtensions.has(path.extname(file)));
  } catch {
    console.error('[file-boundary] Unable to enumerate repository files.');
    process.exit(1);
  }
}

function getChangedFiles() {
  try {
    return new Set(runGit('git diff --name-only --diff-filter=ACMR HEAD~1 HEAD').map(toPosix));
  } catch {
    console.warn('[file-boundary] Unable to resolve HEAD~1; treating all tracked TypeScript files as changed.');
    return new Set(getTrackedTypeScriptFiles());
  }
}

function loadBaseline() {
  if (!fs.existsSync(baselinePath)) return {};
  try {
    const parsed = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    console.error(`[file-boundary] Invalid baseline file: ${error.message}`);
    process.exit(1);
  }
}

function countLines(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) return 0;
  const content = fs.readFileSync(fullPath, 'utf8');
  return content ? content.split(/\r?\n/).length : 0;
}

const changedFiles = getChangedFiles();
const baseline = loadBaseline();
const violations = [];
const legacyWarnings = [];

for (const file of getTrackedTypeScriptFiles()) {
  if (ignoredFiles.has(file)) continue;
  const lines = countLines(file);
  const baselineLimit = Number(baseline[file]);
  const allowedLimit = Number.isFinite(baselineLimit) ? Math.max(maxLines, baselineLimit) : maxLines;

  if (lines <= allowedLimit) continue;

  if (changedFiles.has(file) || Number.isFinite(baselineLimit)) {
    violations.push({ file, lines, allowedLimit, changed: changedFiles.has(file) });
  } else {
    legacyWarnings.push({ file, lines });
  }
}

violations.sort((a, b) => b.lines - a.lines);
legacyWarnings.sort((a, b) => b.lines - a.lines);

if (legacyWarnings.length > 0) {
  console.warn(`[file-boundary] Repository audit found ${legacyWarnings.length} legacy files over ${maxLines} lines without baseline entries.`);
  for (const item of legacyWarnings.slice(0, 20)) {
    console.warn(`- ${item.file}: ${item.lines} lines (legacy warning)`);
  }
}

if (violations.length > 0) {
  console.error('[file-boundary] File-size boundary violations detected.');
  for (const item of violations) {
    console.error(`- ${item.file}: ${item.lines} lines; allowed ${item.allowedLimit}${item.changed ? '; changed in this commit' : ''}`);
  }
  console.error('[file-boundary] Split the file or update scripts/file-size-baseline.json only through an intentional architecture review.');
  process.exit(1);
}

console.log(`[file-boundary] OK: audited ${getTrackedTypeScriptFiles().length} tracked TypeScript files; changed files comply with the ${maxLines}-line boundary.`);
