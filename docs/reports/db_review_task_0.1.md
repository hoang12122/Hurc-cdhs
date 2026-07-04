# BÁO CÁO RÀ SOÁT CẤU TRÚC DATABASE  
## Task 0.1 - Kiểm tra kiến trúc dữ liệu, Prisma Client và rủi ro vận hành

**Ngày cập nhật:** 2026-07-04  
**Phạm vi:** Prisma schema, Prisma Client, cấu hình kết nối, phân tách dữ liệu nghiệp vụ/AI, rủi ro vận hành và hướng kiểm soát tiếp theo.  
**Mức độ:** Báo cáo kỹ thuật phục vụ quản trị hệ thống, kiểm soát kiến trúc dữ liệu và chuẩn bị các bước migration/production readiness.

---

## 1. Mục tiêu rà soát

Mục tiêu của Task 0.1 là kiểm tra lại cấu trúc database của phần mềm HURC CDHS, đặc biệt sau khi hệ thống đã được mở rộng theo các nhóm chức năng: DNF, Hazard Log, FRACAS, RAMS, OCC Dashboard, AI Knowledge, TrustGraph và các lớp audit.

Việc rà soát tập trung vào 05 nội dung chính:

1. Xác định hiện trạng phân tách Prisma schema.
2. Kiểm tra cách khởi tạo Prisma Client theo từng miền dữ liệu.
3. Đánh giá mức độ tách biệt giữa dữ liệu nghiệp vụ, dữ liệu AI/audit và dữ liệu metro.
4. Nhận diện rủi ro còn tồn tại khi đưa hệ thống vào môi trường build/production.
5. Đề xuất hành động tiếp theo theo mức ưu tiên.

---

## 2. Kết luận nhanh

Hệ thống hiện **không còn ở trạng thái chỉ dùng một PrismaClient duy nhất cho toàn bộ dữ liệu**. Kiến trúc đã được tách theo hướng multi-schema/multi-client, gồm `opsDb`, `aiDb`, `authDb` và `metroDb`.

Tuy nhiên, hệ thống vẫn cần tiếp tục kiểm soát các vấn đề sau:

- Đồng bộ migration giữa các schema.
- Chuẩn hóa chiến lược fallback khi offline/mock mode.
- Kiểm soát hiệu năng khi Dashboard, RAMS và Predictive RAMS đọc nhiều dữ liệu DNF.
- Kiểm tra tính nhất quán cross-database giữa DNF, Hazard, AI logs và TrustGraph.
- Bổ sung thêm test/audit để bảo đảm các client không bị trộn lại trong các lần refactor sau.

---

## 3. Hiện trạng Prisma schema

### 3.1. Cấu trúc schema hiện có

Hệ thống hiện có các nhóm Prisma schema chính:

| Nhóm schema | Đường dẫn | Vai trò chính | Nhận xét |
|---|---|---|---|
| Legacy/Main | `prisma/schema.prisma` | Schema gốc, phục vụ tương thích ngược trong một số phần cũ | Cần tiếp tục giảm phụ thuộc dần nếu các module mới đã chuyển sang schema chuyên biệt. |
| Operations | `prisma/ops/schema.prisma` | DNF, Hazard, Inspection, Task, SystemLog, Corrective Action, Improvement | Đây là schema nghiệp vụ chính của hệ thống vận hành/bảo trì. |
| AI/Audit | `prisma/ai/schema.prisma` | AI Agent, AI Knowledge, Conversation, AI Safety/Verification logs, TrustGraph, Consistency logs | Đã có nền tảng tốt cho AI governance và audit. |
| Auth | `prisma/auth/schema.prisma` | Người dùng, quyền, phân quyền hoặc các cấu phần xác thực | Cần duy trì tách biệt với dữ liệu nghiệp vụ. |
| Metro | `prisma/metro/schema.prisma` | Dữ liệu metro, tài sản, hệ thống, tuyến/ga hoặc các cấu phần metro | Phục vụ Digital Twin/Asset/Rail Network. |

### 3.2. Operations schema

`prisma/ops/schema.prisma` hiện đã chứa các model nghiệp vụ quan trọng như:

- `DnfDocument`.
- `CorrectiveAction`.
- `HazardRecord`.
- `InspectionDetail`.
- `Task`.
- `SystemLog`.
- `MaintenanceStandard`.
- `Improvement`.

Đây là nền tảng phù hợp với chuỗi nghiệp vụ:

```text
DNF / Incident
→ Corrective Action
→ Hazard Log
→ FRACAS Phase Tracker
→ RAMS / OCC Dashboard
```

Điểm tích cực là các model DNF và Hazard đã có các trường phục vụ liên kết trực tiếp, ví dụ:

- `DnfDocument.impactAssessment`.
- `DnfDocument.immediateAction`.
- `DnfDocument.trainServiceAffected`.
- `DnfDocument.trainWithdrawn`.
- `DnfDocument.systemRestoredTime`.
- `DnfDocument.disruptionDuration`.
- `HazardRecord.linkedDnfId`.
- `HazardRecord.potentialConsequence`.
- `HazardRecord.currentControls`.
- `HazardRecord.proposedActions`.

Các trường này đang hỗ trợ trực tiếp cho RAMS quick calculation, Predictive RAMS và DNF → Hazard one-click workflow.

### 3.3. AI schema

`prisma/ai/schema.prisma` đã có các nhóm model quan trọng:

- Nhóm cấu hình AI: `AiAgent`, `AiKnowledgeSnippet`.
- Nhóm hội thoại/tri thức: `AiConversation`, `AiConversationMessage`, `AiInsight`.
- Nhóm đồng bộ: `AiSyncLog`, `TrustGraphSyncLog`.
- Nhóm kiểm soát an toàn AI: `AiVerificationLog`, `AiSafetyLog`, `AiRequestLog`.
- Nhóm TrustGraph: `TrustGraphNode`, `TrustGraphEdge`.
- Nhóm kiểm tra nhất quán: `AuditConsistencyCheckLog`, `GraphConsistencyLog`.

Như vậy, nhận định cũ “thiếu `AIVerificationLog` và `AISafetyLog`” hiện **không còn đúng**. Hai lớp dữ liệu này đã được định nghĩa trong schema AI và cần được duy trì như lớp bằng chứng kiểm soát khi AI đưa ra khuyến nghị liên quan an toàn.

---

## 4. Hiện trạng Prisma Client và kết nối database

### 4.1. Prisma client entrypoint

File `src/lib/prisma.ts` hiện đóng vai trò entrypoint trung tâm và export các client:

```text
opsDb
authDb
aiDb
metroDb
```

Đồng thời, default export đang map về `opsDb` để tương thích ngược với các module cũ.

Cấu trúc này tốt hơn so với việc ép kiểu nhiều biến client về cùng một PrismaClient. Tuy nhiên, cần tiếp tục giảm phụ thuộc vào default export để các module mới gọi đúng database theo miền dữ liệu.

### 4.2. Operations database client

`src/lib/db/ops-db.ts` đã khởi tạo PrismaClient riêng từ runtime client `.prisma-runtime/ops`, dùng `OPS_DATABASE_URL` hoặc cấu hình fallback từ `DB_CONFIG.postgres.opsUrl`.

Các điểm đã có:

- Singleton qua `globalForOps`.
- Tự thêm `connect_timeout` và `pool_timeout` vào URL.
- Có log lỗi/warn trong môi trường development.
- Có hàm `checkOpsDbHealth()`.

### 4.3. AI database client

`src/lib/db/ai-db.ts` đã khởi tạo PrismaClient riêng từ runtime client `.prisma-runtime/ai`, dùng `AI_DATABASE_URL` hoặc cấu hình fallback từ `DB_CONFIG.postgres.aiUrl`.

Các điểm đã có:

- Singleton qua `globalForAi`.
- Tự thêm `connect_timeout` và `pool_timeout` riêng cho AI database.
- Có hàm `checkAiDbHealth()`.
- Đúng định hướng tách AI/Audit logs khỏi nghiệp vụ vận hành.

### 4.4. Cấu hình timeout và resiliency

`src/lib/config/db-config.ts` hiện đã có nhóm cấu hình:

```text
DB_CONFIG.resiliency.ops
DB_CONFIG.resiliency.ai
```

Trong đó có các thông số như:

- `connectTimeout`.
- `queryTimeout` đối với ops.
- `poolTimeout`.
- `maxRetries`.

Ngoài ra, `src/lib/prisma.ts` có `runPrismaWithTimeout()` để giới hạn thời gian chờ truy vấn. Đây là điểm tốt, đặc biệt đối với môi trường có khả năng mất kết nối hoặc chạy kiểm tra tại hiện trường.

---

## 5. Phân loại dữ liệu theo miền nghiệp vụ

### 5.1. Dữ liệu nghiệp vụ vận hành/bảo trì

Nhóm này nên thuộc `opsDb`:

```text
DNF
Corrective Action
Hazard Log
Inspection
Task
Improvement
SystemLog nghiệp vụ
Maintenance Standard
Notification
Comment
```

Vai trò: phục vụ vận hành, bảo trì, quản lý sự cố, quản lý mối nguy, theo dõi FRACAS/RAMS và báo cáo OCC.

### 5.2. Dữ liệu AI, audit và TrustGraph

Nhóm này nên thuộc `aiDb`:

```text
AI Agent
AI Knowledge Snippet
AI Conversation
AI Verification Log
AI Safety Log
AI Request Log
AI Insight
TrustGraph Node
TrustGraph Edge
Consistency Check Logs
```

Vai trò: phục vụ truy vết AI, kiểm soát khuyến nghị, lưu bằng chứng quyết định, đồng bộ tri thức và kiểm tra nhất quán liên miền.

### 5.3. Dữ liệu xác thực và phân quyền

Nhóm này nên thuộc `authDb`:

```text
User
Role
Permission
Session/Auth data
Organizational scope nếu có
```

Vai trò: kiểm soát quyền truy cập, phân quyền theo vai trò, phạm vi đơn vị và audit người dùng.

### 5.4. Dữ liệu metro/tài sản/hạ tầng

Nhóm này nên thuộc `metroDb`:

```text
Station
Line
Asset
System
Subsystem
GIS/BIM/Spatial reference
Rail Network data
```

Vai trò: phục vụ Asset 360, GIS/BIM Twin, Rail Network, liên kết tài sản với sự cố và hotspot.

---

## 6. Rủi ro còn tồn tại

### 6.1. Rủi ro migration lệch giữa các schema

Khi đã tách thành nhiều schema, rủi ro không còn là “mọi dữ liệu nằm chung một DB”, mà là migration giữa các schema có thể lệch nhau.

Ví dụ:

- Ops schema đã đổi `HazardRecord` nhưng code vẫn dùng field cũ.
- AI schema đã thêm model audit nhưng service chưa ghi dữ liệu vào model đó.
- Metro schema thay đổi asset ID nhưng DNF/Hazard/RAMS vẫn tham chiếu theo tên hoặc mã cũ.

Mức độ: **Cao**  
Ưu tiên xử lý: **Cao**

### 6.2. Rủi ro default export `opsDb` bị dùng sai miền dữ liệu

`src/lib/prisma.ts` vẫn default export `opsDb` để tương thích ngược. Điều này tiện cho code cũ nhưng có thể khiến module AI/Auth/Metro mới vô tình import default client và ghi sai miền dữ liệu.

Mức độ: **Trung bình - Cao**  
Ưu tiên xử lý: **Cao**

### 6.3. Rủi ro offline/mock mode khác biệt production

Hệ thống có offline/mock mode. Nếu test chủ yếu chạy bằng mock/fallback thì có thể không phát hiện lỗi thực tế khi kết nối PostgreSQL/Prisma thật.

Mức độ: **Trung bình**  
Ưu tiên xử lý: **Trung bình**

### 6.4. Rủi ro hiệu năng dashboard

Dashboard hiện lấy DNF records để truyền cho:

```text
FRACAS Phase Tracker
RAMS OCC Dashboard
Predictive RAMS Panel
```

Cách này hợp lý ở giai đoạn demo và dữ liệu vừa phải. Khi số lượng DNF lớn, cần cân nhắc:

- Phân trang/giới hạn thời gian.
- Tính summary ở server/service riêng.
- Cache summary.
- Chỉ tính Predictive RAMS theo kỳ hoặc theo batch.

Mức độ: **Trung bình**  
Ưu tiên xử lý: **Trung bình**

### 6.5. Rủi ro thiếu kiểm tra cross-database consistency

Hệ thống đã có model cho consistency logs trong AI schema. Tuy nhiên, cần bảo đảm có job thực tế kiểm tra các liên kết như:

```text
DNF.linked Hazard
Hazard.linkedDnfId
TrustGraph node sourceId
Asset/Station reference
AI verification targetId
```

Mức độ: **Cao**  
Ưu tiên xử lý: **Cao**

---

## 7. Đánh giá theo tiêu chí production readiness

| Tiêu chí | Hiện trạng | Đánh giá | Hành động đề xuất |
|---|---|---|---|
| Multi-schema Prisma | Đã có | Đạt nền tảng | Tiếp tục kiểm tra migration và import đúng client. |
| Tách client theo miền dữ liệu | Đã có `opsDb`, `aiDb`, `authDb`, `metroDb` | Đạt nền tảng | Hạn chế dần default export. |
| Timeout kết nối | Đã có connect/pool timeout và wrapper query timeout | Khá tốt | Bổ sung retry/circuit breaker có kiểm soát nếu cần. |
| AI Safety schema | Đã có `AiVerificationLog`, `AiSafetyLog`, `AiRequestLog` | Đạt | Bảo đảm service thật sự ghi log. |
| FRACAS/RAMS data link | DNF/Hazard có trường liên kết và dashboard đã dùng | Đạt nền tảng | Bổ sung test dữ liệu thật và performance test. |
| Cross-DB consistency | Có model log | Chưa đủ bằng chứng vận hành | Cần job kiểm tra định kỳ. |
| CI validation | Có `db:validate:all`, `db:generate:all`, audit scripts | Tốt | Bổ sung audit chống import sai Prisma client. |
| Runtime smoke test | Đã có | Khá | Cần mở rộng thêm các route FRACAS/Hazard/RAMS mới. |

---

## 8. Đề xuất hành động

### P1 - Bổ sung audit kiểm tra import Prisma client theo miền dữ liệu

Mục tiêu: phát hiện module AI/Auth/Metro import nhầm default Prisma client.

Yêu cầu:

```text
Module nghiệp vụ vận hành → import opsDb
Module AI/Audit/TrustGraph → import aiDb
Module auth → import authDb
Module metro/asset/spatial → import metroDb
Không dùng default import từ src/lib/prisma.ts trong module mới
```

Mức ưu tiên: **Cao**

### P2 - Bổ sung job kiểm tra cross-database consistency

Mục tiêu: kiểm tra định kỳ các liên kết giữa DNF, Hazard, AI logs, TrustGraph và Asset.

Các kiểm tra đề xuất:

```text
Hazard.linkedDnfId có tồn tại DNF tương ứng hay không
TrustGraphNode.sourceId có còn tồn tại record nguồn hay không
AiVerificationLog.targetId có liên kết được tới DNF/Hazard/Inspection hay không
Asset reference trong DNF/Hazard có khớp metroDb hay không
```

Mức ưu tiên: **Cao**

### P3 - Mở rộng smoke test cho các route nghiệp vụ mới

Bổ sung smoke test cho:

```text
/fracas-risk-management
/fracas-risk-management/shamma-benchmark
/fracas-risk-management/demo-case-study
/hazards/new?originatingDnfId=...
/dnf/[id]/create-hazard với dữ liệu seed nếu có
```

Mức ưu tiên: **Cao**

### P4 - Tối ưu Dashboard/RAMS khi dữ liệu lớn

Mục tiêu: tránh tính toán toàn bộ DNF records mỗi lần render dashboard.

Đề xuất:

```text
Tạo RAMS summary service
Cache summary theo ngày/tuần/tháng
Giới hạn số record hoặc khoảng thời gian
Tạo batch job cho Predictive RAMS
```

Mức ưu tiên: **Trung bình**

### P5 - Chuẩn hóa migration checklist

Trước mỗi migration cần có checklist:

```text
Backup
Prisma validate all
Prisma generate all
Migration dry-run nếu có
Typecheck
Smoke test
Rollback plan
```

Mức ưu tiên: **Trung bình**

---

## 9. Checklist kiểm tra nhanh

Chạy tại thư mục repo:

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

Điều kiện quan trọng: Node.js phải đúng phiên bản dự án yêu cầu trước khi build production.

---

## 10. Kết luận

Báo cáo cũ của Task 0.1 đã phản ánh đúng rủi ro ở giai đoạn đầu, nhưng hiện trạng phần mềm đã thay đổi đáng kể. Hệ thống hiện đã có kiến trúc database tách lớp rõ hơn, gồm `opsDb`, `aiDb`, `authDb`, `metroDb`; AI safety schema đã được bổ sung; DNF/Hazard/RAMS/OCC đã có chuỗi dữ liệu liên kết.

Trọng tâm tiếp theo không còn là “tách database từ đầu”, mà là **kiểm soát tính nhất quán, chống import sai client, kiểm tra migration nhiều schema và tối ưu hiệu năng dashboard/RAMS khi dữ liệu tăng**.
