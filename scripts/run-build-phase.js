#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const args = process.argv.slice(2);
const splitIndex = args.indexOf('--');

if (splitIndex <= 0 || splitIndex === args.length - 1) {
  console.error('Usage: node scripts/run-build-phase.js "Phase name" -- <command> [args...]');
  process.exit(2);
}

const phaseName = args.slice(0, splitIndex).join(' ').trim();
const command = args[splitIndex + 1];
const commandArgs = args.slice(splitIndex + 2);
const logDir = process.env.BUILD_PHASE_LOG_DIR || '.build-logs';
const startedAt = new Date();

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'phase';
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(stream, message) {
  stream.write(message);
}

ensureDir(logDir);

const slug = slugify(phaseName);
const logPath = path.join(logDir, `${slug}.log`);
const summaryPath = path.join(logDir, 'summary.jsonl');
const logStream = fs.createWriteStream(logPath, { flags: 'a' });

function logLine(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  write(logStream, line);
  process.stdout.write(line);
}

function appendChunk(prefix, chunk, targetStream) {
  const text = chunk.toString();
  write(logStream, text);
  targetStream.write(prefix ? text.split('\n').map((line, index, arr) => {
    if (!line && index === arr.length - 1) return '';
    return `${prefix}${line}`;
  }).join('\n') : text);
}

function writeSummary(exitCode, signal) {
  const endedAt = new Date();
  const durationMs = endedAt.getTime() - startedAt.getTime();
  const summary = {
    phase: phaseName,
    command: [command, ...commandArgs].join(' '),
    startedAt: startedAt.toISOString(),
    endedAt: endedAt.toISOString(),
    durationMs,
    exitCode,
    signal,
    logPath,
    status: exitCode === 0 ? 'success' : 'failed',
  };
  fs.appendFileSync(summaryPath, `${JSON.stringify(summary)}\n`);
  return summary;
}

process.stdout.write(`::group::${phaseName}\n`);
logLine(`START ${phaseName}`);
logLine(`COMMAND ${command} ${commandArgs.join(' ')}`.trim());

const child = spawn(command, commandArgs, {
  cwd: process.cwd(),
  env: process.env,
  shell: process.platform === 'win32',
  stdio: ['ignore', 'pipe', 'pipe'],
});

child.stdout.on('data', (chunk) => appendChunk('', chunk, process.stdout));
child.stderr.on('data', (chunk) => appendChunk('', chunk, process.stderr));

child.on('error', (error) => {
  logLine(`ERROR ${error.message}`);
});

child.on('close', (exitCode, signal) => {
  const summary = writeSummary(exitCode, signal);
  logLine(`END ${phaseName} status=${summary.status} exitCode=${exitCode} durationMs=${summary.durationMs}`);
  logStream.end(() => {
    process.stdout.write(`::endgroup::\n`);
    process.exit(exitCode || 0);
  });
});
