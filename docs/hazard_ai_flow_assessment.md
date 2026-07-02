# AI hỗ trợ đánh giá nhanh Hazard Log theo lưu đồ FRACAS

## 1. Mục tiêu

Tài liệu này mô tả khả năng áp dụng AI để hỗ trợ đánh giá nhanh Hazard Log trong luồng FRACAS. AI không thay thế vai trò của người quản lý, chuyên viên an toàn hoặc hội đồng/phân cấp phê duyệt. AI chỉ có vai trò sàng lọc, gợi ý phân loại ban đầu và đề xuất nội dung cần rà soát.

Căn cứ nghiệp vụ: lưu đồ FRACAS thể hiện các bước tạo báo cáo, phân loại kỹ thuật, xác định liên quan an toàn, rà soát Hazard Log, đánh giá nguyên nhân gốc rễ, tổng hợp rủi ro còn lại, cập nhật Hazard Log, quản lý phê duyệt, theo dõi tái phát và đóng hồ sơ.

## 2. Vị trí áp dụng trong flow chart

AI có thể hỗ trợ tại các điểm sau:

| Bước trong FRACAS | Nội dung | Vai trò AI |
|---|---|---|
| Bước 2 | Phân loại kỹ thuật và đánh giá tác động | Đọc mô tả sự cố, hậu quả tiềm ẩn, ảnh hưởng vận hành để gợi ý mức độ ban đầu. |
| Bước 3 | Có liên quan an toàn hay không | Gợi ý safety screening: liên quan an toàn, không liên quan an toàn, hoặc cần người rà soát. |
| Bước 4 | Lỗi lặp lại | Gợi ý tần suất dựa trên dữ liệu tái diễn hoặc cờ repeated failure. |
| Bước 5 | Tác động vận hành | Gợi ý tăng tần suất/risk class nếu có ảnh hưởng vận hành. |
| Bước 11 | Rà soát Hazard Log và đánh giá nguyên nhân gốc rễ | Đề xuất liên kết Hazard Log, DNF/FRACAS và root cause cần kiểm tra. |
| Bước 13 | Tổng hợp rủi ro còn lại, cập nhật Hazard Log | Gợi ý severity, frequency, risk class và hành động kiểm soát. |
| Bước 14 | Quản lý phê duyệt | AI không phê duyệt; con người quyết định cuối cùng. |

## 3. Bốn tiêu chí đánh giá nhanh

### 3.1. Mức độ nghiêm trọng

AI đánh giá sơ bộ mức độ nghiêm trọng dựa trên mô tả sự cố, hậu quả tiềm ẩn, ảnh hưởng an toàn và ảnh hưởng khai thác.

| Mã | Ý nghĩa tham khảo |
|---|---|
| S1 | Ảnh hưởng thấp, chưa ghi nhận hậu quả đáng kể. |
| S2 | Có ảnh hưởng nhẹ đến vận hành hoặc chất lượng dịch vụ. |
| S3 | Có thể gây ảnh hưởng lớn đến khai thác, an toàn hoặc gây gián đoạn đáng kể. |
| S4 | Có khả năng gây hậu quả nghiêm trọng, sự cố an toàn lớn, va chạm, cháy, thương tích nghiêm trọng hoặc rủi ro mức cao. |

### 3.2. Tần suất xảy ra

AI đánh giá tần suất dựa trên lỗi lặp lại, lịch sử phát sinh và ảnh hưởng vận hành.

| Mã | Ý nghĩa tham khảo |
|---|---|
| F1 | Hiếm gặp hoặc mới ghi nhận lần đầu. |
| F2 | Có ảnh hưởng vận hành nhưng chưa xác định tái diễn. |
| F3 | Có dấu hiệu lặp lại. |
| F4 | Lặp lại và có ảnh hưởng vận hành rõ. |

### 3.3. Phân loại theo ma trận

AI sử dụng ma trận điểm đơn giản:

```text
Risk Score = Severity Score x Frequency Score
```

| Điểm | Phân loại |
|---|---|
| 1–3 | Low |
| 4–7 | Medium |
| 8–11 | High |
| 12–16 | Critical |

Kết quả này chỉ là phân loại sơ bộ để hỗ trợ sàng lọc nhanh. Khi triển khai chính thức, ma trận cần căn cứ quy định nội bộ, tiêu chuẩn an toàn và thẩm quyền phê duyệt của đơn vị.

### 3.4. Đưa ra quyết định bởi con người

AI chỉ đưa ra khuyến nghị:

| Khuyến nghị AI | Ý nghĩa |
|---|---|
| accept | Có thể chấp nhận theo dõi, nhưng vẫn cần người xác nhận. |
| mitigate | Cần biện pháp giảm thiểu hoặc hành động khắc phục/phòng ngừa. |
| escalate | Cần chuyển cấp quản lý/chuyên môn để xem xét khẩn. |
| pending-human-review | Thiếu dữ liệu hoặc chưa rõ liên quan an toàn; bắt buộc người rà soát. |

Quyết định cuối cùng luôn là quyết định của người có thẩm quyền.

## 4. Cấu phần đã bổ sung trong phần mềm

File mới:

```text
src/lib/hazards/hazard-ai-flow-assessment.ts
```

Chức năng chính:

```text
assessHazardFlow(input)
```

Đầu vào:

```text
description
potentialConsequence
currentControls
severityLevel
frequencyLevel
repeatedFailure
operationalImpact
safetyRelated
```

Đầu ra:

```text
safetyScreening
severityLevel
frequencyLevel
riskClass
matrixScore
aiRecommendation
humanDecisionRequired
suggestedActions
rationale
```

## 5. Nguyên tắc kiểm soát

1. AI chỉ hỗ trợ sàng lọc và gợi ý.
2. Không cho phép AI tự động đóng Hazard Log hoặc FRACAS.
3. Không cho phép AI tự động thay đổi trạng thái phê duyệt.
4. Tất cả kết quả AI phải lưu kèm rationale để người dùng kiểm tra.
5. Trường `humanDecisionRequired` luôn bằng `true`.
6. Trước khi cập nhật Hazard Log, người dùng phải xác nhận severity, frequency, risk class và quyết định xử lý.

## 6. Hướng phát triển tiếp theo

| Giai đoạn | Nội dung |
|---|---|
| P1 | Tích hợp service vào form Hazard Log để hiển thị đánh giá nhanh. |
| P2 | Bổ sung nút “AI đánh giá nhanh” tại màn hình tạo/sửa Hazard. |
| P3 | Lưu kết quả AI vào lịch sử rà soát nhưng không tự động phê duyệt. |
| P4 | Liên kết DNF/FRACAS, lỗi lặp lại và ảnh hưởng vận hành để tính frequency chính xác hơn. |
| P5 | Tùy chỉnh ma trận theo quy định nội bộ được phê duyệt. |
