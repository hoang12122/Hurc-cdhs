import assert from 'node:assert/strict';
import { resolveConvergedPlatformConfig } from '../lib/config/converged-platform-profile';

function main() {
  const disabled = resolveConvergedPlatformConfig({
    NODE_ENV: 'development',
  }, 'development');
  assert.equal(disabled.phase, 0);
  assert.deepEqual(disabled.features, {
    iot: false,
    eventBackbone: false,
    lakehouse: false,
    mlops: false,
    evidenceLedger: false,
  });

  const phaseOne = resolveConvergedPlatformConfig({
    NODE_ENV: 'development',
    DATA_PLATFORM_PHASE: '1',
  }, 'development');
  assert.equal(phaseOne.features.iot, true);
  assert.equal(phaseOne.features.eventBackbone, false);
  assert.equal(phaseOne.limits.ingestionPerSecond, 100);

  const phaseTwo = resolveConvergedPlatformConfig({
    NODE_ENV: 'development',
    DATA_PLATFORM_PHASE: '2',
  }, 'development');
  assert.equal(phaseTwo.features.iot, true);
  assert.equal(phaseTwo.features.eventBackbone, true);
  assert.equal(phaseTwo.features.lakehouse, true);
  assert.equal(phaseTwo.features.mlops, false);
  assert.equal(phaseTwo.limits.ingestionPerSecond, 5_000);

  const phaseFour = resolveConvergedPlatformConfig({
    NODE_ENV: 'production',
    DATA_PLATFORM_PHASE: '4',
    LEDGER_SIGNER_MODE: 'external',
    LEDGER_WRITE_ENABLED: 'true',
  }, 'production');
  assert.equal(phaseFour.features.mlops, true);
  assert.equal(phaseFour.features.evidenceLedger, true);
  assert.equal(phaseFour.security.ledgerWriteEnabled, true);

  const disabledByFlag = resolveConvergedPlatformConfig({
    NODE_ENV: 'development',
    DATA_PLATFORM_PHASE: '4',
    EVENT_BACKBONE_ENABLED: 'false',
    MLOPS_RUNTIME_ENABLED: 'true',
  }, 'development');
  assert.equal(disabledByFlag.features.iot, true);
  assert.equal(disabledByFlag.features.eventBackbone, false);
  assert.equal(disabledByFlag.features.lakehouse, false);
  assert.equal(disabledByFlag.features.mlops, false);

  const disabledAtSource = resolveConvergedPlatformConfig({
    NODE_ENV: 'development',
    DATA_PLATFORM_PHASE: '4',
    IOT_RUNTIME_ENABLED: 'false',
  }, 'development');
  assert.equal(disabledAtSource.features.iot, false);
  assert.equal(disabledAtSource.features.eventBackbone, false);
  assert.equal(disabledAtSource.features.lakehouse, false);
  assert.equal(disabledAtSource.features.mlops, false);

  const clamped = resolveConvergedPlatformConfig({
    NODE_ENV: 'development',
    DATA_PLATFORM_PHASE: '99',
    MQTT_MAX_PAYLOAD_BYTES: '99999999',
    INGESTION_RATE_PER_SECOND: '99999999',
    RAW_RETENTION_DAYS: '999999',
  }, 'development');
  assert.equal(clamped.phase, 4);
  assert.equal(clamped.limits.mqttPayloadBytes, 1024 * 1024);
  assert.equal(clamped.limits.ingestionPerSecond, 50_000);
  assert.equal(clamped.limits.rawRetentionDays, 3_650);

  assert.throws(
    () => resolveConvergedPlatformConfig({
      NODE_ENV: 'production',
      DATA_PLATFORM_PHASE: '4',
      LEDGER_SIGNER_MODE: 'local-dev',
    }, 'production'),
    /local-dev ledger signer is blocked in production/,
  );

  assert.throws(
    () => resolveConvergedPlatformConfig({
      NODE_ENV: 'production',
      DATA_PLATFORM_PHASE: '4',
      LEDGER_SIGNER_MODE: 'disabled',
      LEDGER_WRITE_ENABLED: 'true',
    }, 'production'),
    /Production ledger writes require LEDGER_SIGNER_MODE=external/,
  );

  console.log('Converged platform phase invariant checks passed.');
}

main();
