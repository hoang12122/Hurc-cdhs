import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { evaluatePlatformProductionReadiness } from '../lib/config/platform-production-readiness';

interface PhaseAttestation {
  phase: number;
  ready: boolean;
  score: number;
  blockers: string[];
  warnings: string[];
}

async function main() {
  const phases: PhaseAttestation[] = [1, 2, 3, 4].map(phase => {
    const readiness = evaluatePlatformProductionReadiness({
      ...process.env,
      NODE_ENV: 'production',
      PLATFORM_DEPLOYMENT_MODE: 'production',
      DATA_PLATFORM_PHASE: String(phase),
    });
    return {
      phase,
      ready: readiness.ready,
      score: readiness.score,
      blockers: readiness.issues
        .filter(issue => issue.severity === 'BLOCKER')
        .map(issue => `${issue.area}/${issue.code}: ${issue.message}`),
      warnings: readiness.issues
        .filter(issue => issue.severity === 'WARNING')
        .map(issue => `${issue.area}/${issue.code}: ${issue.message}`),
    };
  });

  const controls = {
    ciCdGreen: process.env.CI === 'true',
    immutableImages: process.env.PLATFORM_IMAGES_PINNED === 'true',
    mtlsAndAcl: process.env.IOT_REQUIRE_TLS === 'true'
      && process.env.MQTT_ALLOW_ANONYMOUS === 'false'
      && process.env.IOT_DEVICE_IDENTITY_ENFORCED === 'true',
    loadTestApproved: process.env.PLATFORM_BENCHMARK_APPROVED === 'true',
    securityReviewApproved: process.env.PLATFORM_SECURITY_REVIEW_APPROVED === 'true',
    backupRestoreTested: process.env.PLATFORM_BACKUP_RESTORE_TESTED === 'true',
    disasterRecoveryTested: process.env.PLATFORM_DR_TESTED === 'true',
    externalSigner: process.env.LEDGER_SIGNER_MODE === 'external',
    kmsHsmConfigured: Boolean(
      process.env.PLATFORM_KMS_PROVIDER
      && process.env.LEDGER_EXTERNAL_SIGNER_URL,
    ),
  };
  const missingControls = Object.entries(controls)
    .filter(([, passed]) => !passed)
    .map(([name]) => name);
  const allReady = phases.every(phase => phase.ready) && missingControls.length === 0;
  const attestation = {
    schemaVersion: '1.0.0',
    status: allReady ? 'PRODUCTION_READY' : 'NOT_READY',
    commitSha: process.env.GITHUB_SHA ?? 'local',
    workflowRunId: process.env.GITHUB_RUN_ID ?? null,
    generatedAt: new Date().toISOString(),
    controls,
    missingControls,
    phases,
  };

  const outputPath = resolve(
    process.env.PLATFORM_ATTESTATION_PATH
      ?? '.build-logs/platform-production-attestation.json',
  );
  await mkdir(resolve(outputPath, '..'), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(attestation, null, 2)}\n`, 'utf8');

  console.log(`Platform attestation: ${attestation.status}`);
  for (const phase of phases) {
    console.log(`Phase ${phase.phase}: ${phase.ready ? 'PRODUCTION_READY' : 'NOT_READY'} (${phase.score}/100)`);
    phase.blockers.forEach(blocker => console.log(`  [BLOCKER] ${blocker}`));
    phase.warnings.forEach(warning => console.log(`  [WARNING] ${warning}`));
  }
  missingControls.forEach(control => console.log(`  [MISSING CONTROL] ${control}`));

  if (!allReady) process.exit(1);
}

main().catch(error => {
  console.error('Unable to emit platform production attestation:', error);
  process.exit(1);
});
