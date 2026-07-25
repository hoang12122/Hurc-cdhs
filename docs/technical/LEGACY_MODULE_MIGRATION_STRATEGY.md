# CHIẾN LƯỢC CHUYỂN TIẾP MODULE SIÊU AN TOÀN

**Document code:** HURC-CDHS-ARCH-MIGRATION-01  
**Áp dụng:** mọi module mới và toàn bộ mã legacy trong `src/`

## 1. Nguyên tắc cốt lõi

Chiến lược áp dụng mô hình strangler migration có kiểm soát. Không big-bang rewrite, không di chuyển hàng loạt, không thay đổi đồng thời kiến trúc, dữ liệu và hành vi nghiệp vụ.

Mục tiêu:

- module mới tuân theo backbone ngay lập tức;
- mã cũ được chuyển từng lát dọc nhỏ;
- mỗi lát chuyển có kiểm thử, feature flag, số liệu quan sát và rollback;
- trạng thái hệ thống luôn có thể quay về phiên bản ổn định trước đó.

## 2. Phân loại module

Mỗi module phải được ghi vào migration registry với một trong các trạng thái:

- `legacy`: còn ở cấu trúc cũ, chưa cô lập đầy đủ;
- `isolated`: đã có boundary và contract rõ ràng;
- `shadow`: code mới chạy song song nhưng chưa nhận traffic chính;
- `canary`: nhận một phần traffic hoặc người dùng thử nghiệm;
- `migrated`: code mới là đường chính, code cũ còn giữ để rollback;
- `retired`: code cũ đã loại bỏ sau thời gian ổn định được phê duyệt.

## 3. Luồng chuyển tiếp bắt buộc

```text
inventory
→ dependency map
→ contract freeze
→ characterization tests
→ adapter/facade
→ shadow execution
→ canary release
→ monitored cutover
→ rollback window
→ legacy retirement
```

Không được bỏ qua `characterization tests`, `shadow execution` hoặc `rollback window` đối với module ảnh hưởng dữ liệu, quyền truy cập, tích hợp ngoài hoặc vận hành hiện trường.

## 4. Module mới

Module mới phải:

1. đặt mã theo `frontend/`, `backend/`, `infra/`;
2. có public contract versioned;
3. không import trực tiếp implementation legacy;
4. dùng adapter tương thích nếu phải gọi mã cũ;
5. có unit, contract và integration test;
6. có feature flag mặc định tắt tại production;
7. có owner, runbook và rollback procedure;
8. vượt qua architecture gate trước merge.

## 5. Chuyển mã cũ theo lát dọc

Mỗi đợt chỉ chuyển một use case hoặc workflow hoàn chỉnh, ví dụ:

```text
UI action
→ API contract
→ application service
→ persistence/integration adapter
→ observability
```

Không chuyển đồng thời nhiều bounded context trong một PR. Mỗi PR migration phải nhỏ, có thể review và có thể revert độc lập.

## 6. Contract freeze và compatibility

Trước khi chuyển:

- chụp lại request/response/event schema hiện hành;
- tạo golden fixtures cho các tình huống chính và biên;
- khóa semantic contract trong thời gian migration;
- bổ sung adapter nếu code mới khác cấu trúc nội bộ;
- chỉ thay đổi contract công khai qua version mới và kế hoạch deprecation.

## 7. Characterization test

Characterization test ghi nhận hành vi đang chạy, kể cả hành vi chưa tối ưu, để tránh regression ngoài ý muốn.

Tối thiểu phải kiểm tra:

- input hợp lệ và không hợp lệ;
- quyền và vai trò;
- trạng thái dữ liệu trước/sau;
- lỗi tích hợp ngoài;
- retry, idempotency và timeout;
- log/audit event bắt buộc;
- khả năng chạy lại mà không nhân đôi dữ liệu.

## 8. Shadow và canary

### Shadow

Code mới nhận bản sao input và tạo kết quả so sánh nhưng không được ghi dữ liệu production hoặc phát sinh side effect ngoài luồng được kiểm soát.

### Canary

Chỉ mở cho nhóm người dùng, tenant, station, asset class hoặc tỷ lệ traffic được phê duyệt. Canary phải có:

- tiêu chí thành công;
- error budget;
- metric so sánh với baseline;
- thời gian quan sát tối thiểu;
- ngưỡng rollback tự động hoặc thủ công.

## 9. Rollback bắt buộc

Mỗi migration phải có rollback manifest chứa:

- commit hoặc release ổn định trước đó;
- feature flag để trả traffic về code cũ;
- phiên bản schema trước/sau;
- cách reverse hoặc compensate dữ liệu;
- owner thực hiện;
- thời gian tối đa để rollback;
- điều kiện bắt buộc kích hoạt rollback.

Không được triển khai migration không thể rollback trừ khi có ADR, backup được kiểm chứng và phê duyệt thay đổi không đảo ngược.

## 10. Data migration

Áp dụng expand-and-contract:

1. thêm schema mới theo cách backward compatible;
2. dual-read hoặc dual-write có kiểm soát;
3. backfill theo batch nhỏ, có checkpoint;
4. đối soát checksum/count/business invariant;
5. chuyển read path;
6. chuyển write path;
7. giữ schema cũ trong rollback window;
8. chỉ xóa sau phê duyệt retirement.

Dual-write phải có idempotency key, audit và cơ chế reconcile. Không được coi dual-write là hoàn tất nếu chưa có đối soát sai lệch.

## 11. Tiêu chí cutover

Chỉ cutover khi:

- contract tests đạt;
- characterization tests đạt;
- shadow diff nằm trong ngưỡng;
- canary ổn định;
- không có lỗi nghiêm trọng mở;
- dashboard, alert và runbook hoạt động;
- rollback đã được diễn tập;
- owner nghiệp vụ, kỹ thuật và vận hành chấp thuận.

## 12. Retirement code cũ

Code cũ chỉ được xóa khi:

- rollback window đã kết thúc;
- không còn traffic hoặc consumer phụ thuộc;
- dữ liệu đã đối soát;
- tài liệu và runbook cập nhật;
- feature flag legacy được xóa;
- có quyết định retirement được phê duyệt.

## 13. Hồ sơ bắt buộc cho từng module

- migration registry record;
- dependency map;
- contract snapshot;
- characterization test evidence;
- feature flag definition;
- shadow/canary report;
- rollback manifest;
- data reconciliation report nếu có;
- approval và ngày retirement.

## 14. Ranh giới bảo đảm

CI chỉ chứng minh các file, registry và invariant đã khai báo. CI không thay thế thử nghiệm thực tế, review kiến trúc, xác nhận nghiệp vụ, đối soát dữ liệu hoặc quyết định cutover/rollback của người có thẩm quyền.
