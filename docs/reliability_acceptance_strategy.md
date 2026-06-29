# Chiến lược nâng độ tin cậy build và nghiệm thu phần mềm

## 1. Mục tiêu

Mục tiêu của tài liệu là giảm tối đa rủi ro sau khi build phần mềm, đặc biệt đối với các chức năng mới gồm Digital Twin, Rail Network, Google Maps station link, GIS/BIM Twin, Import Center và Docker deployment.

Lưu ý: không thể cam kết tuyệt đối 99.99999999% chỉ bằng CI/CD. Mức độ sẵn sàng rất cao cần thêm hạ tầng HA, giám sát, cảnh báo, backup, rollback, kiểm thử tải và vận hành thực tế. Tuy nhiên, CI/CD có thể nâng độ tin cậy kỹ thuật bằng cách phát hiện lỗi càng sớm càng tốt.

## 2. Lớp kiểm tra đã bổ sung

### 2.1. Build Quality Gate

Workflow `Security and Acceptance Gate` kiểm tra:

1. Cài đặt dependency từ lockfile.
2. Validate toàn bộ Prisma schema.
3. Generate toàn bộ Prisma client.
4. GIS/BIM import dry-run.
5. TypeScript typecheck.
6. Next.js lint.
7. Production build.
8. Production route smoke test.
9. Production dependency audit.
10. CodeQL static security analysis.

### 2.2. Production Smoke Test

Đã bổ sung script:

```text
scripts/production-smoke-test.js
```

Script này khởi động app sau production build và kiểm tra các route tối thiểu:

- `/api/health`
- `/rail-network`
- `/spatial-twin`
- `/spatial-twin/import`
- `/asset-360`

Tiêu chí: route không được trả HTTP 5xx; riêng `/api/health` phải trả `status: healthy`.

### 2.3. Docker Acceptance Gate

Workflow `Docker Acceptance Gate` kiểm tra:

1. Docker Compose config.
2. Docker image build.
3. Khởi động container từ image vừa build.
4. Gọi `/api/health` trong container.
5. In log container nếu healthcheck chưa pass.
6. Cleanup container sau kiểm tra.

### 2.4. Docker image healthcheck

Dockerfile đã bổ sung `HEALTHCHECK` ở cấp image để các nền tảng Docker/Docker Compose có thể xác định container còn sống hay không.

## 3. Điều kiện nghiệm thu kỹ thuật nội bộ

Chỉ xem xét nghiệm thu kỹ thuật nội bộ khi:

- Security and Acceptance Gate pass.
- Docker Acceptance Gate pass.
- CodeQL pass.
- Production route smoke test pass.
- Docker runtime health smoke test pass.
- Không có lỗi 5xx ở các route trọng yếu.
- Người kiểm thử mở thủ công được các trang: `/asset-360`, `/rail-network`, `/spatial-twin`, `/spatial-twin/import`, `/dnf`, `/hazards`, `/tasks`.

## 4. Điều kiện chưa được nghiệm thu production

Không nghiệm thu production nếu còn một trong các điều kiện sau:

- CI còn fail.
- Docker image build fail.
- Container không healthy.
- Dữ liệu GIS/BIM vẫn là dữ liệu demo nhưng bị sử dụng như dữ liệu vận hành.
- Chưa có migration production cho schema mới.
- Chưa có backup/restore drill trước import dữ liệu.
- Chưa có rollback plan.
- Chưa có monitoring, logging, alerting sau triển khai.

## 5. Hướng nâng cấp tiếp theo để tiến gần mục tiêu uptime rất cao

Để tiến gần mức sẵn sàng rất cao, cần bổ sung thêm:

- Blue/green hoặc rolling deployment.
- Database backup tự động và restore drill định kỳ.
- Healthcheck cấp ứng dụng và cấp database.
- Readiness endpoint tách biệt với liveness endpoint.
- Observability: metrics, logs, traces, alerting.
- Kiểm thử tải và kiểm thử chịu lỗi.
- Kiểm thử rollback migration.
- Tách dữ liệu demo khỏi dữ liệu production bằng feature flag hoặc seed environment.

## 6. Kết luận

Sau cải tiến này, build không chỉ dừng ở việc tạo ra artifact. Build phải chứng minh rằng app có thể khởi động, trả healthcheck và mở được các route quan trọng. Đây là cơ sở tối thiểu để tăng độ tin cậy trước khi nghiệm thu kỹ thuật nội bộ.
