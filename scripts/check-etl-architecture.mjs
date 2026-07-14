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
  ['normalizer readiness check', /8082\/ready/],
  ['sink readiness check', /8083\/ready/],
  ['replay readiness check', /8084\/ready/],
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
  ['watermark policy', /watermark_delay_seconds/],
  ['late event flag', /"late_event"/],
  ['lateness metric', /"lateness_ms"/],
]);

const store = read('infra/timescale-sink/store.py');
requireText('infra/timescale-sink/store.py', store, [
  ['event identity lookup', /etl_event_identity/],
  ['checksum collision quarantine', /EVENT_ID_COLLISION/],
  ['lineage storage', /etl_lineage_event/],
  ['checkpoint storage', /etl_checkpoint/],
  ['single database transaction', /with self\.connection:/],
]);

const replay = read('infra/etl-replay-worker/main.py');
requireText('infra/etl-replay-worker/main.py', replay, [
  ['human-approved replay only', /status = 'APPROVED' AND approved_by IS NOT NULL/],
  ['source allowlist', /ALLOWED_SOURCE_TOPICS/],
  ['target allowlist', /ALLOWED_TARGET_TOPICS/],
  ['read-committed replay', /isolation_level="read_committed"/],
]);

const migration = read('infra/timescale/002-etl-canonical.sql');
requireText('infra/timescale/002-etl-canonical.sql', migration, [
  ['event identity table', /CREATE TABLE IF NOT EXISTS etl_event_identity/],
  ['pipeline run table', /CREATE TABLE IF NOT EXISTS etl_pipeline_run/],
  ['lineage table', /CREATE TABLE IF NOT EXISTS etl_lineage_event/],
  ['checkpoint table', /CREATE TABLE IF NOT EXISTS etl_checkpoint/],
  ['idempotent quality index', /etl_quality_source_code_uq/],
]);

const clickhouse = read('infra/clickhouse/002-etl-medallion.sql');
requireText('infra/clickhouse/002-etl-medallion.sql', clickhouse, [
  ['late data fields', /late_event UInt8/],
  ['source offset lineage', /source_offset Int64/],
  ['fast latest asset view', /telemetry_asset_latest/],
  ['quality aggregation', /telemetry_quality_hourly/],
]);

const productionImages = read('docker-compose.platform-production-images.yml');
requireText('docker-compose.platform-production-images.yml', productionImages, [
  ['immutable normalizer image contract', /ETL_NORMALIZER_IMAGE/],
  ['immutable Timescale sink image contract', /ETL_TIMESCALE_SINK_IMAGE/],
  ['immutable replay worker image contract', /ETL_REPLAY_WORKER_IMAGE/],
]);

if (failures.length > 0) {
  console.error('[etl-architecture] FAILED');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('[etl-architecture] PASS: canonical ETL invariants are present.');
