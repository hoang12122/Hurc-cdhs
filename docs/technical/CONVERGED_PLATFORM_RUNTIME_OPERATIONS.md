# Converged Platform Runtime Operations

## 1. Trạng thái triển khai

HURC-CDHS đã có runtime opt-in cho bốn giai đoạn:

| Giai đoạn | Docker profile | Thành phần chính |
|---|---|---|
| 1 — IoT Foundation | `phase1` | Mosquitto, TimescaleDB, IoT ingestor |
| 2 — Big Data Platform | `phase2` | Phase 1 + Redpanda/Kafka, Redpanda Connect, MinIO, ClickHouse |
| 3 — AI/MLOps | `phase3` | Phase 2 + MLflow |
| 4 — Evidence Ledger | `phase4` | Phase 3 + Hyperledger Besu, evidence-ledger gateway |

Các profile cộng dồn. Bật `phase4` sẽ khởi động toàn bộ thành phần từ Giai đoạn 1 đến Giai đoạn 4.

Runtime chính `core` không tự động kéo các dịch vụ trên. Khi chỉ chạy `core`, hệ thống vẫn giữ kiến trúc gọn như trước.

> Đây là runtime POC/UAT có kiểm soát. Redpanda một node, Mosquitto anonymous, MLflow SQLite và Besu `dev` network không phải cấu hình production HA.

## 2. Tệp triển khai

```text
docker-compose.platform.yml
src/lib/config/converged-platform-profile.ts
src/scripts/test-converged-platform.ts
scripts/platform-compose.mjs
scripts/check-converged-platform.mjs
infra/mqtt/mosquitto.dev.conf
infra/iot-ingestor/
infra/timescale/001-init.sql
infra/redpanda-connect/iot-pipeline.yaml
infra/clickhouse/001-init.sql
infra/evidence-ledger/
docs/config/converged-platform.env.example
```

## 3. Config Registry

Biến trung tâm:

```text
DATA_PLATFORM_PHASE=0|1|2|3|4
```

Quy tắc:

- Phase `0`: tắt toàn bộ nền tảng mở rộng;
- Phase `1`: chỉ IoT và time-series;
- Phase `2`: bổ sung event backbone, object storage và OLAP;
- Phase `3`: bổ sung MLOps;
- Phase `4`: bổ sung blockchain evidence ledger;
- feature không thể bật trước phase tương ứng;
- production chặn `LEDGER_SIGNER_MODE=local-dev`;
- production chỉ cho ghi ledger khi dùng `LEDGER_SIGNER_MODE=external`;
- payload, ingestion rate và retention đều được clamp bằng hard limit.

Kiểm thử:

```bash
npm run test:platform-profiles
```

## 4. Chuẩn bị môi trường

Sao chép tệp mẫu thành tệp cục bộ không commit:

### Linux

```bash
cp docs/config/converged-platform.env.example .env.platform.local
chmod 600 .env.platform.local
```

### Windows PowerShell

```powershell
Copy-Item docs/config/converged-platform.env.example .env.platform.local
```

Sau đó sửa tối thiểu:

```text
DATA_PLATFORM_PHASE=<phase cần chạy>
TIMESCALE_PASSWORD=<secret mới>
TIMESCALE_DATABASE_URL=postgresql://postgres:<secret mới>@timescaledb:5432/hurc_telemetry
MINIO_ROOT_USER=<user mới>
MINIO_ROOT_PASSWORD=<secret mới>
CLICKHOUSE_PASSWORD=<secret mới>
LEDGER_GATEWAY_TOKEN=<chuỗi ngẫu nhiên tối thiểu 24 ký tự>
```

Không dùng giá trị `change-me` hoặc `replace-with-secret` ngoài máy thử nghiệm cô lập.

## 5. Kiểm tra cú pháp Compose

### Linux

```bash
PLATFORM_ENV_FILE=.env.platform.local node scripts/platform-compose.mjs config
```

### Windows PowerShell

```powershell
$env:PLATFORM_ENV_FILE = ".env.platform.local"
node scripts/platform-compose.mjs config
```

CI cũng chạy:

```bash
npm run platform:config
npm run test:platform-profiles
```

## 6. Khởi động từng giai đoạn

### 6.1. Giai đoạn 1

Đặt:

```text
DATA_PLATFORM_PHASE=1
```

Chạy:

```bash
PLATFORM_ENV_FILE=.env.platform.local node scripts/platform-compose.mjs up 1
```

Hoặc khi biến môi trường đã được nạp:

```bash
npm run platform:phase1:up
```

Luồng dữ liệu:

```text
Sensor/Gateway
→ MQTT topic
→ iot-ingestor validation
→ event ID deduplication
→ TimescaleDB telemetry_event
→ telemetry_dead_letter nếu dữ liệu lỗi
```

### 6.2. Giai đoạn 2

Đặt:

```text
DATA_PLATFORM_PHASE=2
```

Chạy:

```bash
PLATFORM_ENV_FILE=.env.platform.local node scripts/platform-compose.mjs up 2
```

Luồng bổ sung:

```text
MQTT
→ Redpanda Connect
→ iot.telemetry.raw
→ ClickHouse Kafka Engine
→ telemetry_olap

MQTT
→ Redpanda Connect
→ MinIO bucket hurc-raw
```

Các bucket được tạo:

```text
hurc-raw
hurc-curated
hurc-models
hurc-evidence
```

### 6.3. Giai đoạn 3

Đặt:

```text
DATA_PLATFORM_PHASE=3
```

Chạy:

```bash
PLATFORM_ENV_FILE=.env.platform.local node scripts/platform-compose.mjs up 3
```

MLflow mặc định dùng SQLite và volume cục bộ. Chỉ dùng cho development/UAT. Production phải chuyển backend store sang PostgreSQL và artifact store sang object storage được kiểm soát.

### 6.4. Giai đoạn 4

Đặt:

```text
DATA_PLATFORM_PHASE=4
LEDGER_WRITE_ENABLED=false
LEDGER_SIGNER_MODE=disabled
```

Khởi động chế độ verification/readiness:

```bash
PLATFORM_ENV_FILE=.env.platform.local node scripts/platform-compose.mjs up 4
```

Chế độ ghi production:

```text
LEDGER_WRITE_ENABLED=true
LEDGER_SIGNER_MODE=external
LEDGER_EXTERNAL_SIGNER_URL=<dịch vụ signer qua KMS/HSM>
LEDGER_EXTERNAL_SIGNER_TOKEN=<secret>
```

Không đưa private key production vào `.env`, Docker image hoặc repository.

## 7. Gửi telemetry mẫu

Topic chuẩn:

```text
hurc/<environment>/<line>/<station>/<subsystem>/<assetId>/telemetry
```

Ví dụ:

```bash
docker exec hurc_mqtt mosquitto_pub \
  -h 127.0.0.1 \
  -q 1 \
  -t hurc/dev/L1/BEN-THANH/PSD/PSD-BT-001/telemetry \
  -m '{"eventId":"evt-psd-bt-001-0001","eventType":"telemetry.received","schemaVersion":"1.0.0","occurredAt":"2026-07-13T08:00:00.000Z","source":{"type":"iot-device","id":"sensor-001","gatewayId":"gateway-bt-01"},"asset":{"assetId":"PSD-BT-001","line":"L1","station":"BEN-THANH","subsystem":"PSD"},"quality":{"status":"good","clockSkewMs":20,"duplicate":false},"traceId":"trace-demo-001","payload":{"temperatureC":31.2,"voltageV":24.1}}'
```

IoT ingestor kiểm tra:

- payload không vượt giới hạn;
- topic đúng cấu trúc;
- JSON UTF-8 hợp lệ;
- `eventId` tồn tại;
- `occurredAt` hợp lệ;
- `payload` là object;
- `asset.assetId` khớp topic;
- event trùng không ghi lại;
- event lỗi vào dead-letter.

## 8. Kiểm tra dữ liệu

### 8.1. TimescaleDB

```bash
docker exec hurc_timescaledb psql \
  -U postgres \
  -d hurc_telemetry \
  -c "SELECT event_id, station_code, subsystem, asset_id, occurred_at FROM telemetry_event ORDER BY occurred_at DESC LIMIT 10;"
```

Dead-letter:

```bash
docker exec hurc_timescaledb psql \
  -U postgres \
  -d hurc_telemetry \
  -c "SELECT received_at, topic, reason FROM telemetry_dead_letter ORDER BY received_at DESC LIMIT 10;"
```

### 8.2. Kafka/Redpanda

```bash
docker exec hurc_redpanda rpk topic consume \
  iot.telemetry.raw \
  -n 1 \
  -X brokers=redpanda:9092
```

### 8.3. ClickHouse

```bash
docker exec hurc_clickhouse sh -lc \
  'clickhouse-client --user "$CLICKHOUSE_USER" --password "$CLICKHOUSE_PASSWORD" --query "SELECT event_id, station_code, subsystem, asset_id, occurred_at FROM hurc.telemetry_olap ORDER BY occurred_at DESC LIMIT 10"'
```

### 8.4. MinIO

Mở trên máy cục bộ:

```text
http://127.0.0.1:9001
```

Xác nhận object xuất hiện trong bucket `hurc-raw`.

### 8.5. MLflow

```text
http://127.0.0.1:5000
```

### 8.6. Besu

```bash
curl -s http://127.0.0.1:8545 \
  -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}'
```

PowerShell:

```powershell
Invoke-RestMethod `
  -Uri "http://127.0.0.1:8545" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}'
```

## 9. Health-check toàn nền tảng

Linux:

```bash
DATA_PLATFORM_PHASE=2 npm run platform:status
```

Windows PowerShell:

```powershell
$env:DATA_PLATFORM_PHASE = "2"
npm run platform:status
```

Kiểm tra theo phase:

| Phase | Kiểm tra |
|---:|---|
| 1 | MQTT TCP, TimescaleDB TCP |
| 2 | Phase 1 + Redpanda Admin, MinIO, ClickHouse |
| 3 | Phase 2 + MLflow |
| 4 | Phase 3 + Besu JSON-RPC, Evidence Ledger |

Lệnh bổ sung:

```bash
npm run platform:ps
npm run platform:logs
```

Khi dùng `PLATFORM_ENV_FILE`, gọi wrapper trực tiếp:

```bash
PLATFORM_ENV_FILE=.env.platform.local node scripts/platform-compose.mjs ps
PLATFORM_ENV_FILE=.env.platform.local node scripts/platform-compose.mjs logs
```

## 10. Evidence Ledger API

Gateway chỉ nhận hash, không nhận file hoặc tài liệu gốc.

Health:

```text
GET /health
```

Anchor:

```text
POST /anchors
Authorization: Bearer <LEDGER_GATEWAY_TOKEN>
Content-Type: application/json
```

Payload:

```json
{
  "evidenceId": "DNF-2026-001/revision-3",
  "evidenceHash": "<sha256-64-hex>",
  "metadata": {
    "documentType": "DNF",
    "revision": "3",
    "approvedByRole": "Safety Manager"
  }
}
```

Gateway lưu:

- evidence ID;
- evidence hash;
- metadata hash;
- transaction hash;
- block number;
- signer identity;
- thời điểm neo;
- record hash append-only.

Không lưu nội dung DNF, ảnh, video, PII hoặc secret lên chain.

## 11. Dừng và rollback

Dừng container nhưng giữ volume:

```bash
npm run platform:down
```

Rollback ứng dụng:

```text
DATA_PLATFORM_PHASE=0
LEDGER_WRITE_ENABLED=false
LEDGER_SIGNER_MODE=disabled
```

Sau khi đổi environment phải restart app/container.

Không xóa volume trước khi hoàn thành:

- export dữ liệu;
- backup PostgreSQL/TimescaleDB;
- backup MinIO;
- backup ClickHouse;
- lưu MLflow metadata/artifact;
- lưu evidence anchor mapping;
- kiểm tra khả năng restore.

## 12. Production hardening bắt buộc

### MQTT/IoT

- thay `mosquitto.dev.conf`;
- tắt anonymous;
- mTLS hoặc credential riêng từng device/gateway;
- topic ACL;
- revoke và rotation;
- tách VLAN/zone;
- không public port trực tiếp.

### Redpanda/Kafka

- tối thiểu ba broker cho HA;
- TLS/SASL/ACL;
- replication factor phù hợp;
- schema compatibility;
- quota;
- dead-letter/replay runbook;
- backup và disaster recovery.

### MinIO/Lakehouse

- pin image digest;
- distributed storage;
- encryption at rest;
- lifecycle/retention;
- versioning/object lock khi cần;
- tách credential theo service.

### ClickHouse

- cluster/replication theo tải;
- user riêng cho ingestion và query;
- TLS;
- retention được phê duyệt;
- backup/restore;
- resource quota.

### MLflow

- PostgreSQL backend store;
- artifact store kiểm soát;
- authentication/reverse proxy;
- model approval;
- model signature;
- canary và rollback;
- drift monitoring.

### Blockchain

- không dùng Besu `dev` network;
- triển khai permissioned network nhiều node;
- KMS/HSM hoặc external signer;
- endorsement/permission policy;
- certificate rotation/revocation;
- legal and security review;
- không dùng public development key;
- không ghi dữ liệu thật on-chain.

## 13. Giới hạn hiện tại

- IoT ingestor hiện ghi TimescaleDB và không điều khiển thiết bị;
- Redpanda/ClickHouse/MinIO là single-node POC;
- Redpanda Connect và MinIO client còn dùng tag `latest` mặc định, phải pin trước production;
- MLflow dùng SQLite/local artifact volume;
- Besu chạy `dev` network;
- evidence gateway hỗ trợ external signer contract nhưng repository không chứa KMS/HSM signer;
- chưa có UI `/iot`, `/data-platform`, `/mlops`, `/evidence-ledger`;
- chưa có benchmark thực tế;
- chưa được xem là production-ready nếu CI, security review, load-test và backup/restore chưa PASS.

## 14. Tiêu chí hoàn thành từng giai đoạn

Một phase chỉ được nghiệm thu khi có:

- compose config hợp lệ;
- invariant test PASS;
- image được pin;
- healthcheck xanh;
- event schema version;
- idempotency test;
- dead-letter và replay test;
- load-test và p95 latency;
- backup/restore;
- security review;
- observability dashboard;
- rollback test;
- bằng chứng dữ liệu thật hoặc dữ liệu mô phỏng được ghi rõ.
