CREATE DATABASE IF NOT EXISTS hurc;

CREATE TABLE IF NOT EXISTS hurc.telemetry_olap (
  event_id String,
  event_type LowCardinality(String),
  schema_version LowCardinality(String),
  occurred_at DateTime64(3, 'UTC'),
  ingested_at DateTime64(3, 'UTC') DEFAULT now64(3),
  environment LowCardinality(String),
  line_code LowCardinality(String),
  station_code LowCardinality(String),
  subsystem LowCardinality(String),
  asset_id String,
  quality_status LowCardinality(String),
  trace_id String,
  payload_json String,
  raw_event String
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(occurred_at)
ORDER BY (subsystem, asset_id, occurred_at, event_id)
TTL occurred_at + INTERVAL 365 DAY DELETE;

CREATE TABLE IF NOT EXISTS hurc.telemetry_kafka (
  raw_event String
)
ENGINE = Kafka
SETTINGS
  kafka_broker_list = 'redpanda:9092',
  kafka_topic_list = 'iot.telemetry.raw',
  kafka_group_name = 'hurc-clickhouse-telemetry-v1',
  kafka_format = 'JSONAsString',
  kafka_num_consumers = 1,
  kafka_thread_per_consumer = 0;

CREATE MATERIALIZED VIEW IF NOT EXISTS hurc.telemetry_kafka_mv
TO hurc.telemetry_olap
AS
SELECT
  if(empty(JSONExtractString(raw_event, 'eventId')), hex(MD5(raw_event)), JSONExtractString(raw_event, 'eventId')) AS event_id,
  if(empty(JSONExtractString(raw_event, 'eventType')), 'telemetry.received', JSONExtractString(raw_event, 'eventType')) AS event_type,
  if(empty(JSONExtractString(raw_event, 'schemaVersion')), '1.0.0', JSONExtractString(raw_event, 'schemaVersion')) AS schema_version,
  coalesce(parseDateTime64BestEffortOrNull(JSONExtractString(raw_event, 'occurredAt'), 3), now64(3)) AS occurred_at,
  JSONExtractString(raw_event, 'source', 'environment') AS environment,
  JSONExtractString(raw_event, 'asset', 'line') AS line_code,
  JSONExtractString(raw_event, 'asset', 'station') AS station_code,
  JSONExtractString(raw_event, 'asset', 'subsystem') AS subsystem,
  JSONExtractString(raw_event, 'asset', 'assetId') AS asset_id,
  if(empty(JSONExtractString(raw_event, 'quality', 'status')), 'unknown', JSONExtractString(raw_event, 'quality', 'status')) AS quality_status,
  JSONExtractString(raw_event, 'traceId') AS trace_id,
  JSONExtractRaw(raw_event, 'payload') AS payload_json,
  raw_event
FROM hurc.telemetry_kafka;
