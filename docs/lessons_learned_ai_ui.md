# Lessons Learned: AI & UI Upgrade Phase 9-10

Tài liệu này ghi lại các lỗi kỹ thuật thường gặp và cách khắc phục để tối ưu hóa việc phát triển các module AI.

## 1. Database Wrapper (db-wrapper.ts)

### ❌ Lỗi: Argument of type '{ id: any; }' is not assignable to parameter of type 'string | number'

- **Triệu chứng:** Khi sử dụng `findUnique`, truyền một đối tượng lọc (object) vào đối số thứ hai gây lỗi TypeScript.
- **Nguyên nhân:** Phương thức `findUnique` trong bộ Wrapper được thiết kế tối giản, chỉ nhận **giá trị ID trực tiếp** (Primary Key) làm đối số thứ hai, không nhận đối tượng `{ where: ... }` như Prisma gốc.
- **Cách khắc phục đúng:**

  - Nếu tìm theo Khóa chính (ID): Sử dụng `findUnique('TableName', id_value)`.
  - Nếu tìm theo các trường khác (vd: sourceId): Sử dụng `findMany('TableName', { sourceId: value })` và lấy phần tử đầu tiên.

## 2. CSS & UI (Glassmorphism)

### ❌ Lỗi: backdrop-filter không hiển thị trên Safari/iOS

- **Triệu chứng:** Hiệu ứng kính mờ biến mất, chỉ hiển thị nền màu đặc trên các thiết bị Apple.
- **Nguyên nhân:** Safari yêu cầu tiền tố `-webkit-backdrop-filter`.
- **Cách khắc phục:** Luôn khai báo song song và đúng thứ tự:

  ```css
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  ```

## 3. Markdown Governance

### ❌ Lỗi: MD025/single-title/single-h1

- **Triệu chứng:** Cảnh báo Lint khi có nhiều tiêu đề cấp 1 (`#`) trong một file.
- **Nguyên nhân:** Tiêu chuẩn tài liệu yêu cầu duy nhất một tiêu đề H1 ở đầu trang.
- **Cách khắc phục:** Sử dụng H2 (`##`) cho các Phase lớn và H3 (`###`) cho các Task nhỏ.

## 4. Cấu trúc thư mục & Import

### ❌ Lỗi: Cannot find module './db-wrapper' hoặc '../db-wrapper'

- **Triệu chứng:** Lỗi biên dịch TypeScript không tìm thấy module db-wrapper.
- **Nguyên nhân:** File `db-wrapper.ts` nằm cố định tại `src/lib/services/`. Khi tạo service mới trong cùng thư mục này, cần sử dụng đường dẫn tương đối cấp 0.
- **Quy tắc Import chuẩn:**
  - Nếu file nằm trong `src/lib/services/`: Dùng `import { ... } from './db-wrapper'`.
  - Nếu file nằm trong `src/scripts/`: Dùng `import { ... } from '../lib/services/db-wrapper'`.
  - Nếu file nằm trong `src/components/`: Dùng `import { ... } from '../../lib/services/db-wrapper'`.
