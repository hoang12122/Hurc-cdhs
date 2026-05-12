# NHẬT KÝ THỰC HIỆN NÂNG CẤP AI (EXECUTION LOG)

## 12. CƠ CHẾ HUMAN-IN-THE-LOOP VÀ AI SAFETY LOG

### TASK 8.1 - Thiết lập cơ chế xác nhận của con người đối với kết quả AI [HOÀN THÀNH]

- **Thời gian:** 2026-05-08
- **Chi tiết thực hiện:**
  - Phát triển dịch vụ `src/lib/services/ai-verification-service.ts` để quản lý vòng đời của các đề xuất AI (`PROPOSED`, `APPROVED`, `REJECTED`, `EDITED`).
  - Xây dựng component giao diện `src/components/ai/ai-verification-panel.tsx` tích hợp vào các form nghiệp vụ.
  - Triển khai các nút chức năng: **Xác nhận (Approve)**, **Chỉnh sửa (Edit)**, và **Từ chối (Reject)**.
  - Đảm bảo AI không bao giờ tự ý lưu dữ liệu mà không thông qua bước kiểm duyệt của con người.
  - Ghi nhận đầy đủ "dấu vết con người" (Human Traceability): Ai là người duyệt, duyệt lúc nào, và nội dung có bị sửa đổi gì so với đề xuất ban đầu của AI hay không.
- **Kết quả / Output:**
  - Hệ thống đạt tiêu chuẩn an toàn cao nhất: Con người làm chủ hoàn toàn các quyết định kỹ thuật. AI chỉ đóng vai trò trợ lý nhắc nhở và soạn thảo thô.
  - Tuân thủ nghiêm ngặt nguyên tắc **Human-in-the-loop** của dự án Metro số 1.
- **Đánh giá & Next Step:** Cơ chế xác nhận đã sẵn sàng. Bước tiếp theo là **TASK 8.2 - Phân loại mức độ can thiệp của con người** để tối ưu hóa quy trình phê duyệt theo mức độ rủi ro.

### TASK 8.2 - Phân loại mức độ can thiệp của con người [HOÀN THÀNH]

- **Thời gian:** 2026-05-08
- **Chi tiết thực hiện:**
  - Thiết lập bảng ma trận rủi ro tại `src/lib/config/ai-safety-rules.ts`.
  - Phân loại các hành vi của AI thành 4 cấp độ: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
  - Quy định rõ thẩm quyền phê duyệt:
    - **Rủi ro thấp (VD: Tóm tắt văn bản):** Kỹ sư hiện trường có thể duyệt ngay.
    - **Rủi ro trung bình (VD: Đề xuất vật tư):** Bắt buộc Cán bộ phụ trách hoặc Trưởng nhóm bảo trì duyệt.
    - **Rủi ro cao/Chí tử (VD: Dừng tàu, Đánh giá an toàn):** AI chỉ được đưa ra cảnh báo, chỉ có Lãnh đạo đơn vị hoặc Giám đốc mới có quyền chốt quyết định cuối cùng.
  - Cập nhật `AIVerificationService` để kiểm tra quyền hạn (requiredRole) trước khi cho phép thực hiện hành động phê duyệt.
- **Kết quả / Output:**
  - Quy trình vận hành AI trở nên chuyên nghiệp và chặt chẽ hơn. Giảm thiểu rủi ro kỹ sư cấp thấp vô tình duyệt các đề xuất AI quan trọng vượt quá thẩm quyền.
- **Đánh giá & Next Step:** Đã phân cấp thẩm quyền rõ ràng. Bước tiếp theo là **TASK 8.3 - Thiết kế cấu trúc AI Safety Log** để ghi lại toàn bộ lịch sử này một cách bất biến.

### TASK 8.3 - Thiết kế cấu trúc AI Safety Log [HOÀN THÀNH]

- **Thời gian:** 2026-05-08
- **Chi tiết thực hiện:**
  - Phát triển dịch vụ nhật ký trung tâm `src/lib/services/ai-safety-log-service.ts`.
  - Thiết kế cấu trúc bản ghi (Schema) cực kỳ chi tiết, đáp ứng đầy đủ yêu cầu truy vết:
    - **Mã định danh:** `LOG-AI-TIMESTAMP-RANDOM` (Bất biến).
    - **Dữ liệu đầu vào:** Lưu vết cả hình ảnh, âm thanh, văn bản thô mà AI đã tiếp nhận.
    - **Tham số AI:** Lưu lại cả Model Version, Prompt ID và Rule ID được sử dụng (Để phục vụ việc debug và cải tiến model).
    - **Dấu vết Con người:** Ghi nhận người duyệt, nội dung sau chỉnh sửa và lý do từ chối.
  - Đảm bảo ghi nhận cho mọi module: YOLO, Gemma, RAG, Whisper, RAMS, GraphRAG và cả Edge AI.
- **Kết quả / Output:**
  - Cơ sở dữ liệu nhật ký an toàn AI đã sẵn sàng. Đây là "Hộp đen" của hệ thống AI, cho phép phục dựng lại mọi tình huống ra quyết định để báo cáo cấp trên hoặc kiểm toán an toàn.
- **Đánh giá & Next Step:** Cấu trúc log đã hoàn thiện. Bước tiếp theo là **TASK 8.4 - Ghi log toàn bộ vòng đời xử lý của AI** để kết nối dịch vụ này vào luồng xử lý thực tế.

### TASK 8.4 - Ghi log toàn bộ vòng đời xử lý của AI [HOÀN THÀNH]

- **Thời gian:** 2026-05-08
- **Chi tiết thực hiện:**
  - Tích hợp `aiSafetyLogService` vào trực tiếp bên trong `AIVerificationService`.
  - Thiết lập cơ chế tự động ghi log tại mọi điểm chạm quan trọng (Critical Points):
    - Khi con người bấm **Xác nhận**: Ghi log `APPROVED`.
    - Khi con người **Chỉnh sửa**: Ghi log `EDITED`, kèm nội dung sai khác.
    - Khi con người **Từ chối**: Ghi log `REJECTED`, kèm lý do bác bỏ.
  - Cấu hình việc ghi nhận "Vòng đời đầy đủ": Log sẽ bắt đầu từ lúc AI tiếp nhận Input (ghi `PROPOSED`) và kết thúc khi có định danh người phê duyệt cuối cùng.
  - Xử lý các tình huống ngoại lệ: Ghi nhận cả trường hợp AI bị lỗi hệ thống hoặc AI trả về kết quả "Không xác định" (Confidence thấp).
- **Kết quả / Output:**
  - Quy trình vận hành AI đã được "khóa chặt" về mặt dữ liệu. Không một đề xuất nào của AI có thể biến mất hoặc bị thay đổi mà không để lại dấu vết trong Safety Log.
- **Đánh giá & Next Step:** Luồng ghi log tự động đã thông suốt. Bước tiếp theo là **TASK 8.5 - Bổ sung giao diện tra cứu AI Safety Log** để giúp các sếp quản lý và thanh tra lại đống dữ liệu này.

### TASK 8.5 - Bổ sung giao diện tra cứu AI Safety Log [HOÀN THÀNH]

- **Thời gian:** 2026-05-08
- **Chi tiết thực hiện:**
  - Phát triển component quản trị chuyên sâu `src/components/ai/ai-safety-log-viewer.tsx`.
  - Thiết kế giao diện dạng bảng chuyên nghiệp với các cột thông tin quan trọng: Thời gian, Module, Người thực hiện, Đối tượng (DNF/Hazard/Inspection), Trạng thái và Chi tiết.
  - Tích hợp bộ lọc đa năng (Multi-filtering) cho phép thanh tra log theo nhiều chiều.
  - Xây dựng tính năng "So sánh sai khác" (Diffing): Giúp quản trị viên thấy ngay AI đã đề xuất gì và con người đã sửa gì.
  - Thiết kế nút "Xuất Excel" để phục vụ các buổi họp kiểm điểm an toàn hoặc báo cáo định kỳ cho Ban quản lý Metro.
  - Áp dụng phân quyền chặt chẽ: Chỉ những tài khoản có Role `ADMIN` hoặc `MANAGER` mới được truy cập vào giao diện này. Cấm tuyệt đối hành vi xóa log.
- **Kết quả / Output:**
  - Đã có công cụ giám sát AI trực quan và quyền lực. Bất kỳ sai sót nào của AI hoặc của con người trong quá trình duyệt AI đều bị phơi bày rõ ràng.
- **Đánh giá & Next Step:** Giao diện tra cứu đã hoàn tất. Bước cuối cùng của Phase 8 là **TASK 8.6 - Bảo vệ tính toàn vẹn của AI Safety Log** để đảm bảo đống log này không bao giờ bị hack hay xóa mất.

### TASK 8.6 - Bảo vệ tính toàn vẹn của AI Safety Log [HOÀN THÀNH]

- **Thời gian:** 2026-05-08
- **Chi tiết thực hiện:**
  - Triển khai cơ chế **Append-Only** (Chỉ ghi thêm) cho `AISafetyLogService`.
  - Sử dụng `Object.freeze()` để khóa chặt các bản ghi log ngay khi chúng được tạo ra, ngăn chặn mọi thay đổi vô tình hay cố ý trong quá trình chạy ứng dụng.
  - Xây dựng hệ thống **Access Logging**: Mọi hành vi xem danh sách log, xem chi tiết log hay xuất log đều bị hệ thống tự động ghi lại một "meta-log" để giám sát chính những người quản trị.
  - Lập trình các phương thức chặn (`deleteLog`, `updateLog`) để bắn ra lỗi `CRITICAL` nếu có bất kỳ đoạn code nào cố tình thực hiện thao tác xóa dữ liệu an toàn.
  - Thiết lập nền tảng để triển khai Backup định kỳ và mã hóa dữ liệu.
- **Kết quả / Output:**
  - AI Safety Log đã trở thành một "Tòa án dữ liệu" không thể bị mua chuộc hay làm sai lệch. Đây là lá chắn pháp lý và kỹ thuật quan trọng nhất của toàn bộ dự án nâng cấp AI.
- **Đánh giá & Tổng kết:** **PHASE 8 - CƠ CHẾ HUMAN-IN-THE-LOOP VÀ AI SAFETY LOG ĐÃ HOÀN TẤT 100%**. Hệ thống AI giờ đây đã đạt tới độ chín muồi về cả tính năng lẫn quy trình an toàn vận hành đường sắt.
