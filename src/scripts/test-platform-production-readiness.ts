import assert from 'node:assert/strict';
import { evaluatePlatformProductionReadiness } from '../lib/config/platform-production-readiness';

function main() {
  const unsafe = evaluatePlatformProductionReadiness({
    NODE_ENV: 'production',
    PLATFORM_DEPLOYMENT_MODE: 'production',
    DATA_PLATFORM_PHASE: '4',
    KAFKA_BROKERS: 'redpanda:9092',
    REDPANDA_REPLICATION_FACTOR: '1',
    CLICKHOUSE_NODE_COUNT: '1',
    REDPANDA_CONNECT_IMAGE: 'docker.redpanda.com/redpandadata/connect:latest',
    MLFLOW_BACKEND_STORE_URI: 'sqlite:////mlflow/mlflow.db',
    MLFLOW_ARTIFACT_ROOT: '/mlflow/artifacts',
    BESU_NETWORK: 'dev',
    LEDGER_SIGNER_MODE: 'local-dev',
  });
  assert.equal(unsafe.ready, false);
  assert.ok(unsafe.issues.some(issue => issue.code === 'MQTT_ANONYMOUS'));
  assert.ok(unsafe.issues.some(issue => issue.code === 'KAFKA_QUORUM'));
  assert.ok(unsafe.issues.some(issue => issue.code === 'MLFLOW_SQLITE'));
  assert.ok(unsafe.issues.some(issue => issue.code === 'BESU_DEV_NETWORK'));
  assert.ok(unsafe.issues.some(issue => issue.code === 'CI_ACCEPTANCE'));
  assert.ok(unsafe.issues.some(issue => issue.code === 'SECURITY_REVIEW'));
  assert.ok(unsafe.score < 50);

  const ready = evaluatePlatformProductionReadiness({
    NODE_ENV: 'production',
    PLATFORM_DEPLOYMENT_MODE: 'production',
    DATA_PLATFORM_PHASE: '4',
    MQTT_ALLOW_ANONYMOUS: 'false',
    IOT_REQUIRE_TLS: 'true',
    IOT_DEVICE_IDENTITY_ENFORCED: 'true',
    KAFKA_BROKERS: 'broker-1:9092,broker-2:9092,broker-3:9092',
    REDPANDA_REPLICATION_FACTOR: '3',
    CLICKHOUSE_NODE_COUNT: '2',
    REDPANDA_CONNECT_IMAGE: 'docker.redpanda.com/redpandadata/connect:4.50.0',
    MINIO_MC_IMAGE: 'minio/mc:RELEASE.2025-05-21T01-59-54Z',
    OUTBOX_MIGRATION_APPLIED: 'true',
    MLFLOW_BACKEND_STORE_URI: 'postgresql://mlflow:secret@postgres/metrics',
    MLFLOW_ARTIFACT_ROOT: 's3://hurc-models',
    MODEL_APPROVAL_WORKFLOW_ENABLED: 'true',
    BESU_NETWORK: 'hurc-permissioned',
    LEDGER_SIGNER_MODE: 'external',
    PLATFORM_KMS_PROVIDER: 'external-hsm',
    LEDGER_EXTERNAL_SIGNER_URL: 'https://signer.internal.example',
    PLATFORM_CI_ACCEPTANCE_PASSED: 'true',
    PLATFORM_IMAGES_PINNED: 'true',
    PLATFORM_BENCHMARK_APPROVED: 'true',
    PLATFORM_SECURITY_REVIEW_APPROVED: 'true',
    PLATFORM_BACKUP_RESTORE_TESTED: 'true',
    PLATFORM_DR_TESTED: 'true',
  });
  assert.equal(ready.ready, true);
  assert.equal(ready.score, 100);
  assert.equal(ready.issues.length, 0);

  console.log('Platform production readiness invariant checks passed.');
}

main();
