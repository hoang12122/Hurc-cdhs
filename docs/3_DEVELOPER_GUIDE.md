# TÀI LIỆU 3: CẨM NANG DÀNH CHO LẬP TRÌNH VIÊN (DEVELOPER GUIDE)

Tài liệu này cung cấp các kịch bản thực tế, mẹo khắc phục sự cố (Troubleshooting) và hướng dẫn từng bước để phát triển thêm tính năng cho **HURC1 CRM**.

---

## 1. HƯỚNG DẪN TẠO MỘT MODULE MFE MỚI

Nếu bạn được sếp giao nhiệm vụ: *"Hãy tạo một phân hệ mới có tên là `audit` (Đánh giá nội bộ)"*. Đây là kịch bản chuẩn bạn phải tuân theo:

**Bước 1: Khởi tạo thư mục**
Tạo thư mục mới tại `src/app/(app)/audit`. Không được tạo ngoài thư mục `(app)` vì sẽ mất layout sidebar.

**Bước 2: Cấu trúc bên trong Module**
Phân rã thành 3 tầng rõ rệt:
- `page.tsx`: Nơi chứa Layout và gọi Data (Server Component).
- `_components/`: Thư mục chứa các UI Components nội bộ của riêng `audit`.
- `_hooks/`: Thư mục chứa logic validate (Zod), xử lý form.

**Bước 3: Đăng ký Router**
Vào file `src/lib/navigation.ts`, thêm đường dẫn `/admin/audit` vào đúng mảng Menu để nó hiện ra ở thanh điều hướng bên trái.

**Bước 4: Thiết lập Server Action**
Tạo file `src/lib/actions/audit.actions.ts`. Đừng bao giờ viết SQL trực tiếp trong file Component (React).
```typescript
"use server";
export async function createAuditAction(data) {
    if (process.env.IS_DATABASE_OFFLINE === 'true') {
        return await jsonDb.createAudit(data);
    }
    return await prisma.audit.create({ data });
}
```

---

## 2. QUY TẮC LÀM VIỆC VỚI OFFLINE DB (`db.json`)

Do hệ thống phục vụ an ninh quốc gia, mạng có thể bị ngắt bất cứ lúc nào (chế độ Air-Gapped). Cơ sở dữ liệu JSON dự phòng là trái tim thứ 2 của hệ thống.

### 2.1 Cạm bẫy "Shallow Merge" (Cần cực kỳ lưu ý)
Hàm cập nhật mặc định của `json-db.ts` là **Shallow Merge (Hợp nhất nông)**. 
- *Nghĩa là:* Nếu bạn lưu một DNF có cấu trúc: `{ id: '1', attachments: ['a.png', 'b.png'] }`. Lần sau bạn update chỉ truyền `{ attachments: ['c.png'] }`, hệ thống JSON sẽ đè mất ảnh `a` và `b`.
- *Cách khắc phục:* Phải get bản ghi cũ ra, merge mảng (Array) bằng tay `[...old.attachments, newAttachment]`, sau đó mới ném vào hàm Update.

### 2.2 Quy tắc định danh (UUIDv4)
Tuyệt đối KHÔNG dùng mã tăng dần (Auto Increment kiểu `id: 1, 2, 3`) khi lưu vào JSON. Vì khi đồng bộ ngược lên Postgres, nó sẽ xung đột với ID cũ của DB. 
- Mọi ID trong hệ thống phải sinh bằng `crypto.randomUUID()`.

---

## 3. KHẮC PHỤC SỰ CỐ THƯỜNG GẶP (TROUBLESHOOTING)

### 3.1 Lỗi: `PrismaClientInitializationError`
- **Tình trạng:** App không chạy được lệnh `npm run build` hoặc Prisma ném lỗi không gọi được DB.
- **Nguyên nhân:** Prisma cố kết nối tới CSDL online lúc Build-time.
- **Cách sửa:** Bạn phải thêm cờ `IS_DATABASE_OFFLINE=true` vào trước lệnh build.
```bash
IS_DATABASE_OFFLINE=true npm run build
```

### 3.2 Lỗi: Dữ liệu Offline không đồng bộ lên Server
- **Tình trạng:** Khi cắm mạng lại, dữ liệu báo cáo sự cố (DNF) tạo trong lúc rớt mạng bị kẹt ở file `db.json`, không lên được Postgres.
- **Nguyên nhân:** Lập trình viên quên cấp phát quyền chạy lệnh Migration.
- **Cách sửa:** 
  1. Kiểm tra lại cờ `process.env.IS_DATABASE_OFFLINE` đã được tắt.
  2. Mở Terminal, chạy `npm run migrate`. Lệnh này sẽ dò qua `ops_dnfs` trong JSON và INSERT IGNORE vào Postgres.

### 3.3 Lỗi: Kiểm thử Jest Thất bại
- **Tình trạng:** Chạy `npm run test` báo lỗi ở file `ou-scope-service.test.ts`.
- **Nguyên nhân:** Hàm test giả lập (Mock) Tree AD đệ quy vô tình trỏ sai `parentId`. Cây đệ quy gây ra vòng lặp vô hạn (Infinite Loop).
- **Cách sửa:** Rà soát lại Mock Data. Đảm bảo Root OU luôn có `parentId: null`. Không bao giờ để OU A làm cha của OU B, rồi OU B lại làm cha của OU A.
