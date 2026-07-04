# 20 - SECURITY DEPENDABOT CODEQL REMEDIATION

**Mã tài liệu:** HURC-CDHS-REPORT-20  
**Tên tài liệu:** Báo cáo khắc phục Code Scanning và Dependabot  
**Ngày cập nhật:** 2026-07-04  
**Phạm vi:** Dependency audit, Dependabot alerts, CodeQL/code scanning, workflow security gate và các điểm thực thi lệnh trong mã nguồn.

---

## 1. Mục tiêu rà soát

Báo cáo này ghi nhận các nội dung đã xử lý để giảm cảnh báo Code Scanning và Dependabot trong repository HURC CDHS.

Trọng tâm xử lý gồm:

1. Gỡ dependency trực tiếp có advisory chưa có bản vá phù hợp.
2. Loại bỏ lockfile cũ đang giữ các gói transitive có cảnh báo.
3. Sửa cách thực thi lệnh có rủi ro shell interpolation.
4. Bật Dependabot theo lịch và nhóm cảnh báo.
5. Siết lại workflow audit để chặn `high` và `critical` dependency vulnerabilities.

---

## 2. Kết luận nhanh

Đã xử lý các điểm chính sau:

| Nhóm | Tình trạng sau xử lý | Ghi chú |
|---|---|---|
| `xlsx` | Đã gỡ khỏi `package.json` và tắt parser phụ thuộc `xlsx`. | Tránh advisory Prototype Pollution/ReDoS của SheetJS. |
| `package-lock.json` cũ | Đã xóa khỏi repo. | Lockfile cũ còn giữ `xlsx`, `canvas`, `@mapbox/node-pre-gyp`, `tar` nên Dependabot vẫn báo. |
| `pdfjs-dist` override cũ | Đã gỡ override `pdfjs-dist`. | Tránh ép về bản cũ kéo optional `canvas`. |
| `disk-check.ts` | Đã chuyển từ `exec()` ghép chuỗi sang `execFile()` và validate drive name. | Giảm rủi ro command injection. |
| `safe-migrate.ts` | Đã chuyển từ `execSync(command)` sang `spawnSync()` với mảng tham số. | Không dựng lệnh shell bằng chuỗi. |
| GitHub Actions | Đã đổi cài dependency sang `npm install` và audit `high,critical`. | Không còn phụ thuộc lockfile cũ. |
| Dependabot | Đã thêm `.github/dependabot.yml`. | Theo dõi npm và GitHub Actions. |

---

## 3. Nội dung đã khắc phục

### 3.1. Gỡ `xlsx`

Trước xử lý, `package.json` có dependency trực tiếp:

```text
xlsx
```

Đây là dependency đang có advisory và không còn phù hợp để giữ trong production dependency tree.

Sau xử lý:

- Gỡ `xlsx` khỏi `package.json`.
- Gỡ import `xlsx` trong `src/lib/services/file-parser.ts`.
- Tạm khóa `parseXlsx()` và trả lỗi rõ ràng để không âm thầm xử lý XLSX bằng parser có advisory.

### 3.2. Xóa lockfile cũ

`package-lock.json` cũ chứa các dependency có cảnh báo như:

```text
xlsx
canvas
@mapbox/node-pre-gyp
tar
```

Do đó, nếu chỉ sửa `package.json` mà giữ lockfile cũ thì Dependabot vẫn có thể tiếp tục báo cáo từ lockfile. Vì vậy lockfile cũ đã được xóa để repo không còn giữ bằng chứng dependency tree lỗi thời.

Ghi chú: khi cần tái lập lockfile, phải tạo lại bằng Node/npm đúng chuẩn dự án và chỉ commit sau khi `npm audit --omit=dev` không còn high/critical.

### 3.3. Gỡ override `pdfjs-dist` cũ

Override cũ ép `pdfjs-dist` về `4.0.379`, trong khi `pdf-parse` hiện khai báo dependency mới hơn. Override cũ làm tăng rủi ro kéo theo optional dependency cũ như `canvas`.

Sau xử lý, `package.json` chỉ còn override kỹ thuật cần thiết:

```text
eslint-visitor-keys
```

### 3.4. Sửa thực thi lệnh trong `disk-check.ts`

Trước xử lý, mã dùng `exec()` với chuỗi PowerShell có dữ liệu đầu vào từ `dir`.

Sau xử lý:

- Dùng `execFile()`.
- Chỉ nhận drive Windows hợp lệ theo regex `^[A-Za-z]:`.
- Không đưa toàn bộ đường dẫn người dùng vào lệnh.
- Chỉ truyền drive name đã chuẩn hóa.

### 3.5. Sửa thực thi lệnh trong `safe-migrate.ts`

Trước xử lý, mã dựng chuỗi:

```text
npx prisma migrate ... --schema=...
```

và chạy bằng `execSync()`.

Sau xử lý:

- Validate target database chỉ cho `ops` hoặc `ai`.
- Dùng `spawnSync()`.
- Truyền command bằng mảng tham số.
- Không bật shell mode.

### 3.6. Cập nhật workflow security gate

Workflow mới chạy các lớp chính:

```text
npm install --include=dev --ignore-scripts
module/design/audit checks
audit-core-workflow-logic.js
typecheck
lint
production-dependency-audit.js
CodeQL analysis
```

`production-dependency-audit.js` hiện được cấu hình fail khi có:

```text
high
critical
```

---

## 4. Nội dung cần kiểm chứng sau khi GitHub Actions chạy lại

Các nội dung sau cần xem trên GitHub sau run mới:

1. Dependabot alerts có đóng các cảnh báo liên quan `xlsx`, `canvas`, `@mapbox/node-pre-gyp`, `tar` hay không.
2. CodeQL còn báo command injection ở `disk-check.ts` hay không.
3. CodeQL còn báo command injection ở `safe-migrate.ts` hay không.
4. Production dependency audit còn high/critical hay không.
5. Typecheck/lint có phát sinh lỗi do tắt XLSX parser hoặc gỡ package lock hay không.

---

## 5. Checklist kiểm tra nhanh

Chạy tại thư mục repository:

```bash
git pull origin master
rm -f tsconfig.tsbuildinfo

npm install --include=dev --ignore-scripts
node scripts/audit-core-workflow-logic.js
node scripts/audit-six-step-upgrades.js
npm run audit:linkage
npm run typecheck
npm run lint
node scripts/production-dependency-audit.js
```

Nếu cần tạo lại lockfile sau khi audit sạch:

```bash
npm install --package-lock-only --ignore-scripts
npm audit --omit=dev
```

Chỉ commit `package-lock.json` mới nếu không còn high/critical vulnerability.

---

## 6. Kết luận

Các thay đổi đã tập trung vào việc xử lý nguyên nhân gốc của Dependabot và CodeQL thay vì chỉ bỏ qua cảnh báo. Điểm quan trọng nhất là đã gỡ `xlsx`, loại bỏ lockfile cũ chứa transitive vulnerable packages, sửa command execution và bật lại audit gate ở mức `high,critical`.

Sau khi GitHub Actions chạy lại, cần đối chiếu lại Security tab để xác nhận các alerts đã đóng hoặc còn cảnh báo mới phát sinh.
