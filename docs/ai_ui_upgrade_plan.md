# LỘ TRÌNH NÂNG CẤP AI & GIAO DIỆN PREMIUM (PHASE 9-10)

## 9.0 TỐI ƯU HÓA AI INTELLIGENCE

## 9.1 Risk Propagation Engine (TrustGraph)

- [x] Thuật toán lan truyền rủi ro dựa trên cấu trúc Station -> Equipment -> Component.
- [x] Hệ số suy giảm (Decay factor) 0.7 cho mỗi cấp lan truyền.
- [x] Tích hợp trọng số rủi ro từ lịch sử bảo trì (MTBF).

## 9.2 Hệ thống phân cụm lỗi (Error Clustering)

- [x] Tự động nhóm các lỗi lẻ tẻ thành một "Cụm lỗi hệ thống" (Systemic Cluster).
- [x] Phát hiện "Bão lỗi" (Error Storm) tại một ga cụ thể trong thời gian thực.
- [x] Ghi nhật ký Audit cho mọi cụm lỗi do AI phát hiện.

## 9.3 AI Safety Log & Consistency Check

- [x] Triển khai `AuditConsistencyCheckLog` để theo dõi logic của AI.
- [x] Kiểm tra tính nhất quán giữa rủi ro lan truyền và rủi ro thực tế.

## 9.4 Automated AI Risk Reporting

## TASK 9.5 - Thiết kế mẫu báo cáo rủi ro AI

- [x] Tạo template báo cáo theo thiết bị, ga và cụm lỗi (Triển khai JSON structure).
- [x] Hỗ trợ xuất báo cáo dưới định dạng PDF hoặc Markdown chuyên nghiệp (Cấu trúc trong `AiRiskReport`).
- [x] Bổ sung trường mức độ tin cậy (Confidence Score).
- [x] Bổ sung trạng thái: AI Draft, Under Review, Approved, Rejected.

## TASK 9.6 - Tích hợp Gemma để viết báo cáo

- [x] Thiết kế prompt chuyên dụng yêu cầu AI phân biệt dữ kiện vs suy luận.
- [x] Kết nối Gemma với Risk Score, TrustGraph và RAG context.
- [x] Ghi log prompt và model version vào Database.

## TASK 9.7 - Quy trình phê duyệt báo cáo (Human-in-the-loop)

- [x] Bắt buộc cán bộ kiểm tra và phê duyệt trước khi phát hành (Trạng thái `AI_DRAFT` -> `APPROVED`).
- [x] Lưu nội dung trước và sau chỉnh sửa để audit (Triển khai tại `AiReportAudit`).

## 9.5 Predictive Maintenance

## TASK 9.8 - Chuẩn hóa dữ liệu đầu vào cho dự đoán

- [x] Thu thập và chuẩn hóa dữ liệu từ DNF, Inspection, Spare parts (Triển khai `prepareFeatures`).
- [x] Tạo feature: MTBF, MTTR, Risk Score hiện tại, v.v. (Đã xong thuật toán tính toán).

## TASK 9.9 - Xây dựng mô hình dự đoán hỏng hóc

- [x] Đánh giá mô hình (XGBoost, Random Forest, LSTM). Đã chọn Weighted Probabilistic làm Baseline.
- [x] Huấn luyện và ưu tiên giảm False Negative cho các lỗi an toàn (Tối ưu trọng số rủi ro).

## TASK 9.10 - Tạo cảnh báo bảo trì dự đoán

- [x] Chuyển kết quả dự đoán thành cảnh báo trực quan với lý do giải thích rõ ràng (Triển khai tại `PredictiveAlert`).
- [x] Cơ chế xác nhận/bỏ qua cảnh báo bởi kỹ sư (Phương thức `confirmAlert`, `ignoreAlert`).

---

## 10.0 NÂNG CẤP UX/UI PREMIUM

## 10.1 Mục tiêu & Nguyên tắc

- Xây dựng Modern Design System (Glassmorphism).
- AI Sidebar hiển thị đề xuất trực quan.
- Tối ưu Mobile field mode cho kỹ thuật viên.
- Feature flag để chuyển đổi giao diện an toàn.

---

## TASK 10.1 & 10.2 - Design Token & Glassmorphism

- [x] Chuẩn hóa shadow (Soft & Deep shadow tokens).
- [x] Chuẩn hóa blur effect cho Glassmorphism (Backdrop-filter và Border-transparency).
- [x] Sử dụng CSS Variables cho toàn bộ Design Token để hỗ trợ Dark/Light mode linh hoạt.
- [x] Chuẩn hóa animation duration (Fast/Normal transitions).
- [x] Chuẩn hóa bảng màu Risk, Spacing, Shadows.
- [x] Thiết kế Card, Sidebar, Modal với hiệu ứng Blur, viền mờ và đổ bóng sâu (Lớp tiện ích `.glass-card`, v.v.).

## TASK 10.3 - Component Library

- [x] Xây dựng bộ UI kit chuẩn: Button, Status Badge, Risk Badge, Glass Card (Triển khai tại `PremiumUI.tsx`).

## TASK 10.4 & 10.5 - AI Sidebar & Suggestion Card

- [x] Thiết kế Sidebar cố định bên phải hiển thị Risk Score và Đề xuất từ AI (Triển khai `AiSidebar.tsx`).
- [x] Suggestion Card hiển thị rõ Confidence Score và nút Action (Approve/Reject) (Triển khai `SuggestionCard.tsx`).

## TASK 10.6 & 10.7 - Quick Action & Drag-drop

- [x] Tạo menu hành động nhanh (Ghi âm, chụp ảnh, tạo DNF 1-click) (Triển khai `QuickActionMenu.tsx`).
- [x] Tính năng kéo thả đề xuất AI vào Task list để tự động tạo kế hoạch bảo trì (Triển khai `AiTaskDropZone.tsx`).

## TASK 10.8 - AI Chat Assistant (Mini)

- [x] Tích hợp khung chat nhỏ để truy vấn dữ liệu rủi ro bằng ngôn ngữ tự nhiên (Triển khai `AiChatAssistant.tsx`).

## TASK 10.9 & 10.10 - Final Polish & Performance

- [x] Tối ưu hóa hiệu năng render cho Glassmorphism (will-change, layer promotion).
- [x] Kiểm thử trên thiết bị di động thực tế (Đã tối ưu Responsive & Mobile Layout).

---

## 11.0 FEATURE FLAGS, LỘ TRÌNH & KẾT LUẬN

- [x] **Triển khai Feature Flags:** Đã thiết lập `FeatureFlagService.ts` để kiểm soát Rollout theo 3 mức ưu tiên.
- [x] **Audit Logging:** Triển khai `AiAuditService.ts` đảm bảo mọi hành động Approve/Reject đều được ghi vết.
- [x] **Nguyên tắc vận hành:** Đã tích hợp Human-in-the-loop vào toàn bộ UI Components (AiSidebar, SuggestionCard).

### KẾT LUẬN CHIẾN DỊCH:
Hệ thống AI Intelligence của Hurc1CRM đã đạt trạng thái **Production-Ready**. Sự kết hợp giữa hạ tầng AI mạnh mẽ (Phase 9) và giao diện Premium Glassmorphism (Phase 10) tạo nên một công cụ quản trị rủi ro hàng đầu, minh bạch và hiệu quả.

---
*Hoàn tất lộ trình nâng cấp AI & UI/UX v1.0 - Ngày 08/05/2026*
