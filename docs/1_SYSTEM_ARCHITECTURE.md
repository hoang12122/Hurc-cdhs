# TÀI LIỆU 1: KIẾN TRÚC HỆ THỐNG

**Mã tài liệu:** HURC-CDHS-DOC-01  
**Tên tài liệu:** Kiến trúc hệ thống  
**Phạm vi áp dụng:** Phần mềm HURC CDHS  
**Nhánh đối soát:** `master`  
**Mục đích sử dụng:** Quản lý kiến trúc, định hướng phát triển, kiểm tra kỹ thuật và làm căn cứ nghiệm thu nội bộ.

---

## 1. Mục tiêu tài liệu

Tài liệu này mô tả thống nhất kiến trúc hiện tại của phần mềm HURC CDHS, bao gồm mô hình ứng dụng, cách tổ chức module, luồng trao đổi dữ liệu, nguyên tắc tích hợp, giới hạn hiện tại và các điều kiện cần đáp ứng trước khi nghiệm thu triển khai.

Tài liệu được viết theo một cấu trúc thống nhất. Mỗi nội dung kỹ thuật được trình bày theo cùng một cách tiếp cận:

```text
Mô tả
→ Hiện trạng
→ Giới hạn
→ Kiểm soát / việc cần làm
```

Cách viết này nhằm tránh tình trạng một phần tài liệu ghi theo dạng báo cáo, phần khác ghi theo dạng ghi chú kỹ thuật rời rạc.

---

## 2. Kết luận kiến trúc hiện tại

### 2.1. Mô tả

Kiến trúc hiện tại của phần mềm được xác định là:

```text
Modular Monolith theo hướng Micro-Frontend-ready
```

Điều này có nghĩa là hệ thống đang được chia theo các module nghiệp vụ rõ ràng, nhưng các module vẫn chạy trong cùng một ứng dụng Next.js, cùng repository và cùng app shell.

### 2.2. Hiện trạng

Hệ thống đã có các thành phần giúp tiến gần hơn đến trạng thái Micro-Frontend-ready, gồm:

| Thành phần | Hiện trạng | Vai trò |
|---|---|---|
| Module Registry | Đã có | Khai báo module, route, owner, data boundary và event contract. |
| Typed Service Bus | Đã có | Điều phối sự kiện giao diện giữa các module trong cùng phiên người dùng. |
| App Shell Bridge | Đã có | Nhận event từ Service Bus và điều hướng sang module phù hợp. |
| Server Action | Đã có | Xử lý thao tác ghi dữ liệu, kiểm tra quyền và gọi service backend. |
| Service Layer | Đã có | Chuẩn hóa nghiệp vụ, truy cập database và tái sử dụng logic backend. |
| Governance Documents | Đã có một phần | Làm căn cứ kiểm soát dữ liệu, độ tin cậy, GIS/BIM và vận hành. |

### 2.3. Giới hạn

Hệ thống **chưa phải Micro-Frontend deployment độc lập**. Các module chưa được build, deploy, version và vận hành độc lập. Do đó, không được mô tả hệ thống như một kiến trúc Micro-Frontend hoàn chỉnh.

### 2.4. Kiểm soát / việc cần làm

Trước khi công bố hệ thống là Micro-Frontend-ready ở mức cao hơn, cần tiếp tục kiểm tra:

- Module boundary đã được kiểm soát bằng audit hay chưa.
- Event contract giữa các module có đầy đủ hay chưa.
- UI legacy đã được thay bằng Service Bus flow hay chưa.
- Các module có còn import chéo component/service không phù hợp hay không.
- CI có bắt lỗi khi module vi phạm boundary hay không.

---

## 3. Mô hình tổ chức module

### 3.1. Mô tả

Ứng dụng được tổ chức theo module nghiệp vụ tại:

```text
src/app/(app)/[module]
```

Các module chính gồm Dashboard, DNF, Hazard, Inspection, Task, Asset 360, AI Lab, Rail Network, GIS/BIM Twin, Spatial Import, Admin, Reports và các phân hệ hỗ trợ.

### 3.2. Hiện trạng

Mỗi module chịu trách nhiệm cho một nhóm nghiệp vụ riêng, bao gồm giao diện, form, danh sách, trang chi tiết và workflow tương ứng. Khi cần trao đổi dữ liệu hoặc mở luồng nghiệp vụ giữa các module, hệ thống sử dụng ba lớp chính:

| Lớp | Vai trò |
|---|---|
| Client Event Bus | Điều phối giao diện xuyên module trong cùng phiên người dùng. |
| Server Action | Xử lý ghi dữ liệu, kiểm tra quyền và gọi service backend. |
| Service Layer | Xử lý nghiệp vụ, chuẩn hóa dữ liệu và truy cập database. |

### 3.3. Giới hạn

Một số module vẫn còn phần giao diện hoặc workflow cũ chưa được chuyển hoàn toàn sang event/service flow thống nhất.

### 3.4. Kiểm soát / việc cần làm

Cần ưu tiên kiểm tra các màn hình có thao tác liên module, đặc biệt là Inspection tạo DNF, DNF tạo Hazard, Asset 360 mở từ GIS/BIM hoặc AI Lab, và các luồng liên quan FRACAS/RAMS.

---

## 4. Module Registry

### 4.1. Mô tả

Module Registry là lớp khai báo chính thức về module trong hệ thống. File triển khai:

```text
src/lib/mfe/module-registry.ts
```

### 4.2. Hiện trạng

Registry khai báo các thuộc tính chính:

```text
id
name
routePrefix
owner
runtimeMode
criticality
dataBoundary
allowedInboundEvents
allowedOutboundEvents
productionReadiness
```

Registry giúp xác định module nào thuộc miền dữ liệu nào, module nào được phép gửi/nhận event nào và module nào còn cần kiểm tra thêm trước production.

### 4.3. Giới hạn

Registry hiện là lớp khai báo và kiểm soát kiến trúc ở mức phần mềm. Registry chưa tự động tách module thành deployment độc lập.

### 4.4. Kiểm soát / việc cần làm

Cần duy trì audit để bảo đảm module mới phải được đăng ký trong registry và không được tự phát sinh route/workflow ngoài kiểm soát.

Tài liệu liên quan:

```text
docs/mfe_readiness_and_module_boundary_plan.md
```

---

## 5. Typed Cross-Module Service Bus

### 5.1. Mô tả

Typed Cross-Module Service Bus là lớp điều phối sự kiện phía client giữa các module trong cùng phiên người dùng. File triển khai:

```text
src/lib/mfe/service-bus.ts
```

### 5.2. Hiện trạng

Các event chính đã khai báo:

```text
inspection:create-dnf
dnf:created
hazard:created
asset:open-360
ai-lab:open-incident-learning
```

Các helper chính gồm:

```text
publishCrossModuleEvent(...)
subscribeCrossModuleEvent(...)
publishCreateDnfFromInspection(...)
subscribeCreateDnfFromInspection(...)
publishDnfCreated(...)
publishHazardCreated(...)
publishOpenAsset360(...)
publishOpenIncidentLearning(...)
```

Service Bus sử dụng `CustomEvent` trong trình duyệt với prefix:

```text
hurc:mfe:
```

Mỗi event có envelope gồm `name`, `payload`, `emittedAt` và `traceId`.

### 5.3. Giới hạn

Service Bus hiện là client runtime event bus. Nó không thay thế database transaction, backend message broker, audit log nghiệp vụ, queue, retry, dead-letter hoặc workflow đa người dùng.

### 5.4. Kiểm soát / việc cần làm

Nếu cần điều phối backend hoặc workflow đa người dùng, cần bổ sung outbox pattern hoặc message broker như Redis Streams, RabbitMQ hoặc Kafka.

---

## 6. App Shell Bridge

### 6.1. Mô tả

App Shell Bridge là lớp nhận event từ Service Bus và điều hướng sang module phù hợp. File triển khai:

```text
src/components/mfe/cross-module-service-bus-bridge.tsx
```

Bridge được gắn vào app shell tại:

```text
src/app/(app)/layout.tsx
```

### 6.2. Hiện trạng

Các luồng đã có nền điều phối:

| Luồng | Điều hướng | Mục đích |
|---|---|---|
| Inspection tạo DNF | `inspection:create-dnf -> /dnf/new` | Tạo DNF từ phát hiện kiểm tra. |
| Asset 360 | `asset:open-360 -> /asset-360?...` | Mở hồ sơ tài sản 360 độ từ module khác. |
| AI Lab Incident Learning | `ai-lab:open-incident-learning -> /ai-lab?...` | Mở AI Lab với bối cảnh sự cố cần phân tích. |

### 6.3. Giới hạn

Một số event đã có contract nhưng chưa được nối đầy đủ vào UI thực tế.

### 6.4. Kiểm soát / việc cần làm

Cần thay các nút legacy bằng component hoặc helper dùng Service Bus, bắt đầu từ luồng Inspection tạo DNF.

---

## 7. Luồng Inspection tạo DNF

### 7.1. Mô tả

Luồng này cho phép tạo hồ sơ DNF từ một phát hiện trong module Inspection.

```text
Inspection
→ Typed Service Bus
→ App Shell Bridge
→ /dnf/new
→ DNF Form
→ DNF Server Action
→ DNF Service
→ OPS Database
```

### 7.2. Hiện trạng

Payload nền gồm:

```text
originatingInspectionId
originatingFindingId
description
locationOfFailure
staffWhoIdentifiedFailure
equipmentCode
subsystemId
```

Trang `/dnf/new` đọc tham số và hydrate `DnfForm` với `initialData`.

Component nền đã có:

```text
src/components/inspections/create-dnf-from-finding-event-button.tsx
```

### 7.3. Giới hạn

Màn hình chi tiết Inspection vẫn cần được rà để bảo đảm nút legacy đã được thay hoàn toàn bằng component dùng Service Bus.

### 7.4. Kiểm soát / việc cần làm

Khi kiểm thử, cần xác nhận đầy đủ các điểm sau:

- Từ Inspection bấm tạo DNF.
- Ứng dụng mở `/dnf/new`.
- Form DNF tự điền mô tả, vị trí, người phát hiện, mã thiết bị và subsystem nếu có.
- Submit form không lỗi quyền.
- DNF lưu vào OPS database.
- DNF giữ `originatingInspectionId` và `originatingFindingId` để truy vết.

---

## 8. Luồng DNF tạo Hazard

### 8.1. Mô tả

Luồng này cho phép tạo Hazard Log từ DNF, bảo đảm dữ liệu sự cố không phải nhập lại thủ công.

```text
DNF Detail hoặc link cũ
→ middleware chuẩn hóa link
→ /dnf/[id]/create-hazard
→ buildDnfToHazardUrl(dnf)
→ /hazards/new
→ Hazard Form
```

### 8.2. Hiện trạng

Helper chuẩn hóa dữ liệu nằm tại:

```text
src/lib/fracas/dnf-to-hazard-link.ts
```

Các trường được truyền sang Hazard gồm:

```text
originatingDnfId
dnfHazardPrefill
suggestedDescription
locationOfFailure
suggestedConsequence
suggestedControls
suggestedSystemGroup
suggestedSeverityId
suggestedProposedActions
```

Middleware đã chuẩn hóa link cũ dạng `/hazards/new?originatingDnfId=...` về route chuẩn `/dnf/[id]/create-hazard`.

### 8.3. Giới hạn

Middleware đang bảo vệ luồng cũ, nhưng về lâu dài vẫn nên sửa trực tiếp nút trong DNF Detail sang route chuẩn để code gọn hơn.

### 8.4. Kiểm soát / việc cần làm

Cần smoke test route `/hazards/new?originatingDnfId=...` và route `/dnf/[id]/create-hazard` với dữ liệu DNF thật hoặc dữ liệu seed.

---

## 9. Server Action và Service Layer

### 9.1. Mô tả

Các thao tác ghi dữ liệu hoặc yêu cầu kiểm tra quyền không được xử lý chỉ bằng Client Event Bus. Hệ thống sử dụng Server Action và Service Layer để xử lý nghiệp vụ backend.

### 9.2. Hiện trạng

Ví dụ Server Action:

```text
src/lib/actions/dnf.actions.ts
src/lib/actions/incident-learning.actions.ts
src/lib/actions/ai.actions.ts
```

Ví dụ Service Layer:

```text
src/lib/services/dnf-service.ts
src/lib/services/task-service.ts
src/lib/services/incident-learning-service.ts
src/lib/services/incident-memory-approval-service.ts
```

Service Layer chịu trách nhiệm nghiệp vụ, chuẩn hóa dữ liệu, truy cập Prisma/DB và tái sử dụng cho UI, script CLI, job đồng bộ hoặc API nội bộ.

### 9.3. Giới hạn

Cần tránh để client component truy cập trực tiếp database hoặc tự xử lý logic nghiệp vụ quan trọng.

### 9.4. Kiểm soát / việc cần làm

Cần bổ sung audit định kỳ để phát hiện import sai tầng, đặc biệt là UI import trực tiếp service/database không đúng chuẩn.

---

## 10. AI Lab và Incident Learning

### 10.1. Mô tả

AI Lab Incident Learning hỗ trợ kỹ sư tra cứu hiện tượng sự cố tương tự và nhận gợi ý xử lý dựa trên dữ liệu vận hành, DNF, Hazard, Task, Inspection và Incident Memory.

### 10.2. Hiện trạng

Các thành phần chính:

```text
prisma/ops/schema.prisma
prisma/ops/migrations/.../migration.sql
src/lib/services/incident-learning-service.ts
src/lib/services/incident-memory-approval-service.ts
src/lib/actions/incident-learning.actions.ts
src/scripts/sync-incident-memory.ts
```

Server actions chính:

```text
incidentLearningQuery(query)
syncIncidentMemory()
getIncidentMemoryApprovalQueue(limit)
setIncidentMemoryVerificationState(memoryId, verificationState, verifiedBy)
```

Luồng production dự kiến:

```text
DNF / Corrective Action / Hazard / Task / Inspection
→ Incident Memory Sync
→ ops_incident_memories
→ Review / Verified / Rejected
→ AI Lab Incident Learning
→ Kỹ sư bảo trì
```

### 10.3. Giới hạn

AI chỉ đưa ra gợi ý kỹ thuật tham khảo. Kết quả phải được đối chiếu với hiện trường, log, tài liệu O&M và phê duyệt an toàn. Bài học kinh nghiệm chính thức nên có `verificationState = verified`.

### 10.4. Kiểm soát / việc cần làm

Cần hoàn thiện UI phê duyệt Incident Memory, phân quyền người duyệt và quy trình lưu bằng chứng xác nhận.

Tài liệu liên quan:

```text
docs/incident_memory_approval_workflow.md
```

---

## 11. GIS/BIM và Google Maps

### 11.1. Mô tả

GIS/BIM và Google Maps hỗ trợ hiển thị tuyến, ga, tài sản, vị trí không gian và liên kết Asset 360 với dữ liệu hạ tầng.

### 11.2. Hiện trạng

Đã có tài liệu quản trị dữ liệu chính thức:

```text
docs/official_gis_google_maps_data_governance.md
```

Nguyên tắc phân loại dữ liệu:

| Trạng thái | Ý nghĩa |
|---|---|
| `demo` | Chỉ dùng để kiểm thử hoặc trình diễn. |
| `needs-review` | Có nguồn nhưng chưa được xác nhận. |
| `official` | Đã có nguồn dữ liệu, người xác nhận, ngày xác nhận, tọa độ hoặc Google Place ID hợp lệ. |

### 11.3. Giới hạn

Dữ liệu tuyến, ga, GIS/BIM và Google Maps hiện có một phần là demo/tham khảo để kiểm chứng kiến trúc. Không được dùng nhầm làm dữ liệu vận hành chính thức.

### 11.4. Kiểm soát / việc cần làm

Trước production cần có dữ liệu GIS/BIM, As-built, tọa độ và Place ID được phê duyệt theo quy trình dữ liệu chính thức.

---

## 12. Dashboard, FRACAS và RAMS

### 12.1. Mô tả

Dashboard là nơi tổng hợp dữ liệu DNF, FRACAS, RAMS và Predictive RAMS để hỗ trợ theo dõi vận hành và ra quyết định kỹ thuật.

### 12.2. Hiện trạng

Luồng dữ liệu chính:

```text
DNF records
→ FRACAS Phase Tracker
→ RAMS OCC Dashboard
→ Predictive RAMS Panel
```

Các engine/phần giao diện liên quan:

```text
src/lib/fracas/fracas-phase-tracker.ts
src/components/fracas/fracas-phase-tracker.tsx
src/lib/rams/rams-risk-engine.ts
src/components/rams/rams-occ-dashboard-panel.tsx
src/lib/rams/predictive-rams.ts
src/components/rams/predictive-rams-panel.tsx
```

### 12.3. Giới hạn

Các công thức RAMS/Predictive RAMS hiện phù hợp cho demo, sàng lọc nhanh và cảnh báo định hướng. Khi có dữ liệu vận hành thật, cần hiệu chỉnh trọng số, ngưỡng rủi ro, logic recurrence và kiểm tra hiệu năng khi số lượng DNF tăng.

### 12.4. Kiểm soát / việc cần làm

Cần bổ sung test dữ liệu rỗng, dữ liệu lớn, dữ liệu thiếu thời gian khôi phục và dữ liệu có nhiều sự cố lặp lại cùng thiết bị.

---

## 13. Uptime, offline và giới hạn cam kết vận hành

### 13.1. Mô tả

Hệ thống có một số cơ chế hỗ trợ fallback/offline trong trường hợp không kết nối được dữ liệu hoặc cần chạy thử nghiệm.

### 13.2. Hiện trạng

Fallback/offline giúp phần mềm duy trì một số chức năng demo hoặc kiểm thử khi môi trường chưa có đầy đủ database/hạ tầng.

### 13.3. Giới hạn

Không được mô tả hệ thống là “bất tử”, “không bao giờ gián đoạn” hoặc bảo đảm 99.9% uptime nếu chưa có đầy đủ:

- Hạ tầng High Availability.
- Backup/restore drill.
- Migration rollback plan.
- Monitoring và alerting.
- Log tập trung.
- Readiness/liveness healthcheck.
- Quy trình khôi phục sự cố.

### 13.4. Kiểm soát / việc cần làm

Các tài liệu nghiệm thu production phải phân biệt rõ giữa năng lực phần mềm, năng lực hạ tầng và năng lực vận hành thực tế.

---

## 14. Kiểm soát CI/CD và nghiệm thu kỹ thuật

### 14.1. Mô tả

CI/CD là lớp kiểm soát để bảo đảm thay đổi mã nguồn không làm đứt gãy build, typecheck, lint, audit, smoke test và các luồng nghiệp vụ lõi.

### 14.2. Hiện trạng

Các kiểm tra đang được dùng hoặc đã bổ sung:

```text
Security and Acceptance Gate
Docker Acceptance Gate
db:validate:all
db:generate:all
import:gis-bim:dry-run
audit-software-linkage.js
audit-six-step-upgrades.js
audit-core-workflow-logic.js
production-smoke-test.js
run-build-phase.js
production-dependency-audit.js
```

### 14.3. Giới hạn

Một số kiểm tra hiện là static audit hoặc smoke test route. Chúng không thay thế kiểm thử dữ liệu thật, kiểm thử tải, kiểm thử bảo mật chuyên sâu hoặc nghiệm thu vận hành tại môi trường production.

### 14.4. Kiểm soát / việc cần làm

Chỉ nên nghiệm thu kỹ thuật nội bộ khi:

- Security and Acceptance Gate pass.
- Docker Acceptance Gate pass.
- Build production chạy được.
- Docker container healthy.
- Các route FRACAS, Hazard, Dashboard, GIS/BIM và Asset 360 smoke test pass.
- Migration chính chạy thành công trên môi trường kiểm thử.
- Log build phase được upload artifact để truy vết.

---

## 15. Rủi ro kiến trúc còn tồn tại

| Nhóm rủi ro | Hiện trạng | Mức ưu tiên | Việc cần làm |
|---|---|---|---|
| Micro-Frontend | Chưa có deployment độc lập | Trung bình | Tiếp tục kiểm soát module boundary trước khi tách deployment. |
| Service Bus | Một số event chưa nối hết UI | Cao | Thay nút legacy bằng flow Service Bus. |
| Inspection → DNF | Có component nền nhưng cần rà UI thực tế | Cao | Kiểm thử từ màn hình Inspection thật. |
| DNF → Hazard | Có middleware chuẩn hóa, nhưng nên sửa trực tiếp nút legacy | Cao | Chuyển nút sang `/dnf/[id]/create-hazard`. |
| Incident Memory | Có service phê duyệt nhưng UI quản trị chưa đầy đủ | Cao | Bổ sung UI, quyền và audit log. |
| GIS/BIM/Google Maps | Còn dữ liệu demo/tham khảo | Cao | Xác nhận dữ liệu chính thức trước production. |
| RAMS/Predictive RAMS | Công thức rule-based | Trung bình | Hiệu chỉnh theo dữ liệu thật. |
| Uptime/offline | Có fallback nhưng chưa đủ HA production | Cao | Bổ sung monitoring, backup, rollback và recovery drill. |

---

## 16. Checklist kiểm tra nhanh

Chạy tại thư mục repository:

```bash
git pull origin master
rm -f tsconfig.tsbuildinfo

npm run db:validate:all
npm run db:generate:all
node scripts/audit-core-workflow-logic.js
node scripts/audit-six-step-upgrades.js
npm run audit:linkage
npm run typecheck
npm run lint
```

Điều kiện quan trọng: môi trường build production cần sử dụng đúng phiên bản Node.js theo cấu hình dự án.

---

## 17. Kết luận

Kiến trúc hiện tại của HURC CDHS là Modular Monolith theo hướng Micro-Frontend-ready. Hệ thống đã có module registry, typed Service Bus, App Shell Bridge, Server Action, Service Layer, AI Incident Learning, GIS/BIM foundation, FRACAS/RAMS dashboard và các lớp audit CI.

Tuy nhiên, hệ thống chưa phải Micro-Frontend deployment độc lập và chưa được xem là production-ready nếu chưa hoàn tất migration, dữ liệu GIS/BIM chính thức, UI phê duyệt Incident Memory, kiểm thử runtime, monitoring, backup/restore và rollback plan.

Trọng tâm tiếp theo là chuẩn hóa luồng liên module, thay UI legacy bằng flow thống nhất, mở rộng smoke test, kiểm soát dữ liệu chính thức và duy trì audit để bảo đảm kiến trúc không bị lệch trong các lần cập nhật sau.
