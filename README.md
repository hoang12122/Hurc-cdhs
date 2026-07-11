# HURC1 CRM (Metro Inspect Pro)

HURC1 CRM là hệ thống quản trị, giám sát và hỗ trợ bảo trì đường sắt đô thị. Phần mềm hỗ trợ các nghiệp vụ kiểm tra, DNF, mối nguy, công việc, tài sản, AI Lab, GIS/BIM và Digital Twin.

## Trạng thái hiện tại

Hệ thống hiện là **Modular Monolith theo hướng Micro-Frontend-ready**. Các module vẫn chạy chung trong Next.js App Shell, nhưng đã có ranh giới module, module registry, Service Bus và các bước kiểm tra trong CI.

Không mô tả hệ thống là Micro-Frontend triển khai độc lập hoặc production-ready tuyệt đối nếu chưa có đủ kết quả kiểm thử, dữ liệu chính thức và quy trình vận hành được phê duyệt.

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
| [Project Structure Guide](docs/technical/PROJECT_STRUCTURE_GUIDE.md) | Quy chuẩn cấu trúc dự án Frontend React/Next.js và Backend Golang; nguyên tắc package-by-feature, `cmd/`, `internal/`, API và checklist tái cấu trúc. |
| [Structure Migration Plan](docs/technical/STRUCTURE_MIGRATION_PLAN.md) | Kế hoạch sắp xếp lại thư mục phần mềm theo từng đợt và theo dõi CI/CD sau khi merge PR #29. |
| [1. System Architecture](docs/1_SYSTEM_ARCHITECTURE.md) | Kiến trúc, module boundary, Service Bus và giới hạn hiện tại. |
| [2. Design and Coding Rules](docs/2_DESIGN_AND_CODING_RULES.md) | Quy tắc thiết kế, Vibe Code, hook/UI và checklist review. |
| [3. Developer Guide](docs/3_DEVELOPER_GUIDE.md) | Hướng dẫn tạo module, module mẫu, offline entity sync và audit. |
| [4. Deployment and Ops](docs/4_DEPLOYMENT_AND_OPS.md) | Dockerfile, docker-compose, CI, healthcheck và smoke test. |
| [5. Admin User Guide](docs/5_ADMIN_USER_GUIDE.md) | Hướng dẫn quản trị hệ thống. |
| [6. Modules and Features](docs/6_MODULES_AND_FEATURES.md) | Tổng hợp module và luồng nghiệp vụ. |

## Kiểm tra nhanh

```bash
npm install --include=dev --ignore-scripts
npm run db:validate:all
npm run db:generate:all
npm run typecheck
npm run lint
npm run build
```

Ghi chú: `npm run lint` dùng `scripts/run-eslint.js` để giữ chế độ `.eslintrc.json` tương thích với ESLint v9 và Next.js; runner gọi executable trong `node_modules/.bin` thay vì gọi subpath nội bộ của package ESLint.

## CI hiện có

- Security and Acceptance Gate.
- Docker Acceptance Gate.
- Design rules audit.
- Module boundary audit.
- Module registry audit.
- Developer Guide audit.
- Deployment and Ops evidence audit.
- Production smoke test.

## Lưu ý dữ liệu

Dữ liệu demo, GIS/BIM, Google Maps, Incident Memory và Digital Twin cần được phân biệt với dữ liệu chính thức trước khi dùng cho nghiệm thu vận hành.
