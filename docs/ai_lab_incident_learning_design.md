# Thiết kế bổ sung Incident Learning cho AI Lab

## 1. Mục tiêu

Bổ sung năng lực cho `ai-lab` để trợ lý RAG không chỉ hỏi đáp theo tài liệu PDF/DOCX nội bộ, mà còn đối chiếu với các sự cố tương tự đã từng ghi nhận. Từ đó hệ thống đưa ra phương án kiểm tra/xử lý có căn cứ hơn, phù hợp với bối cảnh bảo trì đường sắt đô thị.

## 2. Phạm vi triển khai hiện tại

Đã bổ sung mode mới trong Knowledge Terminal:

```text
IncidentLearning
```

Mode này cho phép kỹ sư nhập mô tả hiện tượng sự cố, ví dụ:

- PG treo sau End of Day xử lý thế nào?
- PSD đứt dây đai sau đo lực căng.
- GHD lỗi khi mưa lớn.
- Chênh lệch điện áp giữa tàu và PSD.

Hệ thống sẽ:

1. Chuẩn hóa câu hỏi.
2. So khớp với các sự cố mẫu đã biết.
3. Chấm điểm tương đồng.
4. Hiển thị sự cố tương tự, giả thuyết nguyên nhân, kết quả xử lý từng áp dụng.
5. Đề xuất phương án xử lý theo thứ tự ưu tiên.
6. Cảnh báo rõ đây là gợi ý kỹ thuật, cần xác nhận bằng dữ liệu hiện trường/log/tài liệu O&M/phê duyệt an toàn.

## 3. Thành phần đã thêm

### 3.1. Engine học từ sự cố tương tự

File:

```text
src/lib/incident-learning/similar-incident-engine.ts
```

Các hàm chính:

- `analyzeSimilarIncidents(query)`: tìm và chấm điểm sự cố tương tự.
- `formatIncidentLearningResult(result)`: định dạng kết quả để hiển thị trong chat.

Các loại sự cố mẫu hiện có:

- AFC PG freezing / End of Day / dữ liệu giao dịch.
- PSD belt tension / đứt dây đai.
- PSD/GHD lỗi khi mưa lớn.
- Chênh lệch điện áp giữa tàu và PSD/EED.
- Hành khách bị kẹt trong quá trình đóng/mở cửa tàu và PSD.

### 3.2. Cập nhật Knowledge Terminal

File:

```text
src/components/ai/ai-knowledge-terminal.tsx
```

Thay đổi chính:

- Thêm mode `incident_learning`.
- Cho phép hỏi trực tiếp không cần chọn nguồn tài liệu.
- Khi dùng các mode RAG khác, nếu câu hỏi trùng với sự cố tương tự đủ mạnh, hệ thống tự bổ sung phần Incident Learning vào câu trả lời.
- Cập nhật placeholder, trạng thái typing, badge và hướng dẫn câu hỏi mẫu.

### 3.3. Cập nhật trang AI Lab

File:

```text
src/app/(app)/ai-lab/page.tsx
```

Thay đổi chính:

- Đổi mô tả AI Lab thành trợ lý RAG + học từ sự cố tương tự.
- Cập nhật tab `Chat, RAG & Incident Learning`.
- Bổ sung tip card `Incident Learning`.

## 4. Logic xử lý

### 4.1. Chấm điểm tương đồng

Điểm tương đồng được tính từ:

- Từ khóa trong câu hỏi.
- Từ khóa bằng chứng của sự cố mẫu.
- Triệu chứng.
- Tiêu đề sự cố.
- Mức tin cậy nội bộ của sự cố mẫu.

Kết quả được phân loại:

- `high`: có thể tham khảo mạnh, nhưng vẫn cần xác nhận hiện trường.
- `medium`: có tương đồng, cần bổ sung dữ liệu.
- `low`: chưa đủ cơ sở, không nên kết luận.

### 4.2. Sinh phương án xử lý

Phương án xử lý được xây dựng từ:

- Các hành động đã từng áp dụng trong sự cố tương tự.
- Các bước kiểm tra an toàn.
- Yêu cầu thu thập bằng chứng.
- Theo dõi tái diễn sau xử lý.

## 5. Giới hạn hiện tại

- Kho sự cố hiện là dữ liệu mẫu trong code, chưa đọc trực tiếp từ DNF database.
- Chưa có vector search/embedding thật cho incident memory.
- Chưa có màn hình phê duyệt để chuyển một sự cố đã đóng thành “bài học kinh nghiệm”.
- Chưa tự cập nhật confidence theo kết quả xử lý mới.

## 6. Hướng nâng cấp tiếp theo

### P1 - Kết nối dữ liệu thật

- Đọc dữ liệu từ bảng DNF/Hazard/Task/Inspection.
- Tạo `IncidentMemory` table riêng.
- Lưu `rootCause`, `correctiveAction`, `preventiveAction`, `lessonLearned`, `verifiedBy`, `verifiedAt`.

### P2 - Semantic search

- Dùng embedding để tìm sự cố tương tự theo ngữ nghĩa thay vì chỉ keyword.
- Kết hợp DocumentRAG với Incident Memory.
- Hiển thị nguồn tham chiếu: DNF ID, ngày, ga, thiết bị, trạng thái đóng/mở.

### P3 - Learning loop

- Sau khi xử lý sự cố mới, kỹ sư xác nhận phương án có hiệu quả hay không.
- Hệ thống cập nhật lại độ tin cậy cho bài học kinh nghiệm.
- Tạo dashboard “sự cố lặp lại” theo ga, hệ thống, thiết bị và thời gian.

## 7. Điều kiện nghiệm thu kỹ thuật

Có thể nghiệm thu kỹ thuật nội bộ khi:

- Trang `/ai-lab` hiển thị mode `IncidentLearning`.
- Kỹ sư nhập hiện tượng sự cố và nhận được danh sách sự cố tương tự.
- Kết quả có điểm tương đồng, giả thuyết nguyên nhân, hành động từng áp dụng và phương án đề xuất.
- Có cảnh báo rõ kết quả chỉ là gợi ý tham khảo.
- CI typecheck/build pass.

Chưa nghiệm thu vận hành chính thức nếu chưa kết nối dữ liệu DNF/Hazard/Task/Inspection thật và chưa có quy trình phê duyệt bài học kinh nghiệm.
