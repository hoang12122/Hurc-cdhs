#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const ignoredDirs = new Set(['.git', '.next', 'node_modules', '.prisma-runtime', 'coverage', 'dist', 'build']);
const domainRoots = new Set(['ai', 'asset-360', 'dnf', 'hazards', 'inspections', 'rail-network', 'spatial-twin', 'tasks']);
const sharedRoots = new Set(['ui', 'layout', 'providers', 'shared', 'mfe']);

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) walk(path.join(dir, entry.name), files);
    } else if (entry.isFile() && ['.ts', '.tsx'].includes(path.extname(entry.name))) {
      files.push(toPosix(path.relative(root, path.join(dir, entry.name))));
    }
  }
  return files;
}

function ownerOf(file) {
  const prefix = 'src/components/';
  if (!file.startsWith(prefix)) return null;
  const rest = file.slice(prefix.length);
  return rest.split('/')[0] || null;
}

const findings = [];
for (const file of walk(root)) {
  const owner = ownerOf(file);
  if (!owner || sharedRoots.has(owner)) continue;
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  for (const target of domainRoots) {
    if (target === owner) continue;
    const needle = `@/components/${target}/`;
    if (content.includes(needle)) findings.push(`${file}: ${owner} imports ${target}`);
  }
}

if (findings.length > 0) {
  console.warn(`[module-boundary] ${findings.length} possible cross-module imports found.`);
  for (const finding of findings.slice(0, 80)) console.warn(`- ${finding}`);
  console.warn('[module-boundary] Prefer shared components, Service Bus, Server Actions or public service contracts.');
} else {
  console.log('[module-boundary] OK: no possible cross-module imports found.');
}
