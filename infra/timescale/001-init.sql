CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE IF NOT EXISTS telemetry_event_dedup (
  event_id TEXT PRIMARY KEY,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS telemetry_event (
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'telemetry.received',
  schema_version TEXT NOT NULL DEFAULT '1.0.0',
  occurred_at TIMESTAMPTZ NOT NULL,
  ingested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  environment TEXT NOT NULL,
  line_code TEXT NOT NULL,
  station_code TEXT NOT NULL,
  subsystem TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  gateway_id TEXT,
  quality_status TEXT NOT NULL DEFAULT 'unknown',
  clock_skew_ms BIGINT,
  duplicate BOOLEAN NOT NULL DEFAULT FALSE,
  trace_id TEXT,
  payload JSONB NOT NULL,
  raw_event JSONB NOT NULL
);

SELECT create_hypertable(
  'telemetry_event',
  by_range('occurred_at'),
  if_not_exists => TRUE,
  migrate_data => TRUE
);

CREATE UNIQUE INDEX IF NOT EXISTS telemetry_event_identity_idx
  ON telemetry_event (event_id, occurred_at);
CREATE INDEX IF NOT EXISTS telemetry_asset_time_idx
  ON telemetry_event (asset_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS telemetry_station_time_idx
  ON telemetry_event (station_code, occurred_at DESC);
CREATE INDEX IF NOT EXISTS telemetry_subsystem_time_idx
  ON telemetry_event (subsystem, occurred_at DESC);

CREATE TABLE IF NOT EXISTS telemetry_dead_letter (
  id BIGSERIAL PRIMARY KEY,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  topic TEXT NOT NULL,
  reason TEXT NOT NULL,
  payload_size INTEGER NOT NULL,
  payload_text TEXT
);

CREATE INDEX IF NOT EXISTS telemetry_dead_letter_received_idx
  ON telemetry_dead_letter (received_at DESC);

CREATE TABLE IF NOT EXISTS etl_schema_registry (
  schema_name TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  contract_sha256 CHAR(64) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'DEPRECATED', 'REJECTED')),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (schema_name, schema_version)
);

CREATE TABLE IF NOT EXISTS etl_data_quality_event (
  id BIGSERIAL PRIMARY KEY,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  event_id TEXT,
  topic TEXT NOT NULL,
  partition_id INTEGER,
  offset_id BIGINT,
  code TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'ERROR')),
  detail TEXT NOT NULL,
  payload_size INTEGER NOT NULL DEFAULT 0,
  payload_excerpt TEXT
);

CREATE INDEX IF NOT EXISTS etl_quality_observed_idx
  ON etl_data_quality_event (observed_at DESC);
CREATE INDEX IF NOT EXISTS etl_quality_code_idx
  ON etl_data_quality_event (code, observed_at DESC);
CREATE INDEX IF NOT EXISTS etl_quality_event_idx
  ON etl_data_quality_event (event_id)
  WHERE event_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS etl_replay_request (
  id UUID PRIMARY KEY,
  source_topic TEXT NOT NULL,
  target_topic TEXT NOT NULL,
  from_timestamp TIMESTAMPTZ,
  to_timestamp TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'APPROVED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED')),
  requested_by TEXT NOT NULL,
  approved_by TEXT,
  reason TEXT NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  replayed_count BIGINT NOT NULL DEFAULT 0,
  last_error TEXT
);

CREATE INDEX IF NOT EXISTS etl_replay_status_idx
  ON etl_replay_request (status, requested_at DESC);
