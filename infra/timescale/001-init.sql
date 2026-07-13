CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE IF NOT EXISTS telemetry_event (
  event_id TEXT PRIMARY KEY,
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
