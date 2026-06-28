# Hướng dẫn liên kết nhà ga với Google Maps

## 1. Mục tiêu

Bổ sung liên kết Google Maps cho từng nhà ga trong trang `Mạng tuyến Metro` để người dùng có thể mở nhanh vị trí nhà ga hoặc chỉ đường đến nhà ga.

## 2. Cách triển khai hiện tại

Đã bổ sung file:

- `src/lib/rail-network/google-maps.ts`

Các hàm chính:

- `createStationGoogleMapsQuery(station, line)`: tạo chuỗi tìm kiếm theo tên ga, mã tuyến, tên tuyến và Thành phố Hồ Chí Minh.
- `createGoogleMapsSearchUrl(station, line)`: tạo URL mở Google Maps ở chế độ tìm kiếm.
- `createGoogleMapsDirectionsUrl(station, line)`: tạo URL mở Google Maps ở chế độ chỉ đường.
- `createGoogleMapsPlaceUrl(placeId)`: chuẩn bị sẵn cho trường hợp sau này có Google Place ID chính thức.

Trang `src/app/(app)/rail-network/_components/metro-line-map.tsx` đã được cập nhật để mỗi nhà ga trong danh sách có 02 nút:

- `Google Maps`: mở vị trí/tìm kiếm nhà ga.
- `Chỉ đường`: mở Google Maps Directions.

## 3. Lý do chưa dùng API key

Giai đoạn hiện tại chỉ dùng URL chuẩn của Google Maps, chưa dùng Google Maps JavaScript API hoặc Places API. Cách này có ưu điểm:

- Không cần API key.
- Không phát sinh chi phí API.
- Không có nguy cơ lộ khóa Google trong repo.
- Phù hợp với giai đoạn kiểm chứng chức năng.

## 4. Giới hạn hiện tại

Liên kết hiện tại dùng truy vấn theo tên nhà ga, ví dụ:

```text
Ga Bến Thành M1 Tuyến Metro số 1 Thành phố Hồ Chí Minh Việt Nam
```

Do đó, độ chính xác phụ thuộc vào kết quả tìm kiếm của Google Maps. Với các tuyến/ga quy hoạch hoặc ga chưa có dữ liệu công khai đầy đủ, Google Maps có thể trả về kết quả gần đúng hoặc không đúng hoàn toàn.

## 5. Hướng nâng cấp chính thức

Khi có dữ liệu GIS/Google Maps chính thức, nên nâng cấp theo thứ tự sau:

### 5.1. Ưu tiên 1: dùng tọa độ chính thức

Bổ sung trường `longitude`, `latitude` cho từng ga trong dữ liệu vận hành, sau đó tạo link dạng:

```text
https://www.google.com/maps/search/?api=1&query=<latitude>,<longitude>
```

### 5.2. Ưu tiên 2: dùng Google Place ID

Nếu có Place ID chính thức của từng ga, tạo link dạng:

```text
https://www.google.com/maps/search/?api=1&query_place_id=<PLACE_ID>
```

### 5.3. Ưu tiên 3: tích hợp Google Maps Platform

Chỉ nên dùng Google Maps JavaScript API/Places API khi có nhu cầu:

- Nhúng bản đồ trực tiếp trong phần mềm.
- Tìm kiếm địa điểm có autocomplete.
- Hiển thị route, khoảng cách, thời gian di chuyển.
- Đồng bộ dữ liệu GIS với bản đồ nền Google.

Khi dùng API key, tuyệt đối không hard-code key trong mã nguồn. Cần lưu trong biến môi trường, ví dụ:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
```

và cấu hình hạn chế domain/IP trên Google Cloud Console.

## 6. Điều kiện nghiệm thu

Có thể nghiệm thu kỹ thuật nội bộ khi:

- Trang `/rail-network` hiển thị danh sách nhà ga.
- Mỗi nhà ga có nút `Google Maps` và `Chỉ đường`.
- Link mở trong tab mới.
- Không yêu cầu API key.
- Có ghi chú rõ đây là liên kết tìm kiếm tham khảo, chưa phải tọa độ GIS chính thức.

Chưa nên nghiệm thu vận hành chính thức nếu chưa có tọa độ hoặc Place ID được xác nhận.
