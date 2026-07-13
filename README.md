# HURC1 CRM (Metro Inspect Pro)

HURC1 CRM là hệ thống quản trị, giám sát và hỗ trợ bảo trì đường sắt đô thị. Phần mềm hỗ trợ các nghiệp vụ kiểm tra, DNF, mối nguy, công việc, tài sản, AI Lab, GIS/BIM và Digital Twin.

## Trạng thái hiện tại

Hệ thống hiện là **Modular Monolith theo hướng Micro-Frontend-ready**. Các module vẫn chạy chung trong Next.js App Shell, nhưng đã có ranh giới module, module registry, Service Bus và các bước kiểm tra trong CI.

Không mô tả hệ thống là Micro-Frontend triển khai độc lập hoặc production-ready tuyệt đối nếu chưa có đủ kết quả kiểm thử, dữ liệu chính thức và quy trình vận hành được phê duyệt.

AI Governance hỗ trợ profile runtime thực thi:

```text
AI_RUNTIME_PROFILE=LOW|STANDARD|HIGH
AI_ASSURANCE_PROFILE=LOW|STANDARD|HIGH
```

Mặc định `STANDARD/STANDARD`. Quyền ghi của AI luôn bị khóa.

AI có vòng học liên tục có kiểm duyệt:

```text
Phản hồi và dữ liệu đã xác minh
→ Memory Firewall
→ provisional/quarantine
→ shadow evaluation
→ đề xuất cải thiện
→ human approval
→ verified knowledge hoặc model release có kiểm soát
```

AI không tự sửa mã, không tự phát hành model và không tự ghi dữ liệu vận hành.

Nền tảng hợp nhất AI – Big Data – IoT – Blockchain có runtime opt-in:

```text
DATA_PLATFORM_PHASE=0|1|2|3|4
```

| Phase | Thành phần runtime |
|---:|---|
| 0 | Tắt nền tảng mở rộng; chỉ chạy core khi được chọn |
| 1 | MQTT, IoT ingestor và TimescaleDB |
| 2 | Phase 1 + Redpanda/Kafka, transactional outbox relay, MinIO và ClickHouse |
| 3 | Phase 2 + MLflow |
| 4 | Phase 3 + Besu và Evidence Ledger Gateway |

Các dịch vụ nằm trong:

```text
docker-compose.yml
docker-compose.platform.yml
docker-compose.platform-enhancements.yml
```

Chúng chỉ được bật qua Docker profile tương ứng. Blockchain chỉ neo hash và metadata tối thiểu; không thay database nghiệp vụ, time-series store hoặc object storage.

Runtime hiện tại là nền tảng POC/UAT có kiểm soát cho đến khi workflow attestation production thành công. Kiến trúc và runbook:

- [AI, Big Data, IoT and Blockchain Target Architecture](docs/technical/AI_BIGDATA_IOT_BLOCKCHAIN_TARGET_ARCHITECTURE.md);
- [Converged Platform Runtime Operations](docs/technical/CONVERGED_PLATFORM_RUNTIME_OPERATIONS.md);
- [Digital Twin Operational Control Center](docs/technical/DIGITAL_TWIN_OPERATIONAL_CONTROL_CENTER.md);
- [AI Continuous Learning, UX and Production Readiness](docs/technical/AI_CONTINUOUS_LEARNING_UX_PRODUCTION_READINESS.md).

## Phân hệ chính

| Phân hệ | Nội dung |
|---|---|
| Dashboard | Theo dõi tổng quan dữ liệu vận hành. |
| DNF | Ghi nhận và theo dõi sự cố. |
| Hazards | Quản lý mối nguy. |
| Inspections | Số hóa hoạt động kiểm tra. |
| Tasks | Theo dõi công việc và phân công. |
| Asset 360 | Quản lý tài sản, Health Engine và lịch sử liên quan. |
| Rail Network | Quản lý tuyến và ga. |
| GIS/BIM Twin | Quản lý dữ liệu không gian và mô hình kỹ thuật. |
| Nền tảng số hội tụ | Một điểm vào cho IoT, Data Platform, MLOps và Evidence Ledger. |
| AI Lab | Hỗ trợ hỏi đáp tài liệu và Incident Learning. |
| Admin | Quản trị người dùng, vai trò, vòng học AI và cấu hình. |

## Digital Twin và trải nghiệm điều hành

Control Center có điểm vào chính:

```text
/iot
```

Các tab chuyên sâu:

```text
/data-platform
/mlops
/evidence-ledger
```

Control Center hợp nhất:

- live component health;
- outbox pending/retry;
- Digital Twin overall score;
- confidence theo tài sản;
- DNF/Hazard/telemetry correlation;
- penalty có thể giải thích;
- deep-link đến đúng tài sản trong Asset 360;
- Production Readiness score và blocker;
- tải từng phần khi một nguồn dữ liệu chậm;
- polling chỉ khi tab đang hiển thị;
- loading skeleton và thời điểm cập nhật gần nhất.

Hai API điều hành dùng bounded TTL cache, stale-while-refresh, payload limit và `server-timing` để giảm truy vấn lặp và cải thiện tốc độ phản hồi.

DNF/Hazard được đưa vào transactional outbox bằng PostgreSQL trigger trong cùng transaction, sau đó relay at-least-once sang Redpanda/Kafka.

## Production Readiness Attestation

Không đánh dấu Phase 1–4 là production-ready chỉ vì container đang chạy hoặc healthcheck xanh.

Lệnh kiểm tra:

```bash
npm run platform:production:check
```

Lệnh phát hành attestation:

```bash
npm run platform:production:attest
```

Workflow:

```text
.github/workflows/platform-production-readiness.yml
```

`PRODUCTION_READY` chỉ xuất hiện khi:

- CI/CD acceptance xanh;
- image được pin version/digest;
- mTLS/ACL và device identity;
- load-test và security review được phê duyệt;
- backup/restore và DR đã kiểm thử;
- external signer/KMS-HSM;
- toàn bộ Phase 1–4 không còn blocker;
- attestation khớp đúng commit ứng dụng.

Commit binding:

```text
APP_COMMIT_SHA=<deployed-sha>
PLATFORM_ATTESTATION_COMMIT_SHA=<same-approved-sha>
```

Artifact được lưu tại `.build-logs/platform-production-attestation.json` và được GitHub Actions tải lên khi workflow chạy.

## Tài liệu kỹ thuật

| Tài liệu | Nội dung chính |
|---|---|
| [0. Documentation Structure and Writing Guide](docs/00_DOCUMENTATION_STRUCTURE_AND_WRITING_GUIDE.md) | Quy chuẩn sắp xếp thư mục, phân loại đối tượng đọc, loại tài liệu, cấu trúc và nguyên tắc biên soạn. |
| [Linux and Windows Build Guide](docs/technical/BUILD_WINDOWS_LINUX_GUIDE.md) | Hướng dẫn build source, development, Docker, biến môi trường, Prisma, smoke test và xử lý lỗi trên Linux/Windows. |
| [AI Architecture and Configuration Reference](docs/technical/AI_ARCHITECTURE_CONFIGURATION_REFERENCE.md) | Kiến trúc AI; risk/confidence; limit; Memory, Data, MCP, Vision và rate-limit. |
| [AI Runtime Profile Operations](docs/technical/AI_RUNTIME_PROFILE_OPERATIONS.md) | Environment switch, profile đang chạy, hard limit, rollout, rollback và giới hạn tương thích. |
| [AI Continuous Learning, UX and Production Readiness](docs/technical/AI_CONTINUOUS_LEARNING_UX_PRODUCTION_READINESS.md) | Vòng học có kiểm duyệt, tối ưu tốc độ/UX và attestation đúng commit. |
| [AI, Big Data, IoT and Blockchain Target Architecture](docs/technical/AI_BIGDATA_IOT_BLOCKCHAIN_TARGET_ARCHITECTURE.md) | Kiến trúc đích hợp nhất, profile LOW/STANDARD/HIGH, roadmap, bảo mật, KPI và tiêu chí nghiệm thu. |
| [Converged Platform Runtime Operations](docs/technical/CONVERGED_PLATFORM_RUNTIME_OPERATIONS.md) | Cách chạy Phase 1–4, health-check, dữ liệu mẫu, rollback và production hardening. |
| [Digital Twin Operational Control Center](docs/technical/DIGITAL_TWIN_OPERATIONAL_CONTROL_CENTER.md) | Thuật toán health, outbox, UX, HA gate và tiêu chí nghiệm thu. |
| [Project Structure Guide](docs/technical/PROJECT_STRUCTURE_GUIDE.md) | Quy chuẩn cấu trúc dự án Frontend React/Next.js và Backend Golang. |
| [1. System Architecture](docs/1_SYSTEM_ARCHITECTURE.md) | Kiến trúc, module boundary, Service Bus và giới hạn hiện tại. |
| [4. Deployment and Ops](docs/4_DEPLOYMENT_AND_OPS.md) | Dockerfile, docker-compose, CI, healthcheck và smoke test. |

## Kiểm tra nhanh

Repository chưa được xem là có dependency install tái lập cho đến khi `package-lock.json` hoàn chỉnh được tạo và commit.

```bash
if [ -f package-lock.json ]; then
  npm ci --include=dev --ignore-scripts
else
  npm install --include=dev --ignore-scripts
fi

npm run db:validate:all
npm run db:generate:all
npm run typecheck
npm run test:ai-governance
npm run test:ai-profiles
npm run test:continuous-learning
npm run test:platform-profiles
npm run test:digital-twin-health
npm run test:platform-readiness
npm run platform:config
npm run lint
npm run build
```

Trên Windows PowerShell, xem lệnh tương ứng trong [Linux and Windows Build Guide](docs/technical/BUILD_WINDOWS_LINUX_GUIDE.md).

## CI hiện có

- Security and Acceptance Gate;
- AI governance/profile/continuous-learning invariant checks;
- Converged platform profile invariant checks;
- Digital Twin health invariant checks;
- Platform production readiness invariant checks;
- Platform Production Readiness Attestation workflow;
- Converged platform Compose validation;
- Docker Acceptance Gate;
- Module boundary và registry audit;
- Production route smoke test.

## Lưu ý dữ liệu và nghiệm thu

Dữ liệu demo, GIS/BIM, Google Maps, Incident Memory, telemetry, model artifact và Digital Twin cần được phân biệt với dữ liệu chính thức trước khi dùng cho nghiệm thu vận hành.

Không đánh dấu nền tảng Phase 1–4 là production-ready cho đến khi workflow attestation thành công cho đúng commit và artifact chứng minh đầy đủ CI/CD, image pin, mTLS/ACL, load-test, security review, backup/restore, DR và external signer/KMS-HSM.
