import { evaluatePlatformProductionReadiness } from '../lib/config/platform-production-readiness';

const readiness = evaluatePlatformProductionReadiness();

console.log(`Platform production readiness: ${readiness.score}/100`);
console.log(`Phase: ${readiness.phase}; mode: ${readiness.deploymentMode}`);

for (const issue of readiness.issues) {
  console.log(`[${issue.severity}] ${issue.area}/${issue.code}: ${issue.message}`);
  console.log(`  Remediation: ${issue.remediation}`);
}

if (!readiness.ready) {
  console.error('Platform is not approved for production HA deployment.');
  process.exit(1);
}

console.log('Platform production HA configuration gate passed.');
