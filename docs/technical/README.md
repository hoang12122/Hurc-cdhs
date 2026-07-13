# Technical Documentation Index

Thư mục này chứa tài liệu kỹ thuật phục vụ lập trình viên, kỹ sư hệ thống, DevOps và người rà soát kiến trúc.

| Tài liệu | Mục đích |
|---|---|
| `BUILD_WINDOWS_LINUX_GUIDE.md` | Hướng dẫn build source, development, Docker, Prisma, biến môi trường, smoke test và debug trên Linux/Windows. |
| `AI_ARCHITECTURE_CONFIGURATION_REFERENCE.md` | Mô tả chi tiết kiến trúc AI, risk/confidence engine, toàn bộ limit CURRENT, profile LOW/STANDARD/HIGH, hard limit, Memory/Data/MCP/Vision/rate-limit và checklist nghiệm thu. |
| `PROJECT_STRUCTURE_GUIDE.md` | Quy chuẩn cấu trúc Frontend React/Next.js và Backend Golang. |
| `STRUCTURE_MIGRATION_PLAN.md` | Kế hoạch sắp xếp lại thư mục phần mềm theo từng đợt. |
| `API_INTEGRATION_GUIDE.md` | Hướng dẫn tích hợp API nếu được bổ sung. |
| `DATABASE_GUIDE.md` | Hướng dẫn database/schema nếu được bổ sung. |
| `MODULE_BOUNDARY_GUIDE.md` | Hướng dẫn ranh giới module nếu được bổ sung. |
| `SECURITY_GUIDE.md` | Hướng dẫn bảo mật nếu được bổ sung. |

Nguyên tắc cập nhật:

1. Tài liệu kỹ thuật phải nêu rõ phạm vi áp dụng.
2. Khi thay đổi cấu trúc mã nguồn, phải cập nhật tài liệu liên quan.
3. Không ghi secret, token, mật khẩu hoặc connection string thật vào tài liệu.
4. Không kết luận production-ready nếu chưa có CI/CD xanh và bằng chứng kiểm thử.
5. Khi thay đổi `package.json`, `.env.example`, Dockerfile, Compose, Prisma hoặc workflow, phải rà soát lại tài liệu build đa nền tảng.
6. Khi thay đổi limit AI, risk threshold, confidence, concurrency, timeout, Memory/Data Governance hoặc Tool Firewall, phải cập nhật `AI_ARCHITECTURE_CONFIGURATION_REFERENCE.md` và bổ sung bằng chứng kiểm thử.
