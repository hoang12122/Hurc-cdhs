ALTER TABLE telemetry_event
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS quality_score SMALLINT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quality_flags TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS event_checksum CHAR(64),
  ADD COLUMN IF NOT EXISTS payload_bytes INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS processing_latency_ms BIGINT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS event_age_ms BIGINT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS late_event BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS lateness_ms BIGINT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS source_topic TEXT,
  ADD COLUMN IF NOT EXISTS source_partition INTEGER,
  ADD COLUMN IF NOT EXISTS source_offset BIGINT,
  ADD COLUMN IF NOT EXISTS ingest_version BIGINT;

CREATE INDEX IF NOT EXISTS telemetry_quality_time_idx
  ON telemetry_event (quality_score, occurred_at DESC);
CREATE INDEX IF NOT EXISTS telemetry_late_time_idx
  ON telemetry_event (occurred_at DESC)
  WHERE late_event = TRUE;
CREATE UNIQUE INDEX IF NOT EXISTS telemetry_source_offset_idx
  ON telemetry_event (source_topic, source_partition, source_offset)
  WHERE source_topic IS NOT NULL
    AND source_partition IS NOT NULL
    AND source_offset IS NOT NULL;

CREATE TABLE IF NOT EXISTS etl_event_identity (
  event_id TEXT PRIMARY KEY,
  event_checksum CHAR(64) NOT NULL,
  first_source_topic TEXT NOT NULL,
  first_source_partition INTEGER NOT NULL,
  first_source_offset BIGINT NOT NULL,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  seen_count BIGINT NOT NULL DEFAULT 1,
  conflict_count BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS etl_pipeline_run (
  run_id UUID PRIMARY KEY,
  pipeline_name TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('STREAM', 'REPLAY', 'BACKFILL')),
  status TEXT NOT NULL CHECK (status IN ('RUNNING', 'COMPLETED', 'FAILED', 'ABORTED')),
  contract_version TEXT NOT NULL,
  code_version TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  input_count BIGINT NOT NULL DEFAULT 0,
  output_count BIGINT NOT NULL DEFAULT 0,
  duplicate_count BIGINT NOT NULL DEFAULT 0,
  conflict_count BIGINT NOT NULL DEFAULT 0,
  invalid_count BIGINT NOT NULL DEFAULT 0,
  late_count BIGINT NOT NULL DEFAULT 0,
  source_offsets JSONB NOT NULL DEFAULT '{}'::JSONB,
  last_error TEXT
);

CREATE INDEX IF NOT EXISTS etl_pipeline_run_started_idx
  ON etl_pipeline_run (pipeline_name, started_at DESC);

CREATE TABLE IF NOT EXISTS etl_lineage_event (
  source_topic TEXT NOT NULL,
  source_partition INTEGER NOT NULL,
  source_offset BIGINT NOT NULL,
  event_id TEXT NOT NULL,
  event_checksum CHAR(64) NOT NULL,
  target_name TEXT NOT NULL,
  run_id UUID,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (source_topic, source_partition, source_offset, target_name)
);

CREATE INDEX IF NOT EXISTS etl_lineage_event_id_idx
  ON etl_lineage_event (event_id, processed_at DESC);

CREATE TABLE IF NOT EXISTS etl_checkpoint (
  pipeline_name TEXT NOT NULL,
  source_topic TEXT NOT NULL,
  partition_id INTEGER NOT NULL,
  committed_offset BIGINT NOT NULL,
  watermark TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (pipeline_name, source_topic, partition_id)
);

DELETE FROM etl_data_quality_event older
USING etl_data_quality_event newer
WHERE older.id < newer.id
  AND older.topic = newer.topic
  AND older.partition_id IS NOT DISTINCT FROM newer.partition_id
  AND older.offset_id IS NOT DISTINCT FROM newer.offset_id
  AND older.code = newer.code;

CREATE UNIQUE INDEX IF NOT EXISTS etl_quality_source_code_uq
  ON etl_data_quality_event (topic, partition_id, offset_id, code);

CREATE OR REPLACE VIEW etl_quality_daily AS
SELECT
  date_trunc('day', observed_at) AS day,
  code,
  severity,
  COUNT(*) AS event_count
FROM etl_data_quality_event
GROUP BY date_trunc('day', observed_at), code, severity;
