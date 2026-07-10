# Inspections Feature

Phạm vi: kiểm tra định kỳ, checklist, kết quả kiểm tra, ảnh hiện trường và liên kết tài sản.

Cấu trúc khuyến nghị:

```text
inspections/
├── components/
├── hooks/
├── actions/
├── api/
├── types/
├── utils/
└── README.md
```

Nguyên tắc:

1. Checklist UI đặt trong `components`.
2. Logic kiểm tra theo tiêu chuẩn bảo trì có thể tách sang `src/domains/assets` hoặc `src/domains/rams` nếu dùng lại.
3. QR/asset binding không được hard-code theo dữ liệu demo.
4. Ảnh và file đính kèm phải đi qua lớp phân quyền.
