import { Pool } from 'pg';
import { CONVERGED_PLATFORM_CONFIG } from '@/lib/config/converged-platform-profile';

export interface EtlPipelineRunSummary {
  runId: string;
  pipelineName: string;
  mode: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  inputCount: number;
  outputCount: number;
  duplicateCount: number;
  conflictCount: number;
  invalidCount: number;
  lateCount: number;
  lastError: string | null;
}

export interface EtlQualityIssueSummary {
  id: string;
  eventId: string | null;
  code: string;
  severity: string;
  detail: string | null;
  topic: string;
  partition: number | null;
  offset: number | null;
  observedAt: string;
}

export interface EtlCollisionSummary {
  eventId: string;
  seenCount: number;
  conflictCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
}

export interface EtlReplaySummary {
  id: string;
  sourceTopic: string;
  targetTopic: string;
  status: string;
  requestedBy: string;
  approvedBy: string | null;
  requestedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  replayedCount: number;
  attemptCount: number;
  heartbeatAt: string | null;
  lastError: string | null;
}

export interface EtlOperationsOverview {
  available: boolean;
  generatedAt: string;
  pipelineRuns: EtlPipelineRunSummary[];
  qualityIssues: EtlQualityIssueSummary[];
  collisions: EtlCollisionSummary[];
  replayRequests: EtlReplaySummary[];
  error: string | null;
}

type Row = Record<string, unknown>;

const numberValue = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : 0;
const textValue = (value: unknown) => value == null ? null : String(value);
const isoValue = (value: unknown) => {
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toISOString();
};
const nullableIso = (value: unknown) => value == null ? null : isoValue(value);

export async function getEtlOperationsOverview(): Promise<EtlOperationsOverview> {
  const generatedAt = new Date().toISOString();
  if (CONVERGED_PLATFORM_CONFIG.phase < 2 || !process.env.TIMESCALE_DATABASE_URL) {
    return {
      available: false,
      generatedAt,
      pipelineRuns: [],
      qualityIssues: [],
      collisions: [],
      replayRequests: [],
      error: 'Canonical ETL requires Phase 2 and TIMESCALE_DATABASE_URL.',
    };
  }

  const pool = new Pool({
    connectionString: process.env.TIMESCALE_DATABASE_URL,
    max: 1,
    connectionTimeoutMillis: 2500,
    idleTimeoutMillis: 1000,
  });

  try {
    const [runResult, qualityResult, collisionResult, replayResult] = await Promise.all([
      pool.query<Row>(`
        SELECT run_id, pipeline_name, mode, status, started_at, completed_at,
          input_count, output_count, duplicate_count, conflict_count,
          invalid_count, late_count, last_error
        FROM etl_pipeline_run
        ORDER BY started_at DESC
        LIMIT 10
      `),
      pool.query<Row>(`
        SELECT id, event_id, code, severity, detail, topic,
          partition_id, offset_id, observed_at
        FROM etl_data_quality_event
        ORDER BY observed_at DESC
        LIMIT 20
      `),
      pool.query<Row>(`
        SELECT event_id, seen_count, conflict_count, first_seen_at, last_seen_at
        FROM etl_event_identity
        WHERE conflict_count > 0
        ORDER BY last_seen_at DESC
        LIMIT 10
      `),
      pool.query<Row>(`
        SELECT id, source_topic, target_topic, status, requested_by, approved_by,
          requested_at, started_at, completed_at, replayed_count,
          attempt_count, heartbeat_at, last_error
        FROM etl_replay_request
        ORDER BY requested_at DESC
        LIMIT 10
      `),
    ]);

    return {
      available: true,
      generatedAt,
      pipelineRuns: runResult.rows.map(row => ({
        runId: String(row.run_id),
        pipelineName: String(row.pipeline_name),
        mode: String(row.mode),
        status: String(row.status),
        startedAt: isoValue(row.started_at),
        completedAt: nullableIso(row.completed_at),
        inputCount: numberValue(row.input_count),
        outputCount: numberValue(row.output_count),
        duplicateCount: numberValue(row.duplicate_count),
        conflictCount: numberValue(row.conflict_count),
        invalidCount: numberValue(row.invalid_count),
        lateCount: numberValue(row.late_count),
        lastError: textValue(row.last_error),
      })),
      qualityIssues: qualityResult.rows.map(row => ({
        id: String(row.id),
        eventId: textValue(row.event_id),
        code: String(row.code),
        severity: String(row.severity),
        detail: textValue(row.detail),
        topic: String(row.topic),
        partition: row.partition_id == null ? null : numberValue(row.partition_id),
        offset: row.offset_id == null ? null : numberValue(row.offset_id),
        observedAt: isoValue(row.observed_at),
      })),
      collisions: collisionResult.rows.map(row => ({
        eventId: String(row.event_id),
        seenCount: numberValue(row.seen_count),
        conflictCount: numberValue(row.conflict_count),
        firstSeenAt: isoValue(row.first_seen_at),
        lastSeenAt: isoValue(row.last_seen_at),
      })),
      replayRequests: replayResult.rows.map(row => ({
        id: String(row.id),
        sourceTopic: String(row.source_topic),
        targetTopic: String(row.target_topic),
        status: String(row.status),
        requestedBy: String(row.requested_by),
        approvedBy: textValue(row.approved_by),
        requestedAt: isoValue(row.requested_at),
        startedAt: nullableIso(row.started_at),
        completedAt: nullableIso(row.completed_at),
        replayedCount: numberValue(row.replayed_count),
        attemptCount: numberValue(row.attempt_count),
        heartbeatAt: nullableIso(row.heartbeat_at),
        lastError: textValue(row.last_error),
      })),
      error: null,
    };
  } catch (error) {
    return {
      available: false,
      generatedAt,
      pipelineRuns: [],
      qualityIssues: [],
      collisions: [],
      replayRequests: [],
      error: error instanceof Error ? error.message : 'Unable to query ETL operations.',
    };
  } finally {
    await pool.end().catch(() => undefined);
  }
}
