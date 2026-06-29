# PHỤ LỤC ĐỐI SOÁT TÀI LIỆU 2 - DESIGN RULES AUDIT

## 1. Mục tiêu

Phụ lục này đối soát giữa Tài liệu 2 và mã nguồn hiện tại. Mục tiêu là chuyển các quy tắc thiết kế từ mức khuyến nghị sang mức có thể kiểm tra trong CI.

## 2. Điểm mạnh đã có

- Hệ thống đã có Server Actions và Service Layer.
- Hệ thống đã có Service Bus và App Shell Bridge.
- Luồng Inspection tạo DNF đã dùng nút Service Bus.
- Màn hình Inspection đã được tách workflow logic sang custom hook.
- CI đã có typecheck, lint, Prisma validate/generate, build, smoke test và CodeQL.
- Đã có script kiểm tra giới hạn 300 dòng.

## 3. Điểm yếu phát hiện

- Tài liệu 2 trước đây mới kiểm soát rõ giới hạn 300 dòng, chưa kiểm soát đủ các quy tắc Vibe Code khác.
- Một số file legacy vẫn có thể vượt chuẩn.
- Một số quy tắc như màu hardcode, browser event rời rạc hoặc xử lý backend trong UI cần có công cụ cảnh báo.
- CI đang chạy ở warning mode để tránh làm gãy nhánh master do nợ kỹ thuật cũ.
- Chưa có import-boundary checker giữa các module.

## 4. Cải thiện đã bổ sung

Đã thêm script:

```text
scripts/check-vibe-code-rules.js
```

Script này cảnh báo các nhóm rủi ro:

- UI/client file xử lý gọi dữ liệu không qua lớp chuẩn hóa.
- Màu hex hoặc arbitrary color không theo token.
- Browser event không đi qua Service Bus.
- UI file còn chứa workflow cần cân nhắc tách sang custom hook.

Đã thêm vào CI bước:

```text
Vibe Code rules audit
```

Bước này hiện chạy ở warning mode:

```text
node scripts/check-vibe-code-rules.js --warn
```

## 5. Lộ trình nâng cấp

### Giai đoạn 1 - Audit mềm

- Giữ warning mode để thu thập danh sách vi phạm legacy.
- Không cho file mới làm tăng nợ kỹ thuật.
- Ưu tiên refactor các màn hình lớn trong `src/components` và `src/app`.

### Giai đoạn 2 - Dọn legacy

- Tách file vượt 300 dòng.
- Tách workflow logic sang custom hook.
- Tách nghiệp vụ backend sang service.
- Thay browser event rời rạc bằng Service Bus.
- Thay màu hardcode bằng token.

### Giai đoạn 3 - Hard gate

Sau khi danh sách legacy đã được xử lý, đổi CI từ warning mode sang strict mode cho:

```text
scripts/check-file-size-boundaries.js
scripts/check-vibe-code-rules.js
```

## 6. Kết luận

Tài liệu 2 đã có nền quy tắc tốt, nhưng điểm yếu là thiếu cơ chế kiểm soát tự động ngoài giới hạn 300 dòng. Phần mềm đã được bổ sung thêm Vibe Code audit để kiểm tra sớm các rủi ro về UI/logic, màu sắc, event bus và workflow trong component.
