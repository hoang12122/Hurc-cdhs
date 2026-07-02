# Mục III - Hệ thống quản lý rủi ro: RAMS quick calculation cho OCC

## 1. Mục tiêu

Tài liệu này bổ sung phần tính toán nhanh RAMS trong Hệ thống quản lý rủi ro, nhằm hỗ trợ OCC và các đơn vị liên quan nhận diện nhanh điểm nóng vận hành, khu vực/hệ thống có ảnh hưởng dịch vụ và xu hướng rủi ro cần theo dõi.

Căn cứ nghiệp vụ:

- Hệ thống QLATVH yêu cầu quản lý rủi ro theo chu trình nhận diện, đánh giá, kiểm soát, giám sát và cải tiến.
- Chương VIII quy định các công cụ quản lý rủi ro như Risk Matrix, Hazard Register, Hazard Log, JSA, Bow-tie và Báo cáo quản lý rủi ro.
- RAMS là độ tin cậy, tính sẵn sàng, khả năng bảo dưỡng và độ an toàn.

## 2. Phần 2 - Tính toán nhanh RAMS

RAMS quick calculation sử dụng dữ liệu từ báo cáo sự cố/DNF, hành động khắc phục và thông tin ảnh hưởng vận hành để tính nhanh các nhóm chỉ số sau:

| Nhóm | Trường/ý nghĩa | Cách dùng |
|---|---|---|
| 6 và 10 | Ảnh hưởng dịch vụ | Dùng để xác định service impact: dịch vụ tàu bị ảnh hưởng, tàu bị rút khỏi khai thác, thời gian gián đoạn, thời gian khôi phục. |
| 8 và 9 | MTTR | Dùng để tính thời gian sửa chữa/khôi phục trung bình từ corrective action hoặc từ thời điểm xảy ra sự cố đến thời điểm khôi phục. |
| 16 | RAMS Total | Điểm tổng hợp RAMS để đánh giá mức nổi bật của sự cố/rủi ro theo Reliability, Availability, Maintainability, Safety và Service Impact. |

## 3. Công thức logic đang áp dụng

### 3.1. Service Impact

Service Impact phản ánh mức độ ảnh hưởng đến khai thác/dịch vụ:

```text
Service Impact = trainServiceAffected + trainWithdrawn + disruptionDuration + restorationTime + hazardLevel
```

Ý nghĩa:

- Có ảnh hưởng dịch vụ: tăng điểm.
- Có rút tàu khỏi khai thác: tăng điểm.
- Gián đoạn càng lâu: điểm càng cao.
- Thời gian khôi phục kéo dài: điểm càng cao.
- Hazard level cao: điểm càng cao.

### 3.2. MTTR

MTTR được tính theo thứ tự ưu tiên:

```text
1. totalDownTime trong Corrective Action nếu có
2. diagnosisTime + repairTime + verificationTime nếu có
3. thời gian từ dateTimeNotified đến completedAt/updatedAt nếu có
4. thời gian từ dateTimeOfFailureOccurrence đến systemRestoredTime nếu có
5. disruptionDuration nếu không có dữ liệu chi tiết hơn
```

### 3.3. RAMS Total

RAMS Total là điểm tổng hợp nhanh để OCC có thể sàng lọc, không thay thế đánh giá kỹ thuật chính thức:

```text
RAMS Total =
  Service Impact x 35%
+ Reliability penalty x 15%
+ Availability penalty x 15%
+ Maintainability penalty x 20%
+ Safety penalty x 15%
```

Phân loại nhanh:

| RAMS Total | Mức |
|---|---|
| 0-34 | Low |
| 35-59 | Medium |
| 60-79 | High |
| 80-100 | Critical |

## 4. Trending và Hotspot cho OCC

### 4.1. Trending

Trending được tính theo ngày, tuần hoặc tháng:

```text
bucket
recordCount
totalServiceImpactScore
averageMttrMinutes
averageRamsTotal
maxRamsTotal
```

OCC có thể dùng trending để biết RAMS có đang tăng theo thời gian hay không, đặc biệt trong các giai đoạn có nhiều sự cố lặp lại hoặc sự cố ảnh hưởng khai thác.

### 4.2. Hotspot

Hotspot được tổng hợp theo 03 chiều:

```text
location
subsystem
equipment
```

Mỗi hotspot có:

```text
recordCount
averageRamsTotal
maxRamsTotal
totalServiceImpactScore
averageMttrMinutes
riskLevel
highlightReasons
```

OCC có thể ưu tiên theo dõi các hotspot có riskLevel High/Critical, RAMS Total cao, MTTR cao hoặc nhiều lần ảnh hưởng dịch vụ.

## 5. Cấu phần đã bổ sung trong phần mềm

File logic:

```text
src/lib/rams/rams-risk-engine.ts
src/lib/rams/index.ts
```

File giao diện:

```text
src/components/rams/rams-occ-dashboard-panel.tsx
src/app/(app)/dashboard/layout.tsx
```

Hàm chính:

```text
calculateRamsQuickSummary(input)
```

Đầu vào:

```text
records: DnfDocument[]
operatingMinutes?: number
trendBucket?: day | week | month
now?: Date
```

Đầu ra:

```text
generatedAt
totalRecords
affectedServiceRecords
averageMttrMinutes
averageRamsTotal
totalServiceImpactScore
worstRiskLevel
records
trends
hotspots
occHighlights
```

## 6. Nguyên tắc kiểm soát

1. RAMS quick calculation chỉ là công cụ hỗ trợ sàng lọc nhanh.
2. Kết quả không thay thế Hazard Log, Risk Register, Bow-tie hoặc đánh giá rủi ro chính thức.
3. OCC sử dụng kết quả để highlight điểm nóng, không tự động đóng sự cố hoặc thay đổi trạng thái phê duyệt.
4. Các hotspot High/Critical cần được chuyển cho đơn vị phụ trách để rà soát nguyên nhân, biện pháp khắc phục và cập nhật hồ sơ rủi ro.
5. Khi có dữ liệu chính thức từ hệ thống vận hành/bảo trì, cần hiệu chỉnh trọng số và ngưỡng phân loại phù hợp quy định nội bộ.

## 7. Tình trạng tích hợp

| Giai đoạn | Nội dung | Trạng thái |
|---|---|---|
| P1 | Gắn RAMS quick summary vào dashboard OCC. | Đã thực hiện |
| P2 | Tạo widget Trending RAMS theo ngày/tuần/tháng. | Đã thực hiện |
| P3 | Tạo widget Hotspot theo ga, hệ thống và thiết bị. | Đã thực hiện |
| P4 | Gắn link từ dashboard về DNF/Hazard Log liên quan. | Đã gắn link về DNF; Hazard Log sẽ tích hợp sâu ở bước sau |
| P5 | Hiệu chỉnh trọng số theo dữ liệu vận hành thật và quy định nội bộ. | Chờ dữ liệu chính thức |
