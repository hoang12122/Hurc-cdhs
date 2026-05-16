# HURC1 CRM - Executive Dashboard & AI Core

Hệ thống quản trị và phân tích dữ liệu bảo trì Metro HURC1, được thiết kế chuyên biệt cho môi trường **Air-Gapped** với kiến trúc **Bọc thép (Ironclad Stability)** và Trí tuệ nhân tạo nội bộ.

---

## 🎖️ Tóm tắt Dự án (Executive Summary)

Dự án này đã chuyển đổi hệ thống HURC1 CRM từ một ứng dụng quản lý dữ liệu thông thường thành một **Hệ sinh thái Trí tuệ nhân tạo Tự chủ**, tập trung vào 3 trụ cột chính:

1. **AI Precision (Độ chính xác cao):** Sử dụng kiến trúc Ensemble RAG (Graph + Vector) kết hợp Smart Routing để hỗ trợ CEO ra quyết định tức thì.
2. **Ironclad Security (Bảo mật bọc thép):** Chạy hoàn toàn Offline, Zero-CVE Docker images, và mã hóa dữ liệu đa tầng.
3. **Data Resilience (Sự bền bỉ dữ liệu):** Cơ chế Snapshot RAM tối ưu hiệu năng và hệ thống sao lưu luân phiên tự động.

---

## 🏗️ Kiến trúc Kỹ thuật (Technical Architecture)

### 1. AI Core (Trí tuệ nhân tạo)

- **Ensemble RAG:** Hợp nhất tri thức từ Đồ thị (TrustGraph) và Tài liệu (DocumentRAG).
- **Smart Intent Routing:** Phân loại câu hỏi thông minh bằng AI, tự động chuyển luồng xử lý.
- **Agent Memory:** Bộ nhớ dài hạn (TencentDB Agent Memory) ghi nhớ ngữ cảnh giao tiếp với CEO.
- **AI Hardening:** Tích hợp Semantic Chunking và Self-Reflection Loop để triệt tiêu ảo giác AI.

### 2. Data Strategy (Chiến lược dữ liệu)

- **Hybrid Storage:** Chuyển đổi linh hoạt giữa PostgreSQL (Online) và JSON-DB (Offline).
- **Hardening:** Snapshot caching (RAM) giúp phản hồi nhanh 0.01ms/op và hệ thống Backups 5 phiên bản.
- **Schema Guard:** Đối soát dữ liệu nghiêm ngặt bằng Zod trước khi xử lý.

### 3. Infrastructure (Hạ tầng)

- **Containerization:** Chainguard (Zero-CVE) & Distroless (Runner).
- **Observability:** Hệ thống Logging tập trung (Loki + Grafana) giám sát an toàn AI và vận hành.
- **Audit Engine:** Công cụ Deep Audit v2.1 tự động xuất chứng chỉ nghiệm thu trước khi triển khai.

---

## 🚀 Hướng dẫn Triển khai (Deployment Guide)

### Bước 1: Chuẩn bị môi trường

Đảm bảo máy chủ đã cài đặt **Docker** và **Docker Compose**. Kiểm tra file `.env` để xác nhận `IS_DATABASE_OFFLINE=true`.

### Bước 2: Build và Khởi chạy

Chạy lệnh duy nhất để xây dựng và kích hoạt hệ thống:

```powershell
docker compose up -d --build
```

### Bước 3: Kiểm tra sức khỏe (Health Check)

1. **Giao diện:** `http://localhost` (Cổng 80).
2. **Logs:** `docker compose logs -f app` (Theo dõi thời gian thực).
3. **Monitoring:** `http://localhost:3001` (Grafana Dashboard).
4. **Audit Certificate:** Xem tại thư mục `./audit_reports`.

---

## 🔒 Cam kết Bảo mật & Ổn định

Hệ thống được thiết kế theo chuẩn **Zero Trust** cho môi trường nội bộ. Mọi luồng dữ liệu đều được kiểm soát bởi gateway nội bộ, không có bất kỳ kết nối nào ra Cloud/Internet bên ngoài.

## 📖 Tài liệu hướng dẫn đầy đủ (Full Documentation)

Bạn có thể xem chi tiết về kiến trúc, tính năng và quy trình bảo trì tại: [FULL_DOCUMENTATION.md](file:///d:/Hurc1CRM-main/Hurc-cdhs/docs/FULL_DOCUMENTATION.md)

**HURC1 AI Engineering Team**
*Version: 2.1.0-IRONCLAD*
