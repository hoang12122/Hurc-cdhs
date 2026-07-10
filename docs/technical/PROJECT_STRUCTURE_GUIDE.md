# PROJECT STRUCTURE GUIDE

**Mã tài liệu:** HURC-CDHS-TECH-STRUCTURE-01  
**Tên tài liệu:** Quy chuẩn cấu trúc dự án Frontend và Backend  
**Phạm vi áp dụng:** Mã nguồn HURC1 CRM và các module mở rộng liên quan  
**Đối tượng sử dụng:** Lập trình viên, kỹ sư hệ thống, DevOps, người rà soát kiến trúc  
**Trạng thái:** Quy chuẩn tham chiếu khi phát triển và tái cấu trúc  

---

## 1. Mục đích

Tài liệu này quy định định hướng sắp xếp thư mục cho các dự án Frontend và Backend liên quan đến HURC1 CRM, nhằm bảo đảm mã nguồn dễ đọc, dễ mở rộng, dễ kiểm thử và không bị trộn lẫn trách nhiệm giữa các lớp.

Nội dung áp dụng theo nguyên tắc:

1. Frontend ưu tiên tổ chức theo tính năng nghiệp vụ.
2. Backend ưu tiên tổ chức rõ entry point, internal package, service, repository và API contract.
3. Không chia thư mục quá sâu nếu chưa có nhu cầu thực tế.
4. Không di chuyển hàng loạt mã nguồn đang hoạt động nếu chưa có kế hoạch migration và kiểm thử CI/CD.

---

## 2. Nguyên tắc chung

| Nguyên tắc | Nội dung áp dụng |
|---|---|
| Nhóm theo nghiệp vụ | Các phần liên quan đến một tính năng nên nằm gần nhau để dễ thêm, sửa, xóa. |
| Không chia quá sâu | Cấu trúc thư mục nên giữ ở mức 3 đến 4 cấp chính, tránh phân mảnh quá mức. |
| Đặt tên nhất quán | Dùng một chuẩn tên ổn định cho thư mục và file. |
| Bắt đầu đơn giản | Dự án nhỏ không cần tách quá nhiều lớp ngay từ đầu. |
| Tách phần dùng chung | Component, hook, util, type, service dùng chung phải đặt ở khu vực shared/common. |
| Không trộn trách nhiệm | UI không chứa trực tiếp logic database; service không chứa component; repository không xử lý giao diện. |
| Có bằng chứng kiểm thử | Mọi thay đổi cấu trúc phải đi kèm typecheck, lint, build và smoke test. |

---

## 3. Cấu trúc khuyến nghị cho Frontend React

Đối với React, nên ưu tiên mô hình **Package-by-Feature** thay vì chỉ nhóm theo loại file. Cách này giúp mỗi tính năng có đủ component, hook, API và type riêng, hạn chế ảnh hưởng dây chuyền khi chỉnh sửa.

### 3.1. Cấu trúc tham chiếu cho React/Vite

```text
my-project/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   └── products/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── api/
│   │       ├── types/
│   │       └── index.ts
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
└── vite.config.ts
```

### 3.2. Ý nghĩa từng thư mục Frontend

| Thư mục | Mục đích |
|---|---|
| `public/` | File tĩnh không cần bundle, ví dụ favicon, manifest, file public. |
| `src/assets/` | Hình ảnh, font, icon dùng trong ứng dụng. |
| `src/components/` | UI component dùng chung như Button, Modal, Input, Table. |
| `src/features/` | Nơi chứa logic và UI theo từng nghiệp vụ/tính năng. |
| `src/features/<feature>/components/` | Component chỉ dùng trong tính năng đó. |
| `src/features/<feature>/hooks/` | Hook riêng của tính năng. |
| `src/features/<feature>/api/` | Hàm gọi API hoặc action liên quan tính năng. |
| `src/features/<feature>/types/` | TypeScript type/interface riêng của tính năng. |
| `src/hooks/` | Custom hook dùng chung toàn app. |
| `src/layouts/` | Khung trang như App Shell, Header, Sidebar, Footer. |
| `src/pages/` | Trang chính nếu dùng React Router hoặc framework kiểu page-based. |
| `src/services/` | API client, HTTP client, auth client, config service. |
| `src/store/` | Global state như Redux, Zustand, Context. |
| `src/styles/` | CSS, Tailwind, theme, token giao diện. |
| `src/types/` | Type dùng chung toàn hệ thống. |
| `src/utils/` | Hàm tiện ích như format date, validate, parse. |

---

## 4. Áp dụng cho HURC1 CRM hiện tại

HURC1 CRM đang dùng Next.js App Router, nên không áp dụng máy móc cấu trúc Vite/React thuần. Tuy nhiên, nguyên tắc **Package-by-Feature** vẫn cần được duy trì thông qua route group, module registry, component theo nghiệp vụ và service theo domain.

### 4.1. Cấu trúc Next.js khuyến nghị

```text
src/
├── app/
│   ├── (app)/
│   │   ├── dashboard/
│   │   ├── dnf/
│   │   ├── hazards/
│   │   ├── inspections/
│   │   ├── tasks/
│   │   ├── asset-360/
│   │   ├── rail-network/
│   │   ├── spatial-twin/
│   │   └── ai-lab/
│   └── api/
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── dnf/
│   ├── hazards/
│   ├── inspections/
│   ├── asset-360/
│   ├── rams/
│   └── layout/
├── lib/
│   ├── actions/
│   ├── services/
│   ├── rams/
│   ├── fracas/
│   ├── integrations/
│   ├── mfe/
│   ├── config/
│   ├── i18n/
│   └── utils/
├── hooks/
├── types/
└── scripts/
```

### 4.2. Quy tắc áp dụng cho HURC1 CRM

| Nhóm | Quy tắc |
|---|---|
| `src/app/(app)/<module>/` | Chỉ chứa route, page, layout và wiring của module. |
| `src/components/<module>/` | Chứa component UI riêng của module. |
| `src/lib/<domain>/` | Chứa logic nghiệp vụ, engine, mapper, service hoặc helper theo domain. |
| `src/lib/actions/` | Chứa server actions hoặc action gọi từ UI. |
| `src/lib/services/` | Chứa service dùng lại giữa nhiều module. |
| `src/lib/mfe/` | Chứa module registry, module contract và boundary. |
| `src/types/` | Chứa type dùng chung nhiều module. |
| `src/hooks/` | Chứa hook dùng chung nhiều module. |

Không đưa logic nghiệp vụ phức tạp trực tiếp vào `page.tsx`. Trang chỉ nên gọi component hoặc action đã tách riêng.

---

## 5. Cấu trúc khuyến nghị cho Backend Golang

Đối với Go, có thể tham khảo mô hình **Standard Go Project Layout**. Mục tiêu là tách rõ entry point, mã nguồn nội bộ, tài liệu API, cấu hình, script và test.

### 5.1. Cấu trúc tham chiếu

```text
my-api/
├── api/
│   ├── openapi.yaml
│   └── swagger.json
├── cmd/
│   ├── server/
│   │   └── main.go
│   └── cli/
│       └── main.go
├── configs/
│   ├── config.example.yaml
│   └── config.local.yaml
├── internal/
│   ├── handlers/
│   ├── models/
│   ├── repository/
│   ├── services/
│   ├── routes/
│   ├── middleware/
│   └── config/
├── pkg/
├── scripts/
├── test/
├── go.mod
├── go.sum
└── Makefile
```

### 5.2. Ý nghĩa từng thư mục Backend Go

| Thư mục | Mục đích |
|---|---|
| `api/` | OpenAPI/Swagger, schema API, tài liệu contract với frontend. |
| `cmd/` | Điểm khởi chạy ứng dụng. Mỗi ứng dụng có một thư mục riêng. |
| `cmd/server/main.go` | Entry point của HTTP/API server. |
| `cmd/cli/main.go` | Entry point cho công cụ CLI nếu có. |
| `configs/` | File cấu hình mẫu hoặc cấu hình theo môi trường. |
| `internal/` | Mã nguồn nội bộ, không cho package bên ngoài import trực tiếp. |
| `internal/handlers/` | Xử lý HTTP request/response, tương đương controller. |
| `internal/models/` | Struct dữ liệu, DTO, domain model. |
| `internal/repository/` | Tương tác database hoặc external storage. |
| `internal/services/` | Logic nghiệp vụ. |
| `internal/routes/` | Khai báo route và binding handler. |
| `internal/middleware/` | Auth, logging, rate limit, recovery. |
| `pkg/` | Thư viện có thể dùng lại bởi dự án khác. Chỉ đưa vào đây khi thực sự cần public. |
| `scripts/` | Script build, deploy, migrate, seed data. |
| `test/` | Test tích hợp, test dữ liệu, fixture, e2e. |
| `Makefile` | Lệnh chuẩn hóa build/test/lint/run. |

---

## 6. Backend Go nếu mở rộng cho HURC1 CRM

Nếu HURC1 CRM sau này tách một backend Go riêng cho API, ingest dữ liệu, camera feed, Maximo integration hoặc job xử lý nền, cấu trúc đề xuất là:

```text
hurc-crm-api/
├── api/
│   ├── openapi.yaml
│   └── schemas/
├── cmd/
│   ├── server/
│   │   └── main.go
│   ├── worker/
│   │   └── main.go
│   └── importer/
│       └── main.go
├── configs/
├── internal/
│   ├── auth/
│   ├── dnf/
│   ├── hazards/
│   ├── assets/
│   ├── inventory/
│   ├── maximo/
│   ├── camera/
│   ├── rams/
│   ├── ai/
│   ├── repository/
│   ├── middleware/
│   └── routes/
├── pkg/
│   └── metrotypes/
├── scripts/
├── test/
├── go.mod
└── Makefile
```

### 6.1. Quy tắc tách domain trong Go

| Domain | Nội dung |
|---|---|
| `internal/dnf/` | Xử lý sự cố, DNF workflow, RCA, closure. |
| `internal/hazards/` | Hazard Log, risk matrix, mitigation. |
| `internal/assets/` | Asset 360, asset health, lifecycle. |
| `internal/inventory/` | Vật tư, tồn kho, kho/ngăn, nhà cung cấp. |
| `internal/maximo/` | Mapping/import dữ liệu Maximo. |
| `internal/camera/` | Camera registry, RTSP/ONVIF metadata, stream health. |
| `internal/rams/` | RAMS, MTBF, MTTR, availability, hotspot. |
| `internal/ai/` | AI request orchestration, agent result, permission-scoped context. |

---

## 7. Quy tắc đặt tên

| Thành phần | Quy chuẩn khuyến nghị | Ví dụ |
|---|---|---|
| Thư mục frontend | kebab-case hoặc domain-name rõ nghĩa | `asset-360`, `rail-network`, `spatial-twin` |
| React component | PascalCase | `AssetHealthPanel.tsx` |
| React hook | camelCase, bắt đầu bằng `use` | `useAssetHealth.ts` |
| TypeScript type/interface | PascalCase | `AssetHealthScore` |
| Service/action | camelCase hoặc kebab-case theo chuẩn repo | `assetHealthService.ts` |
| Go package | chữ thường, ngắn gọn | `dnf`, `hazards`, `assets` |
| Go file | snake_case hoặc tên ngắn theo package | `asset_service.go`, `handler.go` |
| API route | kebab-case, số nhiều nếu là resource | `/api/assets`, `/api/hazards` |

Nguyên tắc quan trọng là thống nhất trong cùng repo. Không trộn nhiều kiểu đặt tên nếu không có lý do kỹ thuật.

---

## 8. Quy tắc không chia quá sâu

Không nên tạo cấu trúc quá sâu như:

```text
src/features/dnf/components/forms/sections/fields/input/...
```

Nên giữ ở mức dễ đọc:

```text
src/components/dnf/DnfForm.tsx
src/components/dnf/DnfEvidenceUploader.tsx
src/lib/dnf/dnf-classification.ts
src/lib/dnf/dnf-workflow.ts
```

Nếu một thư mục có quá nhiều file, chỉ tách tiếp khi có nhóm trách nhiệm rõ ràng.

---

## 9. Quy trình khi tái cấu trúc

Khi cần thay đổi cấu trúc dự án, thực hiện theo thứ tự:

```text
1. Xác định phạm vi module bị ảnh hưởng.
2. Tạo danh sách file cần di chuyển.
3. Cập nhật import path và alias.
4. Cập nhật tài liệu liên quan.
5. Chạy typecheck.
6. Chạy lint.
7. Chạy production build.
8. Chạy Docker build nếu ảnh hưởng deploy.
9. Chạy smoke test các route chính.
10. Chỉ merge/đưa lên main khi CI/CD đạt.
```

Không di chuyển toàn bộ cây thư mục nếu chưa có test bảo vệ, vì dễ gây lỗi import, route, dynamic import, alias hoặc Docker COPY.

---

## 10. Checklist kiểm tra cấu trúc dự án

| STT | Nội dung kiểm tra | Đạt/Không đạt |
|---|---|---|
| 1 | Tính năng mới có thư mục/domain rõ ràng. |  |
| 2 | Component dùng chung không nằm trong thư mục tính năng riêng. |  |
| 3 | Logic nghiệp vụ không viết trực tiếp trong page component. |  |
| 4 | API/service tách khỏi UI. |  |
| 5 | Type dùng chung được đặt ở khu vực shared/types. |  |
| 6 | Không có thư mục sâu quá 4 cấp nếu không cần thiết. |  |
| 7 | Tên file/thư mục thống nhất. |  |
| 8 | Không hard-code secret hoặc config môi trường. |  |
| 9 | Typecheck PASS sau khi đổi cấu trúc. |  |
| 10 | Lint PASS sau khi đổi cấu trúc. |  |
| 11 | Build PASS sau khi đổi cấu trúc. |  |
| 12 | Docker/smoke test PASS nếu ảnh hưởng deploy. |  |

---

## 11. Kết luận

Đối với HURC1 CRM, cấu trúc dự án phải ưu tiên khả năng bảo trì dài hạn, rõ ràng theo nghiệp vụ đường sắt đô thị và dễ kiểm soát CI/CD. Frontend nên đi theo hướng package-by-feature hoặc domain-by-feature trong khuôn khổ Next.js App Router. Nếu phát sinh backend Go riêng, nên áp dụng cấu trúc `cmd/`, `internal/`, `api/`, `configs/`, `scripts/` và `test/` để tách rõ điểm khởi chạy, logic nội bộ, API contract và kiểm thử.

Mọi thay đổi cấu trúc phải được kiểm tra bằng typecheck, lint, build và smoke test trước khi kết luận đạt.
