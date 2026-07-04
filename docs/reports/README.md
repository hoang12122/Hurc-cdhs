# Thư mục báo cáo kỹ thuật

Thư mục này lưu các báo cáo rà soát kỹ thuật, kiến trúc phần mềm, database, CI/CD, bảo mật, dữ liệu và các nội dung liên quan đến kiểm soát chất lượng hệ thống HURC CDHS.

## 1. Mục tiêu quản lý

Các báo cáo trong thư mục này dùng để:

- Ghi nhận hiện trạng kỹ thuật tại từng thời điểm.
- Làm căn cứ kiểm tra khi thay đổi kiến trúc hoặc migration dữ liệu.
- Theo dõi rủi ro còn tồn tại và kế hoạch xử lý.
- Hỗ trợ báo cáo quản lý, bàn giao kỹ thuật và kiểm tra nội bộ.

## 2. Danh mục báo cáo hiện có

| File | Nội dung | Trạng thái |
|---|---|---|
| `db_review_task_0.1.md` | Rà soát cấu trúc database, Prisma schema, Prisma Client, phân tách dữ liệu nghiệp vụ/AI/metro, rủi ro production readiness và đề xuất hành động. | Đã viết lại và cập nhật theo kiến trúc hiện tại. |

## 3. Quy ước trình bày báo cáo

Mỗi báo cáo nên có tối thiểu các phần sau:

```text
1. Mục tiêu rà soát
2. Phạm vi kiểm tra
3. Kết luận nhanh
4. Hiện trạng kỹ thuật
5. Rủi ro/tồn tại
6. Đánh giá mức độ ưu tiên
7. Đề xuất hành động
8. Checklist kiểm tra
9. Kết luận
```

## 4. Quy ước đặt tên file

Khuyến nghị đặt tên theo dạng:

```text
<nhom-noi-dung>_<task-or-topic>_<version-or-date>.md
```

Ví dụ:

```text
db_review_task_0.1.md
ci_cd_review_2026_07_04.md
security_audit_2026_07_04.md
rams_dashboard_review_2026_07_04.md
```

## 5. Nguyên tắc cập nhật

1. Không ghi nhận thông tin đã lỗi thời mà không nêu rõ bối cảnh/thời điểm.
2. Khi phần mềm đã thay đổi, phải cập nhật lại kết luận và rủi ro.
3. Nội dung đánh giá phải gắn với file/module cụ thể nếu có thể.
4. Không đưa dữ liệu nhạy cảm như mật khẩu, secret, token hoặc connection string thật vào báo cáo.
5. Mỗi báo cáo nên có phần checklist để người vận hành có thể kiểm tra lại bằng lệnh.

## 6. Hướng mở rộng tiếp theo

Các báo cáo nên bổ sung trong giai đoạn tiếp theo:

| Báo cáo đề xuất | Mục tiêu |
|---|---|
| `ci_cd_review_2026_07_04.md` | Rà soát workflow GitHub Actions, build phase logs, smoke test, dependency audit và artifact logs. |
| `fracas_rams_logic_review_2026_07_04.md` | Rà soát logic FRACAS, Hazard, RAMS, Predictive RAMS và OCC Dashboard. |
| `security_audit_2026_07_04.md` | Rà soát quyền truy cập, audit logs, AI Safety logs và dependency vulnerabilities. |
| `data_consistency_review_2026_07_04.md` | Rà soát tính nhất quán cross-database giữa DNF, Hazard, TrustGraph, AI logs và Asset. |
