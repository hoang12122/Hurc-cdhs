# QA Acceptance Report – Hurc-cdhs

**Tester:** Codex (vai trò kiểm thử độc lập)  
**Ngày kiểm thử (UTC):** 2026-05-16  
**Mục tiêu:** Nghiệm thu nhanh khả năng chạy/deploy dự án từ mã nguồn hiện tại.

## 1) Phạm vi kiểm thử

- Kiểm tra tính nhất quán dependency (`npm ci`).
- Kiểm tra static type (`npm run typecheck`).
- Kiểm tra build production (`npm run build`).
- Đối chiếu quy trình deploy trong `DEPLOY.md`.

## 2) Kết quả chi tiết

### 2.1 Dependency/lockfile
- Lệnh `npm ci` **thất bại**.
- Lý do chính: `package.json` và `package-lock.json` không đồng bộ.
- Thông báo then chốt: thiếu `@emnapi/core@1.10.0`, `@emnapi/runtime@1.10.0` trong lock file.

**Mức độ:** Critical (chặn pipeline CI/CD ngay bước cài đặt).

### 2.2 Type checking
- Lệnh `npm run typecheck` **thất bại** với số lượng lỗi rất lớn.
- Nhóm lỗi chính:
  - Không resolve được module (`react`, `next/link`, `lucide-react`, ...).
  - Thiếu kiểu Node globals (`process`, `fs`, `path`, `http`, ...).
  - Nhiều lỗi `implicit any` và lỗi JSX typing.

**Mức độ:** Critical (codebase chưa đạt chuẩn buildable/type-safe).

### 2.3 Production build
- Lệnh `npm run build` **thất bại**.
- Điểm fail sớm ở bước gọi `npx tsx src/scripts/build-env-guard.ts` do lỗi npm registry access:
  - `403 Forbidden - GET https://registry.npmjs.org/tsx`

**Mức độ:** Critical (không thể tạo artifact deploy).

## 3) Đánh giá khả năng deploy thành công

Theo trạng thái hiện tại của repository và các kiểm tra thực tế ở trên:

- **Xác suất deploy thành công (ước tính): 10%**.

### Giải thích cách ước tính
- `npm ci` fail → không thể đảm bảo môi trường build đồng nhất.
- `typecheck` fail diện rộng → rủi ro lỗi runtime/build rất cao.
- `build` fail trực tiếp → chưa tạo được gói production.
- Tài liệu `DEPLOY.md` mô tả quy trình rõ ràng, nhưng hiện trạng source/dependency chưa đạt điều kiện tiên quyết.

## 4) Danh sách lỗi ưu tiên khắc phục (để tăng deploy success)

1. Đồng bộ `package-lock.json` với `package.json` (`npm install` + commit lockfile chuẩn).  
2. Ổn định chiến lược dependency nội bộ (registry mirror/private npm nếu có policy chặn).  
3. Sửa lỗi TypeScript theo thứ tự:
   - module resolution/types cho React/Next/Node,
   - sau đó cleanup lỗi `implicit any`.
4. Chốt lại pipeline pre-build để không phụ thuộc fetch runtime không kiểm soát.

## 5) Kết luận nghiệm thu

- **Trạng thái nghiệm thu hiện tại: KHÔNG ĐẠT (Fail).**
- **Khuyến nghị:** Không triển khai production từ commit hiện tại cho đến khi pass được tối thiểu `npm ci` + `npm run typecheck` + `npm run build`.
