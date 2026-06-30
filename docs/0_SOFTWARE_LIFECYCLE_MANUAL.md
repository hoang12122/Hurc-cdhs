# SỔ TAY VÒNG ĐỜI PHẦN MỀM HURC1 CRM

## 0. Mục tiêu và phạm vi

Tài liệu này là sổ tay tổng hợp cho toàn bộ vòng đời phần mềm HURC1 CRM, từ thiết kế, xây dựng, kiểm thử, triển khai, bảo trì, bảo dưỡng đến vận hành. Tài liệu dùng để thống nhất cách hiểu giữa nhóm phát triển, quản trị hệ thống, vận hành, bảo trì và các AI Agent hỗ trợ phát triển phần mềm.

Hệ thống hiện được xác định là Modular Monolith theo hướng Micro-Frontend-ready. Các module vẫn chạy chung trong Next.js App Shell, nhưng đã có module registry, Service Bus, App Shell Bridge, Server Actions, Service Layer và các audit trong CI để kiểm soát ranh giới kỹ thuật.

## 1. Tài liệu nền và bằng chứng phần mềm

Các tài liệu hiện có:

| Tài liệu | Nội dung chính |
|---|---|
| `docs/1_SYSTEM_ARCHITECTURE.md` | Kiến trúc hệ thống, module boundary, Service Bus, App Shell Bridge và giới hạn MFE-ready. |
| `docs/2_DESIGN_AND_CODING_RULES.md` | Quy tắc thiết kế, giới hạn 300 dòng, tách hook/UI, Server Action, Service Layer và checklist review. |
| `docs/3_DEVELOPER_GUIDE.md` | Hướng dẫn tạo module mới, module mẫu, offline entity sync, module registry và Developer Guide audit. |
| `docs/4_DEPLOYMENT_AND_OPS.md` | Dockerfile, docker-compose, CI, healthcheck, smoke test và các điểm còn thiếu trước production. |
| `docs/secure_external_integration_guide.md` | Quy tắc kết nối an toàn với phần mềm ngoài như SAP, Maximo, SCADA, GIS, BI, CMMS. |

Các bằng chứng code chính:

| Nhóm | Bằng chứng |
|---|---|
| Module registry | `src/lib/mfe/module-registry.ts` |
| Service Bus | `src/lib/mfe/service-bus.ts` |
| App Shell Bridge | `src/components/mfe/cross-module-service-bus-bridge.tsx` |
| Module mẫu | `src/app/(app)/example-module` |
| Offline sync | `src/lib/services/offline-sync.ts`, `src/lib/services/offline-entity-sync.ts` |
| AI Vision/YOLO | `src/lib/services/yolo.ts`, `src/lib/services/yolo-quality-gate.ts`, `infra/yolo/main.py` |
| Tích hợp an toàn | `src/lib/integrations/secure-integration-gateway.ts` |
| CI | `.github/workflows/security-and-acceptance.yml`, `.github/workflows/docker-acceptance.yml` |

## 2. Nguyên tắc thiết kế hệ thống

HURC1 CRM phải được thiết kế theo các nguyên tắc sau:

1. Module rõ ràng, không phụ thuộc chéo tùy tiện.
2. UI không xử lý nghiệp vụ backend trực tiếp.
3. Logic giao diện phức tạp phải tách sang custom hook.
4. Nghiệp vụ ghi dữ liệu phải đi qua Server Action và Service Layer.
5. Giao tiếp xuyên module phải dùng Service Bus, App Shell Bridge hoặc public service contract.
6. Dữ liệu demo phải được gắn nhãn và không được trình bày như dữ liệu chính thức.
7. AI chỉ hỗ trợ phân tích, không thay thế phê duyệt kỹ thuật, kiểm tra hiện trường hoặc hồ sơ O&M.
8. Tích hợp với phần mềm ngoài phải có policy, allowlist, chữ ký hoặc cơ chế xác thực tương đương.

## 3. Thiết kế module mới

Khi tạo module mới, dùng cấu trúc chuẩn:

```text
src/app/(app)/<module-name>/page.tsx
src/components/<module-name>/<module-name>-panel.tsx
src/components/<module-name>/use-<module-name>-workflow.ts
src/lib/actions/<module-name>.actions.ts
src/lib/services/<module-name>-service.ts
```

Module mẫu hiện có:

```text
src/app/(app)/example-module
src/components/example-module/example-module-panel.tsx
src/components/example-module/use-example-module-workflow.ts
src/lib/actions/example-module.actions.ts
src/lib/services/example-module-service.ts
```

Luồng chuẩn:

```text
Page Shell -> UI Component -> Custom Hook -> Server Action -> Service Layer -> Database/External Service
```

Khi thêm module, phải cập nhật:

```text
src/lib/navigation.ts
src/lib/mfe/module-registry.ts
```

Sau đó chạy:

```bash
node scripts/audit-module-registry.js
node scripts/audit-developer-guide.js
```

## 4. Quy tắc xây dựng và viết mã

Các file `.ts` và `.tsx` mới hoặc file đang refactor không được vượt 300 dòng. Nếu vượt, phải tách thành component con, custom hook, helper, mapper hoặc service riêng.

Các lệnh kiểm tra thiết kế:

```bash
node scripts/check-file-size-boundaries.js --warn
node scripts/check-changed-file-size-boundaries.js
node scripts/check-vibe-code-rules.js --warn
node scripts/audit-module-boundaries.js
```

Quy tắc bắt buộc:

- Không gọi backend trực tiếp trong UI component.
- Không hardcode màu tùy tiện khi có thể dùng token giao diện.
- Không dùng browser event rời rạc ngoài Service Bus.
- Không thêm route mới nếu chưa cân nhắc module registry.
- Không ghi log dữ liệu nhạy cảm.

## 5. Kiểm thử và kiểm soát chất lượng

Trước khi tạo PR hoặc merge lên `master`, chạy tối thiểu:

```bash
npm ci --include=dev --ignore-scripts
npm run db:validate:all
npm run db:generate:all
npm run typecheck
npm run lint
npm run build
```

Các audit bổ sung:

```bash
node scripts/audit-module-registry.js
node scripts/audit-developer-guide.js
node scripts/audit-doc4.js
node scripts/audit-secure-integrations.js
```

Nếu thay đổi Docker hoặc triển khai:

```bash
docker compose --profile core --profile tools config
docker compose --profile core build app
```

Nếu thay đổi GIS/BIM:

```bash
npm run import:gis-bim:dry-run
```

## 6. Triển khai và vận hành

Tài liệu triển khai chính là:

```text
docs/4_DEPLOYMENT_AND_OPS.md
```

Các thành phần triển khai chính:

```text
Dockerfile
docker-compose.yml
.github/workflows/security-and-acceptance.yml
.github/workflows/docker-acceptance.yml
scripts/production-smoke-test.js
scripts/smoke-deploy.sh
```

Các profile Docker Compose:

```text
core  -> postgres, mongo, redis, app, nginx
tools -> công cụ hỗ trợ import/kiểm thử
ai    -> dịch vụ AI liên quan
obs   -> quan sát/giám sát
```

Không mô tả hệ thống là production-ready tuyệt đối nếu chưa có đủ dữ liệu chính thức, kết quả CI, Docker Acceptance, smoke test, backup/restore, giám sát, rollback và nghiệm thu vận hành.

## 7. Bảo trì và bảo dưỡng phần mềm

Bảo trì phần mềm gồm các nhóm việc sau:

### 7.1. Bảo trì định kỳ hằng ngày

- Kiểm tra trạng thái `/api/health`.
- Kiểm tra container chính nếu chạy Docker.
- Kiểm tra log lỗi ứng dụng.
- Kiểm tra queue offline nếu có nghiệp vụ offline.
- Kiểm tra dung lượng lưu trữ và thư mục dữ liệu.

### 7.2. Bảo trì hằng tuần

- Kiểm tra CI workflow gần nhất.
- Rà soát lỗi typecheck/lint/build nếu phát sinh.
- Rà soát các module có productionReadiness khác `ready`.
- Rà soát dữ liệu demo/needs-review/official.
- Kiểm tra các cảnh báo từ audit script.

### 7.3. Bảo trì hằng tháng

- Rà soát dependency và `npm audit`.
- Rà soát quyền người dùng, vai trò và quyền quản trị.
- Rà soát module registry so với route thực tế.
- Kiểm tra tài liệu kỹ thuật có còn khớp phần mềm không.
- Diễn tập smoke test và quy trình khôi phục theo kịch bản được phê duyệt.

## 8. Vận hành nghiệp vụ

Các nghiệp vụ chính cần vận hành theo nguyên tắc sau:

| Nghiệp vụ | Nguyên tắc vận hành |
|---|---|
| Inspection | Kiểm tra hiện trường, ghi nhận phát hiện, tạo DNF qua luồng chuẩn khi cần. |
| DNF | Theo dõi vòng đời sự cố, trạng thái xử lý, phản hồi và đóng hồ sơ. |
| Hazard | Ghi nhận mối nguy, đánh giá, theo dõi kiểm soát và trạng thái. |
| Asset 360 | Theo dõi tài sản, lịch sử và liên kết dữ liệu liên quan. |
| AI Lab | Chỉ dùng kết quả AI để tham khảo, không thay thế phê duyệt kỹ thuật. |
| GIS/BIM | Chỉ dùng dữ liệu chính thức cho nghiệm thu vận hành; dữ liệu demo phải gắn nhãn. |
| Incident Memory | Phê duyệt bằng quyền riêng `incident-memory:approve`. |

## 9. AI Vision và YOLO

Pipeline YOLO hiện đã có các lớp kiểm soát:

- Kiểm tra MIME type ảnh.
- Giới hạn dung lượng ảnh.
- Timeout khi gọi YOLO service.
- Cấu hình ngưỡng confidence, IoU và max detection.
- Hậu xử lý bằng quality gate và NMS.
- Trả báo cáo chất lượng nhận diện.

Các file liên quan:

```text
src/app/api/ai/vision/detect/route.ts
src/lib/services/yolo.ts
src/lib/services/yolo-quality-gate.ts
infra/yolo/main.py
```

Điểm cần tiếp tục cải thiện:

- Bổ sung bộ ảnh kiểm thử chuẩn cho từng use case.
- Bổ sung đánh giá precision/recall theo dữ liệu thực tế.
- Tách rõ model demo và model đã được nghiệm thu.
- Ghi nhận version model trong log hoặc audit record khi dùng cho nghiệp vụ.

## 10. Tích hợp với phần mềm ngoài

Tích hợp với SAP, Maximo, SCADA, GIS, BI, CMMS hoặc phần mềm khác phải tuân thủ:

```text
src/lib/integrations/secure-integration-gateway.ts
docs/secure_external_integration_guide.md
```

Nguyên tắc:

- Không kết nối trực tiếp từ UI ra hệ thống ngoài.
- Không truyền secret trong payload nghiệp vụ.
- Dữ liệu log phải được redacted.
- Outbound phải kiểm tra allowlist host.
- Inbound/bidirectional phải có chữ ký hoặc cơ chế xác thực tương đương.
- Mỗi hệ thống ngoài phải có policy riêng.

Chưa mở endpoint inbound public mặc định để tránh tăng bề mặt tấn công. Khi có hệ thống cụ thể, cần tạo adapter/route riêng theo policy đã duyệt.

## 11. Bảo mật và phân quyền

Các nguyên tắc bảo mật:

- Quản trị hệ thống dùng quyền riêng, không dùng quyền rộng khi đã có quyền chuyên biệt.
- Incident Memory Approval dùng `incident-memory:approve`.
- Secret phải đặt trong môi trường triển khai hoặc secret manager, không ghi vào source code.
- Payload tích hợp phải được ký hoặc xác thực khi kết nối hai chiều.
- Dữ liệu nhạy cảm phải được che trước khi log.
- Module mới phải khai báo boundary và owner.

## 12. Sao lưu, khôi phục và DR

Hiện repo đã có tài liệu triển khai và công cụ smoke test, nhưng chưa có bộ script backup/restore production chuẩn hóa. Vì vậy chưa được mô tả hệ thống đã hoàn tất DR production.

Cần bổ sung ở giai đoạn tiếp theo:

```text
docs/backup_restore_runbook.md
scripts/backup-production.sh
scripts/restore-production.sh
```

Nội dung runbook cần bao gồm:

- Phạm vi dữ liệu cần backup.
- Tần suất backup.
- Người chịu trách nhiệm.
- Cách kiểm tra backup.
- Cách khôi phục thử nghiệm.
- Tiêu chí nghiệm thu khôi phục.

## 13. Điểm yếu còn lại sau đối chiếu

1. Một số tài liệu cũ vẫn có câu mô tả chưa phản ánh đầy đủ cải thiện mới.
2. Một số module legacy vẫn cần tách hook/UI.
3. Offline entity sync đã có coordinator, nhưng cần nối handler thực tế ở từng màn hình nghiệp vụ.
4. Backup/restore production chưa có script và runbook chuẩn hóa.
5. YOLO cần bộ dữ liệu kiểm thử chuẩn để đo chất lượng thực tế.
6. Secure integration mới có gateway thư viện và tài liệu; adapter cho từng hệ thống ngoài cần triển khai theo policy riêng.
7. Một số audit đang ở mức kiểm tra bằng chứng file, chưa kiểm tra sâu logic nghiệp vụ.

## 14. Lộ trình cải thiện

### Giai đoạn 1 - Ổn định tài liệu và CI

- Duy trì sổ tay vòng đời này như tài liệu tổng hợp.
- Cập nhật README trỏ về tài liệu tổng hợp.
- Bổ sung audit kiểm tra sự tồn tại của sổ tay vòng đời.
- Rà soát các tài liệu 1-6 sau mỗi thay đổi lớn.

### Giai đoạn 2 - Ổn định vận hành

- Bổ sung runbook backup/restore.
- Bổ sung quy trình DR chính thức.
- Bổ sung dashboard giám sát vận hành.
- Bổ sung log/audit cho các thao tác phê duyệt quan trọng.

### Giai đoạn 3 - Mở rộng tích hợp

- Tạo adapter riêng cho từng hệ thống ngoài.
- Bổ sung inbound route theo policy được duyệt.
- Bổ sung kiểm thử chữ ký, allowlist và redaction.
- Bổ sung audit log khi tích hợp ghi dữ liệu vào nghiệp vụ.

### Giai đoạn 4 - Nâng cấp AI/YOLO

- Bổ sung bộ ảnh kiểm thử chuẩn.
- Đánh giá precision/recall theo nghiệp vụ.
- Quản lý version model và trạng thái nghiệm thu model.
- Tách model demo và model vận hành chính thức.
