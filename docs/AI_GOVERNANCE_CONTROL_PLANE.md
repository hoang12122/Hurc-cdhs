# AI Governance Control Plane

> Tài liệu này mô tả nguyên tắc quản trị tổng thể. Bảng tham số chi tiết nằm tại [`docs/technical/AI_ARCHITECTURE_CONFIGURATION_REFERENCE.md`](technical/AI_ARCHITECTURE_CONFIGURATION_REFERENCE.md). Quy trình cấu hình, rollout và rollback runtime nằm tại [`docs/technical/AI_RUNTIME_PROFILE_OPERATIONS.md`](technical/AI_RUNTIME_PROFILE_OPERATIONS.md).

## Trạng thái áp dụng runtime

Config Registry đã được kích hoạt trong mã nguồn:

```text
src/lib/config/ai-governance-profile.ts
```

Hai environment switch có hiệu lực sau khi restart process/container:

```text
AI_RUNTIME_PROFILE=LOW|STANDARD|HIGH
AI_ASSURANCE_PROFILE=LOW|STANDARD|HIGH
```

Mặc định:

```text
AI_RUNTIME_PROFILE=STANDARD
AI_ASSURANCE_PROFILE=STANDARD
```

`STANDARD/STANDARD` giữ các giá trị CURRENT trước khi profile runtime được triển khai.

Profile hiện tác động đến:

- Runtime Guard: timeout, concurrency, queue và circuit breaker;
- Memory Firewall: confidence, provisional/verified-only, relevance và limit;
- Data Governance: trust, quality, issue threshold và context limit;
- MCP Firewall: quyền tool-read, argument, response, timeout và trace;
- AI Vision và YOLO: upload, timeout, confidence, IoU và max detection;
- rate-limit cho login, 2FA, AI hint, feedback, Vision và SSE;
- capability hiệu dụng của agent;
- dashboard quản trị AI.

Các override được clamp theo hard limit. `LOW` assurance bị chặn trong production nếu không có ngoại lệ có chủ đích. Quyền ghi của AI luôn cố định `false` ở mọi profile.

## 1. Mục tiêu

AI Governance Control Plane là lớp kiểm soát thống nhất cho toàn bộ chức năng AI của HURC-CDHS. Hệ thống cho phép nhiều AI chuyên trách hỗ trợ quản lý dữ liệu, tài sản, bảo trì, an toàn và trạng thái hệ thống mà không tự ý thay đổi dữ liệu vận hành.

Nguyên tắc bắt buộc:

1. AI chỉ được đọc, phân tích và đề xuất.
2. AI không tự ghi, sửa, xóa dữ liệu hoặc thay đổi trạng thái hệ thống.
3. Nội dung do AI sinh ra không mặc nhiên trở thành tri thức đúng.
4. Mọi ký ức phải có namespace, nguồn gốc, checksum, độ tin cậy và trạng thái kiểm duyệt.
5. Thay đổi liên quan an toàn hoặc vận hành phải được con người phê duyệt.
6. Dữ liệu mâu thuẫn không được tự động hợp nhất.

## 2. Các AI quản lý

| Vai trò | Phạm vi chính | Quyền nền |
|---|---|---|
| DATA_STEWARD | Chất lượng, chuẩn hóa, trùng lặp và provenance dữ liệu | Đọc, phân tích, đề xuất |
| SYSTEM_GUARDIAN | Server, dịch vụ, database và vận hành | Đọc công cụ khi profile cho phép |
| SAFETY_AUDITOR | Hazard, DNF, hình ảnh và rủi ro | Phân tích, không hạ mức rủi ro |
| ASSET_MANAGER | Tài sản, thiết bị, phụ tùng và bảo trì | Đọc, phân tích, đề xuất |
| TECHNICAL_ANALYST | Nguyên nhân, kỹ thuật và kiểm chứng | Đọc công cụ khi profile cho phép |
| EXECUTIVE_BRAIN | Điều hành và KPI | Tổng hợp dữ liệu đã kiểm chứng |
| RAG_SPECIALIST | Tài liệu và TrustGraph | Truy xuất, đối chiếu nguồn |
| KNOWLEDGE_CURATOR | Tri thức và xung đột phiên bản | Chuẩn hóa, tạo ứng viên khi profile cho phép |

Capability hiệu dụng được lọc theo profile. `tool-read` bị tắt mặc định ở runtime LOW. `memory-write-candidate` bị tắt ở assurance HIGH. Không profile nào cấp capability ghi dữ liệu nghiệp vụ.

## 3. Luồng xử lý bắt buộc

Mỗi yêu cầu AI đi qua:

1. Xác thực và kiểm tra quyền.
2. Rate-limit theo operation và người dùng/IP.
3. Chuẩn hóa Unicode và loại ký tự điều khiển.
4. Che database URL, API key, mật khẩu, bearer token và private key.
5. Phát hiện prompt injection, vượt quyền và write intent.
6. Phân loại domain và chọn agent xác định trước.
7. Tạo request ID, fingerprint và namespace.
8. Chấm điểm rủi ro.
9. Gắn policy bất biến.
10. Chạy Runtime Guard theo profile.
11. Kiểm tra kết quả, confidence và secret.
12. Ghi audit và trả metadata governance.

Write intent hoặc risk `critical` luôn chuyển thành tư vấn và yêu cầu con người phê duyệt.

## 4. Runtime Guard

Runtime Guard cung cấp:

- single-flight theo fingerprint;
- concurrency isolation theo namespace;
- queue timeout;
- execution timeout;
- circuit breaker;
- half-open recovery;
- dashboard circuit, queue và profile đã resolve.

Giá trị được lấy từ Config Registry, không còn cố định tại Runtime Guard.

## 5. Memory Firewall

Trạng thái:

- `provisional`;
- `verified`;
- `quarantined`;
- `superseded`.

Mỗi memory có namespace, domain, agent role, source, version, provenance, confidence, importance, reinforcement count, TTL và checksum.

Assurance HIGH mặc định:

- chỉ truy xuất memory đã xác minh;
- minimum confidence 0,80;
- không cho AI output tự trở thành memory candidate.

## 6. Data Governance

Data Governance thực hiện:

- canonicalization và fingerprint;
- entity/version/provenance validation;
- quality và trust scoring;
- placeholder/time anomaly detection;
- injection screening;
- profile-driven accept/review/quarantine;
- deterministic reconciliation.

AI output không được ghi đè nguồn vận hành. Xung đột các trường an toàn luôn cần phê duyệt con người.

## 7. Tool Firewall

MCP tiếp tục ở chế độ read-only:

- lọc tool ghi hoặc điều khiển;
- kiểm tra lại khi gọi;
- chặn argument nguy hiểm;
- giới hạn argument, response, timeout và trace theo profile;
- tách trace theo người dùng;
- tắt toàn bộ tool-read khi runtime profile không cho phép.

Việc đổi profile không được dùng để mở write tool.

## 8. Audit và quản trị

Dashboard quản trị hiển thị:

- runtime profile;
- assurance profile;
- cấu hình đã resolve;
- Runtime Guard;
- MCP Firewall;
- Memory health;
- audit summary;
- danh sách agent và protection.

Các thao tác kiểm duyệt yêu cầu `admin:system`.

## 9. Kiểm thử bắt buộc

```bash
npm run typecheck
npm run test:ai-governance
npm run test:ai-profiles
npm run lint
npm run build
```

`test:ai-profiles` kiểm tra profile mặc định, LOW/HIGH, hard clamp, production fail-closed và quyền ghi luôn false. Security and Acceptance Gate chạy bộ test này trước lint/build.

## 10. Rollout và rollback

Rollout phải theo development → UAT → production, kèm load-test khi tăng capacity và security review khi giảm assurance.

Rollback nhanh:

```text
AI_RUNTIME_PROFILE=STANDARD
AI_ASSURANCE_PROFILE=STANDARD
```

Sau khi thay environment phải restart process/container.

## 11. Giới hạn có chủ đích

Control Plane không biến AI thành bộ điều khiển tự trị. Việc cấp quyền ghi trong tương lai phải dùng workflow riêng có xác thực, permission, approval token một lần, optimistic locking, idempotency, audit trước/sau và rollback. Không được mở quyền ghi bằng environment profile hoặc system prompt.

GitHub Actions chỉ được ghi nhận `PASS` sau khi pipeline thực tế hoàn tất thành công.
