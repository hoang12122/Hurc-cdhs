import { Pool } from 'pg';
import { CONVERGED_PLATFORM_CONFIG } from '@/lib/config/converged-platform-profile';

export interface TelemetrySnapshot {
  assetId: string;
  lastSeenAt: Date | null;
  total24h: number;
  error24h: number;
  anomalyScore: number | null;
}

type ClickHouseRow = {
  asset_id: string;
  last_seen_at: string | null;
  total_24h: string | number;
  error_24h: string | number;
  anomaly_score: string | number | null;
};

type TimescaleRow = {
  asset_id: string;
  last_seen_at: Date | null;
  total_24h: string;
  error_24h: string;
  anomaly_score: number | null;
};

let telemetryPool: Pool | null = null;

const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase();
const finiteNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

function parsedDate(value: string | Date | null): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function mapRows(rows: ClickHouseRow[] | TimescaleRow[]): Map<string, TelemetrySnapshot> {
  return new Map(rows.map(row => [
    normalize(row.asset_id),
    {
      assetId: row.asset_id,
      lastSeenAt: parsedDate(row.last_seen_at),
      total24h: Number(row.total_24h ?? 0),
      error24h: Number(row.error_24h ?? 0),
      anomalyScore: finiteNumber(row.anomaly_score),
    },
  ] as const));
}

async function loadClickHouseTelemetry(): Promise<Map<string, TelemetrySnapshot>> {
  if (CONVERGED_PLATFORM_CONFIG.phase < 2) return new Map();
  const query = `
    SELECT
      asset_id,
      max(last_seen_at) AS last_seen_at,
      sumIf(event_count, bucket >= now() - INTERVAL 24 HOUR) AS total_24h,
      sumIf(error_count + warning_count, bucket >= now() - INTERVAL 24 HOUR) AS error_24h,
      if(sum(anomaly_count) = 0, NULL, sum(anomaly_score_sum) / sum(anomaly_count)) AS anomaly_score
    FROM hurc.telemetry_gold_hourly
    WHERE bucket >= now() - INTERVAL 30 DAY
    GROUP BY asset_id
    LIMIT 5000
    FORMAT JSON
  `;
  const user = process.env.CLICKHOUSE_USER;
  const password = process.env.CLICKHOUSE_PASSWORD;
  const headers: Record<string, string> = { 'content-type': 'text/plain' };
  if (user) {
    headers.authorization = `Basic ${Buffer.from(`${user}:${password ?? ''}`).toString('base64')}`;
  }
  const response = await fetch(CONVERGED_PLATFORM_CONFIG.endpoints.clickhouseUrl, {
    method: 'POST',
    headers,
    body: query,
    cache: 'no-store',
    signal: AbortSignal.timeout(3500),
  });
  if (!response.ok) throw new Error(`ClickHouse HTTP ${response.status}`);
  const payload = await response.json() as { data?: ClickHouseRow[] };
  return mapRows(payload.data ?? []);
}

function getTelemetryPool(): Pool | null {
  if (CONVERGED_PLATFORM_CONFIG.phase < 1) return null;
  const connectionString = process.env.TIMESCALE_DATABASE_URL;
  if (!connectionString) return null;
  telemetryPool ??= new Pool({
    connectionString,
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 3_000,
    statement_timeout: 5_000,
  });
  return telemetryPool;
}

async function loadTimescaleTelemetry(): Promise<Map<string, TelemetrySnapshot>> {
  const pool = getTelemetryPool();
  if (!pool) return new Map();
  const result = await pool.query<TimescaleRow>(`
    SELECT
      asset_id,
      MAX(occurred_at) AS last_seen_at,
      COUNT(*) FILTER (WHERE occurred_at >= NOW() - INTERVAL '24 hours') AS total_24h,
      COUNT(*) FILTER (
        WHERE occurred_at >= NOW() - INTERVAL '24 hours'
          AND LOWER(quality_status) NOT IN ('good', 'ok', 'healthy', 'normal')
      ) AS error_24h,
      MAX(
        CASE
          WHEN payload ->> 'anomalyScore' ~ '^[0-9]+([.][0-9]+)?$'
          THEN (payload ->> 'anomalyScore')::double precision
          ELSE NULL
        END
      ) AS anomaly_score
    FROM telemetry_event
    WHERE occurred_at >= NOW() - INTERVAL '30 days'
    GROUP BY asset_id
    LIMIT 5000
  `);
  return mapRows(result.rows);
}

export async function loadTelemetry(): Promise<Map<string, TelemetrySnapshot>> {
  if (CONVERGED_PLATFORM_CONFIG.phase >= 2) {
    try {
      const gold = await loadClickHouseTelemetry();
      if (gold.size > 0) return gold;
    } catch (error) {
      console.warn('[digital-twin] Gold telemetry unavailable:', error instanceof Error ? error.message : error);
    }
  }
  try {
    return await loadTimescaleTelemetry();
  } catch (error) {
    console.warn('[digital-twin] Timescale telemetry unavailable:', error instanceof Error ? error.message : error);
    return new Map();
  }
}
