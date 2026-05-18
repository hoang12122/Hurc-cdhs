# HƯỚNG DẪN PHỤC HỒI KHẨN CẤP & QUY TẮC PHÁN QUYẾT (ROLLBACK RUNBOOK)

> [!IMPORTANT]
> Tài liệu này là chốt chặn vận hành tối khẩn cấp của Ga Metro Tuyến 1 (HURC1 CRM). Quản trị viên hệ thống bắt buộc phải tuân thủ nghiêm ngặt ma trận quyết định và quy trình 5 bước phục hồi dưới đây khi xảy ra sự cố triển khai.

---

## A. MA TRẬN PHÁN QUYẾT TRIỂN KHAI (GO/NO-GO MATRIX)

Ma trận dưới đây xác định điều kiện tiên quyết bắt buộc để tiếp tục triển khai phiên bản mới (`GO`) hoặc kích hoạt quy trình rollback khẩn cấp lập tức (`NO-GO`):

| Chốt Chặn Kiểm Định (Gates) | Trạng Thái Đạt Chuẩn (`GO`) | Trạng Thái Thất Bại (`NO-GO`) | Hành Động Yêu Cầu |
| :--- | :--- | :--- | :--- |
| **1. Tích Hợp Liên Tục (CI)** | Code sạch 100%, lints, build & Typecheck đạt | Có bất kỳ cảnh báo Type/Lint hoặc build hỏng | 🛑 **NO-GO**: Dừng pipeline, sửa lỗi code |
| **2. Khởi Động Container** | Cụm container bật thành công (`Compose Up OK`) | Có container bị sập (`Restarting`/`Exited`) | 🛑 **NO-GO**: Hủy stack, kiểm tra logs |
| **3. Kiểm Thử Sức Bền (Smoke)** | Tất cả 5 bước Smoke Test trả về mã `2xx/3xx` | Một bước smoke thất bại hoặc log chứa crash signature | 🛑 **NO-GO**: **KÍCH HOẠT ROLLBACK LẬP TỨC** |

> [!WARNING]
> Quy tắc bất biến: **Chỉ cần một chốt chặn trả về NO-GO => Tiến trình triển khai phiên bản mới lập tức bị hủy bỏ.**

---

## B. QUY TRÌNH ROLLBACK KHẨN CẤP 5 BƯỚC (5-STEP EMERGENCY ROLLBACK)

Khi chốt chặn Smoke Test trả về kết quả thất bại, Quản trị viên (hoặc Hệ thống tự động) thực thi chính xác 5 bước khẩn cấp sau:

### 1️⃣ Bước 1: Cô lập & Dừng cụm dịch vụ lỗi

Thực hiện tắt và gỡ bỏ toàn bộ container lỗi đang vận hành để giải phóng cổng kết nối:

```bash
docker compose --profile core --profile ai down
```

### 2️⃣ Bước 2: Khôi phục phiên bản code / Thẻ Image (Tag) cũ an toàn

Kiểm tra lịch sử git/image và trỏ cấu hình về phiên bản an toàn trước đó:

```bash
# Lấy mã SHA của commit hoạt động ổn định gần nhất
git checkout <LAST_KNOWN_STABLE_COMMIT>
```

### 3️⃣ Bước 3: Khởi động lại cụm dịch vụ cũ (Rollback Activation)

Kích hoạt khởi chạy lại phiên bản an toàn từ bộ đệm sạch sẽ:

```bash
docker compose --profile core up -d
```

### 4️⃣ Bước 4: Chạy Smoke Test xác nhận khôi phục hoàn toàn

Chạy kịch bản kiểm tra sức bền để xác minh hệ thống cũ đã phục hồi hoạt động ổn định:

```bash
bash scripts/smoke-deploy.sh core
```

### 5️⃣ Bước 5: Gắn mã định danh sự cố (Incident ID) & Lưu trữ nhật ký lỗi

Lưu vết logs lỗi chí mạng phục vụ hậu kiểm (post-mortem):

```bash
# Định danh mã sự cố dạng: INCIDENT-YYYYMMDD-001
docker logs hurc_app > logs/crash-INCIDENT-$(date +%Y%m%d-%H%M%S).log
```

---

## C. MỤC TIÊU PHỤC HỒI DỮ LIỆU & THỜI GIAN (RTO / RPO TARGETS)

* **Mục tiêu Thời gian Phục hồi (RTO - Recovery Time Objective):**
  * **Mục tiêu:** `< 15 phút` kể từ khi phát hiện sự cố.
  * **Thực tế cấu hình tự động:** Hệ thống Rollback tự động qua [deploy-prod.sh](../scripts/deploy-prod.sh) có thời gian khôi phục thực tế `< 1 phút`.
* **Mục tiêu Điểm Phục hồi (RPO - Recovery Point Objective):**
  * **Mục tiêu:** Không làm mất mát quá `1 giờ` dữ liệu nghiệp vụ.
  * **Biện pháp đảm bảo:**
    * Tự động chạy kịch bản sao lưu [backup-system.sh](../scripts/backup-system.sh) trước khi nâng cấp.
    * Cơ chế sao lưu gia tăng (incremental backup) tự động hàng giờ của cơ sở dữ liệu PostgreSQL & MongoDB.

---

**Hệ thống được bảo vệ bởi HURC1-IRONCLAD Emergency Runbook.**
