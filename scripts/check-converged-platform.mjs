#!/usr/bin/env node

import net from 'node:net';

function integer(value, fallback, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

function argumentPhase() {
  const explicit = process.argv.find(value => value.startsWith('--phase='));
  return integer(explicit?.split('=')[1] ?? process.env.DATA_PLATFORM_PHASE, 0, 0, 4);
}

async function checkTcp(name, host, port, timeoutMs = 3000) {
  const startedAt = Date.now();
  return await new Promise(resolve => {
    const socket = net.createConnection({ host, port });
    const finish = (ok, detail) => {
      socket.destroy();
      resolve({ name, ok, detail, latencyMs: Date.now() - startedAt });
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish(true, `${host}:${port}`));
    socket.once('timeout', () => finish(false, 'timeout'));
    socket.once('error', error => finish(false, error.message));
  });
}

async function checkHttp(name, url, options = {}) {
  const startedAt = Date.now();
  try {
    const response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(5000),
    });
    const text = await response.text();
    return {
      name,
      ok: response.ok,
      detail: `HTTP ${response.status} ${text.slice(0, 160)}`.trim(),
      latencyMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      name,
      ok: false,
      detail: error instanceof Error ? error.message : String(error),
      latencyMs: Date.now() - startedAt,
    };
  }
}

async function main() {
  const phase = argumentPhase();
  const checks = [];

  if (phase >= 1) {
    checks.push(
      checkTcp('MQTT', process.env.MQTT_HEALTH_HOST ?? '127.0.0.1', integer(process.env.MQTT_HOST_PORT, 1883, 1, 65535)),
      checkTcp('TimescaleDB', process.env.TIMESCALE_HEALTH_HOST ?? '127.0.0.1', integer(process.env.TIMESCALE_HOST_PORT, 5433, 1, 65535)),
    );
  }

  if (phase >= 2) {
    checks.push(
      checkHttp('Redpanda Admin', `http://127.0.0.1:${integer(process.env.REDPANDA_ADMIN_HOST_PORT, 19644, 1, 65535)}/v1/status/ready`),
      checkHttp('MinIO', `http://127.0.0.1:${integer(process.env.MINIO_API_HOST_PORT, 9000, 1, 65535)}/minio/health/live`),
      checkHttp('ClickHouse', `http://127.0.0.1:${integer(process.env.CLICKHOUSE_HTTP_HOST_PORT, 8123, 1, 65535)}/ping`),
    );
  }

  if (phase >= 3) {
    checks.push(
      checkHttp('MLflow', `http://127.0.0.1:${integer(process.env.MLFLOW_HOST_PORT, 5000, 1, 65535)}/health`),
    );
  }

  if (phase >= 4) {
    checks.push(
      checkHttp('Besu JSON-RPC', `http://127.0.0.1:${integer(process.env.BESU_RPC_HOST_PORT, 8545, 1, 65535)}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] }),
      }),
      checkHttp('Evidence Ledger', `http://127.0.0.1:${integer(process.env.LEDGER_GATEWAY_HOST_PORT, 8787, 1, 65535)}/health`),
    );
  }

  if (phase === 0) {
    console.log(JSON.stringify({ phase, status: 'disabled', checks: [] }, null, 2));
    return;
  }

  const results = await Promise.all(checks);
  const failed = results.filter(result => !result.ok);
  console.log(JSON.stringify({
    phase,
    status: failed.length === 0 ? 'healthy' : 'degraded',
    checkedAt: new Date().toISOString(),
    results,
  }, null, 2));

  if (failed.length > 0) process.exitCode = 1;
}

main().catch(error => {
  console.error('[platform-health]', error);
  process.exit(1);
});
