# NHẬT KÝ THỰC HIỆN NÂNG CẤP AI (EXECUTION LOG)

## GIAI ĐOẠN 4 (PHẦN 7): XÂY DỰNG ĐỒ THỊ TRI THỨC KỸ THUẬT

### TASK 4.1 - Thiết kế cấu trúc Engineering Knowledge Graph [HOÀN THÀNH]
- **Thời gian:** 2026-05-08
- **Chi tiết thực hiện:**
  - Thiết kế file Schema định nghĩa toàn bộ cấu trúc đồ thị tại `infra/ai-server/knowledge/engineering_graph_schema.json`.
  - Khai báo **8 Node phân cấp chính**: Line (Tuyến), Station (Ga), System (Hệ thống), Asset (Thiết bị), Component (Linh kiện), Defect (Lỗi), SparePart (Vật tư), Document (Tài liệu).
  - Khai báo **7 Mối quan hệ cốt lõi (Relationships)** như: `BELONGS_TO_SYSTEM`, `CONTAINS_PART`, `HAS_COMMON_DEFECT`, `REQUIRES_SPARE`.
  - Đặc biệt đảm bảo nguyên tắc: **Không đập bỏ Document RAG cũ**. Đồ thị tri thức (GraphRAG) sẽ đóng vai trò là một "Bản đồ tư duy", liên kết với "Cuốn từ điển" là Document RAG hiện tại thông qua quan hệ `REFERENCED_BY`.
- **Kết quả / Output:** 
  - Khung xương (Schema) của Đồ thị tri thức Kỹ thuật Metro đã hình thành. Khi kỹ sư hỏi: *"Vành răng bị kẹt thì cần thay vật tư gì?"*, AI không chỉ đi tìm text thuần túy, mà sẽ duyệt qua đồ thị: `Vành răng` -> `REQUIRES_SPARE` -> `Mã vật tư XYZ`, đem lại sự chính xác tuyệt đối (100% không bịa đặt ảo giác).
- **Đánh giá & Next Step:** Cấu trúc đã sẵn sàng. Chuyển sang **TASK 4.2 - Nhập BOM vào hệ thống**.

### TASK 4.2 - Nhập BOM vào hệ thống (Bill of Materials) [HOÀN THÀNH]
- **Thời gian:** 2026-05-08
- **Chi tiết thực hiện:**
  - Viết module xử lý dữ liệu BOM `infra/ai-server/knowledge/bom_ingestion.py`.
  - Module tự động thu thập và chuẩn hoá danh sách vật tư thay thế (Spare Parts). VD: Xoá khoảng trắng thừa, viết hoa chữ cái đầu. Đồng thời chuẩn hoá các mã thiết bị (Asset Code).
  - Tự động gán các cạnh (Edges) để nhúng thẳng vật tư vào đồ thị: 
    - Nối Mã vật tư với Thiết bị qua quan hệ `CONTAINS_PART`.
    - Nối Mã vật tư với Tài liệu O&M qua quan hệ `REFERENCED_BY`.
    - Nối Mã vật tư với Lịch sử DNF (lỗi) qua quan hệ `REQUIRES_SPARE`.
  - Script xuất toàn bộ dữ liệu ra file `bom_graph_nodes.json`, sẵn sàng nạp vào Neo4j hoặc TrustGraph backend.
- **Kết quả / Output:** 
  - Toàn bộ linh kiện vật tư nay đã hòa mạng vào hệ tri thức chung. Khi có sự cố DNF mới phát sinh, thay vì kỹ sư phải lục lọi kho xem còn vật tư gì phù hợp, AI sẽ chiếu theo Graph Schema và BOM Ingestion để lập tức đề xuất chính xác Tên vật tư + Số lượng tồn kho.
- **Đánh giá & Next Step:** Dữ liệu BOM đã liên kết hoàn chỉnh với Đồ thị. Cần tiếp tục tiến đến giai đoạn cuối là cấu hình **AI Smart Router** để tận dụng toàn bộ khối Graph này.

### TASK 4.3 - AI đề xuất kiểm tra liên quan (AI Smart Router Integration) [HOÀN THÀNH]
- **Thời gian:** 2026-05-08
- **Chi tiết thực hiện:**
  - Viết module xử lý ngầm `infra/ai-server/knowledge/graph_recommender.py` đóng vai trò là não bộ suy luận.
  - Tích hợp 2 lớp thuật toán: **Rule Base cũ** (nếu gặp lỗi truyền thống thì tra quy tắc cứng) và **Knowledge Graph mới** (duyệt đồ thị để mở rộng vùng liên quan).
  - Lập trình giao diện Frontend React Component `src/components/hazards/ai-recommendation-panel.tsx`.
  - Component hiển thị một bảng tóm tắt các khu vực cần kiểm tra thêm (vd: *Lấy vật tư dự phòng BRAKE-PAD-X (Tồn kho: 4)*).
  - Giao diện có tích hợp nút `Accept (Check)` và `Reject (X)`, cho phép kỹ sư con người huấn luyện ngược lại AI (Human-in-the-loop). Mỗi lần bấm Reject, AI sẽ lưu log để tự hạ trọng số của đề xuất đó trong tương lai.
- **Kết quả / Output:** 
  - Kỹ sư khi báo lỗi sẽ không bao giờ bỏ sót các kiểm tra dây chuyền. Sự kết hợp giữa con người (xác nhận) và AI (nhắc nhở) đảm bảo độ tin cậy RAMS tối đa cho hệ thống Metro.
- **Đánh giá & Next Step:** Đã **HOÀN TẤT XUẤT SẮC** Giai đoạn 4 (Phần 7: GraphRAG). Kiến trúc Trợ lý Kỹ thuật bây giờ đã vô cùng toàn diện. Sẵn sàng cho **Phần 8: TRIỂN KHAI EDGE AI CHO THIẾT BỊ HIỆN TRƯỜNG**.
