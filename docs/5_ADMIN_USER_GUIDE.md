# TÀI LIỆU 5: CẨM NANG QUẢN TRỊ VIÊN CẤP CAO (ADMIN USER GUIDE)

Tài liệu này hướng dẫn chi tiết cách Super Admin thiết lập Cơ cấu tổ chức (Active Directory) và phân quyền bảo mật (RBAC) trên phần mềm **HURC1 CRM**.

---

## 1. THIẾT LẬP CÂY TỔ CHỨC ĐỆ QUY (AD TREE HIERARCHY)

Hệ thống đã loại bỏ các khái niệm phức tạp (Forest, Tree, Domain) và chỉ sử dụng mô hình **Đơn vị Tổ chức (Organizational Unit - OU)** lồng nhau đệ quy không giới hạn độ sâu.

### 1.1 Tạo Đơn Vị Tổ Chức Mới
1. Vào mục **Cơ cấu Tổ chức AD**.
2. Bấm nút **Thêm đối tượng AD** ở góc phải trên.
3. Trong hộp thoại, cấu hình các trường:
   - **Đơn vị OU Cha (Parent):** Mặc định là Trống (Root OU). Chọn một OU hiện có nếu muốn OU này là cấp con.
   - **Mã ID:** Không chứa khoảng trắng (VD: `ou-infra`).
   - **Tên hiển thị:** (VD: `Phân xưởng Bảo trì Hạ tầng`).

### 1.2 Đơn vị Ảo (Virtual OUs) & Chỉ báo Trực quan
Để tránh trùng lặp dữ liệu, hệ thống hỗ trợ khái niệm **Virtual OUs**. Khi bạn tạo một "Nhà ga" trong tab *Danh mục Nghiệp vụ*, hệ thống tự động sinh ra một OU Ảo tương ứng trên cây AD Tree.

- **Chỉ báo Giao diện (Visual Indicator):** Các OU Ảo luôn được bao quanh bởi **đường viền xanh Cyan phát sáng** và icon **Layers nhấp nháy**.
- **Cơ chế Khóa (Lock Mechanism):** Khi click vào một OU Ảo, nút *Sửa* và *Xóa* sẽ tự động bị khóa, kèm một Alert cảnh báo người dùng qua tab Danh mục để chỉnh sửa thay vì thao tác trên cây AD.

---

## 2. QUẢN LÝ VAI TRÒ VÀ MA TRẬN PHÂN QUYỀN (GRADED ROLES)

### 2.1 Cấu trúc 5 Vai trò Mặc định
1. **Super Admin:** Có toàn bộ quyền hạn (ký hiệu `*`).
2. **Admin (P.KTAT):** Quản lý kỹ thuật an toàn, duyệt phiếu đại tu, giám sát chất lượng.
3. **Chuyên viên (L3):** Lập kế hoạch, giao tác vụ cho cấp dưới trong phạm vi OU.
4. **Kỹ thuật viên (L2):** Trực tiếp thi công, bảo dưỡng chuyên sâu, xử lý DNF tại hiện trường.
5. **Nhân viên (L1):** Tuần tra hằng ngày, báo cáo mối nguy (Hazards) và DNF sơ cấp.

### 2.2 Quy trình Cấp Quyền
1. Vào tab **Vai trò & Phân quyền**.
2. Lựa chọn một vai trò.
3. Tích/Bỏ tích các hộp quyền (Permissions) cụ thể. Hệ thống sẽ ngay lập tức lưu lại thông tin một cách an toàn.

> [!WARNING]
> Tuyệt đối hạn chế cấp các quyền như `inspections:delete` hoặc `dnf:delete` cho nhóm L1 và L2 để phòng tránh hiện tượng tẩy xóa dữ liệu sự cố.

---

## 3. GÁN NHÂN SỰ VÀ BỘ LỌC ĐỘNG (SCOPED RBAC)

Hệ thống kết hợp quyền hạn của Vai Trò với Phạm vi (Scope) của Đơn vị. 

### 3.1 Tìm kiếm OU thông minh khi tạo tài khoản
1. Truy cập trang **Quản lý Người dùng**.
2. Khi thêm hoặc chỉnh sửa người dùng, trường **Đơn vị tổ chức (OU)** sử dụng một *Combobox thông minh*. 
3. Admin có thể gõ từ khóa (VD: "Depot", "Cát Linh") thay vì cuộn tìm kiếm. Khi chọn xong OU, trường Phòng ban (Department) sẽ tự động điền đồng bộ.

### 3.2 Tích hợp Phân hệ kỹ thuật (Subsystems)
Đối với kỹ thuật viên L2, bạn cần gán bổ sung các **Phân hệ kỹ thuật (Assigned Subsystems)** mà họ phụ trách (VD: "Điện", "Ray", "Tín hiệu"). Lớp bộ lọc này đảm bảo một thợ điện không thể tự ý phê duyệt biên bản lỗi của mảng cơ khí toa xe.
