# Vision Training, SCADA/F-SCADA and Operational Data Exchange

## 1. Mục đích

Tài liệu này hướng dẫn ba năng lực mới:

1. huấn luyện dữ liệu hình ảnh để nhận biết lỗi thiết bị;
2. nhập/xuất DNF và Hazard có kiểm soát;
3. tích hợp SCADA/F-SCADA theo mô hình read-only, chuẩn hóa dữ liệu về telemetry contract `1.0.0`.

AI không tự phát hành model, không tự tạo/đóng DNF hoặc Hazard và không gửi lệnh điều khiển SCADA.

## 2. Luồng dữ liệu tổng thể

```text
Camera/ảnh kiểm tra ─→ Dataset có nhãn ─→ Human review ─→ Training
                                                │              │
                                                │              └→ Model review ─→ triển khai có phê duyệt
                                                │
SCADA/F-SCADA ─→ Read-only Gateway ─→ MQTT ─→ Bronze/Silver/Gold ─→ Digital Twin
                                                │
DNF/Hazard CSV/JSON ─→ Dry-run ─→ Data validation ─→ Import có phê duyệt
```

## 3. Chuẩn bị dữ liệu hình ảnh

### 3.1 Xác định lớp lỗi

Tên lớp phải mô tả một hiện tượng có thể nhìn thấy và có tiêu chí phân biệt rõ. Ví dụ:

- `belt_crack`;
- `corrosion`;
- `oil_leak`;
- `bearing_displacement`;
- `insulation_damage`;
- `foreign_object`.

Không nên dùng lớp quá chung như `bad`, `abnormal` hoặc ghép nhiều hiện tượng khác nhau vào một lớp.

### 3.2 Thu thập ảnh

Mỗi lớp cần ảnh đa dạng về:

- góc chụp và khoảng cách;
- điều kiện sáng;
- camera/điện thoại khác nhau;
- thiết bị, ga và vị trí khác nhau;
- mức độ lỗi nhẹ, vừa và rõ;
- ảnh không có lỗi để đánh giá false positive.

Ngưỡng kỹ thuật trong dịch vụ là tối thiểu 20 nhãn đã duyệt cho mỗi lớp để cho phép chạy thử. Đây chỉ là ngưỡng POC. Trước nghiệm thu nên có tối thiểu vài trăm ảnh đại diện cho mỗi lớp quan trọng và phải dựa trên kết quả đường cong học, không dựa duy nhất vào số lượng.

### 3.3 Tránh rò rỉ dữ liệu

Không đặt các khung hình liên tiếp của cùng một video vào cả train và validation. Nên chia theo:

- thiết bị;
- ngày chụp;
- camera;
- địa điểm;
- đợt kiểm tra.

Ảnh gần như giống nhau phải nằm trong cùng một split.

### 3.4 Tỷ lệ chia dữ liệu

Khuyến nghị ban đầu:

```text
Train       70%
Validation  20%
Test        10%
```

Test set phải được khóa và không dùng để điều chỉnh tham số.

## 4. Sử dụng Vision Training Studio

### 4.1 Cấu hình

```env
DATA_PLATFORM_PHASE=3
VISION_TRAINER_TOKEN=<chuỗi ngẫu nhiên tối thiểu 24 ký tự>
VISION_TRAINING_ENABLED=false
```

Khởi động Phase 3, sau đó mở:

```text
/admin/ai-governance/vision-training
```

Chỉ bật:

```env
VISION_TRAINING_ENABLED=true
```

khi GPU/tài nguyên, quota và dataset đã được phê duyệt.

### 4.2 Quy trình

1. Tạo dataset và khai báo danh sách lớp.
2. Chọn ảnh.
3. Chọn lớp lỗi.
4. Kéo chuột để vẽ bounding box.
5. Chọn `train`, `val` hoặc `test`.
6. Gửi mẫu; mẫu vào trạng thái `PENDING_REVIEW`.
7. Người có quyền kiểm tra ảnh/box và bấm duyệt.
8. Chỉ mẫu `APPROVED` được đưa vào huấn luyện.
9. Tạo job training.
10. Job hoàn thành ở trạng thái `SUCCEEDED_REVIEW_REQUIRED`.
11. Người có thẩm quyền đánh giá metric và phê duyệt model.
12. Model chuyển sang `APPROVED_NOT_DEPLOYED`; không tự thay model production.

## 5. Đánh giá model

Không sử dụng một mình accuracy. Tối thiểu phải xem:

- precision;
- recall;
- mAP@0.50;
- mAP@0.50:0.95;
- confusion matrix;
- false positive theo lớp;
- false negative theo lớp;
- kết quả trên ảnh từ ga/camera chưa xuất hiện trong train;
- thời gian suy luận p95;
- mức sử dụng CPU/GPU/RAM.

Đối với lỗi an toàn, false negative thường quan trọng hơn false positive. Ngưỡng chấp nhận phải được phê duyệt theo từng lớp lỗi.

## 6. Triển khai model

Model đã duyệt không được tự động đưa vào YOLO inference service. Quy trình phát hành phải gồm:

1. lưu checksum và artifact trong MLflow/object storage;
2. security scan model artifact;
3. shadow test trên dữ liệu thật;
4. canary deployment;
5. đối chiếu với người kiểm tra;
6. theo dõi drift;
7. rollback reference;
8. phê duyệt con người.

## 7. Nhập/xuất DNF và Hazard

Màn hình quản trị:

```text
/admin/data-exchange
```

API:

```text
GET  /api/data-exchange/dnf?format=csv
GET  /api/data-exchange/dnf?format=json
POST /api/data-exchange/dnf?dryRun=true
POST /api/data-exchange/dnf?dryRun=false

GET  /api/data-exchange/hazard?format=csv
GET  /api/data-exchange/hazard?format=json
POST /api/data-exchange/hazard?dryRun=true
POST /api/data-exchange/hazard?dryRun=false
```

Yêu cầu:

- quyền `admin:system`;
- tối đa 5.000 dòng;
- tệp tối đa 10MB;
- dry-run trước khi ghi;
- nút ghi bị khóa nếu còn dòng bị từ chối;
- CSV export chống formula injection;
- ngày phải là giá trị hợp lệ/ISO-8601;
- danh sách dùng dấu `;` hoặc `|`.

Không chỉnh trực tiếp database để sửa lỗi import. Sửa tệp nguồn và chạy lại dry-run.

## 8. Tích hợp SCADA/F-SCADA

### 8.1 Nguyên tắc

SCADA Gateway chỉ đọc dữ liệu. Không hỗ trợ command, setpoint, acknowledge hoặc điều khiển từ xa.

Các adapter native:

- OPC UA;
- Modbus TCP;
- REST API.

Đối với F-SCADA hoặc SCADA hãng riêng:

- dùng REST API read-only của hãng; hoặc
- dùng vendor gateway chuyển giao thức sang REST/MQTT; hoặc
- bổ sung adapter mới theo cùng interface, không sửa ETL/Digital Twin.

Không thể cam kết “mọi SCADA” bằng một giao thức duy nhất. Tính tương thích được đạt bằng adapter contract và lớp chuẩn hóa.

### 8.2 Cấu hình

Sao chép:

```text
infra/scada-gateway/config.example.yaml
```

sang một tệp cấu hình ngoài repository, sau đó đặt:

```env
SCADA_GATEWAY_ENABLED=true
SCADA_CONFIG_FILE=/đường/dẫn/scada.yaml
```

Mỗi point phải ánh xạ tối thiểu:

```yaml
tag: <tag SCADA>
asset_id: <Asset ID trong Asset 360>
station: <mã ga>
subsystem: <hệ thống>
metric: <tên đại lượng>
unit: <đơn vị>
```

Nếu `asset_id` không trùng Asset 360, dữ liệu vẫn vào ETL nhưng không liên kết đúng Digital Twin.

### 8.3 Chuẩn đầu ra

Gateway phát MQTT:

```text
hurc/<environment>/<line>/<station>/<subsystem>/<assetId>/telemetry
```

Payload dùng telemetry schema `1.0.0`, gồm:

- event ID;
- timestamp;
- source/gateway/protocol;
- asset identity;
- quality;
- metric/value/unit/tag.

## 9. Kiểm soát an ninh SCADA

Bắt buộc trước production:

- tài khoản read-only riêng;
- network segmentation/DMZ;
- allowlist IP và port;
- TLS/VPN khi qua vùng mạng;
- secret lưu trong secret manager;
- không commit token hoặc password;
- không kết nối trực tiếp Internet vào mạng điều khiển;
- audit log và time synchronization;
- kiểm thử mất kết nối/reconnect;
- xác nhận gateway không có đường ghi;
- đánh giá với đơn vị quản lý SCADA và an toàn thông tin.

## 10. Biến môi trường

Tệp mẫu:

```text
docs/config/vision-scada.env.example
```

Production cần image digest:

```env
VISION_TRAINER_IMAGE=registry/vision-trainer@sha256:<digest>
SCADA_GATEWAY_IMAGE=registry/scada-gateway@sha256:<digest>
```

## 11. CI và nghiệm thu

Workflow:

```text
.github/workflows/vision-scada-data-exchange.yml
```

Workflow kiểm tra:

- Compose overlay;
- SCADA read-only contract;
- Vision review/no-auto-deploy contract;
- Python syntax;
- CSV round-trip và formula injection;
- TypeScript;
- lint.

Chưa được đánh dấu production-ready nếu chưa có:

- CI xanh cho đúng commit;
- image pin/digest;
- dataset review và leakage check;
- model validation được phê duyệt;
- SCADA read-only/security review;
- load test và latency benchmark;
- backup/restore dataset, model và cấu hình;
- rollback model;
- kiểm thử reconnect và dữ liệu trùng/mất.
