# Hazards Feature

Phạm vi: quản lý mối nguy, ma trận rủi ro, hành động kiểm soát và theo dõi giảm thiểu rủi ro.

Cấu trúc khuyến nghị:

```text
hazards/
├── components/
├── hooks/
├── actions/
├── api/
├── types/
├── utils/
└── README.md
```

Nguyên tắc:

1. UI của Hazard Log đặt trong `components`.
2. Logic risk matrix dùng chung nên tách sang `src/domains/rams` hoặc `src/domains/fracas` nếu liên quan nhiều phân hệ.
3. Flow DNF → Hazard phải giữ liên kết nguồn để truy xuất lại hồ sơ gốc.
4. Không hard-code thang điểm rủi ro nếu sau này cần cấu hình theo quy định vận hành.
