# TÀI LIỆU 2: QUY TẮC THIẾT KẾ VÀ VIẾT MÃ (DESIGN & CODING RULES)

Tài liệu này không chỉ là lý thuyết, nó chứa các giới hạn vật lý (Hard limits) và tiêu chuẩn Vibe Code buộc tất cả lập trình viên và các AI Agent phải tuân thủ nghiêm ngặt để giữ cho **HURC1 CRM** nhẹ, đẹp và không bị "phình to" (Bloated).

---

## 1. QUY TẮC VÀNG VỀ COMPONENT (COMPONENT ISOLATION)

### 1.1 Giới hạn độ dài tuyệt đối (The 300-Line Limit)
- **Quy tắc:** Bất kỳ file `.tsx` hoặc `.ts` nào vượt quá **300 dòng mã** đều được coi là một "Mùi mã xấu" (Code Smell) và PR (Pull Request) sẽ bị reject tự động.
- **Cách giải quyết:** Chia nhỏ (Split) giao diện thành các Sub-components, và tách toàn bộ logic xử lý ra một file Custom Hook riêng biệt.

### 1.2 Thực hành Vibe Code chuẩn mực
Dưới đây là một ví dụ minh họa cách viết Form tạo DNF tuân thủ 100% Vibe Code:

**❌ Sai (Bad Practice - Trộn lẫn UI và Logic):**
```tsx
// Không nên viết như thế này: Dài dòng, khó test, khó đọc.
export default function DnfForm() {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/dnf', { method: 'POST', body: ... }); // Vi phạm: Gọi trực tiếp API trong Component
    setLoading(false);
  }
  return <form onSubmit={handleSubmit}>...</form>
}
```

**✅ Đúng (Best Practice - Tách biệt UI và Logic qua Custom Hook):**
```tsx
// File: useDnfForm.ts (Chỉ chứa Logic)
export const useDnfForm = () => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof DnfSchema>>({ ... });

  const onSubmit = (data) => {
    startTransition(async () => {
      const res = await createDnfAction(data); // Phải dùng Server Actions
      if (res.success) toast.success("Đã tạo DNF!");
    });
  };
  return { form, isPending, onSubmit };
};

// File: dnf-form.tsx (Chỉ chứa UI)
export function DnfForm() {
  const { form, isPending, onSubmit } = useDnfForm();
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Chỉ code UI ở đây */}
      </form>
    </Form>
  );
}
```

---

## 2. QUY TẮC MỸ THUẬT VÀ UI TOKENS (LOOK & FEEL)

Hệ thống yêu cầu một giao diện **Cao cấp (Premium), Hiện đại (Futuristic)** mang hơi hướng công nghiệp đường sắt nhưng không khô khan.

### 2.1 Cấm Hardcode Màu sắc (No Random Hex Codes)
Tuyệt đối KHÔNG dùng các mã màu inline như `style={{ backgroundColor: '#29ABE2' }}` hay Tailwind tùy tiện như `bg-[#29ABE2]`. Bạn bắt buộc phải dùng biến màu (Tokens) đã khai báo sẵn trong `tailwind.config.ts`.

**Bảng mã màu chuẩn:**
- `bg-primary` (Lam Cyan): Dùng cho nút Submit chính, thanh điều hướng. Trọng tâm của nhận diện thương hiệu HURC.
- `bg-accent` / `text-orange-500` (Cam nhạt): Dùng cho các con số KPIs cần nổi bật, cảnh báo Mối nguy (Hazards) mức Medium.
- `bg-destructive` (Đỏ sậm): Dùng cho nút Xóa, Mối nguy Critical.
- `bg-muted` (Xám trong suốt): Dùng làm nền thẻ (Card) trong giao diện Dark Mode (Glassmorphism).

### 2.2 Hiệu ứng Thị giác (Micro-Animations & Visual Cues)
Giao diện không được "chết đứng" (Static). Nó phải phản hồi mọi tương tác của người dùng.
- **Hover Effects:** Mọi Button, Card, Row trong Table đều phải đổi màu nền nhẹ hoặc nhô lên khi trỏ chuột: `hover:bg-accent hover:shadow-md transition-all duration-200`.
- **Glowing Borders (Viền phát sáng):** Được sử dụng để nhấn mạnh các yếu tố Ảo (Virtual).
  *Ví dụ: Code tạo một thẻ OU Ảo (Virtual OU) trên sơ đồ AD:*
  ```tsx
  <div className="relative border border-cyan-500/50 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] rounded-lg p-4 animate-pulse">
    <Layers className="text-cyan-400 absolute top-2 right-2 h-4 w-4" />
    <p>Virtual Station OU</p>
  </div>
  ```

### 2.3 Bảo vệ Người dùng (User Protections)
- **Double-Check Destructive Actions:** Bất kỳ thao tác xóa/hủy nào cũng phải được bọc trong một `AlertDialog` của Radix UI (Yêu cầu confirm 2 bước).
- **Banner Cảnh báo (Alerts):** Khi người dùng xem một DNF đã bị đóng (Closed), phải có một khối Alert (Vàng/Xanh) ở đầu trang nhắc nhở: *"Sự cố này đã được khắc phục. Chế độ xem chỉ đọc."*
