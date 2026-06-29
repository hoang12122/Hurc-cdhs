# TÀI LIỆU 2: QUY TẮC THIẾT KẾ VÀ VIẾT MÃ

## 0. Kết quả đối soát với phần mềm

Tài liệu này quy định cách thiết kế và viết mã để giữ HURC1 CRM nhẹ, rõ ràng, dễ bảo trì và hạn chế phình to. Sau khi đối soát với mã nguồn hiện tại, kết quả như sau:

| Nội dung đối soát | Trạng thái phần mềm | Cải thiện đã thực hiện |
|---|---|---|
| Giới hạn 300 dòng cho file .ts/.tsx | Một số file legacy còn nguy cơ vượt chuẩn | Có audit toàn repo và gate nghiêm ngặt cho file vừa thay đổi |
| Tách UI và logic | Một số component legacy còn trộn workflow logic | Đã tách workflow Inspection sang custom hook |
| Giao tiếp xuyên module | Đã có Service Bus và App Shell Bridge | Inspection tạo DNF đã có nút dùng Service Bus |
| Server Actions và Service Layer | Đã có nền kiến trúc phù hợp | Tiếp tục yêu cầu mọi nghiệp vụ ghi dữ liệu đi qua actions/services |
| UI token và dữ liệu demo | Đã có nhiều component dùng token, nhưng cần kiểm soát thêm | Có Vibe Code audit cảnh báo màu hardcode và event rời rạc |
| CI kiểm soát quy tắc | Trước đây mới cảnh báo một phần | Đã thêm changed-file boundary gate và module-boundary audit |
| Incident Memory approval | Trước đây mới có service/action | Đã bổ sung giao diện phê duyệt tại /ai-lab/incident-memory |
| Traceability tài liệu -> phần mềm | Trước đây chưa có ma trận truy vết | Đã bổ sung docs/2_DESIGN_RULES_DOC_TO_CODE_TRACEABILITY.md |

## 1. Quy tắc 300 dòng

Bất kỳ file .ts hoặc .tsx nào vượt 300 dòng đều được xem là code smell. Với code mới hoặc file đang refactor, lập trình viên phải tách nhỏ trước khi merge.

Cách xử lý:

- Tách UI thành component con.
- Tách state, submit, workflow và side effect sang custom hook.
- Tách nghiệp vụ backend sang service layer.
- Tách schema, constants, mapper và helper ra file riêng.
- Không gom form, bảng, modal, submit handler và mapping dữ liệu vào cùng một component lớn.

Công cụ hiện có:

- scripts/check-file-size-boundaries.js: audit toàn repo ở warning mode.
- scripts/check-changed-file-size-boundaries.js: kiểm tra nghiêm ngặt file vừa thay đổi.

CI hiện vừa cảnh báo nợ kỹ thuật legacy, vừa chặn file mới hoặc file vừa refactor nếu vượt giới hạn thiết kế.

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

## 4. Quy tắc UI token, Service Bus và module boundary

Không hardcode màu tùy tiện. Ưu tiên dùng các token và class đã chuẩn hóa như bg-primary, bg-accent, bg-destructive, bg-muted, text-muted-foreground và border-border.

Giao tiếp xuyên module phải đi qua Service Bus, App Shell Bridge hoặc public service contract. Đã bổ sung:

- scripts/check-vibe-code-rules.js;
- scripts/audit-module-boundaries.js.

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
3. Đã có Incident Memory, sync service, approval service và UI phê duyệt.
4. Đã có Docker/CI acceptance gate, Prisma validate/generate, CodeQL và smoke test.
5. Đã có audit 300 dòng, gate file vừa thay đổi, Vibe Code audit và module-boundary audit.
6. Đã bắt đầu refactor component lớn bằng custom hook và component con.

## 7. Điểm yếu còn lại sau cải thiện

1. Một số file legacy vẫn có thể vượt 300 dòng, nhưng không cho phép file mới hoặc file vừa sửa tiếp tục vượt chuẩn.
2. File-size audit toàn repo còn ở warning mode; changed-file boundary gate đã chạy nghiêm ngặt.
3. Module-boundary audit đã có nhưng đang ở mức cảnh báo để tránh false positive với legacy.
4. Incident Memory đã có UI phê duyệt cơ bản; cần bổ sung phân quyền riêng và audit log khi đổi trạng thái.
5. Một số màn hình legacy vẫn cần tiếp tục tách hook/UI.
6. Vibe Code audit còn ở warning mode để gom danh sách nợ kỹ thuật trước khi bật strict mode.
7. Ma trận traceability đã có; script hard-check traceability vẫn để ở giai đoạn sau vì cần ổn định bằng chứng và tránh false positive.

## 8. Lộ trình cải thiện

P0 - Không tăng nợ kỹ thuật:

- File mới hoặc file đang refactor không vượt 300 dòng.
- Không thêm logic backend trực tiếp vào component UI.
- Không thêm màu hardcode.
- Không thêm import chéo module nếu chưa có public contract.

P1 - Dọn legacy:

- Chạy node scripts/check-file-size-boundaries.js --warn.
- Chạy node scripts/check-vibe-code-rules.js --warn.
- Chạy node scripts/audit-module-boundaries.js.
- Ưu tiên refactor các file UI lớn trong src/components và src/app.

P2 - Chuyển CI sang kiểm tra nghiêm ngặt hơn:

- Sau khi xử lý legacy, đổi file-size audit toàn repo và Vibe Code audit từ warning mode sang strict mode.
- Bổ sung import-boundary checker có whitelist chính thức.

P3 - Hoàn thiện quản trị thiết kế:

- Bổ sung quyền riêng cho Incident Memory approval.
- Bổ sung audit log khi verify/reject Incident Memory.
- Bổ sung traceability hard-check khi ma trận bằng chứng đã ổn định.

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
