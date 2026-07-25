# Data, IoT, AI and Permissioned Evidence Platform — Implementation Evidence

**Document code:** HURC-CDHS-DATA-AI-EVIDENCE-02  
**Scope:** event backbone, MQTT/IoT identity, telemetry, lakehouse/OLAP, stream/feature pipeline, MLOps and permissioned evidence ledger

## 1. Verified runtime composition

The repository now contains an executable phased platform composition in `docker-compose.platform.yml`. Services bind management ports to loopback and share a private backend network.

| Capability | Implemented runtime component | Evidence path | Current maturity |
|---|---|---|---|
| Durable backend broker | Redpanda/Kafka-compatible broker | `docker-compose.platform.yml`, `redpanda`, `redpanda-init` | single-node development/acceptance baseline |
| Retry and dead-letter | dedicated raw and dead-letter topics, replay worker policy | `infra/etl-replay-worker`, `infra/redpanda-connect`, CI ETL tests | executable policy baseline |
| MQTT/IoT gateway | Mosquitto and IoT ingestor | `infra/mqtt`, `infra/iot-ingestor` | local gateway baseline; production mTLS/PKI still required |
| Device identity | topic scope, credentials/TLS environment and ingestion checks | `infra/iot-ingestor`, target architecture | application baseline; certificate lifecycle remains infrastructure work |
| Time-series telemetry | TimescaleDB with initialization schema | `infra/timescale/001-init.sql` | executable local store |
| Raw data lake | private MinIO buckets `hurc-raw`, `hurc-curated`, `hurc-models`, `hurc-evidence` | `docker-compose.platform.yml` | executable object-storage zones |
| OLAP analytics | ClickHouse and initialization schema | `infra/clickhouse/001-init.sql` | executable local OLAP store |
| Stream processing | Redpanda Connect ingestion pipeline and ETL normalizer/sinks | `infra/redpanda-connect`, `infra/etl-normalizer`, `infra/timescale-sink` | executable stream/ETL baseline |
| Feature pipeline | normalized telemetry and derived stream outputs | ETL contracts and AI architecture documents | baseline; online feature store is not yet claimed |
| Experiment registry | MLflow local service | `docker-compose.platform.yml`, `scripts/check-mlflow-security.mjs` | executable local experiment tracking |
| Signed model registry | Ed25519 manifest and SHA-256 artifact verification | `scripts/model-registry-*.mjs` | executable integrity and tamper-rejection proof |
| Permissioned evidence | Besu development node and evidence gateway | `infra/evidence-ledger`, `docker-compose.platform.yml` | development proof; consortium network governance remains required |

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

The current Redpanda development profile uses one replica. Production durability requires at least three broker nodes, replication factor three, minimum in-sync replicas, authenticated clients and tested backup/restore.

## 3. MQTT gateway and device identity

The local MQTT gateway receives only scoped telemetry/event/health topics. The ingestion service enforces payload size and supports credentials/TLS configuration.

Production identity requirements are:

```text
device identity = unique device ID + certificate/public key + approved topic ACL + lifecycle state
```

Required lifecycle states are `provisioned`, `active`, `suspended`, `revoked` and `retired`. Each certificate must map to one device identity. Wildcard publishing across stations or subsystems is prohibited. Device secrets and private keys must reside in secure hardware or the gateway trust store, never in source control.

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

## 8. Permissioned evidence ledger

The ledger stores only hashes and minimum provenance. Large files, telemetry and personal data remain off-chain.

```text
canonical evidence
→ SHA-256
→ optional Merkle batch
→ signed ledger transaction
→ transaction ID stored in operational database
```

The current Besu profile is a local development proof. A genuine inter-organizational permissioned ledger requires independent validator identities, consortium governance, membership onboarding/revocation, private-key custody, endorsement policy, backup and legal approval. The repository does not claim those external governance conditions are already complete.

## 9. CI/CD security evidence

Security and acceptance CI verifies:

- local-only AI policy;
- Secure RAG and vector-memory invariants;
- signed model-registry integrity and tamper rejection;
- platform Compose validity;
- MLflow security invariants;
- ETL architecture, Python syntax, contracts and replay policy;
- TypeScript type safety and lint;
- production build and route smoke test;
- high/critical production dependency audit;
- CodeQL static analysis.

The scheduled private regression workflow runs non-destructive checks without deploying, exposing ports, scanning external systems or modifying operational data.

## 10. Honest assurance boundary

The repository provides executable local baselines and CI evidence. It does not prove unlimited scale, zero vulnerabilities or full production readiness. Production acceptance additionally requires load tests, failover drills, multi-node replication, mTLS/PKI, firewall egress controls, secret management, backups, recovery objectives and organization-approved operating procedures.
