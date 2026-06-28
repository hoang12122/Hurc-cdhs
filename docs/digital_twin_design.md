# Thiết kế bổ sung Digital Twin cho HURC-CDHS

## 1. Mục tiêu

Bổ sung lớp Digital Twin cho phân hệ Asset 360 nhằm chuyển hồ sơ tài sản từ dạng xem thông tin tĩnh sang mô hình vận hành số có khả năng theo dõi trạng thái, đánh giá rủi ro, cảnh báo sớm và đề xuất hành động bảo trì.

Digital Twin trong giai đoạn này không thay đổi cấu trúc cơ sở dữ liệu, tận dụng các nguồn dữ liệu hiện có trong phần mềm gồm:

- Hồ sơ thiết bị: mã thiết bị, tên, danh mục, ngày lắp đặt, trạng thái và thông số kỹ thuật.
- Điểm sức khỏe thiết bị.
- Lịch sử DNF và mối nguy liên quan.
- Kết quả dự báo từ mô hình AI/LSTM hiện hữu.
- Dữ liệu IoT/SNMP mô phỏng để sẵn sàng thay thế bằng nguồn dữ liệu thật.

## 2. Phạm vi bổ sung

### 2.1. Digital Twin Engine

Tạo file `src/lib/digital-twin/digital-twin-engine.ts` để chuẩn hóa logic đánh giá Digital Twin. Engine tạo ra một snapshot gồm:

- Twin ID.
- Loại tài sản: PSD, AFC, Power, Signaling, Track hoặc Metro Equipment.
- Điểm sức khỏe.
- Điểm rủi ro tổng hợp.
- Độ tin cậy dữ liệu.
- Xác suất hỏng và tuổi thọ còn lại.
- Trạng thái đồng bộ dữ liệu.
- Bản đồ cảm biến và ngưỡng vận hành.
- Digital Thread gồm mô hình vật lý, telemetry, reliability và maintenance response.
- Danh sách khuyến nghị vận hành/bảo trì.

### 2.2. Digital Twin Control Center

Tạo file `src/app/(app)/asset-360/_components/digital-twin-control-center.tsx` để hiển thị trung tâm điều khiển Digital Twin trong màn hình Asset 360. Giao diện gồm:

- Khối tổng quan Digital Twin: điểm rủi ro, độ tin cậy dữ liệu, xác suất hỏng và tuổi thọ còn lại.
- Khối Digital Thread: trạng thái từng lớp dữ liệu.
- Bản đồ cảm biến và ngưỡng vận hành.
- Khuyến nghị bảo trì/vận hành.
- Hồ sơ vận hành và định hướng tích hợp dữ liệu thật.

### 2.3. Mô hình 3D theo loại tài sản

Cập nhật file `src/app/(app)/asset-360/_components/3d-equipment-model.tsx` để mô hình 3D không chỉ là khối hộp chung mà có thể hiển thị khác nhau theo loại thiết bị:

- PSD: mô hình cửa ke ga, cụm panel và đèn trạng thái.
- AFC: mô hình cổng soát vé/gate.
- Thiết bị khác: mô hình thiết bị metro tổng quát.

Màu sắc và hiệu ứng của mô hình thay đổi theo trạng thái sức khỏe: healthy, warning hoặc critical.

## 3. Nguyên tắc thiết kế

- Không phá vỡ dữ liệu hiện có.
- Không bắt buộc migration database trong giai đoạn đầu.
- Có thể hoạt động ngay với dữ liệu hiện có và mock telemetry.
- Sẵn sàng thay thế mock bằng API thật từ IoT, SNMP, SCADA Gateway hoặc MQTT broker.
- Phù hợp với định hướng quản lý vận hành metro: theo dõi thiết bị, DNF, mối nguy, bảo trì và dự báo hỏng hóc.

## 4. Luồng dữ liệu đề xuất

```text
Asset / Equipment Master Data
        +
DNF / Hazard / Maintenance History
        +
IoT / SNMP / SCADA Telemetry
        +
AI Predictive Model
        ↓
Digital Twin Engine
        ↓
Digital Twin Control Center
        ↓
Cảnh báo - Khuyến nghị - Bảo trì dự báo - FRACAS
```

## 5. Hướng mở rộng giai đoạn sau

- Bổ sung bảng `DigitalTwinSnapshot` để lưu lịch sử trạng thái theo thời gian.
- Bổ sung bảng `TelemetryReading` hoặc dùng bảng hiện có trong DB metro để lưu dữ liệu thật.
- Kết nối SNMP/SCADA/MQTT cho thiết bị AFC, PSD, nguồn điện và mạng.
- Tự động tạo DNF hoặc cảnh báo bảo trì khi vượt ngưỡng.
- Liên kết mô hình 3D/BIM theo vị trí ga, tầng, phòng thiết bị và tuyến.
- Bổ sung bản đồ tuyến metro để xem trạng thái tài sản theo ga.

## 6. Ghi chú triển khai

Phần bổ sung hiện tại là lớp ứng dụng và logic tổng hợp. Khi có dữ liệu thật, chỉ cần thay nguồn telemetry trong engine hoặc tạo server action/API route để lấy dữ liệu từ hệ thống giám sát mà không cần thay đổi giao diện chính.
