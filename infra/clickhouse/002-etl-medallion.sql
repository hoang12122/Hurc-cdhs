CREATE DATABASE IF NOT EXISTS hurc;

DROP VIEW IF EXISTS hurc.telemetry_kafka_mv;
DROP TABLE IF EXISTS hurc.telemetry_kafka;

CREATE TABLE IF NOT EXISTS hurc.telemetry_silver (
  event_id String,
  event_type LowCardinality(String),
  schema_version LowCardinality(String),
  occurred_at DateTime64(3, 'UTC'),
  ingested_at DateTime64(3, 'UTC'),
  processed_at DateTime64(3, 'UTC'),
  environment LowCardinality(String),
  line_code LowCardinality(String),
  station_code LowCardinality(String),
  subsystem LowCardinality(String),
  asset_id String,
  gateway_id String,
  quality_status LowCardinality(String),
  quality_score UInt8,
  quality_flags Array(String),
  clock_skew_ms Nullable(Int64),
  duplicate UInt8,
  trace_id String,
  payload_json String,
  raw_event String,
  event_checksum FixedString(64),
  payload_bytes UInt32,
  processing_latency_ms UInt64,
  event_age_ms Int64,
  anomaly_score Nullable(Float64),
  ingest_version UInt64
)
ENGINE = ReplacingMergeTree(ingest_version)
PARTITION BY toYYYYMM(occurred_at)
ORDER BY (asset_id, occurred_at, event_id)
TTL occurred_at + INTERVAL 730 DAY DELETE;

CREATE TABLE IF NOT EXISTS hurc.telemetry_silver_kafka (
  event_id String,
  event_type String,
  schema_version String,
  occurred_at DateTime64(3, 'UTC'),
  ingested_at DateTime64(3, 'UTC'),
  processed_at DateTime64(3, 'UTC'),
  environment String,
  line_code String,
  station_code String,
  subsystem String,
  asset_id String,
  gateway_id String,
  quality_status String,
  quality_score UInt8,
  quality_flags Array(String),
  clock_skew_ms Nullable(Int64),
  duplicate UInt8,
  trace_id String,
  payload_json String,
  raw_event String,
  event_checksum String,
  payload_bytes UInt32,
  processing_latency_ms UInt64,
  event_age_ms Int64,
  anomaly_score Nullable(Float64),
  ingest_version UInt64
)
ENGINE = Kafka
SETTINGS
  kafka_broker_list = 'redpanda:9092',
  kafka_topic_list = 'iot.telemetry.normalized',
  kafka_group_name = 'hurc-clickhouse-silver-v1',
  kafka_format = 'JSONEachRow',
  kafka_num_consumers = 2,
  kafka_thread_per_consumer = 0,
  kafka_handle_error_mode = 'stream';

CREATE MATERIALIZED VIEW IF NOT EXISTS hurc.telemetry_silver_mv
TO hurc.telemetry_silver
AS SELECT * FROM hurc.telemetry_silver_kafka;

CREATE TABLE IF NOT EXISTS hurc.telemetry_gold_hourly (
  bucket DateTime('UTC'),
  environment LowCardinality(String),
  line_code LowCardinality(String),
  station_code LowCardinality(String),
  subsystem LowCardinality(String),
  asset_id String,
  event_count UInt64,
  error_count UInt64,
  warning_count UInt64,
  duplicate_count UInt64,
  quality_score_sum UInt64,
  anomaly_score_sum Float64,
  anomaly_count UInt64,
  payload_bytes_sum UInt64,
  processing_latency_sum UInt64
)
ENGINE = SummingMergeTree
PARTITION BY toYYYYMM(bucket)
ORDER BY (environment, line_code, station_code, subsystem, asset_id, bucket)
TTL bucket + INTERVAL 1095 DAY DELETE;

CREATE MATERIALIZED VIEW IF NOT EXISTS hurc.telemetry_gold_hourly_mv
TO hurc.telemetry_gold_hourly
AS
SELECT
  toStartOfHour(occurred_at) AS bucket,
  environment,
  line_code,
  station_code,
  subsystem,
  asset_id,
  count() AS event_count,
  countIf(quality_status = 'error') AS error_count,
  countIf(quality_status = 'warning' OR quality_score < 80) AS warning_count,
  countIf(duplicate = 1) AS duplicate_count,
  sum(toUInt64(quality_score)) AS quality_score_sum,
  sum(ifNull(anomaly_score, 0.0)) AS anomaly_score_sum,
  countIf(anomaly_score IS NOT NULL) AS anomaly_count,
  sum(toUInt64(payload_bytes)) AS payload_bytes_sum,
  sum(toUInt64(processing_latency_ms)) AS processing_latency_sum
FROM hurc.telemetry_silver
GROUP BY bucket, environment, line_code, station_code, subsystem, asset_id;

CREATE VIEW IF NOT EXISTS hurc.telemetry_asset_hourly AS
SELECT
  bucket,
  environment,
  line_code,
  station_code,
  subsystem,
  asset_id,
  sum(event_count) AS event_count,
  sum(error_count) AS error_count,
  sum(warning_count) AS warning_count,
  sum(duplicate_count) AS duplicate_count,
  round(sum(quality_score_sum) / greatest(sum(event_count), 1), 2) AS average_quality_score,
  round(sum(anomaly_score_sum) / greatest(sum(anomaly_count), 1), 4) AS average_anomaly_score,
  round(sum(processing_latency_sum) / greatest(sum(event_count), 1), 2) AS average_processing_latency_ms,
  sum(payload_bytes_sum) AS payload_bytes
FROM hurc.telemetry_gold_hourly
GROUP BY bucket, environment, line_code, station_code, subsystem, asset_id;
