# TÀI LIỆU 2: QUY TẮC THIẾT KẾ VÀ VIẾT MÃ (DESIGN & CODING RULES)

Tài liệu này định hình tiêu chuẩn thiết kế kiến trúc và phát triển phần mềm, áp dụng cho mọi lập trình viên và các AI Agent tham gia sinh mã (Vibe Code) cho dự án HURC1 CRM.

---

## 1. NGUYÊN TẮC KIẾN TRÚC MICRO-FRONTEND (MFE)

Hệ thống được tổ chức theo cấu trúc Next.js App Router, chia tách thành các Module độc lập (MFE).

### 1.1 Ranh Giới Kỹ Thuật (Module Boundaries)
- **Thư mục Cố định:** Mỗi module giao diện nằm trong thư mục cô lập `src/app/(app)/[module-name]` (ví dụ: `dnf`, `hazards`, `inspections`).
- **Nghiêm cấm Khớp nối:** Tuyệt đối KHÔNG import trực tiếp các file Page/Component nội bộ của module này sang module khác.
- **Shared Components:** Chỉ các thành phần thuộc UI Kit (`src/components/ui/`) mới được dùng chung.

### 1.2 Giao Tiếp Không Khớp Nối (Decoupled Communication)
Tuyệt đối cấm chia sẻ State (Zustand/Redux) trực tiếp qua lại giữa 2 module khác nhau.
- **Tầng Client:** Sử dụng **Event Bus (CustomEvent)**:
  ```typescript
  // Trình phát sự kiện (MFE 1)
  window.dispatchEvent(new CustomEvent('hurc:dnf-created', { detail: { id: 'DNF-001' } }));
  ```
- **Tầng Server:** Sử dụng Server Actions cô lập tại `src/lib/actions/[module-name].ts`.

---

## 2. QUY TẮC VIẾT MÃ CHO AI AGENT (VIBE CODE GUIDELINES)

Trong bối cảnh AI (Vibe Code) tham gia sâu vào việc sinh mã, cần áp đặt các giới hạn cứng để hệ thống không phình to (bloated):

### 2.1 Quy Tắc Cô Lập Trạng Thái (Component Isolation)
- **Độ Dài File:** Bất kỳ Component nào vượt quá **300 dòng mã** đều phải được tái cấu trúc (Refactor). Chia nhỏ thành các Component con hoặc đẩy logic ra ngoài.
- **Custom Hooks:** Mọi logic fetch API, validate dữ liệu (Zod), và quản lý state phức tạp bắt buộc phải nằm trong Custom Hooks (ví dụ `useDnfForm.ts`), tách biệt hoàn toàn khỏi mã JSX.

### 2.2 Quy Tắc Giao Diện Nhất Quán (Design Token Integrity)
Để duy trì tính thẩm mỹ và dễ bảo trì:
- **Cấm Hardcode màu sắc:** Tuyệt đối không dùng các mã HEX ngẫu nhiên (như `bg-[#29ABE2]`). Bắt buộc dùng Token từ `tailwind.config.ts`.
- **Hệ màu chuẩn:**
  - *Màu chính (Primary):* Sắc xanh Cyan/Lam truyền tải công nghệ, tin cậy.
  - *Màu nhấn (Accent):* Sắc cam cảnh báo (#F26419) dùng cho các nút Hành động quan trọng hoặc Cảnh báo rủi ro (Hazards).
  - *Màu nền (Background):* Tông xám đậm/trong suốt (Glassmorphism) trên giao diện Dark Mode.
- **Typography:** Phông chữ `Inter` (sans-serif) được sử dụng nhất quán toàn hệ thống.

---

## 3. UI/UX GUIDELINES VÀ CẢM QUAN (LOOK & FEEL)

### 3.1 Bố cục và Thẩm mỹ
- **Lưới (Grid Layout):** Sử dụng thiết kế Responsive Grid cho mọi Dashboard, đảm bảo không xô lệch trên các kích thước màn hình.
- **Viền sáng (Glowing Borders) & Nhấp nháy:** Sử dụng các hiệu ứng thị giác thông minh để làm nổi bật dữ liệu. *Ví dụ: Các Đơn vị ảo (Virtual OUs) trên sơ đồ AD phải có viền sáng Cyan Futuristic kèm icon nhấp nháy đa tầng (Layers) để dễ phân biệt.*
- **Chuyển động (Micro-animations):** Tích hợp Transition mượt mà khi di chuột (Hover), mở Modal/Dialog, hoặc chuyển trang, giúp ứng dụng không bị cứng nhắc.

### 3.2 Hướng dẫn người dùng (UX)
- Mọi nút bấm hủy diệt (Xóa dữ liệu) bắt buộc phải có Prompt cảnh báo kép.
- **Alert Banners:** Dùng các khối Banner (Info, Warning) để nhắc nhở người dùng khi họ tương tác với dữ liệu nhạy cảm (như cố chỉnh sửa Virtual OU sẽ bị khóa nút và hiện cảnh báo).

> [!CAUTION]
> AI Agent phải tuân thủ nghiêm ngặt chuẩn mực UI này. Nếu giao diện trông giống một bảng dữ liệu Excel nhàm chán và thiếu các thành phần cảnh báo tinh tế, PR sẽ bị từ chối tự động.
