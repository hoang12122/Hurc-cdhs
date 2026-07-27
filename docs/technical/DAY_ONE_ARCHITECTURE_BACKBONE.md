# THIẾT LẬP KIẾN TRÚC NGAY TỪ NGÀY ĐẦU

**Document code:** HURC-CDHS-ARCH-DAY-ONE-01  
**Phạm vi:** `frontend/`, `backend/`, `infra/`, `.claude/rules/`

## 1. Mục đích

Kiến trúc phải được thiết lập trước khi phát triển tính năng. Bốn khu vực `frontend/`, `backend/`, `infra/` và `.claude/rules/` là xương sống của dự án, giúp phân tách trách nhiệm, giới hạn phụ thuộc chéo và tạo cơ sở kiểm soát bằng CI.

Cấu trúc mục tiêu:

```text
frontend/          giao diện, trải nghiệm người dùng, client adapters
backend/           nghiệp vụ, API, service, persistence, integration contracts
infra/             hạ tầng chạy, mạng, dữ liệu, quan sát, bảo mật, DR
.claude/rules/     quy tắc bắt buộc cho AI agent và lập trình viên
```

Repository hiện có hệ thống Next.js modular monolith trong `src/` và nhiều thành phần hạ tầng trong `infra/`. Vì vậy, áp dụng mô hình chuyển tiếp có kiểm soát:

1. Không di chuyển hàng loạt mã nguồn đang vận hành chỉ để đổi tên thư mục.
2. Mọi module hoặc dịch vụ độc lập mới phải đặt trong khu vực kiến trúc tương ứng.
3. Mã cũ trong `src/` được xem là legacy-compatible app shell và phải tuân thủ cùng nguyên tắc ranh giới.
4. Việc di chuyển mã cũ được thực hiện theo từng module, có kiểm thử và rollback.

## 2. Quyền sở hữu kiến trúc

| Khu vực | Được phép chứa | Không được phép chứa |
|---|---|---|
| `frontend/` | pages, components, hooks, view-model, client API adapters, design tokens | truy cập DB, secret, private key, migration, broker admin logic |
| `backend/` | domain, application service, API, validation, persistence adapter, integration gateway | UI component, browser-only API, CSS, client secret exposure |
| `infra/` | Compose/Kubernetes/Terraform, broker, DB, PKI, network policy, observability, backup, DR | nghiệp vụ người dùng, UI, khóa production thật |
| `.claude/rules/` | quy tắc kiến trúc, bảo mật, coding, testing, release | secret, prompt chứa credential, ngoại lệ không được phê duyệt |

## 3. Hướng phụ thuộc bắt buộc

```text
frontend
   ↓ qua API/public contract
backend
   ↓ qua adapter/configuration contract
infra
```

Quy tắc:

- `frontend/` không import trực tiếp module nội bộ của `backend/`.
- `frontend/` chỉ sử dụng API client, generated contract hoặc public shared schema.
- `backend/` không import UI hoặc browser runtime.
- `infra/` không chứa logic quyết định nghiệp vụ.
- Thành phần dùng chung phải nhỏ, ổn định và có chủ sở hữu; không tạo thư mục `shared/` như nơi chứa mọi thứ.
- Giao tiếp xuyên bounded context phải qua contract, event hoặc service interface đã công bố.

## 4. Cấu trúc chuẩn

### 4.1 Frontend

```text
frontend/
  README.md
  app/
  components/
  features/
    <feature>/
      api/
      components/
      hooks/
      model/
      tests/
  design-system/
  lib/
```

### 4.2 Backend

```text
backend/
  README.md
  services/
    <service>/
      domain/
      application/
      adapters/
      api/
      tests/
  contracts/
  shared-kernel/
```

`shared-kernel/` chỉ được dùng cho kiểu dữ liệu và primitive thật sự ổn định, không được chứa nghiệp vụ của một module cụ thể.

### 4.3 Infrastructure

```text
infra/
  README.md
  environments/
    dev/
    staging/
    production/
  network/
  pki/
  data/
  observability/
  backup/
  disaster-recovery/
  services/
```

Mọi cấu hình production phải tham chiếu secret manager/KMS/HSM; không commit credential hoặc private key.

### 4.4 Claude rules

```text
.claude/rules/
  00-architecture-backbone.md
  10-security.md
  20-testing-and-ci.md
  30-release-and-evidence.md
```

Quy tắc trong thư mục này là policy-as-code dành cho AI agent và lập trình viên. Thay đổi quy tắc phải được review như thay đổi kiến trúc.

## 5. Definition of Done cho tính năng mới

Một tính năng chỉ được xem là hoàn thành khi:

1. Xác định rõ bounded context và khu vực sở hữu.
2. Không vi phạm hướng phụ thuộc.
3. Contract API/event có version và validation.
4. Có kiểm thử unit/contract/integration phù hợp.
5. Có threat consideration và không làm lộ secret.
6. Có observability: log, metric hoặc trace cần thiết.
7. Có rollback hoặc migration strategy nếu thay đổi dữ liệu.
8. Tài liệu và `.claude/rules/` được cập nhật khi kiến trúc thay đổi.
9. CI architecture gate thành công.

## 6. Ngoại lệ kiến trúc

Ngoại lệ chỉ được chấp nhận khi có Architecture Decision Record (ADR) nêu:

- vấn đề cần giải quyết;
- lựa chọn đã xem xét;
- lý do chọn ngoại lệ;
- phạm vi và thời hạn;
- rủi ro;
- kế hoạch loại bỏ technical debt;
- người phê duyệt.

Không dùng nhận xét trong mã nguồn hoặc trao đổi miệng để thay thế ADR.

## 7. Ranh giới bảo đảm

CI có thể chứng minh cấu trúc thư mục, file quy tắc và một số invariant không bị xóa hoặc suy yếu. CI không chứng minh toàn bộ thiết kế là đúng, không thay thế architecture review, kiểm thử vận hành, threat modeling hoặc phê duyệt của chủ hệ thống.
