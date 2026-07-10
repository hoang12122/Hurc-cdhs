# AI Lab Feature

Phạm vi: hỏi đáp tài liệu, RAG, AI agents, Incident Learning, AI triage và các chức năng hỗ trợ nghiệp vụ bằng AI.

Cấu trúc khuyến nghị:

```text
ai-lab/
├── components/
├── hooks/
├── actions/
├── api/
├── types/
├── utils/
└── README.md
```

Nguyên tắc:

1. UI AI Lab đặt trong `components`.
2. Logic agent orchestration hoặc permission-scoped context nên đặt tại `src/domains/ai` hoặc `src/lib/services`.
3. Tích hợp model/provider đặt tại `src/lib/integrations` nếu kết nối bên ngoài.
4. Kết quả AI cần có audit, timeout, error handling và giới hạn quyền dữ liệu.
5. Không đưa secret hoặc API key vào mã nguồn/tài liệu.
