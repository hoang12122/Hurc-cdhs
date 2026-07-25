# Data, IoT, AI and Permissioned Evidence Platform — Implementation Evidence

**Document code:** HURC-CDHS-DATA-AI-EVIDENCE-02  
**Scope:** event backbone, MQTT/IoT identity, telemetry, lakehouse/OLAP, stream/feature pipeline, MLOps and permissioned evidence ledger

## 1. Verified runtime composition

The repository now contains an executable phased platform composition in `docker-compose.platform.yml`. Services bind management ports to loopback and share a private backend network.

| Capability | Implemented runtime component | Evidence path | Current maturity |
|---|---|---|---|
| Durable backend broker | Redpanda/Kafka-compatible broker | `docker-compose.platform.yml`, `redpanda`, `redpanda-init` | production baseline declared in code; deployment certification still external |
| Retry and dead-letter | dedicated raw, retry and dead-letter topics, replay worker policy | `infra/etl-replay-worker`, `infra/redpanda-connect`, CI ETL tests | executable policy baseline |
| MQTT/IoT gateway | Mosquitto and IoT ingestor | `infra/mqtt`, `infra/iot-ingestor` | production mTLS/PKI baseline in code; real CA deployment still required |
| Device identity | certificate-derived identity, ACL, CRL and ingestion checks | `infra/iot-ingestor`, target architecture, production resilience policy | application and configuration baseline |
| Time-series telemetry | TimescaleDB with initialization schema | `infra/timescale/001-init.sql` | executable local store |
| Raw data lake | private MinIO buckets `hurc-raw`, `hurc-curated`, `hurc-models`, `hurc-evidence` | `docker-compose.platform.yml` | executable object-storage zones |
| OLAP analytics | ClickHouse and initialization schema | `infra/clickhouse/001-init.sql` | executable local OLAP store |
| Stream processing | Redpanda Connect ingestion pipeline and ETL normalizer/sinks | `infra/redpanda-connect`, `infra/etl-normalizer`, `infra/timescale-sink` | executable stream/ETL baseline |
| Feature pipeline | normalized telemetry and derived stream outputs | ETL contracts and AI architecture documents | baseline; online feature store is not yet claimed |
| Experiment registry | MLflow local service | `docker-compose.platform.yml`, `scripts/check-mlflow-security.mjs` | executable local experiment tracking |
| Signed model registry | Ed25519 manifest and SHA-256 artifact verification | `scripts/model-registry-*.mjs` | executable integrity and tamper-rejection proof |
| Permissioned evidence | Besu development node and evidence gateway | `infra/evidence-ledger`, `docker-compose.platform.yml` | governance baseline in code; real consortium activation still required |

## 2. Event durability, retry and dead-letter model

The event backbone uses durable broker storage rather than an in-browser service bus. The required event envelope contains event ID, schema version, source, asset identity, timestamps, trace ID and quality flags.

Processing follows:

```text
producer/outbox
→ durable topic
→ consumer group
→ schema and idempotency validation
→ bounded retry with backoff
→ dead-letter topic on terminal failure
→ reviewed replay worker
```

Safety invariants:

- each event has an idempotency key;
- retries are bounded and observable;
- replay is an explicit operation, not an infinite automatic loop;
- dead-letter events retain reason, original topic, schema version and trace ID;
- consumers acknowledge only after durable processing;
- malformed payloads are quarantined rather than silently discarded.

The repository now defines a production broker baseline with at least three nodes, replication factor three, minimum in-sync replica requirements, retry topics and dead-letter topics. This is source-code and configuration evidence only. Production certification still requires three independently hosted broker machines or failure domains, real storage, authenticated clients, tested quorum loss handling and signed failover results.

## 3. MQTT gateway and device identity

The local MQTT gateway receives only scoped telemetry/event/health topics. The ingestion service enforces payload size and supports credentials/TLS configuration.

Production identity requirements are:

```text
device identity = unique device ID + certificate/public key + approved topic ACL + lifecycle state
```

Required lifecycle states are `provisioned`, `active`, `suspended`, `revoked` and `retired`. Each certificate must map to one device identity. Wildcard publishing across stations or subsystems is prohibited. Device secrets and private keys must reside in secure hardware or the gateway trust store, never in source control.

The repository defines mTLS, TLS 1.3, certificate-derived identity, CRL checking, offline-root and issuing-CA separation, renewal and revocation rules. This proves the intended PKI contract, not the existence of a live CA service or hardware-protected device key. Certification requires an operational CA, real certificate issuance and revocation evidence, protected trust stores and certificate-rotation records.

## 4. Time-series, lakehouse and OLAP separation

The storage design intentionally separates workloads:

- TimescaleDB: recent telemetry, time-window queries and operational alerts;
- MinIO raw zone: immutable source events and files;
- curated zone: validated and normalized datasets;
- ClickHouse: high-volume aggregates and analytical queries;
- PostgreSQL: business transactions and governance metadata;
- MLflow/model registry: training runs and release provenance.

This prevents one database from becoming an unsafe universal store. Lakehouse table formats such as Iceberg/Delta/Hudi remain a controlled next phase; the current repository provides object-storage zones and stream outputs but does not falsely claim a completed distributed lakehouse catalog.

## 5. Stream and feature algorithms

The executable stream baseline applies deterministic contracts:

1. schema validation and version routing;
2. timestamp normalization;
3. unit conversion;
4. duplicate rejection by event identity;
5. data-quality flags;
6. windowed aggregation;
7. sink routing to time-series, raw and analytics stores;
8. dead-letter routing for terminal errors.

Feature computation must be reproducible from a versioned definition. For a rolling feature over observations `x_i` in window `W_t`:

```text
mean_t = (1 / |W_t|) × Σ x_i
variance_t = (1 / |W_t|) × Σ (x_i - mean_t)²
z_t = (x_t - mean_t) / max(std_t, epsilon)
```

Training and inference must use the same feature definition, unit, window, missing-value policy and schema version. CI contract tests prove deterministic transformation and replay policy; they do not alone prove production throughput.

## 6. AI learning and training controls

The AI learning mechanism is governed rather than self-modifying in production:

```text
verified data
→ versioned dataset
→ deterministic split
→ training run
→ evaluation against fixed acceptance suite
→ human review
→ signed registry manifest
→ staged deployment
→ drift monitoring
→ rollback/revocation
```

Algorithms already evidenced in source include hybrid RAG ranking, cosine similarity, feature hashing, MMR diversification, exponential recency decay, deterministic memory checksums and bounded retrieval. Model-training claims must include source code, dataset provenance, metrics, seed/configuration and executable tests. Unverified AI output is not accepted as durable training truth.

## 7. Signed registry proof

Every release artifact is hashed with SHA-256. The canonical manifest is signed with Ed25519. Verification rejects either a modified manifest or modified model bytes.

Executable proof:

```bash
npm run test:model-registry
```

The test creates an ephemeral key pair, signs a deterministic artifact, verifies it, modifies the artifact and proves that verification fails.

The repository also defines a KMS/HSM production contract requiring non-exportable signing keys, private endpoints, audit logs and quorum approval. This is not evidence that a real KMS or HSM is already provisioned. Production certification requires actual key attestation, operator separation, recovery procedures and signed audit records.

## 8. Permissioned evidence ledger

The ledger stores only hashes and minimum provenance. Large files, telemetry and personal data remain off-chain.

```text
canonical evidence
→ SHA-256
→ optional Merkle batch
→ signed ledger transaction
→ transaction ID stored in operational database
```

The repository defines a permissioned-ledger governance baseline with at least three organizations, multiple validator identities, endorsement requirements, onboarding and revocation controls. A genuine inter-organizational deployment still requires independent legal entities or departments operating separate validator nodes, approved consortium rules, real key custody, signed membership decisions, backup and recovery evidence, and legal approval. The repository does not claim those external governance conditions are already complete.

## 9. CI/CD security evidence

Security and acceptance CI verifies:

- local-only AI policy;
- Secure RAG and vector-memory invariants;
- signed model-registry integrity and tamper rejection;
- production resilience policy invariants;
- platform Compose validity;
- MLflow security invariants;
- ETL architecture, Python syntax, contracts and replay policy;
- TypeScript type safety and lint;
- production build and route smoke test;
- high/critical production dependency audit;
- CodeQL static analysis.

The scheduled private regression workflow runs non-destructive checks without deploying, exposing ports, scanning external systems or modifying operational data.

## 10. Assurance classification

### 10.1 Production baseline in source code

The repository may be described as having a production baseline only when the following are present and checked by CI:

- cluster topology and replication requirements;
- mTLS/PKI policy and certificate lifecycle;
- KMS/HSM signing contract;
- object-lock and immutable-backup requirements;
- backup/restore and failover acceptance criteria;
- default-deny egress policy;
- permissioned-ledger governance rules;
- executable invariant checks preventing silent policy regression.

This classification means the design intent, configuration contracts, validation scripts and acceptance criteria exist in version-controlled source code.

### 10.2 Production deployment certification

Production deployment certification is a separate operational decision and must not be inferred from passing CI. Certification requires all of the following external evidence:

1. three independent machines, nodes or failure domains actually hosting the broker cluster;
2. replication, quorum and storage verified under controlled node-loss testing;
3. a real CA/PKI service with issuance, renewal, revocation and certificate inventory records;
4. a real KMS or HSM with non-exportable keys, attestation, audit logs and separated operator roles;
5. an enforced firewall or Kubernetes NetworkPolicy implementing default-deny egress and approved destination allowlists;
6. an off-site backup target separated from the primary failure domain, with immutable retention or object-lock enabled;
7. a completed backup restore test meeting approved RPO and RTO;
8. a completed failover drill showing service recovery, consumer resumption and no unaccounted data loss;
9. a signed failover and recovery drill record identifying date, scope, participants, test evidence, deviations, corrective actions and approving authorities;
10. approved consortium governance, independent validator operators and signed membership/endorsement decisions for the permissioned ledger.

Until these records exist and are approved, the correct statement is:

> The source code contains a production baseline and executable invariant checks; the environment has not yet received production deployment certification.

## 11. Mandatory certification record

The certification package must retain, at minimum:

- physical or virtual node inventory and failure-domain map;
- CA hierarchy and certificate lifecycle report;
- KMS/HSM attestation and key-custody matrix;
- firewall or NetworkPolicy export;
- backup topology, off-site destination and retention evidence;
- restore test report with RPO/RTO measurements;
- failover drill report and raw logs;
- data-loss reconciliation results;
- outstanding corrective actions;
- signatures from system owner, security representative, operations representative and approving authority.

CI artifacts may be attached to this package as supporting evidence, but they cannot replace operational signatures or infrastructure test results.
