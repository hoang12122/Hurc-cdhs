import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const required = (text, pattern, label) => {
  if (!pattern.test(text)) throw new Error(`Missing invariant: ${label}`);
};

const cluster = read('infra/production/redpanda-cluster.yml');
const mqtt = read('infra/production/mqtt-mtls.conf');
const governance = read('infra/production/security-governance-baseline.yml');

for (const node of ['redpanda-0', 'redpanda-1', 'redpanda-2']) {
  required(cluster, new RegExp(`\\b${node}:`), `broker node ${node}`);
}
required(cluster, /--replicas 3/, 'topic replication factor 3');
required(cluster, /iot\.telemetry\.retry/, 'retry topic');
required(cluster, /iot\.telemetry\.dead-letter/, 'dead-letter topic');
required(cluster, /internal:\s*true/, 'internal-only broker network');

required(mqtt, /require_certificate true/, 'MQTT client certificate required');
required(mqtt, /use_identity_as_username true/, 'certificate identity mapping');
required(mqtt, /crlfile /, 'certificate revocation list');
required(mqtt, /tls_version tlsv1\.3/, 'TLS 1.3');
required(mqtt, /allow_anonymous false/g, 'anonymous access disabled');

required(governance, /private_key_exportable:\s*false/, 'non-exportable signing keys');
required(governance, /allowed_providers:\s*\[pkcs11, vault-transit, cloud-kms-private-endpoint\]/, 'KMS/HSM providers');
required(governance, /object_lock_mode:\s*COMPLIANCE/, 'object lock compliance mode');
required(governance, /restore_test_frequency_days:\s*30/, 'monthly restore test');
required(governance, /quarterly_drill_required:\s*true/, 'quarterly failover drill');
required(governance, /default_egress_policy:\s*deny/, 'default deny egress');
required(governance, /organizations_minimum:\s*3/, 'minimum three consortium organizations');
required(governance, /endorsement_policy:\s*2-of-3-organizations/, 'multi-organization endorsement');
required(governance, /off_chain_payload:\s*true/, 'off-chain evidence payload');

console.log('Production resilience baseline invariants: PASS');
