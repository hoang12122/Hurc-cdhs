# Features

Thư mục này là vùng chuẩn hóa các phân hệ nghiệp vụ theo mô hình **package-by-feature**.

Mỗi phân hệ nên có cấu trúc tham chiếu:

```text
<feature>/
├── components/
├── hooks/
├── actions/
├── api/
├── types/
├── utils/
└── README.md
```

Nguyên tắc:

1. Code chỉ phục vụ một phân hệ thì đặt trong thư mục phân hệ đó.
2. Code dùng chung nhiều phân hệ thì đặt tại `src/shared` hoặc `src/lib`.
3. Route/page của Next.js vẫn đặt tại `src/app`; không di chuyển route khi chưa kiểm thử.
4. Không tạo thư mục quá sâu nếu chưa có nhu cầu thực tế.
5. Sau mỗi lần di chuyển file, phải chạy typecheck, lint và build.

Các phân hệ ưu tiên chuẩn hóa:

| Phân hệ | Thư mục |
|---|---|
| DNF | `src/features/dnf` |
| Hazards | `src/features/hazards` |
| Inspections | `src/features/inspections` |
| Tasks | `src/features/tasks` |
| Asset 360 | `src/features/asset-360` |
| Rail Network | `src/features/rail-network` |
| Spatial Twin / GIS-BIM | `src/features/spatial-twin` |
| AI Lab | `src/features/ai-lab` |
