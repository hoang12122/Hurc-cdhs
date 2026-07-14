CREATE OR REPLACE VIEW hurc.telemetry_asset_latest AS
SELECT
  environment,
  line_code,
  station_code,
  subsystem,
  asset_id,
  max(occurred_at) AS last_seen_at,
  argMax(quality_status, tuple(occurred_at, ingest_version)) AS quality_status,
  argMax(quality_score, tuple(occurred_at, ingest_version)) AS quality_score,
  argMax(anomaly_score, tuple(occurred_at, ingest_version)) AS anomaly_score,
  argMax(event_id, tuple(occurred_at, ingest_version)) AS last_event_id,
  argMax(ingest_version, tuple(occurred_at, ingest_version)) AS ingest_version
FROM hurc.telemetry_silver FINAL
GROUP BY environment, line_code, station_code, subsystem, asset_id;
