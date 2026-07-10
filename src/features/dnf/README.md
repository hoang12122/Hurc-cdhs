# DNF Feature

Phạm vi: ghi nhận, phân loại, xử lý, theo dõi và đóng hồ sơ DNF/Defect/Non-Conformity.

Cấu trúc khuyến nghị khi migration:

```text
dnf/
├── components/
├── hooks/
├── actions/
├── api/
├── types/
├── utils/
└── README.md
```

Nguyên tắc:

1. Form, bảng, bộ lọc và màn hình chi tiết DNF đặt trong `components`.
2. Hook chỉ phục vụ DNF đặt trong `hooks`.
3. Server action/API wrapper riêng của DNF đặt trong `actions` hoặc `api`.
4. Type DNF đặt trong `types` nếu chưa dùng chung nhiều phân hệ.
5. Logic FRACAS/RAMS liên quan nhiều phân hệ nên đặt trong `src/domains/fracas` hoặc `src/domains/rams`.
