# Báo cáo kiểm tra tính liên kết phần mềm

## 1. Phạm vi kiểm tra

Báo cáo này kiểm tra tính liên kết giữa các thành phần chính của phần mềm HURC No.1 CDHS sau khi bổ sung các tính năng AI Hazard Flow và RAMS OCC Dashboard.

Phạm vi gồm:

- Báo cáo sự cố/DNF.
- Hazard Log và AI đánh giá nhanh Hazard.
- RAMS quick calculation.
- Dashboard OCC.
- Tài liệu nghiệp vụ.
- CI/Acceptance Gate.

## 2. Kết quả kiểm tra liên kết chính

| Nhóm | Thành phần nguồn | Thành phần đích | Tình trạng |
|---|---|---|---|
| DNF | `src/components/dnf/dnf-form.tsx` | `assessHazardFlow()` | Đã liên kết |
| Hazard Log | `src/components/hazards/hazard-form.tsx` | `assessHazardFlow()` | Đã liên kết |
| AI Hazard Flow | `src/lib/hazards/hazard-ai-flow-assessment.ts` | DNF Form, Hazard Form | Đã liên kết |
| RAMS Engine | `src/lib/rams/rams-risk-engine.ts` | `calculateRamsQuickSummary()` | Đã liên kết |
| RAMS Export | `src/lib/rams/index.ts` | Dashboard import | Đã liên kết |
| OCC Dashboard | `src/components/rams/rams-occ-dashboard-panel.tsx` | RAMS Engine | Đã liên kết |
| Dashboard Route | `src/app/(app)/dashboard/layout.tsx` | RAMS OCC Panel | Đã liên kết |
| DNF Data Source | `src/lib/actions/dnf.actions.ts` | Dashboard Layout | Đã liên kết |
| RAMS Documentation | `docs/risk_management_rams_occ_highlight.md` | RAMS Engine/OCC Dashboard | Đã cập nhật |
| Hazard AI Documentation | `docs/hazard_ai_flow_assessment.md` | Hazard AI Flow | Đã cập nhật |
| CI Gate | `.github/workflows/security-and-acceptance.yml` | `npm run audit:linkage` | Đã liên kết |

## 3. Audit tự động đã bổ sung

File mới:

```text
scripts/audit-software-linkage.js
```

Script này kiểm tra tự động các marker liên kết quan trọng giữa:

```text
DNF Form
Hazard Form
Hazard AI Flow Service
RAMS Engine
RAMS OCC Dashboard Panel
Dashboard Layout
DNF Actions
Tài liệu Hazard AI
Tài liệu RAMS OCC
```

Lệnh chạy:

```bash
npm run audit:linkage
```

## 4. Tích hợp vào CI/Acceptance Gate

Đã bổ sung bước sau vào workflow:

```text
Software linkage audit
```

Workflow sẽ chạy:

```bash
npm run audit:linkage
```

Việc này giúp phát hiện sớm nếu sau này có người xóa/sửa làm đứt liên kết giữa DNF, Hazard, RAMS và Dashboard OCC.

## 5. Kết luận kiểm tra

Tính liên kết phần mềm ở mức mã nguồn đã được rà soát và bổ sung lớp kiểm soát tự động. Các nhóm chức năng mới hiện đã có liên kết tương đối đầy đủ:

- DNF có thể gọi AI đánh giá nhanh liên quan Hazard.
- Hazard Form có thể gọi AI đánh giá nhanh Hazard Log.
- RAMS Engine nhận dữ liệu DNF để tính Service Impact, MTTR, RAMS Total.
- Dashboard OCC hiển thị RAMS Total Trending, RAMS Hotspot và OCC Highlights.
- CI có thêm audit để kiểm tra tính liên kết khi push/pull request.

## 6. Lưu ý cần kiểm chứng tại máy build

Do kiểm tra trên GitHub là kiểm tra tĩnh theo mã nguồn, cần chạy thêm tại môi trường local/CI để xác nhận runtime:

```bash
git pull origin master
rm -f tsconfig.tsbuildinfo
npm run audit:linkage
npm run typecheck
npm run lint
npm run build
```

Điều kiện quan trọng: Node.js phải đúng phiên bản dự án yêu cầu trước khi build.
