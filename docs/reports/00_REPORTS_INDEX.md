# 00 - REPORTS INDEX

**Mã tài liệu:** HURC-CDHS-REPORT-00  
**Tên tài liệu:** Danh mục báo cáo kỹ thuật  
**Phạm vi áp dụng:** Thư mục `/docs/reports`  
**Mục đích:** Chuẩn hóa cách đặt tên, cách sắp xếp và cách tra cứu báo cáo kỹ thuật trong cây thư mục GitHub.

---

## 1. Nguyên tắc đặt tên thống nhất

Tất cả báo cáo trong thư mục `/docs/reports` dùng cùng một chuẩn đặt tên:

```text
NN_REPORT_TOPIC.md
```

Trong đó:

| Thành phần | Quy ước | Ví dụ |
|---|---|---|
| `NN` | Số thứ tự 02 chữ số để GitHub sắp xếp đúng thứ tự | `00`, `01`, `02` |
| `REPORT_TOPIC` | Tên báo cáo bằng tiếng Anh, viết hoa, phân tách bằng dấu `_` | `DATABASE_ARCHITECTURE_REVIEW` |
| `.md` | Định dạng Markdown | `.md` |

Không dùng lẫn các kiểu tên như:

```text
README.md
db_review_task_0.1.md
ci_cd_review_2026_07_04.md
BaoCaoTongHop.md
```

Lý do: các kiểu tên trên làm cây thư mục khó đọc, khó sắp xếp và không thống nhất giữa báo cáo quản lý và báo cáo kỹ thuật.

---

## 2. Danh mục báo cáo hiện có

| STT | File chuẩn | Nội dung | Trạng thái |
|---|---|---|---|
| 00 | `00_REPORTS_INDEX.md` | Mục lục, quy ước đặt tên và quy ước quản lý báo cáo trong `/docs/reports`. | Đã chuẩn hóa |
| 01 | `01_DATABASE_ARCHITECTURE_REVIEW.md` | Rà soát database, Prisma schema, Prisma Client, phân tách dữ liệu và rủi ro production readiness. | Đã chuẩn hóa |

---

## 3. Nhóm số thứ tự khuyến nghị

| Dải số | Nhóm báo cáo | Mục đích |
|---|---|---|
| `00` | Mục lục/quy ước | Quản lý thư mục và chuẩn đặt tên. |
| `01` - `09` | Kiến trúc và database | Database, Prisma, module architecture, data boundary. |
| `10` - `19` | CI/CD và triển khai | GitHub Actions, Docker, build logs, deployment, rollback. |
| `20` - `29` | Bảo mật và AI governance | Dependency audit, CodeQL, AI Safety, audit logs. |
| `30` - `39` | FRACAS/RAMS/OCC | DNF, Hazard, FRACAS, RAMS, Predictive RAMS, OCC Dashboard. |
| `40` - `49` | GIS/BIM/Digital Twin | Rail Network, GIS/BIM, Asset 360, Digital Twin. |
| `90` - `99` | Tổng hợp/đóng hồ sơ | Báo cáo tổng kết, checklist nghiệm thu, biên bản rà soát cuối. |

---

## 4. Cấu trúc chuẩn của một báo cáo

Mỗi báo cáo trong thư mục này nên dùng cùng một cấu trúc:

```text
1. Mục tiêu rà soát
2. Phạm vi kiểm tra
3. Kết luận nhanh
4. Hiện trạng kỹ thuật
5. Rủi ro / tồn tại
6. Đánh giá mức độ ưu tiên
7. Đề xuất hành động
8. Checklist kiểm tra
9. Kết luận
```

---

## 5. Nguyên tắc cập nhật

1. Không đưa dữ liệu nhạy cảm như mật khẩu, secret, token hoặc connection string thật vào báo cáo.
2. Khi đổi tên báo cáo, phải cập nhật lại file mục lục này.
3. Khi phần mềm đã thay đổi, phải cập nhật lại kết luận, rủi ro và checklist.
4. Mỗi báo cáo phải có nội dung kiểm tra được bằng file, module, lệnh hoặc điều kiện nghiệm thu cụ thể.
5. Không dùng lẫn tiếng Việt không dấu, tiếng Việt có dấu và tiếng Anh tự do trong tên file. Tên file dùng tiếng Anh viết hoa, còn nội dung báo cáo viết tiếng Việt.

---

## 6. Kết luận

Thư mục `/docs/reports` sử dụng chuẩn tên `NN_REPORT_TOPIC.md` để cây thư mục GitHub hiển thị rõ thứ tự, rõ nhóm nội dung và không còn lẫn nhiều kiểu đặt tên khác nhau. Các báo cáo mới phải tuân thủ chuẩn này trước khi đưa vào nhánh `master`.
