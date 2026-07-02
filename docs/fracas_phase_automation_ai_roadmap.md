# Nghiên cứu triển khai FRACAS theo Phase, Automation và AI

## 1. Mục tiêu tài liệu

Tài liệu này tổng hợp định hướng triển khai Hệ thống FRACAS theo các giai đoạn nghiệp vụ, đồng thời đề xuất hướng tự động hóa và ứng dụng AI để tối ưu quy trình quản lý báo cáo, phân tích và khắc phục sự cố trong quá trình vận hành, bảo trì.

Nội dung được xây dựng trên cơ sở tài liệu FRACAS của Công ty, trong đó Hệ thống FRACAS được xác định là công cụ quản lý khép kín nhằm ghi nhận, phân tích, khắc phục, kiểm chứng hiệu lực, theo dõi xu hướng phát sinh lỗi/sự cố, kiểm soát rủi ro, ngăn ngừa tái diễn, nâng cao độ tin cậy hệ thống và hỗ trợ công tác ra quyết định quản lý.

## 2. Căn cứ nghiệp vụ chính

Các căn cứ nghiệp vụ trọng tâm gồm:

- FRACAS là hệ thống ghi nhận, phân tích sự cố, hư hỏng và theo dõi biện pháp khắc phục nhằm ngăn ngừa tái diễn và cải thiện độ tin cậy của hệ thống.
- Dữ liệu FRACAS phải được thu thập kịp thời, đầy đủ, có khả năng truy vết và đủ căn cứ phục vụ phân tích kỹ thuật, đánh giá RAMS và quản lý an toàn vận hành.
- Hồ sơ chỉ được đóng sau khi hoàn tất hành động khắc phục, xác minh hiệu quả hoặc có biện pháp kiểm soát tạm thời, lý do, thời hạn và thẩm quyền phê duyệt phù hợp.
- FRACAS cần liên thông với Nhật ký mối nguy, hồ sơ an toàn và dữ liệu RAMS đối với các sự cố có liên quan đến an toàn vận hành.
- Dữ liệu FRACAS là cơ sở tính toán, theo dõi các chỉ số MTBF, MTTR, MDT, MCBF, MDBF, MTBSF và các chỉ số RAMS khác.

## 3. Đề xuất 05 Phase triển khai hệ thống FRACAS

### Phase 1 - Tiếp nhận và phân loại sự cố

Nội dung trọng tâm:

- Phát hiện, ghi nhận và tạo báo cáo sự cố.
- Ghi nhận thời gian, vị trí, hệ thống/thiết bị liên quan, mô tả lỗi, điều kiện vận hành, đánh giá ảnh hưởng và biện pháp xử lý ban đầu.
- Kiểm tra hiện trường, đánh giá ban đầu, phân loại kỹ thuật và đánh giá ảnh hưởng đến an toàn/vận hành.

Liên kết phần mềm hiện có:

- `src/components/dnf/dnf-form.tsx`
- `src/lib/actions/dnf.actions.ts`
- AI đánh giá nhanh liên quan Hazard trong DNF Form.

Đề xuất Automation/AI:

- Tự động mã hóa hồ sơ DNF theo hệ thống/phân hệ.
- Tự động gửi thông báo đến đơn vị liên quan khi có sự cố mới.
- AI/NLP gợi ý phân loại kỹ thuật, mức độ ảnh hưởng vận hành và mức liên quan an toàn dựa trên mô tả sự cố.

### Phase 2 - Điều phối và khắc phục tạm thời

Nội dung trọng tâm:

- Điều phối đơn vị xử lý.
- Thực hiện kiểm tra, chẩn đoán, sửa chữa, cô lập, khôi phục hoặc xử lý kỹ thuật ban đầu.
- Cập nhật trạng thái khôi phục kỹ thuật, khôi phục dịch vụ, thời gian gián đoạn, thời gian sửa chữa và thời gian chờ.

Liên kết phần mềm hiện có:

- Corrective Action trong DNF.
- Các trường `trainServiceAffected`, `trainWithdrawn`, `systemRestoredTime`, `disruptionDuration`, `correctiveActions`.
- RAMS Engine sử dụng dữ liệu này để tính Service Impact và MTTR.

Đề xuất Automation/AI:

- Workflow tự động chuyển trạng thái từ DNF mới sang xử lý, phản hồi, xác minh.
- Nhắc hạn xử lý, cảnh báo hồ sơ tồn đọng hoặc quá hạn.
- AI gợi ý phương án xử lý tạm thời dựa trên lịch sử sự cố tương tự.

### Phase 3 - Phân tích nguyên nhân gốc rễ

Nội dung trọng tâm:

- Rà soát sự cố, nhật ký vận hành, dữ liệu hiện trường, dữ liệu bảo trì và các hồ sơ liên quan.
- Phân tích nguyên nhân trực tiếp, nguyên nhân gián tiếp và nguyên nhân gốc rễ.
- Áp dụng FTA, FMEA, FMECA hoặc công cụ hỗ trợ khác tùy mức độ phức tạp của sự cố.
- Đối chiếu Hazard Log đối với sự cố liên quan an toàn.

Liên kết phần mềm hiện có:

- `src/lib/services/incident-learning-service.ts`
- `src/lib/hazards/hazard-ai-flow-assessment.ts`
- `src/components/hazards/hazard-form.tsx`

Đề xuất Automation/AI:

- AI gợi ý các sự cố tương tự, nguyên nhân khả thi và hành động đã từng áp dụng.
- AI hỗ trợ tạo checklist RCA, đề xuất hướng FTA/FMEA/FMECA.
- Tự động liên kết DNF với Hazard Log khi phát hiện từ khóa an toàn, lỗi lặp lại hoặc ảnh hưởng vận hành.

### Phase 4 - Đề xuất và phê duyệt biện pháp lâu dài

Nội dung trọng tâm:

- Đề xuất biện pháp khắc phục dài hạn, biện pháp phòng ngừa, thay đổi cấu hình/quy trình nếu cần.
- Trình cấp có thẩm quyền xem xét, phê duyệt.
- Theo dõi trách nhiệm, thời hạn, nguồn lực, tình trạng triển khai.

Liên kết phần mềm hiện có:

- Hazard Form có nút AI đánh giá nhanh Hazard Log.
- Trường `proposedActions`, `suggestedActions`, `responsiblePersonOrUnit`, `coordinatingUnits`, `dueDate`.

Đề xuất Automation/AI:

- Workflow phê duyệt tự động chuyển hồ sơ đến cấp quản lý phù hợp theo risk level.
- Nhắc phê duyệt và cảnh báo điểm nghẽn ở bước phê duyệt.
- AI soạn nháp biện pháp khắc phục dài hạn, nhưng không tự phê duyệt.

### Phase 5 - Theo dõi, xác minh và đóng hồ sơ

Nội dung trọng tâm:

- Kiểm tra kết quả khắc phục.
- Xác minh hiệu lực hành động khắc phục.
- Cập nhật Hazard Log, hồ sơ an toàn và dữ liệu RAMS nếu sự cố liên quan an toàn.
- Theo dõi khả năng tái diễn.
- Đóng hồ sơ khi đủ căn cứ.

Liên kết phần mềm hiện có:

- RAMS Engine tính Service Impact, MTTR, RAMS Total.
- Dashboard OCC hiển thị RAMS Total Trending, RAMS Hotspot và OCC Highlights.
- `src/components/rams/rams-occ-dashboard-panel.tsx`

Đề xuất Automation/AI:

- Tự động quét lỗi lặp lại theo thiết bị, hệ thống, vị trí, mô tả lỗi và mã sự cố.
- AI dự báo xu hướng suy giảm hoặc hotspot có khả năng tái diễn.
- Cảnh báo OCC và Phòng Kỹ thuật - An toàn khi RAMS Total, MTTR hoặc Service Impact tăng bất thường.

## 4. Hướng tự động hóa tổng thể

### 4.1. Tự động hóa báo cáo và thông báo

Khi sự cố được tạo, hệ thống có thể tự động:

- Gửi thông báo đến Xí nghiệp Vận hành, Xí nghiệp Bảo dưỡng, Phòng Kỹ thuật - An toàn hoặc người phụ trách theo phân hệ.
- Gắn nhãn ưu tiên dựa trên ảnh hưởng dịch vụ và mức liên quan an toàn.
- Tạo log hệ thống để truy vết.

### 4.2. Workflow phê duyệt và nhắc việc

Hệ thống có thể:

- Tự động chuyển hồ sơ theo trạng thái xử lý.
- Nhắc người phụ trách khi quá hạn.
- Cảnh báo cấp quản lý khi hồ sơ có risk level cao, RAMS Total cao hoặc tồn đọng lâu.

### 4.3. Liên kết dữ liệu DNF - Hazard Log - RAMS

Hệ thống có thể:

- Tự động gợi ý tạo Hazard Log từ DNF có liên quan an toàn.
- Đồng bộ các trường: mô tả sự cố, hậu quả tiềm ẩn, ảnh hưởng dịch vụ, biện pháp kiểm soát, đơn vị phụ trách.
- Cập nhật dữ liệu RAMS sau khi có thời gian sửa chữa, thời gian khôi phục và tình trạng ảnh hưởng dịch vụ.

### 4.4. Theo dõi tái phát

Hệ thống có thể:

- Quét sự cố theo thiết bị, phân hệ, vị trí và nội dung mô tả.
- Cảnh báo lỗi lặp lại.
- Đưa lỗi lặp lại vào danh sách ưu tiên RCA.

## 5. Hướng ứng dụng AI

### 5.1. AI phân loại và đánh giá tác động

Ứng dụng NLP để:

- Đọc mô tả sự cố.
- Gợi ý phân hệ liên quan.
- Gợi ý ảnh hưởng vận hành.
- Gợi ý mức liên quan Hazard Log.
- Gợi ý priority/hazard level cho người dùng xác nhận.

### 5.2. AI hỗ trợ RCA

AI có thể:

- So sánh sự cố mới với lịch sử sự cố.
- Gợi ý nguyên nhân khả thi.
- Gợi ý dữ liệu cần kiểm tra: log hệ thống, hình ảnh, checklist, thông số thiết bị, lịch sử bảo trì.
- Đề xuất hướng phân tích FTA/FMEA/FMECA.

### 5.3. AI dự báo lỗi và hotspot

AI có thể dùng dữ liệu RAMS và DNF để:

- Dự báo thiết bị/phân hệ có nguy cơ phát sinh lỗi.
- Xác định hotspot theo ga, hệ thống, thiết bị.
- Hỗ trợ OCC nhận diện khu vực cần theo dõi.

### 5.4. AI hỗ trợ nhập liệu hiện trường

AI có thể:

- Hỗ trợ nhập mô tả bằng giọng nói.
- Trích xuất thông tin từ hình ảnh hiện trường.
- Tự đề xuất các trường dữ liệu còn thiếu trong form DNF/Hazard.

## 6. Nguyên tắc kiểm soát khi áp dụng AI

1. AI chỉ hỗ trợ sàng lọc, gợi ý và phân tích sơ bộ.
2. AI không tự phê duyệt, không tự đóng hồ sơ FRACAS/Hazard.
3. Quyết định cuối cùng thuộc người có thẩm quyền.
4. Tất cả khuyến nghị AI phải có rationale hoặc căn cứ dữ liệu để người dùng kiểm tra.
5. Các kết quả AI ảnh hưởng đến an toàn phải được Phòng Kỹ thuật - An toàn hoặc cấp có thẩm quyền rà soát.
6. Dữ liệu phục vụ AI phải được quản lý theo nguyên tắc truy vết, bảo mật và kiểm soát quyền truy cập.

## 7. Mapping với module phần mềm hiện hữu

| Phase | Module hiện có | Tình trạng |
|---|---|---|
| Phase 1 | DNF Form, DNF Actions, AI Hazard assessment trong DNF | Đã có nền tảng |
| Phase 2 | Corrective Action, trạng thái DNF, dữ liệu service impact | Đã có nền tảng |
| Phase 3 | Incident Learning, Hazard AI Flow, Hazard Form | Đã có nền tảng |
| Phase 4 | Hazard Form, suggestedActions, responsible unit, due date | Đã có nền tảng |
| Phase 5 | RAMS Engine, RAMS OCC Dashboard, DNF/Hazard/RAMS docs | Đã có nền tảng |

## 8. Đề xuất lộ trình kỹ thuật tiếp theo

| Giai đoạn | Nội dung | Mức ưu tiên |
|---|---|---|
| P1 | Gắn phase/status FRACAS vào DNF lifecycle để theo dõi đúng 05 phase. | Cao |
| P2 | Tạo checklist RCA cho sự cố lặp lại hoặc RAMS Total cao. | Cao |
| P3 | Tạo liên kết một nút từ DNF sang Hazard Log khi AI xác định safety-related. | Cao |
| P4 | Bổ sung dashboard FRACAS phase tracking: số hồ sơ ở từng phase, hồ sơ quá hạn, hồ sơ chờ phê duyệt. | Trung bình |
| P5 | Bổ sung AI chatbot nhập liệu hiện trường bằng giọng nói/hình ảnh. | Trung bình |
| P6 | Hiệu chỉnh mô hình dự báo lỗi khi có đủ dữ liệu vận hành thực tế. | Trung bình |

## 9. Kết luận

Việc triển khai FRACAS theo 05 phase giúp hệ thống quản lý sự cố được tổ chức rõ ràng, có khả năng truy vết và phù hợp với yêu cầu quản lý an toàn vận hành, RAMS và cải tiến liên tục. Automation giúp giảm thao tác thủ công, bảo đảm hồ sơ không bị tồn đọng; AI giúp tăng năng lực sàng lọc, phân tích và cảnh báo sớm. Tuy nhiên, toàn bộ quyết định liên quan đến an toàn, phê duyệt biện pháp khắc phục và đóng hồ sơ vẫn phải do con người có thẩm quyền thực hiện.
