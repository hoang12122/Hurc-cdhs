# Thiết kế tích hợp GIS/BIM cho HURC-CDHS

## 1. Mục tiêu

Bổ sung nền tảng tích hợp GIS/BIM để phần mềm không chỉ quản lý sự cố, mối nguy và tài sản theo danh sách, mà còn quản lý theo không gian vận hành thực tế của tuyến đường sắt đô thị.

Mục tiêu chính:

- Liên kết tuyến, ga, tài sản, thiết bị và khu vực vận hành với tọa độ GIS.
- Liên kết tài sản trong Asset 360 với phần tử BIM tương ứng.
- Hiển thị DNF, Hazard, Telemetry, Digital Twin trên bản đồ và mô hình không gian.
- Hình thành Spatial Digital Twin phục vụ vận hành, bảo trì, an toàn và nghiệm thu tài sản.

## 2. Kiến trúc dữ liệu đề xuất

### 2.1. GIS

Các bảng đã bổ sung trong `prisma/metro/schema.prisma`:

- `GisLayer`: lưu thông tin lớp bản đồ như tuyến, nhà ga, tim tuyến, hầm, cầu cạn, vùng rủi ro, tài sản.
- `GisFeature`: lưu từng đối tượng bản đồ, hình học GeoJSON và thuộc tính đi kèm.

Nguồn dữ liệu hỗ trợ theo thiết kế:

- GeoJSON.
- WMS/WMTS.
- ArcGIS Service.
- PostGIS.

### 2.2. BIM

Các bảng đã bổ sung:

- `BimModel`: quản lý mô hình BIM theo tuyến, ga, bộ môn, phiên bản và trạng thái.
- `BimElement`: quản lý từng phần tử BIM như PSD, AFC, phòng kỹ thuật, kết cấu, MEP, đường ray.

Nguồn dữ liệu hỗ trợ theo thiết kế:

- IFC.
- glTF/glb.
- Revit export.
- Point Cloud.

### 2.3. Liên kết tài sản

Bảng `AssetSpatialLink` dùng để liên kết:

- Asset 360 ↔ GIS Feature.
- Asset 360 ↔ BIM Element.
- Tài sản ↔ vị trí lắp đặt.
- Tài sản ↔ đối tượng được giám sát.
- Tài sản ↔ Digital Twin.

## 3. Luồng tích hợp nghiệp vụ

1. Nhập dữ liệu nguồn: nhận GIS/BIM từ đơn vị thiết kế, nhà thầu, CDE hoặc hệ thống bản đồ.
2. Chuẩn hóa dữ liệu: thống nhất hệ tọa độ, mã tuyến, mã ga, mã thiết bị, mã tài sản, mã phần tử BIM.
3. Liên kết tài sản: gán `assetId` với `gisFeatureId` và/hoặc `bimElementId`.
4. Hiển thị vận hành: xem tài sản, DNF, Hazard, Telemetry trên bản đồ GIS/BIM.
5. Phân quyền: giới hạn người dùng theo tuyến, ga, hệ thống, tài sản và đơn vị phụ trách.
6. Nghiệm thu: chỉ đưa vào vận hành khi mô hình đã có phiên bản, người phê duyệt và trạng thái as-built.

## 4. Giao diện đã bổ sung

Tạo trang `src/app/(app)/spatial-twin/page.tsx` và component `GisBimViewer` để hiển thị:

- GIS Operational Map.
- Các lớp tuyến, ga, vùng rủi ro.
- BIM Model Registry.
- Danh sách phần tử BIM đã/đang chờ liên kết với Asset 360.
- Luồng tích hợp GIS/BIM.
- Ghi chú nghiệm thu dữ liệu.

Mục điều hướng mới: `GIS/BIM Twin`.

## 5. Cách tích hợp dữ liệu thật

### 5.1. GIS

Khi có dữ liệu thật, cần thực hiện:

- Xác định hệ tọa độ sử dụng, ví dụ EPSG:4326 hoặc hệ tọa độ dự án.
- Import lớp tuyến, ga, ranh bảo vệ, hầm, cầu cạn, depot, vùng rủi ro.
- Kiểm tra hình học, thuộc tính và mã định danh.
- Gán `lineId`, `stationId`, `assetId` cho từng đối tượng quan trọng.

### 5.2. BIM

Khi có mô hình BIM thật, cần thực hiện:

- Chuẩn hóa tên file, phiên bản, bộ môn và trạng thái mô hình.
- Tách hoặc index các phần tử quan trọng: PSD, AFC, MEP, kết cấu, phòng kỹ thuật, lối thoát nạn.
- Lưu `globalId` hoặc mã định danh tương đương của phần tử BIM.
- Liên kết phần tử BIM với Asset 360.
- Quy định rõ mô hình nào là thiết kế, mô hình nào là as-built.

## 6. Yêu cầu nghiệm thu dữ liệu GIS/BIM

Trước khi sử dụng trong vận hành chính thức, cần kiểm tra:

- Dữ liệu có nguồn gốc rõ ràng.
- Hệ tọa độ đúng và thống nhất.
- Mã tuyến, mã ga, mã tài sản không trùng lặp.
- Tài sản quan trọng có liên kết GIS/BIM.
- Mô hình BIM có phiên bản và trạng thái phê duyệt.
- Các dữ liệu demo không được dùng làm dữ liệu vận hành chính thức.

## 7. Hướng phát triển tiếp theo

- Bổ sung API import GeoJSON/IFC metadata.
- Bổ sung viewer WebGIS chuyên dụng bằng MapLibre/Leaflet/OpenLayers.
- Bổ sung viewer BIM chuyên dụng bằng IFC.js hoặc glTF viewer.
- Bổ sung PostGIS nếu cần truy vấn không gian nâng cao.
- Bổ sung chức năng click tài sản trên bản đồ để mở Asset 360/Digital Twin.
- Bổ sung hiển thị DNF/Hazard theo lớp bản đồ.
- Bổ sung phân quyền theo tuyến, ga, hệ thống, tài sản.
