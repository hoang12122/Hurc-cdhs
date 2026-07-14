# ETL Data Platform Optimization and Operations

## 1. Mục đích

Tài liệu này mô tả ETL telemetry của HURC-CDHS từ Phase 2 trở lên. Mục tiêu là tạo một đường dữ liệu chuẩn duy nhất, truy vết được, replay được, không để dữ liệu lỗi vào lớp phục vụ và cung cấp dữ liệu nhanh cho Digital Twin, dashboard và AI.

ETL không điều khiển thiết bị. Dữ liệu lỗi không được tự sửa. Replay production phải được phê duyệt, có phạm vi thời gian rõ ràng và đối soát sau thực hiện.

## 2. Kiến trúc canonical

```text
Sensor / Gateway
→ MQTT
→ Redpanda Connect
├─→ Kafka iot.telemetry.raw
└─→ MinIO hurc-raw / Bronze

Kafka raw hoặc replay
→ ETL Normalizer
├─→ Kafka iot.telemetry.normalized
├─→ Kafka iot.telemetry.dead-letter
└─→ Timescale etl_data_quality_event

Kafka normalized
├─→ Timescale Sink
│   ├─→ telemetry_event
│   ├─→ etl_event_identity
│   ├─→ etl_lineage_event
│   ├─→ etl_checkpoint
│   └─→ etl_pipeline_run
├─→ ClickHouse telemetry_silver
│   ├─→ telemetry_gold_hourly
│   ├─→ telemetry_asset_hourly
│   └─→ telemetry_asset_latest
└─→ MinIO hurc-curated / Silver archive
```

Phase 1 giữ direct MQTT → Timescale cho POC nhỏ. Từ Phase 2–4, legacy direct ingestor tự tắt chức năng ghi; mọi telemetry phải đi qua canonical pipeline.

## 3. Bronze, Silver và Gold

### Bronze

Bronze giữ sự kiện gần nguyên bản, `_mqttTopic` và `_ingestedAt`. Object được phân vùng theo ngày/giờ để giảm số lượng object nhỏ và hỗ trợ điều tra. Bronze phục vụ audit, replay và phục hồi, không phải nguồn trực tiếp cho dashboard.

### Silver

Silver chỉ nhận sự kiện đã qua:

- JSON UTF-8 và root object;
- topic contract;
- `schemaVersion`;
- `eventId`, `eventType`, `occurredAt`;
- asset/topic consistency;
- payload size;
- quality status và clock skew;
- dimension normalization;
- checksum SHA-256 ổn định qua replay;
- watermark, late data và processing latency.

### Gold

Gold tổng hợp theo tài sản và giờ. `telemetry_asset_latest` chọn trạng thái theo `occurred_at`, sau đó mới dùng `ingest_version` để phá hòa. Vì vậy replay dữ liệu lịch sử không được ghi đè trạng thái mới nhất của Digital Twin.

## 4. Data contract và Schema Registry

Contract chính thức:

```text
infra/etl/contracts/telemetry-v1.schema.json
```

Schema đang hỗ trợ:

```text
schemaVersion=1.0.0
```

Thay đổi breaking phải tạo version mới. Production phải đặt:

```env
ETL_SCHEMA_REGISTRY_REQUIRED=true
```

Normalizer đăng ký JSON Schema và yêu cầu compatibility `BACKWARD_TRANSITIVE`. Khi cờ này bật, lỗi Schema Registry làm readiness thất bại thay vì âm thầm tiếp tục.

## 5. Delivery và effectively-once

Pipeline không được mô tả là exactly-once. Cơ chế được triển khai là at-least-once transport kết hợp idempotent sink để tạo hành vi effectively-once:

1. Normalizer tắt auto-commit và đọc `read_committed`.
2. Kafka producer bật idempotence, `acks=all` và giới hạn in-flight.
3. Một batch chỉ commit source offset sau khi toàn bộ Silver/DLQ output và quality record thành công.
4. Timescale Sink xử lý batch trong một transaction.
5. `etl_event_identity` khóa `eventId` với checksum ổn định.
6. Cùng ID và cùng checksum được nhận diện là duplicate và không ghi lại telemetry.
7. Cùng ID nhưng checksum khác bị cách ly dưới mã `EVENT_ID_COLLISION`.
8. Kafka offset chỉ commit sau khi transaction Timescale thành công.
9. Crash sau DB commit nhưng trước Kafka commit sẽ replay an toàn nhờ identity table.

## 6. Watermark và late data

Cấu hình:

```env
ETL_WATERMARK_DELAY_SECONDS=300
```

Nếu `processed_at - occurred_at` vượt watermark, sự kiện có:

- `late_event=1`;
- `lateness_ms`;
- quality flag `LATE_EVENT`;
- giảm nhẹ quality score.

Late data vẫn được giữ để audit và tái tính. Không dùng thời điểm replay để xác định trạng thái mới nhất của tài sản.

## 7. Lineage và checkpoint

Các bảng điều khiển:

- `etl_event_identity`: định danh và checksum chuẩn;
- `etl_lineage_event`: topic, partition, offset, event ID, target và run ID;
- `etl_checkpoint`: offset đã ghi bền vững theo pipeline/topic/partition;
- `etl_pipeline_run`: input, output, duplicate, collision, invalid, late và source offsets;
- `etl_data_quality_event`: lỗi/warning có unique source key để retry không nhân bản cảnh báo.

Truy vết một event:

```sql
SELECT *
FROM etl_lineage_event
WHERE event_id = '<event-id>'
ORDER BY processed_at;
```

Kiểm tra checksum collision:

```sql
SELECT event_id, seen_count, conflict_count, last_seen_at
FROM etl_event_identity
WHERE conflict_count > 0
ORDER BY last_seen_at DESC;
```

## 8. Replay có phê duyệt

Replay worker chỉ nhận yêu cầu thỏa:

```text
status = APPROVED
approved_by IS NOT NULL
```

Source/target được allowlist mặc định:

```env
ETL_REPLAY_ALLOWED_SOURCES=iot.telemetry.raw
ETL_REPLAY_ALLOWED_TARGETS=iot.telemetry.replay
```

Quy trình:

1. tạo `etl_replay_request` ở trạng thái `PENDING`;
2. ghi rõ lý do, `from_timestamp`, `to_timestamp`;
3. người có thẩm quyền điền `approved_by` và chuyển `APPROVED`;
4. worker claim bằng khóa database;
5. xác định Kafka offsets theo timestamp;
6. snapshot end offset để phạm vi replay hữu hạn;
7. publish vào `iot.telemetry.replay`;
8. sự kiện đi lại qua cùng Normalizer và Sink;
9. identity table loại duplicate hoặc cách ly collision;
10. worker cập nhật `COMPLETED` hoặc `FAILED` và `replayed_count`.

Không replay trực tiếp vào Timescale, ClickHouse hoặc Gold.

Ví dụ tạo yêu cầu:

```sql
INSERT INTO etl_replay_request(
  id, source_topic, target_topic, from_timestamp, to_timestamp,
  requested_by, reason
) VALUES (
  gen_random_uuid(), 'iot.telemetry.raw', 'iot.telemetry.replay',
  '2026-07-01T00:00:00Z', '2026-07-01T01:00:00Z',
  '<user-id>', '<approved reason>'
);
```

## 9. Khởi động và kiểm tra

```bash
cp docs/config/converged-platform.env.example .env.platform
PLATFORM_ENV_FILE=.env.platform npm run platform:phase2:up
```

Kiểm tra cấu hình và invariant:

```bash
PLATFORM_ENV_FILE=.env.platform npm run platform:config
node scripts/check-etl-architecture.mjs
python3 -m unittest infra/etl-normalizer/test_contract.py
```

Health endpoints trong Docker network:

```bash
curl http://etl-normalizer:8082/health
curl http://timescale-sink:8083/health
curl http://etl-replay-worker:8084/health
```

Readiness endpoints trả 503 khi lag, freshness hoặc service state không đạt:

```bash
curl http://etl-normalizer:8082/ready
curl http://timescale-sink:8083/ready
curl http://etl-replay-worker:8084/ready
```

Prometheus metrics:

```bash
curl http://etl-normalizer:8082/metrics
curl http://timescale-sink:8083/metrics
```

## 10. Kiểm tra dữ liệu

Data quality 24 giờ:

```sql
SELECT code, severity, COUNT(*) AS total
FROM etl_data_quality_event
WHERE observed_at >= NOW() - INTERVAL '24 hours'
GROUP BY code, severity
ORDER BY total DESC;
```

Pipeline runs:

```sql
SELECT pipeline_name, status, input_count, output_count,
       duplicate_count, conflict_count, invalid_count, late_count,
       started_at, completed_at
FROM etl_pipeline_run
ORDER BY started_at DESC
LIMIT 20;
```

Silver/Gold:

```sql
SELECT count(), uniqExact(event_id), countIf(late_event = 1)
FROM hurc.telemetry_silver
WHERE occurred_at >= now() - INTERVAL 24 HOUR;

SELECT *
FROM hurc.telemetry_asset_latest
ORDER BY last_seen_at DESC
LIMIT 100;
```

## 11. SLO cần phê duyệt

Các giá trị sau là mục tiêu khởi đầu, chưa phải kết quả production:

| Chỉ tiêu | Mục tiêu ban đầu |
|---|---:|
| Invalid event rate | dưới 0,1% |
| Checksum collision | 0 |
| Duplicate sau canonical sink | 0 bản ghi vật lý mới |
| Silver freshness p95 | dưới 5 giây |
| Batch processing p95 | dưới 2 giây |
| Gold freshness p95 | dưới 2 phút |
| Consumer lag | trong ngưỡng đã phê duyệt |
| Replay reconciliation | 100% event ID/checksum |
| Data loss sau crash/restart | 0 trong acceptance test |

## 12. Production readiness

Phase 2 trở lên chỉ được đánh dấu sẵn sàng khi có đủ:

```env
ETL_SCHEMA_CONTRACT_VALIDATED=true
ETL_SCHEMA_REGISTRY_REQUIRED=true
ETL_CANONICAL_INGRESS_VERIFIED=true
ETL_EFFECTIVELY_ONCE_TESTED=true
ETL_LATE_DATA_POLICY_APPROVED=true
ETL_REPLAY_TESTED=true
ETL_DATA_QUALITY_SLO_APPROVED=true
```

Ngoài ra phải có broker quorum, replication factor, ClickHouse HA, image digest, benchmark, security review, backup/restore và DR evidence.

Image nội bộ bắt buộc pin digest:

```env
ETL_NORMALIZER_IMAGE=<registry/image@sha256:digest>
ETL_TIMESCALE_SINK_IMAGE=<registry/image@sha256:digest>
ETL_REPLAY_WORKER_IMAGE=<registry/image@sha256:digest>
```

## 13. Rollback và phục hồi

Khi ETL suy giảm:

1. giữ MQTT → Bronze hoạt động để không mất nguồn;
2. tạm dừng Normalizer/Sink/Replay, không xóa topic hoặc bucket;
3. ghi lại consumer group offsets và checkpoint;
4. chuyển Digital Twin sang Timescale fallback nếu Gold chưa tin cậy;
5. rollback image về digest đã phê duyệt;
6. chạy contract, architecture và syntax checks;
7. khởi động bằng consumer group đã kiểm soát;
8. đối chiếu count, checksum, lineage và Gold trước khi mở lại toàn bộ;
9. chỉ đóng sự cố khi replay reconciliation đạt 100%.

Không truncate Silver/Gold, không xóa Bronze và không tự ý đổi consumer offset khi chưa có backup và phê duyệt.

## 14. Giới hạn còn phải kiểm chứng

- POC/UAT vẫn có thể chạy Redpanda và ClickHouse single-node;
- throughput, p95/p99 và recovery phải đo bằng tải thực tế;
- Kafka/Timescale/ClickHouse failure injection chưa được xác nhận cho commit hiện tại;
- CI/CD chỉ được ghi nhận PASS khi GitHub Actions trả kết quả thành công;
- nhãn Production Ready chỉ xuất hiện sau workflow attestation cho đúng commit.
