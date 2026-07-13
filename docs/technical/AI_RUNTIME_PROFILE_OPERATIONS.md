# AI Runtime Profile Operations

## 1. Trạng thái triển khai

Các profile AI không còn chỉ là khuyến nghị trong tài liệu. Runtime hiện đọc cấu hình tập trung từ:

```text
src/lib/config/ai-governance-profile.ts
```

Hai biến môi trường chính:

```text
AI_RUNTIME_PROFILE=LOW|STANDARD|HIGH
AI_ASSURANCE_PROFILE=LOW|STANDARD|HIGH
```

Nếu không khai báo, hệ thống dùng:

```text
AI_RUNTIME_PROFILE=STANDARD
AI_ASSURANCE_PROFILE=STANDARD
```

`STANDARD/STANDARD` giữ các giá trị CURRENT trước khi Config Registry được kích hoạt.

## 2. Phân tách profile

### 2.1. Runtime profile

Điều chỉnh tài nguyên và lưu lượng:

- execution timeout;
- concurrency theo namespace;
- queue timeout;
- circuit breaker;
- MCP argument/response/trace limit;
- Vision upload, timeout và số detection;
- upload knowledge;
- rate-limit AI, Vision và SSE.

### 2.2. Assurance profile

Điều chỉnh mức kiểm soát:

- confidence mặc định;
- ngưỡng provisional memory;
- verified-only hoặc cho phép provisional;
- Data Governance trust/quality threshold;
- số lần đăng nhập và 2FA;
- quyền tạo AI memory candidate.

Runtime profile cao không làm tăng quyền ghi dữ liệu. `allowWrite` luôn cố định `false`.

## 3. Bảng runtime profile

| Cấu hình | LOW | STANDARD | HIGH |
|---|---:|---:|---:|
| AI timeout | 60 giây | 120 giây | 180 giây |
| Concurrent/namespace | 1 | 3 | 6 |
| Queue timeout | 8 giây | 15 giây | 30 giây |
| Failure threshold | 3 | 5 | 7 |
| Circuit cooldown | 120 giây | 60 giây | 30 giây |
| MCP argument | 10.000 | 50.000 | 100.000 ký tự |
| MCP response | 250.000 | 1.000.000 | 2.000.000 ký tự |
| MCP timeout | 10 giây | 20 giây | 30 giây |
| MCP traces/user | 30 | 100 | 200 |
| Vision API upload | 4 MiB | 8 MiB | 16 MiB |
| Vision worker timeout | 15 giây | 20 giây | 30 giây |
| YOLO default max detection | 25 | 50 | 100 |
| Knowledge upload target | 8 MiB | 15 MiB | 25 MiB |
| AI hint/phút | 5 | 10 | 20 |
| AI feedback/phút | 10 | 20 | 30 |
| Vision/phút | 5 | 10 | 20 |
| SSE open/phút | 3 | 5 | 10 |
| Tool read | Tắt mặc định | Bật | Bật |

## 4. Bảng assurance profile

| Cấu hình | LOW | STANDARD | HIGH |
|---|---:|---:|---:|
| Memory default confidence | 0,60 | 0,68 | 0,75 |
| Human-approved minimum | 0,90 | 0,95 | 0,98 |
| Provisional threshold | 0,55 | 0,65 | 0,80 |
| Retrieval minimum confidence | 0,55 | 0,65 | 0,80 |
| Include provisional | Có | Có | Không |
| Retrieval limit | 8 | 5 | 4 |
| Relevance threshold | 0,15 | 0,20 | 0,30 |
| Data quarantine trust | <30 | <40 | <55 |
| Data review quality | <50 | <60 | <75 |
| Data review trust | <55 | <65 | <80 |
| Review khi issue count | >=6 | >=4 | >=2 |
| Login attempts/15 phút | 10 | 5 | 3 |
| 2FA attempts/10 phút | 10 | 5 | 3 |
| AI memory candidates | Có | Có | Không |
| AI write | Không | Không | Không |

`LOW` assurance bị chặn trong production. Chỉ có thể mở ngoại lệ có chủ đích bằng:

```text
AI_ALLOW_LOW_ASSURANCE_IN_PRODUCTION=true
```

Ngoại lệ này không cấp quyền ghi cho AI.

## 5. Hard limits

Các override từ environment được clamp:

| Option | Min | Max |
|---|---:|---:|
| Execution timeout | 3.000 ms | 240.000 ms |
| Concurrent/namespace | 1 | 8 |
| Queue timeout | 1.000 ms | 60.000 ms |
| Failure threshold | 1 | 10 |
| Circuit cooldown | 15.000 ms | 300.000 ms |
| Memory retrieval limit | 1 | 10 |
| Data context | 4.000 | 64.000 ký tự |
| Confidence/trust decimal | 0 | 1 |
| Data scores | 0 | 100 |

Giá trị không hợp lệ được thay bằng giá trị profile. Giá trị vượt biên được clamp, không được áp dụng trực tiếp.

## 6. Thành phần đã dùng profile runtime

- Runtime Guard: timeout, concurrency, queue và circuit breaker.
- Memory Firewall: kích thước nội dung, confidence, provisional, retrieval và relevance.
- Data Governance: quarantine/review threshold và context partition.
- MCP Firewall: tool-read, argument, response, timeout và trace count.
- Vision detect/analyze API: rate-limit, upload, timeout và YOLO options.
- YOLO client: upload lower-level guard và default inference options.
- Authentication: login và 2FA attempts.
- AI feedback: rate-limit, confidence và input size.
- SSE: số lần mở stream.
- Rate limiter engine: cưỡng chế profile theo operation prefix, kể cả caller cũ truyền limit cố định.
- Agent registry hiệu dụng: lọc `tool-read` và `memory-write-candidate`.
- Governance dashboard: hiển thị snapshot profile đã resolve.

## 7. Giới hạn tương thích hiện tại

`src/lib/actions/ai.actions.ts` vẫn có một số hằng số cục bộ phục vụ đường gọi legacy. Các giới hạn bảo mật quan trọng được cưỡng chế lại ở lớp dưới:

- rate-limit được cưỡng chế tại `src/lib/rate-limit.ts`;
- MCP permission và limit được cưỡng chế tại `mcp-service.ts`;
- YOLO upload/timeout được cưỡng chế tại `yolo.ts`;
- AI execution timeout được cưỡng chế tại Runtime Guard.

Riêng đường upload ảnh legacy vẫn có thể giữ mức trần 8 MiB trước khi tới lớp dưới. Do đó profile HIGH không bảo đảm đường legacy nhận đủ 16 MiB; API Vision mới là đường hỗ trợ đầy đủ profile upload. Đây là giới hạn tương thích, không phải bypass bảo mật.

## 8. Cấu hình triển khai

### 8.1. Development ít tài nguyên

```text
AI_RUNTIME_PROFILE=LOW
AI_ASSURANCE_PROFILE=STANDARD
```

### 8.2. UAT và production nghiệp vụ thường

```text
AI_RUNTIME_PROFILE=STANDARD
AI_ASSURANCE_PROFILE=STANDARD
```

### 8.3. Production an toàn và vận hành

```text
AI_RUNTIME_PROFILE=STANDARD
AI_ASSURANCE_PROFILE=HIGH
```

Chỉ dùng `AI_RUNTIME_PROFILE=HIGH` sau load-test và giám sát pool kết nối, queue, CPU, RAM và latency.

## 9. Override có kiểm soát

Danh sách mẫu đầy đủ:

```text
docs/config/ai-governance-profiles.env.example
```

Không đưa secret vào tệp này. Secret phải đi qua secret store của nền tảng triển khai.

## 10. Kiểm thử

Chạy:

```bash
npm run typecheck
npm run test:ai-governance
npm run test:ai-profiles
npm run lint
npm run build
```

`test:ai-profiles` kiểm tra:

- default STANDARD;
- LOW/HIGH profile thực sự đổi giá trị;
- hard clamp;
- HIGH assurance verified-only;
- LOW assurance bị chặn trong production;
- quyền ghi luôn false.

CI `Security and Acceptance Gate` chạy cả hai bộ test AI trước lint và build.

## 11. Rollout

1. Áp dụng tại development.
2. Chạy invariant test và typecheck.
3. Chạy UAT với `STANDARD/STANDARD`.
4. Theo dõi timeout, queue, circuit, quarantine và data review.
5. Chạy load-test trước khi dùng HIGH runtime.
6. Chạy security review trước khi giảm assurance.
7. Chỉ triển khai production khi pipeline xanh và có phương án rollback.

## 12. Rollback

Rollback nhanh bằng environment:

```text
AI_RUNTIME_PROFILE=STANDARD
AI_ASSURANCE_PROFILE=STANDARD
```

Sau khi đổi environment phải restart process/container. Nếu lỗi do mã nguồn, rollback commit Config Registry và các adapter liên quan, sau đó chạy lại toàn bộ acceptance gate.
