# Tasks Feature

Phạm vi: quản lý công việc, phân công, trạng thái xử lý, theo dõi quá hạn và liên kết với DNF/Hazard/Inspection.

Cấu trúc khuyến nghị:

```text
tasks/
├── components/
├── hooks/
├── actions/
├── api/
├── types/
├── utils/
└── README.md
```

Nguyên tắc:

1. Kanban, task table, task detail đặt trong `components`.
2. Logic trạng thái và SLA nên tách thành util/domain service nếu dùng lại.
3. Task được tạo từ DNF/Hazard phải giữ link nguồn.
4. Không đặt logic phân quyền trực tiếp trong component nếu có thể đưa vào service/hook.
