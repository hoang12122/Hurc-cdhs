# HURC1 CRM (Metro Inspect Pro)

> **Hệ thống Quản trị & Bảo trì Đường sắt Đô thị Thông minh**
> **Version:** 2.2.0-IRONCLAD
> **Status:** Production Ready (Khả năng vận hành Air-Gapped)

---

## 🌟 Tổng Quan Hệ Thống (System Overview)

**HURC1 CRM** là phần mềm quản trị thông minh dành riêng cho Ban lãnh đạo, CEO, và Đội ngũ Kỹ thuật của hệ thống Metro. Phần mềm được thiết kế với chuẩn mực bảo mật cao nhất, hỗ trợ hoạt động trong môi trường cô lập mạng hoàn toàn (Air-Gapped) nhằm đảm bảo an ninh hệ thống và an toàn dữ liệu tuyệt đối.

### Mục tiêu Cốt lõi
- **Dashboard Chiến lược:** Cung cấp chỉ số KPI thời gian thực, bản đồ rủi ro (Hazard Map) và hệ thống báo cáo (Scorecard).
- **Trợ lý AI Tích hợp:** Sử dụng AI (Ensemble RAG) để phân tích báo cáo sự cố (DNF) và đưa ra gợi ý, chuẩn hóa quy trình.
- **Tính Sẵn sàng Cao (99.9%):** Hoạt động mượt mà nhờ kiến trúc Database lai (Hybrid), tự động chuyển đổi sang Offline JSON khi mất kết nối mạng.
- **Kiến trúc Hiện đại:** Phân mảnh giao diện với Micro-Frontend (MFE) giúp tránh nghẽn cổ chai (Bottleneck) khi nhiều Module mở rộng.

---

## 📚 Hệ Thống Tài Liệu Kỹ Thuật

Toàn bộ tài liệu quy chuẩn và hướng dẫn hệ thống đã được quy hoạch lại. Vui lòng tham khảo các tài liệu dưới đây (đặt trong thư mục `docs/`) tùy theo vai trò của bạn:

| Tài Liệu | Mô Tả | Đối Tượng |
|---|---|---|
| [1. SYSTEM ARCHITECTURE](docs/1_SYSTEM_ARCHITECTURE.md) | Kiến trúc tổng thể: MFE, Tầng Trí tuệ Nhân tạo (AI), và Cấu trúc Cơ sở dữ liệu Lai (Hybrid DB). | Tech Lead / System Architect |
| [2. DESIGN & CODING RULES](docs/2_DESIGN_AND_CODING_RULES.md) | Quy tắc Vàng thiết kế MFE, viết mã cho AI (Vibe Code) và UI/UX Tokens bắt buộc. | Developers / UI Designers / AI Agents |
| [3. DEVELOPER GUIDE](docs/3_DEVELOPER_GUIDE.md) | Cẩm nang thiết lập Dev, xử lý JSON Offline, nguyên tắc TypeScript và Testing. | Backend & Frontend Developers |
| [4. DEPLOYMENT & OPS](docs/4_DEPLOYMENT_AND_OPS.md) | Hướng dẫn Deploy lên Ubuntu, cấu hình Docker, Layered Deployment, và Backup/Restore. | DevOps / SysAdmin |
| [5. ADMIN USER GUIDE](docs/5_ADMIN_USER_GUIDE.md) | Hướng dẫn sử dụng hệ thống AD đệ quy, quản lý Danh mục ảo, Ma trận Phân quyền. | Super Admin / Quản trị viên |

---

## 🛠️ Công Nghệ (Tech Stack)

- **Frontend:** Next.js (App Router), React, TailwindCSS, Radix UI.
- **Backend:** Next.js Server Actions, Node.js v20.12.2.
- **Database:** PostgreSQL (Online), MongoDB (AI/Logs), JSON (Offline Fallback), Prisma ORM.
- **AI Core:** YOLOv8 (Vision), Ollama (Local LLM), LangChain.
- **Infra:** Docker Compose (Strict Layered), Nginx.

---

*Hệ thống được phát triển và tối ưu bởi Đội ngũ Kiến trúc sư Kỹ thuật (Antigravity).*
