# Spatial Twin / GIS-BIM Feature

Phạm vi: GIS/BIM Twin, Spatial Twin, import dữ liệu không gian, mô hình kỹ thuật và hiển thị liên kết tài sản.

Cấu trúc khuyến nghị:

```text
spatial-twin/
├── components/
├── hooks/
├── actions/
├── api/
├── types/
├── utils/
└── README.md
```

Nguyên tắc:

1. UI bản đồ, mô hình và panel hiển thị đặt trong `components`.
2. Logic mapping, import, validation dữ liệu GIS/BIM đặt tại `src/domains/gis-bim`.
3. Tích hợp bản đồ hoặc nguồn dữ liệu ngoài đặt tại `src/lib/integrations`.
4. Không kết luận dữ liệu GIS/BIM sẵn sàng nghiệm thu nếu chưa có dữ liệu chính thức và báo cáo validation.
