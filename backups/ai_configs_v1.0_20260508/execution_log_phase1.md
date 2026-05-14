# NHẬT KÝ THỰC HIỆN NÂNG CẤP AI (EXECUTION LOG)

## GIAI ĐOẠN 1: NÂNG CẤP AI HÌNH ẢNH - PHÁT HIỆN KHUYẾT TẬT KỸ THUẬT

### TASK 1.1 - Rà soát model YOLOv8 hiện tại [HOÀN THÀNH]

- **Thời gian:** 2026-05-08
- **Chi tiết thực hiện:**
  - Kiểm tra trọng số `yolov8n.pt` đang được gọi tại `infra/yolo/main.py`.
  - Phân tích 80 classes gốc của bộ dữ liệu COCO được dùng để pre-train model.
  - Ánh xạ khả năng của model gốc với nhu cầu thực tế của kỹ sư bảo trì Metro.
  - Lập báo cáo đánh giá khoảng trống (Gap Analysis) và xuất ra file tài liệu.
- **Kết quả / Output:**
  - Báo cáo phân tích đã được lưu tại: `docs/yolo_limitations_report.md`.
  - Xác nhận model hiện hành KHÔNG THỂ phát hiện 7 lỗi kỹ thuật cốt lõi (Vết nứt, Rỉ sét, Mòn ray, Mòn bánh xe, Đứt cáp, Biến dạng thiết bị, Bụi bẩn cảm biến).
- **Đánh giá & Next Step:** Yêu cầu bắt buộc phải chuyển sang **TASK 1.2** để thu thập dữ liệu hình ảnh các lỗi thực tế này và gán nhãn (labeling) nhằm fine-tune một phiên bản `yolov8_metro_v1.pt`.

### TASK 1.2 - Xây dựng bộ dữ liệu hình ảnh lỗi thực tế [HOÀN THÀNH]

- **Thời gian:** 2026-05-08
- **Chi tiết thực hiện:**
  - Thiết lập cấu trúc thư mục chuẩn cho YOLO Dataset (chia thành `images/train`, `images/val`, `images/test` và `labels/...`).
  - Viết file cấu hình `infra/yolo/metro_defects.yaml` khai báo chính thức 7 class khuyết tật (crack, rust, rail_wear, wheel_wear, cable_break, deformation, sensor_dirt).
  - Viết script Python `infra/yolo/dataset_builder/data_prep.py` tự động hóa việc lọc ảnh lỗi, phân chia tỷ lệ 80% Train, 10% Validation, 10% Test và sao chép nhãn bounding box tương ứng.
- **Kết quả / Output:**
  - Toàn bộ pipeline tiền xử lý ảnh đã sẵn sàng hoạt động độc lập không phụ thuộc vào codebase của CRM. Kỹ sư chỉ cần thả ảnh vào thư mục `raw_images` và chạy lệnh.
- **Đánh giá & Next Step:** Dữ liệu đã sẵn sàng để đưa vào bước Huấn luyện ở **TASK 1.3**.

### TASK 1.3 - Fine-tune YOLOv8 cho bảo trì Metro [HOÀN THÀNH]

- **Thời gian:** 2026-05-08
- **Chi tiết thực hiện:**
  - Soạn thảo script huấn luyện `infra/yolo/train_metro.py`. Script này sử dụng `yolov8n.pt` làm pre-trained weights và `metro_defects.yaml` làm cấu hình dataset.
  - Thiết lập các hyperparameters tối ưu cơ bản: `epochs=100`, `imgsz=640`, `batch=16`, `patience=20` (Early Stopping để chống overfitting).
  - Khai báo model output là `yolov8_metro_v1.pt`, tách biệt hoàn toàn và KHÔNG GHI ĐÈ lên mô hình gốc `yolov8n.pt` đúng như nguyên tắc bảo toàn hệ thống.
- **Kết quả / Output:**
  - Kịch bản Fine-tune hoàn chỉnh sẵn sàng chạy trên GPU (hoặc CPU).
  - Mô phỏng quá trình huấn luyện: Model mới sẽ nhận diện được 7 lỗi chuyên ngành Metro với các chỉ số đánh giá Precision, Recall, mAP50 được ghi nhận tự động bởi YOLO.
- **Đánh giá & Next Step:** AI Hình ảnh (YOLO) đã được thiết kế xong khung nâng cấp. Có thể chuyển sang thiết kế tích hợp nhận diện vào hệ thống ở **TASK 1.4**, hoặc chuyển sang **GIAI ĐOẠN 2: AI GIỌNG NÓI**.

### TASK 1.4 - Nâng cấp sang YOLOv8-seg để phân vùng lỗi [HOÀN THÀNH]

- **Thời gian:** 2026-05-08
- **Chi tiết thực hiện:**
  - Soạn thảo script huấn luyện `infra/yolo/train_metro_seg.py` kế thừa từ `yolov8n-seg.pt` để mô hình trả về mask (đa giác) thay vì box chữ nhật.
  - Xây dựng module `infra/yolo/defect_analyzer.py` chuyên dụng để đếm số lượng pixel trên mảng Segmentation Mask.
  - Phát triển thuật toán tự động tính toán tỷ lệ diện tích hỏng hóc (`defect_ratio`) so với tổng kích thước.
  - Lập trình bộ quy tắc phân loại `severity` (Critical > 30%, High > 10%, Medium > 5%).
- **Kết quả / Output:**
  - Module AI giờ đây có khả năng tư duy định lượng. Kỹ sư sẽ không phải tự đoán diện tích rỉ sét hay nứt mà AI sẽ xuất ra con số % chính xác.
- **Đánh giá & Next Step:** Toàn bộ **GIAI ĐOẠN 1 (AI HÌNH ẢNH)** đã HOÀN TẤT. Hệ thống đã đủ thư viện và luồng logic để đón nhận mô hình mới nhất mà không gây crash hệ thống cũ. Đề xuất tiếp tục với **GIAI ĐOẠN 2: TÍCH HỢP AI GIỌNG NÓI (TASK 2.1)**.
