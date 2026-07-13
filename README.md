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

Định hướng phát triển tiếp theo là nền tảng hợp nhất:

```text
IoT tạo dữ liệu
→ Big Data tiếp nhận, lưu trữ và xử lý
→ AI phân tích, dự báo và hỗ trợ quyết định
→ Blockchain neo bằng chứng và xác minh liên tổ chức
```

Blockchain không được dùng thay database nghiệp vụ hoặc kho telemetry. Kiến trúc đích và roadmap được mô tả tại [AI, Big Data, IoT and Blockchain Target Architecture](docs/technical/AI_BIGDATA_IOT_BLOCKCHAIN_TARGET_ARCHITECTURE.md).

## Phân hệ chính

| Phân hệ | Nội dung |
|---|---|
| Dashboard | Theo dõi tổng quan dữ liệu vận hành. |
| DNF | Ghi nhận và theo dõi sự cố. |
| Hazards | Quản lý mối nguy. |
| Inspections | Số hóa hoạt động kiểm tra. |
| Tasks | Theo dõi công việc và phân công. |
| Asset 360 | Quản lý tài sản và lịch sử liên quan. |
| Rail Network | Quản lý tuyến và ga. |
| GIS/BIM Twin | Quản lý dữ liệu không gian và mô hình kỹ thuật. |
| AI Lab | Hỗ trợ hỏi đáp tài liệu và Incident Learning. |
| Admin | Quản trị người dùng, vai trò và cấu hình. |

## Tài liệu kỹ thuật

| Tài liệu | Nội dung chính |
|---|---|
| [0. Documentation Structure and Writing Guide](docs/00_DOCUMENTATION_STRUCTURE_AND_WRITING_GUIDE.md) | Quy chuẩn sắp xếp thư mục, phân loại đối tượng đọc, loại tài liệu, cấu trúc và nguyên tắc biên soạn. |
| [Linux and Windows Build Guide](docs/technical/BUILD_WINDOWS_LINUX_GUIDE.md) | Hướng dẫn build source, development, Docker, biến môi trường, Prisma, smoke test và xử lý lỗi trên Linux/Windows. |
| [AI Architecture and Configuration Reference](docs/technical/AI_ARCHITECTURE_CONFIGURATION_REFERENCE.md) | Kiến trúc AI; risk/confidence; limit; Memory, Data, MCP, Vision và rate-limit. |
| [AI Runtime Profile Operations](docs/technical/AI_RUNTIME_PROFILE_OPERATIONS.md) | Environment switch, profile đang chạy, hard limit, rollout, rollback và giới hạn tương thích. |
| [AI, Big Data, IoT and Blockchain Target Architecture](docs/technical/AI_BIGDATA_IOT_BLOCKCHAIN_TARGET_ARCHITECTURE.md) | Kiến trúc đích hợp nhất, profile LOW/STANDARD/HIGH, roadmap, bảo mật, KPI và tiêu chí nghiệm thu. |
| [Project Structure Guide](docs/technical/PROJECT_STRUCTURE_GUIDE.md) | Quy chuẩn cấu trúc dự án Frontend React/Next.js và Backend Golang; nguyên tắc package-by-feature, `cmd/`, `internal/`, API và checklist tái cấu trúc. |
| [Structure Migration Plan](docs/technical/STRUCTURE_MIGRATION_PLAN.md) | Kế hoạch sắp xếp lại thư mục phần mềm theo từng đợt và theo dõi CI/CD sau khi merge PR #29. |
| [1. System Architecture](docs/1_SYSTEM_ARCHITECTURE.md) | Kiến trúc, module boundary, Service Bus và giới hạn hiện tại. |
| [2. Design and Coding Rules](docs/2_DESIGN_AND_CODING_RULES.md) | Quy tắc thiết kế, Vibe Code, hook/UI và checklist review. |
| [3. Developer Guide](docs/3_DEVELOPER_GUIDE.md) | Hướng dẫn tạo module, module mẫu, offline entity sync và audit. |
| [4. Deployment and Ops](docs/4_DEPLOYMENT_AND_OPS.md) | Dockerfile, docker-compose, CI, healthcheck và smoke test. |
| [5. Admin User Guide](docs/5_ADMIN_USER_GUIDE.md) | Hướng dẫn quản trị hệ thống. |
| [6. Modules and Features](docs/6_MODULES_AND_FEATURES.md) | Tổng hợp module và luồng nghiệp vụ. |

## Kiểm tra nhanh

Repository chưa được xem là có dependency install tái lập cho đến khi `package-lock.json` hoàn chỉnh được tạo và commit. Dùng quy tắc sau trên máy phát triển:

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
npm run lint
npm run build
```

Trên Windows PowerShell, xem lệnh tương ứng trong [Linux and Windows Build Guide](docs/technical/BUILD_WINDOWS_LINUX_GUIDE.md).

Ghi chú: `npm run lint` dùng local ESLint executable và flat config của Next.js. Không gọi subpath nội bộ của package ESLint.

## CI hiện có

- Security and Acceptance Gate.
- AI governance invariant checks.
- AI executable profile invariant checks.
- Docker Acceptance Gate.
- Design rules audit.
- Module boundary audit.
- Module registry audit.
- Developer Guide audit.
- Deployment and Ops evidence audit.
- Production smoke test.

## Lưu ý dữ liệu

Dữ liệu demo, GIS/BIM, Google Maps, Incident Memory và Digital Twin cần được phân biệt với dữ liệu chính thức trước khi dùng cho nghiệm thu vận hành.

Kiến trúc AI – Big Data – IoT – Blockchain hiện là định hướng và roadmap. Chưa được mô tả là runtime đã triển khai cho đến khi có code, infrastructure, test, runbook và CI/CD tương ứng.
