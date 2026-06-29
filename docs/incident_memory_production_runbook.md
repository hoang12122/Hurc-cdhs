# Runbook triển khai Incident Memory cho AI Lab

## 1. Mục tiêu

Incident Memory là lớp dữ liệu chính thức để AI Lab học từ các sự cố tương tự đã từng ghi nhận. Thay vì chỉ đọc rời rạc DNF/Hazard/Task/Inspection mỗi lần chat, hệ thống đồng bộ các nguồn này thành bảng chuẩn hóa:

```text
ops_incident_memories
```

Bảng này phục vụ truy vấn IncidentLearning trong AI Lab và là nền tảng để sau này bổ sung quy trình phê duyệt bài học kinh nghiệm.

## 2. Thành phần đã bổ sung

### 2.1. Prisma schema

File:

```text
prisma/ops/schema.prisma
```

Model mới:

```text
IncidentMemory
```

### 2.2. Migration SQL

File:

```text
prisma/ops/migrations/20260628130000_add_incident_memory/migration.sql
```

Migration tạo bảng `ops_incident_memories`, unique key theo `source_type + source_id` và các index phục vụ tìm kiếm.

### 2.3. Service đồng bộ

File:

```text
src/lib/services/incident-learning-service.ts
```

Service đọc dữ liệu từ:

- `DnfDocument`.
- `CorrectiveAction`.
- `HazardRecord`.
- `Task`.
- `InspectionDetail`.

Sau đó chuẩn hóa vào `IncidentMemory`.

### 2.4. Server action

File:

```text
src/lib/actions/incident-learning.actions.ts
```

Server action chính:

```text
incidentLearningQuery(query)
syncIncidentMemory()
```

### 2.5. CLI sync script

File:

```text
src/scripts/sync-incident-memory.ts
```

## 3. Quy trình triển khai trên server

### Bước 1. Cập nhật branch

```bash
git fetch origin
git checkout feature/digital-twin-control-center
git pull origin feature/digital-twin-control-center
```

### Bước 2. Kiểm tra biến môi trường

Bảo đảm server có:

```bash
echo $OPS_DATABASE_URL
```

### Bước 3. Generate Prisma client

```bash
npm run db:ops:generate
```

### Bước 4. Chạy migration OPS

Tùy cơ chế migration đang dùng trên server, có thể dùng:

```bash
npx prisma migrate deploy --schema=prisma/ops/schema.prisma
```

Hoặc áp dụng SQL trong file:

```text
prisma/ops/migrations/20260628130000_add_incident_memory/migration.sql
```

### Bước 5. Đồng bộ Incident Memory

Do `package.json` chưa bắt buộc thêm script riêng, có thể chạy trực tiếp:

```bash
npx tsx src/scripts/sync-incident-memory.ts
```

Kết quả mong đợi:

```json
{
  "scanned": 100,
  "upserted": 100,
  "sourceBreakdown": {
    "DNF": 40,
    "Hazard": 25,
    "Task": 20,
    "Inspection": 15
  }
}
```

Số lượng thực tế phụ thuộc dữ liệu hiện có trong OPS database.

### Bước 6. Test trên AI Lab

Mở:

```text
/ai-lab
```

Chọn mode:

```text
IncidentLearning
```

Nhập thử:

```text
PG treo sau End of Day xử lý thế nào?
```

hoặc:

```text
PSD đứt dây đai sau đo lực căng
```

Kết quả cần có:

- Nguồn dữ liệu: OPS database hoặc Incident Memory.
- Số lượng hồ sơ đã đọc.
- Sự cố tương tự.
- Điểm tương đồng.
- Giả thuyết nguyên nhân.
- Hành động từng áp dụng.
- Phương án xử lý đề xuất.
- Cảnh báo kỹ thuật: cần xác nhận hiện trường/log/O&M/phê duyệt an toàn.

## 4. Điều kiện nghiệm thu nội bộ

Chỉ nghiệm thu kỹ thuật khi:

- Migration tạo được bảng `ops_incident_memories`.
- Prisma generate pass.
- Sync script chạy thành công.
- AI Lab trả kết quả từ Incident Memory/OPS database.
- Không còn lỗi build/typecheck.
- Kết quả AI có cảnh báo rõ đây là gợi ý tham khảo, không thay thế phê duyệt kỹ thuật.

## 5. Hướng nâng cấp tiếp theo

- Bổ sung UI phê duyệt bài học kinh nghiệm.
- Thêm trạng thái `verified` chỉ dành cho bài học đã được kỹ sư/phụ trách xác nhận.
- Thêm semantic embedding để tìm sự cố tương tự theo ngữ nghĩa.
- Thêm dashboard sự cố lặp lại theo tuyến/ga/hệ thống/tài sản.
- Thêm lịch đồng bộ tự động sau khi DNF/Hazard/Task/Inspection được cập nhật.
