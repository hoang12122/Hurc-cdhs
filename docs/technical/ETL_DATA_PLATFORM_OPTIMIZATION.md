# ETL Data Platform Optimization and Operations

## 1. Mục đích

Tài liệu này mô tả ETL runtime dùng cho telemetry của HURC-CDHS. Mục tiêu là bảo đảm dữ liệu có contract, truy vết được nguồn, không làm mất sự kiện, hỗ trợ replay và cung cấp dữ liệu tổng hợp nhanh cho Digital Twin, dashboard và AI.

ETL không được dùng để điều khiển thiết bị. Dữ liệu lỗi không được tự động sửa và đưa vào Gold. Mọi replay production phải được phê duyệt và đối soát.

## 2. Kiến trúc Bronze–Silver–Gold

```text
Sensor / Gateway
→ MQTT
→ Raw pipeline
├─→ Kafka: iot.telemetry.raw
└─→ MinIO: hurc-raw (Bronze, bất biến)

Kafka raw
→ ETL Normalizer
├─→ Kafka: iot.telemetry.normalized (Silver)
├─→ Kafka: iot.telemetry.dead-letter
└─→ TimescaleDB: etl_data_quality_event

Kafka normalized
├─→ ClickHouse telemetry_silver
│   → telemetry_gold_hourly
│   → telemetry_asset_hourly
└─→ MinIO hurc-curated (Silver archive)

Digital Twin
→ ClickHouse Gold
→ fallback TimescaleDB khi Gold chưa sẵn sàng
```

### Bronze

Bronze giữ sự kiện gần nguyên bản cùng `_mqttTopic` và `_ingestedAt`. Bronze phục vụ audit, điều tra, tái xử lý và phục hồi. Không dùng Bronze làm nguồn trực tiếp cho dashboard.

### Silver

Silver chỉ chứa sự kiện đã qua:

- kiểm tra JSON UTF-8;
- kiểm tra topic;
- kiểm tra schema version;
- kiểm tra event ID;
- kiểm tra thời gian;
- kiểm tra asset/topic consistency;
- kiểm tra payload size;
- chuẩn hóa dimension;
- tính checksum;
- tính quality score và quality flags;
- bổ sung processing latency và event age.

### Gold

Gold tổng hợp theo tài sản và giờ để giảm quét raw JSON. Digital Twin ưu tiên Gold tại Phase 2–4 và chỉ fallback TimescaleDB nếu ClickHouse chưa sẵn sàng hoặc chưa có dữ liệu.

## 3. Data contract

Contract chính thức:

```text
infra/etl/contracts/telemetry-v1.schema.json
```

Schema đang hỗ trợ:

```text
schemaVersion=1.0.0
```

Thay đổi breaking phải tạo schema version mới. Không sửa ý nghĩa field của `1.0.0` sau khi đã phát hành.

Các field bắt buộc:

- `eventId`;
- `eventType`;
- `schemaVersion`;
- `occurredAt`;
- `asset.assetId`;
- `payload`;
- `_mqttTopic` do raw pipeline bổ sung.

Topic chuẩn:

```text
hurc/<environment>/<line>/<station>/<subsystem>/<assetId>/telemetry
```

## 4. Idempotency và delivery

ETL Normalizer dùng consumer group và tắt auto-commit. Offset chỉ được commit sau khi:

1. Silver event đã được Kafka xác nhận bằng `acks=all`; hoặc
2. invalid event đã được ghi thành công vào Dead Letter topic.

Cơ chế delivery là `at-least-once`. Duplicate có thể xuất hiện khi worker dừng sau publish nhưng trước commit. ClickHouse Silver dùng `ReplacingMergeTree(ingest_version)` và event ID/checksum để giảm duplicate trong truy vấn hợp nhất.

Không mô tả pipeline là exactly-once.

## 5. Data quality

Mỗi Silver event có:

- `quality_status`;
- `quality_score` từ 0 đến 100;
- `quality_flags`;
- `event_checksum`;
- `payload_bytes`;
- `processing_latency_ms`;
- `event_age_ms`;
- `anomaly_score` nếu có.

Các mã lỗi contract gồm:

- `INVALID_JSON`;
- `INVALID_ROOT`;
- `INVALID_TOPIC`;
- `MISSING_EVENT_ID`;
- `MISSING_EVENT_TYPE`;
- `UNSUPPORTED_SCHEMA`;
- `INVALID_DATETIME`;
- `FUTURE_EVENT`;
- `INVALID_PAYLOAD`;
- `PAYLOAD_TOO_LARGE`;
- `MISSING_ASSET`;
- `ASSET_TOPIC_MISMATCH`;
- `INVALID_QUALITY`.

Quality warning gồm:

- `MISSING_GATEWAY_ID`;
- `MISSING_TRACE_ID`;
- `CLOCK_SKEW_UNKNOWN`;
- `CLOCK_SKEW_HIGH`;
- `SOURCE_DUPLICATE`.

## 6. Khởi động

Sao chép cấu hình mẫu và đặt secret phù hợp:

```bash
cp docs/config/converged-platform.env.example .env.platform
```

Development/UAT:

```bash
PLATFORM_ENV_FILE=.env.platform npm run platform:phase2:up
```

Production phải đặt:

```env
PLATFORM_DEPLOYMENT_MODE=production
ETL_NORMALIZER_IMAGE=<registry/image@sha256:digest>
PLATFORM_REQUIRE_IMAGE_DIGEST=true
```

Launcher tự ghép `docker-compose.platform-production-images.yml` khi deployment mode là production.

## 7. Kiểm tra nhanh

### ETL contract

```bash
python3 -m unittest infra/etl-normalizer/test_contract.py
```

### Compose

```bash
PLATFORM_ENV_FILE=.env.platform npm run platform:config
```

### Trạng thái container

```bash
PLATFORM_ENV_FILE=.env.platform npm run platform:ps
PLATFORM_ENV_FILE=.env.platform npm run platform:logs
```

### ETL health

Trong network Docker:

```bash
curl http://etl-normalizer:8082/health
```

Các chỉ số chính:

- `received`;
- `normalized`;
- `invalid`;
- `qualityWarnings`;
- `publishFailures`;
- `commits`;
- `lastProcessedAt`.

## 8. Kiểm tra dữ liệu

### Timescale data quality

```sql
SELECT code, severity, COUNT(*) AS total
FROM etl_data_quality_event
WHERE observed_at >= NOW() - INTERVAL '24 hours'
GROUP BY code, severity
ORDER BY total DESC;
```

### Silver ClickHouse

```sql
SELECT
  count() AS rows,
  uniqExact(event_id) AS unique_events,
  countIf(quality_score < 80) AS warnings
FROM hurc.telemetry_silver
WHERE occurred_at >= now() - INTERVAL 24 HOUR;
```

### Gold ClickHouse

```sql
SELECT
  asset_id,
  sum(event_count) AS events,
  sum(error_count) AS errors,
  round(sum(quality_score_sum) / greatest(sum(event_count), 1), 2) AS quality
FROM hurc.telemetry_gold_hourly
WHERE bucket >= now() - INTERVAL 24 HOUR
GROUP BY asset_id
ORDER BY quality ASC;
```

## 9. Replay

Replay production không được thực hiện bằng cách tự ý đổi consumer offset.

Quy trình:

1. tạo yêu cầu trong `etl_replay_request`;
2. xác định source range và lý do;
3. phê duyệt bởi người có thẩm quyền;
4. ghi lại count và checksum Bronze trước replay;
5. replay vào `iot.telemetry.replay` hoặc consumer group tách biệt;
6. chạy Normalizer ở chế độ replay;
7. đối chiếu count, event ID và checksum;
8. kiểm tra duplicate trong Silver;
9. kiểm tra Gold aggregate;
10. cập nhật trạng thái `COMPLETED` hoặc `FAILED`.

Không replay trực tiếp vào Gold.

## 10. SLO khuyến nghị

Các ngưỡng phải được load-test và phê duyệt trước production:

| Chỉ tiêu | Mục tiêu ban đầu |
|---|---:|
| Invalid event rate | dưới 0,1% |
| Duplicate rate sau hợp nhất | dưới 0,01% |
| Silver freshness p95 | dưới 5 giây |
| Gold freshness p95 | dưới 2 phút |
| Kafka consumer lag | dưới 60 giây |
| Publish failure | 0 kéo dài trên 5 phút |
| Replay reconciliation | 100% event ID/checksum |

Đây là mục tiêu khởi đầu, không phải số liệu production đã được xác nhận.

## 11. Production readiness

Phase 2 trở lên có thêm ba blocker:

```env
ETL_SCHEMA_CONTRACT_VALIDATED=true
ETL_REPLAY_TESTED=true
ETL_DATA_QUALITY_SLO_APPROVED=true
```

Chỉ đặt `true` khi có bằng chứng tương ứng. Unit test xanh không thay thế replay test hoặc phê duyệt SLO.

## 12. Rollback

Khi ETL mới gây suy giảm:

1. giữ Bronze pipeline hoạt động để không mất dữ liệu;
2. dừng `etl-normalizer`, `curated-sink` và ClickHouse Kafka consumer;
3. không xóa Dead Letter hoặc data quality events;
4. chuyển Digital Twin về Timescale fallback;
5. rollback application và ETL image về digest đã phê duyệt;
6. khởi động consumer group mới nếu cần tránh dùng offset sai;
7. đối chiếu count/checksum trước khi bật lại Gold;
8. chạy lại contract test, replay test và load test.

Không rollback bằng cách xóa raw bucket hoặc truncate Silver/Gold khi chưa có bản sao lưu và biên bản phê duyệt.

## 13. Giới hạn hiện tại

- POC/UAT vẫn có thể dùng Redpanda single-node;
- production cần broker quorum và replication factor tối thiểu 3;
- ClickHouse production cần replicated topology;
- replay executor tự động chưa được mở cho người dùng cuối;
- Schema Registry bên ngoài chưa thay thế contract registry nội bộ;
- SLO và benchmark phải được xác nhận bằng dữ liệu tải thực tế;
- CI/CD chỉ được ghi nhận PASS khi GitHub Actions trả kết quả thành công.
