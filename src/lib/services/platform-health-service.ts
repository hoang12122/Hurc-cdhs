import net from 'node:net';
import { Pool } from 'pg';
import { CONVERGED_PLATFORM_CONFIG } from '@/lib/config/converged-platform-profile';
import { opsDb } from '@/lib/prisma';

export type ComponentHealthStatus = 'HEALTHY' | 'DEGRADED' | 'DISABLED';

export interface PlatformComponentHealth {
  id: string;
  name: string;
  phase: number;
  status: ComponentHealthStatus;
  latencyMs: number | null;
  detail: string;
  checkedAt: string;
}

export interface PlatformHealthOverview {
  phase: number;
  status: ComponentHealthStatus;
  components: PlatformComponentHealth[];
  outbox: {
    pending: number;
    retrying: number;
    oldestPendingSeconds: number | null;
  } | null;
  checkedAt: string;
}

const nowIso = () => new Date().toISOString();

async function checkTcp(id: string, name: string, phase: number, urlValue: string): Promise<PlatformComponentHealth> {
  const started = Date.now();
  try {
    const url = new URL(urlValue);
    const port = Number(url.port || (url.protocol === 'mqtts:' ? 8883 : 1883));
    await new Promise<void>((resolve, reject) => {
      const socket = net.createConnection({ host: url.hostname, port });
      const timer = setTimeout(() => socket.destroy(new Error('timeout')), 2500);
      socket.once('connect', () => { clearTimeout(timer); socket.end(); resolve(); });
      socket.once('error', error => { clearTimeout(timer); reject(error); });
    });
    return { id, name, phase, status: 'HEALTHY', latencyMs: Date.now() - started, detail: 'TCP reachable', checkedAt: nowIso() };
  } catch (error) {
    return { id, name, phase, status: 'DEGRADED', latencyMs: Date.now() - started, detail: error instanceof Error ? error.message : 'unreachable', checkedAt: nowIso() };
  }
}

async function checkHttp(
  id: string,
  name: string,
  phase: number,
  url: string,
  init?: RequestInit,
): Promise<PlatformComponentHealth> {
  const started = Date.now();
  try {
    const response = await fetch(url, { ...init, cache: 'no-store', signal: AbortSignal.timeout(3000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { id, name, phase, status: 'HEALTHY', latencyMs: Date.now() - started, detail: 'Endpoint reachable', checkedAt: nowIso() };
  } catch (error) {
    return { id, name, phase, status: 'DEGRADED', latencyMs: Date.now() - started, detail: error instanceof Error ? error.message : 'unreachable', checkedAt: nowIso() };
  }
}

async function checkTimescale(): Promise<PlatformComponentHealth> {
  const started = Date.now();
  if (CONVERGED_PLATFORM_CONFIG.phase < 1 || !process.env.TIMESCALE_DATABASE_URL) {
    return { id: 'timescale', name: 'TimescaleDB', phase: 1, status: 'DISABLED', latencyMs: null, detail: 'Phase or connection is disabled', checkedAt: nowIso() };
  }
  const pool = new Pool({ connectionString: process.env.TIMESCALE_DATABASE_URL, max: 1, connectionTimeoutMillis: 2500 });
  try {
    await pool.query('SELECT 1');
    return { id: 'timescale', name: 'TimescaleDB', phase: 1, status: 'HEALTHY', latencyMs: Date.now() - started, detail: 'Database query succeeded', checkedAt: nowIso() };
  } catch (error) {
    return { id: 'timescale', name: 'TimescaleDB', phase: 1, status: 'DEGRADED', latencyMs: Date.now() - started, detail: error instanceof Error ? error.message : 'query failed', checkedAt: nowIso() };
  } finally {
    await pool.end().catch(() => undefined);
  }
}

function disabled(id: string, name: string, phase: number): PlatformComponentHealth {
  return { id, name, phase, status: 'DISABLED', latencyMs: null, detail: `Requires phase ${phase}`, checkedAt: nowIso() };
}

async function loadOutboxHealth() {
  try {
    const rows = await opsDb.$queryRawUnsafe<Array<{ pending: bigint; retrying: bigint; oldest_seconds: number | null }>>(`
      SELECT
        COUNT(*) FILTER (WHERE published_at IS NULL) AS pending,
        COUNT(*) FILTER (WHERE published_at IS NULL AND attempt_count > 0) AS retrying,
        EXTRACT(EPOCH FROM (NOW() - MIN(created_at) FILTER (WHERE published_at IS NULL))) AS oldest_seconds
      FROM ops_outbox_events
    `);
    const row = rows[0];
    return {
      pending: Number(row?.pending ?? 0),
      retrying: Number(row?.retrying ?? 0),
      oldestPendingSeconds: row?.oldest_seconds === null || row?.oldest_seconds === undefined ? null : Math.round(Number(row.oldest_seconds)),
    };
  } catch {
    return null;
  }
}

export async function getPlatformHealthOverview(): Promise<PlatformHealthOverview> {
  const phase = CONVERGED_PLATFORM_CONFIG.phase;
  const checks: Array<Promise<PlatformComponentHealth>> = [];

  checks.push(phase >= 1
    ? checkTcp('mqtt', 'MQTT Broker', 1, CONVERGED_PLATFORM_CONFIG.endpoints.mqttUrl)
    : Promise.resolve(disabled('mqtt', 'MQTT Broker', 1)));
  checks.push(checkTimescale());
  checks.push(phase >= 2
    ? checkHttp('schema-registry', 'Redpanda / Schema Registry', 2, `${CONVERGED_PLATFORM_CONFIG.endpoints.schemaRegistryUrl}/subjects`)
    : Promise.resolve(disabled('schema-registry', 'Redpanda / Schema Registry', 2)));
  checks.push(phase >= 2
    ? checkHttp('minio', 'MinIO Raw Zone', 2, `${CONVERGED_PLATFORM_CONFIG.endpoints.minioUrl}/minio/health/live`)
    : Promise.resolve(disabled('minio', 'MinIO Raw Zone', 2)));
  checks.push(phase >= 2
    ? checkHttp('clickhouse', 'ClickHouse OLAP', 2, `${CONVERGED_PLATFORM_CONFIG.endpoints.clickhouseUrl}/ping`)
    : Promise.resolve(disabled('clickhouse', 'ClickHouse OLAP', 2)));
  checks.push(phase >= 3
    ? checkHttp('mlflow', 'MLflow Registry', 3, `${CONVERGED_PLATFORM_CONFIG.endpoints.mlflowUrl}/health`)
    : Promise.resolve(disabled('mlflow', 'MLflow Registry', 3)));
  checks.push(phase >= 4
    ? checkHttp('besu', 'Besu Ledger', 4, CONVERGED_PLATFORM_CONFIG.endpoints.besuRpcUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] }),
    })
    : Promise.resolve(disabled('besu', 'Besu Ledger', 4)));
  checks.push(phase >= 4
    ? checkHttp('evidence-ledger', 'Evidence Ledger Gateway', 4, `${CONVERGED_PLATFORM_CONFIG.endpoints.ledgerGatewayUrl}/health`)
    : Promise.resolve(disabled('evidence-ledger', 'Evidence Ledger Gateway', 4)));

  const [components, outbox] = await Promise.all([Promise.all(checks), loadOutboxHealth()]);
  const enabled = components.filter(item => item.status !== 'DISABLED');
  const status: ComponentHealthStatus = enabled.some(item => item.status === 'DEGRADED') ? 'DEGRADED' : 'HEALTHY';

  return { phase, status, components, outbox, checkedAt: nowIso() };
}
