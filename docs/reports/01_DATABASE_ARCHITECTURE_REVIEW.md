# 01 - DATABASE ARCHITECTURE REVIEW

**Mã tài liệu:** HURC-CDHS-REPORT-01  
**Tên tài liệu:** Báo cáo rà soát kiến trúc database  
**Phạm vi:** Prisma schema, Prisma Client, cấu hình kết nối, phân tách dữ liệu nghiệp vụ/AI/metro, rủi ro vận hành và production readiness.  
**Ngày cập nhật:** 2026-07-04  
**Trạng thái:** Đã chuẩn hóa tên file theo quy ước `/docs/reports`.

---

## 1. Mục tiêu rà soát

Báo cáo này rà soát cấu trúc database của phần mềm HURC CDHS sau khi hệ thống đã mở rộng các nhóm chức năng DNF, Hazard Log, FRACAS, RAMS, OCC Dashboard, AI Knowledge, TrustGraph và các lớp audit.

Việc rà soát tập trung vào 05 nội dung:

1. Xác định hiện trạng phân tách Prisma schema.
2. Kiểm tra cách khởi tạo Prisma Client theo từng miền dữ liệu.
3. Đánh giá mức độ tách biệt giữa dữ liệu nghiệp vụ, dữ liệu AI/audit, dữ liệu xác thực và dữ liệu metro.
4. Nhận diện rủi ro khi đưa hệ thống vào môi trường build, kiểm thử và production.
5. Đề xuất hành động tiếp theo theo mức ưu tiên.

---

## 2. Kết luận nhanh

Hệ thống hiện không còn ở trạng thái chỉ dùng một PrismaClient duy nhất cho toàn bộ dữ liệu. Kiến trúc đã được tách theo hướng multi-schema/multi-client, gồm:

```text
opsDb
authDb
aiDb
metroDb
```

Đây là hướng phù hợp với mô hình phần mềm đang phát triển theo các miền nghiệp vụ riêng: vận hành/bảo trì, AI/audit, xác thực/phân quyền và dữ liệu metro/tài sản.

Tuy nhiên, hệ thống vẫn cần tiếp tục kiểm soát các vấn đề chính:

- Đồng bộ migration giữa các schema.
- Chuẩn hóa fallback khi offline hoặc mock mode.
- Kiểm soát hiệu năng khi Dashboard, RAMS và Predictive RAMS đọc nhiều dữ liệu DNF.
- Kiểm tra tính nhất quán cross-database giữa DNF, Hazard, AI logs, TrustGraph và Asset.
- Bổ sung audit để tránh việc module mới import sai Prisma Client.

---

## 3. Hiện trạng Prisma schema

### 3.1. Cấu trúc schema hiện có

| Nhóm schema | Đường dẫn | Vai trò chính | Nhận xét |
|---|---|---|---|
| Legacy/Main | `prisma/schema.prisma` | Schema gốc, phục vụ tương thích ngược trong một số phần cũ. | Cần giảm phụ thuộc dần nếu module mới đã chuyển sang schema chuyên biệt. |
| Operations | `prisma/ops/schema.prisma` | DNF, Hazard, Inspection, Task, SystemLog, Corrective Action, Improvement. | Đây là schema nghiệp vụ chính của hệ thống vận hành/bảo trì. |
| AI/Audit | `prisma/ai/schema.prisma` | AI Agent, AI Knowledge, Conversation, AI Safety/Verification logs, TrustGraph, Consistency logs. | Đã có nền tảng cho AI governance và audit. |
| Auth | `prisma/auth/schema.prisma` | Người dùng, quyền, phân quyền hoặc các cấu phần xác thực. | Cần duy trì tách biệt với dữ liệu nghiệp vụ. |
| Metro | `prisma/metro/schema.prisma` | Dữ liệu metro, tài sản, hệ thống, tuyến/ga, GIS/BIM hoặc spatial reference. | Phục vụ Digital Twin, Asset 360 và Rail Network. |

### 3.2. Operations schema

`prisma/ops/schema.prisma` hiện chứa các model nghiệp vụ quan trọng:

```text
DnfDocument
CorrectiveAction
HazardRecord
InspectionDetail
Task
SystemLog
MaintenanceStandard
Improvement
```

Đây là nền tảng cho chuỗi nghiệp vụ:

```text
DNF / Incident
→ Corrective Action
→ Hazard Log
→ FRACAS Phase Tracker
→ RAMS / OCC Dashboard
```

Các trường DNF và Hazard đang hỗ trợ liên kết trực tiếp với RAMS, Predictive RAMS và DNF → Hazard workflow, gồm:

```text
DnfDocument.impactAssessment
DnfDocument.immediateAction
DnfDocument.trainServiceAffected
DnfDocument.trainWithdrawn
DnfDocument.systemRestoredTime
DnfDocument.disruptionDuration
HazardRecord.linkedDnfId
HazardRecord.potentialConsequence
HazardRecord.currentControls
HazardRecord.proposedActions
```

### 3.3. AI schema

`prisma/ai/schema.prisma` đã có các nhóm model quan trọng:

```text
AiAgent
AiKnowledgeSnippet
AiConversation
AiConversationMessage
AiInsight
AiSyncLog
TrustGraphSyncLog
AiVerificationLog
AiSafetyLog
AiRequestLog
TrustGraphNode
TrustGraphEdge
AuditConsistencyCheckLog
GraphConsistencyLog
```

Như vậy, nhận định cũ rằng hệ thống thiếu `AIVerificationLog` hoặc `AISafetyLog` hiện không còn đúng. Các model này đã có và cần được duy trì như lớp bằng chứng kiểm soát khi AI đưa ra khuyến nghị liên quan an toàn.

---

## 4. Hiện trạng Prisma Client và kết nối database

### 4.1. Prisma client entrypoint

File `src/lib/prisma.ts` đóng vai trò entrypoint trung tâm và export các client:

```text
opsDb
authDb
aiDb
metroDb
```

Default export hiện đang map về `opsDb` để tương thích ngược với code cũ. Cách này giúp không làm vỡ các module cũ, nhưng cũng tạo rủi ro module mới import nhầm default client.

### 4.2. Operations database client

`src/lib/db/ops-db.ts` khởi tạo PrismaClient riêng từ runtime client `.prisma-runtime/ops`, dùng `OPS_DATABASE_URL` hoặc fallback từ `DB_CONFIG.postgres.opsUrl`.

Các điểm đã có:

- Singleton qua `globalForOps`.
- Tự thêm `connect_timeout` và `pool_timeout` vào URL.
- Có log lỗi/warn trong môi trường development.
- Có hàm `checkOpsDbHealth()`.

### 4.3. AI database client

`src/lib/db/ai-db.ts` khởi tạo PrismaClient riêng từ runtime client `.prisma-runtime/ai`, dùng `AI_DATABASE_URL` hoặc fallback từ `DB_CONFIG.postgres.aiUrl`.

Các điểm đã có:

- Singleton qua `globalForAi`.
- Tự thêm `connect_timeout` và `pool_timeout` riêng cho AI database.
- Có hàm `checkAiDbHealth()`.
- Đúng định hướng tách AI/Audit logs khỏi dữ liệu vận hành.

### 4.4. Timeout và resiliency

`src/lib/config/db-config.ts` đã có nhóm cấu hình resiliency cho `ops` và `ai`, gồm các thông số như `connectTimeout`, `queryTimeout`, `poolTimeout`, `maxRetries`.

Ngoài ra, `src/lib/prisma.ts` có `runPrismaWithTimeout()` để giới hạn thời gian chờ truy vấn. Đây là điểm tích cực đối với môi trường có khả năng mất kết nối hoặc chạy thử nghiệm tại hiện trường.

---

## 5. Phân loại dữ liệu theo miền nghiệp vụ

| Miền dữ liệu | Client khuyến nghị | Nhóm dữ liệu |
|---|---|---|
| Vận hành/bảo trì | `opsDb` | DNF, Corrective Action, Hazard Log, Inspection, Task, Improvement, SystemLog nghiệp vụ, Maintenance Standard, Notification, Comment. |
| AI/audit/TrustGraph | `aiDb` | AI Agent, AI Knowledge, AI Conversation, AI Verification Log, AI Safety Log, AI Request Log, AI Insight, TrustGraph Node/Edge, Consistency Check Logs. |
| Xác thực/phân quyền | `authDb` | User, Role, Permission, Session/Auth data, organizational scope nếu có. |
| Metro/tài sản/hạ tầng | `metroDb` | Station, Line, Asset, System, Subsystem, GIS/BIM/Spatial reference, Rail Network data. |

Nguyên tắc chính: module thuộc miền dữ liệu nào thì phải import đúng client của miền đó. Không dùng default import từ `src/lib/prisma.ts` cho module mới nếu module đó thuộc AI, Auth hoặc Metro.

---

## 6. Rủi ro còn tồn tại

| Nhóm rủi ro | Hiện trạng | Mức ưu tiên | Việc cần làm |
|---|---|---|---|
| Migration lệch giữa các schema | Multi-schema đã có nhưng migration có thể không đồng bộ. | Cao | Chạy `db:validate:all`, `db:generate:all`, migration dry-run và rollback checklist. |
| Default export `opsDb` bị dùng sai | Default export tiện cho code cũ nhưng dễ bị module mới import nhầm. | Cao | Bổ sung audit chống import sai Prisma client theo miền dữ liệu. |
| Offline/mock khác production | Mock/fallback có thể che lỗi kết nối thật. | Trung bình | Chạy test với PostgreSQL/Prisma thật trước nghiệm thu. |
| Dashboard/RAMS đọc nhiều DNF | Dữ liệu lớn có thể làm chậm dashboard. | Trung bình | Tạo summary service, cache, phân trang hoặc batch job. |
| Cross-database consistency | Có model log nhưng cần job kiểm tra thực tế. | Cao | Kiểm tra DNF-Hazard-TrustGraph-AI-Asset định kỳ. |

---

## 7. Đánh giá production readiness

| Tiêu chí | Hiện trạng | Đánh giá | Hành động đề xuất |
|---|---|---|---|
| Multi-schema Prisma | Đã có | Đạt nền tảng | Tiếp tục kiểm tra migration và import đúng client. |
| Tách client theo miền dữ liệu | Đã có `opsDb`, `aiDb`, `authDb`, `metroDb` | Đạt nền tảng | Hạn chế dần default export. |
| Timeout kết nối | Đã có connect/pool timeout và wrapper query timeout | Khá tốt | Bổ sung retry/circuit breaker nếu cần. |
| AI Safety schema | Đã có `AiVerificationLog`, `AiSafetyLog`, `AiRequestLog` | Đạt | Bảo đảm service thật sự ghi log. |
| FRACAS/RAMS data link | DNF/Hazard có trường liên kết và dashboard đã dùng | Đạt nền tảng | Bổ sung test dữ liệu thật và performance test. |
| Cross-DB consistency | Có model log | Cần kiểm chứng | Cần job kiểm tra định kỳ. |
| CI validation | Có `db:validate:all`, `db:generate:all`, audit scripts | Tốt | Bổ sung audit chống import sai Prisma client. |
| Runtime smoke test | Đã có | Khá | Mở rộng thêm các route FRACAS/Hazard/RAMS mới. |

---

## 8. Đề xuất hành động

### 8.1. P1 - Bổ sung audit kiểm tra import Prisma Client

Mục tiêu: phát hiện module AI/Auth/Metro import nhầm default Prisma client.

Quy tắc kiểm tra:

```text
Module vận hành/bảo trì → import opsDb
Module AI/audit/TrustGraph → import aiDb
Module auth → import authDb
Module metro/asset/spatial → import metroDb
Module mới không dùng default import từ src/lib/prisma.ts
```

### 8.2. P2 - Bổ sung job kiểm tra cross-database consistency

Các kiểm tra đề xuất:

```text
Hazard.linkedDnfId có tồn tại DNF tương ứng hay không
TrustGraphNode.sourceId có còn tồn tại record nguồn hay không
AiVerificationLog.targetId có liên kết được tới DNF/Hazard/Inspection hay không
Asset reference trong DNF/Hazard có khớp metroDb hay không
```

### 8.3. P3 - Mở rộng smoke test route nghiệp vụ

Các route cần bổ sung:

```text
/fracas-risk-management
/fracas-risk-management/shamma-benchmark
/fracas-risk-management/demo-case-study
/hazards/new?originatingDnfId=...
/dnf/[id]/create-hazard với dữ liệu seed nếu có
```

### 8.4. P4 - Tối ưu Dashboard/RAMS khi dữ liệu lớn

Đề xuất:

```text
Tạo RAMS summary service
Cache summary theo ngày/tuần/tháng
Giới hạn số record hoặc khoảng thời gian
Tạo batch job cho Predictive RAMS
```

### 8.5. P5 - Chuẩn hóa migration checklist

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

---

## 9. Checklist kiểm tra nhanh

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

Điều kiện quan trọng: Node.js phải đúng phiên bản dự án yêu cầu trước khi build production.

---

## 10. Kết luận

Báo cáo database hiện được chuẩn hóa theo tên file `01_DATABASE_ARCHITECTURE_REVIEW.md` để hiển thị thống nhất trên cây thư mục GitHub.

Về nội dung kỹ thuật, hệ thống đã có kiến trúc database tách lớp rõ hơn, gồm `opsDb`, `aiDb`, `authDb`, `metroDb`; AI safety schema đã được bổ sung; DNF/Hazard/RAMS/OCC đã có chuỗi dữ liệu liên kết.

Trọng tâm tiếp theo là kiểm soát tính nhất quán, chống import sai client, kiểm tra migration nhiều schema và tối ưu hiệu năng Dashboard/RAMS khi dữ liệu tăng.
