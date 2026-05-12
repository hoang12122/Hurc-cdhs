# BÁO CÁO RÀ SOÁT MODEL YOLOV8 HIỆN TẠI (TASK 1.1)

**Ngày thực hiện:** 2026-05-08
**Mô hình đang sử dụng:** `yolov8n.pt` (YOLOv8 Nano - Pre-trained trên tập dữ liệu COCO)

## 1. Phân tích các class hiện có của model
Mô hình `yolov8n.pt` nguyên bản được huấn luyện trên tập dữ liệu COCO với 80 classes cơ bản.
- **Các nhóm đối tượng nhận diện được:** Phương tiện giao thông (person, bicycle, car, motorcycle, airplane, bus, train, truck, boat), động vật, vật dụng hàng ngày (đèn giao thông, ghế, bàn, laptop...).
- **Đánh giá:** Mô hình có khả năng nhận diện đối tượng tổng quát "train" (tàu hỏa), nhưng CHỈ DỪNG LẠI ở mức độ phân loại phương tiện, không có giá trị trong bảo trì chuyên sâu.

## 2. Phân tích khoảng trống (Gap Analysis) so với nhu cầu Metro
Để phục vụ công tác bảo trì đường sắt Metro, hệ thống yêu cầu phát hiện các **khuyết tật kỹ thuật (defects)** thay vì đối tượng tĩnh. Dưới đây là danh sách các lỗi mô hình hiện tại **không thể nhận diện được (0% Confidence)**:

| Khuyết tật kỹ thuật | Mức độ nguy hiểm | Tình trạng của `yolov8n.pt` | Yêu cầu đối với Model mới |
| :--- | :--- | :--- | :--- |
| **Vết nứt (Cracks)** | Cao | Không nhận diện được | Cần nhận diện vết nứt trên thân toa, kính, và kết cấu bê tông. |
| **Rỉ sét (Rust)** | Trung bình | Không nhận diện được | Đánh giá mức độ lan rộng của rỉ sét trên giá chuyển hướng, móc nối. |
| **Mòn ray (Rail wear)** | Cao | Không nhận diện được | Phát hiện bề mặt ray xước hoặc mất cạnh. |
| **Mòn bánh xe (Wheel wear)**| Cao | Không nhận diện được | Phát hiện vát mép bánh xe hoặc vết mài mòn quá giới hạn. |
| **Đứt cáp (Cable break)** | Rất Cao | Không nhận diện được | Phát hiện cáp treo, cáp tiếp xúc bị đứt hoặc tưa sợi. |
| **Biến dạng (Deformation)**| Cao | Không nhận diện được | Phát hiện móp méo hộp kỹ thuật, cong vênh đường ray. |
| **Bụi bẩn cảm biến** | Trung bình | Không nhận diện được | Phát hiện mảng bám, dị vật che khuất cảm biến cửa PSD / TVM. |

## 3. Kết luận và Định hướng
Mô hình `yolov8n.pt` hiện tại **không đáp ứng được** nhu cầu thực tiễn của quy trình bảo trì Metro (Zero-value for defects). 

**Đề xuất hành động cho TASK 1.2:**
Bắt buộc phải thực hiện **Transfer Learning / Fine-tuning** mô hình YOLOv8 trên một bộ dữ liệu hoàn toàn mới chuyên biệt cho Metro (`yolov8_metro_v1`). Bộ dữ liệu này cần được gán nhãn (bounding box) cụ thể cho 7 loại khuyết tật liệt kê ở Bảng 2.
