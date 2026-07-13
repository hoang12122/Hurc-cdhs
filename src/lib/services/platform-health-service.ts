import net from 'node:net';
import { Pool } from 'pg';
import { CONVERGED_PLATFORM_CONFIG } from '@/lib/config/converged-platform-profile';
import { evaluatePlatformProductionReadiness, type PlatformProductionReadiness } from '@/lib/config/platform-production-readiness';
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

export interface EtlHealthSummary {
  received: number;
  normalized: number;
  invalid: number;
  qualityWarnings: number;
  publishFailures: number;
  commits: number;
  lastProcessedAt: string | null;
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
  etl: EtlHealthSummary | null;
  readiness: PlatformProductionReadiness;
  checkedAt: string;
}

type OutboxHealthRow = {
  pending: bigint;
  retrying: bigint;
  oldest_seconds: number | string | null;
};

type EtlHealthPayload = Partial<EtlHealthSummary> & {
  status?: string;
  lastError?: string | null;
};

const nowIso = () => new Date().toISOString();
const numberValue = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : 0;

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

async function checkEtlNormalizer(): Promise<{ component: PlatformComponentHealth; stats: EtlHealthSummary | null }> {
  if (CONVERGED_PLATFORM_CONFIG.phase < 2) {
    return { component: disabled('etl-normalizer', 'ETL Normalizer', 2), stats: null };
  }
  const started = Date.now();
  try {
    const response = await fetch(`${CONVERGED_PLATFORM_CONFIG.endpoints.etlNormalizerUrl}/health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    const payload = await response.json() as EtlHealthPayload;
    if (!response.ok || payload.status !== 'healthy') {
      throw new Error(payload.lastError || `HTTP ${response.status}`);
    }
    const stats: EtlHealthSummary = {
      received: numberValue(payload.received),
      normalized: numberValue(payload.normalized),
      invalid: numberValue(payload.invalid),
      qualityWarnings: numberValue(payload.qualityWarnings),
      publishFailures: numberValue(payload.publishFailures),
      commits: numberValue(payload.commits),
      lastProcessedAt: typeof payload.lastProcessedAt === 'string' ? payload.lastProcessedAt : null,
    };
    const detail = `Normalized ${stats.normalized}/${stats.received}; invalid ${stats.invalid}; warnings ${stats.qualityWarnings}`;
    return {
      component: { id: 'etl-normalizer', name: 'ETL Normalizer', phase: 2, status: 'HEALTHY', latencyMs: Date.now() - started, detail, checkedAt: nowIso() },
      stats,
    };
  } catch (error) {
    return {
      component: { id: 'etl-normalizer', name: 'ETL Normalizer', phase: 2, status: 'DEGRADED', latencyMs: Date.now() - started, detail: error instanceof Error ? error.message : 'unreachable', checkedAt: nowIso() },
      stats: null,
    };
  }
}

async function loadOutboxHealth() {
  try {
    const rows = await opsDb.$queryRaw`
      SELECT
        COUNT(*) FILTER (WHERE published_at IS NULL) AS pending,
        COUNT(*) FILTER (WHERE published_at IS NULL AND attempt_count > 0) AS retrying,
        EXTRACT(EPOCH FROM (NOW() - MIN(created_at) FILTER (WHERE published_at IS NULL))) AS oldest_seconds
      FROM ops_outbox_events
    ` as OutboxHealthRow[];
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
  const etlCheck = checkEtlNormalizer();

  checks.push(phase >= 1
    ? checkTcp('mqtt', 'MQTT Broker', 1, CONVERGED_PLATFORM_CONFIG.endpoints.mqttUrl)
    : Promise.resolve(disabled('mqtt', 'MQTT Broker', 1)));
  checks.push(checkTimescale());
  checks.push(phase >= 2
    ? checkHttp('schema-registry', 'Redpanda / Schema Registry', 2, `${CONVERGED_PLATFORM_CONFIG.endpoints.schemaRegistryUrl}/subjects`)
    : Promise.resolve(disabled('schema-registry', 'Redpanda / Schema Registry', 2)));
  checks.push(etlCheck.then(result => result.component));
  checks.push(phase >= 2
    ? checkHttp('minio', 'MinIO Bronze / Silver', 2, `${CONVERGED_PLATFORM_CONFIG.endpoints.minioUrl}/minio/health/live`)
    : Promise.resolve(disabled('minio', 'MinIO Bronze / Silver', 2)));
  checks.push(phase >= 2
    ? checkHttp('clickhouse', 'ClickHouse Silver / Gold', 2, `${CONVERGED_PLATFORM_CONFIG.endpoints.clickhouseUrl}/ping`)
    : Promise.resolve(disabled('clickhouse', 'ClickHouse Silver / Gold', 2)));
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

  const [components, outbox, etl] = await Promise.all([
    Promise.all(checks),
    loadOutboxHealth(),
    etlCheck.then(result => result.stats),
  ]);
  const enabled = components.filter(item => item.status !== 'DISABLED');
  const status: ComponentHealthStatus = enabled.some(item => item.status === 'DEGRADED') ? 'DEGRADED' : 'HEALTHY';
  const readiness = evaluatePlatformProductionReadiness();

  return { phase, status, components, outbox, etl, readiness, checkedAt: nowIso() };
}
