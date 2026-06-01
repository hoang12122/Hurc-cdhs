# TÀI LIỆU 6: GIẢI PHẪU TÍNH NĂNG VÀ PHÂN HỆ NGHIỆP VỤ (MODULES & FEATURES)

Tài liệu này cung cấp một cái nhìn sâu sắc, chi tiết đến từng ngóc ngách của toàn bộ các phân hệ nghiệp vụ có trong hệ thống **HURC1 CRM**. Nếu bạn muốn hiểu phần mềm này *thực sự làm được gì* cho người dùng cuối, đây là tài liệu bạn cần đọc.

---

## 1. PHÂN HỆ VẬN HÀNH BẢO TRÌ CỐT LÕI (CORE MAINTENANCE)

Đây là các module phục vụ trực tiếp cho đội ngũ Kỹ thuật viên (L1, L2) và Quản lý phòng Kỹ thuật An toàn (L3) tại hiện trường và văn phòng điều hành.

### 1.1 Quản lý Sự cố (Module: `dnf` - Defect & Non-Conformity)
Phân hệ quan trọng nhất hệ thống, chuyên xử lý các hư hỏng vòng đời khép kín.
- **Quy trình hoạt động (Workflow):**
  1. **Khởi tạo (L1/L2):** Nhân viên tuần tra phát hiện đèn ga hỏng, ray nứt -> Chụp ảnh qua Mobile App/Web -> Điền biểu mẫu DNF (Chọn loại sự cố, vị trí nhà ga, mức độ nghiêm trọng).
  2. **Tiếp nhận & Giao việc (L3):** Admin phòng Kỹ thuật xem xét mức độ, duyệt DNF, và chuyển thành lệnh làm việc (Work Order) giao cho một Tổ kỹ thuật L2 cụ thể.
  3. **Xử lý & Cập nhật (L2):** Tổ kỹ thuật ra hiện trường sửa chữa, upload ảnh "Sau khi sửa" (After-repair photo), điền log vật tư đã thay thế, chuyển trạng thái sang `Resolved`.
  4. **Nghiệm thu (L3/Manager):** Quản lý kiểm tra đối chiếu hình ảnh. Nếu đạt -> Đóng DNF (`Closed`). Nếu không đạt -> Trả về yêu cầu làm lại (`Rejected`).
- **Tính năng nổi bật:** Tính thời gian MTTR (Mean Time To Repair) tự động; Cảnh báo quá hạn SLA; Xuất báo cáo PDF/DOCX chuẩn form quy định của nhà nước.

### 1.2 Quản lý Mối nguy (Module: `hazards`)
Khác với DNF (Thiết bị đã hỏng), Hazards dùng để ghi nhận các "Rủi ro tiềm ẩn" có thể gây nguy hiểm trong tương lai (Ví dụ: Thấy nước rỉ từ trần ga xuống gần tủ điện cao thế).
- **Tính năng Ma trận Rủi ro (Risk Matrix):** Hệ thống tự động chấm điểm rủi ro bằng công thức: `Mức độ nghiêm trọng (Severity) x Khả năng xảy ra (Probability)`. Từ đó phân loại rủi ro thành: Low, Medium, High, Critical để ưu tiên xử lý.

### 1.3 Quản lý Kiểm tra Định kỳ (Module: `inspections`)
Số hóa toàn bộ các đợt kiểm tra theo ca, ngày, tuần, tháng.
- **Tính năng Checklist Động:** Lập trình viên không hard-code các câu hỏi kiểm tra. Người dùng tự định nghĩa form trong `maintenance-standards` (Ví dụ: Máy lạnh ga phải kiểm tra nhiệt độ, rò rỉ gas). Khi tạo Inspection, hệ thống tự load checklist tương ứng.
- **Tính năng Scan QR:** Kỹ thuật viên dùng thiết bị quét mã QR dán trên tủ điện để mở ngay checklist kiểm tra tương ứng mà không cần gõ tìm kiếm.

### 1.4 Quản lý Tác vụ (Module: `tasks`)
Một bảng Kanban Board tập trung cho Kỹ thuật viên L2.
- **Nội dung:** Tích hợp mọi thứ (DNF được giao, Hazards được phân công, Inspections phải làm trong ca) vào một màn hình duy nhất dưới dạng các thẻ (Cards).
- **Trạng thái:** To-Do, In-Progress, Review, Done.

---

## 2. PHÂN HỆ TÀI SẢN VÀ DANH MỤC (ASSETS & METADATA)

### 2.1 Quản lý Thiết bị & Hạ tầng (Module: `metro`)
"Sổ hộ khẩu" điện tử của mọi tài sản.
- **Cấu trúc dữ liệu:** Cây tài sản đệ quy (Tuyến -> Nhà ga -> Hệ thống -> Tủ điện -> Bo mạch).
- **Lịch sử Vòng đời (Lifecycle History):** Khi click vào một thiết bị (VD: Động cơ quạt thông gió Ga Cát Linh), hệ thống sẽ liệt kê *tất cả* các DNF từng xảy ra với động cơ này trong 10 năm qua, giúp đưa ra quyết định thay mới hay sửa tiếp.

### 2.2 Danh mục Định mức Bảo trì (Module: `maintenance-standards`)
Nơi số hóa các văn bản quy phạm, tiêu chuẩn bảo dưỡng do Nhà sản xuất (OEM) cung cấp.
- **Kho tiêu chuẩn:** Định nghĩa rõ "Hệ thống phanh tàu: 5 ngày kiểm tra rò rỉ dầu một lần. Mức rò rỉ cho phép < 5ml". Nếu kỹ thuật viên điền > 5ml trong lúc làm `inspections`, hệ thống sẽ cảnh báo đỏ (Out of range).

---

## 3. PHÂN HỆ LÃNH ĐẠO VÀ TRÍ TUỆ NHÂN TẠO (LEADERSHIP & AI)

### 3.1 Cổng Điều hành Giám đốc (Module: `ceo` Dashboard)
- **Balanced Scorecard:** Hiển thị tức thời % tiến độ công việc của toàn xí nghiệp.
- **Reliability Metrics:** Biểu đồ MTBF (Thời gian trung bình giữa các lỗi) và biểu đồ Pareto phân tích 80% lỗi đến từ 20% thiết bị nào để tập trung ngân sách đại tu.

### 3.2 AI Computer Vision Audit (Module: `ai-vision-audit`)
Giải pháp chống gian lận và hỗ trợ kỹ thuật tối cao bằng Thị giác Máy tính.
- **Cơ chế:** Khi nhân viên L2 upload ảnh sửa xong đường ray, AI YOLOv8 chạy ngầm (Offline) quét bức ảnh.
- **Tính năng:** Phát hiện xem nhân viên có đang mặc đồ bảo hộ (Mũ, áo phản quang) hay không; Phát hiện các vết nứt nhỏ li ti trên ray mà mắt thường bỏ sót. Báo cờ đỏ (Red Flag) cho quản lý duyệt.

### 3.3 Trợ lý AI Cố vấn (Module: `ai-lab`)
Đưa ChatGPT (mô hình Offline Ollama Llama3/Mistral) vào môi trường bảo mật.
- **Ensemble RAG:** Người dùng hỏi: *"Quy trình xử lý cháy tủ điện ga Cát Linh thế nào?"*. AI sẽ sục sạo trong hàng ngàn file PDF sổ tay phòng cháy chữa cháy nội bộ để trích xuất câu trả lời chuẩn xác nhất, trích dẫn rõ ở "Trang số mấy, điều khoản nào".
- **TrustGraph Explorer:** Cho phép user xem bản đồ mạng nhện, ví dụ: Lỗi ở "Nguồn cung cấp điện" đang ảnh hưởng liên đới tới "Tín hiệu chạy tàu" và "Máy bán vé tự động" ra sao.

---

## 4. PHÂN HỆ QUẢN TRỊ HỆ THỐNG (SYSTEM ADMIN)

### 4.1 Cài đặt & Hồ sơ cá nhân (Modules: `settings`, `profile`, `verify-otp`, `change-password`)
- **Quản lý phiên bản:** Đổi mật khẩu, thiết lập thông tin liên hệ.
- **Bảo mật tối thượng 2FA:** Bắt buộc nhập mã OTP (Google Authenticator) khi đăng nhập từ thiết bị lạ.

### 4.2 Quản trị Phân quyền & AD (Module: `admin`)
- **Cấu trúc AD (Active Directory):** Thiết lập sơ đồ tổ chức đệ quy (Các phòng ban, xưởng, tổ đội lồng nhau).
- **Virtual OUs (Đơn vị ảo):** Tính năng thiết kế siêu việt: Các thực thể phần cứng (Nhà ga) được tự động biến thành một Đơn vị tổ chức trong sơ đồ nhân sự, giúp việc gán kỹ thuật viên phụ trách "Ga Cát Linh" dễ như gán vào một phòng ban.
- **Ma trận Quyền (Roles & Permissions):** Cấp quyền siêu mịn (Fine-grained). Một nhân viên L2 thuộc "Phân xưởng Điện" sẽ tự động **bị mù** (không nhìn thấy) các DNF thuộc "Phân xưởng Ray", đảm bảo bảo mật dữ liệu tuyệt đối (Data Isolation).
