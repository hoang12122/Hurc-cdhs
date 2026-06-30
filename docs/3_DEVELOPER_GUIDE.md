# TÀI LIỆU 3: CẨM NANG DÀNH CHO LẬP TRÌNH VIÊN

## 0. Mục tiêu

Tài liệu này hướng dẫn lập trình viên và AI Agent phát triển HURC1 CRM theo đúng kiến trúc hiện tại của phần mềm.

Hệ thống hiện là **Modular Monolith theo hướng Micro-Frontend-ready**, chưa phải MFE deployment độc lập. Vì vậy module mới vẫn chạy chung trong Next.js App Shell, nhưng phải có ranh giới rõ về route, UI, hook, Server Action, Service Layer và module registry.

## 1. Bằng chứng phần mềm đã đối chiếu

Các thành phần đang được dùng làm chuẩn:

| Nội dung | Bằng chứng trong code |
|---|---|
| Navigation | `src/lib/navigation.ts` với `MAIN_NAV_ITEMS`, `ADMIN_NAV_ITEMS`, `USER_NAV_ITEMS` |
| Module registry | `src/lib/mfe/module-registry.ts` |
| Service Bus | `src/lib/mfe/service-bus.ts` |
| App Shell Bridge | `src/components/mfe/cross-module-service-bus-bridge.tsx` |
| Offline queue | `src/lib/services/offline-sync.ts` |
| Offline sync theo entity | `src/lib/services/offline-entity-sync.ts` |
| Module mẫu | `src/app/(app)/example-module` |
| Developer Guide audit | `scripts/audit-developer-guide.js` |
| Module registry audit | `scripts/audit-module-registry.js` |
| CI | `.github/workflows/security-and-acceptance.yml` |
| Quyền phê duyệt Incident Memory | `incident-memory:approve` trong `src/lib/actions/incident-learning.actions.ts` |

## 2. Quy trình tạo module mới

Module mới phải đặt trong App Shell:

```text
src/app/(app)/<module-name>/page.tsx
```

Cấu trúc khuyến nghị:

```text
src/app/(app)/<module-name>/page.tsx
src/components/<module-name>/<module-name>-panel.tsx
src/components/<module-name>/use-<module-name>-workflow.ts
src/lib/actions/<module-name>.actions.ts
src/lib/services/<module-name>-service.ts
```

Nguyên tắc:

- `page.tsx` chỉ làm page shell.
- UI đặt trong component riêng.
- Logic state, submit, load data đặt trong custom hook.
- Ghi dữ liệu phải đi qua Server Action và Service Layer.
- Không gọi trực tiếp backend trong UI component.

## 3. Module mẫu đã có

Module mẫu đã được bổ sung tại:

```text
src/app/(app)/example-module
src/components/example-module/example-module-panel.tsx
src/components/example-module/use-example-module-workflow.ts
src/lib/actions/example-module.actions.ts
src/lib/services/example-module-service.ts
```

Module này minh họa luồng chuẩn:

```text
Page Shell -> UI Component -> Custom Hook -> Server Action -> Service Layer
```

Khi mở rộng hệ thống, ưu tiên sao chép cách tổ chức của module này thay vì viết toàn bộ logic trong `page.tsx`.

## 4. Navigation và module registry

Khi tạo module mới, phải cập nhật `src/lib/navigation.ts` theo đúng nhóm:

- `MAIN_NAV_ITEMS`: module nghiệp vụ chính.
- `ADMIN_NAV_ITEMS`: module quản trị.
- `USER_NAV_ITEMS`: chức năng cá nhân.

Nếu module có ranh giới nghiệp vụ riêng, phải cập nhật `src/lib/mfe/module-registry.ts` với các trường tối thiểu:

```text
id, name, routePrefix, owner, runtimeMode, criticality, dataBoundary, allowedInboundEvents, allowedOutboundEvents, productionReadiness
```

Sau khi cập nhật registry, chạy:

```bash
node scripts/audit-module-registry.js
```

## 5. Service Bus và giao tiếp xuyên module

Không dùng browser event rời rạc trong component.

Nếu module cần mở màn hình hoặc truyền dữ liệu sang module khác, dùng:

```text
src/lib/mfe/service-bus.ts
src/components/mfe/cross-module-service-bus-bridge.tsx
```

Luồng Inspection tạo DNF là mẫu hiện có để tham khảo.

## 6. Offline queue và đồng bộ theo entity

Offline queue hiện dùng IndexedDB thông qua:

```text
src/lib/services/offline-sync.ts
```

Luồng đồng bộ theo từng entity dùng:

```text
src/lib/services/offline-entity-sync.ts
```

Checklist triển khai:

- Xác định type của offline action.
- Nối action đó với Server Action tương ứng.
- Chỉ xóa offline action sau khi backend ghi thành công.
- Nếu sync lỗi, giữ lại action và trả lỗi để người vận hành kiểm tra.

Các type nền đã có handler mapping gồm:

```text
DNF_CREATE
HAZARD_CREATE
INSPECTION_CREATE
STATUS_UPDATE
```

## 7. Quyền quản trị

Không dùng quyền rộng cho thao tác quản trị nếu đã có quyền riêng.

Phê duyệt Incident Memory hiện dùng quyền riêng:

```text
incident-memory:approve
```

Các action đồng bộ, xem hàng chờ phê duyệt và cập nhật trạng thái Incident Memory phải kiểm tra quyền này trước khi thực hiện.

## 8. Build, kiểm thử và PR checklist

Trước khi tạo PR, chạy tối thiểu:

```bash
node scripts/check-file-size-boundaries.js --warn
node scripts/check-changed-file-size-boundaries.js
node scripts/check-vibe-code-rules.js --warn
node scripts/audit-module-boundaries.js
node scripts/audit-module-registry.js
node scripts/audit-developer-guide.js
npm run db:validate:all
npm run db:generate:all
npm run typecheck
npm run lint
npm run build
```

Nếu có GIS/BIM:

```bash
npm run import:gis-bim:dry-run
```

## 9. Điểm mạnh hiện tại

- Đã có App Shell và navigation tập trung.
- Đã có module registry và audit registry trong CI.
- Đã có Service Bus và App Shell Bridge.
- Đã có offline queue và coordinator đồng bộ theo entity.
- Đã có module mẫu hoàn chỉnh.
- Đã có Developer Guide audit ở mức strict gate theo bằng chứng file.
- Đã có quyền riêng cho Incident Memory Approval.

## 10. Điểm còn lại

- Tiếp tục tách hook/UI cho các module legacy.
- Nối handler đồng bộ offline thật tại từng màn hình nghiệp vụ.
- Bổ sung audit log cho các thao tác phê duyệt quan trọng.
- Khi thêm route mới, phải cập nhật module registry và audit script tương ứng.
