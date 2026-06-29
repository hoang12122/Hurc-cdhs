# TÀI LIỆU 2: QUY TẮC THIẾT KẾ VÀ VIẾT MÃ

## 0. Kết quả đối soát với phần mềm

Tài liệu này quy định cách thiết kế và viết mã để giữ HURC1 CRM nhẹ, rõ ràng, dễ bảo trì và hạn chế phình to. Sau khi đối soát với mã nguồn hiện tại, kết quả như sau:

| Nội dung đối soát | Trạng thái phần mềm | Cải thiện đã thực hiện |
|---|---|---|
| Giới hạn 300 dòng cho file .ts/.tsx | Một số file legacy còn nguy cơ vượt chuẩn | Đã thêm script kiểm tra kích thước file |
| Tách UI và logic | Một số component legacy còn trộn workflow logic | Đã tách workflow Inspection sang custom hook |
| Giao tiếp xuyên module | Đã có Service Bus và App Shell Bridge | Inspection tạo DNF đã có nút dùng Service Bus |
| Server Actions và Service Layer | Đã có nền kiến trúc phù hợp | Tiếp tục yêu cầu mọi nghiệp vụ ghi dữ liệu đi qua actions/services |
| UI token và dữ liệu demo | Đã có nhiều component dùng token, nhưng cần kiểm soát thêm | Bổ sung quy tắc ghi nhãn demo/needs-review/official |
| CI kiểm soát quy tắc | Trước đây chưa có | Đã thêm bước kiểm tra Design rules file-size boundary ở warning mode |
| Vibe Code audit | Trước đây chưa có phụ lục đối soát riêng | Đã bổ sung docs/2_DESIGN_AND_CODING_RULES_AUDIT.md |
| Traceability tài liệu -> phần mềm | Trước đây chưa có ma trận truy vết | Đã bổ sung docs/2_DESIGN_RULES_DOC_TO_CODE_TRACEABILITY.md |

## 1. Quy tắc 300 dòng

Bất kỳ file .ts hoặc .tsx nào vượt 300 dòng đều được xem là code smell. Với code mới hoặc file đang refactor, lập trình viên phải tách nhỏ trước khi merge.

Cách xử lý:

- Tách UI thành component con.
- Tách state, submit, workflow và side effect sang custom hook.
- Tách nghiệp vụ backend sang service layer.
- Tách schema, constants, mapper và helper ra file riêng.
- Không gom form, bảng, modal, submit handler và mapping dữ liệu vào cùng một component lớn.

Đã bổ sung công cụ kiểm tra:

- scripts/check-file-size-boundaries.js

Cách chạy kiểm tra nghiêm ngặt:

- node scripts/check-file-size-boundaries.js

Cách chạy kiểm tra cảnh báo trong giai đoạn còn legacy:

- node scripts/check-file-size-boundaries.js --warn

CI hiện chạy ở warning mode để không làm gãy master do các file cũ. Sau khi dọn xong legacy, chuyển CI sang chế độ nghiêm ngặt.

## 2. Quy tắc tách UI và logic

Component UI chỉ nên hiển thị giao diện và gọi handler đã được chuẩn hóa. Không đặt toàn bộ workflow nghiệp vụ trong component.

Luồng chuẩn:

- UI Component
- Custom Hook
- Server Action
- Service Layer
- Database

Đã cải thiện thực tế:

- Logic workflow của màn hình chi tiết Inspection đã được tách sang src/components/inspections/use-inspection-detail-workflow.ts.
- UI chính nằm tại src/components/inspections/inspection-detail-client.tsx.
- Nút tạo DNF từ phát hiện dùng src/components/inspections/create-dnf-from-finding-event-button.tsx.
- Luồng tạo DNF từ Inspection hiện đi qua Service Bus thay vì link thủ công.

## 3. Quy tắc Server Actions và Service Layer

Các thao tác ghi dữ liệu, đổi trạng thái, đồng bộ hoặc phê duyệt không được xử lý trực tiếp trong component UI.

Bắt buộc đi qua:

- src/lib/actions/*.actions.ts
- src/lib/services/*.ts

Server Action chịu trách nhiệm kiểm tra quyền, chuẩn hóa input và gọi service. Service Layer chịu trách nhiệm nghiệp vụ, truy cập database và tái sử dụng cho UI, script hoặc job.

## 4. Quy tắc UI token và dữ liệu

Không hardcode màu tùy tiện. Ưu tiên dùng các token và class đã chuẩn hóa như bg-primary, bg-accent, bg-destructive, bg-muted, text-muted-foreground và border-border.

Các dữ liệu GIS/BIM, Google Maps, Digital Twin và Incident Learning phải phân biệt rõ trạng thái:

- demo
- needs-review
- official

Không trình bày dữ liệu demo như dữ liệu vận hành chính thức.

## 5. Quy tắc bảo vệ người dùng

- Thao tác xóa, hủy, reject, archive hoặc chuyển trạng thái quan trọng phải có xác nhận.
- Màn hình chỉ đọc cần có cảnh báo trạng thái rõ ràng.
- AI Lab, Incident Learning và Digital Twin chỉ đưa ra gợi ý tham khảo, không thay thế kiểm tra hiện trường, log, tài liệu O&M và phê duyệt an toàn.

## 6. Điểm mạnh hiện tại

1. Đã có Server Actions và Service Layer.
2. Đã có Service Bus để giảm phụ thuộc giữa Inspection, DNF, Asset 360 và AI Lab.
3. Đã có Incident Memory, sync service và approval service.
4. Đã có Docker/CI acceptance gate, Prisma validate/generate, CodeQL và smoke test.
5. Đã bắt đầu refactor component lớn bằng custom hook và component con.

## 7. Điểm yếu còn lại

1. Một số file legacy có thể vẫn vượt 300 dòng.
2. CI mới chạy file-size audit ở warning mode.
3. Chưa có import-boundary checker để kiểm soát module import trực tiếp lẫn nhau.
4. Chưa có UI đầy đủ cho Incident Memory approval.
5. Một số màn hình cần tiếp tục tách hook/UI để tuân thủ Vibe Code triệt để hơn.
6. Các kiểm tra Vibe Code mới đang ở phụ lục audit và warning mode.
7. Ma trận traceability đã có nhưng chưa có script hard-check tự động vì cần tránh làm gãy master trong giai đoạn legacy.

## 8. Lộ trình cải thiện

P0 - Không tăng nợ kỹ thuật:

- File mới hoặc file đang refactor không vượt 300 dòng.
- Không thêm logic backend trực tiếp vào component UI.
- Không thêm màu hardcode.

P1 - Dọn legacy:

- Chạy node scripts/check-file-size-boundaries.js --warn để lấy danh sách file vượt chuẩn.
- Chạy node scripts/check-vibe-code-rules.js --warn để lấy danh sách cảnh báo Vibe Code.
- Ưu tiên refactor các file UI lớn trong src/components và src/app.
- Mỗi lần refactor phải tách hook/service trước, UI sau.

P2 - Chuyển CI sang kiểm tra nghiêm ngặt:

- Sau khi xử lý legacy, đổi CI từ warning mode sang chế độ nghiêm ngặt.

P3 - Boundary test:

- Bổ sung checker để kiểm soát import giữa các module.
- Giao tiếp xuyên module phải đi qua Service Bus hoặc public API.
- Nghiệp vụ backend phải đi qua Server Action và Service Layer.

## 9. Checklist review PR

Trước khi merge, cần kiểm tra:

- File .ts/.tsx mới có dưới 300 dòng không.
- Component UI có xử lý backend trực tiếp không.
- Logic form đã tách sang custom hook chưa.
- Nghiệp vụ ghi dữ liệu có đi qua Server Action không.
- Có hardcode màu tùy tiện không.
- Thao tác xóa/hủy có confirm dialog không.
- Dữ liệu demo đã được gắn nhãn rõ chưa.
- AI output có cảnh báo không thay thế phê duyệt kỹ thuật chưa.
