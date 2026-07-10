# Rail Network Feature

Phạm vi: quản lý tuyến, ga, khu gian, vị trí kỹ thuật và dữ liệu mạng lưới đường sắt đô thị.

Cấu trúc khuyến nghị:

```text
rail-network/
├── components/
├── hooks/
├── actions/
├── api/
├── types/
├── utils/
└── README.md
```

Nguyên tắc:

1. UI tuyến/ga/vị trí kỹ thuật đặt trong `components`.
2. Logic dữ liệu không gian dùng chung nên liên kết với `src/domains/gis-bim`.
3. Không trộn dữ liệu mock với dữ liệu tuyến chính thức.
4. Mọi import dữ liệu phải có bước validation và báo cáo lỗi.
