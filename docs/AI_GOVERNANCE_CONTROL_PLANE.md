# AI Governance Control Plane

## 1. Mục tiêu

AI Governance Control Plane là lớp kiểm soát thống nhất cho toàn bộ chức năng AI của HURC-CDHS. Hệ thống được thiết kế để nhiều AI chuyên trách có thể hỗ trợ quản lý dữ liệu, tài sản, bảo trì, an toàn và trạng thái hệ thống mà không tự ý thay đổi dữ liệu vận hành.

Nguyên tắc bắt buộc:

1. AI chỉ được đọc, phân tích và đề xuất.
2. AI không tự ghi, sửa, xóa dữ liệu hoặc thay đổi trạng thái hệ thống.
3. Nội dung do AI sinh ra không mặc nhiên trở thành tri thức đúng.
4. Mọi ký ức phải có namespace, nguồn gốc, checksum, độ tin cậy và trạng thái kiểm duyệt.
5. Thay đổi liên quan an toàn hoặc vận hành phải được con người phê duyệt.
6. Dữ liệu mâu thuẫn không được tự động hợp nhất.

## 2. Các AI quản lý được cài đặt

| Vai trò | Phạm vi chính | Quyền |
|---|---|---|
| DATA_STEWARD | Chất lượng, chuẩn hóa, trùng lặp và provenance dữ liệu | Đọc, phân tích, đề xuất, tạo ứng viên ký ức |
| SYSTEM_GUARDIAN | Sức khỏe server, dịch vụ, database và vận hành | Đọc công cụ, phân tích, cảnh báo |
| SAFETY_AUDITOR | Hazard, DNF, hình ảnh an toàn và rủi ro | Phân tích, không hạ mức rủi ro, yêu cầu phê duyệt |
| ASSET_MANAGER | Tài sản, thiết bị, phụ tùng và lịch sử bảo trì | Đọc, phân tích, đề xuất |
| TECHNICAL_ANALYST | Phân tích kỹ thuật, nguyên nhân và kiểm chứng | Đọc công cụ, phân tích, phản biện |
| EXECUTIVE_BRAIN | Tổng hợp điều hành và KPI | Chỉ tổng hợp dữ liệu đã kiểm chứng |
| RAG_SPECIALIST | Truy xuất tài liệu và TrustGraph | Đọc, truy xuất, đối chiếu nguồn |
| KNOWLEDGE_CURATOR | Kiểm duyệt tri thức và xung đột phiên bản | Chuẩn hóa và tạo ứng viên tri thức |

Registry là bất biến trong mã nguồn. Custom agent chỉ được hoạt động ở chế độ `advisory-only`; prompt yêu cầu vượt quyền hoặc điều khiển hệ thống sẽ bị từ chối.

## 3. Luồng xử lý bắt buộc

Mỗi yêu cầu AI đi qua chuỗi sau:

1. Chuẩn hóa Unicode và loại ký tự điều khiển.
2. Che database URL, API key, mật khẩu, bearer token và private key.
3. Phát hiện prompt injection, yêu cầu vượt quyền và ý định ghi dữ liệu.
4. Phân loại miền dữ liệu và chọn agent theo quy tắc xác định trước.
5. Tạo `requestId`, fingerprint và namespace theo agent, miền và người dùng.
6. Chấm điểm rủi ro `low`, `medium`, `high` hoặc `critical`.
7. Gắn policy bất biến vào system prompt.
8. Chạy qua Runtime Guard.
9. Kiểm tra và che dữ liệu nhạy cảm trong kết quả.
10. Ghi audit và trả metadata governance.

Yêu cầu có ý định ghi hoặc mức `critical` luôn bị chuyển thành tư vấn và yêu cầu con người phê duyệt.

## 4. Runtime Guard

Runtime Guard ngăn nhiều AI cùng xử lý một dữ liệu gây kết quả cạnh tranh:

- Single-flight theo fingerprint: yêu cầu giống nhau đồng thời chỉ chạy một lần.
- Giới hạn số tác vụ đồng thời theo namespace.
- Hàng đợi có timeout.
- Timeout cho từng lần thực thi AI.
- Circuit breaker khi agent lỗi liên tiếp.
- Half-open probe để phục hồi có kiểm soát.
- Dashboard hiển thị circuit, namespace đang chạy và số yêu cầu single-flight.

## 5. Memory Firewall

### 5.1. Trạng thái ký ức

- `provisional`: ký ức tạm thời, chưa được con người xác minh.
- `verified`: ký ức đã được xác minh hoặc đến từ nguồn có thẩm quyền.
- `quarantined`: dữ liệu đáng ngờ, chứa bí mật, injection hoặc độ tin cậy thấp.
- `superseded`: ký ức đã bị phiên bản mới thay thế.

### 5.2. Thuộc tính bắt buộc

Mỗi ký ức có:

- ID và checksum xác định;
- namespace và miền dữ liệu;
- vai trò agent;
- nguồn và phiên bản nguồn;
- danh sách provenance ID;
- confidence và importance;
- reinforcement count;
- thời điểm tạo, lần cuối gặp và TTL;
- trạng thái kiểm duyệt.

Ký ức trùng checksum không được tạo mới mà chỉ tăng reinforcement count. Ký ức hết TTL không được đưa vào ngữ cảnh.

### 5.3. Kho lưu trữ

- Offline: `ai_longterm_memory` và `ai_memory_quarantine` trong JSON DB nguyên tử.
- PostgreSQL: dùng `AiVerificationLog` hiện có, không cần migration mới.
  - `PROPOSED` = provisional;
  - `APPROVED` = verified;
  - `REJECTED` = quarantined hoặc superseded.

## 6. Data Governance Engine

Data Governance Engine thực hiện:

- canonicalization có thứ tự khóa ổn định;
- fingerprint nội dung;
- kiểm tra khóa thực thể và phiên bản;
- điểm chất lượng và điểm tin cậy nguồn;
- kiểm tra trường bắt buộc, placeholder và thời gian bất thường;
- phát hiện injection trong dữ liệu nhập;
- phân vùng context theo namespace và domain;
- quarantine dữ liệu không đạt;
- reconciliation xác định trước giữa các phiên bản.

AI output không được ghi đè dữ liệu database, system event hoặc dữ liệu đã được con người duyệt. Các trường an toàn như `status`, `priority`, `riskLevel`, `severity`, `likelihood`, `isolationState` và `operationalState` không được tự động hợp nhất khi xung đột.

## 7. Tool Firewall

### 7.1. MCP

MCP mặc định ở chế độ read-only:

- lọc khỏi registry các tool có tên hoặc mô tả mang ý nghĩa create, update, delete, execute, deploy, push, merge hoặc tương đương;
- kiểm tra lại tại thời điểm gọi để ngăn bypass;
- chặn SQL ghi, shell command, Docker/Kubernetes/Git command trong arguments;
- giới hạn kích thước arguments và response;
- timeout 20 giây;
- che bí mật trong trace;
- ghi system log khi tool hoặc arguments bị chặn.

### 7.2. Công cụ đọc mã nguồn

- bắt buộc đường dẫn nằm trong project root thực;
- chặn symlink đi ra ngoài root;
- chặn `.env*`, private key, credential, `db.json`, `.git`, `node_modules`, `.next` và generated runtime;
- chỉ đọc extension văn bản nằm trong allowlist;
- giới hạn kích thước tệp và số tệp quét;
- grep theo chuỗi literal, không chạy regex tùy ý;
- che bí mật trong nội dung trả về.

## 8. Audit

- Offline: hash-chain trong `ai_governance_audit`.
- PostgreSQL: ghi vào `AiSafetyLog` với action `AI_GOVERNANCE_*` và `isImmutable=true`.
- Audit lưu agent, namespace, domain, fingerprint, risk score, quyết định, confidence và hash sự kiện trước.
- Lỗi kho audit không được làm mất policy read-only; hệ thống chuyển sang chế độ suy giảm an toàn và phát cảnh báo.

## 9. Quản trị

Server actions tại `src/lib/actions/ai-governance.actions.ts` cung cấp:

- dashboard sức khỏe governance;
- danh sách 8 agent;
- trạng thái Runtime Guard và Tool Firewall;
- thống kê Memory Firewall;
- thống kê audit;
- danh sách ký ức cách ly;
- phê duyệt, cách ly hoặc supersede ký ức;
- đánh giá một data candidate trước khi nhập.

Các thao tác kiểm duyệt yêu cầu quyền `admin:system`.

## 10. Kiểm thử bắt buộc

Lệnh:

```bash
npm run test:ai-governance
```

Security and Acceptance Gate chạy bộ invariant sau typecheck và trước lint/build. Bộ test kiểm tra:

- đủ 8 agent quản trị;
- phân loại domain;
- phát hiện prompt injection;
- che bí mật;
- canonical hashing;
- quarantine dữ liệu không an toàn;
- chặn xung đột trường an toàn;
- single-flight chỉ thực thi một lần.

## 11. Giới hạn có chủ đích

Control Plane không biến AI thành bộ điều khiển tự trị. AI được sử dụng như lớp phân tích và hỗ trợ quyết định. Việc cấp quyền ghi trong tương lai phải dùng workflow riêng có xác thực người dùng, kiểm tra quyền, approval token dùng một lần, optimistic locking, idempotency key, audit trước/sau và khả năng rollback; không được mở quyền bằng cách sửa system prompt.
