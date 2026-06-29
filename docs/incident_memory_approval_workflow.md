# Quy trình phê duyệt Incident Memory

## 1. Mục tiêu

Incident Memory là kho bài học kinh nghiệm dùng cho AI Lab IncidentLearning. Để tránh AI học từ dữ liệu chưa được kiểm chứng, mọi bài học cần có trạng thái phê duyệt rõ ràng trước khi dùng làm căn cứ tham khảo mạnh.

## 2. Trạng thái phê duyệt

Incident Memory sử dụng trường:

```text
verificationState
```

Các trạng thái:

- `draft`: tự đồng bộ từ DNF/Hazard/Task/Inspection, chưa được rà soát.
- `reviewed`: đã được kỹ sư rà soát sơ bộ.
- `verified`: đã được người/phòng phụ trách xác nhận có thể dùng làm bài học kinh nghiệm.
- `rejected`: không dùng làm bài học kinh nghiệm.

## 3. Thành phần đã bổ sung

Service phê duyệt:

```text
src/lib/services/incident-memory-approval-service.ts
```

Server actions:

```text
getIncidentMemoryApprovalQueue(limit)
setIncidentMemoryVerificationState(memoryId, verificationState, verifiedBy)
```

## 4. Quy trình đề xuất

1. Chạy đồng bộ Incident Memory từ dữ liệu vận hành.
2. Kỹ sư rà soát các bản ghi `draft`.
3. Nếu nội dung đúng nhưng cần bổ sung, chuyển `reviewed`.
4. Nếu đủ cơ sở kỹ thuật, chuyển `verified`.
5. Nếu sai hoặc thiếu cơ sở, chuyển `rejected`.
6. AI Lab ưu tiên các bản ghi có trạng thái `verified` và điểm tin cậy cao.

## 5. Điều kiện dùng trong production

Không dùng Incident Memory như căn cứ xử lý chính thức nếu:

- chưa có người xác nhận;
- chưa đối chiếu DNF/Hazard/Task/Inspection gốc;
- chưa đối chiếu log, hiện trường hoặc tài liệu O&M;
- chưa xác định rõ corrective action và preventive action;
- trạng thái còn `draft` hoặc `rejected`.

## 6. Hướng cải thiện tiếp theo

- Bổ sung giao diện quản lý `/ai-lab/incident-memory`.
- Gắn quyền riêng `incident-memory:approve` thay vì dùng chung `ai:use`.
- Hiển thị link quay lại DNF/Hazard/Task/Inspection gốc.
- Ghi audit log khi đổi trạng thái.
- Tự giảm confidence nếu bài học bị đánh dấu không hiệu quả.
