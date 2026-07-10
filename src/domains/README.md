# Domains

Thư mục này dùng để chứa logic nghiệp vụ thuần theo domain, tách khỏi UI và route.

Cấu trúc tham chiếu:

```text
domains/
├── fracas/
├── rams/
├── assets/
├── inventory/
├── maximo/
├── camera/
└── gis-bim/
```

Quy định:

1. Domain code không import trực tiếp React component.
2. Domain code có thể được gọi bởi server actions, API routes hoặc background jobs.
3. Logic tính toán như MTBF, MTTR, risk score, asset health, mapping Maximo, camera capability nên đặt tại đây.
4. Mỗi domain cần có README hoặc contract mô tả input/output chính.
5. Khi di chuyển logic vào `domains`, phải cập nhật import path và chạy typecheck/lint/build.
