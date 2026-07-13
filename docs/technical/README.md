# Technical Documentation Index

Thư mục này chứa tài liệu kỹ thuật phục vụ lập trình viên, kỹ sư hệ thống, DevOps và người rà soát kiến trúc.

| Tài liệu | Mục đích |
|---|---|
| `BUILD_WINDOWS_LINUX_GUIDE.md` | Hướng dẫn build source, development, Docker, Prisma, biến môi trường, smoke test và debug trên Linux/Windows. |
| `AI_ARCHITECTURE_CONFIGURATION_REFERENCE.md` | Tham chiếu kiến trúc AI, công thức risk/confidence, limit, profile và hard limit. |
| `AI_RUNTIME_PROFILE_OPERATIONS.md` | Trạng thái runtime, environment switch, bảng profile thực thi, rollout, rollback và giới hạn tương thích. |
| `AI_CONTINUOUS_LEARNING_UX_PRODUCTION_READINESS.md` | Vòng học liên tục có kiểm duyệt, tối ưu tốc độ/UX và attestation production gắn đúng commit. |
| `AI_BIGDATA_IOT_BLOCKCHAIN_TARGET_ARCHITECTURE.md` | Kiến trúc đích hợp nhất AI, Big Data, IoT và Blockchain; profile LOW/STANDARD/HIGH; roadmap, bảo mật, KPI và tiêu chí nghiệm thu. |
| `CONVERGED_PLATFORM_RUNTIME_OPERATIONS.md` | Hướng dẫn chạy runtime Phase 1–4, kiểm tra MQTT/Timescale/Kafka/MinIO/ClickHouse/MLflow/Besu, rollback và production hardening. |
| `DIGITAL_TWIN_OPERATIONAL_CONTROL_CENTER.md` | Mục đích nghiệp vụ, transactional outbox, Health Engine, logic liên kết, UX, HA readiness và tiêu chí nghiệm thu Digital Twin. |
| `PROJECT_STRUCTURE_GUIDE.md` | Quy chuẩn cấu trúc dự án Frontend React/Next.js và Backend Golang. |
| `STRUCTURE_MIGRATION_PLAN.md` | Kế hoạch sắp xếp lại thư mục phần mềm theo từng đợt. |
| `API_INTEGRATION_GUIDE.md` | Hướng dẫn tích hợp API nếu được bổ sung. |
| `DATABASE_GUIDE.md` | Hướng dẫn database/schema nếu được bổ sung. |
| `MODULE_BOUNDARY_GUIDE.md` | Hướng dẫn ranh giới module nếu được bổ sung. |
| `SECURITY_GUIDE.md` | Hướng dẫn bảo mật nếu được bổ sung. |

## Trạng thái profile và học liên tục của AI

Profile runtime:

```text
AI_RUNTIME_PROFILE=LOW|STANDARD|HIGH
AI_ASSURANCE_PROFILE=LOW|STANDARD|HIGH
```

Vòng học có kiểm duyệt:

```text
AI_CONTINUOUS_LEARNING_ENABLED=true|false
AI_LEARNING_WINDOW_DAYS=7..180
AI_LEARNING_MIN_CONFIDENCE=0.65..0.95
AI_LEARNING_MIN_REINFORCEMENTS=2..20
```

Nguyên tắc:

- mặc định profile là `STANDARD/STANDARD`;
- AI chỉ đọc, phân tích và đề xuất;
- phản hồi đi qua Memory Firewall, provenance và quarantine;
- human approval luôn bắt buộc;
- auto promotion, tự sửa mã và ghi dữ liệu vận hành luôn bị khóa;
- CI chạy `test:ai-governance`, `test:ai-profiles` và `test:continuous-learning` trước lint/build.

Tệp environment mẫu:

```text
docs/config/ai-governance-profiles.env.example
```

## Trạng thái runtime AI – Big Data – IoT – Blockchain

Runtime opt-in đã được thêm theo thứ tự bắt buộc:

| Phase | Trạng thái mã nguồn | Thành phần |
|---:|---|---|
| 1 | Đã có runtime POC/UAT | Mosquitto, IoT ingestor, TimescaleDB |
| 2 | Đã có runtime POC/UAT | Redpanda/Kafka, Outbox Relay, Redpanda Connect, MinIO, ClickHouse |
| 3 | Đã có runtime POC/UAT | MLflow |
| 4 | Đã có runtime POC/UAT | Besu dev node, authenticated evidence-ledger gateway |

Cấu hình trung tâm:

```text
DATA_PLATFORM_PHASE=0|1|2|3|4
```

Các dịch vụ nằm trong:

```text
docker-compose.yml
docker-compose.platform.yml
docker-compose.platform-enhancements.yml
```

Runtime `core` không tự động kéo các container mới.

Tệp environment và runbook:

```text
docs/config/converged-platform.env.example
docs/technical/CONVERGED_PLATFORM_RUNTIME_OPERATIONS.md
docs/technical/DIGITAL_TWIN_OPERATIONAL_CONTROL_CENTER.md
docs/technical/AI_CONTINUOUS_LEARNING_UX_PRODUCTION_READINESS.md
```

Control Center có một điểm vào chính `/iot` và các tab `/data-platform`, `/mlops`, `/evidence-ledger`; live health API, Digital Twin overview, deep-link Asset 360 và Production Readiness Gate.

## Điều kiện đánh dấu Production Ready

Lệnh kiểm tra cấu hình:

```bash
npm run platform:production:check
```

Lệnh tạo attestation:

```bash
npm run platform:production:attest
```

Workflow chính thức:

```text
.github/workflows/platform-production-readiness.yml
```

Chỉ ghi `PRODUCTION_READY` khi:

- CI/CD acceptance xanh;
- image được pin version hoặc digest;
- mTLS/ACL và device identity được cưỡng chế;
- benchmark tải và security review được phê duyệt;
- backup/restore và DR đã kiểm thử;
- external signer/KMS-HSM hoạt động;
- toàn bộ Phase 1–4 không còn blocker;
- `APP_COMMIT_SHA` khớp `PLATFORM_ATTESTATION_COMMIT_SHA`.

Container đang chạy hoặc healthcheck xanh không đồng nghĩa production-ready. Artifact attestation phải gắn với đúng commit triển khai.

Blockchain chỉ lưu hash và metadata tối thiểu; không thay database nghiệp vụ hoặc telemetry store.

Không đánh dấu CI/CD `PASS` nếu chưa có kết quả pipeline thực tế.

## Nguyên tắc cập nhật

1. Tài liệu kỹ thuật phải nêu rõ phạm vi áp dụng.
2. Khi thay đổi cấu trúc mã nguồn, phải cập nhật tài liệu liên quan.
3. Không ghi secret, token, mật khẩu hoặc connection string thật vào tài liệu.
4. Không kết luận production-ready nếu chưa có CI/CD xanh, attestation đúng commit và bằng chứng kiểm thử.
5. Khi thay đổi package, environment, Docker, Compose, Prisma hoặc workflow, phải rà soát tài liệu build đa nền tảng.
6. Khi thay đổi limit AI, risk threshold, confidence, concurrency, timeout, Memory/Data Governance hoặc Tool Firewall, phải cập nhật tài liệu profile và bổ sung bằng chứng kiểm thử.
7. Khi thêm IoT, broker, time-series, lakehouse, MLOps hoặc blockchain, phải cập nhật kiến trúc đích, threat model, runbook, backup/restore và acceptance gate.
8. Mọi cơ chế học liên tục phải giữ human approval, provenance, quarantine và rollback.
