# Đánh giá điểm mạnh, điểm yếu và kế hoạch cải thiện phần mềm HURC-CDHS

## 1. Mục đích

Tài liệu này đánh giá tổng quan phần mềm sau khi bổ sung các khối Digital Twin, Rail Network, Google Maps station link, GIS/BIM Twin, GIS/BIM Import Center, CI/CD và Docker Acceptance Gate.

Nội dung được dùng làm cơ sở cho nghiệm thu kỹ thuật nội bộ và lập kế hoạch cải tiến trước khi triển khai production.

## 2. Điểm mạnh

### 2.1. Kiến trúc chức năng đã mở rộng đúng hướng

Phần mềm không chỉ dừng ở quản lý tài sản đơn lẻ mà đã mở rộng sang mô hình vận hành theo tuyến, ga, hệ thống thiết bị và tài sản. Đây là nền quan trọng để phục vụ môi trường đường sắt đô thị có nhiều tuyến, nhiều nhà ga và nhiều nhóm phụ trách.

Các lớp mới gồm:

- Asset 360 và Digital Twin.
- Mạng tuyến Metro.
- GIS/BIM Twin.
- Import Center.
- Docker/CI Acceptance Gate.

### 2.2. Digital Twin tạo được hồ sơ thiết bị 360 độ

Digital Twin đã tổng hợp được các thông tin chính: điểm rủi ro, độ tin cậy dữ liệu, xác suất hỏng, tuổi thọ còn lại, Digital Thread, cảm biến/ngưỡng vận hành và khuyến nghị bảo trì.

Điểm mạnh của phần này là tạo được một màn hình tập trung để người vận hành nhìn nhanh tình trạng tài sản, thay vì chỉ xem từng bảng dữ liệu rời rạc.

### 2.3. Rail Network giúp phần mềm có bối cảnh tuyến và ga

Việc bổ sung tuyến M1-M6, node nhà ga, ga trung chuyển và liên kết Google Maps giúp phần mềm có bối cảnh không gian tốt hơn. Đây là tiền đề để liên kết DNF, Hazard, Task, Inspection, Asset 360 và GIS/BIM theo vị trí thực tế.

### 2.4. GIS/BIM Twin có cấu trúc dữ liệu tốt cho mở rộng

Schema đã có các lớp quan trọng:

- `GisLayer`.
- `GisFeature`.
- `BimModel`.
- `BimElement`.
- `AssetSpatialLink`.

Mô hình này đúng hướng vì không lưu file BIM nặng trực tiếp trong database, mà lưu metadata và chỉ mục phần tử cần liên kết.

### 2.5. Import GIS/BIM có cơ chế dry-run

Script import GIS/BIM đã có chế độ dry-run để kiểm tra cấu trúc dữ liệu trước khi ghi database. Đây là điểm mạnh quan trọng vì dữ liệu GIS/BIM dễ sai hệ tọa độ, thiếu mã tài sản hoặc sai mã ga.

### 2.6. CI/CD và Docker đã được nâng cấp theo hướng nghiệm thu

CI không chỉ kiểm tra build mà còn có:

- Prisma schema validation.
- Prisma client generation.
- GIS/BIM import dry-run.
- Typecheck.
- Lint.
- Production build.
- Production route smoke test.
- Dependency audit.
- CodeQL.

Docker đã có thêm image build gate, runtime health smoke test và image-level healthcheck.

## 3. Điểm yếu và rủi ro hiện tại

### 3.1. Chưa được nghiệm thu nếu CI/Docker còn fail

Dù phần mềm đã bổ sung nhiều chức năng, điều kiện tiên quyết vẫn là CI và Docker Acceptance Gate phải pass. Nếu một trong hai workflow fail thì chưa nên merge và chưa nghiệm thu.

### 3.2. Dữ liệu GIS/BIM và tuyến ga hiện còn là demo

Dữ liệu hiện tại phục vụ kiểm chứng kiến trúc, chưa phải dữ liệu as-built/GIS chính thức. Nếu dùng trực tiếp cho vận hành sẽ có nguy cơ sai vị trí, sai tên ga, sai liên kết tài sản hoặc sai quyết định bảo trì.

### 3.3. Google Maps hiện dùng truy vấn theo tên ga

Liên kết Google Maps đang dùng query theo tên ga, mã tuyến và khu vực. Cách này an toàn vì không cần API key nhưng độ chính xác phụ thuộc kết quả tìm kiếm của Google Maps.

Cần nâng cấp sang tọa độ chính thức hoặc Google Place ID khi có dữ liệu được xác nhận.

### 3.4. Digital Twin còn dùng dữ liệu mô phỏng/ước lượng

Một phần telemetry, cảm biến và xác suất hỏng hiện vẫn là lớp mô phỏng hoặc tính toán từ dữ liệu hiện có. Chưa nên dùng kết quả này làm căn cứ duy nhất để ra quyết định vận hành/bảo trì.

### 3.5. Import Center chưa có upload/preview/map field thật trên UI

Hiện đã có màn hình nền và script import, nhưng chưa có upload file, preview dữ liệu, mapping field, import batch log và rollback trên giao diện.

### 3.6. Phân quyền theo tuyến/ga/hệ thống/tài sản chưa khóa chặt toàn bộ workflow

Schema đã có hướng phân công trách nhiệm, nhưng các luồng DNF, Hazard, Task, Inspection và GIS/BIM chưa được khóa đồng bộ theo `lineId`, `stationId`, `systemId`, `assetId`.

### 3.7. Chưa có readiness endpoint tách riêng liveness endpoint

`/api/health` hiện dùng tốt cho kiểm tra app còn sống. Tuy nhiên production nên có thêm readiness endpoint để kiểm tra database, cache, migration state và các dependency quan trọng.

## 4. Các cải thiện đã thực hiện trong đợt đánh giá này

- Ổn định bước cài dependency trong Security Gate bằng `npm ci --include=dev --ignore-scripts` để giảm lỗi giả từ preinstall guard.
- Ổn định Docker build bằng `npm ci --legacy-peer-deps --ignore-scripts` trong Dockerfile.
- Ổn định các tool import GIS/BIM trong Docker Compose bằng `--ignore-scripts`.
- Bổ sung production smoke test để kiểm tra app sau build.
- Bổ sung Docker runtime smoke test để kiểm tra container khởi động và trả healthcheck.
- Bổ sung Docker image-level healthcheck.
- Bổ sung tài liệu chiến lược độ tin cậy build và nghiệm thu.

## 5. Kế hoạch cải thiện ưu tiên

### P0 - Bắt buộc trước khi merge/nghiệm thu kỹ thuật

1. Security and Acceptance Gate phải pass.
2. Docker Acceptance Gate phải pass.
3. Không còn lỗi typecheck, lint, production build.
4. Smoke test route chính phải pass.
5. Container phải trả `/api/health` healthy.

### P1 - Bắt buộc trước khi production

1. Tạo migration chính thức cho schema GIS/BIM/Rail Network.
2. Có seed dữ liệu tuyến/ga/tài sản chính thức.
3. Thay dữ liệu demo bằng dữ liệu đã phê duyệt.
4. Bổ sung backup/restore drill.
5. Bổ sung rollback plan cho import GIS/BIM.
6. Bổ sung phân quyền scoped theo tuyến/ga/hệ thống/tài sản.

### P2 - Cải thiện vận hành

1. Bổ sung readiness endpoint.
2. Bổ sung monitoring/alerting.
3. Bổ sung import batch log và rollback import trên UI.
4. Bổ sung viewer GIS/BIM chuyên dụng.
5. Bổ sung telemetry thật từ SNMP/SCADA/MQTT.
6. Bổ sung kiểm thử tải và kiểm thử chịu lỗi.

## 6. Kết luận đánh giá

Phần mềm có nền tảng tốt để phát triển thành hệ thống quản lý kỹ thuật và tài sản số cho đường sắt đô thị. Điểm mạnh nằm ở hướng kiến trúc đúng: Asset 360, Digital Twin, Rail Network, GIS/BIM và Docker/CI Acceptance.

Điểm yếu chính hiện nay không nằm ở ý tưởng chức năng, mà nằm ở mức độ production readiness: dữ liệu còn demo, telemetry còn mô phỏng, import UI chưa hoàn chỉnh, phân quyền scoped chưa phủ toàn bộ workflow và cần CI/Docker pass tuyệt đối trước khi nghiệm thu.

Kết luận: có thể tiếp tục hoàn thiện để nghiệm thu kỹ thuật nội bộ sau khi CI/Docker pass; chưa nên nghiệm thu production khi chưa hoàn tất dữ liệu, migration, backup/restore, rollback và monitoring.
