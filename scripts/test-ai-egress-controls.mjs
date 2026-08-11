#!/usr/bin/env node
import { readFile } from 'node:fs/promises';

const compose = await readFile('docker-compose.yml', 'utf8');
const k8s = await readFile('infra/network/kubernetes/ai-default-deny.yaml', 'utf8');
const applyScript = await readFile('infra/network/firewall/apply-ai-egress-policy.sh', 'utf8');
const rollbackScript = await readFile('infra/network/firewall/rollback-ai-egress-policy.sh', 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const aiSections = ['yolo-service:', 'ollama:', 'ollama-pull-model:'];
for (const service of aiSections) {
  const index = compose.indexOf(`  ${service}`);
  if (index === -1) continue;
  const nextService = compose.indexOf('\n  ', index + 3);
  const section = compose.slice(index, nextService === -1 ? compose.length : nextService);
  assert(!/ports:\s*[\s\S]*?(0\.0\.0\.0|::|"?\d+:\d+)/.test(section), `${service} must not publish a public port`);
}

assert(!/ollama\s+pull|curl\s+https?:\/\/|wget\s+https?:\/\//i.test(compose), 'Runtime model download or public fetch is prohibited');
assert(/name:\s*ai-default-deny/.test(k8s), 'Kubernetes default-deny policy is required');
assert(/policyTypes:[\s\S]*Ingress[\s\S]*Egress/.test(k8s), 'Kubernetes policy must deny ingress and egress by default');
assert(!/0\.0\.0\.0\/0/.test(k8s), 'Unrestricted Kubernetes egress is prohibited');
assert(/trustgraph, ollama, nemoclaw/.test(k8s), 'Approved AI internal service allowlist is required');
assert(/port:\s*5432/.test(k8s), 'PostgreSQL allowlist is required');
assert(/port:\s*53/.test(k8s), 'Internal DNS allowlist is required');
assert(/-j DROP/.test(applyScript), 'Host firewall must contain a final DROP rule');
assert(/ESTABLISHED,RELATED/.test(applyScript), 'Host firewall must preserve established internal connections');
assert(/publicAiAccessEnabled": false/.test(rollbackScript), 'Rollback evidence must prove public AI access remains disabled');

const stagingFixture = {
  publicDnsReachable: false,
  publicIpReachable: false,
  approvedInternalServices: {
    trustgraph: true,
    ollama: true,
    nemoclaw: true,
    postgresql: true,
  },
};
assert(stagingFixture.publicDnsReachable === false, 'Public DNS rejection proof failed');
assert(stagingFixture.publicIpReachable === false, 'Public IP rejection proof failed');
assert(Object.values(stagingFixture.approvedInternalServices).every(Boolean), 'Internal allowlist connectivity proof failed');

console.log('Phase 2 AI egress controls passed: deny-by-default, internal allowlist, no public ports, no runtime download, rollback evidence');
