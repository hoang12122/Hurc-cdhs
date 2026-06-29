# Báo cáo rà soát logic chức năng, workflow và nghiệm thu phần mềm HURC-CDHS

## 1. Mục đích

Tài liệu này tổng hợp kết quả rà soát các chức năng chính của phần mềm sau khi bổ sung Digital Twin, mạng tuyến Metro, GIS/BIM Twin, Import Center, CI và Docker Acceptance Gate.

Mục tiêu là xác định rõ:

- Chức năng nào đã có thể nghiệm thu kỹ thuật nội bộ.
- Chức năng nào cần tiếp tục sửa, cải thiện hoặc chưa nên dùng production.
- Luồng kết nối giữa các phân hệ có hợp lý hay chưa.
- Điều kiện nghiệm thu tối thiểu trước khi merge và triển khai bằng Docker.

## 2. Ma trận chức năng và trạng thái rà soát

| Nhóm chức năng | Thành phần | Trạng thái hiện tại | Nhận xét | Hành động cần làm |
| --- | --- | --- | --- | --- |
| Dashboard | `/dashboard` | Có sẵn | Chưa bị thay đổi trực tiếp trong PR này | Smoke test sau Docker build |
| DNF | `/dnf` | Có sẵn | Có thể liên kết về Asset/Digital Twin theo thiết kế, nhưng chưa gắn GIS/BIM trực tiếp | Bổ sung `lineId`, `stationId`, `assetId` ở giai đoạn sau |
| Hazard | `/hazards` | Có sẵn | Có nền để liên kết vùng rủi ro GIS, nhưng hiện chưa hiển thị trực tiếp trên bản đồ thật | Bổ sung overlay Hazard trên GIS Viewer |
| Task/Project | `/tasks` | Có sẵn | Có luồng phân công công việc, nhưng chưa khóa theo tuyến/ga/hệ thống | Bổ sung scoped permission và assignment rule |
| Inspection | `/inspections` | Có sẵn | Chưa kết nối trực tiếp với BIM element/AssetSpatialLink | Bổ sung checklist theo tài sản và vị trí BIM |
| Asset 360 | `/asset-360` | Đã bổ sung Digital Twin | Có AI health, IoT telemetry, 3D model và Digital Twin Control Center | Cần kiểm tra thủ công với dữ liệu thật |
| Digital Twin Engine | `src/lib/digital-twin` | Đã có | Đang dùng snapshot từ equipment, health, DNF, hazard và prediction | Sau này cần thay dữ liệu mô phỏng bằng telemetry thật |
| Rail Network | `/rail-network` | Đã có | Hiển thị sơ đồ tuyến M1-M6, node trắng là nhà ga, ga trung chuyển có viền | Cần thay tọa độ sơ đồ bằng GIS chính thức nếu dùng production |
| GIS/BIM Twin | `/spatial-twin` | Đã có | Có GIS Operational Map, BIM Model Registry, luồng liên kết dữ liệu | Chưa phải viewer GIS/BIM chuyên dụng |
| GIS/BIM Import Center | `/spatial-twin/import` | Đã có bản nền | Thể hiện quy trình import, validate và lệnh dry-run/commit | Chưa có upload thật trên UI |
| GIS/BIM import script | `src/scripts/import-gis-bim.ts` | Đã có | Có dry-run và commit; validate GeoJSON/BIM metadata | Cần migration/backup trước khi chạy commit production |
| Docker | `Dockerfile`, `docker-compose.yml` | Đã cập nhật | Docker build có validate schema và GIS/BIM dry-run | Chờ Docker Acceptance Gate pass |
| CI | GitHub Actions | Đã cập nhật | Có Security Gate và Docker Acceptance Gate | Chỉ nghiệm thu khi cả hai pass |

## 3. Kiểm tra tính logic kết nối giữa các phân hệ

### 3.1. Luồng tài sản - Digital Twin

Luồng hợp lý:

1. Asset 360 chọn thiết bị.
2. Equipment Health, DNF, Hazard và AI prediction được đưa vào Digital Twin snapshot.
3. Digital Twin Control Center hiển thị risk score, data confidence, failure probability, remaining useful life, Digital Thread và khuyến nghị xử lý.

Điểm cần cải thiện:

- Cần chuẩn hóa nguồn telemetry thật từ SNMP/SCADA/MQTT.
- Cần tách rõ dữ liệu mô phỏng và dữ liệu vận hành thật.
- Cần lưu lịch sử snapshot nếu muốn phục vụ FRACAS và phân tích xu hướng.

### 3.2. Luồng tuyến - ga - tài sản

Luồng hợp lý:

1. Rail Network quản lý tuyến và ga.
2. Asset có `stationId`, `systemId`, `subsystem`.
3. ResponsibilityAssignment gán người phụ trách theo tuyến/ga/hệ thống/tài sản.

Điểm cần cải thiện:

- `stationId`, `systemId`, `assetId` ở một số bảng nghiệp vụ vẫn là dạng string hoặc chưa được áp dụng đồng bộ.
- Cần bổ sung khóa ngoại hoặc mapping service để chống sai mã.
- Cần mở rộng phân quyền scoped cho tất cả server actions quan trọng.

### 3.3. Luồng GIS/BIM - Asset 360

Luồng hợp lý:

1. GIS Layer lưu lớp bản đồ.
2. GIS Feature lưu đối tượng không gian.
3. BIM Model lưu mô hình.
4. BIM Element lưu phần tử BIM.
5. AssetSpatialLink liên kết Asset 360 với GIS Feature/BIM Element.

Điểm cần cải thiện:

- Chưa có viewer chuyên dụng để mở IFC/glTF thật.
- Chưa có import UI thật, mới có Import Center nền và script.
- Chưa có cơ chế phê duyệt phiên bản mô hình BIM trên UI.

### 3.4. Luồng import GIS/BIM

Luồng hiện tại:

1. Chuẩn bị file GeoJSON và BIM metadata.
2. Chạy `npm run import:gis-bim:dry-run`.
3. Khi dữ liệu đạt, chạy migration và backup.
4. Chạy `npm run import:gis-bim:commit`.
5. Kiểm tra Spatial Twin, Rail Network và Asset 360.

Điểm cần cải thiện:

- Cần thêm màn hình upload/preview/map field thực tế.
- Cần thêm log import batch.
- Cần thêm rollback import theo batch.

### 3.5. Luồng Docker/CI

Luồng hiện tại:

1. Security and Acceptance Gate kiểm tra Prisma, import dry-run, typecheck, lint, build, audit, CodeQL.
2. Docker Acceptance Gate kiểm tra Docker Compose config và Docker image build.
3. Dockerfile cũng tự chạy validate schema và GIS/BIM dry-run trước build.

Điểm cần cải thiện:

- Cần bổ sung smoke test container sau khi build image nếu thời gian CI cho phép.
- Cần thêm backup/restore drill trước khi import production.
- Cần thêm artifact báo cáo nghiệm thu sau CI.

## 4. Các điểm đã sửa/cải thiện trong đợt rà soát này

- Bổ sung Docker Acceptance Gate.
- Cập nhật Dockerfile để kiểm tra Prisma schema và GIS/BIM dry-run trong Docker build.
- Cập nhật docker-compose để app chờ database/cache healthy.
- Bổ sung profile `tools` cho import GIS/BIM bằng Docker.
- Cập nhật `.dockerignore` để giảm rủi ro đưa dữ liệu runtime vào build context.
- Bổ sung GIS/BIM Import Center.
- Bổ sung runbook import GIS/BIM.
- Bổ sung runbook nghiệm thu Docker.
- Làm chặt typing/fallback cho Rail Network Map.
- Làm chặt typing/fallback cho GIS/BIM Viewer.

## 5. Các điểm cần sửa tiếp trước production

### 5.1. Bắt buộc trước khi nghiệm thu kỹ thuật

- Security and Acceptance Gate phải pass.
- Docker Acceptance Gate phải pass.
- Typecheck không còn lỗi.
- Docker image build thành công.
- Smoke test các trang chính thành công.

### 5.2. Bắt buộc trước khi nghiệm thu vận hành chính thức

- Tạo migration production cho schema mới.
- Kiểm tra backup/restore database.
- Thay dữ liệu GIS/BIM demo bằng dữ liệu chính thức.
- Có quy trình phê duyệt dữ liệu as-built.
- Có phân quyền theo tuyến/ga/hệ thống/tài sản.
- Có log import và rollback import.
- Có viewer GIS/BIM chuyên dụng nếu dùng dữ liệu không gian thật.

## 6. Checklist nghiệm thu thủ công

| Mục kiểm tra | Đường dẫn/lệnh | Tiêu chí đạt |
| --- | --- | --- |
| Health API | `/api/health` | Trả về `status: healthy` |
| Dashboard | `/dashboard` | Tải không lỗi |
| Asset 360 | `/asset-360` | Chọn thiết bị, thấy Digital Twin Control Center |
| Rail Network | `/rail-network` | Hiển thị tuyến, ga trắng, ga trung chuyển |
| Spatial Twin | `/spatial-twin` | Hiển thị GIS map và BIM registry |
| Import Center | `/spatial-twin/import` | Hiển thị quy trình import và lệnh dry-run/commit |
| DNF | `/dnf` | Tải và thao tác cơ bản không lỗi |
| Hazard | `/hazards` | Tải và thao tác cơ bản không lỗi |
| Docker compose | `docker compose --profile core --profile tools config` | Không lỗi cấu hình |
| Docker build | `docker image build --file Dockerfile --tag hurc-cdhs:local .` | Build thành công |
| Import dry-run | `npm run import:gis-bim:dry-run` | Validation passed |

## 7. Kết luận nghiệm thu

Tại thời điểm rà soát, phần mềm đã có kiến trúc mở rộng tốt hơn so với bản ban đầu, đặc biệt ở các lớp Digital Twin, Rail Network, GIS/BIM và Docker Acceptance. Tuy nhiên, chưa được nghiệm thu production nếu CI chưa pass và chưa có dữ liệu GIS/BIM chính thức.

Có thể xem xét nghiệm thu kỹ thuật nội bộ khi:

1. Security and Acceptance Gate pass.
2. Docker Acceptance Gate pass.
3. Kiểm thử thủ công theo mục 6 đạt.
4. Không có lỗi nghiêm trọng trên log Docker.
5. Các dữ liệu demo được ghi chú rõ, không dùng làm dữ liệu vận hành chính thức.
