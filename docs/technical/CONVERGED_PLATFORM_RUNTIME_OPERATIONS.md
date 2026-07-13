# Converged Platform Runtime Operations

## 1. Mục đích và trạng thái

HURC-CDHS có runtime opt-in theo bốn phase:

| Phase | Thành phần |
|---:|---|
| 1 | Mosquitto, IoT Ingestor, TimescaleDB |
| 2 | Phase 1 + Redpanda/Kafka, Transactional Outbox Relay, MinIO, ClickHouse |
| 3 | Phase 2 + MLflow |
| 4 | Phase 3 + Besu, Evidence Ledger Gateway |

Các phase cộng dồn. Runtime `core` không tự kéo các dịch vụ mở rộng.

Đây là nền tảng POC/UAT có kiểm soát. Production HA chỉ được xem xét khi `npm run platform:production:check` không còn blocker và có CI, load-test, security review, backup/restore, DR và biên bản nghiệm thu.

## 2. Tệp triển khai

```text
docker-compose.yml
docker-compose.platform.yml
docker-compose.platform-enhancements.yml
scripts/platform-compose.mjs
scripts/check-converged-platform.mjs
src/lib/config/converged-platform-profile.ts
src/lib/config/platform-production-readiness.ts
src/lib/services/platform-health-service.ts
src/lib/services/digital-twin/
infra/iot-ingestor/
infra/outbox-relay/
infra/timescale/
infra/redpanda-connect/
infra/clickhouse/
infra/evidence-ledger/
prisma/ops/migrations/20260713170000_add_transactional_outbox/
docs/config/converged-platform.env.example
```

## 3. Cấu hình trung tâm

```text
DATA_PLATFORM_PHASE=0|1|2|3|4
PLATFORM_DEPLOYMENT_MODE=development|uat|production
```

Quy tắc:

- feature không thể bật trước phase;
- tắt IoT sẽ tắt các lớp phụ thuộc;
- tắt event backbone sẽ tắt lakehouse và MLOps;
- production chặn signer `local-dev`;
- ledger write production yêu cầu external signer;
- giới hạn payload, rate và retention được clamp;
- phase được launcher truyền trực tiếp vào app container.

Kiểm thử cấu hình:

```bash
npm run test:platform-profiles
npm run test:platform-readiness
npm run test:digital-twin-health
```

## 4. Chuẩn bị môi trường

Linux:

```bash
cp docs/config/converged-platform.env.example .env.platform.local
chmod 600 .env.platform.local
```

Windows PowerShell:

```powershell
Copy-Item docs/config/converged-platform.env.example .env.platform.local
```

Không dùng các giá trị `change-me`, `replace-with-secret` hoặc token mẫu ngoài máy thử nghiệm cô lập.

## 5. Kiểm tra Compose

Linux:

```bash
PLATFORM_ENV_FILE=.env.platform.local node scripts/platform-compose.mjs config
```

PowerShell:

```powershell
$env:PLATFORM_ENV_FILE = ".env.platform.local"
node scripts/platform-compose.mjs config
```

CI gọi:

```bash
npm run platform:config
```

## 6. Khởi động

```bash
PLATFORM_ENV_FILE=.env.platform.local node scripts/platform-compose.mjs up 1
PLATFORM_ENV_FILE=.env.platform.local node scripts/platform-compose.mjs up 2
PLATFORM_ENV_FILE=.env.platform.local node scripts/platform-compose.mjs up 3
PLATFORM_ENV_FILE=.env.platform.local node scripts/platform-compose.mjs up 4
```

Hoặc:

```bash
npm run platform:phase1:up
npm run platform:phase2:up
npm run platform:phase3:up
npm run platform:phase4:up
```

## 7. Luồng IoT

```text
Sensor / Gateway
→ MQTT
→ schema/topic/payload validation
→ eventId deduplication
→ TimescaleDB
→ telemetry_dead_letter khi lỗi
```

Topic:

```text
hurc/<environment>/<line>/<station>/<subsystem>/<assetId>/telemetry
```

Payload mẫu:

```json
{
  "eventId": "evt-psd-bt-001-0001",
  "eventType": "telemetry.received",
  "schemaVersion": "1.0.0",
  "occurredAt": "2026-07-13T08:00:00.000Z",
  "source": { "type": "iot-device", "id": "sensor-001", "gatewayId": "gateway-bt-01" },
  "asset": { "assetId": "PSD-BT-001", "line": "L1", "station": "BEN-THANH", "subsystem": "PSD" },
  "quality": { "status": "good", "clockSkewMs": 20, "duplicate": false },
  "traceId": "trace-demo-001",
  "payload": { "temperatureC": 31.2, "voltageV": 24.1, "anomalyScore": 0.08 }
}
```

## 8. Transactional Outbox

Migration OPS DB tạo:

```text
ops_outbox_events
ops_dnf_outbox_trigger
ops_hazard_outbox_trigger
```

Luồng:

```text
DNF / Hazard INSERT, UPDATE, DELETE
→ trigger trong cùng transaction
→ ops_outbox_events
→ Outbox Relay
→ ops.domain-events
→ ops.domain-events.dead-letter khi quá số lần retry
```

Đặc tính:

- `FOR UPDATE SKIP LOCKED`;
- nhiều worker không lấy cùng event;
- at-least-once;
- event ID làm Kafka key;
- exponential backoff;
- lock timeout;
- dead-letter sau `OUTBOX_MAX_ATTEMPTS`;
- health endpoint riêng;
- payload chỉ chứa trường nghiệp vụ cần thiết.

Áp dụng migration:

```bash
npm run db:ops:migrate
npm run db:ops:status
```

Sau kiểm thử migration và rollback, mới đặt:

```text
OUTBOX_MIGRATION_APPLIED=true
```

Kiểm tra hàng đợi:

```sql
SELECT event_type, attempt_count, published_at, last_error, created_at
FROM ops_outbox_events
ORDER BY created_at DESC
LIMIT 50;
```

## 9. Big Data

Phase 2 fan-out:

```text
MQTT
├─→ TimescaleDB
└─→ Redpanda Connect
    ├─→ iot.telemetry.raw
    └─→ MinIO hurc-raw

ops_outbox_events
→ Outbox Relay
→ ops.domain-events
```

ClickHouse đọc `iot.telemetry.raw` qua Kafka Engine và materialized view.

Kiểm tra:

```bash
docker exec hurc_redpanda rpk topic consume ops.domain-events -n 1 -X brokers=redpanda:9092
docker exec hurc_redpanda rpk topic consume iot.telemetry.raw -n 1 -X brokers=redpanda:9092
```

## 10. Digital Twin

API:

```text
GET /api/digital-twin/overview
```

Nguồn dữ liệu:

- Asset;
- DNF;
- Hazard;
- Timescale telemetry;
- anomaly score;
- lịch bảo trì và độ đầy đủ dữ liệu.

Health Engine trả:

- score;
- band;
- confidence;
- trend;
- factors và penalty;
- recommendations.

Không có telemetry sẽ giảm confidence, không mặc định tài sản khỏe.

Route điều hành:

```text
/iot
/data-platform
/mlops
/evidence-ledger
/asset-360?equipmentId=<asset-id>
```

## 11. Live health

```text
GET /api/platform/status
```

Kiểm tra trực tiếp:

- MQTT;
- TimescaleDB;
- Redpanda/Schema Registry;
- MinIO;
- ClickHouse;
- MLflow;
- Besu;
- Evidence Ledger;
- outbox pending/retrying/oldest.

CLI:

```bash
npm run platform:status
npm run platform:ps
npm run platform:logs
```

## 12. Production HA Gate

```bash
npm run platform:production:check
```

Blocker được kiểm tra:

- MQTT anonymous;
- TLS/mTLS và device identity;
- ít nhất ba Kafka/Redpanda broker;
- replication factor tối thiểu 3;
- ClickHouse tối thiểu hai node;
- image `latest`;
- outbox migration;
- MLflow SQLite/local artifact;
- model approval workflow;
- Besu dev network;
- external signer và KMS/HSM;
- benchmark;
- backup/restore;
- DR.

Các cờ bằng chứng chỉ được đặt `true` sau khi có biên bản hoặc artifact tương ứng:

```text
PLATFORM_BENCHMARK_APPROVED=true
PLATFORM_BACKUP_RESTORE_TESTED=true
PLATFORM_DR_TESTED=true
```

## 13. Evidence Ledger

Gateway chỉ nhận hash và metadata tối thiểu.

```text
POST /anchors
GET /verify?hash=<sha256>
GET /health
```

Không lưu DNF, ảnh, video, PII hoặc secret lên chain. Production bắt buộc:

```text
BESU_NETWORK=<permissioned-network>
LEDGER_SIGNER_MODE=external
PLATFORM_KMS_PROVIDER=<kms-or-hsm>
LEDGER_EXTERNAL_SIGNER_URL=<internal-signer>
```

## 14. Dừng và rollback

```bash
npm run platform:down
```

Rollback ứng dụng:

```text
DATA_PLATFORM_PHASE=0
LEDGER_WRITE_ENABLED=false
LEDGER_SIGNER_MODE=disabled
```

Không xóa volume trước khi backup và restore test hoàn tất.

## 15. Tiêu chí nghiệm thu

Một phase chỉ được nghiệm thu khi có:

1. Compose config hợp lệ;
2. migration và rollback test;
3. invariant test;
4. event schema version;
5. idempotency, retry, dead-letter và replay test;
6. healthcheck và observability;
7. load-test và p95/p99;
8. security review;
9. backup/restore;
10. DR/failover;
11. UI/UAT nghiệp vụ;
12. CI/CD xanh.
