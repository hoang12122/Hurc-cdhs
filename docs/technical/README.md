# Technical Documentation Index

Thư mục này chứa tài liệu kỹ thuật phục vụ lập trình viên, kỹ sư hệ thống, DevOps và người rà soát kiến trúc.

| Tài liệu | Mục đích |
|---|---|
| `BUILD_WINDOWS_LINUX_GUIDE.md` | Hướng dẫn build source, development, Docker, Prisma, biến môi trường, smoke test và debug trên Linux/Windows. |
| `AI_ARCHITECTURE_CONFIGURATION_REFERENCE.md` | Tham chiếu kiến trúc AI, công thức risk/confidence, limit, profile và hard limit. |
| `AI_RUNTIME_PROFILE_OPERATIONS.md` | Trạng thái runtime, environment switch, bảng profile thực thi, rollout, rollback và giới hạn tương thích. |
| `AI_BIGDATA_IOT_BLOCKCHAIN_TARGET_ARCHITECTURE.md` | Kiến trúc đích hợp nhất AI, Big Data, IoT và Blockchain; profile LOW/STANDARD/HIGH; roadmap, bảo mật, KPI và tiêu chí nghiệm thu. |
| `CONVERGED_PLATFORM_RUNTIME_OPERATIONS.md` | Hướng dẫn chạy runtime Phase 1–4, kiểm tra MQTT/Timescale/Kafka/MinIO/ClickHouse/MLflow/Besu, rollback và production hardening. |
| `PROJECT_STRUCTURE_GUIDE.md` | Quy chuẩn cấu trúc dự án Frontend React/Next.js và Backend Golang. |
| `STRUCTURE_MIGRATION_PLAN.md` | Kế hoạch sắp xếp lại thư mục phần mềm theo từng đợt. |
| `API_INTEGRATION_GUIDE.md` | Hướng dẫn tích hợp API nếu được bổ sung. |
| `DATABASE_GUIDE.md` | Hướng dẫn database/schema nếu được bổ sung. |
| `MODULE_BOUNDARY_GUIDE.md` | Hướng dẫn ranh giới module nếu được bổ sung. |
| `SECURITY_GUIDE.md` | Hướng dẫn bảo mật nếu được bổ sung. |

## Trạng thái profile AI

Profile hiện đã được kích hoạt trong runtime thông qua:

```text
AI_RUNTIME_PROFILE=LOW|STANDARD|HIGH
AI_ASSURANCE_PROFILE=LOW|STANDARD|HIGH
```

- Mặc định là `STANDARD/STANDARD`.
- `STANDARD/STANDARD` giữ giá trị CURRENT trước khi Config Registry được triển khai.
- Runtime profile điều khiển timeout, concurrency, queue, MCP, Vision, upload và rate-limit.
- Assurance profile điều khiển confidence, provisional memory, trust/quality threshold, login/2FA và AI memory candidate.
- `LOW` assurance bị chặn trong production nếu không có override có chủ đích.
- Quyền ghi của AI luôn `false` ở mọi profile.
- Dashboard quản trị hiển thị profile và cấu hình đã resolve.
- CI chạy `test:ai-governance` và `test:ai-profiles` trước lint/build.

Tệp environment mẫu:

```text
docs/config/ai-governance-profiles.env.example
```

## Trạng thái runtime AI – Big Data – IoT – Blockchain

Runtime opt-in đã được thêm theo thứ tự bắt buộc:

| Phase | Trạng thái mã nguồn | Thành phần |
|---:|---|---|
| 1 | Đã có runtime POC/UAT | Mosquitto, IoT ingestor, TimescaleDB |
| 2 | Đã có runtime POC/UAT | Redpanda/Kafka, Redpanda Connect, MinIO, ClickHouse |
| 3 | Đã có runtime POC/UAT | MLflow |
| 4 | Đã có runtime POC/UAT | Besu dev node, authenticated evidence-ledger gateway |

Cấu hình trung tâm:

```text
DATA_PLATFORM_PHASE=0|1|2|3|4
```

Các dịch vụ nằm trong `docker-compose.platform.yml` và chỉ được bật khi người vận hành chọn Docker profile `phase1`, `phase2`, `phase3` hoặc `phase4`. Runtime `core` không tự động kéo các container này.

Tệp environment và runbook:

```text
docs/config/converged-platform.env.example
docs/technical/CONVERGED_PLATFORM_RUNTIME_OPERATIONS.md
```

Các cấu hình hiện tại là nền tảng POC/UAT, chưa phải production HA. Trước production phải thay Mosquitto anonymous, Redpanda single-node, MLflow SQLite và Besu dev network bằng cấu hình đã được phê duyệt; đồng thời phải pin image, triển khai mTLS/ACL, external signer/KMS-HSM, load-test, backup/restore và rollback test.

Blockchain chỉ lưu hash và metadata tối thiểu; không thay database nghiệp vụ hoặc telemetry store.

Không đánh dấu CI/CD `PASS` nếu chưa có kết quả pipeline thực tế.

## Nguyên tắc cập nhật

1. Tài liệu kỹ thuật phải nêu rõ phạm vi áp dụng.
2. Khi thay đổi cấu trúc mã nguồn, phải cập nhật tài liệu liên quan.
3. Không ghi secret, token, mật khẩu hoặc connection string thật vào tài liệu.
4. Không kết luận production-ready nếu chưa có CI/CD xanh và bằng chứng kiểm thử.
5. Khi thay đổi package, environment, Docker, Compose, Prisma hoặc workflow, phải rà soát tài liệu build đa nền tảng.
6. Khi thay đổi limit AI, risk threshold, confidence, concurrency, timeout, Memory/Data Governance hoặc Tool Firewall, phải cập nhật tài liệu profile và bổ sung bằng chứng kiểm thử.
7. Khi thêm IoT, broker, time-series, lakehouse, MLOps hoặc blockchain, phải cập nhật kiến trúc đích, threat model, runbook, backup/restore và acceptance gate.
