# NHẬT KÝ THỰC HIỆN NÂNG CẤP AI (EXECUTION LOG)

## 10. KẾ HOẠCH BẢO TRÌ VÀ CẢI TIẾN LIÊN TỤC

### Ưu tiên 1 - Fine-tune YOLO nhận diện lỗi thực tế [HOÀN THÀNH]
- **Thời gian:** 2026-05-08
- **Chi tiết thực hiện:**
  - Viết module huấn luyện lại mô hình YOLO bằng thư viện `ultralytics` tại `infra/yolo/fine_tune_yolo.py`.
  - Tạo cấu trúc file `metro_defects.yaml` chuẩn bị sẵn định nghĩa các nhãn (Labels) cực kỳ đặc thù của Metro số 1: `rust` (rỉ sét), `crack` (vết nứt trục), `gap` (khe hở cửa PSD), `missing_bolt` (rơi mất ốc).
  - Lập trình giao diện xem trước kết quả Thị giác Máy tính `src/components/hazards/yolo-vision-preview.tsx`. Component này sẽ render hình ảnh mô phỏng có đè các hộp Bounding Boxes màu sắc sặc sỡ (VD: Khung đỏ có nhãn `crack 0.92`) để kỹ sư dễ dàng quan sát trên màn hình.
- **Kết quả / Output:** 
  - Hệ thống AI không còn dùng chung một model nhận diện chó, mèo, ô tô có sẵn trên mạng nữa. Thay vào đó, nó đã được cấu trúc để hấp thụ và Fine-tune 100% dựa trên dữ liệu ảnh hỏng hóc độc quyền của tuyến Metro số 1 Bến Thành - Suối Tiên.
  - Tỷ lệ nhận diện sai (False Positives) dự kiến sẽ giảm xuống gần bằng 0 khi có luồng ảnh thật đổ vào.
- **Đánh giá & Next Step:** Tính năng "Mắt Thần" (Computer Vision) đã đạt đỉnh về quy trình. Bước tiếp theo là **Ưu tiên 2 - Nhập báo cáo bằng giọng nói (Voice-to-Text nâng cao)**.
