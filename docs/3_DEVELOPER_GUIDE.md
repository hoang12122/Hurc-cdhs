# TÀI LIỆU 3: CẨM NANG DÀNH CHO LẬP TRÌNH VIÊN (DEVELOPER GUIDE)

## 0. Kết quả đối chiếu với phần mềm hiện tại

Tài liệu này đã được đối chiếu lại với mã nguồn trên `master`. Kết luận chính:

- Hệ thống hiện là **Modular Monolith theo hướng Micro-Frontend-ready**, chưa phải MFE deployment độc lập.
- Module mới phải nằm trong `src/app/(app)/...` để dùng chung App Shell, layout, sidebar và auth context.
- Menu hiện được khai báo tại `src/lib/navigation.ts`, gồm `MAIN_NAV_ITEMS`, `ADMIN_NAV_ITEMS` và `USER_NAV_ITEMS`.
- Offline UI hiện dùng IndexedDB thông qua `src/lib/services/offline-sync.ts`; `db.json` vẫn tồn tại như lớp local/preflight hoặc dữ liệu dự phòng, nhưng không được mô tả là cơ chế đồng bộ duy nhất.
- Build hiện dùng `src/scripts/build-env-guard.ts` để bổ sung placeholder env khi build, không còn khuyến nghị dùng `IS_DATABASE_OFFLINE=true npm run build` như hướng dẫn cũ.
- Tài liệu này đã được đưa vào CI qua bước `Developer Guide traceability audit`.
- Developer Guide audit hiện là strict gate: nếu thiếu bằng chứng quan trọng trong tài liệu, navigation hoặc CI, script sẽ trả lỗi để chặn drift.

## 1. Quy trình tạo module chức năng mới

Ví dụ yêu cầu: tạo phân hệ `audit` để quản lý đánh giá nội bộ.

### Bước 1 - Tạo route trong App Shell

Tạo thư mục:

```text
src/app/(app)/audit
```

Không tạo ngoài `(app)` nếu module cần dùng sidebar, header, auth layout và App Shell Bridge.

Cấu trúc khuyến nghị:

```text
src/app/(app)/audit/page.tsx
src/components/audit/...
src/components/audit/use-audit-workflow.ts
src/lib/actions/audit.actions.ts
src/lib/services/audit-service.ts
```

Quy ước:

- `page.tsx` ưu tiên làm page shell và gọi component chính.
- Component UI đặt trong `src/components/audit` hoặc `_components` nếu chỉ dùng nội bộ route.
- Logic form/workflow tách sang custom hook.
- Nghiệp vụ ghi dữ liệu đi qua Server Action và Service Layer.

### Bước 2 - Đăng ký menu

Mở:

```text
src/lib/navigation.ts
```

Thêm route vào đúng nhóm:

- `MAIN_NAV_ITEMS`: module nghiệp vụ chính.
- `ADMIN_NAV_ITEMS`: module quản trị, cần permission.
- `USER_NAV_ITEMS`: chức năng cá nhân người dùng.

Lưu ý đường dẫn menu phải trùng với route thật. Nếu route là `/audit` thì menu dùng `/audit`, không ghi nhầm thành `/admin/audit`.

### Bước 3 - Cập nhật module registry

Nếu module có ranh giới nghiệp vụ riêng, cập nhật:

```text
src/lib/mfe/module-registry.ts
```

Cần khai báo tối thiểu:

- `id`;
- `name`;
- `routePrefix`;
- `owner`;
- `runtimeMode`;
- `criticality`;
- `dataBoundary`;
- `allowedInboundEvents`;
- `allowedOutboundEvents`;
- `productionReadiness`.

Registry không biến hệ thống thành MFE thật, nhưng giúp kiểm soát ranh giới module và chuẩn bị cho MFE-ready.

### Bước 4 - Tạo Server Action và Service Layer

Không viết SQL, Prisma query hoặc fetch backend trực tiếp trong component UI.

Tạo:

```text
src/lib/actions/audit.actions.ts
src/lib/services/audit-service.ts
```

Nguyên tắc:

- Server Action kiểm tra quyền và chuẩn hóa input.
- Service Layer xử lý nghiệp vụ và truy cập database.
- Component UI chỉ gọi hook/handler đã được chuẩn hóa.

### Bước 5 - Giao tiếp xuyên module

Nếu module cần mở DNF, Asset 360, AI Lab hoặc gửi event sang module khác, dùng:

```text
src/lib/mfe/service-bus.ts
src/components/mfe/cross-module-service-bus-bridge.tsx
```

Không dùng browser event rời rạc trong component. Event xuyên module phải đi qua Typed Service Bus hoặc public service contract.

## 2. Quy tắc làm việc với offline/local data

### 2.1. IndexedDB offline queue

Các thao tác offline ở UI được lưu vào IndexedDB thông qua:

```text
src/lib/services/offline-sync.ts
```

Service này sử dụng database name:

```text
hurc-offline-db
```

và object store:

```text
offline-actions
```

Mỗi action offline có `id` sinh bằng `crypto.randomUUID()` và `timestamp`. Không dùng auto-increment cho dữ liệu cần đồng bộ.

### 2.2. db.json và local preflight

`db.json` hiện được xử lý trong local preflight:

```text
src/scripts/local-preflight.ts
```

Preflight sẽ kiểm tra `.env`, Prisma runtime, đường dẫn JSON DB và checksum. Nếu thiếu file JSON DB, script có thể khởi tạo file trống để môi trường dev không bị hỏng ngay từ đầu.

Không mô tả `db.json` là nguồn dữ liệu production chính. Với production, phải ưu tiên PostgreSQL/Prisma schema tương ứng.

### 2.3. Shallow merge

Khi cập nhật dữ liệu dạng mảng như attachments, evidence, tags hoặc checklist item, không ghi đè mảng cũ bằng payload mới nếu chưa merge có chủ đích.

Nguyên tắc:

```text
Đọc bản ghi cũ -> merge có kiểm soát -> validate -> ghi lại qua service/action
```

## 3. Quy trình build, migration và kiểm thử

Các lệnh quan trọng hiện có trong `package.json`:

```text
npm run dev
npm run build
npm run db:validate:all
npm run db:generate:all
npm run typecheck
npm run lint
npm run import:gis-bim:dry-run
npm run db:ops:status
```

Build hiện chạy qua:

```text
src/scripts/build-env-guard.ts
```

Build guard có nhiệm vụ bổ sung placeholder env khi build để hạn chế lỗi do thiếu biến môi trường build-time. Tuy nhiên, production vẫn phải cấu hình đúng các biến:

```text
AUTH_DATABASE_URL
AI_DATABASE_URL
METRO_DATABASE_URL
OPS_DATABASE_URL
SESSION_SECRET
NEXT_PUBLIC_SETUP_COMPLETE
```

## 4. Checklist trước khi tạo Pull Request

Trước khi push PR, lập trình viên hoặc AI Agent phải tự kiểm tra:

```bash
node scripts/check-file-size-boundaries.js --warn
node scripts/check-changed-file-size-boundaries.js
node scripts/check-vibe-code-rules.js --warn
node scripts/audit-module-boundaries.js
node scripts/audit-developer-guide.js
npm run db:validate:all
npm run db:generate:all
npm run typecheck
npm run lint
npm run build
```

Nếu module có dữ liệu GIS/BIM:

```bash
npm run import:gis-bim:dry-run
```

## 5. Khắc phục sự cố thường gặp

### 5.1. Lỗi thiếu biến môi trường

Triệu chứng: `npm run dev`, `npm run build` hoặc Prisma báo thiếu biến môi trường.

Cách xử lý:

1. Kiểm tra `.env`.
2. Bảo đảm có đủ `AUTH_DATABASE_URL`, `AI_DATABASE_URL`, `METRO_DATABASE_URL`, `OPS_DATABASE_URL`, `SESSION_SECRET`, `NEXT_PUBLIC_SETUP_COMPLETE`.
3. Chạy `npm run db:validate:all`.
4. Chạy `npm run db:generate:all`.
5. Chạy lại `npm run build`.

### 5.2. Prisma Client hoặc Prisma runtime bị thiếu

Triệu chứng: app báo lỗi Prisma client/runtime hoặc không build được.

Cách xử lý:

```bash
npm run db:generate:all
npm run db:validate:all
```

Nếu chỉ kiểm tra OPS:

```bash
npm run db:ops:generate
npm run db:ops:status
```

### 5.3. Dữ liệu offline không đồng bộ

Triệu chứng: thao tác offline còn nằm trong trình duyệt, chưa đẩy về backend.

Cách kiểm tra:

- Kiểm tra IndexedDB `hurc-offline-db` trong DevTools.
- Kiểm tra store `offline-actions`.
- Kiểm tra logic gọi `offlineSync.getActions()` và `offlineSync.removeAction()` trong luồng đồng bộ tương ứng.
- Không xóa dữ liệu offline nếu chưa xác nhận backend đã ghi thành công.

### 5.4. Module mới không hiện ở sidebar

Cách xử lý:

1. Kiểm tra route nằm trong `src/app/(app)/...`.
2. Kiểm tra `src/lib/navigation.ts` đã thêm đúng `MAIN_NAV_ITEMS` hoặc `ADMIN_NAV_ITEMS`.
3. Kiểm tra `path` trong menu có trùng route thật không.
4. Nếu module quản trị, kiểm tra permission.

### 5.5. Luồng xuyên module không hoạt động

Cách xử lý:

1. Kiểm tra event có được publish qua `src/lib/mfe/service-bus.ts` không.
2. Kiểm tra `cross-module-service-bus-bridge.tsx` đã xử lý event đó chưa.
3. Kiểm tra App Shell đã render Bridge trong layout chưa.
4. Không dùng `window.dispatchEvent` rời rạc ngoài Service Bus.

## 6. Điểm mạnh sau đối chiếu

- Navigation thật đã nằm tại `src/lib/navigation.ts`.
- Có module registry để quản lý ranh giới module.
- Có Service Bus và App Shell Bridge cho luồng xuyên module.
- Có offline queue qua IndexedDB.
- Có local preflight và build env guard.
- Có CI audit cho design rules, Vibe Code, module boundary và Developer Guide traceability.
- Developer Guide audit đã chuyển sang strict gate để hạn chế tài liệu bị lệch khỏi phần mềm.

## 7. Điểm yếu còn lại

- Một số module legacy vẫn cần tiếp tục tách hook/UI.
- Offline queue đã có service nền nhưng cần rà soát thêm luồng đồng bộ thực tế theo từng entity.
- Module registry cần được cập nhật đều khi thêm module mới.
- Cần bổ sung ví dụ module mẫu hoàn chỉnh nếu đội phát triển mở rộng nhiều phân hệ mới.
- Cần bổ sung quyền riêng cho các module quản trị như Incident Memory Approval.

## 8. Lộ trình cải thiện tiếp theo

- Bổ sung template module mẫu cho `src/app/(app)/example-module` hoặc tài liệu scaffold.
- Bổ sung checklist đồng bộ offline cho từng entity.
- Bổ sung quyền riêng cho các module quản trị như Incident Memory Approval.
- Bổ sung audit log cho các thao tác phê duyệt quan trọng.
