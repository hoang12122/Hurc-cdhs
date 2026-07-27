# Production resilience, security and consortium evidence

**Document code:** HURC-CDHS-PLATFORM-EVIDENCE-02  
**Scope:** clustered broker, device PKI, signing keys, immutable storage, recovery, network isolation and permissioned-ledger governance.

## 1. Implemented production baseline

The repository now contains executable and reviewable production baselines for the following controls:

1. A three-node Redpanda broker topology (`redpanda-0`, `redpanda-1`, `redpanda-2`).
2. Topic replication factor 3 for raw telemetry, retry, dead-letter, model and evidence event streams.
3. An internal Docker network with no direct external routing for the broker cluster.
4. MQTT mutual TLS with mandatory client certificates, certificate-derived identity, TLS 1.3, ACL and CRL enforcement.
5. PKI lifecycle rules for offline root CA, issuing CA, short-lived device certificates, renewal overlap, revocation and hardware identity binding.
6. KMS/HSM signing policy using PKCS#11, Vault Transit or a private-endpoint KMS; private keys are non-exportable and sensitive operations require quorum approval.
7. Object-store versioning, compliance object lock, legal hold, dual approval for deletion and at least two replication targets.
8. Encrypted backup, immutable and off-site copies, monthly restore tests, RPO/RTO targets and retention tiers.
9. Quarterly broker failover drills with evidence artifacts and explicit success criteria.
10. Default-deny egress, DNS allowlisting and explicit prohibition of public AI endpoints and runtime model downloads.
11. Consortium-ledger governance with at least three organizations, multi-organization endorsement and controlled membership/schema/contract changes.

Source evidence:

- `infra/production/redpanda-cluster.yml`
- `infra/production/mqtt-mtls.conf`
- `infra/production/security-governance-baseline.yml`
- `scripts/check-production-resilience-baseline.mjs`
- `.github/workflows/security-and-acceptance.yml`

## 2. Broker durability and failure model

With three brokers and replication factor 3, each topic partition has one leader and two replicas. The intended tolerance is loss of one broker while retaining quorum and a complete replica set for committed records.

The event path uses distinct topics:

```text
producer
→ iot.telemetry.raw
→ consumer processing
→ transient failure: iot.telemetry.retry
→ exhausted retries/non-retryable failure: iot.telemetry.dead-letter
→ reviewed replay
```

A production consumer must use idempotency keys and commit offsets only after the target write succeeds. Replication does not replace application-level idempotency, schema validation, backup or replay controls.

## 3. Device identity and certificate lifecycle

Each device certificate is bound to a hardware identity and stores the device identity in a URI SAN. Mosquitto uses the certificate identity as the authenticated username and applies topic ACLs.

Lifecycle:

```text
approved enrollment
→ single-use bootstrap token
→ hardware-bound CSR
→ issuing CA approval
→ 90-day certificate
→ renewal beginning 21 days before expiry
→ revoke on compromise/decommission
→ CRL publication within 15 minutes
```

The root CA remains offline. Issuing CAs rotate with a 30-day overlap so devices can migrate without an outage. Private keys must not be stored in the repository.

## 4. KMS/HSM signing assurance

Model and evidence signatures use an abstract signing-provider boundary. Production permits:

- PKCS#11 hardware security module;
- Vault Transit on an internal endpoint;
- KMS reachable only through an approved private endpoint.

Assurance properties:

- private key is non-exportable;
- every signing request is audited;
- key rotation is defined;
- production promotion requires two-person approval;
- revocation produces a new registry/governance event;
- CI uses temporary test keys only and does not represent production custody.

## 5. Immutable evidence and object lock

Large evidence remains off-chain. The object store holds source files, model artifacts and evidence bundles with versioning and compliance object lock. The permissioned ledger stores only hashes, Merkle roots, schema version, signer and organization metadata.

The configured default retention is 2,555 days. Legal hold may extend retention. Deletion requires dual approval and cannot bypass compliance retention.

## 6. Backup, restore and failover proof

Targets:

- RPO: 15 minutes;
- RTO: 120 minutes;
- immutable backup copy required;
- off-site backup copy required;
- restore test every 30 days;
- broker failover drill every quarter.

A drill is successful only when:

1. broker quorum is maintained;
2. producers continue or retry without silent loss;
3. consumers resume without duplicate side effects;
4. dead-letter replay is verified;
5. measured recovery stays within RTO;
6. a signed evidence artifact records commands, timestamps and results.

The repository currently proves the policy and static invariants. A real failover result requires running the drill in private staging or production-like infrastructure and retaining the generated evidence.

## 7. Network egress denial

The baseline is default-deny. Workloads may reach only approved internal PKI, KMS, observability and operating-system mirror destinations. Public AI endpoints and runtime model downloads remain prohibited.

Application endpoint validation is defense in depth. Infrastructure enforcement must be implemented using host firewall, Kubernetes NetworkPolicy, service-mesh egress policy or equivalent controls in the deployment environment.

## 8. Consortium governance

The permissioned ledger baseline requires at least three independent organizations and at least four validator nodes. Evidence endorsement requires two of the three organizations.

Governed actions requiring a two-thirds vote include:

- admitting or removing a member;
- upgrading smart contracts;
- emergency pause;
- evidence schema changes;
- changes to certificate authorities or membership policy.

Every organization must declare conflicts of interest. Membership certificates and revocation lists are mandatory. Operational payloads remain off-chain.

## 9. Executable CI proof

Run:

```bash
npm run test:production-resilience
npm run test:model-registry
npm run security:local-ai-only
npm run test:ai-governance
npm run platform:config
```

The Security and Acceptance workflow executes the production-resilience invariant check on pull requests and pushes covered by the workflow.

## 10. Assurance boundary

This change establishes production configuration baselines and executable static checks. It does not claim that the repository alone creates:

- a physically independent three-node cluster;
- a commissioned enterprise PKI;
- an installed HSM;
- an immutable off-site backup system;
- a legally constituted consortium;
- a completed failover drill.

Those claims require deployment evidence, independent nodes, protected key custody, network enforcement, restore/failover results and signed organizational approvals.
