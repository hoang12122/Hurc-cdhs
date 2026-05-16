# Hurc1CRM Engineering & Security Handbook

Tài liệu này tổng hợp các bài học kinh nghiệm và các Pattern thiết kế bắt buộc để tránh các sai sót trong tương lai. Mọi kỹ sư và AI trợ lý phải tuân thủ nghiêm ngặt các quy tắc này.

## 1. Nguyên tắc Bảo mật (Security Core)

### 🛡️ Chống BOLA (Broken Object Level Authorization)

- **Quy tắc:** Không bao giờ tin tưởng ID từ client. Luôn kiểm tra quyền sở hữu (`createdById`) trước khi thực hiện `Update` hoặc `Delete`.
- **Mẫu chuẩn:**

```typescript
const record = await db.findUnique(id);
const isOwner = record.createdById === user.id;
const isAdmin = user.role === 'SUPER_ADMIN';
if (!isOwner && !isAdmin) throw new Error("Unauthorized");
```

### 🛡️ CSPRNG (Cryptographically Secure Randomness)

- **Quy tắc:** Tuyệt đối không dùng `Math.random()` cho các định danh (ID), mật khẩu hoặc token.
- **Mẫu chuẩn:**

```typescript
import crypto from 'crypto';
const id = `act-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
```

### 🛡️ Rate Limiting & OOM Protection

- **Quy tắc:** Mọi cấu trúc dữ liệu lưu trữ trong RAM (như Map, Set) dùng cho cache hoặc rate limit phải có giới hạn kích thước (`MAX_SIZE`).
- **Mẫu chuẩn:** Xem tệp `src/lib/rate-limit.ts`.

## 2. Nguyên tắc Hạ tầng (Infrastructure)

### ⚙️ Atomic File Writing (Mutex Queue)

- **Quy tắc:** Khi ghi dữ liệu vào file (như JSON-DB hoặc Log), phải sử dụng cơ chế hàng đợi (`Mutex Queue`) để tránh lỗi tranh chấp tài nguyên (Race Condition) làm hỏng file.
- **Mẫu chuẩn:** Xem tệp `src/lib/services/log-writer.ts`.

### ⚙️ Fail-Safe Environment

- **Quy tắc:** Các biến nhạy cảm như `SESSION_SECRET` hoặc `DATABASE_URL` không được có giá trị mặc định (fallback) trong môi trường Production. Hệ thống phải crash sớm nếu thiếu cấu hình.

## 3. Quản lý Mã nguồn (Clean Architecture)

### 🧹 Xóa bỏ "Mocking" trong Production

- **Quy tắc:** Tuyệt đối không để lại các hàm `time.sleep` hoặc dữ liệu giả (Hardcoded JSON) trong các Service chính. Nếu tính năng chưa sẵn sàng, hãy dùng cơ chế Feature Flag.

### 🧹 Naming Convention

- **Database:** Sử dụng `snake_case` cho các key trong JSON-DB/Postgres.
- **Code:** Sử dụng `camelCase` cho biến và hàm, `PascalCase` cho Component.

## 4. Quy trình Kiểm tra (Audit Workflow)

Mỗi khi thay đổi Logic quan trọng, phải chạy bộ công cụ nghiệm thu:

1. `npm run typecheck`: Kiểm tra lỗi kiểu dữ liệu.
2. `npx tsx src/scripts/hardened-proof.ts`: Kiểm tra các lớp bảo mật vật lý.
3. `npm run build`: Kiểm tra khả năng đóng gói.

---
*Tài liệu này được cập nhật tự động sau mỗi phiên Red Teaming thành công.*
