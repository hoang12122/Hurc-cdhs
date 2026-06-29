# Runbook Docker build, kiểm thử và nghiệm thu

## 1. Mục đích

Tài liệu này dùng cho trường hợp triển khai HURC-CDHS bằng Docker/Docker Compose. Mục tiêu là bảo đảm các phần mới như Digital Twin, mạng tuyến Metro, GIS/BIM Twin và GIS/BIM Import Center được kiểm tra trong đúng môi trường đóng gói thực tế.

## 2. Các điểm đã cập nhật cho Docker

### 2.1. Dockerfile

Dockerfile đã bổ sung bước kiểm tra trước khi build:

```bash
npm run db:validate:all
npm run import:gis-bim:dry-run
npm run build
```

Như vậy, khi build image, hệ thống sẽ kiểm tra Prisma schema và dữ liệu GIS/BIM mẫu trước khi tạo bản build Next.js.

### 2.2. docker-compose.yml

Docker Compose đã được cập nhật:

- App chờ PostgreSQL, MongoDB và Redis ở trạng thái healthy trước khi khởi động.
- Bổ sung biến môi trường mặc định cho các database URL nội bộ Docker.
- Bổ sung profile `tools` cho import GIS/BIM dry-run và import commit.
- Nginx chờ app healthy trước khi khởi động.
- Không còn phụ thuộc bắt buộc vào file `.env`; nếu có `.env`, Docker Compose vẫn tự đọc biến để nội suy.

### 2.3. .dockerignore

`.dockerignore` đã được tăng cường để không đưa dữ liệu runtime như PostgreSQL, MongoDB, Ollama, logs, backups, audit reports vào build context. Riêng thư mục `data/import` vẫn được giữ lại để Docker build có thể chạy dry-run GIS/BIM.

### 2.4. CI Docker

Đã bổ sung workflow `Docker Acceptance Gate` để kiểm tra:

```bash
docker compose --profile core --profile tools config
docker image build --file Dockerfile --tag hurc-cdhs:ci .
```

## 3. Lệnh build Docker khuyến nghị

Kiểm tra cấu hình Compose:

```bash
docker compose --profile core --profile tools config
```

Build app image:

```bash
docker compose --profile core build app
```

Hoặc build trực tiếp:

```bash
docker image build --file Dockerfile --tag hurc-cdhs:local .
```

Khởi động core stack:

```bash
docker compose --profile core up -d
```

Kiểm tra trạng thái:

```bash
docker compose ps
```

Kiểm tra log app:

```bash
docker compose logs -f app
```

## 4. Import GIS/BIM bằng Docker

Chạy dry-run:

```bash
docker compose --profile tools run --rm gis-bim-import-dry-run
```

Chạy import chính thức sau khi PostgreSQL đã sẵn sàng và schema đã migration:

```bash
docker compose --profile core up -d postgres
docker compose --profile tools run --rm gis-bim-import-commit
```

Lưu ý: không chạy import chính thức nếu chưa backup database hoặc chưa xác nhận dữ liệu GIS/BIM.

## 5. Luồng nghiệm thu tính năng trong Docker

Sau khi `docker compose --profile core up -d`, cần kiểm tra thủ công các đường dẫn:

- `/dashboard`
- `/asset-360`
- `/rail-network`
- `/spatial-twin`
- `/spatial-twin/import`
- `/metro/assets`
- `/dnf`
- `/hazards`
- `/tasks`

Yêu cầu tối thiểu:

1. App container ở trạng thái healthy.
2. PostgreSQL, MongoDB, Redis ở trạng thái healthy.
3. `/api/health` trả về status healthy.
4. Trang Rail Network hiển thị sơ đồ tuyến và các node nhà ga.
5. Trang Spatial Twin hiển thị GIS Operational Map và BIM Model Registry.
6. Trang Import Center hiển thị quy trình import và lệnh dry-run/commit.
7. Asset 360 vẫn hiển thị Digital Twin Control Center.
8. Không phát sinh lỗi runtime trên log app.

## 6. Các điểm chưa nên nghiệm thu production nếu chưa hoàn tất

- Chưa có migration production chính thức cho schema GIS/BIM.
- Dữ liệu GIS/BIM hiện là mẫu demo, chưa phải dữ liệu as-built được phê duyệt.
- Chưa có viewer GIS chuyên dụng như MapLibre/Leaflet/OpenLayers.
- Chưa có viewer BIM chuyên dụng như IFC.js hoặc glTF viewer.
- Chưa có phân quyền scoped đầy đủ theo lineId/stationId/systemId/assetId.
- Chưa có job backup/restore tự động được gắn trực tiếp vào quy trình import chính thức.

## 7. Kết luận nghiệm thu Docker

Có thể nghiệm thu ở mức kỹ thuật nội bộ khi:

- Security and Acceptance Gate pass.
- Docker Acceptance Gate pass.
- Docker Compose core stack khởi động ổn định.
- Các trang chính nêu tại mục 5 hoạt động đúng.
- Import dry-run chạy thành công.

Chưa nên nghiệm thu vận hành chính thức cho dữ liệu GIS/BIM nếu chưa thay dữ liệu demo bằng dữ liệu được phê duyệt và chưa hoàn tất migration/backup/restore.
