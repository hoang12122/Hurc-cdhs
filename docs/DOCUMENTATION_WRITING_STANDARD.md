# CHUẨN GHI TÀI LIỆU KỸ THUẬT HURC CDHS

**Mã tài liệu:** HURC-CDHS-DOC-STD  
**Tên tài liệu:** Chuẩn ghi tài liệu kỹ thuật  
**Phạm vi áp dụng:** Toàn bộ thư mục `/docs` và các báo cáo kỹ thuật liên quan  
**Mục tiêu:** Bảo đảm tài liệu được viết thống nhất, rõ ràng, dễ kiểm tra và không pha trộn nhiều phong cách trong cùng một file.

---

## 1. Nguyên tắc chung

Tất cả tài liệu kỹ thuật trong dự án phải tuân thủ một chuẩn ghi thống nhất:

```text
Mục tiêu
→ Phạm vi
→ Kết luận / nhận định chính
→ Mô tả hiện trạng
→ Giới hạn / rủi ro
→ Kiểm soát / việc cần làm
→ Checklist kiểm tra
→ Kết luận
```

Không viết tài liệu theo kiểu phần đầu là báo cáo quản lý, phần giữa là ghi chú kỹ thuật, phần cuối là checklist rời rạc nếu không có cấu trúc liên kết rõ ràng.

---

## 2. Cấu trúc chuẩn cho tài liệu cấp hệ thống

Áp dụng cho các file như:

```text
0_SOFTWARE_LIFECYCLE_MANUAL.md
1_SYSTEM_ARCHITECTURE.md
2_DESIGN_AND_CODING_RULES.md
3_DEVELOPER_GUIDE.md
4_DEPLOYMENT_AND_OPS.md
5_ADMIN_USER_GUIDE.md
6_MODULES_AND_FEATURES.md
```

Cấu trúc khuyến nghị:

```text
1. Mục tiêu tài liệu
2. Phạm vi áp dụng
3. Kết luận / nguyên tắc chính
4. Hiện trạng kỹ thuật
5. Thành phần hoặc quy trình chính
6. Giới hạn / rủi ro
7. Kiểm soát / việc cần làm
8. Checklist kiểm tra
9. Kết luận
```

---

## 3. Cấu trúc chuẩn cho từng mục kỹ thuật

Trong mỗi mục kỹ thuật, sử dụng cùng một mẫu:

```text
Mô tả
Hiện trạng
Giới hạn
Kiểm soát / việc cần làm
```

Ví dụ:

```text
## Service Bus

### Mô tả
Trình bày Service Bus là gì và dùng để làm gì.

### Hiện trạng
Nêu file triển khai, event đã có, helper đã có.

### Giới hạn
Nêu rõ đây là client runtime event bus, không thay thế message broker/backend workflow.

### Kiểm soát / việc cần làm
Nêu việc cần test, audit hoặc nâng cấp.
```

---

## 4. Quy ước cách viết

### 4.1. Cách ghi trạng thái

Dùng các trạng thái thống nhất sau:

| Trạng thái | Ý nghĩa |
|---|---|
| Đã có | Đã có trong mã nguồn hoặc tài liệu. |
| Đang hoàn thiện | Đã có nền tảng nhưng chưa hoàn chỉnh. |
| Chưa có | Chưa triển khai. |
| Cần kiểm chứng | Cần xác nhận bằng build, test, dữ liệu thật hoặc vận hành thực tế. |
| Không áp dụng | Không thuộc phạm vi hiện tại. |

Không dùng lẫn lộn các cách ghi như “OK”, “done”, “pass”, “được rồi”, “có vẻ ổn” trong tài liệu chính thức.

### 4.2. Cách ghi rủi ro

Mỗi rủi ro nên có đủ 04 trường:

```text
Rủi ro
Hiện trạng
Mức ưu tiên
Việc cần làm
```

Mức ưu tiên thống nhất:

```text
Cao
Trung bình
Thấp
```

### 4.3. Cách ghi checklist

Checklist phải là điều kiện kiểm tra được, không viết chung chung.

Nên viết:

```text
- `npm run typecheck` pass.
- `npm run lint` pass.
- Route `/fracas-risk-management` smoke test pass.
```

Không nên viết:

```text
- Kiểm tra cho ổn.
- Chạy thử thấy được.
- Không lỗi nhiều.
```

---

## 5. Quy ước bảng

Bảng nên dùng khi cần so sánh trạng thái, rủi ro, trách nhiệm hoặc checklist. Các cột khuyến nghị:

```text
Nội dung | Hiện trạng | Giới hạn | Việc cần làm
```

hoặc:

```text
Nhóm rủi ro | Hiện trạng | Mức ưu tiên | Việc cần làm
```

Không dùng nhiều kiểu bảng khác nhau trong cùng một tài liệu nếu không cần thiết.

---

## 6. Quy ước dùng code block

Dùng code block cho:

- Đường dẫn file.
- Lệnh kiểm tra.
- Luồng dữ liệu.
- Event name.
- Route.

Ví dụ:

```text
src/lib/mfe/service-bus.ts
```

```bash
npm run typecheck
npm run lint
```

Không đặt đoạn văn dài vào code block nếu không phải lệnh, đường dẫn hoặc luồng kỹ thuật.

---

## 7. Quy ước kết luận

Mỗi tài liệu phải có phần kết luận. Kết luận cần trả lời 03 ý:

1. Hiện trạng chính là gì.
2. Giới hạn quan trọng nhất là gì.
3. Việc cần ưu tiên tiếp theo là gì.

Không kết luận quá mức năng lực thực tế. Nếu chưa có build/test/dữ liệu vận hành chứng minh thì ghi là “cần kiểm chứng”, không ghi là “đã sẵn sàng production”.

---

## 8. Áp dụng cho tài liệu hiện có

Tài liệu `docs/1_SYSTEM_ARCHITECTURE.md` đã được chuẩn hóa theo cấu trúc này. Các tài liệu còn lại trong `/docs` nên được rà soát dần theo cùng chuẩn để bảo đảm toàn bộ bộ tài liệu thống nhất về cách ghi.
