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
5. **CƠ CHẾ PHÒNG VỆ FILE KHÓA VÀ SAO LƯU XOAY VÒNG (Lock Recovery & Backups)**
6. **HƯỚNG DẪN CÀI ĐẶT & THAM CHIẾU CẤU HÌNH CHI TIẾT (Deployment Reference)**
7. **ẨN DỤ ĐỜI THƯỜNG DÀNH CHO NGƯỜI MỚI (Analogy Quick Start)**

---

## 1. KIẾN TRÚC DỮ LIỆU CẤP ĐỘ PHÂN TỬ

Hệ thống HURC1 CRM hỗ trợ cơ chế lưu trữ kép linh hoạt: **Online Mode** sử dụng cơ sở dữ liệu quan hệ **PostgreSQL** qua Prisma ORM, và **Offline Mode** sử dụng công cụ lưu trữ siêu nhẹ **JSON-DB** qua tệp tin [db.json](file:///d:/Hurc1CRM-main/Hurc-cdhs/db.json).

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

---

## 2. THUẬT TOÁN VÀ CÔNG THỨC TOÁN HỌC CỐT LÕI

Toàn bộ "trí tuệ toán học" của Dashboard chỉ huy CEO nằm tại tệp tin dịch vụ [strategic-metrics.ts](file:///d:/Hurc1CRM-main/Hurc-cdhs/src/lib/services/strategic-metrics.ts). Dưới đây là cách tính toán chi tiết từng chỉ số ở cấp độ dòng lệnh.

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

Dịch vụ nhận diện lỗi kỹ thuật sử dụng mô hình học máy **YOLOv8** chạy trực tiếp qua container Python chuyên dụng tại cổng `5005` (Xem file cấu hình tại [yolo/main.py](file:///d:/Hurc1CRM-main/Hurc-cdhs/infra/yolo/main.py)).

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

## 5. CƠ CHẾ PHÒNG VỆ FILE KHÓA VÀ SAO LƯU XOAY VÒNG

Trong môi trường vận hành thực tế trên hệ điều hành Windows ở chế độ **Offline**, các tiến trình ghi tệp tin liên tục vào [db.json](file:///d:/Hurc1CRM-main/Hurc-cdhs/db.json) có thể dẫn tới tranh chấp tài nguyên (File Locking) khiến hệ thống bị sập. Dưới đây là cơ chế tự phòng vệ cấp độ nguyên tử được tích hợp sẵn.

### 5.1. Cơ chế khôi phục khóa file (Lock Recovery Engine)

- **Vấn đề thực tế trên Windows:** Khi Next.js đang ghi ghi dữ liệu vào tệp `db.json`, nếu kỹ sư dùng Notepad mở tệp này lên để xem, hệ điều hành Windows sẽ lập tức kích hoạt cơ chế khóa độc quyền (Exclusive File Lock). Lúc này, Next.js ghi đè dữ liệu mới vào sẽ bị chặn và quăng ra lỗi hệ thống nghiêm trọng: `EPERM: permission denied, open 'db.json'` hoặc `EBUSY: resource busy`.
- **Giải pháp giải cứu thông minh (Graceful Retry with Exponential Backoff):**
  Trong tệp quản lý dữ liệu [lock-recovery.ts](file:///d:/Hurc1CRM-main/Hurc-cdhs/src/lib/db/lock-recovery.ts), hệ thống không báo sập ứng dụng ngay khi gặp lỗi khóa file `db.json`. Thay vào đó, nó triển khai thuật toán lùi bước chờ đợi tăng dần (Exponential Backoff):
  - *Lần lỗi thứ 1:* Hệ thống tự động đứng yên chờ đợi **50 mili-giây**, sau đó thử ghi lại lần 2.
  - *Lần lỗi thứ 2:* Nếu vẫn bị khóa, hệ thống nhân đôi thời gian chờ đợi lên **100 mili-giây**, sau đó thử ghi lại lần 3.
  - *Lần lỗi thứ 3:* Nếu vẫn bị khóa, tiếp tục đợi **200 mili-giây**, sau đó thử ghi lại lần cuối cùng.
  - *Tự động giải phóng tiến trình khóa:* Nếu sau 3 lần vẫn lỗi, hệ thống tự động gọi lệnh kiểm tra của hệ điều hành để ngắt kết nối khóa file tạm thời và thực hiện ghi đè cưỡng bức an toàn mà không làm mất mát bất kỳ bản ghi nào của kỹ sư.

---

### 5.2. Động cơ Sao lưu Xoay vòng Tự động (Rotating Backups Engine)

Để tránh lãng phí dung lượng ổ cứng của máy chủ Metro nhưng vẫn đảm bảo an toàn tuyệt mật cho dữ liệu, hệ thống triển khai thuật toán sao lưu xoay vòng tự động tối ưu như sau:

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

Cơ chế này đảm bảo máy chủ của bạn luôn có đúng **5 bản sao lưu gần nhất** của cơ sở dữ liệu để phục hồi bất kỳ lúc nào trong vòng 24 giờ mà không sợ bị đầy dung lượng ổ đĩa.

---

## 6. HƯỚNG DẪN CÀI ĐẶT & THAM CHIẾU CẤU HÌNH CHI TIẾT

Dưới đây là phần giải nghĩa chi tiết cấp độ phân tử từng tham số cấu hình trong hệ thống để quản trị viên có thể tùy biến sâu.

### 6.1. Tham chiếu chi tiết tệp cấu hình .env

Tệp tin này nằm tại thư mục gốc [.env](file:///d:/Hurc1CRM-main/Hurc-cdhs/.env), điều khiển toàn bộ hành vi khởi chạy hệ thống:

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

### 6.2. Tham chiếu chi tiết dịch vụ docker-compose.yml

Tệp cấu hình [docker-compose.yml](file:///d:/Hurc1CRM-main/Hurc-cdhs/docker-compose.yml) định nghĩa cách các container được dựng lên và cô lập cổng mạng.

#### Trụ cột Dịch vụ Web

- **Dịch vụ `app` (Next.js):**
  - *Cổng nội bộ:* `3000`
  - *Biến môi trường truyền vào:* Nhận trực tiếp các giá trị từ `.env` để cấu hình chế độ Offline/Online và chỉ số AI.
  - *Cơ chế kiểm tra sức khỏe (Healthcheck):* Dùng lệnh `curl -f http://localhost:3000/api/health` mỗi 30 giây một lần. Nếu sập quá 3 lần liên tiếp, Docker sẽ tự động tái khởi động ứng dụng.

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

## 7. ẨN DỤ ĐỜI THƯỜNG DÀNH CHO NGƯỜI MỚI

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
