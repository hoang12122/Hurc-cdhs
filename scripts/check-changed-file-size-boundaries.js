#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.cwd();
const maxLines = Number(process.env.MAX_TS_LINES || 300);
const targetExtensions = new Set(['.ts', '.tsx']);
const ignoredFiles = new Set(['src/lib/constants.ts', 'src/lib/types.ts']);

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function getChangedFiles() {
  try {
    const output = execSync('git diff --name-only --diff-filter=ACMR HEAD~1 HEAD', { encoding: 'utf8' });
    return output.split('\n').map((item) => item.trim()).filter(Boolean);
  } catch (error) {
    console.warn('[changed-file-boundary] Unable to resolve changed files from git history. Skipping changed-file gate.');
    return [];
  }
}

function countLines(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) return 0;
  const content = fs.readFileSync(fullPath, 'utf8');
  return content ? content.split(/\r?\n/).length : 0;
}

const violations = getChangedFiles()
  .map(toPosix)
  .filter((file) => targetExtensions.has(path.extname(file)))
  .filter((file) => !ignoredFiles.has(file))
  .map((file) => ({ file, lines: countLines(file) }))
  .filter((item) => item.lines > maxLines)
  .sort((a, b) => b.lines - a.lines);

if (violations.length > 0) {
  console.error(`[changed-file-boundary] Changed TypeScript files must be <= ${maxLines} lines.`);
  for (const violation of violations) {
    console.error(`- ${violation.file}: ${violation.lines} lines`);
  }
  console.error('[changed-file-boundary] Split UI into sub-components or move workflow logic into hooks/services.');
  process.exit(1);
}

console.log('[changed-file-boundary] OK: changed TypeScript files comply with the design boundary.');
