# ETL Replay Operations Runbook

## 1. Phạm vi

Runbook này áp dụng cho replay telemetry từ Bronze Kafka `iot.telemetry.raw` sang `iot.telemetry.replay`. Replay không ghi trực tiếp vào TimescaleDB, ClickHouse hoặc Gold. Mọi bản ghi phải đi lại qua Normalizer, data-quality rules và canonical sinks.

## 2. Nguyên tắc bắt buộc

- Người yêu cầu và người phê duyệt phải khác nhau.
- Chỉ source/target topic trong allowlist được sử dụng.
- Phạm vi replay phải có thời gian bắt đầu và kết thúc rõ ràng khi có thể.
- End offset được đóng băng khi worker bắt đầu để replay hữu hạn.
- Checkpoint được lưu theo partition sau mỗi batch thành công.
- Worker dùng lease và heartbeat; worker khác chỉ tiếp quản lease đã hết hạn.
- Replay bị chặn khi vượt `ETL_REPLAY_MAX_RECORDS`.
- Dữ liệu nguồn đã hết retention làm yêu cầu thất bại với `REPLAY_SOURCE_EXPIRED`.
- Same event ID + same checksum được bỏ qua ở canonical sink.
- Same event ID + different checksum bị cách ly dưới `EVENT_ID_COLLISION`.

## 3. Cấu hình

```env
ETL_REPLAY_ALLOWED_SOURCES=iot.telemetry.raw
ETL_REPLAY_ALLOWED_TARGETS=iot.telemetry.replay
ETL_REPLAY_POLL_SECONDS=10
ETL_REPLAY_BATCH_SIZE=500
ETL_REPLAY_MAX_RECORDS=1000000
ETL_REPLAY_LEASE_SECONDS=300
ETL_REPLAY_HEARTBEAT_SECONDS=30
ETL_REPLAY_MAX_ATTEMPTS=3
```

Yêu cầu:

- heartbeat nhỏ hơn một nửa lease;
- max records phải phù hợp khả năng Kafka, Normalizer và sink;
- source retention phải lớn hơn khoảng thời gian có thể cần replay;
- production phải pin image digest của replay worker.

## 4. Tạo yêu cầu

Yêu cầu ban đầu phải ở trạng thái `PENDING`:

```sql
INSERT INTO etl_replay_request(
  id,
  source_topic,
  target_topic,
  from_timestamp,
  to_timestamp,
  requested_by,
  reason
) VALUES (
  gen_random_uuid(),
  'iot.telemetry.raw',
  'iot.telemetry.replay',
  '2026-07-01T00:00:00Z',
  '2026-07-01T01:00:00Z',
  '<requester-user-id>',
  '<business reason and incident reference>'
);
```

Không tạo yêu cầu không có lý do hoặc phạm vi quá rộng.

## 5. Phê duyệt dual-control

Người phê duyệt phải khác `requested_by`:

```sql
UPDATE etl_replay_request
SET status = 'APPROVED',
    approved_by = '<approver-user-id>',
    approved_at = NOW()
WHERE id = '<request-id>'
  AND status = 'PENDING'
  AND requested_by <> '<approver-user-id>';
```

Worker tự đánh dấu `FAILED` nếu requester và approver trùng nhau.

## 6. Trình tự worker

1. Khóa một request bằng `FOR UPDATE SKIP LOCKED`.
2. Chuyển request sang `RUNNING`, gắn `worker_id`, heartbeat và attempt.
3. Xác định start offset theo timestamp hoặc checkpoint.
4. Đóng băng end offset và lưu `source_end_offsets`.
5. Publish theo batch vào replay topic bằng idempotent producer.
6. Sau batch thành công, lưu checkpoint và heartbeat.
7. Khi hoàn tất toàn bộ partition, chuyển `COMPLETED`.
8. Khi lỗi nghiệp vụ hoặc nguồn hết retention, chuyển `FAILED`.
9. Khi graceful shutdown, trả request về `APPROVED`, giữ checkpoint để tiếp tục.
10. Khi worker chết đột ngột, worker khác tiếp quản sau khi lease hết hạn.

## 7. Theo dõi

Health:

```bash
curl http://etl-replay-worker:8084/health
curl http://etl-replay-worker:8084/ready
```

Metrics:

```bash
curl http://etl-replay-worker:8084/metrics
```

Trạng thái yêu cầu:

```sql
SELECT id, status, worker_id, attempt_count, replayed_count,
       heartbeat_at, checkpoint_offsets, source_end_offsets, last_error
FROM etl_replay_request
ORDER BY requested_at DESC
LIMIT 20;
```

Audit:

```sql
SELECT action, worker_id, replayed_count, detail, created_at
FROM etl_replay_audit
WHERE request_id = '<request-id>'
ORDER BY created_at;
```

## 8. Đối soát sau replay

Kiểm tra lineage:

```sql
SELECT target_name, COUNT(*)
FROM etl_lineage_event
WHERE run_id IN (
  SELECT run_id
  FROM etl_pipeline_run
  WHERE started_at >= '<replay-start-time>'
)
GROUP BY target_name;
```

Kiểm tra collision:

```sql
SELECT event_id, seen_count, conflict_count, last_seen_at
FROM etl_event_identity
WHERE conflict_count > 0
ORDER BY last_seen_at DESC;
```

Kiểm tra DLQ:

```sql
SELECT code, COUNT(*)
FROM etl_data_quality_event
WHERE observed_at >= '<replay-start-time>'
GROUP BY code
ORDER BY COUNT(*) DESC;
```

Điều kiện đóng replay:

- request `COMPLETED`;
- không có collision chưa điều tra;
- không tăng invalid ngoài mức dự kiến;
- count/checksum đối soát đạt yêu cầu;
- Digital Twin latest state không bị dữ liệu lịch sử ghi đè;
- có audit requester, approver, worker và thời gian thực hiện.

## 9. Xử lý sự cố

### Lease hết hạn

- kiểm tra container cũ đã dừng thật;
- không sửa `worker_id` thủ công khi lease còn hiệu lực;
- để worker mới tiếp quản sau timeout;
- kiểm tra `LEASE_EXPIRED` và checkpoint trước khi tiếp tục.

### Nguồn hết retention

`REPLAY_SOURCE_EXPIRED` nghĩa là start/checkpoint/end offset không còn trong Kafka. Không tự dịch start offset. Khôi phục Bronze từ object storage vào một topic backfill riêng, tạo request mới và phê duyệt lại.

### Checksum collision

Không sửa checksum hoặc event ID để “cho qua”. Cách ly sự kiện, xác định producer/gateway gây tái sử dụng ID, sửa nguồn và phát hành event mới theo contract.

### Replay quá lớn

Chia thành nhiều cửa sổ thời gian nhỏ. Không tăng `ETL_REPLAY_MAX_RECORDS` trong khi request đang chạy.

## 10. Production acceptance

Chỉ đặt `ETL_REPLAY_TESTED=true` sau khi đã chứng minh:

- dual-control hoạt động;
- worker crash và lease takeover không mất dữ liệu;
- graceful shutdown tiếp tục đúng checkpoint;
- duplicate không tạo bản ghi telemetry vật lý mới ở canonical Timescale sink;
- collision bị cách ly;
- late historical replay không thay trạng thái Digital Twin hiện tại;
- đối soát count/checksum đạt 100%;
- RPO/RTO được ghi nhận và phê duyệt.
