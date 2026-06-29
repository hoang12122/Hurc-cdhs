# MA TRẬN ĐỐI CHIẾU TỪ TÀI LIỆU 2 SANG PHẦN MỀM

## 1. Mục tiêu

Tài liệu này đối chiếu theo chiều từ quy tắc thiết kế trong Tài liệu 2 sang bằng chứng hiện có trong phần mềm. Mục tiêu là biết rõ quy tắc nào đã có code/CI kiểm soát, quy tắc nào mới dừng ở tài liệu và quy tắc nào còn cần nâng cấp.

## 2. Ma trận traceability

| Quy tắc trong Tài liệu 2 | Bằng chứng trong phần mềm | Mức đáp ứng | Việc còn lại |
|---|---|---|---|
| File .ts/.tsx không vượt 300 dòng | `scripts/check-file-size-boundaries.js`; CI có bước Design rules file-size boundary | Đáp ứng một phần | CI còn chạy `--warn`, cần dọn legacy rồi bật strict mode |
| Tách UI và logic qua custom hook | `src/components/inspections/use-inspection-detail-workflow.ts`; `inspection-detail-client.tsx` đã gọn hơn | Đáp ứng một phần | Cần tiếp tục áp dụng cho các màn hình legacy khác |
| Không xử lý backend trực tiếp trong UI | `scripts/check-vibe-code-rules.js` cảnh báo UI/client gọi `fetch()` trực tiếp | Đáp ứng một phần | Cần chuyển cảnh báo thành hard gate sau khi xử lý legacy |
| Nghiệp vụ ghi dữ liệu đi qua Server Action và Service Layer | `src/lib/actions/*`; `src/lib/services/*`; Incident Learning và Incident Memory đã đi qua action/service | Đáp ứng tốt | Cần tiếp tục kiểm tra các module cũ |
| Giao tiếp xuyên module đi qua Service Bus | `src/lib/mfe/service-bus.ts`; `cross-module-service-bus-bridge.tsx`; `CreateDnfFromFindingEventButton` | Đáp ứng tốt cho các luồng đã nối | Cần nối tiếp các event còn lại nếu UI phát sinh nhu cầu |
| Không dùng browser event rời rạc | `scripts/check-vibe-code-rules.js` cảnh báo `window.dispatchEvent`/`CustomEvent` ngoài Service Bus | Đáp ứng một phần | CI còn warning mode |
| Không hardcode màu tùy tiện | `scripts/check-vibe-code-rules.js` cảnh báo hex/arbitrary color | Đáp ứng một phần | Cần kiểm soát dần legacy UI |
| Dữ liệu demo phải gắn nhãn | `docs/official_gis_google_maps_data_governance.md`; `location-governance.ts` | Đáp ứng ở mức nền | Cần nối nhãn vào toàn bộ UI GIS/BIM/Google Maps |
| Thao tác nguy hiểm phải xác nhận | Quy tắc đã có trong docs | Chưa đủ guard tự động | Cần bổ sung checklist hoặc static rule cho delete/archive/reject |
| AI không thay thế phê duyệt kỹ thuật | AI Lab/Incident Learning có cảnh báo trong tài liệu và kết quả trả lời | Đáp ứng một phần | Cần kiểm thử UI để bảo đảm cảnh báo luôn hiển thị |
| Import boundary giữa module | Mới có `module-registry.ts` và kế hoạch MFE-ready | Chưa đủ | Cần thêm checker kiểm soát import chéo module |

## 3. Cải thiện bổ sung sau đối chiếu

Đã thêm script traceability:

```text
scripts/check-design-rules-traceability.js
```

Script này kiểm tra sự tồn tại của các bằng chứng bắt buộc:

- Tài liệu 2;
- phụ lục audit;
- ma trận traceability;
- file-size checker;
- Vibe Code checker;
- Service Bus;
- App Shell Bridge;
- module registry;
- hook workflow Inspection;
- component tạo DNF qua Service Bus;
- workflow CI có đủ các bước audit.

## 4. Kết luận

Tài liệu 2 không còn chỉ là văn bản mô tả. Các quy tắc chính đã bắt đầu có bằng chứng trong code hoặc CI. Tuy nhiên, để đạt mức kiểm soát chặt, cần tiếp tục dọn legacy và chuyển các bước audit từ warning mode sang strict mode.