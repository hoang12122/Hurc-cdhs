# TÀI LIỆU 4: VẬN HÀNH VÀ TRIỂN KHAI PRODUCTION (DEPLOYMENT & OPS)

Tài liệu này không chỉ hướng dẫn cài đặt cơ bản, mà còn đi sâu vào cấu hình chi tiết (Snippets) để đảm bảo hệ thống **HURC1 CRM** chịu tải được hàng ngàn truy vấn trong môi trường đường sắt khắc nghiệt.

---

## 1. YÊU CẦU PHẦN CỨNG CHI TIẾT (HARDWARE METRICS)

Để hệ thống hoạt động không bị thắt cổ chai, máy chủ Ubuntu (Production) cần đáp ứng:

| Dịch vụ (Layer) | Cấu hình tối thiểu | Khuyến nghị (Có AI) | Ghi chú |
|---|---|---|---|
| **Core App (Next.js)** | 2 Cores, 4GB RAM | 4 Cores, 8GB RAM | Xử lý Request HTTP |
| **PostgreSQL (4 DBs)** | 2 Cores, 8GB RAM | 4 Cores, 16GB RAM | Cần ổ cứng NVMe SSD |
| **AI Vision (YOLOv8)** | 4 Cores, 8GB RAM | 1x GPU T4 (Nvidia) | Nếu không có GPU, CPU sẽ chạy rất chậm |
| **AI Chat (Ollama RAG)** | 4 Cores, 16GB RAM | 1x GPU RTX 3090/4090 | LLM Llama3 cần nhiều VRAM |

---

## 2. STRICT LAYERED DEPLOYMENT VÀ DOCKER COMPOSE SNIPPETS

### 2.1 Tại sao phải triển khai phân lớp (Layered)?
Thay vì `docker compose up -d` bừa bãi toàn bộ 10 container cùng lúc gây nghẽn RAM, script `./scripts/deploy-prod.sh` chia quá trình thành 3 lớp khởi động (Core -> Database -> AI).

### 2.2 Cấu hình Nginx Reverse Proxy chuẩn
Để trỏ domain nội bộ (ví dụ: `metro.hurc.vn`) về Next.js và giới hạn dung lượng ảnh tải lên (Upload DNF), bạn phải cấu hình Nginx:

```nginx
# /etc/nginx/sites-available/hurc-cdhs
server {
    listen 80;
    server_name metro.hurc.vn 192.168.1.213;

    # Cực kỳ quan trọng: Cho phép upload ảnh hiện trường tối đa 50MB
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2.3 Docker Compose Snippet (Mẫu tham khảo)
Đảm bảo container `app` luôn khởi động lại nếu bị sập (Crash loop):
```yaml
# docker-compose.yml
services:
  app:
    image: hurc-cdhs:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - IS_DATABASE_OFFLINE=false
    depends_on:
      - postgres-core
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## 3. CI/CD PIPELINES (ĐỀ XUẤT)

Nếu HURC áp dụng GitLab CI hoặc GitHub Actions cho mạng nội bộ, Pipeline phải tuân thủ luồng Invariants sau:

1. **Giai đoạn 1 (Linter & Type Check):** Chạy `npm run lint` và `tsc --noEmit`. Nếu code vi phạm chuẩn Vibe Code (Ví dụ: Dùng mã hex màu sai), đánh rớt Pipeline.
2. **Giai đoạn 2 (Test Hồi quy):** Chạy `npm run test` (Jest) đặc biệt với file `ou-scope-service.test.ts` để đảm bảo hệ thống AD Tree không bị phá vỡ.
3. **Giai đoạn 3 (Build):** Đóng gói Docker Image. Bắt buộc nhúng biến `IS_DATABASE_OFFLINE=true` để vượt qua lỗi Prisma ngáng đường lúc build.
4. **Giai đoạn 4 (Deploy):** Bắn Image sang Server 192.168.1.213. Chạy lệnh `docker pull` và tái khởi động container.

---

## 4. CHIẾN LƯỢC SAO LƯU (BACKUP RUNBOOK)

- **Hot Backup Cronjob:** Đặt Cronjob chạy script backup mỗi 2h sáng: `0 2 * * * /opt/hurc/scripts/backup-system.sh > /dev/null 2>&1`.
- **Nơi lưu trữ:** Script sẽ dump Postgres ra các file `.sql` và nén `.gz`. Yêu cầu đẩy các file này sang một máy chủ vật lý khác (Off-site backup) qua rsync để chống hỏng ổ cứng toàn phần.
