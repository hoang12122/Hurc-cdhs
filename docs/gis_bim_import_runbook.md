# Runbook import GIS/BIM

## 1. Mục đích

Tài liệu này hướng dẫn cách import dữ liệu GIS/BIM theo hai giai đoạn:

1. Kiểm tra dữ liệu bằng script/dry-run.
2. Import chính thức vào database sau khi schema, migration và dữ liệu đã được xác nhận.

Cách làm này giúp hạn chế rủi ro sai hệ tọa độ, sai mã ga, sai mã tài sản hoặc import nhầm dữ liệu demo vào môi trường vận hành.

## 2. File mẫu

Repo đã bổ sung 02 file mẫu:

- `data/import/gis/stations-m1.geojson`
- `data/import/bim/ben-thanh-bim-index.json`

Các file này chỉ phục vụ kiểm chứng cấu trúc import, không phải dữ liệu vận hành chính thức.

## 3. Lệnh kiểm tra dữ liệu

Chạy dry-run:

```bash
npm run import:gis-bim:dry-run
```

Lệnh này sẽ:

- Đọc file GeoJSON mẫu.
- Đọc file BIM metadata mẫu.
- Kiểm tra cấu trúc bắt buộc.
- In summary ra console.
- Không ghi dữ liệu vào database.

Có thể chỉ định file khác:

```bash
npx tsx src/scripts/import-gis-bim.ts \
  --dry-run \
  --gis data/import/gis/stations-m1.geojson \
  --bim data/import/bim/ben-thanh-bim-index.json
```

## 4. Lệnh import chính thức

Chỉ chạy khi database đã migration đầy đủ và biến môi trường `METRO_DATABASE_URL` đã được khai báo.

```bash
npm run import:gis-bim:commit
```

Hoặc chỉ định file:

```bash
METRO_DATABASE_URL="postgresql://user:password@host:5432/metro" \
npx tsx src/scripts/import-gis-bim.ts \
  --commit \
  --gis data/import/gis/stations-m1.geojson \
  --bim data/import/bim/ben-thanh-bim-index.json
```

## 5. Quy trình trước khi commit dữ liệu

Trước khi import chính thức, cần thực hiện:

1. Xác nhận nguồn dữ liệu GIS/BIM.
2. Kiểm tra hệ tọa độ.
3. Kiểm tra mã tuyến, mã ga, mã tài sản.
4. Chạy dry-run.
5. Chạy migration schema nếu có thay đổi database.
6. Sao lưu database.
7. Chạy import chính thức.
8. Kiểm tra kết quả trên `/spatial-twin`, `/spatial-twin/import`, `/rail-network` và Asset 360.

## 6. CI đã bổ sung

Workflow `Security and Acceptance Gate` đã được cập nhật để chạy thêm:

- `npm run db:validate:all`
- `npm run db:generate:all`
- `npm run import:gis-bim:dry-run`

Như vậy, mỗi PR/push sẽ tự động kiểm tra schema Prisma và cấu trúc dữ liệu GIS/BIM mẫu trước khi typecheck, lint và build.

## 7. Ghi chú nghiệm thu

Không nghiệm thu dữ liệu GIS/BIM khi:

- Chưa có nguồn gốc dữ liệu.
- Chưa thống nhất hệ tọa độ.
- Mã tuyến/ga/tài sản chưa đồng bộ với Asset 360.
- Mô hình BIM chưa có phiên bản và trạng thái phê duyệt.
- CI chưa pass hoặc dry-run còn lỗi.
