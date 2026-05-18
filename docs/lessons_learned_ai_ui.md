# Lessons Learned: AI & UI Upgrade Phase 9-10

Tài liệu này ghi lại các lỗi kỹ thuật thường gặp và cách khắc phục để tối ưu hóa việc phát triển các module AI.

## 1. Database Wrapper (db-wrapper.ts)

### ❌ Lỗi: Argument of type '{ id: any; }' is not assignable to parameter of type 'string | number'

- **Triệu chứng:** Khi sử dụng `findUnique`, truyền một đối tượng lọc (object) vào đối số thứ hai gây lỗi TypeScript.
- **Nguyên nhân:** Phương thức `findUnique` trong bộ Wrapper được thiết kế tối giản, chỉ nhận **giá trị ID trực tiếp** (Primary Key) làm đối số thứ hai, không nhận đối tượng `{ where: ... }` như Prisma gốc.
- **Cách khắc phục đúng:**

  - Nếu tìm theo Khóa chính (ID): Sử dụng `findUnique('TableName', id_value)`.
  - Nếu tìm theo các trường khác (vd: sourceId): Sử dụng `findMany('TableName', { sourceId: value })` và lấy phần tử đầu tiên.

## 2. CSS & UI (Glassmorphism)

### ❌ Lỗi: backdrop-filter không hiển thị trên Safari/iOS

- **Triệu chứng:** Hiệu ứng kính mờ biến mất, chỉ hiển thị nền màu đặc trên các thiết bị Apple.
- **Nguyên nhân:** Safari yêu cầu tiền tố `-webkit-backdrop-filter`.
- **Cách khắc phục:** Luôn khai báo song song và đúng thứ tự:

  ```css
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  ```

## 3. Markdown Governance

### ❌ Lỗi: MD025/single-title/single-h1

- **Triệu chứng:** Cảnh báo Lint khi có nhiều tiêu đề cấp 1 (`#`) trong một file.
- **Nguyên nhân:** Tiêu chuẩn tài liệu yêu cầu duy nhất một tiêu đề H1 ở đầu trang.
- **Cách khắc phục:** Sử dụng H2 (`##`) cho các Phase lớn và H3 (`###`) cho các Task nhỏ.

## 4. Cấu trúc thư mục & Import

### ❌ Lỗi: Cannot find module './db-wrapper' hoặc '../db-wrapper'

- **Triệu chứng:** Lỗi biên dịch TypeScript không tìm thấy module db-wrapper.
- **Nguyên nhân:** File `db-wrapper.ts` nằm cố định tại `src/lib/services/`. Khi tạo service mới trong cùng thư mục này, cần sử dụng đường dẫn tương đối cấp 0.
- **Quy tắc Import chuẩn:**
  - Nếu file nằm trong `src/lib/services/`: Dùng `import { ... } from './db-wrapper'`.
  - Nếu file nằm trong `src/scripts/`: Dùng `import { ... } from '../lib/services/db-wrapper'`.
  - Nếu file nằm trong `src/components/`: Dùng `import { ... } from '../../lib/services/db-wrapper'`.

---

## 5. Deployment & System Invariants

### ❌ Lỗi: Chạy npm install trong môi trường CI/Deploy làm thay đổi tệp khóa (lockfile drift)

- **Triệu chứng:** Phiên bản thư viện bị sai lệch giữa các đợt phát triển local và môi trường kiểm thử/sản xuất, dẫn đến lỗi runtime không thể dự đoán trước.
- **Nguyên nhân:** Chạy lệnh `npm install` thay vì `npm ci`. Lệnh `npm install` có thể cập nhật các thư viện phụ thuộc lên phiên bản mới hơn nằm ngoài sự cho phép của `package-lock.json`.
- **Cách khắc phục & phòng ngừa:**
  - Bắt buộc chạy `npm ci --include=dev`.
  - Tạo tập lệnh bảo vệ [guard-install.sh](../scripts/guard-install.sh) để phát hiện ngữ cảnh CI/Deploy và đón chặn hoàn toàn hành vi chạy `npm install` sai lệch.

### ❌ Lỗi: Xung đột nhị phân native engine (Prisma, bcryptjs) do dùng Node.js version trôi nổi

- **Triệu chứng:** Container bị crash lúc khởi chạy với thông báo lỗi Engine Binary Mismatch của Prisma hoặc thư viện mã hóa mật khẩu.
- **Nguyên nhân:** Sử dụng thẻ phiên bản trôi nổi như `node:latest` hoặc `node:20` trong Dockerfile khiến mỗi lần build container có thể sử dụng một phiên bản phụ của Node.js khác với môi trường phát triển ban đầu.
- **Cách khắc phục & phòng ngừa:**
  - Luôn luôn pin cứng phiên bản Node.js chính xác (ví dụ: `v20.12.2`) trong cấu hình `package.json` engines và thẻ `FROM` của mọi Dockerfile.

### ❌ Lỗi: Lỗi mô hình AI làm sập toàn bộ hệ thống web cốt lõi (Core Web App)

- **Triệu chứng:** Nếu GPU không khả dụng hoặc mô hình YOLO/Ollama bị lỗi tải, toàn bộ website của ga Metro đều không thể truy cập.
- **Nguyên nhân:** Không tách lớp kiến trúc giữa Core Services (Web, DB, Cache) và AI Services.
- **Cách khắc phục & phòng ngừa:**
  - Phân tách cấu hình Docker Compose thành các profiles riêng biệt (`core` và `ai`).
  - Triển khai Core Services lên trước và kiểm tra sức khỏe hoàn tất, sau đó mới kích hoạt AI Services sau. Nếu cụm AI sập, cụm Core vẫn chạy bình thường ở chế độ ngoại tuyến.

### ❌ Lỗi: Fallback "npm install" ẩn chứa trong tập lệnh triển khai local (deploy.ps1)

- **Triệu chứng:** Khi chạy tập lệnh triển khai cục bộ để mô phỏng môi trường sản xuất, `package-lock.json` bị âm thầm thay đổi, gây sai lệch phiên bản phụ thuộc.
- **Nguyên nhân:** Tồn tại luồng dự phòng (fallback) tự động gọi `npm install` khi phát hiện thiếu công cụ build `next` hoặc `tsc`.
- **Cách khắc phục & phòng ngừa:**
  - Loại bỏ hoàn toàn cơ chế fallback `npm install` trong tệp triển khai [deploy.ps1](../deploy.ps1).
  - Cưỡng chế chạy duy nhất `npm ci --include=dev` và lập tức dừng tiến trình bằng `exit 1` nếu lệnh thất bại.

### ❌ Lỗi: Chạy tập lệnh Shell (`sh`) trong hooks của `package.json` gây lỗi trên Windows

- **Triệu chứng:** Khi chạy cài đặt gói tin (`npm ci`/`npm install`), hệ thống trả về mã lỗi `exit 1` ngay tại bước `preinstall` mà không hiển thị rõ thông tin cảnh báo bảo vệ.
- **Nguyên nhân:** Windows không có sẵn môi trường shell Unix (`sh` hoặc `bash`), dẫn đến lệnh gọi `"preinstall": "sh scripts/guard-install.sh"` thất bại lập tức.
- **Cách khắc phục & phòng ngừa:**
  - Luôn luôn lập trình các tập lệnh vòng đời npm (lifecycle hooks) bằng ngôn ngữ Node.js để đảm bảo tính độc lập hệ điều hành và chạy mượt mà trên cả Windows, Linux và macOS.
  - Chuyển cấu hình từ `sh scripts/guard-install.sh` sang `node scripts/guard-install.js`.

### ❌ Lỗi: Sinh dòng trống thừa (Multiple consecutive blank lines MD012) khi thay đổi tài liệu

- **Triệu chứng:** Trình biên dịch Markdown Linter báo lỗi cảnh báo `MD012` tại các dòng phân cách `---` hoặc tiêu đề sau khi Model cập nhật nội dung tệp.
- **Nguyên nhân:** Khi sử dụng các công cụ thay đổi tệp, Model vô tình thêm các ký tự xuống dòng `\n` thừa ở biên của khối văn bản thay thế.
- **Cách khắc phục & phòng ngừa:**
  - Cần kiểm tra kỹ các khoảng trắng và dòng trống ở biên của khối thay thế, đảm bảo chỉ giữ lại tối đa duy nhất 1 dòng trống phân cách giữa các đoạn văn để luôn duy trì sự sạch sẽ của tài liệu.

### ❌ Lỗi: Trôi lệch phiên bản Node/npm (Node/npm drift) trong môi trường CI/CD khi dùng thẻ xấp xỉ

- **Triệu chứng:** Pipeline biên dịch thành công ở một thời điểm nhưng đột nhiên bị lỗi biên dịch thư viện native binary ở một thời điểm khác, dù mã nguồn không thay đổi.
- **Nguyên nhân:** Môi trường CI/CD sử dụng cấu hình Node.js dạng thẻ xấp xỉ (ví dụ `node-version: '20'`). Khi máy chủ CI cập nhật phiên bản Node.js 20.x mới (ví dụ từ v20.12.2 lên v20.18.0), các native module (như Prisma, bcrypt) bị lệch pha ABI (Application Binary Interface) dẫn đến lỗi runtime.
- **Cách khắc phục & phòng ngừa:**
  - Sử dụng cấu hình động nhưng khóa cứng phiên bản bằng cách trỏ trực tiếp trường `node-version-file` vào tệp `.nvmrc` trong pipeline CI.
  - Thiết lập các bước kiểm soát chéo nghiêm ngặt ở cấp độ Shell (Verify Node & npm major versions) để phát hiện và ngăn chặn sớm mọi sự lệch pha trước khi chạy bước cài đặt.

### ❌ Lỗi: Sai số false-positive khi chạy Smoke Test quá sớm trong vòng đời container

- **Triệu chứng:** Smoke test báo lỗi kết nối CSDL hoặc lỗi HTTP 502/503 ngay lập tức sau khi chạy lệnh `docker compose up -d`, mặc dù sau đó vài giây mọi dịch vụ đều tự phục hồi và hoạt động ổn định.
- **Nguyên nhân:** Các dịch vụ cơ sở dữ liệu (Postgres, Mongo) và ứng dụng chính (Next.js/Node) cần một khoảng thời gian trễ nhất định để khởi tạo, đọc cấu hình, di chuyển dữ liệu (migration) và mở cổng lắng nghe. Nếu tập lệnh kiểm tra HTTP được thực hiện ngay lập tức mà không có cơ chế thăm dò (polling) với độ trễ và số lần thử lại (retries) phù hợp, hệ thống kiểm thử sẽ trả về kết quả thất bại sai lệch.
- **Cách khắc phục & phòng ngừa:**
  - Luôn thiết kế cơ chế vòng lặp thử lại (retry loop) với thời gian giãn cách (sleep) hợp lý cho các cuộc gọi HTTP và kiểm tra dịch vụ.
  - Cho phép thiết lập số lần thử lại tối đa (ví dụ 12 lần cách nhau 5 giây) để đảm bảo độ tin cậy của Smoke Test, tránh làm gián đoạn pipeline triển khai một cách oan uổng.

### ❌ Lỗi: Để sót các container lỗi dạng Crash Loop khi deploy thất bại trên Production

- **Triệu chứng:** Sau khi deploy thất bại hoặc smoke test báo đỏ, các container bị sập liên tục vẫn tiếp tục ngốn RAM/CPU máy chủ và tạo hàng triệu log lỗi rác, cản trở việc triển khai các bản vá tiếp theo.
- **Nguyên nhân:** Kịch bản deployment cũ thiếu cơ chế dọn dẹp khẩn cấp (fail-fast cleanup) và rollback tự động, để mặc container lỗi tự khởi chạy lại vô tận trong nền.
- **Cách khắc phục & phòng ngừa:**
  - Thiết kế quy trình "Gate deployment" tối nghiêm ngặt: Trích xuất logs lỗi của container bị sự cố lập tức khi Smoke Test báo đỏ để lưu vết debug.
  - Kích hoạt rollback tự động chạy lệnh hủy container `docker compose down` lập tức để khôi phục máy chủ về trạng thái sạch sẽ trước khi thông báo lỗi và thoát tiến trình.

### ❌ Lỗi: Lỗi khởi động phụ thuộc khi sử dụng Docker Compose Profiles mà không khai báo profiles đồng bộ

- **Triệu chứng:** Khi cố gắng khởi chạy một profile cụ thể (ví dụ `core`), Docker Compose trả về lỗi phụ thuộc (dependency error) hoặc tự động lôi kéo các container thuộc profile khác do liên kết phụ thuộc chéo (`depends_on`).
- **Nguyên nhân:** Nếu một dịch vụ thuộc profile `core` khai báo `depends_on` đến một dịch vụ thuộc profile `ai` mà không được cấu hình liên kết mềm/phụ thuộc lỏng (decoupled), Docker Compose sẽ buộc phải kích hoạt dịch vụ thuộc profile `ai` đó lên, phá vỡ nguyên lý cô lập tài nguyên.
- **Cách khắc phục & phòng ngừa:**
  - Đảm bảo các liên kết `depends_on` giữa các dịch vụ chỉ diễn ra trong cùng một profile hoặc được tách biệt bằng cấu hình mạng độc lập.
  - Phục hồi và xử lý lỗi kết nối trễ (graceful fallback) ở mức logic ứng dụng thay vì cưỡng chế liên kết cứng ở mức hạ tầng docker.

### ❌ Lỗi: Xung đột dữ liệu hoặc dữ liệu rác tồn đọng trong Volume sau khi thực hiện Rollback nửa chừng

- **Triệu chứng:** Khi di chuyển database (migration) thành công nhưng ứng dụng chính bị crash ở bước sau, việc chạy `docker compose down` gỡ container nhưng vẫn giữ nguyên dữ liệu đã bị biến đổi trong volume. Khi rollback về phiên bản code cũ, ứng dụng cũ bị crash lập tức do không tương thích ngược với schema mới của database.
- **Nguyên nhân:** Lệnh dọn dẹp mặc định không gỡ bỏ volume (`-v`) hoặc hệ thống thiếu bước khôi phục dữ liệu từ bản backup trước khi nâng cấp.
- **Cách khắc phục & phòng ngừa:**
  - Luôn tích hợp quy trình chạy **Hot Backup** sao lưu toàn diện dữ liệu Postgres, Mongo và Logs trước khi bắt đầu tiến trình nâng cấp.
  - Trên môi trường Staging/CI, thực thi rollback bằng lệnh `docker compose down -v` để dọn sạch volume lỗi. Trên môi trường Production, cung cấp cảnh báo sắc nét hướng dẫn khôi phục database từ tệp tin backup đã tạo trước đó để bảo vệ tính nhất quán dữ liệu.

### ❌ Lỗi: Thiếu quy chuẩn đặt tên Incident ID thống nhất dẫn đến khó khăn khi hậu kiểm Logs sự cố

- **Triệu chứng:** Khi có lỗi xảy ra, logs được quản trị viên trích xuất một cách tùy ý và không có nhãn chỉ định, khiến việc đối chiếu lỗi với thời gian nâng cấp hệ thống bị gián đoạn và tốn thời gian.
- **Nguyên nhân:** Thiếu quy tắc định danh Incident ID đồng bộ trong cẩm nang rollback runbook.
- **Cách khắc phục & phòng ngừa:**
  - Thiết lập định dạng Incident ID tiêu chuẩn thống nhất (ví dụ: `INCIDENT-YYYYMMDD-001`) trong cả quy trình tự động hóa và thao tác thủ công.
  - Tích hợp ghi đè tên logs đầu ra kèm theo Incident ID tương ứng để dễ dàng đối chiếu lỗi và tra cứu tập trung thông qua hệ thống Loki/Grafana.

### ❌ Lỗi: Rò rỉ tài nguyên hệ thống (mock containers) sau khi kết thúc diễn tập rollback

- **Triệu chứng:** Máy chủ Staging/CI báo quá tải tài nguyên hoặc cổng 3000 bị chiếm dụng ngoài mong muốn do container giả lập sự cố (`hurc_port_clash`) vẫn chạy ngầm sau buổi diễn tập rollback.
- **Nguyên nhân:** Kịch bản diễn tập bị ngắt giữa chừng hoặc không tích hợp cơ chế dọn dẹp cưỡng chế trong mọi trường hợp (kể cả khi kiểm thử thất bại).
- **Cách khắc phục & phòng ngừa:**
  - Thiết lập cơ chế dọn dẹp triệt để bằng cách bắt tín hiệu (`trap` trong Bash) hoặc khối lệnh `finally` (trong PowerShell).
  - Đảm bảo thực thi lệnh gỡ bỏ cưỡng chế (`docker rm -f hurc_port_clash`) ở cuối tiến trình diễn tập bất kể kết quả thành công hay thất bại.

### ❌ Lỗi: Database Migration Lock / Connection Timeout trong quá trình nâng cấp Schema

- **Triệu chứng:** Khi khởi chạy tiến trình triển khai tự động, bước di chuyển dữ liệu (`prisma migrate deploy`) bị treo hoặc ngắt kết nối giữa chừng do quá tải luồng kết nối (connection slots) trong PostgreSQL hoặc MongoDB.
- **Nguyên nhân:** Thiếu cấu hình giới hạn kết nối (`connection_limit`) chuyên biệt cho tiến trình di chuyển dữ liệu hoặc các session cũ chiếm dụng tài nguyên kéo dài.
- **Cách khắc phục & phòng ngừa:**
  - Đảm bảo các connection strings dùng để cập nhật schema cấu hình tham số giới hạn luồng thấp và thời gian chờ tối ưu (ví dụ: `?connection_limit=3&pool_timeout=15`).
  - Thực thi quy tắc đóng kết nối an toàn (`await prisma.$disconnect()`) tại tất cả các scripts helper hỗ trợ cập nhật dữ liệu.

### ❌ Lỗi: Xung đột phiên bản Engine Node.js/npm (EBADENGINE) khi triển khai cục bộ

- **Triệu chứng:** Khi chạy `npm ci`, trình quản lý gói trả về lỗi chí mạng `EBADENGINE Unsupported engine` và dừng tiến trình cài đặt.
- **Nguyên nhân:** Phiên bản Node.js (ví dụ: v24.12.0) hoặc npm (ví dụ: 11.6.2) toàn cục trên máy tính cá nhân cao hơn phạm vi nghiêm ngặt quy định trong trường `engines` của `package.json` (`node: 20.12.2`, `npm: >=10 <11`).
- **Cách khắc phục & phòng ngừa:**
  - Sử dụng bộ quản lý phiên bản Node (như `nvm-windows` hoặc `fnm`) để chuyển về phiên bản quy chuẩn sản xuất `20.12.2` trước khi cài đặt.
  - Sử dụng tham số tạm thời `--legacy-peer-deps` hoặc thêm cấu hình bỏ qua kiểm tra phiên bản nghiêm ngặt trong tệp tin cấu hình cục bộ nếu được phép.

### ❌ Lỗi: Docker Daemon / WSL 2 Backend mất liên kết hoặc chưa cài đặt Linux Distribution trên Windows

- **Triệu chứng:** Khởi chạy `docker compose` báo lỗi `failed to connect to the docker` hoặc hệ thống báo cảnh báo `Windows Subsystem for Linux has no installed distributions`.
- **Nguyên nhân:** Docker Desktop trên Windows sử dụng cấu hình WSL 2 làm backend nhưng dịch vụ WSL 2 chưa được tích hợp bản phân phối Linux nào (như Ubuntu) hoặc Docker Desktop chưa khởi động thành công.
- **Cách khắc phục & phòng ngừa:**
  - Bắt buộc cài đặt ít nhất một bản phân phối Linux trên WSL 2 bằng lệnh: `wsl --install -d Ubuntu`.
  - Đảm bảo ứng dụng Docker Desktop đã được bật và dịch vụ Docker Daemon đang chạy khỏe mạnh bằng cách kiểm thử chốt chặn: `docker info` trước khi thực thi tiến trình triển khai.

---

## 6. HẬU KIỂM TOÀN DỰ ÁN & PHÒNG NGỪA RÒ RỈ ĐƯỜNG DẪN CỨNG (PROJECT-WIDE LINK AUDIT & SOLIDIFICATION)

### ❌ Lỗi: Rò rỉ liên kết tuyệt đối đĩa cứng cục bộ (file:///d:/...) trong tài liệu vận hành

- **Triệu chứng:** Tài liệu bị hỏng liên kết (broken links) khi phân phối lên máy chủ Git hoặc chia sẻ cho các kỹ sư khác, do đường dẫn đĩa cứng cục bộ của một nhà phát triển (`d:/Hurc1CRM-main/...`) không tồn tại trên máy khác.
- **Nguyên nhân:** Nhà phát triển sử dụng chức năng "Copy Path" hoặc sao chép liên kết trực tiếp từ trình duyệt/IDE mà không chuẩn hóa thành relative path.
- **Cách khắc phục & phòng ngừa:**
  - Thiết lập quy tắc kiểm tra tĩnh (static check) định kỳ quét cụm từ `file:///` trong thư mục `docs/` và thư mục gốc dự án.
  - Sử dụng relative path bắt đầu bằng `../` đối với tệp tin nằm sâu trong cây thư mục con (ví dụ: `docs/`) và trực tiếp đối với tệp tin ở thư mục gốc.
  - Đối với các file tài liệu hướng dẫn nằm trong brain của AI (`task.md`, `walkthrough.md`), sử dụng scheme `file:///d:/` để tối ưu hóa khả năng click-to-open trực tiếp từ giao diện điều khiển, nhưng tuyệt đối không được đưa các đường dẫn cứng này vào mã nguồn chính hoặc tài liệu phân phối của repo.

### ❌ Lỗi: Lệch pha quy trình triển khai giữa mã lệnh thực tế và hướng dẫn sử dụng (README/DEPLOY)

- **Triệu chứng:** Nhà phát triển chạy lệnh `docker compose up -d` tải toàn bộ các dịch vụ lên cùng lúc khiến tài nguyên máy chủ bị nghẽn (đặc biệt là GPU/weights của LLM), dẫn đến sập web app chính hoặc lỗi Timeout.
- **Nguyên nhân:** Triết lý triển khai phân tầng (Tiered Deploy) đã được code hóa thành công trong các scripts vận hành chuyên sâu (`deploy-prod.sh`, `smoke-deploy.sh`) nhưng tài liệu hướng dẫn (`README.md`, `DEPLOY.md`) chưa được cập nhật đồng bộ, vẫn giữ lại các hướng dẫn triển khai toàn stack cồng kềnh.
- **Cách khắc phục & phòng ngừa:**
  - Đồng bộ hóa 100% tài liệu hướng dẫn nhanh (README.md) theo sát quy trình triển khai theo tầng thực tế:
    1. `docker compose --profile core up -d --build` -> Bắt buộc kiểm nghiệm lõi hệ thống: `smoke-deploy.sh core`.
    2. `docker compose --profile ai up -d` -> Kiểm nghiệm phân hệ AI: `smoke-deploy.sh ai`.
  - Loại bỏ hoàn toàn các chỉ dẫn cài đặt/smoke test dư thừa hoặc lỗi thời khỏi tài liệu hướng dẫn để tạo thành một "Nguồn sự thật duy nhất" (Single Source of Truth).
  - Tích hợp banner cảnh báo và lệnh dừng cưỡng chế `exit 1` vào tất cả các tệp kịch bản đã lỗi thời (`smoke-test.sh`) để ngăn chặn việc chạy sai lệch tài liệu trong tương lai.
