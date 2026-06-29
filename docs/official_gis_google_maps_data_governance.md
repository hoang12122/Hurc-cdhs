# Quản trị dữ liệu GIS/BIM và Google Maps chính thức

## 1. Mục tiêu

Tài liệu này quy định nguyên tắc sử dụng dữ liệu vị trí nhà ga, tuyến, GIS/BIM và Google Maps trong phần mềm. Mục tiêu là tránh nhầm lẫn giữa dữ liệu demo/tham khảo và dữ liệu vận hành chính thức.

## 2. Phân loại dữ liệu

Dữ liệu vị trí được phân thành 03 trạng thái:

```text
demo
needs-review
official
```

Ý nghĩa:

- `demo`: dữ liệu phục vụ trình diễn, kiểm chứng giao diện hoặc kiểm thử kiến trúc.
- `needs-review`: dữ liệu đã có nguồn nhưng chưa được đơn vị chuyên môn xác nhận.
- `official`: dữ liệu đã được xác nhận nguồn gốc, tọa độ, mã ga, tên ga và phạm vi sử dụng.

## 3. Nguyên tắc dùng Google Maps

Trong giai đoạn chưa có dữ liệu chính thức, link Google Maps chỉ được dùng theo dạng truy vấn tên ga/mã tuyến/khu vực. Cách này phù hợp để tham khảo nhanh nhưng không được xem là tọa độ vận hành.

Khi có dữ liệu chính thức, ưu tiên theo thứ tự:

1. Google Place ID đã được xác nhận.
2. Tọa độ GIS chính thức đã được phê duyệt.
3. Truy vấn tên ga chỉ dùng làm fallback tham khảo.

## 4. Điều kiện chuyển sang official

Một vị trí nhà ga chỉ được đánh dấu `official` khi có đủ:

- mã ga;
- tên ga tiếng Việt/tiếng Anh nếu có;
- tuyến liên quan;
- tọa độ hoặc Google Place ID;
- nguồn dữ liệu;
- người/đơn vị xác nhận;
- ngày xác nhận;
- ghi chú phạm vi sử dụng.

## 5. Điều kiện nghiệm thu

Chưa nghiệm thu dữ liệu GIS/BIM/Google Maps cho vận hành nếu:

- chưa có nguồn dữ liệu chính thức;
- tọa độ chưa được kiểm tra;
- Google Place ID chưa được xác nhận;
- dữ liệu demo đang hiển thị như dữ liệu thật;
- chưa có biên bản hoặc xác nhận của đơn vị phụ trách dữ liệu.

## 6. Khuyến nghị triển khai tiếp theo

Nên bổ sung bảng hoặc trường dữ liệu để lưu:

```text
verificationState
sourceName
approvedBy
approvedAt
googlePlaceId
latitude
longitude
```

Đồng thời, giao diện cần hiển thị nhãn rõ ràng: `Dữ liệu demo`, `Chờ rà soát`, hoặc `Đã xác nhận chính thức`.
