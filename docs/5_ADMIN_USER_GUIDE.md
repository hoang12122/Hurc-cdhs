# TÀI LIỆU 5: CẨM NANG QUẢN TRỊ VIÊN CẤP CAO (ADMIN USER GUIDE)

Tài liệu này là "Sách gối đầu giường" dành cho Super Admin (hoặc Trưởng phòng Kỹ thuật An toàn), hướng dẫn cách tổ chức cơ cấu nhân sự, gán quyền và bảo vệ an toàn dữ liệu trên **HURC1 CRM**.

---

## 1. THIẾT LẬP CÂY TỔ CHỨC ĐỆ QUY (AD TREE)

Hệ thống đã dẹp bỏ cấu trúc cồng kềnh cũ (Forest, Tree, ChildDomain) để sử dụng một mô hình duy nhất và cực kỳ linh hoạt: **Đơn vị Tổ chức (Organizational Unit - OU)** lồng nhau đệ quy.

### Kịch bản thực tế 1: Xây dựng Tổ chức từ con số 0
Bạn cần lập sơ đồ: `Phân xưởng Hạ tầng -> Đội Đường ray -> Tổ Tuần tra Cát Linh`.
1. **Tạo cấp 1:** Vào **Hệ thống AD & RBAC** -> Tab **Cơ cấu Tổ chức AD**. Bấm nút "Thêm đối tượng AD".
   - *Parent OU:* Bỏ trống (Đây là root).
   - *Mã ID:* `ou-infra`.
   - *Tên:* `Phân xưởng Bảo trì Hạ tầng`.
2. **Tạo cấp 2:** Bấm tạo mới. Lần này ở ô *Parent OU*, bạn chọn `Phân xưởng Bảo trì Hạ tầng`. Mã ID: `ou-track`.
3. **Tạo cấp 3:** Bấm tạo mới. Ở ô *Parent OU*, chọn `Đội Đường ray`. Mã ID: `ou-l1-patrol`.

### Kịch bản thực tế 2: Tự động hóa với Đơn vị Ảo (Virtual OUs)
Hệ thống đường sắt có 12 nhà ga, bạn KHÔNG CẦN tạo thủ công 12 OU.
1. Chuyển sang Tab **Danh mục Nghiệp vụ**.
2. Thêm một Danh mục Vị trí mới: `LOC-004` - `Ga Cát Linh`.
3. Quay lại Tab **Cơ cấu Tổ chức AD**, bạn sẽ thấy một OU Ảo tên là `Virtual: Ga Cát Linh` tự động xuất hiện làm con của `Đội Vận hành Ga`. Nó sẽ có **đường viền xanh Cyan phát sáng** để dễ phân biệt. Nút Sửa/Xóa của OU này bị khóa cứng.

---

## 2. QUẢN LÝ VAI TRÒ VÀ MA TRẬN PHÂN QUYỀN (GRADED ROLES)

### 2.1 Hiểu rõ 5 Vai trò Mặc định
- **Super Admin (`SUPER_ADMIN`):** Chúa tể hệ thống (`*`). Có thể làm mọi thứ.
- **Admin P.KTAT (`ADMIN_PKTAT`):** Cấp Quản lý. Duyệt lệnh đại tu, xuất báo cáo, lập kế hoạch.
- **Chuyên viên L3 (`L3_SPECIALIST`):** Điều phối viên phân xưởng. Phân công công việc (Tasks) cho anh em thợ cấp dưới.
- **Kỹ thuật viên L2 (`L2_TECHNICIAN`):** Thợ chuyên sâu. Cầm cờ lê đi sửa máy, chụp ảnh nghiệm thu úp lên phần mềm.
- **Nhân viên L1 (`L1_OPERATOR`):** Mắt thần hiện trường. Đi dạo quanh nhà ga, thấy gì bất thường (nước rỉ, mùi khét) thì báo cáo Hazard.

### 2.2 Kịch bản thực tế 3: Ngăn chặn xóa dữ liệu bậy bạ
- Bạn phát hiện nhân viên L1 thỉnh thoảng xóa nhầm các báo cáo DNF của người khác.
- Cách xử lý: Vào Tab **Vai trò & Phân quyền**, chọn vai trò `L1_OPERATOR`. Ở ma trận quyền hạn bên phải, **bỏ tích** ô `dnf:delete` và `dnf:update`. L1 giờ đây chỉ có quyền `dnf:create` và `dnf:read`.

---

## 3. GÁN NHÂN SỰ VÀ BẢO MẬT PHẠM VI (SCOPED RBAC)

Đỉnh cao bảo mật của hệ thống nằm ở chỗ: **Quyền hạn của bạn bị giới hạn bởi không gian (Scope) mà bạn thuộc về.**

### Kịch bản thực tế 4: Gán quyền Tách biệt (Data Isolation)
Bạn có Nguyễn Văn A (Thợ Điện L2) và Trần Văn B (Thợ Đường Ray L2). Làm sao để A không nhìn thấy các báo cáo của B, dù cả 2 cùng là chức danh L2?

1. **Bước 1 (Gán OU):** Vào trang **Quản lý Người dùng**, chỉnh sửa Nguyễn Văn A, chọn OU là `Tổ Điện Cao Thế`. Tương tự, gán B vào `Tổ Duy tu Ray`.
2. **Bước 2 (Gán Phân hệ - Subsystems):** Ở màn hình chỉnh sửa user A, kéo xuống mục "Phân hệ Kỹ thuật". Tích chọn `Cấp Điện`. Đối với user B, tích chọn `Đường Ray`.
3. **Kết quả kỳ diệu:** Khi Nguyễn Văn A đăng nhập vào hệ thống, bộ đệm thông minh của Next.js sẽ tự động lọc (Filter) cơ sở dữ liệu. Mọi sự cố, task, dnf không thuộc thẻ "Cấp Điện" sẽ **tàng hình** hoàn toàn trước mắt A.
