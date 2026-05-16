# HURC1 CRM - FULL SYSTEM DOCUMENTATION

**Version:** 2.1.0-IRONCLAD
**Status:** Production Ready (Air-Gapped)

---

## 1. TỔNG QUAN HỆ THỐNG (SYSTEM OVERVIEW)

HURC1 CRM là hệ thống quản trị thông minh dành cho Ban lãnh đạo và CEO của hệ thống Metro HURC1. Phần mềm được thiết kế để hoạt động trong môi trường cô lập hoàn toàn (Air-Gapped), đảm bảo an ninh quốc gia và bảo mật dữ liệu tuyệt đối.

### Mục tiêu cốt lõi

- Cung cấp Dashboard chỉ số chiến lược thời gian thực.
- Trợ lý AI phân tích sự cố (DNF) và rủi ro (Hazard) chuyên sâu.
- Duy trì tính ổn định 99.9% ngay cả khi không có kết nối Internet hoặc Database trung tâm.

---

## 2. KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

### 2.1. Tầng Trí tuệ nhân tạo (AI Core Layer)

Hệ thống sử dụng mô hình **Ensemble RAG** (Retrieval-Augmented Generation) kết hợp:

- **TrustGraph (Knowledge Graph):** Lưu trữ các mối quan hệ thực thể (Thiết bị -> Sự cố -> Trạm).
- **DocumentRAG (Vector Search):** Truy xuất thông tin từ các văn bản quy trình, hướng dẫn bảo trì.
- **Smart Router:** Bộ định tuyến ý định sử dụng AI để phân loại yêu cầu của người dùng thành: *Truy vấn dữ liệu, Phân tích chiến lược, hoặc Trò chuyện thông thường*.
- **Agent Memory:** Hệ thống ghi nhớ tương tác dài hạn để cá nhân hóa câu trả lời cho CEO.

### 2.2. Tầng Dữ liệu (Data Persistence Layer)

Hỗ trợ cơ chế **Hybrid Database**:

- **Offline Mode (JSON-DB):** Sử dụng tệp `db.json` làm cơ sở dữ liệu chính. Tích hợp **In-memory Snapshot** giúp tốc độ đọc đạt mức sub-millisecond.
- **Online Mode (PostgreSQL):** Sẵn sàng chuyển đổi khi có kết nối mạng để đồng bộ dữ liệu quy mô lớn.
- **Hardening:** Cơ chế **Rotating Backups** tự động lưu 5 phiên bản gần nhất để chống mất mát dữ liệu.

### 2.3. Tầng Hạ tầng (Infrastructure Layer)

- **Containerization:** Triển khai qua Docker Compose với các hình ảnh Zero-CVE (Chainguard/Distroless).
- **Security:** Chế độ Local-Only chặn toàn bộ các cuộc gọi API ra bên ngoài.
- **DevOps:** Tích hợp Terraform để quản lý hạ tầng và GitHub Actions cho luồng CI/CD.

---

## 3. CÁC TÍNH NĂNG CHÍNH (CORE FEATURES)

### 3.1. CEO Executive Dashboard

Hiển thị các chỉ số KPI chiến lược:

- **Health Score:** Điểm sức khỏe hệ thống Metro dựa trên tần suất DNF.
- **Hazard Map:** Bản đồ rủi ro theo trạm và mức độ ưu tiên.
- **Strategic Scorecard:** Bảng điểm cân bằng cho công tác bảo trì.

### 3.2. AI Smart Assistant

- Hỗ trợ trả lời bằng tiếng Việt chuyên ngành Metro.
- Có khả năng tự kiểm chứng (Self-Reflection) để đảm bảo không trả lời sai.
- Hỗ trợ đa phương thức (Văn bản & Hình ảnh local).

---

## 4. QUY TRÌNH VẬN HÀNH & BẢO TRÌ

### 4.1. Kiểm nghiệm hệ thống (Audit)

Trước khi cập nhật, luôn chạy lệnh sau để kiểm tra 8 ngách an toàn:

```powershell
node --import tsx src/scripts/pre-deploy-audit.ts
```

### 4.2. Sao lưu và Phục hồi (Backup & Restore)

- **Sao lưu:** Tự động thực hiện mỗi khi có thao tác ghi dữ liệu. Bản sao nằm tại `./backups`.
- **Phục hồi:** Đổi tên bản sao `.bak` thành `db.json` và khởi động lại container.

### 4.3. Đồng bộ hóa (Reverse Sync)

Để đẩy dữ liệu từ Offline lên Postgres Online:

```powershell
npx tsx src/scripts/db-sync-export.ts
```

---

## 5. DANH MỤC TỆP TIN QUAN TRỌNG

- `src/lib/services/ai.ts`: Trung tâm điều khiển AI.
- `src/lib/db/json-db.ts`: Lớp quản lý dữ liệu Offline.
- `src/scripts/pre-deploy-audit.ts`: Công cụ nghiệm thu.
- `audit_reports/`: Nơi lưu trữ các chứng chỉ nghiệm thu.

---

## 6. LIÊN HỆ HỖ TRỢ KỸ THUẬT

Hệ thống được phát triển và bảo mật bởi đội ngũ AI Engineering. Mọi sự cố nghiêm trọng cần được đối soát qua **Incident Playbook** trước khi can thiệp vào mã nguồn.

**HURC1 CRM - KIẾN TẠO TƯƠNG LAI METRO BẰNG TRÍ TUỆ NHÂN TẠO.**
