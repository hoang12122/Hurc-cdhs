# 90 - PRODUCTION READINESS & VMMS BENCHMARK

**Mã tài liệu:** HURC-CDHS-REPORT-90  
**Tên tài liệu:** Production Readiness & VMMS Benchmark  
**Phạm vi áp dụng:** Kiểm tra điều kiện triển khai staging/production cho HURC1 CRM  
**Nhánh chuẩn:** `main`  
**Trạng thái:** Chờ CI/CD chạy xanh đầy đủ  

---

## 1. Mục tiêu

Tài liệu này quy định tiêu chí đánh giá mức sẵn sàng triển khai của HURC1 CRM sau khi đối chiếu với VMMS mẫu. Mục tiêu là tránh kết luận cảm tính như “production-ready 100%” khi chưa có đầy đủ bằng chứng kiểm thử.

Tài liệu trả lời 03 câu hỏi:

1. Hệ thống đã sẵn sàng ở mức nào: development, staging hay production?
2. Cần kiểm tra những workflow CI/CD nào?
3. Cần bằng chứng gì để kết luận đủ điều kiện triển khai?

---

## 2. Nguyên tắc kết luận

Không kết luận production-ready nếu thiếu một trong các nhóm bằng chứng sau:

1. CI/CD trên nhánh `main` phải chạy xanh.
2. Docker image phải build thành công.
3. Container phải chạy được và healthcheck phải đạt.
4. Các route nghiệp vụ chính phải smoke test được.
5. Không có lỗi bảo mật blocking ở CodeQL/dependency audit.
6. Không có PR cũ/open gây nhiễu trạng thái release.
7. Tài liệu môi trường, rollback và troubleshooting phải sẵn sàng.
8. Dữ liệu demo hoặc dữ liệu thật phải đủ để trình diễn workflow chính.

---

## 3. Định nghĩa mức sẵn sàng

| Mức | Tên trạng thái | Điều kiện |
|---|---|---|
| Level 0 | Not Ready | Install hoặc build còn fail; chưa chạy được CI/CD. |
| Level 1 | Development Ready | Cài dependency, typecheck/lint/build local đạt; chưa có Docker/smoke test. |
| Level 2 | CI Ready | Security Gate và CodeQL pass; Docker chưa pass hoặc chưa kiểm thử runtime. |
| Level 3 | Staging Ready | Docker build, compose config, runtime health và route smoke test pass. |
| Level 4 | Production Candidate | CI/CD xanh đầy đủ, có tài liệu deploy/rollback, có test theo vai trò, có dữ liệu đủ đại diện. |
| Level 5 | Production Ready | Đã được phê duyệt vận hành, có monitoring, backup, incident response, phân quyền, security review và UAT sign-off. |

Trạng thái hiện tại chỉ được nâng cấp theo bằng chứng thực tế, không nâng bằng mô tả tài liệu.

---

## 4. CI/CD bắt buộc phải đạt

| Workflow | Mục đích | Điều kiện PASS |
|---|---|---|
| Security and Acceptance Gate | Kiểm tra install, audit, typecheck, lint, build, smoke, dependency audit. | Tất cả bước trong job chính PASS. |
| Docker Acceptance Gate | Kiểm tra Docker Compose, Docker image, runtime container và healthcheck. | Build image PASS, container chạy, `/api/health` healthy. |
| HURC1 IRONCLAD CI/CD PIPELINE | Kiểm tra audit sâu, Prisma, build, Trivy, Docker, core smoke deploy. | Các bước mandatory PASS. |
| CodeQL Advanced | Static security analysis cho Actions, JS/TS, Python. | Không có job fail; alert blocking phải được xử lý. |

---

## 5. Chuỗi điều kiện kỹ thuật bắt buộc

CI/CD chỉ được xem là đạt khi đi qua đầy đủ chuỗi sau:

```text
Install dependencies
→ Typecheck
→ Lint
→ Production Build
→ Docker Build
→ Runtime Container
→ /api/health Smoke Test
→ CodeQL / Security Scan
```

Nếu một bước fail, các bước sau bị skip thì không được kết luận phần mềm đạt.

---

## 6. Lệnh kiểm thử local/staging khuyến nghị

Do repo hiện chưa dùng lockfile ổn định, lệnh kiểm thử local/staging khuyến nghị là:

```bash
git checkout main
git pull origin main

node -v
npm -v

npm install --include=dev --ignore-scripts
npm run db:validate:all
npm run db:generate:all
npm run typecheck
npm run lint
npm run build
```

Kiểm tra Docker:

```bash
docker compose --profile core --profile tools config
docker image build --pull --no-cache --file Dockerfile --tag hurc-cdhs:prod-check .
docker compose --profile core up -d
curl http://127.0.0.1:3000/api/health
```

Dọn môi trường:

```bash
docker compose --profile core down -v
```

---

## 7. Điều kiện môi trường

| Nhóm | Biến/điều kiện | Ghi chú |
|---|---|---|
| Node.js | Theo `.nvmrc` | CI phải dùng đúng version hoặc version tương thích đã phê duyệt. |
| npm | Theo `package.json` engines | Không dùng lẫn chính sách install giữa local/CI/Docker. |
| Environment | `.env.example` | Chỉ là mẫu; production phải override bằng secret store. |
| Database | PostgreSQL URLs | Không dùng placeholder cho production. |
| MongoDB | `MONGODB_URI` | Phải có credential riêng. |
| Redis | `REDIS_URL` | Kiểm tra kết nối nếu dùng cache/session/job queue. |
| Session | `SESSION_SECRET` | Phải là secret dài, ngẫu nhiên, không commit. |
| Docker | Dockerfile + docker-compose | Image build và container health phải đạt. |

---

## 8. Benchmark theo VMMS mẫu trước khi staging

| Nhóm | Điều kiện staging tối thiểu |
|---|---|
| DNF | Có workflow báo cáo, phân loại, giao xử lý, cập nhật, đóng hồ sơ. |
| Hazard | Có risk matrix, trạng thái xử lý, liên kết nguồn nếu tạo từ DNF. |
| Task | Có phân công công việc và trạng thái xử lý. |
| Asset 360 | Có danh sách tài sản, chi tiết tài sản, liên kết DNF/PM/history ở mức demo. |
| AI Lab | Có ít nhất một luồng AI hoạt động end-to-end và có phân quyền dữ liệu. |
| GIS/BIM | Có dữ liệu mẫu, import/dry-run và màn hình hiển thị. |
| RAMS/FRACAS | Có báo cáo hoặc dashboard minh họa theo dữ liệu demo. |
| Admin/RBAC | Có vai trò đại diện: lãnh đạo, đội trưởng, kỹ sư, nhà ga/OCC, admin. |
| Security | Không lộ mật khẩu demo, secret hoặc dữ liệu nhạy cảm trong tài liệu public. |

---

## 9. Benchmark theo VMMS mẫu trước khi production

| Nhóm | Điều kiện production |
|---|---|
| Mobile Report | Kiểm thử trên điện thoại thật; ảnh lỗi không làm mất báo cáo. |
| AI Triage | AI có traceability, confidence, human review, audit. |
| Asset Health | Có dữ liệu thật hoặc dữ liệu đại diện đủ lớn để tính rủi ro. |
| AI Agents | Các agents chính có phân quyền, timeout, cache, audit, error handling. |
| Email AI | Có opt-in, đúng người nhận, audit, không gửi sai phạm vi dữ liệu. |
| Inventory | Có item, stock, unit, vendor, manufacturer, export. |
| Maximo | Có mapping được phê duyệt, import log, reconciliation report. |
| CCTV/RTSP | Có thử nghiệm camera đại diện, credential read-only, stream không ảnh hưởng VMS hiện hữu. |
| Backup/restore | Có quy trình backup, restore test và rollback. |
| Monitoring | Có health, logs, metrics, cảnh báo và người chịu trách nhiệm. |
| UAT | Có biên bản người dùng nghiệp vụ xác nhận. |

---

## 10. Mẫu biên bản kết luận readiness

```text
Repository: hoang12122/Hurc-cdhs
Branch: main
Commit kiểm tra:
Ngày kiểm tra:
Người kiểm tra:

I. CI/CD
[ ] Security and Acceptance Gate PASS
[ ] Docker Acceptance Gate PASS
[ ] HURC1 IRONCLAD CI/CD PIPELINE PASS
[ ] CodeQL Advanced PASS

II. Kiểm thử local/staging
[ ] npm install PASS
[ ] npm run typecheck PASS
[ ] npm run lint PASS
[ ] npm run build PASS
[ ] docker build PASS
[ ] docker compose up PASS
[ ] /api/health healthy

III. Kiểm thử nghiệp vụ
[ ] DNF workflow PASS
[ ] Hazard workflow PASS
[ ] Task workflow PASS
[ ] Asset 360 PASS
[ ] AI Lab PASS
[ ] GIS/BIM Twin PASS
[ ] Admin/RBAC PASS

IV. Kết luận
[ ] Development Ready
[ ] CI Ready
[ ] Staging Ready
[ ] Production Candidate
[ ] Production Ready

Ghi chú tồn tại:
Khuyến nghị:
```

---

## 11. Tiêu chí kết luận hiện tại

Tại thời điểm lập tài liệu này, hệ thống **chưa được kết luận Production Ready 100%** nếu chưa có workflow run mới trên `main` chứng minh toàn bộ gate bắt buộc đều PASS.

Cách kết luận đúng là:

```text
HURC1 CRM đã được chuẩn hóa tài liệu benchmark và checklist theo VMMS mẫu.
Trạng thái production readiness phụ thuộc vào kết quả CI/CD và kiểm thử nghiệp vụ trên commit mới nhất của nhánh main.
```

---

## 12. Kết luận

Tài liệu này là căn cứ quản lý để phân biệt giữa:

1. Hệ thống có module và định hướng đúng.
2. Hệ thống đã kiểm thử được.
3. Hệ thống sẵn sàng staging.
4. Hệ thống đủ điều kiện production.

Chỉ kết luận mức cao hơn khi có bằng chứng kiểm thử tương ứng. Đây là nguyên tắc bắt buộc để tránh đánh giá vượt quá năng lực thực tế của phần mềm.
