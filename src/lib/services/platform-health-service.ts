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

export interface EtlSinkHealth {
  received: number;
  inserted: number;
  duplicates: number;
  conflicts: number;
  invalid: number;
  commits: number;
  consumerLag: number;
  lastProcessedAt: string | null;
}

export interface EtlReplayHealth {
  activeRequestId: string | null;
  completed: number;
  failed: number;
  replayed: number;
  lastCompletedAt: string | null;
}

export interface EtlHealthSummary {
  received: number;
  normalized: number;
  invalid: number;
  lateEvents: number;
  qualityWarnings: number;
  publishFailures: number;
  commits: number;
  consumerLag: number;
  lastBatchSize: number;
  lastBatchLatencyMs: number;
  schemaRegistered: boolean;
  contractChecksum: string | null;
  lastProcessedAt: string | null;
  sink: EtlSinkHealth | null;
  replay: EtlReplayHealth | null;
}

export interface PlatformHealthOverview {
  phase: number;
  status: ComponentHealthStatus;
  components: PlatformComponentHealth[];
  outbox: { pending: number; retrying: number; oldestPendingSeconds: number | null } | null;
  etl: EtlHealthSummary | null;
  readiness: PlatformProductionReadiness;
  checkedAt: string;
}

type OutboxHealthRow = { pending: bigint; retrying: bigint; oldest_seconds: number | string | null };
type HealthPayload = Record<string, unknown> & { status?: string; lastError?: string | null };
type HealthResult<T> = { component: PlatformComponentHealth; stats: T | null };

const nowIso = () => new Date().toISOString();
const numberValue = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : 0;
const textValue = (value: unknown) => typeof value === 'string' && value ? value : null;

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

async function readServiceHealth<T>(
  id: string,
  name: string,
  url: string,
  map: (payload: HealthPayload) => T,
  detail: (stats: T) => string,
): Promise<HealthResult<T>> {
  if (CONVERGED_PLATFORM_CONFIG.phase < 2) return { component: disabled(id, name, 2), stats: null };
  const started = Date.now();
  try {
    const response = await fetch(`${url}/health`, { cache: 'no-store', signal: AbortSignal.timeout(3000) });
    const payload = await response.json() as HealthPayload;
    if (!response.ok || payload.status !== 'healthy') throw new Error(textValue(payload.lastError) || `HTTP ${response.status}`);
    const stats = map(payload);
    return {
      component: { id, name, phase: 2, status: 'HEALTHY', latencyMs: Date.now() - started, detail: detail(stats), checkedAt: nowIso() },
      stats,
    };
  } catch (error) {
    return {
      component: { id, name, phase: 2, status: 'DEGRADED', latencyMs: Date.now() - started, detail: error instanceof Error ? error.message : 'unreachable', checkedAt: nowIso() },
      stats: null,
    };
  }
}

function checkEtlNormalizer(): Promise<HealthResult<Omit<EtlHealthSummary, 'sink' | 'replay'>>> {
  return readServiceHealth(
    'etl-normalizer',
    'ETL Normalizer',
    CONVERGED_PLATFORM_CONFIG.endpoints.etlNormalizerUrl,
    payload => ({
      received: numberValue(payload.received), normalized: numberValue(payload.normalized),
      invalid: numberValue(payload.invalid), lateEvents: numberValue(payload.lateEvents),
      qualityWarnings: numberValue(payload.qualityWarnings), publishFailures: numberValue(payload.publishFailures),
      commits: numberValue(payload.commits), consumerLag: numberValue(payload.consumerLag),
      lastBatchSize: numberValue(payload.lastBatchSize), lastBatchLatencyMs: numberValue(payload.lastBatchLatencyMs),
      schemaRegistered: payload.schemaRegistered === true, contractChecksum: textValue(payload.contractChecksum),
      lastProcessedAt: textValue(payload.lastProcessedAt),
    }),
    stats => `Normalized ${stats.normalized}/${stats.received}; lag ${stats.consumerLag}; late ${stats.lateEvents}`,
  );
}

function checkEtlSink(): Promise<HealthResult<EtlSinkHealth>> {
  return readServiceHealth(
    'etl-timescale-sink',
    'ETL Timescale Sink',
    CONVERGED_PLATFORM_CONFIG.endpoints.etlTimescaleSinkUrl,
    payload => ({
      received: numberValue(payload.received), inserted: numberValue(payload.inserted),
      duplicates: numberValue(payload.duplicates), conflicts: numberValue(payload.conflicts),
      invalid: numberValue(payload.invalid), commits: numberValue(payload.commits),
      consumerLag: numberValue(payload.consumerLag), lastProcessedAt: textValue(payload.lastProcessedAt),
    }),
    stats => `Inserted ${stats.inserted}; duplicates ${stats.duplicates}; conflicts ${stats.conflicts}; lag ${stats.consumerLag}`,
  );
}

function checkEtlReplay(): Promise<HealthResult<EtlReplayHealth>> {
  return readServiceHealth(
    'etl-replay-worker',
    'ETL Replay Worker',
    CONVERGED_PLATFORM_CONFIG.endpoints.etlReplayWorkerUrl,
    payload => ({
      activeRequestId: textValue(payload.activeRequestId), completed: numberValue(payload.completed),
      failed: numberValue(payload.failed), replayed: numberValue(payload.replayed),
      lastCompletedAt: textValue(payload.lastCompletedAt),
    }),
    stats => `Replayed ${stats.replayed}; completed ${stats.completed}; failed ${stats.failed}`,
  );
}

async function loadOutboxHealth() {
  try {
    const rows = await opsDb.$queryRaw`
      SELECT COUNT(*) FILTER (WHERE published_at IS NULL) AS pending,
        COUNT(*) FILTER (WHERE published_at IS NULL AND attempt_count > 0) AS retrying,
        EXTRACT(EPOCH FROM (NOW() - MIN(created_at) FILTER (WHERE published_at IS NULL))) AS oldest_seconds
      FROM ops_outbox_events
    ` as OutboxHealthRow[];
    const row = rows[0];
    return {
      pending: Number(row?.pending ?? 0), retrying: Number(row?.retrying ?? 0),
      oldestPendingSeconds: row?.oldest_seconds == null ? null : Math.round(Number(row.oldest_seconds)),
    };
  } catch {
    return null;
  }
}

export async function getPlatformHealthOverview(): Promise<PlatformHealthOverview> {
  const phase = CONVERGED_PLATFORM_CONFIG.phase;
  const normalizerCheck = checkEtlNormalizer();
  const sinkCheck = checkEtlSink();
  const replayCheck = checkEtlReplay();
  const checks: Array<Promise<PlatformComponentHealth>> = [
    phase >= 1 ? checkTcp('mqtt', 'MQTT Broker', 1, CONVERGED_PLATFORM_CONFIG.endpoints.mqttUrl) : Promise.resolve(disabled('mqtt', 'MQTT Broker', 1)),
    checkTimescale(),
    phase >= 2 ? checkHttp('schema-registry', 'Redpanda / Schema Registry', 2, `${CONVERGED_PLATFORM_CONFIG.endpoints.schemaRegistryUrl}/subjects`) : Promise.resolve(disabled('schema-registry', 'Redpanda / Schema Registry', 2)),
    normalizerCheck.then(result => result.component), sinkCheck.then(result => result.component), replayCheck.then(result => result.component),
    phase >= 2 ? checkHttp('minio', 'MinIO Bronze / Silver', 2, `${CONVERGED_PLATFORM_CONFIG.endpoints.minioUrl}/minio/health/live`) : Promise.resolve(disabled('minio', 'MinIO Bronze / Silver', 2)),
    phase >= 2 ? checkHttp('clickhouse', 'ClickHouse Silver / Gold', 2, `${CONVERGED_PLATFORM_CONFIG.endpoints.clickhouseUrl}/ping`) : Promise.resolve(disabled('clickhouse', 'ClickHouse Silver / Gold', 2)),
    phase >= 3 ? checkHttp('mlflow', 'MLflow Registry', 3, `${CONVERGED_PLATFORM_CONFIG.endpoints.mlflowUrl}/health`) : Promise.resolve(disabled('mlflow', 'MLflow Registry', 3)),
    phase >= 4 ? checkHttp('besu', 'Besu Ledger', 4, CONVERGED_PLATFORM_CONFIG.endpoints.besuRpcUrl, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] }) }) : Promise.resolve(disabled('besu', 'Besu Ledger', 4)),
    phase >= 4 ? checkHttp('evidence-ledger', 'Evidence Ledger Gateway', 4, `${CONVERGED_PLATFORM_CONFIG.endpoints.ledgerGatewayUrl}/health`) : Promise.resolve(disabled('evidence-ledger', 'Evidence Ledger Gateway', 4)),
  ];

  const [components, outbox, normalizer, sink, replay] = await Promise.all([
    Promise.all(checks), loadOutboxHealth(), normalizerCheck.then(result => result.stats),
    sinkCheck.then(result => result.stats), replayCheck.then(result => result.stats),
  ]);
  const enabled = components.filter(item => item.status !== 'DISABLED');
  const status: ComponentHealthStatus = enabled.some(item => item.status === 'DEGRADED') ? 'DEGRADED' : 'HEALTHY';
  const etl = normalizer ? { ...normalizer, sink, replay } : null;
  return { phase, status, components, outbox, etl, readiness: evaluatePlatformProductionReadiness(), checkedAt: nowIso() };
}
