# Thiết kế bổ sung mô hình mạng tuyến đường sắt đô thị

## 1. Mục tiêu

Bổ sung mô hình tuyến đường sắt đô thị để phần mềm có thể mở rộng từ quản lý một tuyến sang quản lý nhiều tuyến, nhiều nhà ga, nhiều hệ thống thiết bị và nhiều nhóm nhân sự phụ trách.

Trên giao diện, các nút tròn màu trắng được quy ước là vị trí nhà ga. Các nút có viền đậm là ga trung chuyển hoặc điểm giao giữa nhiều tuyến.

## 2. Phạm vi đã bổ sung

### 2.1. Mô hình dữ liệu tuyến và ga

Bổ sung các bảng trong `prisma/metro/schema.prisma`:

- `RailLine`: quản lý tuyến, mã tuyến, màu tuyến, trạng thái và ga đầu/cuối.
- `RailStation`: quản lý nhà ga, mã ga, tên ga, loại ga, tọa độ hiển thị trên sơ đồ và trạng thái.
- `RailLineStation`: bảng trung gian thể hiện một ga thuộc tuyến nào, thứ tự ga trên tuyến và điểm trung chuyển.
- `ResponsibilityAssignment`: phân công người phụ trách theo tuyến, ga, hệ thống, phân hệ hoặc tài sản.

Thiết kế này giúp tách rõ dữ liệu tuyến/ga khỏi dữ liệu tài sản, đồng thời tạo nền cho phân quyền theo phạm vi vận hành.

### 2.2. Dữ liệu sơ đồ tuyến ở lớp ứng dụng

Tạo file `src/lib/rail-network/rail-network-data.ts` để chuẩn hóa dữ liệu tuyến M1-M6 theo ảnh sơ đồ tham khảo. Dữ liệu gồm:

- Mã tuyến.
- Tên tuyến.
- Màu tuyến.
- Trạng thái.
- Ga đầu/cuối.
- Danh sách nhà ga.
- Tọa độ hiển thị sơ đồ.
- Nhận diện ga thường, ga đầu/cuối và ga trung chuyển.

### 2.3. Giao diện mô hình tuyến đường sắt

Tạo trang `src/app/(app)/rail-network/page.tsx` và component `MetroLineMap` để hiển thị:

- Sơ đồ tuyến đường sắt dạng SVG.
- Các tuyến M1-M6 theo màu riêng.
- Các nhà ga là nút tròn trắng.
- Ga trung chuyển có viền nhấn mạnh.
- Bộ lọc chọn tuyến.
- Danh sách nhà ga theo từng tuyến.
- Ghi chú định hướng liên kết dữ liệu GIS/BIM/Digital Twin.

### 2.4. Điều hướng hệ thống

Bổ sung mục `Mạng tuyến Metro` trong thanh điều hướng chính để người dùng truy cập nhanh mô hình mạng tuyến.

## 3. Hướng liên kết với các phân hệ khác

Mô hình tuyến/ga sẽ là lớp dữ liệu nền để liên kết với:

- Asset 360/Digital Twin: mỗi tài sản gắn với tuyến, ga, hệ thống và vị trí cụ thể.
- DNF: sự cố được xác định theo tuyến, ga, hệ thống và thiết bị liên quan.
- Hazard: mối nguy được theo dõi theo khu vực, tuyến, ga và phạm vi ảnh hưởng.
- Task/Corrective Action: phân công người xử lý theo trách nhiệm vận hành thực tế.
- Dashboard: tổng hợp cảnh báo, tình trạng thiết bị và sự cố theo tuyến/ga.
- Phân quyền: người dùng chỉ xem/xử lý dữ liệu trong phạm vi được giao.

## 4. Ghi chú nghiệm thu

Dữ liệu tọa độ hiện tại là tọa độ sơ đồ hóa để hiển thị theo ảnh tham khảo, chưa phải tọa độ GIS chính thức. Khi có dữ liệu GIS/BIM/As-built, cần cập nhật lại trường `mapX`, `mapY` hoặc bổ sung tọa độ địa lý thực tế để phục vụ bản đồ vận hành chính thức.

## 5. Hướng mở rộng tiếp theo

- Bổ sung API/server action để đọc tuyến và ga từ database thay vì cấu hình tĩnh.
- Bổ sung màn hình quản trị tuyến/ga.
- Bổ sung chức năng gán tài sản vào tuyến/ga.
- Bổ sung chức năng gán người phụ trách theo tuyến/ga/hệ thống.
- Bổ sung lớp phân quyền scoped theo `lineId`, `stationId`, `systemId`, `assetId`.
- Bổ sung liên kết sơ đồ tuyến với Digital Twin và cảnh báo vận hành thời gian thực.
