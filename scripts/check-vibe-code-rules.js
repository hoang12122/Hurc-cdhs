#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const WARN_ONLY = process.argv.includes('--warn') || process.env.VIBE_RULES_WARN_ONLY === 'true';
const TARGET_EXTENSIONS = new Set(['.ts', '.tsx']);
const IGNORE_DIRS = new Set(['.git', '.next', 'node_modules', '.prisma-runtime', 'coverage', 'dist', 'build', 'backups']);
const ALLOWED_DIRECT_FETCH = new Set([
  'scripts/production-smoke-test.js',
]);
const ALLOWED_BROWSER_EVENT_FILES = new Set([
  'src/lib/mfe/service-bus.ts',
]);

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) walk(path.join(dir, entry.name), files);
      continue;
    }
    if (!entry.isFile()) continue;
    const fullPath = path.join(dir, entry.name);
    const relativePath = toPosix(path.relative(ROOT, fullPath));
    const extension = path.extname(entry.name);
    if (TARGET_EXTENSIONS.has(extension) || extension === '.js' || extension === '.jsx') files.push(relativePath);
  }
  return files;
}

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function isClientUiFile(relativePath, content) {
  return content.includes("'use client'") || content.includes('"use client"') || relativePath.startsWith('src/components/') || relativePath.startsWith('src/app/');
}

function addFinding(findings, severity, file, rule, message) {
  findings.push({ severity, file, rule, message });
}

const findings = [];

for (const file of walk(ROOT)) {
  const content = read(file);
  const isClientUi = isClientUiFile(file, content);

  if (isClientUi && /\bfetch\s*\(/.test(content) && !ALLOWED_DIRECT_FETCH.has(file)) {
    addFinding(findings, 'warning', file, 'no-direct-fetch-in-ui', 'Client/UI file calls fetch() directly. Prefer Server Actions and Service Layer.');
  }

  if (isClientUi && /(#[0-9a-fA-F]{3,8}|(?:bg|text|border|from|to|via)-\[#[0-9a-fA-F]{3,8}\])/.test(content)) {
    addFinding(findings, 'warning', file, 'no-random-hex-colors', 'Hardcoded hex color detected. Prefer Tailwind/theme tokens.');
  }

  if (!ALLOWED_BROWSER_EVENT_FILES.has(file) && /(window\.dispatchEvent|new\s+CustomEvent\s*\()/.test(content)) {
    addFinding(findings, 'warning', file, 'service-bus-only-events', 'Browser events should go through src/lib/mfe/service-bus.ts.');
  }

  if (isClientUi && /\bawait\s+[a-zA-Z0-9_]+Action\s*\(/.test(content) && !file.includes('/hooks/') && !file.includes('use-')) {
    addFinding(findings, 'info', file, 'prefer-custom-hook-for-actions', 'Server Action is awaited in UI. Consider moving workflow logic to a custom hook.');
  }
}

if (findings.length > 0) {
  const logger = WARN_ONLY ? console.warn : console.error;
  logger(`\n[vibe-rules] Found ${findings.length} Vibe Code findings.`);
  for (const finding of findings.slice(0, 120)) {
    logger(`- [${finding.severity}] ${finding.file} :: ${finding.rule} :: ${finding.message}`);
  }
  logger('\n[vibe-rules] Treat warning findings as technical debt. New/refactored code should be clean.');
  if (!WARN_ONLY) process.exit(1);
  process.exit(0);
}

console.log('[vibe-rules] OK: no Vibe Code rule findings detected.');
