import assert from 'node:assert/strict';
import { calculateTwinHealth } from '../lib/services/digital-twin/health-engine';

function main() {
  const healthy = calculateTwinHealth({
    openDnfs: 0,
    criticalDnfs: 0,
    overdueDnfs: 0,
    openHazards: 0,
    criticalHazards: 0,
    inspectionFindings: 0,
    telemetryAgeMinutes: 2,
    telemetryErrorRatio: 0,
    anomalyScore: 0.02,
    dataCompleteness: 1,
    maintenanceOverdue: false,
    previousScore: 95,
  });
  assert.equal(healthy.band, 'HEALTHY');
  assert.ok(healthy.score >= 90);
  assert.ok(healthy.confidence >= 90);

  const degraded = calculateTwinHealth({
    openDnfs: 4,
    criticalDnfs: 2,
    overdueDnfs: 2,
    openHazards: 2,
    criticalHazards: 1,
    inspectionFindings: 3,
    telemetryAgeMinutes: 180,
    telemetryErrorRatio: 0.25,
    anomalyScore: 0.8,
    dataCompleteness: 0.8,
    maintenanceOverdue: true,
    previousScore: 80,
  });
  assert.ok(degraded.score < 45);
  assert.equal(degraded.band, 'CRITICAL');
  assert.equal(degraded.trend, 'DECLINING');
  assert.ok(degraded.factors[0].penalty >= degraded.factors.at(-1)!.penalty);
  assert.ok(degraded.recommendations.length >= 3);

  const missingData = calculateTwinHealth({
    openDnfs: 0,
    criticalDnfs: 0,
    overdueDnfs: 0,
    openHazards: 0,
    criticalHazards: 0,
    inspectionFindings: 0,
    telemetryAgeMinutes: null,
    telemetryErrorRatio: null,
    anomalyScore: null,
    dataCompleteness: 0.2,
    maintenanceOverdue: false,
  });
  assert.ok(missingData.confidence < healthy.confidence);
  assert.ok(missingData.factors.some(item => item.code === 'DATA_INCOMPLETE'));
  assert.ok(missingData.factors.some(item => item.code === 'TELEMETRY_STALE'));

  console.log('Digital Twin health engine invariant checks passed.');
}

main();
