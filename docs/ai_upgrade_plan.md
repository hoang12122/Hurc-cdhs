# KẾ HOẠCH NÂNG CẤP HỆ THỐNG AI CHO PHẦN MỀM QUẢN LÝ BẢO TRÌ / BẢO DƯỠNG ĐƯỜNG SẮT METRO

## 1. Nguyên tắc thực hiện

- Không xóa, ghi đè hoặc vô hiệu hóa các rule, workflow, chức năng AI hiện hữu.
- Chỉ thực hiện theo hướng:
  - Bổ sung tính năng mới.
  - Cải tiến độ chính xác.
  - Sửa lỗi vận hành.
  - Tối ưu hiệu năng.
  - Mở rộng dữ liệu huấn luyện.
- Mọi thay đổi phải có cơ chế rollback khi phát sinh lỗi.
- Các model AI mới phải chạy song song hoặc kế thừa từ model cũ trong giai đoạn thử nghiệm.
- Dữ liệu, rule, prompt, pipeline hiện tại phải được sao lưu trước khi nâng cấp.
- Các thay đổi phải được ghi nhận trong changelog, có version rõ ràng.

---

## 2. Tổng quan hiện trạng

### 2.1 Nền tảng AI hiện có

- AI hình ảnh: YOLOv8.
- AI văn bản: Gemma.
- Tra cứu tài liệu: RAG.
- AI server hiện hữu: xử lý tập trung qua server.
- Dữ liệu nghiệp vụ: DNF, Inspection, Hazard, báo cáo bảo trì, lịch sử thiết bị.

### 2.2 Mục tiêu nâng cấp

- Chuyển AI hình ảnh từ nhận diện vật thể thông thường sang phát hiện lỗi kỹ thuật thực tế.
- Bổ sung khả năng nhập báo cáo bằng giọng nói cho kỹ sư hiện trường.
- Phát triển AI dự đoán hư hỏng thiết bị.
- Xây dựng đồ thị tri thức kỹ thuật theo cấu trúc thiết bị Metro.
- Từng bước đưa AI xuống thiết bị di động để hỗ trợ offline.

---

## 3. Danh sách task triển khai chi tiết

### GIAI ĐOẠN 0: RÀ SOÁT VÀ BẢO TOÀN HỆ THỐNG HIỆN HỮU

#### TASK 0.1 - Sao lưu rule và cấu hình hiện tại

**Mục tiêu:**  
Đảm bảo toàn bộ rule, prompt, pipeline, cấu hình model và workflow hiện tại được giữ nguyên trước khi nâng cấp.

**Công việc cụ thể:**

- [x] Rà soát toàn bộ rule hiện hữu của hệ thống.
- [x] Xuất danh sách rule hiện tại ra file version.
- [x] Sao lưu prompt của Gemma.
- [x] Sao lưu cấu hình RAG.
- [x] Sao lưu pipeline xử lý YOLOv8 hiện tại.
- [x] Sao lưu API route liên quan đến AI server.
- [x] Tạo thư mục backup theo ngày triển khai.
- [x] Ghi nhận version hệ thống trước nâng cấp.

**Kết quả đầu ra:**

- File backup rule hiện tại.
- File backup cấu hình AI.
- Changelog version trước nâng cấp.
- Danh sách rule không được xóa hoặc ghi đè.

---

### TASK 0.2 - Thiết lập nguyên tắc nâng cấp không phá vỡ hệ thống cũ

**Mục tiêu:**  
Bảo đảm các tính năng mới chỉ bổ sung hoặc mở rộng, không làm mất chức năng hiện hữu.

**Công việc cụ thể:**

- [x] Tạo cơ chế version cho rule.
- [x] Rule cũ giữ nguyên trạng thái `active`.
- [x] Rule mới đặt trạng thái `experimental` hoặc `enhanced`.
- [x] Không sửa trực tiếp logic cũ nếu chưa có kiểm thử.
- [x] Tạo cơ chế bật/tắt tính năng mới bằng feature flag.
- [x] Tạo cấu hình rollback về model/rule cũ.
- [x] Kiểm thử lại toàn bộ chức năng cũ sau mỗi lần nâng cấp.

**Kết quả đầu ra:**

- Cơ chế quản lý rule theo version.
- Feature flag cho từng nhóm tính năng mới.
- Tài liệu rollback hệ thống.

---

## 4. NÂNG CẤP AI HÌNH ẢNH - PHÁT HIỆN KHUYẾT TẬT KỸ THUẬT

### TASK 1.1 - Rà soát model YOLOv8 hiện tại

**Mục tiêu:**  
Đánh giá giới hạn của model YOLOv8 hiện tại trước khi nâng cấp.

**Công việc cụ thể:**

- [x] Kiểm tra model hiện đang sử dụng: `yolov8n.pt`.
- [x] Xác định các class hiện có của model.
- [x] Đánh giá khả năng nhận diện hình ảnh thiết bị Metro.
- [x] Ghi nhận các lỗi model chưa nhận diện được như:
  - Vết nứt.
  - Rỉ sét.
  - Mòn ray.
  - Mòn bánh xe.
  - Đứt cáp.
  - Biến dạng thiết bị.
  - Bụi bẩn cảm biến.
- [x] Lập báo cáo khoảng trống giữa model hiện tại và nhu cầu thực tế.

**Kết quả đầu ra:**

- Báo cáo đánh giá model YOLOv8 hiện tại.
- Danh sách lỗi kỹ thuật cần huấn luyện bổ sung.

---

### TASK 1.2 - Xây dựng bộ dữ liệu hình ảnh lỗi thực tế

**Mục tiêu:**  
Tạo bộ dữ liệu chuyên ngành Metro để fine-tune YOLO.

**Công việc cụ thể:**

- [x] Thu thập hình ảnh thực tế từ các đợt kiểm tra, bảo trì, DNF.
- [x] Phân loại hình ảnh theo nhóm thiết bị:
  - Ray.
  - Bánh xe.
  - Giá chuyển hướng.
  - Cổng soát vé.
  - TVM/FAM/SST.
  - PSD.
  - Dây tiếp xúc.
  - Tủ điện.
  - Cảm biến.
- [x] Phân loại hình ảnh theo nhóm lỗi:
  - Nứt.
  - Mòn.
  - Rỉ sét.
  - Bụi bẩn.
  - Cháy xém.
  - Cong vênh.
  - Kẹt cơ khí.
  - Hư hỏng bề mặt.
- [x] Chuẩn hóa định dạng ảnh.
- [x] Loại bỏ ảnh trùng, mờ, sai góc chụp.
- [x] Gắn nhãn dữ liệu bằng bounding box.
- [x] Tách dữ liệu thành:
  - Training set.
  - Validation set.
  - Test set.

**Kết quả đầu ra:**

- Dataset hình ảnh lỗi thiết bị Metro.
- Bộ nhãn kỹ thuật chuẩn.
- Cấu trúc thư mục dataset phục vụ huấn luyện.

---

### TASK 1.3 - Fine-tune YOLOv8 nhận diện lỗi thực tế

**Mục tiêu:**  
Huấn luyện lại YOLOv8 để phát hiện các lỗi kỹ thuật chuyên ngành.

**Công việc cụ thể:**

- [x] Tạo file cấu hình dataset.
- [x] Xác định danh sách class lỗi.
- [x] Huấn luyện thử nghiệm YOLOv8 trên dataset mới.
- [x] So sánh kết quả model mới với model cũ.
- [x] Đánh giá các chỉ số:
  - Precision.
  - Recall.
  - mAP.
  - False positive.
  - False negative.
- [x] Tối ưu số epoch, batch size, image size.
- [x] Lưu model mới dưới version riêng.
- [x] Không ghi đè model YOLO cũ.

**Kết quả đầu ra:**

- Model YOLOv8 fine-tuned.
- Báo cáo đánh giá độ chính xác.
- Model version mới, chạy song song với model cũ.

---

### TASK 1.4 - Nâng cấp sang YOLOv8-seg để phân vùng lỗi

**Mục tiêu:**  
Giúp AI không chỉ khoanh vùng lỗi mà còn xác định hình dạng, diện tích vùng lỗi.

**Công việc cụ thể:**

- [x] Đánh giá khả năng triển khai YOLOv8-seg.
- [x] Bổ sung dữ liệu segmentation mask cho các lỗi quan trọng.
- [x] Huấn luyện thử nghiệm model YOLOv8-seg.
- [x] Hiển thị vùng lỗi bằng màu trực quan.
- [x] Tính toán diện tích vùng lỗi trên ảnh.
- [x] Gắn mức độ nghiêm trọng theo diện tích hoặc mật độ lỗi.
- [x] Bổ sung kết quả segmentation vào báo cáo kiểm tra.

**Kết quả đầu ra:**

- Model segmentation phát hiện lỗi.
- Giao diện hiển thị vùng lỗi rõ ràng.
- Kết quả phân tích phục vụ kỹ sư đánh giá mức độ nghiêm trọng.

---

## 5. TÍCH HỢP AI GIỌNG NÓI CHO KỸ SƯ HIỆN TRƯỜNG

### TASK 2.1 - Thiết kế luồng nhập báo cáo bằng giọng nói

**Mục tiêu:**  
Cho phép kỹ sư hiện trường ghi nhận sự cố bằng giọng nói thay vì nhập tay.

**Công việc cụ thể:**

- [x] Bổ sung nút ghi âm vào form DNF/Hazard/Inspection.
- [x] Cho phép ghi âm trực tiếp trên mobile/web.
- [x] Lưu file âm thanh tạm thời.
- [x] Chuyển giọng nói thành văn bản.
- [x] Hiển thị văn bản sau chuyển đổi để người dùng kiểm tra.
- [x] Cho phép chỉnh sửa trước khi gửi báo cáo.

**Kết quả đầu ra:**

- Giao diện ghi âm.
- Chức năng chuyển giọng nói thành văn bản.
- Người dùng có thể kiểm tra và chỉnh sửa nội dung trước khi lưu.

---

### TASK 2.2 - Tích hợp Speech-to-Text

**Mục tiêu:**  
Tích hợp mô hình chuyển giọng nói thành văn bản, ưu tiên có thể chạy offline.

**Công việc cụ thể:**

- [x] Đánh giá mô hình Speech-to-Text phù hợp.
- [x] Ưu tiên mô hình có khả năng chạy offline.
- [x] Kiểm thử với tiếng Việt thực tế tại hiện trường.
- [x] Kiểm thử trong điều kiện có tiếng ồn.
- [x] Chuẩn hóa kết quả nhận dạng giọng nói.
- [x] Tự động loại bỏ từ thừa, câu ngắt quãng.
- [x] Lưu transcript vào hồ sơ sự cố.

**Kết quả đầu ra:**

- Module Speech-to-Text.
- Transcript tiếng Việt phục vụ báo cáo hiện trường.
- Tích hợp vào form nghiệp vụ.

---

### TASK 2.3 - Dùng Gemma phân tích nội dung giọng nói

**Mục tiêu:**  
Tự động trích xuất thông tin từ câu nói của kỹ sư để điền vào form.

**Ví dụ đầu vào:**  
“Cổng soát vé số 2 ga Bến Thành bị kẹt cơ vành răng.”

**Thông tin cần trích xuất:**

- Vị trí: Ga Bến Thành.
- Thiết bị: Cổng soát vé số 2.
- Nhóm lỗi: Kẹt cơ khí.
- Bộ phận liên quan: Vành răng.
- Loại báo cáo: DNF hoặc Inspection.
- Mức độ ưu tiên: Đề xuất theo rule hiện có.

**Công việc cụ thể:**

- [x] Tạo prompt chuẩn cho Gemma.
- [x] Không xóa prompt cũ, chỉ tạo prompt mở rộng.
- [x] Thiết kế schema đầu ra dạng JSON.
- [x] Mapping nội dung sang các trường trong form.
- [x] Cho phép người dùng xác nhận trước khi lưu.
- [x] Ghi log nội dung AI tự điền.
- [x] Cho phép đánh dấu AI điền sai để cải tiến sau này.

**Kết quả đầu ra:**

- AI tự động điền form từ giọng nói.
- Dữ liệu có cấu trúc.
- Giảm thời gian nhập liệu cho kỹ sư hiện trường.

---

## 6. TRIỂN KHAI AI DỰ ĐOÁN BẢO TRÌ

### TASK 3.1 - Chuẩn hóa dữ liệu lịch sử DNF và Inspection

**Mục tiêu:**  
Tạo dữ liệu đầu vào đủ chất lượng cho AI dự đoán hư hỏng.

**Công việc cụ thể:**

- [x] Rà soát dữ liệu DNF hiện có.
- [x] Rà soát dữ liệu Inspection hiện có.
- [x] Chuẩn hóa mã thiết bị.
- [x] Chuẩn hóa vị trí thiết bị.
- [x] Chuẩn hóa loại lỗi.
- [x] Chuẩn hóa thời gian phát sinh lỗi.
- [x] Chuẩn hóa thời gian khắc phục.
- [x] Gắn liên kết giữa sự cố và thiết bị.
- [x] Làm sạch dữ liệu thiếu, sai, trùng lặp.

**Kết quả đầu ra:**

- Dataset lịch sử bảo trì đã chuẩn hóa.
- Dữ liệu sẵn sàng cho phân tích MTBF và dự đoán hư hỏng.

---

### TASK 3.2 - Tính toán chỉ số MTBF, MTTR, tần suất lỗi

**Mục tiêu:**  
Đưa các chỉ số độ tin cậy vào hệ thống phân tích bảo trì.

**Công việc cụ thể:**

- [x] Tính MTBF cho từng thiết bị.
- [x] Tính MTTR cho từng nhóm lỗi.
- [x] Tính số lần lỗi theo tháng/quý/năm.
- [x] Tính tần suất lỗi theo tuyến, ga, hệ thống, thiết bị.
- [x] Xác định thiết bị có tần suất lỗi cao.
- [x] Hiển thị dashboard thống kê.
- [x] Xuất báo cáo phục vụ bảo trì.

**Kết quả đầu ra:**

- Bộ chỉ số RAMS cơ bản.
- Dashboard theo dõi tình trạng thiết bị.
- Danh sách thiết bị có nguy cơ cao.

---

### TASK 3.3 - Xây dựng mô hình dự đoán hư hỏng

**Mục tiêu:**  
Dự báo thiết bị có nguy cơ hư hỏng trước khi phát sinh sự cố.

**Công việc cụ thể:**

- [x] Đánh giá mô hình phù hợp:
  - XGBoost.
  - LSTM.
  - Prophet.
  - Random Forest.
- [x] Chọn mô hình giai đoạn đầu theo hướng đơn giản, dễ kiểm chứng.
- [x] Huấn luyện mô hình với dữ liệu lịch sử.
- [x] Dự đoán xác suất lỗi theo thiết bị.
- [x] Đưa ra cảnh báo theo mức độ rủi ro.
- [x] Kết nối cảnh báo với lịch bảo trì.
- [x] Ghi rõ lý do AI đưa ra cảnh báo.

**Kết quả đầu ra:**

- Mô hình AI dự đoán bảo trì.
- Cảnh báo sớm thiết bị có nguy cơ hư hỏng.
- Danh sách đề xuất kiểm tra/thay thế.

---

## 7. XÂY DỰNG ĐỒ THỊ TRI THỨC KỸ THUẬT

### TASK 4.1 - Thiết kế cấu trúc Engineering Knowledge Graph

**Mục tiêu:**  
Biểu diễn quan hệ kỹ thuật giữa hệ thống, thiết bị, linh kiện, lỗi và vật tư.

**Công việc cụ thể:**

- [x] Xây dựng cấu trúc phân cấp:
  - Tuyến.
  - Ga.
  - Hệ thống.
  - Thiết bị.
  - Cụm thiết bị.
  - Linh kiện.
  - Vật tư thay thế.
- [x] Bổ sung quan hệ:
  - Thiết bị thuộc hệ thống nào.
  - Linh kiện thuộc thiết bị nào.
  - Lỗi thường gặp của từng linh kiện.
  - Vật tư thay thế tương ứng.
  - Nhà thầu hoặc đơn vị phụ trách.
  - Tài liệu liên quan.
- [x] Không thay thế RAG hiện tại, chỉ bổ sung lớp tri thức có cấu trúc.
- [x] Kết nối Knowledge Graph với kết quả RAG.

**Kết quả đầu ra:**

- Mô hình dữ liệu Knowledge Graph.
- Sơ đồ quan hệ kỹ thuật thiết bị Metro.
- Cơ sở để AI đề xuất kiểm tra liên quan.

---

### TASK 4.2 - Nhập BOM vào hệ thống

**Mục tiêu:**  
Đưa danh mục vật tư, thiết bị và linh kiện vào hệ thống tri thức.

**Công việc cụ thể:**

- [x] Thu thập BOM của các hệ thống.
- [x] Chuẩn hóa tên vật tư.
- [x] Chuẩn hóa mã thiết bị.
- [x] Gắn mã vật tư với thiết bị tương ứng.
- [x] Gắn số lượng tồn kho nếu có dữ liệu.
- [x] Liên kết vật tư với tài liệu O&M.
- [x] Liên kết vật tư với lịch sử DNF.

**Kết quả đầu ra:**

- Cơ sở dữ liệu BOM.
- Liên kết giữa thiết bị, lỗi và vật tư thay thế.
- AI có thể đề xuất vật tư liên quan khi phát sinh lỗi.

---

### TASK 4.3 - AI đề xuất kiểm tra liên quan

**Mục tiêu:**  
Khi một thiết bị lỗi, AI đề xuất các bộ phận liên quan cần kiểm tra thêm.

**Ví dụ:**  
Khi báo cáo “bánh xe bị mòn”, AI đề xuất kiểm tra thêm:

- Vòng bi.
- Trục.
- Giá chuyển hướng.
- Ray liên quan.
- Lịch sử bảo trì gần nhất.
- Vật tư dự phòng trong kho.

**Công việc cụ thể:**

- [x] Xây dựng rule đề xuất kiểm tra liên quan.
- [x] Kết hợp rule cũ với Knowledge Graph.
- [x] Không xóa rule xử lý sự cố hiện hữu.
- [x] Bổ sung logic đề xuất kiểm tra bổ sung.
- [x] Hiển thị đề xuất trong màn hình DNF/Inspection.
- [x] Cho phép kỹ sư xác nhận hoặc bỏ qua đề xuất.
- [x] Lưu phản hồi để cải tiến rule.

**Kết quả đầu ra:**

- AI đề xuất kiểm tra các bộ phận liên quan.
- Tăng khả năng phát hiện lỗi dây chuyền.
- Hỗ trợ kỹ sư ra quyết định nhanh hơn.

---

## 8. TRIỂN KHAI EDGE AI CHO THIẾT BỊ HIỆN TRƯỜNG

### TASK 5.1 - Đánh giá khả năng chạy AI offline

**Mục tiêu:**  
Xác định khả năng đưa model AI xuống thiết bị di động hoặc máy tính hiện trường.

**Công việc cụ thể:**

- [x] Kiểm tra cấu hình thiết bị người dùng.
- [x] Đánh giá dung lượng model YOLO hiện tại.
- [x] Đánh giá tốc độ xử lý ảnh trên mobile.
- [x] Xác định các tình huống mất mạng:
  - Dưới hầm.
  - Khu vực depot.
  - Khu vực hạn chế sóng.
  - Khu vực không có Wi-Fi.
- [x] Xác định tính năng nào cần hoạt động offline.

**Kết quả đầu ra:**

- Báo cáo đánh giá Edge AI.
- Danh sách tính năng ưu tiên chạy offline.

---

### TASK 5.2 - Chuyển đổi model sang ONNX hoặc TensorFlow Lite

**Mục tiêu:**  
Tối ưu model để chạy trực tiếp trên thiết bị.

**Công việc cụ thể:**

- [x] Export YOLO sang ONNX.
- [x] Kiểm thử kết quả ONNX so với model gốc.
- [x] Tối ưu dung lượng model.
- [x] Đánh giá tốc độ inference.
- [x] Kiểm thử trên web/mobile.
- [x] Xây dựng cơ chế đồng bộ kết quả khi có mạng trở lại.
- [x] Không thay thế AI server hiện tại trong giai đoạn đầu.

**Kết quả đầu ra:**

- Model ONNX/TensorFlow Lite.
- Chức năng nhận diện lỗi offline.
- Cơ chế đồng bộ kết quả về server.

---

### TASK 5.3 - Thiết kế chế độ offline cho kỹ sư hiện trường

**Mục tiêu:**  
Đảm bảo kỹ sư vẫn có thể ghi nhận sự cố khi mất kết nối mạng.

**Công việc cụ thể:**

- [x] Cho phép tạo DNF/Inspection offline.
- [x] Cho phép chụp ảnh offline.
- [x] Cho phép AI phát hiện lỗi offline.
- [x] Lưu dữ liệu tạm trên thiết bị.
- [x] Đồng bộ dữ liệu khi có mạng.
- [x] Cảnh báo nếu có xung đột dữ liệu khi đồng bộ.
- [x] Ghi nhận trạng thái báo cáo:
  - Draft offline.
  - Waiting sync.
  - Synced.
  - Sync failed.

**Kết quả đầu ra:**

- Chế độ offline phục vụ hiện trường.
- Không gián đoạn ghi nhận sự cố khi mất mạng.
- Dữ liệu được đồng bộ về hệ thống trung tâm.

---

## 9. CẢI TIẾN RAG VÀ GEMMA

### TASK 6.1 - Nâng cấp RAG theo tài liệu kỹ thuật Metro

**Mục tiêu:**  
Tăng độ chính xác khi tra cứu tài liệu, quy trình, tiêu chuẩn, hướng dẫn bảo trì.

**Công việc cụ thể:**

- [x] Rà soát dữ liệu đang dùng cho RAG.
- [x] Phân loại tài liệu theo hệ thống:
  - AFC.
  - PSD.
  - Rolling Stock.
  - Trackwork.
  - Power Supply.
  - Signalling.
  - Telecom.
- [x] Bổ sung metadata:
  - Mã tài liệu.
  - Phiên bản.
  - Ngày ban hành.
  - Nhà thầu.
  - Hệ thống liên quan.
  - Thiết bị liên quan.
- [x] Không xóa vector index cũ.
- [x] Tạo vector index mới theo version.
- [x] Kiểm thử kết quả tra cứu trước và sau nâng cấp.

**Kết quả đầu ra:**

- RAG có metadata chuyên ngành.
- Kết quả tra cứu chính xác hơn.
- Dễ truy xuất tài liệu theo thiết bị, ga, hệ thống.

---

### TASK 6.2 - Nâng cấp prompt Gemma cho nghiệp vụ bảo trì

**Mục tiêu:**  
Giúp Gemma hiểu đúng ngữ cảnh kỹ thuật và văn phong báo cáo nội bộ.

**Công việc cụ thể:**

- [x] Sao lưu prompt hiện tại.
- [x] Bổ sung prompt chuyên ngành đường sắt Metro.
- [x] Bổ sung thuật ngữ:
  - DNF.
  - Inspection.
  - Hazard.
  - Corrective Action.
  - Preventive Maintenance.
  - MTBF.
  - MTTR.
  - RAMS.
  - FRACAS.
- [x] Bổ sung prompt viết báo cáo theo văn phong quản lý hành chính nhà nước.
- [x] Bổ Bản prompt tóm tắt sự cố kỹ thuật.
- [x] Bổ sung prompt đề xuất hành động khắc phục.
- [x] Kiểm thử với dữ liệu thật.

**Kết quả đầu ra:**

- Prompt Gemma nâng cấp.
- Không mất prompt cũ.
- AI trả lời sát nghiệp vụ hơn.

---

## 10. ƯU TIÊN TRIỂN KHAI MVP

### 10.1 Nhóm ưu tiên cao

#### Ưu tiên 1 - Fine-tune YOLO nhận diện lỗi thực tế

**Task chính cần làm ngay:**

- [x] Thu thập ảnh lỗi thực tế.
- [x] Gắn nhãn dữ liệu.
- [x] Fine-tune YOLO.
- [x] Tích hợp model mới vào AI server.
- [x] So sánh kết quả model cũ và mới.
- [x] Hiển thị kết quả phát hiện lỗi trên giao diện.

---

### Ưu tiên 2 - Nhập báo cáo bằng giọng nói

**Task chính cần làm ngay:**

- [x] Bổ sung nút ghi âm.
- [x] Tích hợp Speech-to-Text.
- [x] Dùng Gemma trích xuất thông tin.
- [x] Tự động điền form DNF/Inspection.
- [x] Cho phép người dùng xác nhận trước khi lưu.

---

## 10. KIỂM THỬ VÀ NGHIỆM THU

## TASK 7.1 - Kiểm thử không ảnh hưởng rule cũ

**Tiêu chí nghiệm thu:**

- [x] 100% rule cũ còn tồn tại.
- [x] Chức năng cũ vẫn hoạt động bình thường.
- [x] Tính năng mới có thể bật/tắt bằng cấu hình.
- [x] Có log version đầy đủ.

---

## 11. CƠ CHẾ HUMAN-IN-THE-LOOP VÀ AI SAFETY LOG

## 12.1 Nguyên tắc Human-in-the-loop

Hệ thống AI chỉ đóng vai trò hỗ trợ phân tích, nhận diện, gợi ý và cảnh báo. AI không được tự động đưa ra quyết định cuối cùng thay cho kỹ sư, cán bộ phụ trách hoặc cấp có thẩm quyền.

Mọi kết quả do AI tạo ra phải được con người kiểm tra, xác nhận trước khi sử dụng làm căn cứ chính thức trong báo cáo, xử lý sự cố, bảo trì, bảo dưỡng hoặc đánh giá an toàn.

---

## TASK 8.1 - Thiết lập cơ chế xác nhận của con người đối với kết quả AI

**Mục tiêu:**  
Bảo đảm mọi kết quả AI đều được kỹ sư hoặc cán bộ phụ trách xác nhận trước khi lưu chính thức vào hệ thống.

**Công việc cụ thể:**

- [x] AI chỉ hiển thị kết quả ở trạng thái đề xuất.
- [x] Không cho phép AI tự động đóng sự cố, kết luận nguyên nhân hoặc phát hành báo cáo chính thức.
- [x] Bổ sung nút xác nhận kết quả AI.
- [x] Bổ sung nút chỉnh sửa kết quả AI.
- [x] Bổ sung nút từ chối kết quả AI.
- [x] Ghi nhận người xác nhận cuối cùng.
- [x] Ghi nhận thời điểm xác nhận.
- [x] Ghi nhận nội dung trước và sau khi con người chỉnh sửa.
- [x] Phân quyền người được phép xác nhận theo vai trò:
  - [x] Kỹ sư hiện trường.
  - [x] Cán bộ phụ trách kỹ thuật.
  - [x] Trưởng nhóm bảo trì.
  - [x] Lãnh đạo đơn vị.
  - [x] Quản trị viên hệ thống.

**Kết quả đầu ra:**

- Cơ chế AI đề xuất, con người xác nhận.
- Không phát sinh quyết định tự động ngoài kiểm soát.
- Có căn cứ truy vết trách nhiệm khi kết quả AI bị sai lệch.

---

## TASK 8.2 - Phân loại mức độ can thiệp của con người

**Mục tiêu:**  
Xác định rõ trường hợp nào AI được tự động gợi ý, trường hợp nào bắt buộc con người phê duyệt.

**Công việc cụ thể:**

- [x] Phân loại kết quả AI theo mức độ rủi ro.
- [x] Với tác vụ rủi ro thấp, AI được phép tự động gợi ý và người dùng xác nhận.
- [x] Với tác vụ rủi ro trung bình, AI phải có người phụ trách kỹ thuật kiểm tra.
- [x] Với tác vụ rủi ro cao, AI chỉ được hiển thị cảnh báo, không được tự động đề xuất quyết định cuối cùng.
- [x] Các nội dung bắt buộc con người phê duyệt gồm:
  - [x] Kết luận nguyên nhân sự cố.
  - [x] Đánh giá mức độ nghiêm trọng.
  - [x] Đề xuất dừng thiết bị.
  - [x] Đề xuất thay thế vật tư.
  - [x] Đề xuất đóng DNF/Hazard.
  - [x] Đề xuất liên quan đến an toàn vận hành.
- [x] Cấu hình rule kiểm soát theo từng nhóm tác vụ.

**Kết quả đầu ra:**

- Bảng phân loại mức độ rủi ro của kết quả AI.
- Quy trình xác nhận phù hợp từng cấp độ.
- Hạn chế rủi ro AI đưa ra kết luận vượt thẩm quyền.

---

## 12.2 Xây dựng AI Safety Log

AI Safety Log là nhật ký an toàn của hệ thống AI, dùng để ghi nhận toàn bộ quá trình AI phân tích, gợi ý, cảnh báo, chỉnh sửa và xác nhận bởi con người.

AI Safety Log phục vụ các mục tiêu chính:

- Truy vết kết quả AI.
- Kiểm tra trách nhiệm khi có sai lệch.
- Đánh giá độ tin cậy của model.
- Cải tiến rule, prompt và dữ liệu huấn luyện.
- Hỗ trợ kiểm tra nội bộ, đánh giá an toàn và quản trị hệ thống.

---

## TASK 8.3 - Thiết kế cấu trúc AI Safety Log

**Mục tiêu:**  
Ghi nhận đầy đủ các thông tin liên quan đến quyết định, gợi ý và cảnh báo do AI tạo ra.

**Công việc cụ thể:**

- [x] Tạo bảng lưu AI Safety Log.
- [x] Ghi nhận mã log duy nhất.
- [x] Ghi nhận thời gian AI xử lý.
- [x] Ghi nhận người dùng thực hiện thao tác.
- [x] Ghi nhận module phát sinh:
  - [x] YOLO.
  - [x] Gemma.
  - [x] RAG.
  - [x] Speech-to-Text.
  - [x] Predictive Maintenance.
  - [x] Knowledge Graph.
  - [x] Edge AI.
- [x] Ghi nhận dữ liệu đầu vào:
  - [x] Hình ảnh.
  - [x] Âm thanh.
  - [x] Văn bản.
  - [x] DNF.
  - [x] Inspection.
  - [x] Hazard.
  - [x] Tài liệu tra cứu.
- [x] Ghi nhận kết quả AI đề xuất.
- [x] Ghi nhận mức độ tin cậy của AI nếu có.
- [x] Ghi nhận rule hoặc prompt được sử dụng.
- [x] Ghi nhận model và version model.
- [x] Ghi nhận người xác nhận cuối cùng.
- [x] Ghi nhận trạng thái xử lý:
  - [x] Proposed.
  - [x] Edited.
  - [x] Approved.
  - [x] Rejected.
  - [x] Overridden.
- [x] Ghi nhận lý do chỉnh sửa hoặc từ chối kết quả AI.

**Kết quả đầu ra:**

- Cấu trúc AI Safety Log hoàn chỉnh.
- Có dữ liệu phục vụ kiểm tra, truy vết và đánh giá trách nhiệm.

---

## TASK 8.4 - Ghi log toàn bộ vòng đời xử lý của AI

**Mục tiêu:**  
Theo dõi đầy đủ quá trình từ lúc AI nhận dữ liệu đầu vào đến khi con người xác nhận kết quả cuối cùng.

**Công việc cụ thể:**

- [x] Ghi log khi người dùng gửi dữ liệu cho AI.
- [x] Ghi log khi AI xử lý dữ liệu.
- [x] Ghi log kết quả AI trả về.
- [x] Ghi log khi người dùng chỉnh sửa kết quả AI.
- [x] Ghi log khi người dùng phê duyệt kết quả AI.
- [x] Ghi log khi người dùng từ chối kết quả AI.
- [x] Ghi log khi kết quả AI được sử dụng trong báo cáo chính thức.
- [x] Ghi log lỗi hệ thống AI nếu phát sinh.
- [x] Ghi log trường hợp AI không đủ cơ sở để đưa ra đề xuất.

**Kết quả đầu ra:**

- Nhật ký xử lý AI đầy đủ theo từng bước.
- Có khả năng kiểm tra lại toàn bộ quá trình xử lý.
- Tăng tính minh bạch và trách nhiệm giải trình.

---

## TASK 8.5 - Bổ sung giao diện tra cứu AI Safety Log

**Mục tiêu:**  
Cho phép cán bộ phụ trách, quản trị viên hoặc người được phân quyền tra cứu lại lịch sử hoạt động của AI.

**Công việc cụ thể:**

- [x] Xây dựng màn hình danh sách AI Safety Log.
- [x] Bổ sung bộ lọc theo:
  - [x] Thời gian.
  - [x] Người dùng.
  - [x] Module AI.
  - [x] Thiết bị.
  - [x] Ga.
  - [x] Mã DNF.
  - [x] Mã Inspection.
  - [x] Mã Hazard.
  - [x] Trạng thái phê duyệt.
- [x] Cho phép xem chi tiết từng log.
- [x] Cho phép so sánh kết quả AI ban đầu và kết quả sau khi con người chỉnh sửa.
- [x] Cho phép xuất log ra file phục vụ kiểm tra nội bộ.
- [x] Không cho phép người dùng thông thường xóa log.
- [x] Chỉ quản trị viên được phân quyền mới được lưu trữ, khóa hoặc trích xuất log.

**Kết quả đầu ra:**

- Giao diện truy vết hoạt động AI.
- Hỗ trợ kiểm tra trách nhiệm và đánh giá độ tin cậy của AI.

---

## TASK 8.6 - Bảo vệ tính toàn vẹn của AI Safety Log

**Mục tiêu:**  
Đảm bảo AI Safety Log không bị chỉnh sửa, xóa hoặc làm sai lệch sau khi đã ghi nhận.

**Công việc cụ thể:**

- [x] Thiết lập cơ chế chỉ ghi thêm, không ghi đè log cũ.
- [x] Không cho phép xóa log bằng thao tác thông thường.
- [x] Ghi nhận mọi hành vi truy cập log.
- [x] Ghi nhận mọi hành vi xuất log.
- [x] Phân quyền truy cập log theo vai trò.
- [x] Mã hóa dữ liệu nhạy cảm nếu cần.
- [x] Thiết lập thời gian lưu trữ log tối thiểu.
- [x] Bổ sung cơ chế backup định kỳ.
- [x] Cảnh báo khi phát hiện truy cập bất thường vào log.

**Kết quả đầu ra:**

- AI Safety Log có tính toàn vẹn cao.
- Giảm nguy cơ chỉnh sửa, xóa hoặc che giấu kết quả AI.
- Phù hợp yêu cầu kiểm tra, giám sát và truy vết.

---

## 12. CẬP NHẬT TIÊU CHÍ NGHIỆM THU BỔ SUNG

## 13.1 Tiêu chí nghiệm thu Human-in-the-loop

- [x] AI không tự động đưa ra quyết định cuối cùng.
- [x] Mọi kết quả AI đều có trạng thái đề xuất trước khi được xác nhận.
- [x] Có người xác nhận cuối cùng đối với kết quả AI.
- [x] Có thể chỉnh sửa hoặc từ chối kết quả AI.
- [x] Có ghi nhận lý do chỉnh sửa hoặc từ chối.
- [x] Có phân quyền xác nhận theo vai trò.
- [x] Các nội dung liên quan đến an toàn vận hành bắt buộc phải có con người phê duyệt.

## 13.2 Tiêu chí nghiệm thu AI Safety Log

- [x] Ghi nhận đầy đủ dữ liệu đầu vào, kết quả AI và người xác nhận.
- [x] Ghi nhận model, version model, rule và prompt được sử dụng.
- [x] Ghi nhận nội dung trước và sau khi chỉnh sửa.
- [x] Không cho phép xóa log bằng tài khoản thông thường.
- [x] Có thể tra cứu, lọc và xuất log.
- [x] Có thể phục vụ kiểm tra nội bộ và truy vết trách nhiệm.
- [x] Log được sao lưu và bảo vệ khỏi chỉnh sửa trái phép.

---

## 13. CHANGELOG BẮT BUỘC

Mỗi lần nâng cấp phải ghi nhận: Ngày cập nhật, Người thực hiện, Module bị ảnh hưởng, Lỗi đã sửa, Trạng thái rollback.
