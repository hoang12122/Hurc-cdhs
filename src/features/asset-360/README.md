# Asset 360 Feature

Phạm vi: quản lý tài sản, lịch sử tài sản, asset health, liên kết DNF/PM/history và dữ liệu vòng đời.

Cấu trúc khuyến nghị:

```text
asset-360/
├── components/
├── hooks/
├── actions/
├── api/
├── types/
├── utils/
└── README.md
```

Nguyên tắc:

1. UI Asset 360 đặt trong `components`.
2. Logic chấm điểm asset health đặt tại `src/domains/assets`.
3. Dữ liệu tồn kho liên quan vật tư nên đặt tại `src/domains/inventory`.
4. Dữ liệu Maximo hoặc nguồn ngoài nên đi qua `src/lib/integrations` hoặc `src/domains/maximo`.
5. Không trộn dữ liệu demo với dữ liệu chính thức khi phục vụ nghiệm thu.
