import { Pool } from 'pg';
import { getAssetsInternal } from '../asset-service';
import { getDnfsInternal } from '../dnf-service';
import { getInternalHazards } from '../ops-service';
import { CONVERGED_PLATFORM_CONFIG } from '@/lib/config/converged-platform-profile';
import { calculateTwinHealth, type TwinHealthResult } from './health-engine';

interface TelemetrySnapshot {
  assetId: string;
  lastSeenAt: Date | null;
  total24h: number;
  error24h: number;
  anomalyScore: number | null;
}

export interface DigitalTwinAssetOverview {
  id: string;
  code: string;
  name: string;
  stationId: string | null;
  subsystem: string | null;
  criticality: string | null;
  lastTelemetryAt: string | null;
  openDnfs: number;
  openHazards: number;
  health: TwinHealthResult;
}

export interface DigitalTwinOverview {
  generatedAt: string;
  platformPhase: number;
  telemetryAvailable: boolean;
  overallScore: number;
  counts: Record<'healthy' | 'watch' | 'degraded' | 'critical', number>;
  assets: DigitalTwinAssetOverview[];
}

let telemetryPool: Pool | null = null;

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

async function loadTelemetry(): Promise<Map<string, TelemetrySnapshot>> {
  const pool = getTelemetryPool();
  if (!pool) return new Map();
  try {
    const result = await pool.query<{
      asset_id: string;
      last_seen_at: Date | null;
      total_24h: string;
      error_24h: string;
      anomaly_score: number | null;
    }>(`
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
    return new Map(result.rows.map(row => [row.asset_id, {
      assetId: row.asset_id,
      lastSeenAt: row.last_seen_at,
      total24h: Number(row.total_24h),
      error24h: Number(row.error_24h),
      anomalyScore: row.anomaly_score,
    }]));
  } catch (error) {
    console.warn('[digital-twin] telemetry query unavailable:', error instanceof Error ? error.message : error);
    return new Map();
  }
}

const OPEN_DNF_STATUSES = new Set(['Mới', 'Mới lập', 'Đánh giá', 'Xử lý', 'Phản hồi', 'Open', 'In Progress']);
const CLOSED_HAZARD_STATUSES = new Set(['Đóng', 'Closed', 'Hủy', 'Cancelled']);

function assetMatchesDnf(asset: any, dnf: any): boolean {
  const equipment = String(dnf.failedComponentEquipmentLRUTrainNumber ?? dnf.equipmentId ?? '').toLowerCase();
  const identifiers = [asset.id, asset.code].filter(Boolean).map((value: unknown) => String(value).toLowerCase());
  return identifiers.some(identifier => equipment === identifier || equipment.includes(identifier));
}

function assetMatchesHazard(asset: any, hazard: any, linkedDnfIds: Set<string>): boolean {
  if (hazard.linkedDnfId && linkedDnfIds.has(hazard.linkedDnfId)) return true;
  const subsystem = String(asset.subsystem ?? asset.systemId ?? '').toLowerCase();
  const systemGroup = String(hazard.systemGroup ?? '').toLowerCase();
  const stationId = String(asset.stationId ?? '').toLowerCase();
  const locations = Array.isArray(hazard.locationIds) ? hazard.locationIds.map((value: unknown) => String(value).toLowerCase()) : [];
  return Boolean(subsystem && systemGroup && (subsystem === systemGroup || systemGroup.includes(subsystem)))
    && (!stationId || locations.length === 0 || locations.includes(stationId));
}

function completenessFor(asset: any, telemetry: TelemetrySnapshot | undefined): number {
  let score = 0.35;
  if (telemetry) score += 0.35;
  if (asset.stationId) score += 0.1;
  if (asset.systemId || asset.subsystem) score += 0.1;
  if (asset.criticality) score += 0.1;
  return Math.min(1, score);
}

function minutesSince(value: Date | null | undefined): number | null {
  if (!value) return null;
  return Math.max(0, (Date.now() - value.getTime()) / 60_000);
}

export async function getDigitalTwinOverview(): Promise<DigitalTwinOverview> {
  const [assets, dnfs, hazards, telemetryByAsset] = await Promise.all([
    getAssetsInternal(),
    getDnfsInternal(),
    getInternalHazards(),
    loadTelemetry(),
  ]);

  const now = Date.now();
  const result = (assets as any[]).slice(0, 500).map(asset => {
    const assetDnfs = (dnfs as any[]).filter(dnf => assetMatchesDnf(asset, dnf));
    const openDnfs = assetDnfs.filter(dnf => OPEN_DNF_STATUSES.has(String(dnf.status)));
    const linkedDnfIds = new Set(assetDnfs.map(dnf => String(dnf.id)));
    const assetHazards = (hazards as any[]).filter(hazard => assetMatchesHazard(asset, hazard, linkedDnfIds));
    const openHazards = assetHazards.filter(hazard => !CLOSED_HAZARD_STATUSES.has(String(hazard.status)));
    const telemetry = telemetryByAsset.get(String(asset.id)) ?? telemetryByAsset.get(String(asset.code));
    const total24h = telemetry?.total24h ?? 0;
    const errorRatio = total24h > 0 ? (telemetry?.error24h ?? 0) / total24h : null;
    const overdueDnfs = openDnfs.filter(dnf => now - new Date(dnf.createdAt ?? now).getTime() > 7 * 86_400_000).length;
    const nextMaintenance = asset.nextMaintenanceDate ? new Date(asset.nextMaintenanceDate).getTime() : null;

    const health = calculateTwinHealth({
      openDnfs: openDnfs.length,
      criticalDnfs: openDnfs.filter(dnf => dnf.priority === 'Cao' || dnf.hazardLevelId === 'high').length,
      overdueDnfs,
      openHazards: openHazards.length,
      criticalHazards: openHazards.filter(hazard => ['HIGH', 'CRITICAL', 'CATASTROPHIC', 'Đỏ'].includes(String(hazard.riskLevelId ?? hazard.severityId))).length,
      inspectionFindings: Number(asset.openInspectionFindings ?? 0),
      telemetryAgeMinutes: minutesSince(telemetry?.lastSeenAt),
      telemetryErrorRatio: errorRatio,
      anomalyScore: telemetry?.anomalyScore ?? null,
      dataCompleteness: completenessFor(asset, telemetry),
      maintenanceOverdue: nextMaintenance !== null && nextMaintenance < now,
      previousScore: typeof asset.healthScore === 'number' ? asset.healthScore : null,
    });

    return {
      id: String(asset.id),
      code: String(asset.code ?? asset.id),
      name: String(asset.name ?? asset.code ?? asset.id),
      stationId: asset.stationId ? String(asset.stationId) : null,
      subsystem: asset.subsystem ?? asset.systemId ? String(asset.subsystem ?? asset.systemId) : null,
      criticality: asset.criticality ? String(asset.criticality) : null,
      lastTelemetryAt: telemetry?.lastSeenAt?.toISOString() ?? null,
      openDnfs: openDnfs.length,
      openHazards: openHazards.length,
      health,
    } satisfies DigitalTwinAssetOverview;
  }).sort((a, b) => a.health.score - b.health.score);

  const counts = { healthy: 0, watch: 0, degraded: 0, critical: 0 };
  result.forEach(asset => { counts[asset.health.band.toLowerCase() as keyof typeof counts] += 1; });
  const overallScore = result.length > 0
    ? Math.round(result.reduce((sum, asset) => sum + asset.health.score, 0) / result.length)
    : 0;

  return {
    generatedAt: new Date().toISOString(),
    platformPhase: CONVERGED_PLATFORM_CONFIG.phase,
    telemetryAvailable: telemetryByAsset.size > 0,
    overallScore,
    counts,
    assets: result,
  };
}
