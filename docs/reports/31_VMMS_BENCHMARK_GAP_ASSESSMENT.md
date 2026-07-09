# 31 - VMMS BENCHMARK GAP ASSESSMENT

**Mã tài liệu:** HURC-CDHS-REPORT-31  
**Tên tài liệu:** Chuẩn hóa so sánh HURC1 CRM và VMMS mẫu  
**Phạm vi áp dụng:** HURC1 CRM / Metro Inspect Pro  
**Nguồn đối chiếu:** Tài liệu VMMS mẫu, tài liệu tài khoản demo, tài liệu tính khả thi camera feed AI, mã nguồn HURC1 CRM tại nhánh `main`  
**Trạng thái:** Báo cáo benchmark và khoảng cách nghiệp vụ  

---

## 1. Mục tiêu rà soát

Tài liệu này chuẩn hóa nội dung so sánh giữa **HURC1 CRM** và **VMMS mẫu** nhằm xác định:

1. Các điểm đã tương đồng về định hướng nghiệp vụ.
2. Các phân hệ HURC1 CRM đã có trong mã nguồn/tài liệu.
3. Các khoảng cách cần bổ sung để tiến gần chuẩn VMMS mẫu.
4. Điều kiện tối thiểu trước khi kết luận hệ thống sẵn sàng triển khai staging hoặc production.

Tài liệu không kết luận HURC1 CRM đã tương đương hoàn toàn VMMS mẫu nếu chưa có đủ kiểm thử, dữ liệu thật, phân quyền thật và bằng chứng CI/CD chạy thành công.

---

## 2. Phạm vi đối chiếu

Phạm vi benchmark gồm các nhóm phân hệ sau:

| Nhóm | Nội dung đối chiếu |
|---|---|
| Quản lý sự cố | DNF, báo cáo hiện trường, ảnh minh chứng, phân loại, điều phối, closure. |
| Quản lý mối nguy | Hazard Log, risk matrix, liên kết DNF sang Hazard, theo dõi giảm thiểu. |
| Công việc và bảo trì | Task, Work Order, PM, backlog, đúng hạn/quá hạn. |
| Tài sản | Asset 360, Asset Health, lịch sử tài sản, liên kết sự cố/bảo trì. |
| AI | AI triage, AI image analysis, AI agents, RAG, Q&A, FRACAS prompts. |
| GIS/BIM/Digital Twin | Rail Network, GIS/BIM Twin, Spatial Twin, mô hình kỹ thuật và dữ liệu không gian. |
| Báo cáo | Dashboard, RAMS, PDF/Excel, email AI analysis, audit log. |
| Tích hợp dữ liệu | Maximo, inventory, nhà cung cấp, nhà sản xuất, vị trí kỹ thuật, PM schedules. |
| CCTV/AI Monitoring | RTSP/ONVIF, Bosch IP camera, Watec analogue camera, video encoder/DVR/NVR. |
| CI/CD và production readiness | Install, typecheck, lint, build, Docker, smoke test, CodeQL, Trivy. |

---

## 3. Kết luận nhanh

HURC1 CRM có khung nghiệp vụ phù hợp cho hệ thống quản trị, giám sát và hỗ trợ bảo trì đường sắt đô thị. Các module nền tảng như Dashboard, DNF, Hazards, Inspections, Tasks, Asset 360, Rail Network, GIS/BIM Twin, AI Lab và Admin đã được định danh trong tài liệu và mã nguồn.

Tuy nhiên, so với VMMS mẫu, HURC1 CRM vẫn cần hoàn thiện thêm các năng lực sau:

1. Mobile incident reporting có ảnh hiện trường và giới hạn dung lượng rõ ràng.
2. AI triage trong biểu mẫu sự cố và nút áp dụng đề xuất.
3. Asset Health Check có điểm rủi ro, dữ liệu cứng và khuyến nghị.
4. Bộ AI agents đầy đủ theo nhóm nghiệp vụ.
5. Gửi phân tích AI qua email kèm PDF/Excel.
6. Inventory nâng cấp, danh mục vật tư, nhà cung cấp, nhà sản xuất.
7. Dữ liệu Maximo hoặc dữ liệu tài sản/bảo trì thật.
8. CCTV/RTSP/ONVIF pipeline cho AI monitoring.
9. Bằng chứng CI/CD chạy xanh đầy đủ trên nhánh `main`.

---

## 4. Hiện trạng HURC1 CRM

### 4.1. Định vị hệ thống

HURC1 CRM được định vị là hệ thống quản trị, giám sát và hỗ trợ bảo trì đường sắt đô thị. Phần mềm hỗ trợ các nghiệp vụ kiểm tra, DNF, mối nguy, công việc, tài sản, AI Lab, GIS/BIM và Digital Twin.

Hệ thống hiện đi theo kiến trúc **Modular Monolith, Micro-Frontend-ready**. Nghĩa là các module vẫn chạy trong cùng Next.js App Shell, nhưng đã có ranh giới module, registry, Service Bus và các audit script hỗ trợ kiểm soát kiến trúc.

### 4.2. Các module hiện có

| Module | Tình trạng định danh | Đánh giá |
|---|---|---|
| Dashboard | Có | Cần dữ liệu và dashboard vận hành thật để nghiệm thu. |
| DNF | Có | Cần hoàn thiện mobile report, phase tracking, RCA, closure evidence. |
| Hazards | Có | Cần liên kết một chạm từ DNF sang Hazard và risk evidence. |
| Inspections | Có | Cần checklist động, ảnh hiện trường, QR/asset binding nếu áp dụng. |
| Tasks | Có | Cần kết nối rõ với DNF/Hazard/PM. |
| Asset 360 | Có | Cần dữ liệu asset thật, health score, history, movement, PM linkage. |
| Rail Network | Có | Cần dữ liệu tuyến, ga, vị trí kỹ thuật, liên kết asset. |
| GIS/BIM Twin | Có | Cần dữ liệu BIM/GIS thật và quy trình import/validation. |
| AI Lab | Có | Cần kiểm thử RAG, agents, quyền dữ liệu, audit, timeout. |
| Admin | Có | Cần ma trận vai trò tương ứng với demo roles và nghiệp vụ HURC. |

---

## 5. Đối chiếu với VMMS mẫu

### 5.1. Điểm tương đồng

| Nội dung | HURC1 CRM | VMMS mẫu | Nhận xét |
|---|---|---|---|
| Quản lý sự cố | Có DNF module | Có incident/FRACAS workflow | Cùng hướng nghiệp vụ. |
| Quản lý mối nguy | Có Hazards module | Có báo cáo nguy hiểm/risk matrix | Cần chuẩn hóa form và trạng thái. |
| Tài sản | Có Asset 360 | Có dữ liệu asset, asset health, movement | HURC1 CRM cần dữ liệu thật và health logic. |
| AI | Có AI Lab, RAG, YOLO flag, FRACAS prompts | Có AI triage, AI photo analysis, Q&A, agents | HURC1 CRM cần đóng gói AI theo vai trò/ngữ cảnh. |
| GIS/BIM | Có GIS/BIM Twin | VMMS nhấn mạnh dữ liệu module và Maximo | Cần xác định luồng import, mapping và nghiệm thu dữ liệu. |
| Báo cáo | Có dashboard/CI docs | VMMS có PDF/Excel/email AI | Cần bổ sung export và email workflow. |

### 5.2. Khoảng cách chính

| Mã | Khoảng cách | Mức ưu tiên | Điều kiện hoàn thành |
|---|---|---|---|
| GAP-01 | Mobile Report `/report` có ảnh hiện trường | Cao | Có route/form mobile, upload ảnh, preview, giới hạn dung lượng, lưu không mất báo cáo nếu ảnh lỗi. |
| GAP-02 | AI Triage trong từng DNF | Cao | AI đề xuất classification, responsible group, impact, probable cause, corrective action; người dùng xác nhận trước khi lưu. |
| GAP-03 | DNF → Hazard one-click workflow | Cao | Có nút tạo Hazard từ DNF, auto-fill mô tả, hậu quả, kiểm soát và link nguồn. |
| GAP-04 | Asset Health Check | Cao | Có risk flag, số sự cố mở, số sự cố 12 tháng, PM quá hạn, tuổi thiết bị, khuyến nghị. |
| GAP-05 | AI Agents theo nhóm nghiệp vụ | Trung bình | Có agent catalog, quyền dữ liệu, cache kết quả, audit. |
| GAP-06 | Email AI Analysis | Trung bình | Gửi PDF/Excel theo agent, đúng nhóm nhận, có opt-in và audit. |
| GAP-07 | Inventory nâng cấp | Trung bình | Có item detail, stock by storeroom/bin, vendor, manufacturer, units, lookup lists. |
| GAP-08 | Maximo / dữ liệu thật | Cao | Có mapping asset/location/PM/inventory và quy trình import kiểm soát. |
| GAP-09 | CCTV/RTSP AI Monitoring | Trung bình | Có camera registry, RTSP config, credential vault, video pipeline, AI monitoring pilot. |
| GAP-10 | Production readiness evidence | Cao | CI/CD pass đủ Install, Typecheck, Lint, Build, Docker, Smoke Test, CodeQL. |

---

## 6. Đối chiếu camera feed AI monitoring

Theo tài liệu feasibility, phần cứng CCTV tuyến Metro Line 1 có khả năng cấp live feed cho AI theo 02 nhóm:

1. Nhóm Bosch IP camera: có thể cấp RTSP trực tiếp và hỗ trợ ONVIF Profile S.
2. Nhóm Watec analogue: cần encoder hoặc DVR/NVR để số hóa thành RTSP/ONVIF.

Khoảng trống của HURC1 CRM hiện nay là chưa thấy module rõ cho camera registry, RTSP connection, ONVIF capability, stream health, credential management và AI video monitoring. Đây là hướng mở rộng riêng, không nên mô tả là đã có đầy đủ nếu chưa xây dựng module và kiểm thử trên camera đại diện.

---

## 7. Định hướng cập nhật HURC1 CRM

### 7.1. Nhóm ưu tiên cao

1. Hoàn thiện DNF workflow theo FRACAS phase.
2. Bổ sung Mobile Report và ảnh hiện trường.
3. Bổ sung AI Triage trong form DNF.
4. Bổ sung DNF → Hazard one-click workflow.
5. Bổ sung Asset Health Check.
6. Chạy xanh CI/CD trên `main`.

### 7.2. Nhóm ưu tiên trung bình

1. AI Agents hub theo 07 nhóm nghiệp vụ.
2. Email AI Analysis PDF/Excel.
3. Inventory/Maximo mapping.
4. Camera feed AI monitoring pilot.
5. Chuẩn hóa song ngữ EN/VI.

### 7.3. Nhóm ưu tiên sau nghiệm thu kỹ thuật

1. Remote-ready module extraction.
2. Multi-station rollout.
3. Predictive maintenance nâng cao.
4. Full Digital Twin với dữ liệu GIS/BIM chính thức.

---

## 8. Kết luận

HURC1 CRM có nền tảng đúng hướng để trở thành hệ thống quản trị, giám sát và hỗ trợ bảo trì đường sắt đô thị. Tuy nhiên, so với VMMS mẫu, hệ thống cần được đánh giá là **đang trong giai đoạn hoàn thiện và kiểm chứng**, chưa nên kết luận tương đương VMMS mẫu hoặc production-ready tuyệt đối.

Điều kiện để nâng trạng thái lên staging/production readiness gồm:

1. Hoàn tất checklist phân hệ VMMS.
2. Có dữ liệu demo/realistic data đủ đại diện.
3. Có tài liệu hướng dẫn theo vai trò.
4. Có CI/CD xanh trên nhánh `main`.
5. Có biên bản kiểm thử nghiệp vụ DNF/Hazard/Asset/AI/GIS-BIM/Docker.
