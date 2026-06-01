# TÀI LIỆU 3: HƯỚNG DẪN DÀNH CHO LẬP TRÌNH VIÊN (DEVELOPER GUIDE)

Tài liệu này bao gồm các quy tắc nghiêm ngặt và kinh nghiệm thực chiến khi làm việc với codebase của HURC1 CRM, đặc biệt là cách xử lý cơ sở dữ liệu Offline và hệ thống kiểm thử.

---

## 1. THIẾT LẬP MÔI TRƯỜNG CỤC BỘ (LOCAL SETUP)

### 1.1 Yêu cầu bắt buộc (Prerequisites)
- **Node.js**: Phiên bản bắt buộc là `v20.12.2`. Mọi lệnh `npm run dev` hoặc `npm run build` đều sẽ chạy qua chốt chặn preflight. Nếu sai phiên bản, tiến trình sẽ bị hủy ngay lập tức.
- Hãy sử dụng NVM: `nvm use 20.12.2`.

### 1.2 Môi trường `.env`
Môi trường local phải khai báo đầy đủ 6 biến trọng yếu:
```env
AUTH_DATABASE_URL="postgresql://..."
AI_DATABASE_URL="..."
METRO_DATABASE_URL="..."
OPS_DATABASE_URL="..."
SESSION_SECRET="your-secret-key"
NEXT_PUBLIC_SETUP_COMPLETE="true"
```

---

## 2. QUY TẮC LÀM VIỆC VỚI OFFLINE DB (`db.json`)

Module `json-db.ts` điều khiển cơ sở dữ liệu dự phòng. Để ngăn chặn lỗi thất thoát dữ liệu (Data Loss) hay hỏng cấu trúc file, mọi lập trình viên phải tuân thủ:

### 2.1 Ràng Buộc Kiểu & Dữ Liệu
- **TypeScript Constraints:** Khi viết generic function, luôn phải extends ID: `<T extends { id?: string }>`.
- **Định danh UUID:** Tuyệt đối không dùng `Date.now()` làm ID. Mọi bản ghi khởi tạo mới phải được gán ID qua `crypto.randomUUID()`.
- **Ngày tháng:** Dữ liệu Date phải được serialize bằng `.toISOString()` trước khi đưa vào JSON.
- **Giá trị mặc định (Sanitization):** Các trường như `status` hay `isArchived` phải được gán giá trị mặc định, tránh để `undefined` trôi nổi trong JSON.

### 2.2 Xử Lý Hợp Nhất & Giao Dịch
- **Hợp nhất nông (Shallow Merge):** Thuật toán update hiện tại của JSON DB chỉ gộp dữ liệu ở tầng đầu tiên. Đối với các mảng (Array) lồng nhau, bạn phải gộp thủ công trước khi gọi hàm cập nhật để không bị ghi đè mất phần tử cũ.
- **Giao dịch (Transactions):** Không có tính năng rollback tự động trên JSON. Để giả lập giao dịch, hãy sử dụng vòng lặp tuần tự `for...of` kết hợp với `await jsonDb.updateRecord`.

### 2.3 Nguyên Tắc "Shielding First"
Mọi hàm Public tại Tầng Dịch vụ (Service Layer) phải bắt đầu bằng kiểm tra trạng thái Online/Offline:
```typescript
if (process.env.IS_DATABASE_OFFLINE === 'true') {
  return await jsonDb.doSomething();
}
try {
  return await prisma.doSomething();
} catch (e) {
  // Ghi log và gọi Fallback xuống JSON
}
```

---

## 3. KIỂM THỬ TỰ ĐỘNG (JEST & REGRESSION TESTING)

Hệ thống được thiết lập kiểm thử đơn vị hồi quy thông qua Jest. Trước khi tạo PR, bắt buộc phải vượt qua bộ test.

### 3.1 Chạy Test
```bash
npm run test
# Hoặc chạy đích danh một file:
npx jest src/lib/services/__tests__/ou-scope-service.test.ts
```

### 3.2 Quy tắc Viết Test
- Mọi service logic liên quan đến Phân quyền (Scope/RBAC) hoặc AD Tree đệ quy đều phải có Unit Test đi kèm.
- **Type Inference trong Test:** Khi mock dữ liệu cho Jest, phải khai báo Interface tường minh để TypeScript không báo lỗi thuộc tính "không tồn tại" trên kiểu `any`.
- Mock dữ liệu giả (`__mocks__`) phải đảm bảo không ghi đè vào file `db.json` thật của hệ thống.
