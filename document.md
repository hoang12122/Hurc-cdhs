# CẨM NANG TOÀN THƯ VỀ HỆ THỐNG HURC1 CRM VÀ METRO INSPECT PRO

## Cẩm nang kỹ thuật vận hành chi tiết cấp độ phân tử - Dành cho Kỹ sư hệ thống và Quản trị viên

Chào mừng bạn đến với tài liệu hướng dẫn chuyên sâu nhất về hệ thống **HURC1 CRM** và ứng dụng kiểm tra hiện trường **Metro Inspect Pro**.

Tài liệu này được thiết kế theo cách tiếp cận **"cấp độ phân tử"**, bóc tách từng dòng code, từng thuật toán, từng mô hình dữ liệu, từng luồng đi của gói tin mạng và các giải pháp khắc phục lỗi hệ thống chi tiết đến từng mili-giây. Cho dù bạn là kỹ sư hệ thống dày dạn kinh nghiệm hay người mới tiếp cận lần đầu, cẩm nang này sẽ cung cấp kiến thức toàn diện nhất để làm chủ hoàn toàn hệ thống trong môi trường cô lập tuyệt mật (Air-Gapped) của Tuyến Metro số 1 TP.HCM.

---

### 🗺️ BẢN ĐỒ KHÁM PHÁ - MỤC LỤC

1. **KIẾN TRÚC DỮ LIỆU CẤP ĐỘ PHÂN TỬ (Database Schema & Models)**
2. **THUẬT TOÁN VÀ CÔNG THỨC TOÁN HỌC CỐT LÕI (Calculation Engines)**
3. **CƠ CHẾ HOẠT ĐỘNG CỦA TRỢ LÝ AI LOCAL & YOLO VISION (AI Execution Flow)**
4. **BẢN ĐỒ CÁC GIAO THỨC VÀ LUỒNG ĐI CỦA GÓI TIN (Network & Write Flows)**
5. **LƯU TRỮ LAI, PHÒNG VỆ KHÓA TỆP VÀ SAO LƯU PHỤC HỒI (Hybrid Storage, Lock Recovery & Disaster Recovery)**
6. **THIẾT LẬP PHÂN QUYỀN VÀ QUẢN LÝ ĐỘI NHÓM THEO PHÂN CẤP AD (AD Hierarchy-Based Scoped RBAC)**
7. **HƯỚNG DẪN CÀI ĐẶT & THAM CHIẾU CẤU HÌNH CHI TIẾT (Deployment Reference)**
8. **ẨN DỤ ĐỜI THƯỜNG DÀNH CHO NGƯỜI MỚI (Analogy Quick Start)**

---

## 1. KIẾN TRÚC DỮ LIỆU CẤP ĐỘ PHÂN TỬ

Hệ thống HURC1 CRM hỗ trợ cơ chế lưu trữ kép linh hoạt: **Online Mode** sử dụng cơ sở dữ liệu quan hệ **PostgreSQL** qua Prisma ORM, và **Offline Mode** sử dụng công cụ lưu trữ siêu nhẹ **JSON-DB** qua tệp tin [db.json](db.json).

Dù chạy ở chế độ nào, cấu trúc logic của dữ liệu luôn đồng bộ tuyệt đối dưới dạng 5 thực thể cốt lõi sau:

### 1.1. Thực thể Người dùng (Users Collection)

- **Mục đích:** Quản lý danh tính, trạng thái hoạt động và vai trò trong hệ thống phân quyền RBAC.
- **Cấu trúc JSON chi tiết:**
  - `id` (String / UUID): Khóa chính xác định danh tính.
  - `username` (String): Tên đăng nhập duy nhất (ví dụ: `inspector_ga_01`).
  - `passwordHash` (String): Chuỗi mật khẩu đã được mã hóa một chiều qua thuật toán bcrypt để bảo mật.
  - `role` (Enum): Quyền hạn của người dùng, gồm:
    - `INSPECTOR`: Thanh tra hiện trường (chỉ được tạo checklist, báo cáo DNF).
    - `SAFETY_OFFICER`: Phòng Kỹ thuật An toàn (duyệt kế hoạch, đóng mối nguy).
    - `MAINTENANCE_ENTERPRISE`: Xí nghiệp bảo trì (thực hiện sửa chữa).
    - `MANAGEMENT_BOARD`: Ban giám đốc / CEO (xem Dashboard chỉ số cao cấp).
  - `status` (String): Trạng thái hoạt động, nhận giá trị `active` (đang làm việc) hoặc `inactive` (tạm khóa).
  - `createdAt` (String / ISO 8601): Mốc thời gian tạo tài khoản.

### 1.2. Thực thể Sự cố kỹ thuật (dnf_documents)

- **Mục đích:** Ghi nhận mọi sự cố kỹ thuật phát sinh trên tuyến Metro cần sửa chữa.
- **Cấu trúc JSON chi tiết:**
  - `id` (String / UUID): Khóa chính định danh sự cố.
  - `title` (String): Tiêu đề ngắn gọn của sự cố (ví dụ: `Nứt cục bộ tà vẹt bê tông ray P4`).
  - `severity` (Enum): Mức độ khẩn cấp, gồm `I` (Cực kỳ nghiêm trọng), `II` (Cảnh báo), `III` (Nhẹ).
  - `status` (Enum): Tiến độ xử lý, gồm `Mới`, `Đang xử lý`, `Phản hồi`, `Đóng`, `Hoàn thành`.
  - `createdById` (String): ID của kỹ sư phát hiện và lập báo cáo.
  - `createdAt` (String / ISO 8601): Thời điểm ghi nhận sự cố.
  - `evidencePhotoUrl` (String): Đường dẫn ảnh bằng chứng lỗi (nếu có).

### 1.3. Thực thể Phiếu kiểm tra hiện trường (inspections)

- **Mục đích:** Lưu trữ kết quả tuần tra định kỳ theo checklist của kỹ sư tại các nhà ga.
- **Cấu trúc JSON chi tiết:**
  - `id` (String / UUID): Khóa chính định danh lượt kiểm tra.
  - `station` (String): Tên nhà ga (ví dụ: `Ga Bến Thành`, `Ga Nhà hát Thành phố`).
  - `area` (String): Phân khu kiểm tra (ví dụ: `Đường ray hầm 1`, `Hệ thống cấp điện ga`).
  - `inspectorId` (String): ID của kỹ sư thực hiện.
  - `checkedItems` (Array): Danh sách các hạng mục chi tiết kèm kết quả:
    - `item` (String): Tên hạng mục (ví dụ: `Ốc khóa liên kết`).
    - `status` (String): Kết quả kiểm tra, gồm `Đạt` hoặc `Lỗi`.
    - `photoUrl` (String): Ảnh đính kèm của riêng hạng mục đó.
  - `createdAt` (String / ISO 8601): Thời điểm hoàn tất phiếu kiểm tra.

### 1.4. Thực thể Hành động khắc phục (corrective_actions)

- **Mục đích:** Lên lịch trình sửa chữa chi tiết để khắc phục sự cố DNF.
- **Cấu trúc JSON chi tiết:**
  - `id` (String / UUID): Khóa chính định danh hành động khắc phục.
  - `dnfId` (String): ID của sự cố DNF gốc dẫn tới hành động này.
  - `assignedTo` (String): ID của Kỹ sư hoặc đơn vị chịu trách nhiệm sửa chữa.
  - `dueDate` (String / ISO 8601): Hạn chót phải hoàn thành sửa chữa.
  - `status` (Enum): Trạng thái xử lý: `Chờ duyệt`, `Đang sửa`, `Đã hoàn thành`.

### 1.5. Thực thể Hồ sơ mối nguy hiểm (hazards)

- **Mục đích:** Ghi nhận và theo dõi các nguy cơ tiềm ẩn có khả năng gây tai nạn đường sắt đô thị.
- **Cấu trúc JSON chi tiết:**
  - `id` (String / UUID): Khóa chính định danh mối nguy.
  - `title` (String): Mô tả mối nguy (ví dụ: `Cành cây nằm sát hành lang bảo vệ điện cao áp cát-tơ-ne`).
  - `severity` (Enum): Mức độ nguy hiểm: `I` (Cực kỳ nguy cấp), `II` (Cảnh báo), `III` (Ít nguy hiểm).
  - `status` (Enum): Trạng thái xử lý: `Mới`, `Đang xử lý`, `Đã xử lý`, `Phản hồi`, `Đóng`.
  - `mitigationSteps` (String): Các biện pháp kỹ thuật được đề xuất để triệt tiêu mối nguy.
### 1.6. Mô hình Phân cấp Tổ chức và Thư mục AD (Active Directory Hierarchy Models)

Để phục vụ phân quyền và quản lý đội nhóm ở quy mô đặc biệt lớn trên toàn bộ Tuyến Metro số 1, hệ thống đã cài đặt mô hình cấu trúc phân cấp chuẩn doanh nghiệp mô phỏng cấu trúc của **Active Directory (AD)**. Các thực thể này được định nghĩa tại schema cơ sở dữ liệu xác thực [schema.prisma](file:///d:/Hurc1CRM-main/Hurc-cdhs/prisma/auth/schema.prisma):

```mermaid
graph TD
    Forest[Forest: Rừng Hệ thống] -->|Gồm nhiều| Tree[Tree: Cây Thư mục]
    Tree -->|Gồm nhiều| ChildDomain[Domain: Tên miền Con]
    ChildDomain -->|Chứa nhiều| OU[OU: Đơn vị Tổ chức]
    OU -->|Đệ quy cha-con parentId| OU
    OU -->|Chứa| User[User: Kỹ sư / Nhân viên]
```

- **Forest (Rừng hệ thống - `Forest`):** Biên giới bảo mật cao nhất của toàn bộ hệ thống CDHS.
  - `id` (String / UUID): Khóa chính.
  - `name` (String): Tên duy nhất của rừng hệ thống (ví dụ: `hurc.local`).
  - `description` (String): Mô tả phạm vi an ninh.
- **Tree (Cây thư mục / Domain Root - `Tree`):** Tập hợp các tên miền chia sẻ chung một không gian tên gốc.
  - `id` (String / UUID): Khóa chính.
  - `name` (String): Tên duy nhất (ví dụ: `metro1.hurc.local`).
  - `forestId` (String): ID của rừng cha sở hữu.
- **ChildDomain (Tên miền con - `ChildDomain`):** Phân chia logic các khu vực lớn hoặc ban ngành độc lập về chính sách.
  - `id` (String / UUID): Khóa chính.
  - `name` (String): Tên duy nhất (ví dụ: `ops.metro1.hurc.local`).
  - `treeId` (String): ID của cây thư mục cha sở hữu.
- **OrganizationalUnit (Đơn vị tổ chức - `OrganizationalUnit` / OU):** Thực thể linh hoạt nhất, biểu diễn các phòng ban, phân xưởng hoặc tổ đội kỹ thuật hiện trường. 
  - `id` (String / UUID): Khóa chính.
  - `name` (String): Tên của đơn vị (ví dụ: `Phong IT`, `Đội Bảo trì Đường ray`, `Tổ Cấp điện Ga`).
  - `domainId` (String): ID của tên miền con trực thuộc.
  - `parentId` (String / Null): Liên kết đệ quy (**Self-referencing recursive parentId**). Cho phép xây dựng các OU lồng nhau không giới hạn cấp độ (ví dụ: `Xí nghiệp Bảo trì` > `Phân xưởng Hạ tầng` > `Đội Bảo trì Cầu đường` > `Tổ tuần tra ray`).
- **User (Người dùng - `User`):** Được liên kết trực tiếp vào một OU cụ thể thông qua trường khóa ngoại `ouId` (thiết lập quan hệ 1-N: Một OU chứa nhiều Users).

---


## 2. THUẬT TOÁN VÀ CÔNG THỨC TOÁN HỌC CỐT LÕI

Toàn bộ "trí tuệ toán học" của Dashboard chỉ huy CEO nằm tại tệp tin dịch vụ [strategic-metrics.ts](src/lib/services/strategic-metrics.ts). Dưới đây là cách tính toán chi tiết từng chỉ số ở cấp độ dòng lệnh.

### 2.1. Chỉ số Năng suất Hoạt động (Productivity Index)

- **Mục đích:** Đánh giá khối lượng công việc thực tế đã giải quyết so với tổng khối lượng công việc được triển khai trên toàn tuyến Metro.
- **Thuật toán chi tiết:**
  - Bước 1: Lấy tổng số sự cố kỹ thuật DNF có trạng thái là `Đóng` hoặc `Hoàn thành` (gọi là `ResolvedDnfs`).
  - Bước 2: Tính tổng số lượng tác vụ đang diễn ra trên hệ thống:
    $$\text{TotalTasks} = \text{Tổng số DNF} + \text{Tổng số lượt kiểm tra Inspections} + \text{Tổng số Hành động khắc phục CorrectiveActions}$$
  - Bước 3: Áp dụng công thức tính tỉ lệ phần trăm:
    $$\text{Productivity Index} = \left( \frac{\text{ResolvedDnfs}}{\text{TotalTasks}} \right) \times 100$$
  - Bước 4: Làm tròn số học đến 1 chữ số thập phân bằng câu lệnh:
    `Math.round(productivityIndex * 10) / 10`

### 2.2. Tỉ lệ Phục hồi Dịch vụ (Service Recovery Rate)

- **Mục đích:** Đo lường tốc độ dập tắt các sự cố kỹ thuật nguy cấp gây gián đoạn chạy tàu.
- **Thuật toán chi tiết:**
  - Bước 1: Nếu tổng số DNF trong cơ sở dữ liệu bằng `0`, tỉ lệ này mặc định đạt tối đa **100%**.
  - Bước 2: Nếu có sự cố phát sinh, áp dụng công thức:
    $$\text{Service Recovery Rate} = \left( \frac{\text{Số DNF có trạng thái Đóng hoặc Hoàn thành}}{\text{Tổng số DNF phát sinh}} \right) \times 100$$
  - Bước 3: Làm tròn đến 1 chữ số thập phân.

### 2.3. Tỉ lệ Giảm thiểu Mối nguy (Hazard Mitigation Rate)

- **Mục đích:** Đánh giá năng lực chủ động bịt các lỗ hổng an toàn trước khi chúng gây ra hậu quả.
- **Thuật toán chi tiết:**
  - Bước 1: Nếu tổng số mối nguy bằng `0`, tỉ lệ mặc định đạt **100%**.
  - Bước 2: Lọc các mối nguy hiểm có trạng thái là `Đóng`, `Đã xử lý`, hoặc `Phản hồi` (gọi là `ClosedHazards`).
  - Bước 3: Áp dụng công thức tính tỉ lệ phần trăm:
    $$\text{Hazard Mitigation Rate} = \left( \frac{\text{ClosedHazards}}{\text{Tổng số Mối nguy ghi nhận}} \right) \times 100$$

### 2.4. Công thức tổng hợp Điểm Sức Khỏe Metro (Health Score)

Đây là chỉ số quan trọng nhất đại diện cho độ an toàn toàn diện của tuyến Metro. Công thức kết hợp ba khía cạnh sống còn với các trọng số toán học được quy định nghiêm ngặt:

$$\text{Health Score} = (\text{Service Recovery Rate} \times 0.4) + (\text{Hazard Mitigation Rate} \times 0.4) + (\text{Retention Rate} \times 0.2)$$

Trong đó:

- `Service Recovery Rate` (Trọng số 40%): Năng lực sửa lỗi hệ thống đường ray, nhà ga.
- `Hazard Mitigation Rate` (Trọng số 40%): Khả năng phòng ngừa tai nạn, bịt lỗ hổng bảo mật.
- `Retention Rate` (Trọng số 20%): Mức độ ổn định nhân sự hành chính và kỹ sư hiện trường. Tính bằng:
  $$\text{Retention Rate} = \left( \frac{\text{Số tài khoản active}}{\text{Tổng số tài khoản trên hệ thống}} \right) \times 100$$

### 2.5. Chỉ số Dự đoán Rủi ro Lỗi Nghiêm trọng (Critical Failure Risk)

Hệ thống tích hợp một thuật toán dự đoán rủi ro tức thời dựa trên mức độ nguy hiểm của các mối nguy tiềm ẩn:

- Bước 1: Quét toàn bộ bảng ghi `hazards` để tìm các mối nguy hiểm có mức độ nghiêm trọng cấp cao nhất (`severity === 'I'`).
- Bước 2:
  - Nếu tồn tại **ít nhất 1 mối nguy** chưa được xử lý triệt để thuộc nhóm `severity === 'I'`, hệ thống sẽ áp đặt mức độ rủi ro hệ thống ở trạng thái cực kỳ báo động là **80% (0.8)**.
  - Nếu không có bất kỳ mối nguy nghiêm trọng cấp `I` nào, chỉ số rủi ro hệ thống sẽ được giữ ở mức tối giản, an toàn tuyệt đối là **20% (0.2)**.

---

## 3. CƠ CHẾ HOẠT ĐỘNG CỦA TRỢ LÝ AI LOCAL & YOLO VISION

Để chạy hoàn hảo trong môi trường cô lập (Air-Gapped) của Metro số 1 TP.HCM, toàn bộ hệ thống AI được thiết kế để khởi chạy 100% trực tiếp trên máy chủ cục bộ mà không gửi bất kỳ thông tin nào ra Internet.

### 3.1. Trợ lý Trí tuệ Nhân tạo local - Ensemble RAG

Cơ chế RAG (Retrieval-Augmented Generation) cục bộ giúp AI trả lời chính xác các quy trình vận hành đường sắt bằng cách tra cứu tài liệu thực tế của tuyến Metro.

```mermaid
sequenceDiagram
    participant U as Kỹ sư vận hành
    participant N as Next.js Web App
    participant TG as TrustGraph (Cơ sở Dữ liệu Tri thức)
    participant O as Ollama Service (AI cục bộ)
    U->>N: Nhập câu hỏi: "Quy trình xử lý nứt ray P4?"
    Note over N: Thực hiện Tìm kiếm Lai (Hybrid Search)
    N->>TG: Truy vấn quan hệ thiết bị và vector tài liệu quy trình
    TG-->>N: Trả về văn bản chính xác quy trình bảo trì ray
    Note over N: Ghép câu hỏi + tài liệu quy trình thành Prompt đặc biệt
    N->>O: Gửi Prompt yêu cầu phân tích (gemma:2b/mistral)
    Note over O: Chạy suy luận local bằng CPU/GPU của máy chủ
    O-->>N: Trả về câu trả lời bằng tiếng Việt kỹ thuật chuẩn xác
    N->>U: Hiển thị câu trả lời thông minh lên màn hình
```

#### Quy trình Tự kiểm chứng (Self-Reflection Engine)

Trước khi trợ lý AI trả lời người dùng, hệ thống sẽ thực hiện một truy vấn nội bộ ẩn. AI được yêu cầu tự đánh giá câu trả lời của chính mình thông qua thang điểm 3 chiều:

- **Độ trung thực nguồn tin (Faithfulness):** Câu trả lời có đúng với tài liệu quy trình Metro không?
- **Độ liên quan câu hỏi (Answer Relevance):** Câu trả lời có tập trung đúng vào vấn đề kỹ sư đang hỏi không?
- Nếu điểm tự đánh giá dưới mức yêu cầu, hệ thống AI sẽ kích hoạt cơ chế tự hiệu chỉnh prompt để sinh lại câu trả lời chính xác nhất.

---

### 3.2. Mắt thần nhận diện lỗi - YOLO Vision Pipeline

Dịch vụ nhận diện lỗi kỹ thuật sử dụng mô hình học máy **YOLOv8** chạy trực tiếp qua container Python chuyên dụng tại cổng `5005` (Xem file cấu hình tại [yolo/main.py](infra/yolo/main.py)).

```mermaid
graph LR
    User([Ảnh chụp lỗi]) -->|1. Tải ảnh lên| Next[Next.js API Gateway]
    Next -->|2. HTTP POST qua cổng 5005| YOLO[YOLO Python Service]
    YOLO -->|3. Chạy mô hình yolov8n.pt| PyTorch[Inference Engine]
    PyTorch -->|4. Trả về tọa độ lỗi & độ tự tin| YOLO
    YOLO -->|5. Vẽ khung nhận diện lên ảnh| Next
    Next -->|6. Render Canvas| UI([Giao diện Kỹ sư])
```

#### Quy trình chi tiết luồng dữ liệu YOLO Vision

##### Bước 3.2.1 - Tải ảnh lỗi

Kỹ sư hiện trường dùng ứng dụng di động Metro Inspect Pro chụp ảnh một thanh ray bị nứt hoặc bu-lông bị rỉ sét rồi nhấn tải lên.

##### Bước 3.2.2 - Gateway trung chuyển

Ảnh được chuyển tiếp từ Next.js Web App dưới dạng nhị phân qua giao thức HTTP POST đến dịch vụ YOLO-service cục bộ thông qua API nội bộ:
`http://yolo-service:5005/predict`

##### Bước 3.2.3 - Suy luận mô hình

Dịch vụ Python sử dụng thư viện `Ultralytics` tải mô hình nén trọng số nhẹ `yolov8n.pt` chạy trực tiếp trên máy chủ. Nó phân tích cấu trúc điểm ảnh và trả về danh sách các vật thể phát hiện:

- Lớp nhận diện `Rail Crack` (Nứt đường ray)
- Lớp nhận diện `Bolt Rust` (Rỉ sét bu-lông)
- Lớp nhận diện `Sleeper Break` (Vỡ tà vẹt)

##### Bước 3.2.4 - Ánh xạ tọa độ (Bounding Box Mapping)

Dịch vụ trả về định dạng tọa độ chi tiết của lỗi:

- `box` (Tọa độ hình chữ nhật bao quanh lỗi): `[x_min, y_min, x_max, y_max]`
- `confidence` (Độ tin cậy của thuật toán): từ `0.0` đến `1.0` (ví dụ: `0.92` tương đương độ tin cậy 92%).

##### Bước 3.2.5 - Hiển thị đồ họa (Canvas Rendering)

Next.js sử dụng tọa độ nhận được để vẽ các khung chữ nhật đỏ nổi bật kèm nhãn cảnh báo lên bức ảnh của kỹ sư, lưu tệp ảnh đã chú thích vào bộ nhớ đệm và hiển thị lên màn hình điện thoại/máy tính của đội kỹ sư bảo trì để họ lập tức định vị vị trí nứt vỡ.

---

## 4. BẢN ĐỒ CÁC GIAO THỨC VÀ LUỒNG ĐI CỦA GÓI TIN

Để hiểu rõ cách toàn bộ hệ thống giao tiếp mà không có Internet, hãy xem sơ đồ đi của gói tin mạng khi kỹ sư thực hiện một hành động lưu báo cáo sự cố DNF:

```mermaid
sequenceDiagram
    participant B as Trình duyệt (Kỹ sư)
    participant NG as Nginx Gateway (Cổng 80)
    participant APP as Next.js Web App (Cổng 3000)
    participant RED as Redis Cache (Cổng 6379)
    participant DB as JSON-DB / PostgreSQL
    
    B->>NG: 1. Gửi HTTP POST /api/dnf (Báo cáo sự cố)
    Note over NG: Giải mã an toàn và kiểm tra bảo mật Nginx
    NG->>APP: 2. Chuyển tiếp (Reverse Proxy) yêu cầu đến http://app:3000
    Note over APP: Xác thực JWT token & Kiểm tra quyền hạn (RBAC)
    APP->>RED: 3. Đăng ký tạm sự kiện ghi nhận sự cố (Rate limiting check)
    RED-->>APP: 4. Chấp thuận lưu trữ
    Note over APP: Đọc cấu hình môi trường IS_DATABASE_OFFLINE
    alt Chế độ Offline (IS_DATABASE_OFFLINE = true)
        APP->>DB: 5.1. Cập nhật bản ghi DNF vào cache RAM cục bộ (In-memory Snapshot)
        APP->>DB: 5.2. Kích hoạt tiến trình ghi bất đồng bộ xuống file db.json trên ổ cứng
    else Chế độ Online (IS_DATABASE_OFFLINE = false)
        APP->>DB: 5.3. Mở kết nối TCP và thực hiện truy vấn INSERT INTO qua Prisma Client
    end
    DB-->>APP: 6. Phản hồi ghi nhận thành công
    APP-->>NG: 7. Trả về mã trạng thái HTTP 201 (Created)
    NG-->>B: 8. Hiển thị thông báo "Báo cáo sự cố thành công!" lên màn hình
```

---

## 5. LƯU TRỮ LAI, PHÒNG VỆ KHÓA TỆP VÀ SAO LƯU PHỤC HỒI (Hybrid Storage, Lock Recovery & Disaster Recovery)

##### 5.1. Kiến trúc Lưu trữ kép Lai (Hybrid Online/Offline Storage)
Để tối đa hóa tính sẵn sàng phục vụ trong môi trường vận hành an ninh cao của tuyến Metro, hệ thống được trang bị kiến trúc lưu trữ lai cực kỳ linh hoạt:
* **Chế độ Trực tuyến (Online Mode - `IS_DATABASE_OFFLINE=false`):** 
  Dữ liệu được phân bổ vào **4 cơ sở dữ liệu PostgreSQL độc lập** thông qua Prisma ORM:
  1. `authDb` (Cổng 5432 - `AUTH_DATABASE_URL`): Lưu trữ dữ liệu xác thực người dùng (`User`, `Role`, `BackupCode`, `AccessToken`, `TwoFADevice`).
  2. `opsDb` (Cổng 5432 - `DATABASE_URL`): Lưu trữ dữ liệu vận hành kỹ thuật (`Task`, `InspectionDetail`, `ChecklistItem`, `Finding`, `DnfDocument`, `CorrectiveAction`, `HazardRecord`).
  3. `aiDb` (Cổng 27017 / MongoDB - `MONGODB_URI`): Lưu trữ mạng lưới tri thức RAG (`TrustGraphNode`, `TrustGraphEdge`) và nhật ký kiểm duyệt an toàn AI.
  4. `metroDb` (Cổng 5432): Lưu trữ hạ tầng thiết bị vật lý, đo đạc telemetry và vị trí tuần tra (`PatrolLocation`, `Subsystem`).
* **Chế độ Ngoại tuyến (Offline Mode - `IS_DATABASE_OFFLINE=true`):**
  Tất cả dữ liệu được gom về lưu tại tệp tin phẳng **`db.json`** đặt ở thư mục gốc phần mềm.
* **Bộ điều phối Kháng lỗi tự động (`dbProvider` - `db-wrapper.ts`):**
  Hệ thống sử dụng lớp bọc `dbProvider` để thực thi mọi thao tác CRUD. Khi hệ thống chạy ở chế độ Online, nếu kết nối PostgreSQL bị gián đoạn đột ngột (lỗi `PrismaClientInitializationError`), hệ thống sẽ kích hoạt **Transparent Fallback**, tự động chuyển sang đọc/ghi file `db.json` tức thì mà không gây gián đoạn cho kỹ sư.

##### 5.2. Cơ chế khôi phục khóa file (Lock Recovery Engine)
* **Vấn đề trên Windows:** Khi tiến trình Next.js đang ghi đè tệp tin `db.json` mà tệp này bị khóa độc quyền bởi hệ điều hành (ví dụ: người dùng đang mở tệp bằng Notepad), Windows sẽ quăng ra lỗi `EPERM` hoặc `EBUSY`.
* **Giải pháp Exponential Backoff:**
  Lớp `lock-recovery.ts` triển khai thuật toán lùi bước chờ đợi tăng dần để thử ghi lại:
  - Thử lần 1: Đợi 50ms.
  - Thử lần 2: Đợi 100ms.
  - Thử lần 3: Đợi 200ms.
  - Sau 3 lần thất bại, hệ thống tự động gửi tín hiệu giải phóng khóa tệp cấp OS và ép ghi đè cưỡng bức để đảm bảo dữ liệu không bị thất thoát.

##### 5.3. Chiến lược Sao lưu Xoay vòng & An toàn Dữ liệu (Rotating Backups)
Hệ thống sao lưu tự động được quản lý chặt chẽ qua 3 script nằm trong thư mục `/scripts`:
1. `scripts/backup-system.sh`: Script sao lưu tự động "Brutal Backup" định kỳ:
   - Tạo thư mục backup theo nhãn thời gian `/backups/YYYY-MM-DD_HH-MM-SS`.
   - Sao chép tệp `db.json` và mã băm SHA256 tương ứng.
   - Thực hiện `pg_dumpall` xuất toàn bộ cơ sở dữ liệu PostgreSQL ra tệp tin `full_dump.sql`.
   - Đóng gói toàn bộ thư mục `/logs` thành tệp tin nén `logs_bundle.tar.gz`.
   - Tạo tệp tin chữ ký số `manifest.sha256` để kiểm tra tính toàn vẹn của gói backup.
2. `scripts/backup-postgres.sh`: Sao lưu riêng cơ sở dữ liệu SQL PostgreSQL.
3. `scripts/backup-data.sh`: Sao lưu riêng thư mục tệp tin ngoại tuyến.
* **Thuật toán Xoay vòng (Rotation Limit):** Mỗi khi thực hiện ghi dữ liệu, hệ thống tự động kiểm tra số lượng file sao lưu trong `/backups`. Nếu vượt quá **5 bản ghi**, hệ thống sẽ tự động quét thời gian khởi tạo và xóa bản ghi cũ nhất (sử dụng lệnh `unlink`) để giải phóng không gian ổ cứng cho máy chủ.

```mermaid
graph TD
    Write[Yêu cầu ghi dữ liệu mới] --> RAM[Cập nhật RAM Snapshot]
    RAM --> FileWrite[Ghi thành công vào db.json]
    FileWrite --> CheckBackup{Kích hoạt Backup?}
    CheckBackup -->|Đủ điều kiện thời gian/số lượt ghi| ScanDir[Quét thư mục backups/]
    ScanDir --> CountFiles{Số lượng file backup > 5?}
    CountFiles -->|Có| SortFiles[Sắp xếp file theo thời gian khởi tạo từ cũ nhất đến mới nhất]
    SortFiles --> DeleteOld[Xóa vĩnh viễn tệp backup cũ nhất bằng lệnh unlink]
    DeleteOld --> CreateNew[Tạo tệp backup mới: db_backup_YYYYMMDD_HHMMSS.json]
    CountFiles -->|Không| CreateNew
    CreateNew --> Finish[Kết thúc quy trình sao lưu an toàn]
```

##### 5.4. Quy trình Đồng bộ hóa Dữ liệu (Offline-to-Online Migration)
Khi máy chủ PostgreSQL trực tuyến được khôi phục sau sự cố mất kết nối, quản trị viên hệ thống có thể chạy lệnh:
```bash
npm run migrate
```
Lệnh này sẽ thực thi script [migrate-json-to-pg.ts](file:///d:/Hurc1CRM-main/Hurc-cdhs/scripts/migrate-json-to-pg.ts):
1. Đọc và phân tích cú pháp tệp `db.json`.
2. Duyệt qua tất cả thực thể tác vụ (`todos`/`tasks`), sự cố (`dnfs`), và danh sách kiểm tra (`inspections`) được tạo trong thời gian chạy offline.
3. Sử dụng Prisma Client để thực hiện các câu lệnh ghi đè và ghi mới an toàn vào các phân vùng PostgreSQL tương ứng.
4. Đảm bảo tính nhất quán dữ liệu và đồng bộ hóa trạng thái trên toàn bộ hệ thống Metro.

##### 5.5. Khôi phục Quyền truy cập Tài khoản Khẩn cấp (2FA Backup Codes)
Để phòng ngừa trường hợp kỹ sư bị hỏng hoặc mất thiết bị xác thực 2 yếu tố (2FA):
* Hệ thống sinh ngẫu nhiên **8 mã dự phòng khẩn cấp** định dạng `XXXX-XXXX` bằng bộ sinh số bảo mật cao (`crypto.randomBytes`).
* Trước khi lưu trữ xuống bảng `backup_codes` trong `authDb`, các mã này được băm một chiều qua thuật toán **SHA-256** cực kỳ an toàn.
* Khi đăng nhập khẩn cấp, hệ thống so sánh mã băm của ký tự người dùng nhập vào với dữ liệu đã băm trong DB. Nếu trùng khớp, phiên đăng nhập được chấp thuận và mã dự phòng đó lập tức bị **vô hiệu hóa vĩnh viễn** (`used = true`).

---

## 6. THIẾT LẬP PHÂN QUYỀN VÀ QUẢN LÝ ĐỘI NHÓM THEO PHÂN CẤP AD (AD Hierarchy-Based Scoped RBAC)

Hệ thống HURC No.1 CDHS áp dụng một cơ chế bảo mật kép độc đáo: **Kiểm soát Truy cập dựa trên Vai trò (RBAC - Role-Based Access Control)** kết hợp với **Giới hạn Phạm vi theo Phân cấp Tổ chức AD (AD-Scoped Access Control)**.

---

##### 6.1. Nguyên lý Hoạt động & Mô hình Phân cấp Cơ sở Dữ liệu (AD Hierarchy & Database Schema Model)

Cơ cấu nhân sự được tổ chức theo hình cây tương thích Active Directory, cho phép quản lý chặt chẽ sơ đồ tổ chức từ cấp liên bộ phận đến từng ga tàu và kỹ sư:
```text
Forest (Rừng hệ thống: hurc.local)
 └── Tree (Cây thư mục / Domain Root: metro1.hurc.local)
      └── Domain (Tên miền: ops.metro1.hurc.local)
           └── OU (Đơn vị tổ chức: ví dụ "Phòng Kỹ thuật An toàn", "Tổ Kỹ thuật IT")
                ├── User (Kỹ sư trực thuộc OU)
                └── Sub-OU (Đơn vị tổ chức con lồng đệ quy)
```
Mỗi người dùng (`User`) khi khởi tạo sẽ được gán vào một Đơn vị Tổ chức cụ thể (`ouId`). Nếu người dùng chưa được gán OU (trường `ouId = null`), phạm vi truy cập dữ liệu của họ bị thu hẹp ở mức tối thiểu (chỉ xem được dữ liệu cá nhân tự tạo).

Hệ thống được thiết kế với cơ chế **Dual-Resilience** (Độ bền kép): Tự động định tuyến giữa **PostgreSQL (Prisma client)** ở trạng thái Online và **Atomic JSON Database (`db.json`)** ở trạng thái Offline.

###### Sơ đồ ERD Phân cấp Cơ cấu Tổ chức (ERD Organization Hierarchy Schema)

```mermaid
erDiagram
    FORESTS ||--o{ TREES : contains
    TREES ||--o{ CHILD_DOMAINS : contains
    CHILD_DOMAINS ||--o{ ORGANIZATIONAL_UNITS : contains
    ORGANIZATIONAL_UNITS ||--o{ ORGANIZATIONAL_UNITS : recursive
    ORGANIZATIONAL_UNITS ||--o{ USERS : contains
    ROLES ||--o{ USERS : assigned
    PATROL_LOCATIONS ||--o| ORGANIZATIONAL_UNITS : dynamic_mapping
    RESPONSIBLE_UNITS ||--o| ORGANIZATIONAL_UNITS : dynamic_mapping
    SUBSYSTEMS ||--o| ORGANIZATIONAL_UNITS : dynamic_mapping

    FORESTS {
        string id PK
        string name UNIQUE
        string description
        datetime createdAt
        datetime updatedAt
    }
    TREES {
        string id PK
        string name UNIQUE
        string description
        string forestId FK
        datetime createdAt
    }
    CHILD_DOMAINS {
        string id PK
        string name UNIQUE
        string description
        string treeId FK
    }
    ORGANIZATIONAL_UNITS {
        string id PK
        string name
        string description
        string domainId FK
        string parentId FK
    }
    USERS {
        string id PK
        string name
        string email UNIQUE
        string role FK
        string ouId FK
        string department
        string permissions
    }
    ROLES {
        string id PK
        string name
        string description
        string permissions
    }
```

###### Bảng phân tích chi tiết Ánh xạ Thuộc tính Metadata (Metadata Attribute Mapping)

| Thực thể AD | Trường Dữ liệu | Kiểu Dữ liệu | Vai trò Kỹ thuật / Quy tắc Điều phối |
| :--- | :--- | :--- | :--- |
| **Forest** | `id` | `String (PK)` | Định danh duy nhất cho Rừng AD (Ví dụ: `forest-metro-root`). |
| | `name` | `String` | Tên Rừng trung tâm điều hành Metro (Ví dụ: *HURC Metro System Forest*). |
| **Tree** | `id` | `String (PK)` | Định danh Cây AD (Ví dụ: `tree-metro-root`). |
| | `forestId` | `String (FK)` | Khóa ngoại liên kết chặt chẽ đệ quy lên `Forest.id` (`ON DELETE CASCADE`). |
| **ChildDomain** | `id` | `String (PK)` | Định danh miền con (Ví dụ: `domain-metro-root`). |
| | `name` | `String` | Domain chạy hệ thống dịch vụ kỹ thuật bảo trì (Ví dụ: `maint.hurc.vn`). |
| **OrganizationalUnit** | `id` | `String (PK)` | Định danh OU chính thức trong DB hoặc tiền tố đặc thù cho OU ảo. |
| | `parentId` | `String (FK)` | **Khóa ngoại tự liên kết đệ quy (Recursive self-relation)** trỏ tới `id` của OU cha. Cho phép tạo cây lồng nhau không giới hạn độ sâu. |
| **User** | `ouId` | `String (FK)` | Định danh OU hiện tại người dùng đang trực thuộc (trỏ tới `OrganizationalUnit.id`). |
| | `role` | `String (FK)` | Mã vai trò kỹ thuật trỏ tới `Role.id` trong Danh mục Vai trò. |
| | `department` | `String` | Chuỗi tên phân xưởng/đội/ga làm việc của người dùng để tương thích ngược. |
| | `permissions` | `String[]` | Danh sách quyền hạn đặc quyền được gán trực tiếp trên tài khoản (tĩnh). |

---

##### 6.2. Phân tách Quyền hạn Toàn cầu và Quyền hạn theo Phạm vi (Global vs. Scoped Permissions)

Hệ thống phân tách rõ ràng 2 nhóm quyền hạn để vừa đảm bảo tính tập trung trong quản lý của phòng kỹ thuật, vừa tăng tính chủ động của các đội vận hành cơ sở:
1. **Quyền hạn Toàn cầu (Global Permissions):** Thường dành cho `SUPER_ADMIN` hoặc các vai trò quản lý cấp cao tại Root Domain (ví dụ: `users:manage`, `inspections:view_all`, `corrective_actions:view_all`). Những người sở hữu quyền này có thể xem và chỉnh sửa dữ liệu trên toàn hệ thống mà không bị giới hạn bởi OU.
2. **Quyền hạn theo Phạm vi (Scoped Permissions):** Thường dành cho các trưởng bộ phận hoặc chuyên viên tại các OU con (ví dụ: `users:view_scoped`, `users:manage_scoped`, `organization:view`). Quyền truy cập của họ bị giới hạn nghiêm ngặt trong OU họ trực thuộc và các OU con bên dưới.

---

##### 6.3. Cơ chế Điều phối OU ảo liên kết Danh mục Động (Dynamic Virtual OU Coordination)

Để tránh việc nhập liệu thủ công gấp đôi (Double Entry) và duy trì sự linh động tối đa theo Danh mục Người dùng & Vị trí làm việc, hệ thống sử dụng thuật toán **Ánh xạ Động theo Tiền tố (Prefix Dynamic Mapping)**. Khi gọi phương thức `getOrganizationalUnits()`, các danh mục động được tải trực tiếp từ cơ sở dữ liệu và chuyển đổi tức thời thành các OU ảo trên cây tổ chức AD.

###### Ma trận Tiền tố Định danh OU ảo (Virtual OU ID Prefix Mapping Table)

| Nguồn Danh mục | Tiền tố ID Sinh ra | Vị trí neo đậu trong AD (parentId) | Tên hiển thị AD tương ứng |
| :--- | :--- | :--- | :--- |
| **PatrolLocation**<br>*(Vị trí tuần tra/Nhà ga)* | `ou-loc-${id}` | Lồng dưới **Đội Vận hành Ga (`ou-stations`)** nếu có, hoặc thư mục cha `ou-category-locations`. | `Ga: ${loc.label}` |
| **ResponsibleUnit**<br>*(Đội chuyên trách nghiệp vụ)* | `ou-unit-${id}` | Lồng dưới thư mục quản trị `ou-category-responsible-units`. | `Đơn vị: ${unit.name}` |
| **Subsystem**<br>*(Hệ thống kỹ thuật chuyên ngành)* | `ou-sub-${id}` | Lồng dưới thư mục quản trị `ou-category-subsystems`. | `Hệ thống: ${subsystem.label}` |

###### Luồng Nạp và Tra cứu Cơ cấu Tổ chức AD (AD Tree Building Flow)

```text
[Khởi động / Gọi Tree API]
          │
          ▼
 Tải OUs chuẩn từ DB ➔ Array [Standard OUs]
          │
          ▼
 Tải các Danh mục (Locations, Units, Subsystems) 
          │
          ├─► Chuyển đổi thành Array [Virtual OUs] bằng Tiền tố
          │
          ▼
 Gộp mảng: [Merged OUs] = [Standard OUs] ∪ [Virtual OUs]
          │
          ▼
 [Xây dựng Cây AD đệ quy theo parentId]
   - Bắt đầu từ parentId = null (Root OUs)
   - Lọc Users có User.ouId === OU.id
   - Duyệt đệ quy con cháu đến các Tổ kỹ thuật và các Ga động
          │
          ▼
[Kết quả: Sơ đồ AD Sâu 29-OU hoàn chỉnh cho Metro]
```

---

##### 6.4. Ma trận Phân quyền Vai trò Bảo trì Phân cấp (Graded Maintenance Matrix)

Phân quyền kỹ sư bảo trì và nhân viên vận hành được thiết kế nghiêm ngặt theo **5 cấp độ chuyên nghiệp** (Maintenance Levels), tương thích hoàn hảo với vai trò kỹ thuật thực tế tại các xí nghiệp:

```text
                  ┌──────────────────────────────────────────────┐
                  │                 SUPER_ADMIN                  │  (Cấp độ Tối cao)
                  │                   Quyền [*]                  │
                  └──────────────────────┬───────────────────────┘
                                         ▼
                   ┌──────────────────────────────────────────────┐
                   │                Admin (P.KTAT)                │  (Cấp độ 4 - Đại tu & An toàn)
                   │       reports:manage, organization:manage    │
                   └──────────────────────┬───────────────────────┘
                                          ▼
                   ┌──────────────────────────────────────────────┐
                   │               Chuyên viên (L3)               │  (Cấp độ 3 - Lập kế hoạch & Phê duyệt)
                   │       inspections:assign, dnf:manage_status  │
                   └──────────────────────┬───────────────────────┘
                                          ▼
                   ┌──────────────────────────────────────────────┐
                   │              Kỹ thuật viên (L2)              │  (Cấp độ 2 - Sửa chữa sự cố định kỳ)
                   │       inspections:create, ai:vision          │
                   └──────────────────────┬───────────────────────┘
                                          ▼
                   ┌──────────────────────────────────────────────┐
                   │                Nhân viên (L1)                │  (Cấp độ 1 - Tuần tra & Báo cáo cơ bản)
                   │       inspections:create, hazard:create      │
                   └──────────────────────────────────────────────┘
```

###### Ma trận Phân phối Quyền hạn chi tiết (Precise Authorization Grid)

| Nhóm chức năng | Mã Quyền hạn Hệ thống | L1 | L2 | L3 | Admin (P.KTAT) | Super Admin |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Kiểm tra (Inspection)** | `inspections:create` | ✅ | ✅ | ❌ | ✅ | ✅ |
| | `inspections:view_all` | ✅ | ✅ | ✅ | ✅ | ✅ |
| | `inspections:assign` | ❌ | ❌ | ✅ | ✅ | ✅ |
| | `inspections:approve` | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Sự cố (Incidents DNF)**| `dnf:create` | ✅ | ✅ | ❌ | ✅ | ✅ |
| | `dnf:view_all` | ✅ | ✅ | ✅ | ✅ | ✅ |
| | `dnf:manage_status` | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Mối nguy (Hazards)** | `hazard:create` | ✅ | ✅ | ❌ | ✅ | ✅ |
| | `hazard:assess` | ❌ | ❌ | ✅ | ✅ | ✅ |
| | `hazard:manage_status` | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Khắc phục (Actions)** | `corrective_actions:create` | ❌ | ✅ | ❌ | ✅ | ✅ |
| | `corrective_actions:assign` | ❌ | ❌ | ✅ | ✅ | ✅ |
| | `corrective_actions:verify` | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Báo cáo (Reports)** | `reports:view` | ❌ | ❌ | ❌ | ✅ | ✅ |
| | `reports:manage` | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Trí tuệ Nhân tạo (AI)** | `ai:use` | ✅ | ✅ | ✅ | ✅ | ✅ |
| | `ai:vision` (Phân tích ảnh) | ❌ | ✅ | ❌ | ✅ | ✅ |
| **Quản trị (Admin)** | `users:manage` | ❌ | ❌ | ❌ | ✅ | ✅ |
| | `users:manage_scoped` (OU) | ❌ | ❌ | ✅ | ❌ | ✅ |
| | `organization:manage` | ❌ | ❌ | ❌ | ✅ | ✅ |

---

##### 6.5. Công thức & Thuật toán Phân giải Quyền hạn Động (Dynamic Permission Resolution)

Hệ thống thực hiện phân giải quyền hạn của người dùng tại thời điểm runtime khi thực thi yêu cầu (API Request). Cơ chế này loại bỏ hoàn toàn việc lưu trữ trùng lặp dữ liệu quyền hạn tĩnh trên tài khoản người dùng, đồng thời cho phép cập nhật chính sách phân quyền tức thời khi điều chỉnh Danh mục Vai trò.

###### Công thức Toán học (Mathematical Formalism)

Gọi $U$ là tài khoản Người dùng (User), $R$ là Vai trò (Role) được gán cho Người dùng đó trong Danh mục Vai trò. 
Gọi $P(X)$ là tập hợp các quyền hạn của thực thể $X$.

Tập hợp quyền hạn thực tế của người dùng tại thời điểm Runtime, ký hiệu là $P_{runtime}(U)$, được định nghĩa bằng phép Hợp (Union) của hai tập hợp:

$$P_{runtime}(U) = P(R) \cup P(U)$$

Trong đó:
*   $P(R)$ là tập hợp các quyền hạn được cấu hình tập trung cho Vai trò $R$ tại **Danh mục Vai trò** (`userRole.permissions`).
*   $P(U)$ là tập hợp các quyền hạn đặc cách/tùy biến được cấu hình trực tiếp trên **Tài khoản người dùng** $U$ (`dbUser.permissions`).

###### Hiện thực hóa thuật toán bằng TypeScript (TypeScript Implementation)

Được trích xuất trực tiếp từ [auth-service.ts](file:///d:/Hurc1CRM-main/Hurc-cdhs/src/lib/services/auth-service.ts):
```typescript
const roles: any[] = await getInternalRoles();
const userRole = roles.find((r: any) => r.id === dbUser.role || r.name === dbUser.role);
const rolePermissions = userRole?.permissions || [];

const resolvedPermissions = Array.from(new Set([
    ...rolePermissions,
    ...(dbUser.permissions || [])
]));
```
*   **Sử dụng `Set`:** Loại bỏ hoàn toàn các quyền trùng lặp, tối ưu hóa kích thước mảng bộ nhớ.
*   **Độ phức tạp:** $O(N + M)$ trong đó $N$ là số quyền của Vai trò và $M$ là số quyền đặc cách của tài khoản. Cho phép xử lý cực nhanh dưới 1ms trong phiên làm việc.

---

##### 6.6. Cơ chế Lọc Dữ liệu theo Phạm vi OU (OU-Scoped Data Filtering)

Quy tắc bảo mật theo phạm vi OU được áp dụng nghiêm ngặt trên cả **Quản lý Người dùng (User Management)** và **Dữ liệu Vận hành (Operational Data - Inspections, DNFs, Hazards)**:
* **Đối với Quản lý Người dùng (User.actions - `getUsers`):**
  - Người dùng có quyền `users:manage` hoặc vai trò `SUPER_ADMIN` được quyền xem toàn bộ người dùng trong hệ thống.
  - Người dùng có quyền `users:view_scoped` (như **Chuyên viên L3**) chỉ được quyền xem danh sách người dùng thuộc **cùng một OU** hoặc thuộc các **OU con** nằm dưới OU của mình.
  - Người dùng thông thường không có 2 quyền trên chỉ có thể xem hồ sơ cá nhân của chính mình.
* **Đối với Dữ liệu Vận hành (Inspections, DNFs, Hazards):**
  - Hệ thống tự động xác định OU của kỹ sư tạo bản ghi (`createdById` hoặc `inspector`).
  - Khi một kỹ sư thực hiện truy vấn danh sách sự cố DNF, kiểm tra Inspection hoặc hồ sơ mối nguy Hazard, hệ thống sẽ gọi hàm kiểm tra phạm vi. Người dùng chỉ nhìn thấy các bản ghi được tạo bởi các thành viên thuộc cùng OU hoặc các OU con trực thuộc.
  - Ví dụ: Một **Chuyên viên L3** thuộc OU **"IT"** sẽ nhìn thấy tất cả các phiếu kiểm tra, sự cố do các thành viên thuộc OU **"IT"** lập ra, nhưng hoàn toàn không thể thấy dữ liệu của OU **"Đội Bảo trì Đường ray"** trừ khi họ được gán quyền toàn cầu.

---

##### 6.7. Động cơ Phân tích Phạm vi Tổ chức (`OUScopeService` - `ou-scope-service.ts`)

Lớp tĩnh `OUScopeService` cung cấp các thuật toán đệ quy tối ưu để phân tích mối quan hệ phân cấp:
1. `getOUAncestors(ouId: string): Promise<string[]>`: Đi bộ ngược dòng cây thông qua `parentId` để thu thập mọi OU cha, ông cho tới gốc Domain.
2. `getOUDescendants(ouId: string): Promise<string[]>`: Đệ quy đi xuống để thu thập toàn bộ danh sách các OU con và cháu trực thuộc.
3. `isOUInScope(userOuId: string | null | undefined, targetOuId: string | null | undefined): Promise<boolean>`: Trả về `true` nếu OU mục tiêu trùng với OU của người dùng hoặc là con/cháu của OU đó.
4. `getUsersInScope(userOuId: string | null | undefined): Promise<string[]>`: Trả về danh sách ID người dùng nằm trong phân cấp OU được gán.
5. `getOUScopePath(ouId: string): Promise<string>`: Giải quyết đường dẫn đầy đủ dạng chuỗi (ví dụ: `hurc.local > metro1.hurc.local > ops.metro1.hurc.local > Xí nghiệp Bảo trì > Phân xưởng IT`).

---

##### 6.8. Bộ kiểm soát Quyền theo Phạm vi (`requireScopedPermission` - `auth-enforcer.ts`)

Để bảo vệ các Server Action và các trang Web khỏi việc truy cập trái phép, hệ thống triển khai hàm kiểm soát an ninh `requireScopedPermission`:
```typescript
export async function requireScopedPermission(permission: string, targetOuId?: string | null) {
    const user = await requirePermission(permission);
    
    // SUPER_ADMIN có toàn quyền, bỏ qua kiểm tra scope
    if (user.role === 'SUPER_ADMIN') {
        return user;
    }
    
    // Nếu tài nguyên không quy định OU mục tiêu, chỉ cần kiểm tra quyền hạn cơ bản
    if (!targetOuId) {
        return user;
    }
    
    const userOuId = user.ouId;
    if (!userOuId) {
        throw new UnauthorizedError('Bạn chưa được gán vào đơn vị tổ chức nào.');
    }
    
    // Nạp động OUScopeService để tránh lỗi vòng lặp phụ thuộc (circular dependency)
    const { OUScopeService } = await import('./services/ou-scope-service');
    const inScope = await OUScopeService.isOUInScope(userOuId, targetOuId);
    if (!inScope) {
        throw new UnauthorizedError('Bạn không có quyền truy cập tài nguyên ngoài phạm vi đơn vị tổ chức của bạn.');
    }
    
    return user;
}
```

---

##### 6.9. Cơ chế Điều phối Bảo vệ Toàn vẹn Dữ liệu Đệ quy (Recursive Data Integrity Safeguards)

Hai cơ chế an toàn tối cao giúp hệ thống tự động bảo vệ cơ sở dữ liệu khi cơ cấu tổ chức thay đổi hoặc bị xóa, ngăn chặn triệt để lỗi mồ côi (Dangling Pointers) và crash ứng dụng do OU ảo:

###### 6.9.1. Lưu đồ Bảo vệ Xóa đệ quy AD (Safe OU Deletion Workflow)

```mermaid
graph TD
    A[Yêu cầu xóa OU ID] --> B{ID có phải OU ảo?}
    B -- Có (tiền tố ou-loc-, ou-unit-, ou-sub-) --> C[Return ngay lập tức - Không xóa DB]
    B -- Không (OU tiêu chuẩn) --> D[Lấy toàn bộ OUs trong DB]
    D --> E[Lọc các OU con có parentId === ID]
    E --> F{Có OU con nào?}
    F -- Có --> G[Gọi đệ quy deleteOrganizationalUnit cho từng OU con]
    G --> E
    F -- Không --> H[Lấy tất cả Users thuộc OU cha này]
    H --> I[Cập nhật User: Đặt ouId = null và department = null]
    I --> J[Thực hiện xóa bản ghi OU cha trong DB]
    J --> K[Hoàn tất dọn dẹp dữ liệu sạch sẽ]
```
*   **Chốt chặn bảo vệ OU ảo:** Hàm `deleteOrganizationalUnit` được cấu hình chốt chặn `if (id.startsWith(...)) return;` để ngăn chặn việc gọi lệnh xóa xuống DB đối với các ID có cấu trúc ảo (`ou-loc-`, `ou-unit-`, `ou-sub-`).
*   **Bảo vệ đệ quy cascade:** Tự động quyét và xóa các OU con sâu bên dưới trước khi thực hiện xóa OU cha.

###### 6.9.2. Cơ chế Khắc phục Mồ côi Người dùng khi Xóa Danh mục (Category-Dangling Cleanup)

Khi một danh mục nghiệp vụ (ví dụ: một Ga hành khách $L$) bị xóa ở trang Quản lý Danh mục, hệ thống sẽ thực thi điều phối ánh xạ dữ liệu:

$$\text{Nếu } L \text{ bị xóa } \Longrightarrow \forall U \in \text{Users } \mid U.ouId == \text{"ou-loc-" + } L.id \Longrightarrow U.ouId = \text{null}$$

Hiện thực hóa trong mã nguồn [category-service.ts](file:///d:/Hurc1CRM-main/Hurc-cdhs/src/lib/services/category-service.ts):
```typescript
export async function deleteInternalLocation(id: string) {
    // 1. Quét dọn trước để tránh rác dữ liệu trên người dùng gán với ga này
    try {
      const users = await dbProvider.findMany<any>('User');
      const virtualOuId = `ou-loc-${id}`;
      const affectedUsers = users.filter((u: any) => u.ouId === virtualOuId);
      for (const u of affectedUsers) {
        await dbProvider.update('User', u.id, { ouId: null });
      }
    } catch (e) {
      console.warn('[CATEGORY-SERVICE] Failed to clean up user references for deleted location:', e);
    }
    
    // 2. Tiến hành xóa ga khỏi DB
    // ...
}
```

---

## 7. HƯỚNG DẪN CÀI ĐẶT & THAM CHIẾU CẤU HÌNH CHI TIẾT

Dưới đây là phần giải nghĩa chi tiết cấu hình và hướng dẫn cài đặt hệ thống nhằm bảo vệ tính an toàn và bất biến tuyệt đối.

### 7.0. Yêu cầu Môi trường & Phiên bản Node.js (Node.js & Environment Requirements)

Để hệ thống hoạt động ổn định và tránh lỗi bất tương thích nhị phân (ABI) trong các thư viện (đặc biệt là Prisma ORM và các module mã hóa), hệ thống áp đặt quy định chặt chẽ về phiên bản Node.js:
- **Phiên bản bắt buộc:** Node.js **`v20.12.2`** (được chỉ định động tại tệp `.nvmrc` và `.node-version`).
- **Chốt chặn cục bộ (Preflight Node Guard):** Chốt chặn `scripts/preflight-node.js` đã được tích hợp trực tiếp vào vòng đời của các lệnh `npm run dev` và `npm run build`. Nếu chạy bằng phiên bản Node.js khác, tiến trình sẽ ngay lập tức bị ngắt (`exit 1`) và hướng dẫn kỹ sư cách đồng bộ.
- **Sử dụng NVM:** Chạy lệnh `nvm install 20.12.2 && nvm use 20.12.2` để thiết lập đúng phiên bản trước khi chạy cài đặt hoặc khởi chạy.

### 7.1. Tham chiếu chi tiết tệp cấu hình .env

Tệp tin này nằm tại thư mục gốc [.env](.env), điều khiển toàn bộ hành vi khởi chạy hệ thống:

```ini
# Chế độ chạy Offline hay Online (QUAN TRỌNG NHẤT)
# - true: Bật chế độ tối giản hạ tầng, dùng file db.json trên RAM, tắt kết nối Postgres/Mongo.
# - false: Chạy ở chế độ đầy đủ, kết nối các máy chủ dữ liệu độc lập.
IS_DATABASE_OFFLINE=true

# Địa chỉ kết nối cơ sở dữ liệu PostgreSQL (Chỉ dùng khi IS_DATABASE_OFFLINE=false)
DATABASE_URL="postgresql://postgres:hurc1_admin_2026@postgres:5432/metro_db?schema=public"

# Địa chỉ kết nối cơ sở dữ liệu MongoDB (Lưu trữ lịch sử log và tri thức AI RAG)
MONGODB_URI="mongodb://mongo:mongo_secure_pwd@mongodb:27017/ai_knowledge?authSource=admin"

# Cổng truy cập của trợ lý ảo Ollama local
OLLAMA_BASE_URL="http://ollama-service:11434"

# Mô hình AI được chỉ định sử dụng
# - gemma:2b: Mô hình siêu nhẹ của Google, chạy cực mượt trên CPU máy tính văn phòng.
# - mistral:7b: Mô hình trung bình, cần máy chủ có GPU để phản hồi nhanh.
OLLAMA_MODEL="gemma:2b"

# Tham số cấu hình bảo mật mã hóa JWT Token cho người dùng đăng nhập
JWT_SECRET="secure_token_generation_key_hurc1_metro_2026"
```

---

### 7.2. Tham chiếu chi tiết dịch vụ docker-compose.yml

Tệp cấu hình [docker-compose.yml](docker-compose.yml) định nghĩa cách các container được dựng lên và cô lập cổng mạng.

#### Trụ cột Dịch vụ Web

- **Dịch vụ `app` (Next.js):**
  - *Cổng nội bộ:* `3000`
  - *Biến môi trường truyền vào:* Nhận trực tiếp các giá trị từ `.env` để cấu hình chế độ Offline/Online và chỉ số AI.
  - *Cơ chế kiểm tra sức khỏe (Healthcheck):* Container sử dụng hình ảnh bọc thép Chainguard (Zero-CVE) siêu bảo mật và tối giản (không tích hợp sẵn `curl` hay `wget`). Do đó, cơ chế kiểm tra sức khỏe được thực hiện bằng trình biên dịch Node.js nội tại: `node -e "fetch('http://localhost:3000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"` chạy định kỳ mỗi 30 giây. Nếu sập quá 3 lần liên tiếp, Docker sẽ tự động tái khởi động ứng dụng.

#### Trụ cột An ninh Mạng

- **Dịch vụ `nginx` (Cổng Gateway):**
  - *Cổng mở ra máy tính vật lý:* `80` (HTTP) và `443` (HTTPS bảo mật SSL).
  - *Nhiệm vụ:* Đón nhận mọi lượt truy cập, phân tải và chuyển tiếp an toàn vào cổng `3000` của dịch vụ `app`.

#### Trụ cột Cơ sở Dữ liệu

- **Dịch vụ `postgres` (Cơ sở dữ liệu chính):**
  - *Cổng nội bộ:* `5432`
  - *Ổ đĩa lưu trữ (Volume):* Gắn thư mục vật lý `./data/postgres` trên ổ cứng máy tính vào `/var/lib/postgresql/data` trong container để bảo vệ dữ liệu không bị mất khi tắt máy.
- **Dịch vụ `redis` (Bộ nhớ tăng tốc):**
  - *Cổng nội bộ:* `6379`
  - *Nhiệm vụ:* Lưu trữ tạm các phiên đăng nhập của kỹ sư để truy xuất tức thì.

#### Trụ cột Trí tuệ Nhân tạo

- **Dịch vụ `yolo-service` (Mắt thần nhận diện hình ảnh):**
  - *Cổng nội bộ:* `5005`
  - *Công nghệ:* Chạy Python nền tảng PyTorch xử lý suy luận ảnh chụp lỗi tà vẹt/ray nứt.
- **Dịch vụ `ollama-service` (Bộ não AI local):**
  - *Cổng nội bộ:* `11434`
  - *Ổ đĩa lưu trữ (Volume):* Gắn thư mục lưu trữ các mô hình AI đã tải về ổ cứng để tránh việc phải tải lại mỗi lần khởi động.

#### Trụ cột Giám sát Hộp đen

- **Dịch vụ `loki` (Hộp đen lưu logs):**
  - *Nhiệm vụ:* Thu gom toàn bộ nhật ký lỗi của Nginx, Next.js, YOLO, Ollama về một nơi duy nhất.
- **Dịch vụ `grafana` (Màn hình chỉ huy kỹ thuật):**
  - *Cổng mở ra ngoài:* `3001`
  - *Nhiệm vụ:* Vẽ biểu đồ hiệu năng máy chủ, báo cáo tình trạng đầy RAM hoặc sập dịch vụ.

---

### 7.3. Quy trình Kiểm nghiệm Sức bền (Smoke Test & Rollback Policies)

Hệ thống tích hợp quy trình kiểm duyệt chất lượng và sức bền tự động cực kỳ nghiêm ngặt nhằm tránh việc "Build thành công nhưng Runtime thất bại" (Build Pass but Runtime Fail):
1. **Chốt chặn Smoke Test cục bộ:** Kịch bản `scripts/smoke-deploy.sh` sẽ thực hiện gửi các gói tin HTTP kiểm tra đến các cổng API của Nginx, App, YOLO-Service, và Ollama.
2. **Đặc cách cho container tác vụ ngắn hạn:** Đối với container `hurc_ollama_pull` (có nhiệm vụ tải model AI khi khởi chạy rồi tự dừng ở trạng thái `exited` với mã thoát `0`), trình kiểm duyệt sẽ đặc cách bỏ qua kiểm tra trạng thái hoạt động dài hạn nếu mã thoát là `0` để tránh phát hiện lỗi giả (false-positive).
3. **Quy tắc GO/NO-GO & Rollback:** 
   - **GO:** Tiến trình deploy được hoàn tất nếu và chỉ nếu toàn bộ các chốt chặn kiểm thử sức bền đạt 100% kết quả thành công.
   - **NO-GO:** Nếu bất kỳ một kiểm thử nhỏ nào thất bại, hệ thống tự động kích hoạt tiến trình Rollback nhanh khẩn cấp (sử dụng `scripts/rollback-drill.sh` hoặc checkout lại commit ổn định gần nhất) để giữ vững tính ổn định tuyệt đối của hệ thống Metro.

---

## 8. ẨN DỤ ĐỜI THƯỜNG DÀNH CHO NGƯỜI MỚI

Để giúp những người hoàn toàn không có kiến thức kỹ thuật cơ bản vẫn có thể hiểu và tự tay vận hành được toàn bộ hệ thống này, dưới đây là bảng quy đổi toàn bộ kiến trúc phức tạp trên thành những hình ảnh vô cùng dân dã:

```text
+-------------------------------------------------------------------------------+
|                        TÒA NHÀ TRUNG TÂM METRO (HỆ THỐNG)                     |
|                                                                               |
| +------------------+   +-------------------------+   +----------------------+ |
| | CỔNG BẢO VỆ      |   | NGÔI NHÀ CHÍNH          |   | TỦ HỒ SƠ LƯU TRỮ     | |
| | (Nginx Gateway)  |-->| (Next.js Web App)       |-->| (Postgres/db.json)   | |
| | Lọc người vào ra |   | Nơi tính toán, xử lý    |   | Lưu dữ liệu an toàn  | |
| +------------------+   +-------------------------+   +----------------------+ |
|                                     |                            |            |
|                                     v                            v            |
|                        +-------------------------+   +----------------------+ |
|                        | PHÒNG CỐ VẤN CHIẾN LƯỢC |   | THƯ VIỆN TRA CỨU     | |
|                        | (Ollama AI & YOLO)      |   | (Ensemble RAG)       | |
|                        | Trợ lý AI và Mắt thần   |   | Sách hướng dẫn tàu   | |
|                        +-------------------------+   +----------------------+ |
|                                                                               |
|                       +-----------------------------------+                   |
|                       | HỘP ĐEN & MÀN HÌNH THEO DÕI        |                   |
|                       | (Loki logs & Grafana)             |                   |
|                       | Phát hiện lỗi và bảo vệ hệ thống  |                   |
|                       +-----------------------------------+                   |
+-------------------------------------------------------------------------------+
```

### Sự phối hợp hoạt động trong thực tế

- Khi có khách ghé thăm trang web, **Cổng bảo vệ (Nginx)** sẽ mở cửa đón họ, kiểm tra vé xe, rồi đưa khách vào **Ngôi nhà chính (Next.js App)** để mua vé tàu.
- **Ngôi nhà chính (Next.js App)** sẽ mở **Tủ hồ sơ (Database)** ra kiểm tra xem khách hàng đó tên gì, có tiền án tiền sự hay không.
- Nếu khách hàng có câu hỏi khó về kỹ thuật tàu hỏa, chủ nhà sẽ chạy sang **Phòng cố vấn chiến lược (Ollama AI)** để hỏi ý kiến chuyên gia. Chuyên gia sẽ giở đúng cuốn **Sách hướng dẫn tàu (RAG)** đặt trên kệ để đọc câu trả lời chính xác, tránh việc tự bịa ra thông tin làm hại đến an toàn hành khách.
- Mọi hoạt động trong ngôi nhà từ việc đón khách, mở tủ hồ sơ, đến câu hỏi của chuyên gia đều được ghi chép cẩn thận vào cuốn **Sổ nhật ký của người giám sát (Loki logs)** và hiển thị liên tục lên **Màn hình camera an ninh (Grafana)** để Ban giám đốc theo dõi từ xa.

---
*Tài liệu được biên soạn và bảo chứng chất lượng ở mức độ phân tử bởi Đội ngũ kỹ sư Hệ thống HURC1 CRM.*
*Chúc bạn vận hành hệ thống tàu Metro số 1 TP.HCM an toàn, ổn định và hiệu quả!*
