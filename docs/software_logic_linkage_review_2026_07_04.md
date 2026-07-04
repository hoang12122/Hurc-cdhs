# Báo cáo kiểm tra logic phần mềm và liên kết chức năng

Ngày kiểm tra: 2026-07-04

## 1. Phạm vi kiểm tra

Kiểm tra tĩnh trên mã nguồn GitHub đối với các chuỗi chức năng chính:

```text
Menu/Route
→ DNF
→ Hazard Log
→ FRACAS Phase Tracker
→ RAMS Quick Calculation
→ Predictive RAMS
→ OCC Dashboard
→ Audit CI
```

## 2. Kết quả tổng quan

| Chuỗi logic | Tình trạng | Ghi chú |
|---|---|---|
| Dashboard nhận dữ liệu DNF | Đạt | Dashboard layout gọi `getDnfRecords()` và truyền dữ liệu cho FRACAS/RAMS panels. |
| DNF → Hazard Log | Đạt ở mức nền tảng; cần chuẩn hóa nút giao diện | Route `/dnf/[id]/create-hazard` đã dùng `buildDnfToHazardUrl()`, nhưng nút trên DNF Detail vẫn đang ghép query thủ công. |
| Hazard Log nhận dữ liệu từ DNF | Đạt | `hazards/new` đã nhận đủ query: consequence, controls, systemGroup, proposedActions. |
| Hazard Form → AI Hazard Flow | Đạt | Form gọi `assessHazardFlow()` và ghi kết quả vào `suggestedActions` để người có thẩm quyền rà soát. |
| FRACAS Phase Tracker | Đạt | Engine phân phase theo trạng thái DNF, tín hiệu RCA, tín hiệu long-term action và closure. |
| RAMS Quick Calculation | Đạt | Tính Service Impact, MTTR, RAMS Total, risk level, trend và hotspot từ DNF. |
| Predictive RAMS | Đạt ở mức rule-based | Tính recurrence score, asset health score, failure probability và suggested preventive action. |
| CI audit liên kết | Đạt | Có `audit-software-linkage.js` và `audit-six-step-upgrades.js`. |

## 3. Điểm mạnh hiện tại

1. Luồng dữ liệu chính đã hình thành rõ:

```text
DNF → Hazard → FRACAS → RAMS → OCC Dashboard
```

2. Dashboard không tính rời rạc mà dùng dữ liệu DNF làm nguồn chung cho FRACAS Phase Tracker, RAMS OCC Panel và Predictive RAMS Panel.

3. Hazard Log có cơ chế nhận dữ liệu từ DNF qua query param, giúp giảm nhập liệu lại.

4. AI Hazard Flow vẫn giữ nguyên tắc human review, không tự phê duyệt hoặc tự đóng hồ sơ.

5. Có audit script để tránh mất liên kết khi cập nhật phần mềm.

## 4. Điểm cần hoàn thiện

### 4.1. Chuẩn hóa nút DNF → Hazard trên DNF Detail

Hiện đã có route chuẩn:

```text
/dnf/[id]/create-hazard
```

Route này lấy DNF, gọi `buildDnfToHazardUrl(dnf)` rồi redirect sang `/hazards/new` với đủ dữ liệu.

Tuy nhiên, nút trong DNF Detail vẫn đang ghép query thủ công:

```text
/hazards/new?originatingDnfId=...&suggestedDescription=...&locationOfFailure=...
```

Khuyến nghị sửa nút này thành:

```text
/dnf/${dnf.id}/create-hazard
```

Mục tiêu: bảo đảm mọi thao tác tạo Hazard từ DNF đều đi qua cùng một helper logic, tránh lệch dữ liệu giữa các màn hình.

### 4.2. Bổ sung audit kiểm tra DNF Detail sử dụng route chuẩn

Sau khi sửa nút giao diện, bổ sung marker vào `audit-six-step-upgrades.js`:

```text
/dnf/${dnf.id}/create-hazard
```

Mục tiêu: nếu sau này có người sửa quay lại cách ghép query thủ công thì CI sẽ phát hiện.

### 4.3. Chuẩn hóa ngưỡng RAMS/Predictive RAMS

Các công thức hiện là rule-based, phù hợp demo và sàng lọc nhanh. Khi có dữ liệu vận hành thật cần hiệu chỉnh trọng số, ngưỡng high/critical và logic recurrence.

### 4.4. Khôi phục/hoàn thiện các tiện ích form nếu cần production

Một số form hiện đã được làm gọn để tích hợp AI/RAMS nhanh. Khi đưa vào vận hành chính thức cần rà lại các tiện ích cũ như upload ảnh, voice input, dropdown danh mục, offline sync, QR/barcode nếu còn yêu cầu nghiệp vụ.

## 5. Kết luận

Logic tổng thể của phần mềm hiện đã liên kết đúng hướng và không còn là các module rời rạc. Chuỗi DNF - Hazard - FRACAS - RAMS - OCC đã có nền tảng vận hành, có dashboard và có audit CI.

Vấn đề cần ưu tiên nhất là chuẩn hóa nút DNF Detail để sử dụng route `/dnf/[id]/create-hazard`, bảo đảm dữ liệu DNF được chuyển đầy đủ sang Hazard Log trong mọi trường hợp.
