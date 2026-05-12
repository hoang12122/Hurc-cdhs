# BÁO CÁO ĐÁNH GIÁ EDGE AI (OFFLINE INFERENCE)
**Dự án:** Trợ lý Kỹ thuật AI (Hurc1CRM)
**Ngày thực hiện:** 2026-05-08

## 1. MỤC TIÊU
Xác định tính khả thi của việc đưa các mô hình AI (YOLO Vision, Whisper Voice) từ Server xuống chạy trực tiếp trên thiết bị của kỹ sư hiện trường (Tablet, Smartphone) nhằm khắc phục vấn đề rớt mạng tại các môi trường ngầm/kín.

---

## 2. KIỂM TRA MÔI TRƯỜNG HIỆN TRƯỜNG & THIẾT BỊ
### Các tình huống mất mạng (Dead Zones):
1. **Dưới hầm (Underground Stations & Tunnels):** Ga Bến Thành, Ga Nhà hát Thành phố, Ga Ba Son và hầm nối. Sóng 4G/5G rất yếu hoặc mất tịt do kết cấu bê tông cốt thép dày.
2. **Khu vực Depot (Suối Tiên):** Tại các nhà xưởng bảo dưỡng sâu bên trong, vách tôn và máy móc lớn gây nhiễu sóng mạnh.
3. **Phòng điều khiển tín hiệu (Signaling Rooms):** Thường đóng kín và chống nhiễu điện từ.

### Cấu hình thiết bị người dùng (Target Devices):
- Kỹ sư dùng Tablet: Vi xử lý tầm trung (Snapdragon 7-series / Apple A12+), RAM 4GB - 8GB.
- Khả năng tính toán: Tốt cho các mô hình < 50MB, nhưng bị thắt cổ chai ở nhiệt độ và thời lượng pin.

---

## 3. ĐÁNH GIÁ MÔ HÌNH HIỆN TẠI
### YOLOv11 (Visual Inspection AI)
- **Dung lượng hiện tại:** Dòng `.pt` gốc thường nặng từ 20MB (YOLO11n) đến 80MB (YOLO11s).
- **Tốc độ xử lý:** Trên Server có GPU chạy mất 20ms/ảnh. Trên điện thoại CPU có thể mất 300ms - 800ms/ảnh.
- **Tính khả thi:** CẦN TỐI ƯU. Cần lượng hóa và chuyển đổi định dạng (TensorFlow Lite hoặc ONNX int8) để giảm size xuống ~5MB và chạy trên NPU của điện thoại.

### Whisper (Voice-to-Text)
- **Dung lượng hiện tại:** `base` model nặng khoảng 140MB.
- **Tính khả thi:** CAO. Web Speech API (chạy native trên trình duyệt) đã giải quyết tốt phần thời gian thực. Nhưng nếu offline 100%, có thể nhúng thư viện `whisper.cpp` (chạy C++) vào client.

---

## 4. DANH SÁCH TÍNH NĂNG ƯU TIÊN CHẠY OFFLINE
Dựa trên phân tích, đây là các module buộc phải chạy mượt mà ngay cả khi kỹ sư không có Internet:

1. **Nhập liệu bằng giọng nói (Voice Input):** Bắt buộc. Kỹ sư phải ghi âm rảnh tay được dưới hầm. Sẽ lưu audio tạm và dịch ra text offline (hoặc dịch ngay khi có mạng nếu Web Speech API không cache offline).
2. **Nhận diện lỗi rỉ sét / khe hở bằng Camera (Edge YOLO):** Bắt buộc. Khi đang đứng cạnh bánh xe lửa, giơ camera lên là AI phải tự khoanh vùng lỗi màu đỏ trên màn hình tablet mà không chờ load mạng.
3. **Lưu tạm sự cố (Offline Sync):** Dữ liệu DNF JSON phải được lưu vào IndexedDB.

---

## 5. KẾT LUẬN & ĐỀ XUẤT (Next Steps)
- **Khả thi 100%**, tuy nhiên yêu cầu tinh chỉnh kỹ thuật gắt gao.
- **Bước tiếp theo (Task 5.2):** Cần chuyển đổi mô hình YOLO `.pt` gốc sang định dạng `.onnx` hoặc `.tflite`. Sau đó kết hợp với ONNX Runtime Web (WASM) để chạy model thị giác máy tính trực tiếp bên trong trình duyệt của Hurc1CRM Frontend (React).
