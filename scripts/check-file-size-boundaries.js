#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const MAX_LINES = Number(process.env.MAX_TS_LINES || 300);
const WARN_ONLY = process.argv.includes('--warn') || process.env.DESIGN_RULES_WARN_ONLY === 'true';
const TARGET_EXTENSIONS = new Set(['.ts', '.tsx']);
const IGNORE_DIRS = new Set([
  '.git',
  '.next',
  'node_modules',
  '.prisma-runtime',
  'coverage',
  'dist',
  'build',
  'backups',
]);
const IGNORE_FILES = new Set([
  'src/lib/constants.ts',
  'src/lib/types.ts',
]);

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), files);
      continue;
    }

    if (!entry.isFile()) continue;
    const fullPath = path.join(dir, entry.name);
    const relativePath = toPosix(path.relative(ROOT, fullPath));
    const extension = path.extname(entry.name);
    if (!TARGET_EXTENSIONS.has(extension)) continue;
    if (IGNORE_FILES.has(relativePath)) continue;
    files.push(relativePath);
  }
  return files;
}

function countLines(relativePath) {
  const content = fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
  if (!content) return 0;
  return content.split(/\r?\n/).length;
}

const files = walk(ROOT);
const violations = files
  .map((file) => ({ file, lines: countLines(file) }))
  .filter((item) => item.lines > MAX_LINES)
  .sort((a, b) => b.lines - a.lines);

if (violations.length > 0) {
  const logger = WARN_ONLY ? console.warn : console.error;
  logger(`\n[design-rules] Found ${violations.length} TypeScript files over ${MAX_LINES} lines.`);
  logger('[design-rules] Split UI into sub-components and move logic into custom hooks/services.');
  for (const violation of violations.slice(0, 80)) {
    logger(`- ${violation.file}: ${violation.lines} lines`);
  }
  logger('\n[design-rules] New and refactored files must comply with the 300-line boundary.');

  if (!WARN_ONLY) process.exit(1);
  process.exit(0);
}

console.log(`[design-rules] OK: ${files.length} TypeScript files checked. All files are <= ${MAX_LINES} lines.`);
