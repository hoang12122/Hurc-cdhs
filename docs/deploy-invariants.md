# NGUYÊN TẮC BẤT BIẾN TRONG TRIỂN KHAI HỆ THỐNG (DEPLOYMENT INVARIANTS)

Tài liệu này định nghĩa 5 nguyên tắc bất biến (Invariants) bắt buộc phải tuân thủ tuyệt đối trong mọi quy trình kiểm thử, tích hợp liên tục (CI), và triển khai thực tế (local/staging/production) của dự án HURC1 CRM & Metro Inspect Pro.

---

## 1. MỌI MÔI TRƯỜNG CHỈ DÙNG NPM CI --INCLUDE=DEV

Để tránh hiện tượng sai lệch phiên bản phụ thuộc giữa các môi trường phát triển cục bộ và máy chủ kiểm thử/vận hành, tất cả các câu lệnh cài đặt thư viện bên thứ ba phải tuân thủ nguyên tắc:

- **Chỉ sử dụng câu lệnh:** `npm ci --include=dev`
- **Ý nghĩa:** Câu lệnh này sẽ đọc trực tiếp tệp tin khóa `package-lock.json` để tải về phiên bản chính xác tuyệt đối của từng thư viện, ngăn chặn hành vi tự động cập nhật ngoài ý muốn của `npm install`. Việc bao gồm `--include=dev` đảm bảo toàn bộ công cụ phát triển, kiểm thử chất lượng mã nguồn (TypeScript, ESLint, Prisma) được cài đặt đầy đủ phục vụ quá trình biên dịch và kiểm duyệt.
- **Áp dụng:** Bắt buộc áp dụng trong Dockerfile, các bước cài đặt trong Jenkins/GitHub Action Workflows, và quy trình cài đặt trên máy trạm của kỹ sư.

---

## 2. PHIÊN BẢN NODE.JS PHẢI ĐƯỢC PIN CỨNG (EXACT PINNING)

Hệ thống cấm sử dụng các thẻ phiên bản mang tính "xấp xỉ" hoặc tự động cập nhật như `:latest`, `:alpine`, `^20` hay `node:20` trong cấu hình máy chủ và Dockerfile.

- **Phiên bản chuẩn được chỉ định:** `Node.js v20.12.2` (hoặc thẻ hình ảnh tương ứng `cgr.dev/chainguard/node:20.12.2`).
- **Ý nghĩa:** Pin cứng phiên bản Node.js giúp loại bỏ hoàn toàn các lỗi xung đột nhị phân (Binary Mismatch) xảy ra đối với các thư viện native như Prisma client, bcryptjs khi chạy trên các phiên bản Node.js khác nhau.
- **Áp dụng:** Bắt buộc ghi nhận rõ phiên bản chính xác trong tệp tin `package.json` thông qua trường `engines`, và cấu hình tường minh trong thẻ `FROM` của mọi Dockerfile liên quan.

---

## 3. TRIỂN KHAI CHỈ ĐƯỢC COI LÀ THÀNH CÔNG KHI SMOKE TEST RUNTIME PASS

Một đợt triển khai (deploy) không được coi là hoàn tất nếu chỉ vượt qua bước biên dịch (build). Hệ thống yêu cầu bắt buộc phải khởi chạy thành công một bài kiểm thử khói thời gian thực (Smoke Test Runtime) trước khi mở cổng mạng đón nhận người dùng.

- **Hành vi bắt buộc:** Ngay sau khi container khởi chạy, một kịch bản kiểm tra tự động sẽ gửi yêu cầu HTTP truy cập vào cổng kiểm tra sức khỏe hệ thống:
  `http://localhost:3000/api/health`
- **Ý nghĩa:** Smoke test này kiểm tra xem toàn bộ các kết nối ngoại vi (PostgreSQL, Redis, MongoDB) và các tiến trình con có phản hồi mã HTTP `200 OK` hay không. Chỉ khi bài kiểm tra này phản hồi thành công liên tục, hệ thống giám sát mới chuyển trạng thái deploy thành "Thành công".

---

## 4. QUY TRÌNH TRIỂN KHAI PHÂN TÁCH LỚP CORE TRƯỚC, AI SAU

Hạ tầng HURC1 CRM được phân chia làm hai phân lớp chức năng rõ rệt nhằm tối ưu hóa tính độc lập và khả năng chịu lỗi của hệ thống:

- **Triển khai Lớp Core trước:** Các dịch vụ nền tảng bắt buộc phải hoạt động ổn định trước, bao gồm: Cơ sở dữ liệu PostgreSQL (`postgres`), bộ nhớ đệm (`redis`), cơ sở dữ liệu tri thức (`mongo`), ứng dụng Web chính (`app`) và cổng phân tải (`nginx`).
- **Triển khai Lớp AI sau:** Các dịch vụ phụ trợ phân tích chuyên sâu sẽ được khởi chạy sau khi lớp Core đã vượt qua Smoke Test thành công, bao gồm: Mô hình xử lý ảnh (`yolo-service`) và trợ lý ảo cục bộ (`ollama`).
- **Ý nghĩa:** Nếu lớp AI gặp sự cố (như thiếu card đồ họa GPU hoặc lỗi tải mô hình lớn), hệ thống Web Core chính vẫn chạy bình thường ở chế độ ngoại tuyến, đảm bảo tuyến Metro không bị gián đoạn vận hành.

---

## 5. CƠ CHẾ KHÔI PHỤC TỨC THỜI (IMMEDIATE ROLLBACK) KHI GẶP LỖI

Hệ thống triển khai cơ chế phòng vệ tự động ở mọi chặng kiểm duyệt (gate). Nếu phát hiện bất kỳ gate nào bị lỗi trong quy trình tích hợp và triển khai:

- **Hành vi bắt buộc:** Hệ thống tự động hủy bỏ đợt cập nhật mới và thực hiện Rollback tức thời về phiên bản ổn định gần nhất được gắn nhãn (Tagged Stable Image).
- **Ý nghĩa:** Đảm bảo thời gian gián đoạn (Downtime) của tuyến Metro bằng 0 và không bao giờ để trạng thái lỗi làm ảnh hưởng đến dữ liệu hiện hành.
