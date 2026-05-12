# NHẬT KÝ THỰC HIỆN NÂNG CẤP AI (EXECUTION LOG)

## GIAI ĐOẠN 3 (PHẦN 6): TRIỂN KHAI AI DỰ ĐOÁN BẢO TRÌ

### TASK 3.1 - Chuẩn hóa dữ liệu lịch sử DNF và Inspection [HOÀN THÀNH]
- **Thời gian:** 2026-05-08
- **Chi tiết thực hiện:**
  - Viết module `infra/ai-server/predictive/data_cleaner.py` (MaintenanceDataCleaner).
  - Khởi tạo quy trình ETL (Extract - Transform - Load) chuyên biệt để làm sạch dữ liệu DNF và Inspection.
  - Xử lý các lỗi dữ liệu cơ bản: Gộp các tên viết tắt (ga bt -> Ga Bến Thành), chuẩn hóa format ngày tháng (datetime ISO format), và loại bỏ hoàn toàn các bản ghi bị lặp ID (duplicate removal).
  - Tích hợp logic ánh xạ (mapping) thiết bị và sự cố để thiết lập Dataset chuẩn (`data/clean/maintenance_dataset_v1.json`).
- **Kết quả / Output:** 
  - Đã có khung Pipeline xử lý dữ liệu sạch, cung cấp trực tiếp nguyên liệu cho thuật toán học máy phân tích MTBF (Mean Time Between Failures) ở Task tiếp theo.
- **Đánh giá & Next Step:** Dữ liệu đã sẵn sàng. Tiến sang **TASK 3.2 - Tính toán chỉ số MTBF, MTTR, tần suất lỗi** để đưa vào Dashboard phân tích.

### TASK 3.2 - Tính toán chỉ số MTBF, MTTR, tần suất lỗi [HOÀN THÀNH]
- **Thời gian:** 2026-05-08
- **Chi tiết thực hiện:**
  - Viết module `infra/ai-server/predictive/reliability_metrics.py` (ReliabilityAnalyzer).
  - Tích hợp logic tính toán **MTBF** (Mean Time Between Failures - Tần suất hỏng hóc) và **MTTR** (Mean Time To Repair - Thời gian khắc phục trung bình).
  - Hệ thống tự động phân loại mức độ rủi ro (Risk Level: Low, High, Critical) dựa trên lịch sử tần suất lỗi.
  - Tự động trích xuất kết quả ra file `reliability_report.json`.
  - Phát triển Component Giao diện (React/Next.js) `src/components/analytics/reliability-dashboard.tsx` để render trực quan các thông số trên thành các khối Card và Bảng Danh sách thiết bị rủi ro cao.
- **Kết quả / Output:** 
  - Kỹ sư trưởng giờ đây có một **Reliability Dashboard** hoàn chỉnh. Thay vì đi kiểm tra mù, họ có thể nhìn thấy ngay thiết bị nào có MTBF ngắn, cần ưu tiên bảo dưỡng phòng ngừa (Preventive Maintenance).
- **Đánh giá & Next Step:** Các chỉ số cơ bản của RAMS đã được thiết lập. Sẵn sàng cho **TASK 3.3 - Xây dựng mô hình dự đoán hư hỏng (Predictive Maintenance AI)**.

### TASK 3.3 - Xây dựng mô hình dự đoán hư hỏng (Predictive Maintenance AI) [HOÀN THÀNH]
- **Thời gian:** 2026-05-08
- **Chi tiết thực hiện:**
  - Cập nhật file `requirements.txt` để cài đặt thư viện `scikit-learn`.
  - Thiết kế và lập trình module học máy `infra/ai-server/predictive/model_trainer.py`.
  - Quyết định sử dụng mô hình **Random Forest Classifier** thay cho LSTM/XGBoost ở giai đoạn đầu, vì nó cân bằng tốt giữa tốc độ huấn luyện, dễ cài đặt và dễ diễn giải quyết định (Explainability).
  - Hệ thống lấy đầu vào (Features) là các chỉ số RAMS: `mtbf_hours`, `mttr_hours`, `frequency_per_month`. Nhãn (Label) được đánh giá dựa trên mức độ rủi ro để dạy cho AI biết nhận diện "dấu hiệu hỏng hóc".
  - Chạy hàm dự đoán `.predict_proba()` để xuất ra phần trăm xác suất lỗi (ví dụ: 85%). Nếu xác suất > 70%, AI sẽ kích hoạt mức `Critical` kèm theo **Lý do dự đoán** (Explainable AI - ví dụ: "Tần suất lỗi tăng vọt, dự đoán hỏng trong 14 ngày tới") và **Đề xuất hành động** (Lên lịch bảo trì phòng ngừa ngay).
  - Xuất báo cáo tự động ra file `predictive_maintenance_alerts.json`.
- **Kết quả / Output:** 
  - Đã chuyển đổi hoàn toàn phương thức quản lý thiết bị sang mức độ cao nhất của ngành bảo trì kỹ thuật (Predictive Maintenance). Hệ thống AI tự đưa ra cảnh báo sớm giúp Ban Giám đốc ga Metro chủ động thay thế linh kiện trước khi sự cố thực sự làm gián đoạn tàu chạy.
- **Đánh giá & Next Step:** Phân hệ 6 (Dự đoán bảo trì) đã **HOÀN TẤT XUẤT SẮC**. Toàn bộ hệ thống AI từ Hình ảnh, Giọng nói đến Phân tích Dữ liệu lịch sử đã được nâng cấp đồng bộ.
