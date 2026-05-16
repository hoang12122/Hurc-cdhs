# Hurc1CRM - Hệ thống Quản lý & Bảo trì Đường sắt Tích hợp AI (Hardened Production Edition)

Hurc1CRM là một nền tảng quản trị bảo trì đường sắt thế hệ mới, kết hợp sức mạnh của **Computer Vision (YOLOv8)** và **Generative AI (Gemini/Gemma)**. Hệ thống được thiết kế với triết lý **"Hardened by Default"**, đảm bảo tính an toàn tuyệt đối và khả năng vận hành bền bỉ ngay cả trong điều kiện hạ tầng bị giới hạn.

---

## Mục lục

1. [Kien truc He thong (System Architecture)](#architecture)
2. [Lop Bao mat Boc thep (Security Hardening)](#security)
3. [Ha tang AI & Phan tich (AI Infrastructure)](#ai)
4. [Quan tri Du lieu Hybrid (Hybrid Data Management)](#data)
5. [Huong dan Cai dat & Trien khai (Deployment)](#deployment)
6. [Bao tri & Giam sat (Maintenance & Monitoring)](#maintenance)
7. [Tieu chuan Ky thuat (Engineering Standards)](#standards)

---

## Architecture

Hệ thống được xây dựng trên nền tảng **Next.js 14 (App Router)**, tối ưu hóa cho Rendering phía Server (SSR) và bảo mật Server Actions.

### Stack Cong nghe (Technology Stack)

| Thành phần | Công nghệ sử dụng | Mục đích |
| :--- | :--- | :--- |
| **Core Framework** | Next.js 14, TypeScript 5 | Xử lý Logic & UI |
| **Styling** | Vanilla CSS, Radix UI, Lucide Icons | Giao diện hiện đại, tối ưu hiệu suất |
| **ORM / DB** | Prisma, PostgreSQL, JSON-DB | Quản lý dữ liệu đa tầng |
| **Security** | BcryptJS, Jose, Node-Crypto | Mã hóa và xác thực |
| **AI (Vision)** | FastAPI, YOLOv8, OpenCV | Nhận diện mối nguy qua hình ảnh |
| **AI (LLM)** | Google Generative AI, HF Inference | Phân tích rủi ro & Trợ lý thông minh |

---

## Security

Dự án đã trải qua chiến dịch **Red Teaming** nội bộ và được bọc thép qua 5 lớp phòng thủ vật lý:

### 1. Kiem soat Truy cap Doi tuong (BOLA/IDOR Protection)

Mọi hàm `Server Action` đều được bao bọc bởi logic kiểm tra sở hữu.

- **Logic:** `if (record.createdById !== currentUser.id && currentUser.role !== 'ADMIN') throw UnauthorizedError`.
- **Phạm vi:** Áp dụng cho Improvements, Hazards, Comments, và Attachments.

### 2. Thuat toan Chong Brute-Force (Rate Limiting)

Hệ thống sử dụng bộ nhớ đệm có giới hạn kích thước (**Bounded Memory Map**) để theo dõi IP.

- **Cơ chế:** Tự động chặn IP sau 5 lần thử sai trong 15 phút.
- **Bảo vệ RAM:** Thuật toán tự động giải phóng bộ nhớ (Garbage Collection) khi bộ đệm đạt ngưỡng 10,000 thực thể để chống tấn công làm tràn RAM (OOM Attack).

### 3. Ma hoa & Random mat ma (CSPRNG)

Tuyệt đối không sử dụng `Math.random()`. Mọi mật khẩu và ID hoạt động đều được sinh ra bởi **`crypto.randomBytes`** và **`crypto.randomInt`**, đảm bảo tính ngẫu nhiên không thể dự đoán được ở mức độ mật mã học.

### 4. Phong chong Injection Da lop

- **Data Sanitization:** Mọi payload đầu vào được ép kiểu (Strict Type Casting).
- **XSS Protection:** Tự động lọc các ký tự nguy hiểm trong comments và nội dung báo cáo.
- **Safe JSON Storage:** Sử dụng cơ chế hàng đợi ghi (**Write Mutex Queue**) để đảm bảo dữ liệu không bị hỏng rách (corruption) khi có hàng nghìn yêu cầu ghi cùng lúc.

### 5. Bao mat Container (Container Hardening)

- **Zero-Root Execution:** Container ứng dụng chạy dưới quyền user `65532 (nonroot)`, không thể can thiệp sâu vào hệ thống host.
- **Distroless Runner:** Sử dụng image tối giản (không shell, không package manager) để loại bỏ hoàn toàn các bề mặt tấn công.
- **Strict DNS:** Các dịch vụ AI (YOLO, LLM) được cấu hình kết nối qua mạng nội bộ Docker với Endpoint định danh, chống giả mạo DNS (DNS Spoofing).
- **Health Monitoring:** Tự động giám sát trạng thái an toàn qua Docker Healthcheck.

---

## AI

### Chuoi Phan tich Resilience (AI Chain)

Hệ thống AI được thiết kế với khả năng tự phục hồi (Self-healing):

1. **Primary:** Google Gemini (Dành cho phân tích phức tạp nhất).
2. **Secondary:** HuggingFace Inference (Dự phòng khi Gemini hết quota).
3. **Tertiary:** Local Gemma/Llama (Hoạt động hoàn toàn Offline khi mất mạng).

### YOLO Service (Computer Vision)

Dịch vụ nhận diện vật thể được đóng gói trong Container riêng, giao tiếp qua REST API tại cổng `5005`.

- **Đầu vào:** Luồng video RTSP hoặc hình ảnh tĩnh từ hiện trường.
- **Đầu ra:** Tọa độ bounding box và mức độ tin cậy (Confidence score).

---

## Data

### Database Routing Logic

Hệ thống sử dụng tệp `src/lib/services/db-wrapper.ts` để điều phối truy vấn:

- **`IS_DATABASE_OFFLINE=true`:** Sử dụng `JsonProvider`. Dữ liệu ghi vào `data/offline/db.json` (Mount bền vững trong Docker). Thích hợp cho hiện trường không có sóng 4G.
- **`IS_DATABASE_OFFLINE=false`:** Sử dụng `PrismaProvider`. Dữ liệu đồng bộ vào PostgreSQL.

---

## Deployment

### 1. Yeu cau He thong

- Docker & Docker Compose.
- Node.js 18+ (nếu chạy local).

### 2. Trien khai bang Docker (Khuyen dung)

```bash
# Khởi chạy toàn bộ hạ tầng (Postgres, YOLO, Web App)
docker compose up -d --build
```

### 3. Cau hinh Bien moi truong (.env)

```env
# SECURITY
SESSION_SECRET=phải_là_chuỗi_dài_hơn_32_ký_tự
ALLOW_OFFLINE_PRODUCTION=true

# DATABASE
DATABASE_URL="postgresql://user:pass@localhost:5432/hurc"

# AI KEYS
GEMINI_API_KEY=AIza...
HUGGING_FACE_API_KEY=hf_...
```

---

## Maintenance

### He thong Logs Tap trung

Logs được phân loại và lưu trữ tại thư mục `/logs`:

- `logs/security`: Ghi lại các nỗ lực xâm nhập bị chặn (BOLA, Rate Limit hits).
- `logs/ai`: Nhật ký các quyết định của mô hình AI.
- `logs/data`: Nhật ký thay đổi cơ sở dữ liệu.

### Cong cu Nghiem thu (Validation Tools)

Trước khi bàn giao, hãy chạy các lệnh sau để đảm bảo 100% tính toàn vẹn:

```bash
# Nghiệm thu các lớp bảo mật vật lý
npx tsx src/scripts/hardened-proof.ts

# Kiểm tra tính nhất quán của dữ liệu Hybrid
npx tsx src/scripts/comprehensive-audit.ts
```

---

## Standards

Mọi thay đổi mã nguồn phải tuân thủ nghiêm ngặt **[ENGINEERING_HANDBOOK.md](./src/ENGINEERING_HANDBOOK.md)**:

- Luôn sử dụng **Zod** để validate schema.
- Luôn kiểm tra **Ownership** cho mọi mutation server actions.
- Luôn sử dụng **Atomic Writes** khi thao tác với file hệ thống.

---

> [!NOTE]
> **Đảm bảo Dữ liệu:** Hệ thống đã được cấu hình tự động mount Volume bền vững (`data/offline`) trong `docker-compose.yml`. Dữ liệu Offline của bạn sẽ luôn được an toàn kể cả khi container bị restart hoặc update.

---
*Tài liệu được cập nhật tự động bởi hệ thống Audit Hurc1CRM - 2026.*
