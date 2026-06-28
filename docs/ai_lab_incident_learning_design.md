# Thiết kế bổ sung Incident Learning cho AI Lab

## 1. Mục tiêu

Bổ sung năng lực cho `ai-lab` để trợ lý RAG không chỉ hỏi đáp theo tài liệu PDF/DOCX nội bộ, mà còn đối chiếu với các sự cố tương tự đã từng ghi nhận trong dữ liệu vận hành thật. Từ đó hệ thống đưa ra phương án kiểm tra/xử lý có căn cứ hơn, phù hợp với bối cảnh bảo trì đường sắt đô thị.

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
2. Đọc dữ liệu thật từ OPS database gồm DNF, Hazard, Task và Inspection.
3. Chuẩn hóa các hồ sơ này thành `IncidentResolutionCase`.
4. So khớp với sự cố hiện tại và chấm điểm tương đồng.
5. Hiển thị sự cố tương tự, nguồn tham chiếu, giả thuyết nguyên nhân, kết quả xử lý từng áp dụng.
6. Đề xuất phương án xử lý theo thứ tự ưu tiên.
7. Cảnh báo rõ đây là gợi ý kỹ thuật, cần xác nhận bằng dữ liệu hiện trường/log/tài liệu O&M/phê duyệt an toàn.

Nếu server chưa kết nối được OPS database hoặc dữ liệu thật chưa đủ, hệ thống fallback về kho mẫu để không làm gián đoạn kiểm thử AI Lab.

## 3. Thành phần đã thêm/cập nhật

### 3.1. Engine học từ sự cố tương tự

File:

```text
src/lib/incident-learning/similar-incident-engine.ts
```

Các hàm chính:

- `analyzeSimilarIncidents(query, runtimeCases)`: tìm và chấm điểm sự cố tương tự từ dữ liệu runtime hoặc fallback sample.
- `formatIncidentLearningResult(result)`: định dạng kết quả để hiển thị trong chat.
- `FALLBACK_INCIDENT_CASES`: kho mẫu dự phòng khi database chưa sẵn sàng.

### 3.2. Service kết nối dữ liệu vận hành thật

File:

```text
src/lib/services/incident-learning-service.ts
```

Service này đọc dữ liệu từ OPS database:

- `DnfDocument` + `CorrectiveAction`.
- `HazardRecord`.
- `Task`.
- `InspectionDetail`.

Sau đó chuyển đổi thành memory case gồm:

- `sourceType`.
- `sourceId`.
- `referenceLabel`.
- `title`.
- `subsystem`.
- `station`.
- `symptoms`.
- `rootCauseHypothesis`.
- `actionsTaken`.
- `resolutionOutcome`.
- `safetyNotes`.
- `evidenceTags`.
- `confidence`.

### 3.3. Server action cho production

File:

```text
src/lib/actions/incident-learning.actions.ts
```

Server action:

```text
incidentLearningQuery(query)
```

Action này kiểm tra quyền `ai:use`, sau đó gọi service đọc OPS database. Giao diện client không đọc database trực tiếp.

### 3.4. Cập nhật Knowledge Terminal

File:

```text
src/components/ai/ai-knowledge-terminal.tsx
```

Thay đổi chính:

- Thêm mode `incident_learning`.
- Cho phép hỏi trực tiếp không cần chọn nguồn tài liệu.
- Mode này gọi server action `incidentLearningQuery` thay vì xử lý dữ liệu trên client.
- Khi dùng các mode RAG khác, nếu câu hỏi trùng với sự cố tương tự đủ mạnh, hệ thống tự bổ sung phần Incident Learning vào câu trả lời.
- Cập nhật placeholder, trạng thái typing, badge và hướng dẫn production mode.

### 3.5. Cập nhật trang AI Lab

File:

```text
src/app/(app)/ai-lab/page.tsx
```

Thay đổi chính:

- Đổi mô tả AI Lab thành trợ lý RAG + học từ sự cố tương tự.
- Cập nhật tab `Chat, RAG & Incident Learning`.
- Bổ sung tip card `Incident Learning`.

## 4. Logic xử lý

### 4.1. Nguồn dữ liệu

Incident Learning ưu tiên dữ liệu thật theo thứ tự:

1. DNF có mô tả lỗi, ảnh hưởng, hành động tức thời, kết quả khắc phục và corrective action.
2. Hazard có mô tả mối nguy, kiểm soát hiện tại, hành động đề xuất, closure/verification.
3. Task có công việc xử lý/theo dõi, tiến độ, phân công và lịch sử hoạt động.
4. Inspection có ghi chú kiểm tra, checklist, nhận xét phê duyệt và trạng thái.
5. Fallback sample khi OPS database không sẵn sàng.

### 4.2. Chấm điểm tương đồng

Điểm tương đồng được tính từ:

- Từ khóa trong câu hỏi.
- Từ khóa bằng chứng của hồ sơ vận hành.
- Triệu chứng.
- Tiêu đề sự cố/công việc/kiểm tra.
- Nguồn tham chiếu và vị trí/ga.
- Mức tin cậy nội bộ của hồ sơ.

Kết quả được phân loại:

- `high`: có thể tham khảo mạnh, nhưng vẫn cần xác nhận hiện trường.
- `medium`: có tương đồng, cần bổ sung dữ liệu.
- `low`: chưa đủ cơ sở, không nên kết luận.

### 4.3. Sinh phương án xử lý

Phương án xử lý được xây dựng từ:

- Các hành động đã từng áp dụng trong DNF/Corrective Action.
- Current controls/proposed actions/suggested actions trong Hazard.
- Task xử lý/theo dõi liên quan.
- Inspection notes/checklist.
- Các bước kiểm tra an toàn.
- Yêu cầu thu thập bằng chứng.
- Theo dõi tái diễn sau xử lý.

## 5. Giới hạn hiện tại

- Đã đọc dữ liệu thật từ OPS database nhưng vẫn là keyword/hybrid matching, chưa phải semantic embedding search.
- Chưa có bảng `IncidentMemory` riêng để lưu bài học đã được phê duyệt.
- Chưa có màn hình phê duyệt để chuyển một sự cố đã đóng thành “bài học kinh nghiệm”.
- Chưa tự cập nhật confidence theo kết quả xử lý mới.
- Chưa có liên kết trực tiếp để mở lại DNF/Hazard/Task/Inspection từ kết quả chat.

## 6. Hướng nâng cấp tiếp theo

### P1 - Incident Memory chính thức

- Tạo `IncidentMemory` table riêng.
- Lưu `sourceType`, `sourceId`, `rootCause`, `correctiveAction`, `preventiveAction`, `lessonLearned`, `verifiedBy`, `verifiedAt`.
- Chỉ đưa hồ sơ vào memory chính thức khi đã được kỹ sư/phụ trách xác nhận.

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
- Kết quả có nguồn dữ liệu `OPS database - DNF/Hazard/Task/Inspection` khi database sẵn sàng.
- Kết quả có điểm tương đồng, giả thuyết nguyên nhân, hành động từng áp dụng và phương án đề xuất.
- Có cảnh báo rõ kết quả chỉ là gợi ý tham khảo.
- CI typecheck/build pass.

Chưa nghiệm thu vận hành chính thức nếu chưa có quy trình phê duyệt bài học kinh nghiệm, chưa có IncidentMemory table riêng và chưa có kiểm chứng dữ liệu nguồn trước khi dùng cho quyết định bảo trì chính thức.
