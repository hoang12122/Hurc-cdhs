# Digital Twin Operational Control Center

## 1. Mục đích

HURC-CDHS được định hướng là nền tảng hỗ trợ vận hành, bảo trì và an toàn đường sắt đô thị. Digital Twin không chỉ là mô hình 3D; bản sao số phải hợp nhất được:

- hồ sơ tài sản;
- telemetry và chất lượng dữ liệu;
- DNF, Hazard và kết quả kiểm tra;
- lịch sử bảo trì;
- tín hiệu bất thường;
- bằng chứng và trạng thái xác minh.

Đầu ra phải giúp người vận hành trả lời bốn câu hỏi:

1. Tài sản nào cần ưu tiên?
2. Vì sao hệ thống đánh giá như vậy?
3. Độ tin cậy của đánh giá là bao nhiêu?
4. Cần thực hiện hành động nào tiếp theo?

## 2. Luồng nghiệp vụ đã triển khai

```text
DNF / Hazard transaction
→ PostgreSQL trigger
→ ops_outbox_events
→ Outbox Relay (at-least-once)
→ Redpanda/Kafka
→ TimescaleDB / MinIO / ClickHouse
→ Digital Twin Health Engine
→ /api/digital-twin/overview
→ IoT / Data Platform / MLOps / Evidence Ledger UI
→ Asset 360 deep-link
```

Trigger outbox chạy trong cùng transaction với DNF/Hazard. Nếu transaction nghiệp vụ rollback thì sự kiện outbox cũng rollback. Relay dùng event ID làm Kafka key, retry theo exponential backoff và chuyển sang dead-letter topic khi vượt giới hạn thử lại.

## 3. Thuật toán sức khỏe tài sản

Điểm bắt đầu là `100`. Hệ thống trừ điểm theo các nhóm tín hiệu:

| Nhóm | Giới hạn penalty |
|---|---:|
| DNF đang mở, mức cao, quá hạn | 34 |
| Hazard đang mở, mức nghiêm trọng | 34 |
| Phát hiện kiểm tra | 12 |
| Telemetry stale/missing | 22 |
| Tỷ lệ telemetry lỗi | 18 |
| Anomaly score | 22 |
| Bảo trì quá hạn | 10 |
| Dữ liệu không đầy đủ | 10 |

Phân loại:

| Điểm | Trạng thái |
|---:|---|
| 85–100 | `HEALTHY` |
| 70–84 | `WATCH` |
| 45–69 | `DEGRADED` |
| 0–44 | `CRITICAL` |

Thuật toán trả thêm:

- confidence từ 0–100;
- xu hướng `IMPROVING`, `STABLE`, `DECLINING` hoặc `UNKNOWN`;
- danh sách yếu tố làm giảm điểm;
- penalty của từng yếu tố;
- khuyến nghị hành động ưu tiên.

Khi telemetry chưa có, hệ thống không mặc định tài sản khỏe. Confidence bị giảm và xuất hiện yếu tố `TELEMETRY_STALE` hoặc `DATA_INCOMPLETE`.

## 4. Logic liên kết dữ liệu

### 4.1. DNF với tài sản

DNF được liên kết qua mã thiết bị, asset ID hoặc equipment code. Các DNF chưa đóng, mức ưu tiên cao và quá hạn trên 7 ngày làm giảm health score.

### 4.2. Hazard với tài sản

Hazard được liên kết theo `linkedDnfId`, subsystem/system group và vị trí. Hazard mức `HIGH`, `CRITICAL`, `CATASTROPHIC` hoặc Đỏ có penalty cao hơn.

### 4.3. Telemetry

TimescaleDB cung cấp:

- thời điểm nhận dữ liệu cuối;
- số message trong 24 giờ;
- tỷ lệ quality status không tốt;
- anomaly score nếu payload có trường hợp lệ.

### 4.4. Digital Twin

API tổng hợp tối đa 500 tài sản mỗi lần, sắp xếp từ điểm thấp đến cao. Người dùng chọn “Điều tra” để mở trực tiếp Asset 360 với `equipmentId` tương ứng.

## 5. Trải nghiệm người dùng

Các route đã triển khai:

- `/iot`;
- `/data-platform`;
- `/mlops`;
- `/evidence-ledger`.

Control Center có:

- trạng thái phase và component;
- live health check mỗi 30 giây;
- Digital Twin overall score;
- số tài sản critical;
- pending/retrying outbox;
- trạng thái telemetry;
- danh sách tài sản ưu tiên;
- yếu tố penalty lớn nhất;
- deep-link đến Asset 360;
- Production HA Readiness score và blocker.

Các route đã được đăng ký trong Module Registry, sidebar và production smoke test.

## 6. Production HA Readiness Gate

Lệnh kiểm tra:

```bash
npm run platform:production:check
```

Gate kiểm tra theo phase:

- MQTT anonymous phải tắt;
- IoT phải bật TLS/mTLS và device identity;
- Kafka/Redpanda có ít nhất 3 broker;
- replication factor tối thiểu 3;
- ClickHouse có ít nhất 2 node;
- utility image không dùng `latest`;
- outbox migration đã áp dụng;
- MLflow không dùng SQLite/local artifact;
- model approval workflow đã bật;
- Besu không dùng dev network;
- ledger dùng external signer và KMS/HSM;
- benchmark đã phê duyệt;
- backup/restore và DR đã kiểm thử.

Gate chỉ đánh giá cấu hình và bằng chứng khai báo. Kết quả `READY` không thay thế CI, load-test, security review, restore test hoặc biên bản nghiệm thu.

## 7. Các phần cần hạ tầng bên ngoài

Repository không chứa và không được chứa:

- private key production;
- KMS/HSM key material;
- certificate thật;
- mật khẩu broker/database;
- permissioned Besu validator key;
- dữ liệu benchmark thật.

Production HA thực tế vẫn cần:

- MQTT broker HA có mTLS/ACL;
- Redpanda/Kafka cluster đa failure domain;
- ClickHouse replicated cluster;
- PostgreSQL HA cho MLflow;
- object storage distributed có versioning;
- Besu permissioned network;
- external signer tích hợp KMS/HSM;
- monitoring, backup, restore và DR.

## 8. Tiêu chí nghiệm thu

Chỉ đánh dấu hoàn thành khi có đủ:

1. migration outbox đã áp dụng và rollback test;
2. tạo/sửa/xóa DNF/Hazard sinh đúng event;
3. relay retry và dead-letter hoạt động;
4. event ID không tạo bản ghi nghiệp vụ trùng;
5. telemetry stale làm giảm confidence;
6. health score có thể giải thích;
7. route mới smoke-test thành công;
8. Production Readiness không còn blocker;
9. load-test đạt SLO được phê duyệt;
10. backup/restore và DR có bằng chứng;
11. CI/CD xanh;
12. người dùng nghiệp vụ UAT xác nhận luồng điều tra phù hợp.
