# AI Continuous Learning, UX Performance and Production Readiness

## 1. Mục tiêu

Tài liệu này mô tả ba cải tiến vận hành đã được đưa vào HURC-CDHS:

1. AI học liên tục từ phản hồi và dữ liệu đã xác minh;
2. giao diện phản hồi nhanh, chịu lỗi từng phần và giảm thao tác dư thừa;
3. Phase 1–4 chỉ được đánh dấu `PRODUCTION_READY` khi có attestation hợp lệ cho đúng commit.

AI vẫn ở vai trò đọc, phân tích và đề xuất. AI không tự sửa mã nguồn, không tự phát hành model, không tự thay đổi cấu hình và không tự ghi dữ liệu vận hành.

## 2. Vòng học liên tục có kiểm duyệt

Luồng thực thi:

```text
Phản hồi người dùng / dữ liệu đã xác minh
→ Memory Firewall
→ provisional hoặc quarantine
→ củng cố mẫu và phân tích chất lượng
→ shadow evaluation
→ đề xuất cải thiện
→ con người rà soát và phê duyệt
→ verified memory hoặc model release có kiểm soát
```

Các invariant bắt buộc:

| Kiểm soát | Giá trị cố định |
|---|---|
| Human approval | Bắt buộc |
| Automatic promotion | Tắt |
| Autonomous code changes | Tắt |
| Operational write access | Tắt |
| Prompt-injection screening | Bật |
| Provenance | Bắt buộc đối với feedback mới |
| Quarantine | Bật đối với phản hồi âm hoặc dữ liệu không an toàn |

Cấu hình:

```env
AI_CONTINUOUS_LEARNING_ENABLED=true
AI_LEARNING_WINDOW_DAYS=30
AI_LEARNING_MIN_CONFIDENCE=0.80
AI_LEARNING_MIN_REINFORCEMENTS=3
```

Hard limit:

- cửa sổ đánh giá: 7–180 ngày;
- confidence: 0,65–0,95;
- số lần củng cố: 2–20;
- các biến yêu cầu tự phát hành, tự sửa mã hoặc tự ghi dữ liệu không được runtime hỗ trợ.

AI Governance Dashboard hiển thị backlog provisional, quarantine, số lần củng cố, trạng thái phát hành và đề xuất xử lý. Các đề xuất không tự thực thi.

## 3. Tăng tốc độ phản hồi

Hai API điều hành sử dụng cache bounded trong từng Node.js process:

| API | Fresh TTL | Stale window | Giới hạn payload |
|---|---:|---:|---:|
| `/api/platform/status` | 5 giây | 10 giây | Toàn bộ trạng thái cần thiết |
| `/api/digital-twin/overview` | 10 giây | 20 giây | Mặc định 40, tối đa 200 tài sản |

Cơ chế cache có:

- single-flight cho cùng cache key;
- giới hạn số entry;
- stale-while-refresh;
- header `server-timing`;
- header `x-runtime-cache` với `HIT`, `MISS` hoặc `STALE`.

Cache này giảm truy vấn lặp khi nhiều người dùng cùng mở Control Center. Khi triển khai nhiều replica, có thể bổ sung Redis cache nếu benchmark chứng minh cần thiết; cache process-local không được mô tả là distributed cache.

## 4. Cải thiện UX/UI và workflow

Sidebar chỉ còn một điểm vào `Nền tảng số hội tụ`. Từ Control Center, người dùng chuyển giữa:

- Tổng quan IoT;
- Data Platform;
- MLOps;
- Evidence Ledger;
- Digital Twin.

Control Center:

- tải từng phần bằng `Promise.allSettled`;
- vẫn hiển thị dữ liệu còn khả dụng khi một API lỗi;
- hủy request cũ khi người dùng làm mới liên tiếp;
- chỉ polling khi tab trình duyệt đang hiển thị;
- tự làm mới khi quay lại tab;
- hiển thị thời điểm cập nhật gần nhất;
- có loading skeleton theo route;
- hiển thị blocker và remediation thật thay cho checklist hình thức;
- giới hạn danh sách tài sản ưu tiên và deep-link đến đúng Asset 360 record.

## 5. Ba trạng thái không được nhầm lẫn

| Trạng thái | Ý nghĩa |
|---|---|
| Runtime active | Container hoặc dịch vụ đang chạy |
| HA configuration complete | Cluster, mTLS/ACL, replication, backup và signer đã cấu hình |
| `PRODUCTION_READY` | HA hoàn tất, acceptance workflow xanh và attestation khớp đúng commit |

Container chạy không đủ điều kiện để ghi `PRODUCTION_READY`.

## 6. Production Readiness Gate

Readiness evaluator kiểm tra tối thiểu:

- MQTT tắt anonymous;
- TLS/mTLS và device identity;
- tối thiểu ba Kafka/Redpanda broker;
- replication factor tối thiểu 3;
- ClickHouse replicated;
- image được pin, không dùng `latest`;
- transactional outbox migration đã áp dụng;
- MLflow dùng PostgreSQL HA và object storage;
- model approval workflow;
- Besu permissioned network;
- external signer và KMS/HSM;
- benchmark tải được phê duyệt;
- đánh giá bảo mật được phê duyệt;
- backup/restore end-to-end;
- diễn tập DR;
- CI/CD acceptance xanh;
- attestation SHA khớp commit ứng dụng.

Biến commit binding:

```env
APP_COMMIT_SHA=<deployed-commit-sha>
PLATFORM_ATTESTATION_COMMIT_SHA=<same-approved-commit-sha>
```

Thiếu một giá trị hoặc hai SHA khác nhau tạo blocker `ATTESTATION_COMMIT`.

## 7. Workflow attestation

Workflow thủ công:

```text
.github/workflows/platform-production-readiness.yml
```

Thứ tự:

```text
Checkout
→ Install
→ Compose/schema validation
→ Typecheck
→ AI governance/profile/continuous-learning tests
→ Platform/Digital Twin/readiness tests
→ Lint
→ Production build
→ Dependency audit
→ Emit attestation
→ Upload JSON artifact
→ Enforce result
```

Artifact:

```text
.build-logs/platform-production-attestation.json
```

Artifact chứa commit SHA, workflow run ID, control evidence, trạng thái từng phase, blocker và warning. Workflow thất bại nếu bất kỳ Phase 1–4 hoặc control bắt buộc nào chưa đạt.

## 8. Lệnh kiểm tra

```bash
npm run test:continuous-learning
npm run test:platform-readiness
npm run platform:production:check
npm run platform:production:attest
```

`platform:production:attest` chỉ dùng trong môi trường có đầy đủ evidence. Không đặt các cờ acceptance thành `true` nếu chưa có artifact, biên bản và kết quả kiểm thử tương ứng.

## 9. Rollback

Khi phát hiện suy giảm:

1. giữ AI ở advisory-only;
2. tắt continuous learning collection bằng `AI_CONTINUOUS_LEARNING_ENABLED=false` nếu cần cô lập;
3. không xóa quarantine hoặc provenance;
4. rollback application về commit có attestation gần nhất;
5. đặt `PLATFORM_CI_ACCEPTANCE_PASSED=false` cho commit chưa kiểm định;
6. chạy lại benchmark, security review, restore/DR và workflow attestation.
