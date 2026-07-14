DROP VIEW IF EXISTS hurc.telemetry_silver_mv;
DROP TABLE IF EXISTS hurc.telemetry_silver_kafka;

CREATE TABLE hurc.telemetry_silver_kafka (
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
  late_event UInt8,
  lateness_ms UInt64,
  anomaly_score Nullable(Float64),
  source_topic String,
  source_partition Int32,
  source_offset Int64,
  ingest_version UInt64
)
ENGINE = Kafka
SETTINGS
  kafka_broker_list = 'redpanda:9092',
  kafka_topic_list = 'iot.telemetry.accepted',
  kafka_group_name = 'hurc-clickhouse-accepted-v1',
  kafka_format = 'JSONEachRow',
  kafka_num_consumers = 2,
  kafka_thread_per_consumer = 0,
  kafka_handle_error_mode = 'stream';

CREATE MATERIALIZED VIEW hurc.telemetry_silver_mv
TO hurc.telemetry_silver
AS SELECT * FROM hurc.telemetry_silver_kafka;
