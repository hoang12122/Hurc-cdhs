# 32 - VMMS MODULE CHECKLIST

**Mã tài liệu:** HURC-CDHS-REPORT-32  
**Tên tài liệu:** Checklist phân hệ HURC1 CRM theo VMMS mẫu  
**Phạm vi áp dụng:** Rà soát chức năng, dữ liệu, phân quyền và nghiệm thu phân hệ  
**Trạng thái:** Checklist kiểm tra bắt buộc trước staging/production  

---

## 1. Mục tiêu

Checklist này dùng để kiểm tra HURC1 CRM theo bộ năng lực tham chiếu từ VMMS mẫu. Mỗi mục phải được xác nhận bằng một trong các loại bằng chứng sau:

1. Route/màn hình trong phần mềm.
2. File mã nguồn hoặc module tương ứng.
3. Dữ liệu demo hoặc dữ liệu thật.
4. Kết quả test hoặc log CI/CD.
5. Ảnh chụp màn hình kiểm thử.
6. Biên bản nghiệm thu theo vai trò người dùng.

Không đánh dấu hoàn thành nếu chỉ có mô tả tài liệu nhưng chưa có chức năng hoặc chưa kiểm thử được.

---

## 2. Quy ước trạng thái

| Trạng thái | Ý nghĩa |
|---|---|
| Done | Đã có chức năng và có bằng chứng kiểm thử. |
| Partial | Có nền tảng hoặc có module nhưng chưa đầy đủ dữ liệu/flow/test. |
| Planned | Đã xác định yêu cầu nhưng chưa triển khai. |
| Blocked | Bị chặn bởi dữ liệu, quyền truy cập, hạ tầng hoặc dependency. |
| Not Applicable | Không áp dụng trong phạm vi HURC1 CRM hiện tại. |

---

## 3. Checklist tổng hợp theo phân hệ

| STT | Phân hệ theo VMMS | Yêu cầu kiểm tra | Trạng thái đề xuất | Bằng chứng cần có |
|---|---|---|---|---|
| 1 | Mobile Report | Có đường dẫn báo cáo sự cố nhanh từ điện thoại. | Planned | Route `/report`, mobile UI, test trên điện thoại. |
| 2 | Mobile Report | Chụp ảnh trực tiếp, chọn ảnh có sẵn, nhiều ảnh, preview, xóa từng ảnh. | Planned | Upload component, ảnh kiểm thử, log lưu file. |
| 3 | Mobile Report | Nếu ảnh lỗi thì báo cáo vẫn được lưu. | Planned | Test case upload lỗi, record vẫn tồn tại. |
| 4 | Mobile Report | Có giới hạn dung lượng rõ ràng trước khi gửi. | Planned | Guard dung lượng, thông báo song ngữ. |
| 5 | AI Triage | AI đề xuất phân loại sự cố. | Partial | AI action/service, DNF form integration. |
| 6 | AI Triage | AI đề xuất nhóm phụ trách. | Planned | Mapping group/department, quyền sửa. |
| 7 | AI Triage | AI đề xuất operational impact và priority. | Planned | Impact matrix, priority rule. |
| 8 | AI Triage | AI đề xuất nguyên nhân khả dĩ và corrective action. | Partial | Prompt, kết quả mẫu, audit log. |
| 9 | AI Triage | Có nút Apply/Apply all, con người kiểm tra trước khi lưu. | Planned | UI buttons, review-before-save logic. |
| 10 | AI Triage | Có traceability: sự cố tương tự, lý giải, confidence. | Planned | Similar incidents retrieval, confidence badge. |
| 11 | Asset Health | Có risk flag xanh/vàng/đỏ cho từng tài sản. | Partial | Asset 360 page, health scoring. |
| 12 | Asset Health | Hiển thị sự cố mở, sự cố 12 tháng, PM quá hạn, tuổi thiết bị. | Planned | Data model + query. |
| 13 | Asset Health | Có khuyến nghị bảo trì/sửa/thay theo thứ tự ưu tiên. | Planned | Recommendation engine. |
| 14 | AI Agents | Có AI hub gom agents theo nhóm nghiệp vụ. | Partial | AI Lab route, agent list. |
| 15 | AI Agents | Incident Triage agent. | Partial | DNF/FRACAS prompt + UI. |
| 16 | AI Agents | Failure Patterns agent. | Planned | Closed incidents mining. |
| 17 | AI Agents | Fleet Reliability agent. | Planned | Asset reliability query. |
| 18 | AI Agents | PM Prioritizer agent. | Planned | PM backlog + risk ranking. |
| 19 | AI Agents | PM Effectiveness agent. | Planned | PM history vs later incidents. |
| 20 | AI Agents | Stock & Reorder Advisor agent. | Planned | Inventory + vendor + lead time. |
| 21 | AI Agents | Consumption & Demand agent. | Planned | Inventory usage analysis. |
| 22 | AI Agents | Station Briefer agent. | Planned | Station-level summary. |
| 23 | AI Agents | Hotspot Analyst agent. | Partial | RAMS/hotspot panel or query. |
| 24 | AI Agents | RAMS Narrator agent. | Partial | RAMS logic + natural language output. |
| 25 | AI Agents | Safety & Hazard Trends agent. | Partial | Hazard trends + mitigation recommendations. |
| 26 | AI Agents | Daily Briefing agent. | Planned | Combined whole-system summary. |
| 27 | AI Agents | Monthly Review agent. | Planned | Monthly narrative report. |
| 28 | Email AI | Gửi phân tích AI qua email. | Planned | Email action, recipients, audit. |
| 29 | Email AI | Đính kèm PDF hoặc Excel theo loại agent. | Planned | PDF/Excel generator. |
| 30 | Email AI | Người nhận theo nhóm chuyên trách và opt-in. | Planned | User email preference + role mapping. |
| 31 | Inventory | Trang chi tiết vật tư theo kho/ngăn. | Planned | Inventory route + stock lines. |
| 32 | Inventory | Thêm/sửa vật tư, đơn vị, nhà cung cấp, nhà sản xuất. | Planned | CRUD + lookup lists. |
| 33 | Inventory | Export Excel tôn trọng bộ lọc. | Planned | Export service + filtered query. |
| 34 | Maximo | Import/mapping tài sản thật. | Partial | Import scripts, mapping spec, validation report. |
| 35 | Maximo | Import/mapping vị trí kỹ thuật dạng cây. | Partial | Location hierarchy model. |
| 36 | Maximo | Import/mapping PM schedules. | Planned | PM schedule model + due engine. |
| 37 | Maximo | Dữ liệu nhà cung cấp/nhà sản xuất. | Planned | Lookup data import. |
| 38 | CCTV/RTSP | Camera registry: model, type, IP, stream URL, station, role. | Planned | Camera schema + admin screen. |
| 39 | CCTV/RTSP | Bosch IP camera RTSP/ONVIF direct stream. | Planned | Pilot credentials + stream test. |
| 40 | CCTV/RTSP | Watec analogue camera qua encoder/DVR/NVR. | Blocked | Xác nhận recorder/encoder tại hiện trường. |
| 41 | CCTV/RTSP | AI video monitoring pipeline. | Planned | FFmpeg/OpenCV/media server + AI inference. |
| 42 | CCTV/RTSP | Read-only access, credential vault, audit. | Planned | Security design + RBAC. |
| 43 | Security | Chống dò mật khẩu, khóa tài khoản sau nhiều lần sai. | Partial | Auth service, rate limit, test. |
| 44 | Security | File/ảnh chỉ mở được khi có quyền. | Partial | Protected route/file service. |
| 45 | Security | AI chỉ đọc dữ liệu trong phạm vi quyền người hỏi. | Partial | Permission-scoped RAG/agent. |
| 46 | Security | Browser security headers, no indexing. | Planned | Next middleware/header config. |
| 47 | Reports | PDF hồ sơ sự cố/FRACAS. | Planned | PDF generator + sample. |
| 48 | Reports | RAMS report và maintenance report drill-down. | Partial | RAMS panel + report route. |
| 49 | Reports | Hazard report 14 trường + risk matrix. | Planned | Hazard report template. |
| 50 | CI/CD | Install dependencies PASS. | Blocked/Pending | GitHub Actions log on latest commit. |
| 51 | CI/CD | Typecheck PASS. | Pending | GitHub Actions log. |
| 52 | CI/CD | Lint PASS. | Pending | GitHub Actions log. |
| 53 | CI/CD | Production build PASS. | Pending | GitHub Actions log. |
| 54 | CI/CD | Docker image build PASS. | Pending | Docker Acceptance Gate. |
| 55 | CI/CD | Runtime smoke test `/api/health` PASS. | Pending | Smoke test log. |
| 56 | CI/CD | CodeQL PASS. | Pending | CodeQL workflow log. |

---

## 4. Checklist chi tiết cho nghiệm thu Mobile Report

| Mục kiểm tra | Điều kiện đạt |
|---|---|
| Truy cập nhanh | Có route chuyên dụng cho người dùng hiện trường. |
| Giao diện mobile | Form đọc được trên điện thoại, thao tác không vỡ layout. |
| Chụp ảnh | Mở camera trong form, chọn ảnh thư viện, hỗ trợ nhiều ảnh. |
| Lưu an toàn | Báo cáo vẫn lưu nếu ảnh lỗi. |
| Dung lượng | Cảnh báo rõ trước khi vượt giới hạn gửi. |
| Phân quyền | Người dùng nhà ga chỉ xem báo cáo do mình tạo nếu đó là chính sách áp dụng. |
| Audit | Lưu ai tạo, thời gian, vị trí, file đính kèm. |

---

## 5. Checklist chi tiết cho AI Triage

| Mục kiểm tra | Điều kiện đạt |
|---|---|
| Phân loại | AI đề xuất classification nhưng không tự ghi đè nếu chưa được duyệt. |
| Nhóm phụ trách | Có mapping tới maintenance/safety/operation group. |
| Priority | Có quy tắc impact → priority rõ ràng. |
| Nguyên nhân | Có probable cause kèm mức tin cậy. |
| Hành động | Có corrective action draft. |
| Traceability | Nêu các incident tương tự đã dùng làm cơ sở. |
| Human-in-the-loop | Có nút Apply/Apply all và người dùng phải bấm Lưu. |
| Audit | Lưu tác nhân AI, người áp dụng, thời điểm, trường được áp dụng. |

---

## 6. Checklist chi tiết cho Asset Health

| Mục kiểm tra | Điều kiện đạt |
|---|---|
| Risk flag | Có xanh/vàng/đỏ, quy tắc tính rõ ràng. |
| Sự cố mở | Hiển thị số DNF mở của tài sản. |
| Lịch sử 12 tháng | Thống kê sự cố theo khoảng thời gian. |
| PM quá hạn | Hiển thị PM overdue tại tài sản/vị trí. |
| Tuổi thiết bị | Có ngày lắp đặt hoặc thời gian vận hành. |
| Khuyến nghị | Có khuyến nghị sửa, thay, kiểm tra thêm hoặc điều chỉnh PM. |
| Drill-down | Bấm vào chỉ số để xem danh sách nguồn. |

---

## 7. Checklist chi tiết cho CCTV/RTSP

| Mục kiểm tra | Điều kiện đạt |
|---|---|
| Camera inventory | Lưu model, station, IP, type, stream capability. |
| Bosch IP camera | Kiểm tra RTSP trực tiếp bằng read-only credential. |
| ONVIF | Xác nhận Profile S / PTZ nếu có. |
| Watec analogue | Xác nhận DVR/NVR hoặc encoder. |
| Stream capacity | Xác nhận số luồng còn khả dụng không ảnh hưởng VMS hiện hữu. |
| Security | Không lưu plain password; dùng vault/secret store. |
| AI pipeline | Có pilot FFmpeg/OpenCV/media server và inference result. |
| Audit | Lưu ai truy cập stream, thời điểm, mục đích. |

---

## 8. Checklist kết luận trước staging/production

Chỉ được đánh dấu đủ điều kiện staging/production khi đạt tối thiểu:

| Nhóm | Điều kiện bắt buộc |
|---|---|
| CI/CD | Install, Typecheck, Lint, Build, Docker, Smoke Test, CodeQL PASS. |
| Nghiệp vụ | DNF, Hazard, Task, Asset, AI Lab có workflow demo hoàn chỉnh. |
| Dữ liệu | Có dữ liệu demo/realistic hoặc dữ liệu thật đã làm sạch. |
| Phân quyền | Có ma trận vai trò và test theo tài khoản đại diện. |
| Bảo mật | Không lộ secret, ảnh/tệp có phân quyền, AI có scope quyền. |
| Tài liệu | Có hướng dẫn user, admin, deployment, rollback và troubleshooting. |
| Báo cáo | Có biên bản kiểm thử, log CI/CD và kết luận nghiệm thu. |

---

## 9. Kết luận

Checklist này là căn cứ để kiểm tra từng phân hệ theo chuẩn VMMS mẫu. Trạng thái hiện tại của HURC1 CRM là **có nền tảng module**, nhưng nhiều hạng mục vẫn ở mức `Partial`, `Planned` hoặc `Pending`. Vì vậy, chưa được kết luận production-ready cho đến khi checklist bắt buộc và CI/CD đều đạt.
