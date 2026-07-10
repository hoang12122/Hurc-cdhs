# Shared

Thư mục này dùng cho các thành phần dùng chung trong toàn bộ HURC1 CRM.

Cấu trúc khuyến nghị:

```text
shared/
├── components/
├── hooks/
├── services/
├── types/
└── utils/
```

Quy định:

1. Chỉ đặt vào `shared` khi thành phần được dùng bởi từ 02 phân hệ trở lên.
2. Không đặt logic nghiệp vụ đặc thù của DNF, Hazard, Asset hoặc AI Lab vào `shared`.
3. Component dùng chung phải ít phụ thuộc domain.
4. Type dùng chung phải có tên rõ ràng, tránh đặt tên chung chung như `Data`, `Item`, `Info`.
5. Service dùng chung phải có test hoặc ít nhất có hướng dẫn kiểm tra.
