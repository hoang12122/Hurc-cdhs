# HURC1 CRM (Metro Inspect Pro)

> **Hệ thống Quản trị, Giám sát và Bảo trì Đường sắt Đô thị Thông minh**
> **Dự án áp dụng:** Tuyến Cát Linh - Hà Đông (Line No.1)
> **Phiên bản:** 2.2.0-IRONCLAD
> **Trạng thái:** Production Ready (Hỗ trợ môi trường Air-Gapped)

---

## 🌟 TỔNG QUAN HỆ THỐNG (SYSTEM OVERVIEW)

**HURC1 CRM** là phần mềm quản trị tập trung (Centralized Management System) thế hệ mới, được thiết kế chuyên biệt để phục vụ công tác duy tu, bảo trì và điều hành tuyến đường sắt đô thị (Metro). 

Thay vì quản lý bằng giấy tờ truyền thống hay các file Excel phân mảnh, phần mềm số hóa toàn bộ vòng đời của một thiết bị từ lúc phát sinh sự cố, khắc phục, cho đến lúc được AI đánh giá độ tin cậy. Hệ thống hoạt động trong môi trường cô lập mạng hoàn toàn (Air-Gapped) của công ty HURC, đảm bảo an ninh mạng và an toàn dữ liệu công nghiệp.

### Chuỗi Giá trị Cốt lõi
- 🔍 **Số hóa không điểm mù:** Loại bỏ quy trình giấy tờ. Mọi báo cáo lỗi (DNF), mối nguy (Hazards) từ hiện trường đều được upload tức thì kèm hình ảnh, định vị tới chính xác linh kiện bị hỏng.
- 🤖 **Trợ lý AI Tích hợp (Ensemble RAG):** Đóng vai trò là "Kỹ sư trưởng số". AI có khả năng đọc hiểu hàng ngàn trang tài liệu kỹ thuật, phân tích hình ảnh hiện trường để phát hiện sai sót, và dự báo hỏng hóc trước khi chúng thực sự xảy ra.
- 🛡️ **Độ Sẵn sàng Kháng lỗi (Graceful Degradation):** Nếu mạng nội bộ gặp sự cố đứt cáp (mất kết nối SQL), hệ thống tự động fallback sang lưu trữ JSON cục bộ. Người dùng hoàn toàn không cảm nhận được độ trễ hay lỗi gián đoạn.
- 📊 **Quyết định dựa trên Dữ liệu (Data-Driven):** Cung cấp cho Ban lãnh đạo/CEO một Dashboard toàn cảnh (Scorecard) theo dõi thời gian thực các chỉ số KPI, độ tin cậy của đoàn tàu, và biểu đồ Radar đánh giá hiệu suất của các phân xưởng.

---

## 🧩 KIẾN TRÚC TÍNH NĂNG TOÀN DIỆN (COMPREHENSIVE FEATURES)

Hệ thống được thiết kế theo cấu trúc Micro-Frontend (MFE) với 12+ module độc lập bao phủ toàn bộ nhu cầu vận hành Metro:

| Phân hệ (Module) | Chức năng cốt lõi (Features) |
|---|---|
| **`ceo` (Dashboard)** | 📈 Cung cấp biểu đồ độ tin cậy tài sản, thẻ điểm cân bằng (Balanced Scorecard), KPIs an toàn chạy tàu. |
| **`dnf` (Sự cố & Khắc phục)** | 🛠️ Báo cáo sự cố (Defect and Non-Conformity), tạo Work Orders khắc phục, luồng phê duyệt nhiều cấp (L1 -> L2 -> L3). |
| **`hazards` (Mối nguy)** | ⚠️ Ghi nhận các rủi ro tiềm ẩn (ví dụ: cáp điện rò rỉ, đọng nước). Đánh giá ma trận rủi ro (Risk Matrix: Xác suất x Hậu quả). |
| **`inspections` (Kiểm tra định kỳ)** | 📋 Số hóa các đợt kiểm tra ngày/tuần/tháng/năm. Tự động sinh Checklist thông minh dựa trên định mức chuẩn. |
| **`maintenance-standards`** | 📐 Từ điển định mức bảo trì: Quy định thiết bị nào, ở nhà ga nào, bao lâu phải kiểm tra một lần. |
| **`ai-vision-audit`** | 👁️ AI Computer Vision (YOLOv8) quét hình ảnh chụp hiện trường để tự động phát hiện gian lận kiểm tra hoặc lỗi vật lý bị con người bỏ sót. |
| **`ai-lab` (Trợ lý RAG)** | 🧠 Giao diện chat với AI, cho phép kỹ sư hỏi đáp về quy trình bảo dưỡng chuẩn dựa trên kho tài liệu PDF/DOCX nội bộ. |
| **`metro` (Quản lý Tài sản)** | 🚇 Sổ hộ khẩu của mọi thiết bị, hệ thống điện, đoàn tàu, trạm ga. Lưu trữ thông số kỹ thuật và lịch sử vòng đời. |
| **`tasks` (Giao việc)** | 📅 Lịch trình bảo trì, theo dõi tiến độ công việc của từng kỹ thuật viên L2 tại hiện trường. |
| **`admin` (Quản trị Hệ thống)** | ⚙️ Cấu hình cây tổ chức AD đệ quy, quản lý ma trận phân quyền (RBAC), tài khoản người dùng, và bảo mật 2FA. |

---

## 📚 HỆ THỐNG TÀI LIỆU KỸ THUẬT SIÊU CHI TIẾT

Toàn bộ tài liệu quy chuẩn, hướng dẫn kiến trúc và vận hành đã được biên soạn lại cực kỳ chi tiết, kèm theo kịch bản sử dụng và Code Snippet thực tế. Vui lòng tham khảo các tài liệu (đặt trong thư mục `docs/`) tùy theo vai trò của bạn:

| Tài Liệu | Mô Tả | Đối Tượng |
|---|---|---|
| **[1. SYSTEM ARCHITECTURE](docs/1_SYSTEM_ARCHITECTURE.md)** | Phân tích sâu luồng dữ liệu MFE, Tầng Trí tuệ Nhân tạo (TrustGraph, RAG), và cơ chế đồng bộ CSDL Lai (Hybrid DB). | Tech Lead / System Architect |
| **[2. DESIGN & CODING RULES](docs/2_DESIGN_AND_CODING_RULES.md)** | Quy tắc code cho AI (Vibe Code), giới hạn độ dài Component, Custom Hooks, và Hệ màu UI/UX chuẩn mực. | Developers / AI Agents |
| **[3. DEVELOPER GUIDE](docs/3_DEVELOPER_GUIDE.md)** | Cẩm nang thiết lập Dev, xử lý JSON Offline, nguyên tắc TypeScript, Testing (Jest), và hướng dẫn tạo Module MFE mới. | Backend & Frontend Developers |
| **[4. DEPLOYMENT & OPS](docs/4_DEPLOYMENT_AND_OPS.md)** | Hướng dẫn Deploy lên Ubuntu, cấu hình Docker Compose (Snippet), Layered Deployment, Load Balancing, Backup/Restore. | DevOps / SysAdmin |
| **[5. ADMIN USER GUIDE](docs/5_ADMIN_USER_GUIDE.md)** | Kịch bản sử dụng (Scenarios) chi tiết cho Quản trị viên: Gán quyền theo phân hệ, tổ chức AD đệ quy, quản lý danh mục ảo. | Super Admin / Quản trị viên |
| **[6. MODULES & FEATURES](docs/6_MODULES_AND_FEATURES.md)** | **[QUAN TRỌNG]** Giải phẫu chi tiết 100% tính năng, quy trình luân chuyển dữ liệu của từng phân hệ nghiệp vụ. | Business Analyst / All Users |

---

## 🛠️ CÔNG NGHỆ (TECH STACK)
Phần mềm sử dụng công nghệ tiên tiến nhất để đảm bảo hiệu năng và độ ổn định lâu dài:
- **Frontend Core:** Next.js 14 (App Router), React 18, Server Components.
- **Thẩm mỹ (UI/UX):** TailwindCSS, Radix UI (Headless components), Framer Motion (Animations), Lucide Icons.
- **Backend Core:** Next.js Server Actions, Node.js v20.12.2.
- **Tầng Database:** PostgreSQL (Primary), JSON File-system (Offline Fallback), Prisma ORM.
- **Tầng Trí tuệ Nhân tạo (AI):** YOLOv8 (Computer Vision), Ollama (Local LLM - Llama3/Mistral), LangChain, ChromaDB (Vector Store).
- **Hạ tầng (DevOps):** Docker Compose (Strict Layered), Nginx Reverse Proxy, PM2 (Development).

---

*Hệ thống được kiến trúc và tối ưu ở cấp độ cao nhất bởi Đội ngũ Antigravity (Senior Security Architect & Lead Engineer).*
