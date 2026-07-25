#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';

const root = process.cwd();
const runtimeOnly = process.argv.includes('--runtime-only');
const violations = [];
const endpointVariables = {
  NEMOCLAW_API_URL: 'http://ollama:11434',
  LLM_ENDPOINT: 'http://ollama:11434/v1/chat/completions',
  TRUSTGRAPH_API_URL: 'http://trustgraph-api:8088',
  YOLO_ENDPOINT: 'http://yolo-service:5005/detect',
};

function isPrivateIpv4(hostname) {
  const octets = hostname.split('.').map(Number);
  if (octets.length !== 4 || octets.some(value => !Number.isInteger(value) || value < 0 || value > 255)) return false;
  const [a, b] = octets;
  return a === 127 || a === 10 || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 168) || (a === 169 && b === 254);
}

function isLocalHost(rawHostname) {
  const hostname = rawHostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (net.isIP(hostname) === 4) return isPrivateIpv4(hostname);
  if (net.isIP(hostname) === 6) {
    return hostname === '::1' || hostname.startsWith('fc') || hostname.startsWith('fd') || /^fe[89ab]/.test(hostname);
  }
  if (['localhost', 'host.docker.internal', 'gateway.docker.internal'].includes(hostname)) return true;
  if (['.local', '.internal', '.svc', '.svc.cluster.local'].some(suffix => hostname.endsWith(suffix))) return true;
  return !hostname.includes('.') && /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(hostname);
}

function checkEndpoint(name, rawValue) {
  try {
    const endpoint = new URL(rawValue);
    if (!['http:', 'https:'].includes(endpoint.protocol) || endpoint.username || endpoint.password) {
      violations.push(`${name}: invalid local HTTP(S) endpoint policy`);
      return;
    }
    if (!isLocalHost(endpoint.hostname)) violations.push(`${name}: public host ${endpoint.hostname} is forbidden`);
  } catch {
    violations.push(`${name}: value is not an absolute URL`);
  }
}

for (const [name, fallback] of Object.entries(endpointVariables)) {
  checkEndpoint(name, process.env[name] || fallback);
}

if (!runtimeOnly) {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const allDependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const forbiddenPackages = [
    'openai', '@anthropic-ai/sdk', '@google/generative-ai', '@google/genai',
    'cohere-ai', 'groq-sdk', '@mistralai/mistralai',
  ];
  for (const dependency of forbiddenPackages) {
    if (allDependencies[dependency]) violations.push(`package.json: public AI SDK ${dependency} is forbidden`);
  }

  const rootsToScan = ['src', 'infra'];
  const allowedExtensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs', '.py', '.yml', '.yaml', '.json']);
  const forbiddenMarkers = [
    'OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GEMINI_API_KEY', 'GOOGLE_API_KEY',
    'GROQ_API_KEY', 'MISTRAL_API_KEY', 'api.openai.com', 'api.anthropic.com',
    'generativelanguage.googleapis.com', 'api.groq.com', 'api.mistral.ai',
  ];

  function walk(directory) {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (['node_modules', '.next', '__pycache__', 'models'].includes(entry.name)) continue;
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      const extension = path.extname(entry.name);
      if (!allowedExtensions.has(extension) && entry.name !== 'Dockerfile') continue;
      const relative = path.relative(root, fullPath).split(path.sep).join('/');
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const marker of forbiddenMarkers) {
        if (content.includes(marker)) violations.push(`${relative}: forbidden public AI marker ${marker}`);
      }
    }
  }

  for (const directory of rootsToScan) walk(path.join(root, directory));

  const aiServer = fs.readFileSync(path.join(root, 'infra/ai-server/main.py'), 'utf8');
  const requiredOfflineControls = [
    'local_files_only=True',
    'trust_remote_code=False',
    'HF_HUB_OFFLINE',
    'TRANSFORMERS_OFFLINE',
    'ALLOWED_LANGUAGE_MODELS',
  ];
  for (const control of requiredOfflineControls) {
    if (!aiServer.includes(control)) violations.push(`infra/ai-server/main.py: missing offline control ${control}`);
  }
}

if (violations.length > 0) {
  console.error('[local-ai-only] Policy violations detected:');
  for (const violation of Array.from(new Set(violations))) console.error(`- ${violation}`);
  process.exit(1);
}

console.log(`[local-ai-only] OK: ${runtimeOnly ? 'runtime endpoints' : 'runtime, source and dependency'} checks passed.`);
