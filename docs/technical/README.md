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

## Trạng thái tài liệu cấu hình AI

Bản cập nhật kiến trúc và cấu hình AI hiện tại chỉ bổ sung tài liệu tham chiếu, chưa làm thay đổi runtime.

- Các giá trị đánh dấu `CURRENT` phản ánh cấu hình đang tồn tại trong mã nguồn.
- Các profile `LOW_RESOURCE`, `STANDARD`, `HIGH_CAPACITY`, `LOW_ASSURANCE`, `STANDARD_ASSURANCE` và `HIGH_ASSURANCE` là khuyến nghị, chưa phải environment switch có hiệu lực tự động.
- Chưa thay đổi timeout, concurrency, risk threshold, confidence, Memory/Data Governance, MCP, Vision, rate-limit, session hoặc 2FA bằng lần cập nhật tài liệu này.
- Muốn áp dụng profile phải có thay đổi mã nguồn riêng, kiểm thử, review, bằng chứng load-test hoặc security validation và phương án rollback.
- Không đánh dấu CI/CD `PASS` nếu chưa có kết quả pipeline thực tế.

Nguyên tắc cập nhật:

1. Tài liệu kỹ thuật phải nêu rõ phạm vi áp dụng.
2. Khi thay đổi cấu trúc mã nguồn, phải cập nhật tài liệu liên quan.
3. Không ghi secret, token, mật khẩu hoặc connection string thật vào tài liệu.
4. Không kết luận production-ready nếu chưa có CI/CD xanh và bằng chứng kiểm thử.
5. Khi thay đổi `package.json`, `.env.example`, Dockerfile, Compose, Prisma hoặc workflow, phải rà soát lại tài liệu build đa nền tảng.
6. Khi thay đổi limit AI, risk threshold, confidence, concurrency, timeout, Memory/Data Governance hoặc Tool Firewall, phải cập nhật `AI_ARCHITECTURE_CONFIGURATION_REFERENCE.md` và bổ sung bằng chứng kiểm thử.
