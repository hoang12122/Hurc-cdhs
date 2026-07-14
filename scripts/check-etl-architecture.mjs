#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';

const failures = [];

function read(path) {
  if (!existsSync(path)) {
    failures.push(`missing required file: ${path}`);
    return '';
  }
  return readFileSync(path, 'utf8');
}

function requireText(path, content, patterns) {
  for (const [label, pattern] of patterns) {
    if (!pattern.test(content)) failures.push(`${path}: missing ${label}`);
  }
}

const compose = read('docker-compose.platform-enhancements.yml');
requireText('docker-compose.platform-enhancements.yml', compose, [
  ['canonical normalizer service', /^  etl-normalizer:/m],
  ['Timescale sink service', /^  timescale-sink:/m],
  ['governed replay worker service', /^  etl-replay-worker:/m],
  ['canonical migration', /002-etl-canonical\.sql/],
  ['replay-safe ClickHouse migration', /003-etl-latest-state\.sql/],
  ['normalizer readiness check', /8082\/ready/],
  ['sink readiness check', /8083\/ready/],
  ['replay readiness check', /8084\/ready/],
  ['bounded replay size', /ETL_REPLAY_MAX_RECORDS/],
  ['replay lease configuration', /ETL_REPLAY_LEASE_SECONDS/],
]);

const acceptedCompose = read('docker-compose.etl-accepted.yml');
requireText('docker-compose.etl-accepted.yml', acceptedCompose, [
  ['accepted Kafka topic', /iot\.telemetry\.accepted/],
  ['accepted relay service', /^  etl-accepted-relay:/m],
  ['accepted outbox migration', /003-etl-accepted-outbox\.sql/],
  ['accepted ClickHouse source migration', /004-etl-accepted-source\.sql/],
  ['accepted relay readiness check', /8085\/ready/],
  ['bounded accepted backlog', /ETL_ACCEPTED_RELAY_MAX_PENDING/],
]);

const legacyEntrypoint = read('infra/iot-ingestor/entrypoint.py');
requireText('infra/iot-ingestor/entrypoint.py', legacyEntrypoint, [
  ['Phase 2 canonical cutoff', /if phase < 2:/],
  ['canonical ownership message', /canonical ETL pipeline owns telemetry ingestion/],
]);

const normalizer = read('infra/etl-normalizer/main.py');
requireText('infra/etl-normalizer/main.py', normalizer, [
  ['manual offset commit', /enable_auto_commit=False/],
  ['read-committed isolation', /isolation_level="read_committed"/],
  ['idempotent producer', /enable_idempotence=True/],
  ['batch output synchronization', /for future in futures:/],
  ['quality write before offset commit', /QUALITY_STORE\.record_many\(quality_records\)[\s\S]*consumer\.commit\(\)/],
  ['consumer lag metric', /consumerLag/],
  ['Schema Registry enforcement', /ETL_SCHEMA_REGISTRY_REQUIRED/],
]);

const contract = read('infra/etl-normalizer/contract.py');
requireText('infra/etl-normalizer/contract.py', contract, [
  ['stable replay checksum', /if not str\(key\)\.startswith\("_"\)/],
  ['topic identity in checksum', /stable_event\["_mqttTopic"\]/],
  ['watermark policy', /watermark_delay_seconds/],
  ['late event flag', /"late_event"/],
  ['dimension integrity', /require_dimension_match/],
]);

const store = read('infra/timescale-sink/store.py');
requireText('infra/timescale-sink/store.py', store, [
  ['event identity lookup', /etl_event_identity/],
  ['cross-replica identity lock', /pg_advisory_xact_lock/],
  ['checksum collision quarantine', /EVENT_ID_COLLISION/],
  ['lineage storage', /etl_lineage_event/],
  ['checkpoint storage', /etl_checkpoint/],
  ['single database transaction', /with self\.connection:/],
]);

const acceptedMigration = read('infra/timescale/003-etl-accepted-outbox.sql');
requireText('infra/timescale/003-etl-accepted-outbox.sql', acceptedMigration, [
  ['accepted outbox trigger function', /enqueue_accepted_telemetry_event/],
  ['after insert trigger', /AFTER INSERT ON telemetry_event/],
  ['idempotent outbox conflict handling', /ON CONFLICT \(event_id\) DO NOTHING/],
]);

const acceptedRelay = read('infra/etl-accepted-relay/main.py');
requireText('infra/etl-accepted-relay/main.py', acceptedRelay, [
  ['row-level relay claim', /FOR UPDATE SKIP LOCKED/],
  ['idempotent Kafka producer', /enable_idempotence=True/],
  ['accepted topic default', /iot\.telemetry\.accepted/],
  ['retry exhaustion readiness', /state\["exhausted"\] == 0/],
  ['backlog readiness threshold', /MAX_PENDING/],
]);

const replayControl = read('infra/etl-replay-worker/control.py');
requireText('infra/etl-replay-worker/control.py', replayControl, [
  ['dual-control approval', /approved_by <> requested_by/],
  ['row-level claim lock', /FOR UPDATE SKIP LOCKED/],
  ['lease heartbeat', /heartbeat_at/],
  ['durable checkpoints', /checkpoint_offsets/],
  ['frozen source bounds', /source_end_offsets/],
  ['replay audit', /etl_replay_audit/],
]);

const replayExecutor = read('infra/etl-replay-worker/replay.py');
requireText('infra/etl-replay-worker/replay.py', replayExecutor, [
  ['source allowlist', /ALLOWED_SOURCE_TOPICS/],
  ['target allowlist', /ALLOWED_TARGET_TOPICS/],
  ['read-committed replay', /isolation_level="read_committed"/],
  ['bounded replay count', /MAX_RECORDS/],
  ['checkpoint persistence', /control\.progress/],
  ['source expiration detection', /REPLAY_SOURCE_EXPIRED/],
]);

const replayMain = read('infra/etl-replay-worker/main.py');
requireText('infra/etl-replay-worker/main.py', replayMain, [
  ['graceful lease release', /control\.release/],
  ['modular executor', /execute_replay/],
  ['lease recovery metric', /leaseRecoveries/],
]);

const migration = read('infra/timescale/002-etl-canonical.sql');
requireText('infra/timescale/002-etl-canonical.sql', migration, [
  ['event identity table', /CREATE TABLE IF NOT EXISTS etl_event_identity/],
  ['pipeline run table', /CREATE TABLE IF NOT EXISTS etl_pipeline_run/],
  ['lineage table', /CREATE TABLE IF NOT EXISTS etl_lineage_event/],
  ['checkpoint table', /CREATE TABLE IF NOT EXISTS etl_checkpoint/],
  ['accepted event outbox', /CREATE TABLE IF NOT EXISTS etl_accepted_event_outbox/],
  ['replay lease columns', /ADD COLUMN IF NOT EXISTS heartbeat_at/],
  ['replay audit table', /CREATE TABLE IF NOT EXISTS etl_replay_audit/],
  ['idempotent quality index', /etl_quality_source_code_uq/],
]);

const clickhouse = read('infra/clickhouse/002-etl-medallion.sql');
requireText('infra/clickhouse/002-etl-medallion.sql', clickhouse, [
  ['late data fields', /late_event UInt8/],
  ['source offset lineage', /source_offset Int64/],
  ['quality aggregation', /telemetry_quality_hourly/],
]);

const acceptedClickHouse = read('infra/clickhouse/004-etl-accepted-source.sql');
requireText('infra/clickhouse/004-etl-accepted-source.sql', acceptedClickHouse, [
  ['accepted topic source', /kafka_topic_list = 'iot\.telemetry\.accepted'/],
  ['accepted consumer group', /hurc-clickhouse-accepted-v1/],
]);

const curated = read('infra/redpanda-connect/curated-pipeline.yaml');
requireText('infra/redpanda-connect/curated-pipeline.yaml', curated, [
  ['accepted curated input', /iot\.telemetry\.accepted/],
  ['accepted curated consumer group', /hurc-curated-accepted-v1/],
]);

const latestState = read('infra/clickhouse/003-etl-latest-state.sql');
requireText('infra/clickhouse/003-etl-latest-state.sql', latestState, [
  ['latest state view', /telemetry_asset_latest/],
  ['event-time ordering', /tuple\(occurred_at, ingest_version\)/],
  ['maximum event time', /max\(occurred_at\) AS last_seen_at/],
]);

const replayDockerfile = read('infra/etl-replay-worker/Dockerfile');
requireText('infra/etl-replay-worker/Dockerfile', replayDockerfile, [
  ['modular replay package', /config\.py.*control\.py.*replay\.py.*main\.py/],
]);

const productionImages = read('docker-compose.platform-production-images.yml');
requireText('docker-compose.platform-production-images.yml', productionImages, [
  ['immutable normalizer image contract', /ETL_NORMALIZER_IMAGE/],
  ['immutable Timescale sink image contract', /ETL_TIMESCALE_SINK_IMAGE/],
  ['immutable replay worker image contract', /ETL_REPLAY_WORKER_IMAGE/],
  ['immutable accepted relay image contract', /ETL_ACCEPTED_RELAY_IMAGE/],
]);

if (failures.length > 0) {
  console.error('[etl-architecture] FAILED');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('[etl-architecture] PASS: canonical identity-accepted ETL invariants are present.');
