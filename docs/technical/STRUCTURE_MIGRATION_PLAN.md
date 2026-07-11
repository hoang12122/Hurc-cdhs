# STRUCTURE MIGRATION PLAN

**Mã tài liệu:** HURC-CDHS-TECH-MIGRATION-01  
**Tên tài liệu:** Kế hoạch sắp xếp lại thư mục phần mềm theo commit b7ec63d9  
**Commit nền:** `b7ec63d9ed57e4d9525bf34c433d4f73c77971d0`  
**Nhánh thực hiện:** `refactor/project-structure-from-b7ec63`  
**Merge commit:** `0317ec84cf54aff768f001ebb41252a1aedbef94`  
**Trạng thái:** Đợt 1 đã merge vào `main`; đã ghi nhận bản vá ESLint v9 runner compatibility  

---

## 1. Mục tiêu

Tài liệu này quy định cách sắp xếp lại thư mục phần mềm HURC1 CRM theo định hướng đã nêu trong `PROJECT_STRUCTURE_GUIDE.md`.

Mục tiêu chính:

1. Chuẩn hóa cấu trúc theo nghiệp vụ, ưu tiên package-by-feature.
2. Tách rõ phần dùng chung, phần theo domain, phần route/page và phần tài liệu.
3. Hạn chế rủi ro vỡ import, vỡ route Next.js, lỗi Docker build hoặc lỗi CI/CD.
4. Tạo lộ trình migration từng bước, có kiểm thử sau mỗi bước.

---

## 2. Nguyên tắc thực hiện

Không di chuyển toàn bộ mã nguồn trong một commit lớn. Mọi thay đổi cấu trúc phải đi theo nguyên tắc:

```text
Tạo khung thư mục chuẩn
→ bổ sung README/contract cho từng nhóm
→ di chuyển từng module độc lập
→ cập nhật import path
→ chạy typecheck/lint/build
→ chạy Docker/smoke test
→ mới merge vào main
```

Lý do: HURC1 CRM đang dùng Next.js App Router, Prisma runtime alias, Docker standalone output và CI/CD nhiều gate. Việc di chuyển file hàng loạt nếu chưa có test bảo vệ có thể làm hỏng build hoặc runtime.

---

## 3. Cấu trúc mục tiêu

```text
src/
├── app/
│   ├── (app)/
│   └── api/
├── features/
│   ├── dnf/
│   ├── hazards/
│   ├── inspections/
│   ├── tasks/
│   ├── asset-360/
│   ├── rail-network/
│   ├── spatial-twin/
│   └── ai-lab/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── utils/
├── domains/
│   ├── fracas/
│   ├── rams/
│   ├── assets/
│   ├── inventory/
│   ├── maximo/
│   ├── camera/
│   └── gis-bim/
├── lib/
│   ├── actions/
│   ├── services/
│   ├── integrations/
│   ├── mfe/
│   ├── config/
│   └── utils/
├── components/
├── hooks/
├── types/
└── scripts/
```

---

## 4. Phân loại thư mục

| Thư mục | Vai trò |
|---|---|
| `src/app/` | Route, page, layout, API route của Next.js. Không chứa logic nghiệp vụ phức tạp. |
| `src/features/` | Tập trung UI, hook, action, type theo từng phân hệ nghiệp vụ. |
| `src/shared/` | Thành phần dùng chung toàn hệ thống. |
| `src/domains/` | Logic nghiệp vụ thuần theo domain, ít phụ thuộc UI. |
| `src/lib/actions/` | Server actions hoặc action gọi từ UI. |
| `src/lib/services/` | Service dùng lại giữa nhiều module. |
| `src/lib/integrations/` | Kết nối bên ngoài như Maximo, camera, email, AI provider. |
| `src/lib/mfe/` | Module registry, module boundary, micro-frontend-ready contract. |
| `docs/technical/` | Tài liệu kỹ thuật, cấu trúc, API, bảo mật, database. |
| `docs/operations/` | Tài liệu vận hành, triển khai, rollback, troubleshooting. |
| `docs/reports/` | Báo cáo rà soát, readiness, benchmark, checklist nghiệm thu. |

---

## 5. Đợt migration đề xuất

### Đợt 1 - Tạo khung thư mục và tài liệu chỉ mục

Trạng thái: đã merge vào `main` thông qua PR #29. Đợt này chỉ tạo khung thư mục và tài liệu chỉ mục, chưa di chuyển mã nguồn runtime hàng loạt.

Mục tiêu:

1. Tạo README cho `src/features`, `src/shared`, `src/domains`.
2. Tạo README cho từng phân hệ nghiệp vụ chính.
3. Tạo README cho nhóm tài liệu kỹ thuật.
4. Chưa di chuyển file chức năng đang chạy.

### Đợt 2 - Di chuyển module ít rủi ro

Mục tiêu:

1. Di chuyển component/module không ảnh hưởng route trực tiếp.
2. Cập nhật import path.
3. Chạy `npm run typecheck`, `npm run lint`, `npm run build`.

### Đợt 3 - Di chuyển logic domain

Mục tiêu:

1. Tách FRACAS/RAMS/Asset/GIS-BIM vào `src/domains`.
2. Tách integration như Maximo, camera, email vào `src/lib/integrations`.
3. Giữ API route và page ở `src/app`.

### Đợt 4 - Chuẩn hóa backend Go nếu phát sinh

Nếu sau này tách backend Go, tạo repo/module riêng theo cấu trúc:

```text
cmd/
internal/
api/
configs/
scripts/
test/
```

Không đưa Go backend vào Next.js app nếu chưa có kiến trúc triển khai riêng.

---

## 6. CI/CD follow-up

Sau khi merge PR #29, Security Gate và Ironclad Pipeline đã từng dừng ở bước lint do runner gọi trực tiếp subpath `eslint/bin/eslint.js`, không còn được ESLint v9 export. Bản vá mới chuyển `scripts/run-eslint.js` sang gọi executable tại `node_modules/.bin/eslint`, đồng thời vẫn giữ `ESLINT_USE_FLAT_CONFIG=false` để tương thích `.eslintrc.json`.

---

## 7. Checklist trước khi merge

| STT | Nội dung kiểm tra | Trạng thái |
|---|---|---|
| 1 | Branch tạo từ đúng commit `b7ec63d9`. | Done |
| 2 | Có khung thư mục chuẩn. | Done |
| 3 | Có README mô tả trách nhiệm từng thư mục. | Done |
| 4 | Không di chuyển hàng loạt file runtime khi chưa test. | Done |
| 5 | `npm install --include=dev --ignore-scripts` PASS. | Pending |
| 6 | `npm run typecheck` PASS. | Pending |
| 7 | `npm run lint` PASS. | Pending |
| 8 | `npm run build` PASS. | Pending |
| 9 | Docker Acceptance Gate PASS nếu ảnh hưởng Docker. | Pending |
| 10 | Smoke test `/api/health` PASS. | Pending |

---

## 8. Kết luận

Đợt 1 đã hoàn tất việc tạo khung thư mục và tài liệu chỉ mục trên `main`. Việc di chuyển mã nguồn thực tế cần thực hiện theo các đợt tiếp theo, sau khi có danh sách file, cập nhật import path và CI/CD bảo vệ. Đây là hướng an toàn để chuẩn hóa cấu trúc mà không làm hỏng build hiện tại.
