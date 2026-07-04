# Báo cáo kiểm tra chuyên sâu logic và liên kết chức năng lõi

Ngày kiểm tra: 2026-07-04

## 1. Mục tiêu

Kiểm tra chuyên sâu chuỗi logic nghiệp vụ chính của phần mềm, tập trung vào việc dữ liệu có đi đúng luồng hay không, các chức năng có liên kết với nhau hay không, và CI có đủ lớp kiểm soát để phát hiện lỗi liên kết trong các lần cập nhật tiếp theo hay không.

## 2. Chuỗi logic nghiệp vụ chính

```text
DNF / Incident
→ DNF Detail
→ DNF to Hazard normalized route
→ Hazard New Form Prefill
→ Hazard AI Review
→ FRACAS Phase Tracker
→ RAMS Quick Calculation
→ Predictive RAMS Layer
→ OCC Dashboard
→ CI Audit / Smoke Test / Build Logs
```

## 3. Kết quả kiểm tra theo từng lớp

| Lớp | Kết quả | Nhận xét |
|---|---|---|
| DNF data source | Đạt | `getDnfRecords()` lấy dữ liệu DNF và các thao tác create/update/delete đều revalidate dashboard. |
| DNF Detail → Hazard | Đạt về runtime normalization | Link cũ vẫn được middleware chuyển về route chuẩn `/dnf/[id]/create-hazard`. |
| DNF to Hazard helper | Đạt | Helper sinh đủ query: description, consequence, controls, systemGroup, severity và proposedActions. |
| Hazard New prefill | Đạt | Page nhận đủ query và map vào `HazardForm`. |
| Hazard AI Review | Đạt | Hazard Form gọi AI, ghi kết quả vào suggestedActions và giữ human review. |
| FRACAS Phase Tracker | Đạt | Engine phân phase theo status, RCA signal, long-term action signal và closure. |
| RAMS Quick Engine | Đạt | Tính Service Impact, MTTR, RAMS Total, trend, hotspot và OCC highlights. |
| Predictive RAMS | Đạt ở mức rule-based | Tính recurrence score, asset health, failure probability và predicted hotspot. |
| Dashboard integration | Đạt | Dashboard lấy DNF records một lần và truyền cho FRACAS/RAMS/Predictive panels. |
| CI audit | Đạt | Có audit linkage, six-step audit và core workflow logic audit. |

## 4. Điểm kiểm tra chuyên sâu đã bổ sung

File mới:

```text
scripts/audit-core-workflow-logic.js
```

Script này kiểm tra các marker có ý nghĩa nghiệp vụ, gồm:

- DNF action và revalidate dashboard.
- DNF to Hazard helper.
- Middleware chuẩn hóa link cũ.
- Route `/dnf/[id]/create-hazard`.
- Hazard New prefill.
- Hazard AI Review.
- Dashboard layout.
- FRACAS phase engine.
- RAMS quick engine.
- Predictive RAMS engine.
- CI workflow coverage.

Lệnh chạy:

```bash
node scripts/audit-core-workflow-logic.js
```

## 5. Phân tích điểm mạnh

### 5.1. Dữ liệu DNF là nguồn trung tâm

DNF không chỉ là form ghi nhận sự cố mà đã trở thành nguồn dữ liệu cho dashboard, FRACAS phase, RAMS và predictive RAMS. Đây là logic đúng vì FRACAS/RAMS phải xuất phát từ dữ liệu sự cố thực tế.

### 5.2. Luồng DNF → Hazard đã có cơ chế chống thiếu dữ liệu

Dù nút cũ trên DNF Detail còn sử dụng query ngắn, middleware sẽ chuyển link đó về route chuẩn để tái tạo URL đầy đủ. Điều này giúp bảo vệ luồng dữ liệu khi còn tồn tại link cũ.

### 5.3. Dashboard đã liên kết nhiều lớp nghiệp vụ

Dashboard không chỉ hiển thị số liệu tổng quan mà đã gom:

```text
FRACAS Phase Tracker
RAMS OCC Dashboard
Predictive RAMS Panel
```

Điều này hỗ trợ OCC và người quản lý nhìn được tình trạng hồ sơ, mức ảnh hưởng dịch vụ, MTTR, hotspot và nguy cơ tái diễn.

### 5.4. Có nhiều lớp audit

Hiện có 03 lớp audit liên quan trực tiếp đến logic nghiệp vụ:

```text
audit-software-linkage.js
audit-six-step-upgrades.js
audit-core-workflow-logic.js
```

Các script này giúp tránh lỗi mất liên kết khi cập nhật phần mềm.

## 6. Điểm còn cần kiểm chứng bằng runtime

Kiểm tra hiện tại là kiểm tra tĩnh trên GitHub. Các nội dung sau cần được xác nhận bằng GitHub Actions hoặc local build:

1. Route `/hazards/new?originatingDnfId=...` có redirect đúng về `/dnf/[id]/create-hazard` hay không.
2. Route `/dnf/[id]/create-hazard` khi có DNF thật có redirect sang `/hazards/new` với đủ query hay không.
3. Hazard Form có hiển thị đầy đủ các trường prefill trên UI hay không.
4. Dashboard có render đủ 03 panel khi dữ liệu DNF rỗng hoặc khi dữ liệu lớn hay không.
5. Predictive RAMS có cần giới hạn số nhóm/hotspot để tránh chậm khi số lượng DNF tăng cao hay không.

## 7. Khuyến nghị tiếp theo

| Ưu tiên | Nội dung | Lý do |
|---|---|---|
| Cao | Gắn `audit-core-workflow-logic.js` vào GitHub Actions | Đảm bảo CI bắt lỗi logic lõi, không chỉ kiểm tra marker cũ. |
| Cao | Bổ sung smoke test cho `/fracas-risk-management`, `/shamma-benchmark`, `/demo-case-study`, `/hazards/new?originatingDnfId=...` | Bắt lỗi runtime route mới. |
| Trung bình | Sửa trực tiếp nút DNF Detail sang `/dnf/${dnf.id}/create-hazard` khi có điều kiện chỉnh file lớn an toàn | Middleware đã bảo vệ, nhưng sửa trực tiếp sẽ sạch hơn. |
| Trung bình | Hiệu chỉnh công thức RAMS/Predictive RAMS theo dữ liệu thật | Công thức hiện phù hợp demo/sàng lọc nhanh. |

## 8. Kết luận

Logic phần mềm hiện đã liên kết đúng theo chuỗi nghiệp vụ FRACAS - Hazard - RAMS - OCC. Điểm mạnh là DNF đóng vai trò nguồn dữ liệu trung tâm, còn Dashboard là nơi tổng hợp trạng thái phase, RAMS và hotspot. Các lớp audit hiện có giúp kiểm soát rủi ro đứt liên kết trong quá trình phát triển.

Điểm cần làm tiếp là đưa audit logic lõi vào CI và mở rộng smoke test cho các route nghiệp vụ mới để xác nhận runtime, không chỉ kiểm tra tĩnh.
