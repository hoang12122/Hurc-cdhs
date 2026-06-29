const { spawn } = require('node:child_process');

const BASE_URL = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3000';
const START_COMMAND = process.env.SMOKE_START_COMMAND || 'npm';
const START_ARGS = process.env.SMOKE_START_ARGS ? process.env.SMOKE_START_ARGS.split(' ') : ['run', 'start'];
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 120000);
const POLL_INTERVAL_MS = Number(process.env.SMOKE_POLL_INTERVAL_MS || 2000);

const routes = [
  { path: '/api/health', expectJsonStatus: 'healthy', maxStatus: 299 },
  { path: '/rail-network', maxStatus: 399 },
  { path: '/spatial-twin', maxStatus: 399 },
  { path: '/spatial-twin/import', maxStatus: 399 },
  { path: '/asset-360', maxStatus: 399 },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal, redirect: 'manual' });
  } finally {
    clearTimeout(timer);
  }
}

async function waitUntilHealthy() {
  const deadline = Date.now() + TIMEOUT_MS;
  let lastError = '';

  while (Date.now() < deadline) {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/api/health`);
      if (response.ok) {
        const body = await response.json().catch(() => null);
        if (body?.status === 'healthy') return;
        lastError = `Unexpected health body: ${JSON.stringify(body)}`;
      } else {
        lastError = `Health status ${response.status}`;
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error(`Application did not become healthy within ${TIMEOUT_MS}ms. Last error: ${lastError}`);
}

async function checkRoute(route) {
  const url = `${BASE_URL}${route.path}`;
  const response = await fetchWithTimeout(url);
  if (response.status > route.maxStatus) {
    throw new Error(`${route.path} returned HTTP ${response.status}`);
  }

  if (route.expectJsonStatus) {
    const body = await response.json().catch(() => null);
    if (body?.status !== route.expectJsonStatus) {
      throw new Error(`${route.path} returned invalid JSON status: ${JSON.stringify(body)}`);
    }
  }

  console.log(`[SMOKE] PASS ${route.path} -> ${response.status}`);
}

async function main() {
  console.log(`[SMOKE] Starting production server: ${START_COMMAND} ${START_ARGS.join(' ')}`);
  const child = spawn(START_COMMAND, START_ARGS, {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_PUBLIC_SETUP_COMPLETE: process.env.NEXT_PUBLIC_SETUP_COMPLETE || 'true',
      SESSION_SECRET: process.env.SESSION_SECRET || 'smoke_test_placeholder_secret',
      AUTH_DATABASE_URL: process.env.AUTH_DATABASE_URL || 'postgresql://smoke:placeholder@localhost:5432/auth',
      AI_DATABASE_URL: process.env.AI_DATABASE_URL || 'postgresql://smoke:placeholder@localhost:5432/ai',
      METRO_DATABASE_URL: process.env.METRO_DATABASE_URL || 'postgresql://smoke:placeholder@localhost:5432/metro',
      OPS_DATABASE_URL: process.env.OPS_DATABASE_URL || 'postgresql://smoke:placeholder@localhost:5432/ops',
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://smoke:placeholder@localhost:5432/main',
    },
  });

  child.stdout.on('data', (chunk) => process.stdout.write(`[APP] ${chunk}`));
  child.stderr.on('data', (chunk) => process.stderr.write(`[APP] ${chunk}`));

  try {
    await waitUntilHealthy();
    for (const route of routes) {
      await checkRoute(route);
    }
    console.log('[SMOKE] Production smoke test passed.');
  } finally {
    child.kill('SIGTERM');
    await sleep(1000);
    if (!child.killed) child.kill('SIGKILL');
  }
}

main().catch((error) => {
  console.error('[SMOKE] Production smoke test failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
