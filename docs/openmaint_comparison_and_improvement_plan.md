# So sánh openMAINT và HURC1 CRM - Kế hoạch cải thiện bảo trì, bảo dưỡng

## 0. Mục tiêu

Tài liệu này so sánh openMAINT với HURC1 CRM ở góc nhìn quản lý tài sản, bảo trì, bảo dưỡng, vận hành hiện trường và tích hợp hệ thống. Mục tiêu là xác định điểm mạnh, điểm yếu của từng phần mềm và đề xuất hướng cải thiện HURC1 CRM theo chuẩn CMMS/EAM phù hợp với đường sắt đô thị.

Nguồn tham chiếu openMAINT:

- `https://www.openmaint.org/en`
- `https://www.openmaint.org/en/product/modules`
- `https://www.openmaint.org/en/product/features`
- `https://www.openmaint.org/en/product/mobile`

## 1. Tổng quan openMAINT

openMAINT là phần mềm CMMS/Facility Management dùng để quản lý tài sản bất động sản, cơ sở hạ tầng, nhà máy, thiết bị kỹ thuật và các hoạt động bảo trì liên quan.

Các nhóm chức năng chính của openMAINT:

| Nhóm | Nội dung |
|---|---|
| Space & Asset Inventory | Quản lý tài sản, công trình, thiết bị, thành phần kỹ thuật và trạng thái tài sản. |
| Facility Management | Quản lý bảo trì phòng ngừa và bảo trì khắc phục. |
| Logistic Management | Quản lý kho, vật tư, hàng tồn và vật tư dùng cho bảo trì. |
| Economic Management | Quản lý ngân sách, chi phí bảo trì, nhà cung cấp, hợp đồng, đơn hàng. |
| Energy & Environment | Ghi nhận và phân tích dữ liệu năng lượng, chỉ số đo đếm. |
| GIS & BIM Support | Định vị tài sản trên bản đồ, GIS 2D và mô hình BIM 3D. |
| Mobile App | Hỗ trợ hiện trường, chụp ảnh, đính kèm, QR/barcode, xử lý quy trình trên thiết bị di động. |
| Webservice/Connector | Hỗ trợ tích hợp với phần mềm ngoài qua webservice và connector. |

## 2. Tổng quan HURC1 CRM hiện tại

HURC1 CRM đã có nền tảng phù hợp với nghiệp vụ đường sắt đô thị:

| Nhóm | Hiện trạng |
|---|---|
| DNF | Có module quản lý sự cố/defect. |
| Hazard | Có module quản lý mối nguy. |
| Inspection | Có module kiểm tra và checklist. |
| Asset 360 | Có hướng Asset 360/Digital Twin. |
| Rail Network | Có dữ liệu tuyến, ga và mạng lưới đường sắt. |
| GIS/BIM Twin | Có hướng GIS/BIM và spatial twin. |
| AI Lab | Có Incident Learning, AI Vision/YOLO và RAG. |
| Offline sync | Có offline queue và coordinator theo entity. |
| Secure Integration | Có Secure Integration Gateway và tài liệu tích hợp an toàn. |
| CI/Audit | Có nhiều audit script, typecheck, lint, build, smoke test trong workflow. |

## 3. Điểm mạnh của openMAINT so với HURC1 CRM

| Điểm mạnh openMAINT | Tác động |
|---|---|
| CMMS/EAM trưởng thành, tập trung vào tài sản và bảo trì facility | Có mô hình nghiệp vụ đầy đủ cho bảo trì phòng ngừa, khắc phục, kho, chi phí. |
| Logistic Management | Theo dõi kho, vật tư, xuất nhập và vật tư dùng cho bảo trì tốt hơn. |
| Economic Management | Theo dõi ngân sách, chi phí, nhà cung cấp, hợp đồng và đơn hàng rõ hơn. |
| Energy & Environment | Có lớp dữ liệu năng lượng, chỉ số đo và phân tích tiêu thụ. |
| Workflow/report engine trưởng thành | Dễ cấu hình quy trình, báo cáo và dashboard theo nghiệp vụ. |
| Mobile app hiện trường | Hỗ trợ chụp ảnh, QR/barcode, attachments, workflow tại hiện trường. |
| Webservice/connector | Mạnh về khả năng tích hợp hệ thống ngoài. |

## 4. Điểm mạnh của HURC1 CRM so với openMAINT

| Điểm mạnh HURC1 CRM | Tác động |
|---|---|
| Thiết kế chuyên biệt cho đường sắt đô thị | Bám sát DNF, Hazard, Inspection, Rail Network, PSD/AFC và dữ liệu vận hành tuyến. |
| AI Lab và Incident Learning | Có khả năng học từ sự cố tương tự và hỗ trợ phân tích kỹ thuật. |
| AI Vision/YOLO | Có nền tảng kiểm tra ảnh và hỗ trợ đánh giá hiện trường bằng thị giác máy tính. |
| Modular Monolith MFE-ready | Có thể phát triển module theo ranh giới rõ và chuẩn bị cho mở rộng lâu dài. |
| Secure Integration Gateway | Có nền tảng ký payload, allowlist, redaction và policy tích hợp ngoài. |
| CI/Audit mạnh | Có nhiều lớp audit tài liệu, module, design rule, Docker và lifecycle. |
| GIS/BIM theo hướng metro digital twin | Có định hướng kết hợp Rail Network, GIS/BIM và Asset 360 cho metro. |

## 5. Điểm yếu của HURC1 CRM khi so với openMAINT

| Điểm yếu | Mức ưu tiên | Hướng cải thiện |
|---|---|---|
| Chưa có module kho/vật tư bảo trì rõ như Logistic Management | Cao | Bổ sung Maintenance Inventory capability và roadmap vật tư. |
| Chưa có module ngân sách/chi phí bảo trì rõ như Economic Management | Cao | Bổ sung Maintenance Cost capability và liên kết DNF/Work Order/Asset. |
| Bảo trì phòng ngừa chưa có lịch PM/PdM hoàn chỉnh | Cao | Bổ sung Preventive Maintenance capability model. |
| Work Order chưa được tách thành module độc lập rõ ràng | Cao | Chuẩn hóa Work Order lifecycle và liên kết từ DNF, Inspection, Hazard. |
| Energy & Environment mới là khoảng trống | Trung bình | Bổ sung capability meter reading/energy record. |
| Mobile field workflow mới là định hướng | Trung bình | Bổ sung checklist mobile readiness, QR, attachment, offline sync. |
| Tích hợp ngoài mới có gateway nền, chưa có adapter theo hệ thống thật | Trung bình | Tạo adapter theo từng hệ thống khi có yêu cầu tích hợp. |
| YOLO chưa có bộ test dataset và tiêu chí nghiệm thu model | Trung bình | Tạo model governance và test dataset checklist. |

## 6. Cải thiện đề xuất cho HURC1 CRM

### 6.1. Chuẩn hóa Work Order

Cần bổ sung mô hình vòng đời Work Order:

```text
Draft -> Approved -> Assigned -> In Progress -> Waiting Material -> Done -> Verified -> Closed
```

Work Order cần liên kết với:

```text
Asset
DNF
Inspection Finding
Hazard
Material Usage
Labor Log
Cost Record
Evidence Attachment
```

### 6.2. Bổ sung Preventive Maintenance

Cần có capability cho bảo trì phòng ngừa:

```text
Maintenance Plan
Maintenance Standard
Frequency
Checklist Template
Next Due Date
Overdue Alert
Completion Evidence
```

### 6.3. Bổ sung Inventory và Material Usage

Cần có capability quản lý:

```text
Warehouse
Stock Item
Minimum Stock
Material Issue
Material Return
Material Usage by Work Order
Supplier Reference
```

### 6.4. Bổ sung Cost Management

Cần liên kết chi phí vào tài sản và lệnh làm việc:

```text
Work Order Cost
Material Cost
Labor Cost
Supplier Cost
Contract Reference
Budget Code
```

### 6.5. Bổ sung Energy & Meter Reading

Cần capability cho dữ liệu năng lượng/môi trường:

```text
Meter
Meter Reading
Energy Consumption
Station/System Consumption
Abnormal Consumption Alert
```

### 6.6. Chuẩn hóa Mobile Field Readiness

Cần checklist cho hiện trường:

```text
QR scan
Photo attachment
Offline queue
Signature/verification
Geo/time metadata
Sync status
```

## 7. Lộ trình nâng cấp

| Giai đoạn | Nội dung |
|---|---|
| P0 | Tạo capability model so sánh openMAINT và HURC1 CRM. |
| P1 | Chuẩn hóa Work Order, PM schedule, material usage và cost record ở mức data contract. |
| P2 | Tạo module/route thật cho Inventory, Cost và Energy khi có yêu cầu nghiệp vụ. |
| P3 | Tạo adapter tích hợp SAP/Maximo/CMMS/GIS/BI theo Secure Integration Gateway. |
| P4 | Chuẩn hóa mobile field workflow, QR, ảnh, offline sync và nghiệm thu hiện trường. |

## 8. Kết luận

openMAINT mạnh ở chiều sâu CMMS/EAM tiêu chuẩn, đặc biệt là kho, chi phí, năng lượng, workflow/report và mobile field operation. HURC1 CRM mạnh ở tính chuyên biệt cho metro, AI Lab, YOLO, Incident Learning, GIS/BIM/Asset 360 và kiến trúc mở rộng theo module. Vì vậy hướng cải thiện phù hợp không phải sao chép openMAINT, mà là bổ sung các capability còn thiếu để HURC1 CRM trở thành CMMS/EAM chuyên biệt cho đường sắt đô thị.
