# 00 - DOCUMENTATION STRUCTURE AND WRITING GUIDE

**Mã tài liệu:** HURC-CDHS-DOC-00  
**Tên tài liệu:** Quy chuẩn sắp xếp thư mục và biên soạn tài liệu phần mềm  
**Phạm vi áp dụng:** Toàn bộ thư mục `docs/`, `docs/reports/` và các tài liệu liên quan đến HURC1 CRM  
**Đối tượng áp dụng:** Lập trình viên, kỹ sư, người dùng cuối, quản trị hệ thống, quản lý dự án và đơn vị nghiệm thu  
**Trạng thái:** Quy chuẩn áp dụng thống nhất  

---

## 1. Mục đích

Tài liệu này quy định cách phân loại, sắp xếp, đặt tên và biên soạn tài liệu cho phần mềm **HURC1 CRM** nhằm bảo đảm:

1. Người đọc dễ tìm đúng tài liệu cần dùng.
2. Tài liệu có cấu trúc thống nhất, dễ cập nhật và dễ kiểm soát phiên bản.
3. Tài liệu kỹ thuật, tài liệu người dùng, tài liệu quản lý và tài liệu nghiệm thu không bị trộn lẫn.
4. Nội dung tài liệu phù hợp với từng nhóm đối tượng đọc.
5. Hạn chế tình trạng tài liệu lan man, lặp ý, thiếu bằng chứng hoặc không còn đúng với mã nguồn.

---

## 2. Nguyên tắc xác định đối tượng đọc

Trước khi viết tài liệu, người biên soạn phải xác định rõ người đọc chính là ai. Cùng một phần mềm có thể cần nhiều loại tài liệu khác nhau cho các nhóm đối tượng khác nhau.

| Nhóm người đọc | Nhu cầu chính | Loại tài liệu phù hợp | Yêu cầu trình bày |
|---|---|---|---|
| Lập trình viên / Kỹ sư phần mềm | Hiểu kiến trúc, mã nguồn, API, database, module boundary, CI/CD. | Technical Guide, API Guide, Developer Guide, Architecture Document. | Có sơ đồ, cấu trúc file, lệnh chạy, quy tắc code, lỗi thường gặp. |
| Kỹ sư vận hành / bảo trì | Hiểu luồng DNF, Hazard, Task, Asset, GIS/BIM, AI Lab. | User Manual theo nghiệp vụ, SOP thao tác, checklist kiểm thử. | Dễ đọc, từng bước, có tình huống thực tế, tránh thuật ngữ lập trình sâu. |
| Người dùng cuối / nhà ga / OCC | Biết đăng nhập, tạo báo cáo, xem trạng thái, tải báo cáo. | User Manual, Quick Guide, FAQ. | Ngắn gọn, trực quan, có ảnh minh họa hoặc flow thao tác. |
| Quản trị hệ thống | Quản lý tài khoản, phân quyền, cấu hình, backup, triển khai. | Admin Guide, Deployment Guide, Security Guide. | Có cảnh báo bảo mật, quyền hạn, cấu hình môi trường, rollback. |
| Quản lý dự án / Lãnh đạo | Nắm phạm vi, tiến độ, rủi ro, mức sẵn sàng triển khai. | Overview, Benchmark Report, Production Readiness Report, Gap Assessment. | Tóm tắt rõ, có bảng đánh giá, kết luận, khuyến nghị hành động. |
| Đơn vị nghiệm thu / kiểm thử | Xác nhận chức năng, dữ liệu, bảo mật, CI/CD, vận hành. | QA Checklist, Acceptance Report, Test Evidence. | Có tiêu chí PASS/FAIL, bằng chứng, log, ảnh chụp, người xác nhận. |

---

## 3. Phân loại tài liệu cần viết

### 3.1. Tài liệu tổng quan

Dùng để giới thiệu mục tiêu, phạm vi, phân hệ và lợi ích của phần mềm.

Ví dụ:

```text
README.md
PROJECT_OVERVIEW.md
VMMS_BENCHMARK_GAP_ASSESSMENT.md
```

Nội dung chính:

1. Phần mềm là gì.
2. Giải quyết vấn đề nào.
3. Đối tượng sử dụng.
4. Phân hệ chính.
5. Phạm vi hiện tại và giới hạn chưa hoàn thiện.

### 3.2. Tài liệu đặc tả yêu cầu phần mềm

Dùng để mô tả yêu cầu chức năng và phi chức năng.

Ví dụ:

```text
SRS.md
MODULE_REQUIREMENTS.md
BUSINESS_REQUIREMENTS.md
```

Nội dung chính:

1. Mục đích.
2. Phạm vi hệ thống.
3. Vai trò người dùng.
4. Yêu cầu chức năng.
5. Yêu cầu phi chức năng.
6. Ràng buộc kỹ thuật.
7. Tiêu chí nghiệm thu.

### 3.3. Tài liệu kỹ thuật

Dùng cho lập trình viên, kỹ sư hệ thống và người bảo trì mã nguồn.

Ví dụ:

```text
1_SYSTEM_ARCHITECTURE.md
2_DESIGN_AND_CODING_RULES.md
3_DEVELOPER_GUIDE.md
API_INTEGRATION_GUIDE.md
DATABASE_ARCHITECTURE_REVIEW.md
```

Nội dung chính:

1. Kiến trúc tổng thể.
2. Module boundary.
3. Service/data flow.
4. Database/schema.
5. API hoặc integration.
6. Lệnh build/test/deploy.
7. Quy tắc bảo trì mã nguồn.

### 3.4. Tài liệu hướng dẫn sử dụng

Dùng cho người dùng cuối, kỹ sư vận hành, OCC, nhà ga, lãnh đạo và các phòng/xí nghiệp.

Ví dụ:

```text
USER_MANUAL.md
ADMIN_USER_GUIDE.md
QUICK_START_GUIDE.md
FAQ.md
```

Nội dung chính:

1. Cách đăng nhập.
2. Cách sử dụng từng phân hệ.
3. Cách tạo/sửa/xem hồ sơ.
4. Cách xuất báo cáo.
5. Cách xử lý lỗi cơ bản.
6. Câu hỏi thường gặp.

### 3.5. Tài liệu triển khai và vận hành

Dùng cho quản trị hệ thống, DevOps và người vận hành hạ tầng.

Ví dụ:

```text
4_DEPLOYMENT_AND_OPS.md
PRODUCTION_READINESS_VMMS_BENCHMARK.md
TROUBLESHOOTING_GUIDE.md
ROLLBACK_GUIDE.md
```

Nội dung chính:

1. Yêu cầu môi trường.
2. Biến môi trường.
3. Docker/Docker Compose.
4. CI/CD.
5. Healthcheck.
6. Backup/restore.
7. Rollback.
8. Xử lý sự cố.

### 3.6. Tài liệu kiểm thử và nghiệm thu

Dùng để xác nhận mức độ sẵn sàng của phần mềm trước staging/production.

Ví dụ:

```text
QA_ACCEPTANCE_CHECKLIST.md
VMMS_MODULE_CHECKLIST.md
PRODUCTION_READINESS_REPORT.md
```

Nội dung chính:

1. Phạm vi kiểm thử.
2. Tiêu chí PASS/FAIL.
3. Log CI/CD.
4. Kịch bản nghiệp vụ.
5. Kết quả kiểm thử.
6. Tồn tại/rủi ro.
7. Kết luận nghiệm thu.

---

## 4. Cấu trúc thư mục tài liệu chuẩn

Thư mục tài liệu của HURC1 CRM được chuẩn hóa theo hướng sau:

```text
docs/
├── 00_DOCUMENTATION_STRUCTURE_AND_WRITING_GUIDE.md
├── 0_SOFTWARE_LIFECYCLE_MANUAL.md
├── 1_SYSTEM_ARCHITECTURE.md
├── 2_DESIGN_AND_CODING_RULES.md
├── 3_DEVELOPER_GUIDE.md
├── 4_DEPLOYMENT_AND_OPS.md
├── 5_ADMIN_USER_GUIDE.md
├── 6_MODULES_AND_FEATURES.md
├── user-guides/
│   ├── README.md
│   ├── DNF_USER_GUIDE.md
│   ├── HAZARD_USER_GUIDE.md
│   ├── ASSET_360_USER_GUIDE.md
│   ├── AI_LAB_USER_GUIDE.md
│   └── FAQ.md
├── technical/
│   ├── README.md
│   ├── API_INTEGRATION_GUIDE.md
│   ├── DATABASE_GUIDE.md
│   ├── MODULE_BOUNDARY_GUIDE.md
│   └── SECURITY_GUIDE.md
├── operations/
│   ├── README.md
│   ├── DEPLOYMENT_RUNBOOK.md
│   ├── ROLLBACK_GUIDE.md
│   ├── BACKUP_RESTORE_GUIDE.md
│   └── TROUBLESHOOTING_GUIDE.md
└── reports/
    ├── 00_REPORTS_INDEX.md
    ├── 31_VMMS_BENCHMARK_GAP_ASSESSMENT.md
    ├── 32_VMMS_MODULE_CHECKLIST.md
    └── 90_PRODUCTION_READINESS_VMMS_BENCHMARK.md
```

Ghi chú: cấu trúc trên là hướng chuẩn hóa. Trường hợp repo hiện còn tài liệu cũ ở cấp `docs/`, không di chuyển hàng loạt nếu chưa kiểm tra liên kết trong README, CI audit và đường dẫn tham chiếu.

---

## 5. Quy ước đặt tên file

### 5.1. Tài liệu cấp chính

Dùng số thứ tự và tên tiếng Anh viết hoa:

```text
1_SYSTEM_ARCHITECTURE.md
2_DESIGN_AND_CODING_RULES.md
3_DEVELOPER_GUIDE.md
```

### 5.2. Báo cáo trong `docs/reports/`

Dùng chuẩn:

```text
NN_REPORT_TOPIC.md
```

Ví dụ:

```text
31_VMMS_BENCHMARK_GAP_ASSESSMENT.md
32_VMMS_MODULE_CHECKLIST.md
90_PRODUCTION_READINESS_VMMS_BENCHMARK.md
```

### 5.3. Tài liệu hướng dẫn người dùng

Dùng tên module + loại tài liệu:

```text
DNF_USER_GUIDE.md
HAZARD_USER_GUIDE.md
ASSET_360_USER_GUIDE.md
AI_LAB_USER_GUIDE.md
```

### 5.4. Không dùng các kiểu tên sau

```text
Tai lieu moi.md
huongdan.docx
final-final.md
ban-moi-nhat.md
report test.md
```

Lý do: các tên này khó kiểm soát, khó tìm kiếm và không thể hiện rõ phạm vi tài liệu.

---

## 6. Cấu trúc chuẩn của một tài liệu

Một tài liệu đầy đủ nên có cấu trúc tối thiểu như sau:

```text
1. Trang thông tin tài liệu
2. Mục đích
3. Phạm vi áp dụng
4. Đối tượng sử dụng
5. Thuật ngữ / viết tắt nếu có
6. Nội dung chính
7. Quy trình hoặc hướng dẫn từng bước
8. Lưu ý / rủi ro / giới hạn
9. FAQ hoặc troubleshooting nếu phù hợp
10. Kết luận / checklist hoàn thành
```

Đối với tài liệu kỹ thuật, cần bổ sung:

```text
- Sơ đồ kiến trúc hoặc sơ đồ luồng.
- Cấu trúc thư mục hoặc module liên quan.
- Lệnh kiểm thử.
- Điều kiện PASS/FAIL.
- Liên kết đến file nguồn hoặc workflow liên quan.
```

Đối với tài liệu người dùng cuối, cần bổ sung:

```text
- Ảnh chụp màn hình nếu có.
- Các bước thao tác ngắn gọn.
- Lỗi thường gặp và cách xử lý.
- Không dùng thuật ngữ lập trình nếu không cần thiết.
```

---

## 7. Nguyên tắc trình bày

1. Viết ngắn gọn, rõ ý, tránh lặp từ.
2. Mỗi mục chỉ trình bày một nhóm nội dung chính.
3. Dùng bảng khi cần so sánh, checklist hoặc phân quyền.
4. Dùng danh sách đánh số cho quy trình bắt buộc thực hiện theo thứ tự.
5. Dùng bullet cho nhóm ý không cần thứ tự.
6. Không mô tả quá mức năng lực phần mềm nếu chưa có bằng chứng kiểm thử.
7. Không đưa mật khẩu, secret, token, connection string thật vào tài liệu.
8. Khi nói phần mềm đã đạt hoặc đã hoàn thành, phải có bằng chứng: file, route, test, log hoặc biên bản.
9. Cập nhật tài liệu ngay khi đổi tính năng, workflow, API, cấu hình hoặc CI/CD.
10. Nội dung tài liệu nên viết bằng tiếng Việt chuẩn; tên file có thể dùng tiếng Anh để dễ quản lý trong GitHub.

---

## 8. Mẫu trang thông tin tài liệu

Mỗi tài liệu nên mở đầu bằng khối thông tin sau:

```text
# TÊN TÀI LIỆU

Mã tài liệu:
Tên tài liệu:
Phiên bản:
Ngày cập nhật:
Người cập nhật:
Phạm vi áp dụng:
Đối tượng sử dụng:
Trạng thái:
```

Ví dụ:

```text
# DNF USER GUIDE

Mã tài liệu: HURC-CDHS-USER-DNF-01
Tên tài liệu: Hướng dẫn sử dụng phân hệ DNF
Phiên bản: v1.0
Ngày cập nhật: 08/07/2026
Người cập nhật: HURC1 CRM Team
Phạm vi áp dụng: Phân hệ DNF
Đối tượng sử dụng: Kỹ sư, kỹ thuật viên, đội trưởng, quản lý phòng/xí nghiệp
Trạng thái: Dự thảo nghiệm thu
```

---

## 9. Mẫu checklist trước khi đưa tài liệu vào repo

Trước khi commit tài liệu, kiểm tra:

| STT | Nội dung kiểm tra | Đạt/Không đạt |
|---|---|---|
| 1 | Tên file đúng quy ước. |  |
| 2 | Tài liệu có mục đích và phạm vi rõ ràng. |  |
| 3 | Xác định đúng đối tượng đọc. |  |
| 4 | Cấu trúc có tiêu đề, mục, bảng hoặc checklist khi cần. |  |
| 5 | Không có mật khẩu, secret, token hoặc dữ liệu nhạy cảm. |  |
| 6 | Không kết luận production-ready nếu chưa có CI/CD xanh. |  |
| 7 | Các đường dẫn file/route/workflow được ghi đúng. |  |
| 8 | Nếu là tài liệu hướng dẫn, có bước thao tác cụ thể. |  |
| 9 | Nếu là tài liệu kỹ thuật, có lệnh kiểm thử hoặc bằng chứng kiểm tra. |  |
| 10 | Đã cập nhật mục lục hoặc README liên quan. |  |

---

## 10. Công cụ quản lý tài liệu

Tùy mục đích sử dụng, có thể áp dụng:

| Công cụ | Khi sử dụng | Ghi chú |
|---|---|---|
| GitHub Markdown | Tài liệu đi kèm mã nguồn, cần version control. | Áp dụng chính cho repo HURC1 CRM. |
| GitHub Wiki | Tài liệu nội bộ mở rộng, ít phụ thuộc CI. | Chỉ dùng nếu cần tách khỏi mã nguồn. |
| Notion | Tài liệu trình bày nhanh, dễ chia sẻ cho người dùng không kỹ thuật. | Cần đồng bộ lại bản chuẩn vào repo nếu dùng cho nghiệm thu. |
| Confluence | Quản lý tri thức nhóm, quy trình nội bộ, phân quyền tài liệu. | Phù hợp khi tổ chức có hệ thống quản lý tri thức riêng. |

Đối với HURC1 CRM, bản chuẩn có giá trị kiểm soát phiên bản nên được lưu trong GitHub.

---

## 11. Quy trình cập nhật tài liệu

Khi phần mềm thay đổi, thực hiện quy trình sau:

```text
1. Xác định thay đổi thuộc nhóm nào: tính năng, API, database, UI, deploy, bảo mật, CI/CD.
2. Xác định tài liệu bị ảnh hưởng.
3. Cập nhật nội dung tương ứng.
4. Cập nhật mục lục nếu thêm tài liệu mới.
5. Chạy kiểm tra tài liệu nếu có audit script.
6. Commit vào nhánh main.
7. Không kết luận trạng thái mới nếu chưa có test/log tương ứng.
```

---

## 12. Kết luận

Việc sắp xếp tài liệu phải dựa trên đối tượng đọc, loại tài liệu và mục đích sử dụng. Đối với HURC1 CRM, tài liệu không chỉ để mô tả phần mềm mà còn là bằng chứng phục vụ kiểm thử, nghiệm thu, vận hành và đánh giá production readiness.

Từ thời điểm áp dụng tài liệu này, mọi tài liệu mới cần tuân thủ 04 nguyên tắc:

1. Đúng đối tượng đọc.
2. Đúng loại tài liệu.
3. Đúng cấu trúc và tên file.
4. Có bằng chứng kiểm tra khi đưa ra kết luận kỹ thuật hoặc nghiệm thu.
