# Technical Documentation Index

Thư mục này chứa tài liệu kỹ thuật phục vụ lập trình viên, kỹ sư hệ thống, DevOps và người rà soát kiến trúc.

| Tài liệu | Mục đích |
|---|---|
| `BUILD_WINDOWS_LINUX_GUIDE.md` | Hướng dẫn build source, development, Docker, Prisma, biến môi trường, smoke test và debug trên Linux/Windows. |
| `AI_ARCHITECTURE_CONFIGURATION_REFERENCE.md` | Tham chiếu kiến trúc AI, công thức risk/confidence, limit, profile và hard limit. |
| `AI_RUNTIME_PROFILE_OPERATIONS.md` | Trạng thái runtime, environment switch, bảng profile thực thi, rollout, rollback và giới hạn tương thích. |
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

Không đánh dấu CI/CD `PASS` nếu chưa có kết quả pipeline thực tế.

## Nguyên tắc cập nhật

1. Tài liệu kỹ thuật phải nêu rõ phạm vi áp dụng.
2. Khi thay đổi cấu trúc mã nguồn, phải cập nhật tài liệu liên quan.
3. Không ghi secret, token, mật khẩu hoặc connection string thật vào tài liệu.
4. Không kết luận production-ready nếu chưa có CI/CD xanh và bằng chứng kiểm thử.
5. Khi thay đổi package, environment, Docker, Compose, Prisma hoặc workflow, phải rà soát tài liệu build đa nền tảng.
6. Khi thay đổi limit AI, risk threshold, confidence, concurrency, timeout, Memory/Data Governance hoặc Tool Firewall, phải cập nhật tài liệu profile và bổ sung bằng chứng kiểm thử.
