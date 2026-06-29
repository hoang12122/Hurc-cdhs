# Kế hoạch nâng cấp MFE-ready và ranh giới module

## 1. Hiện trạng

Hệ thống hiện là Modular Monolith theo hướng Micro-Frontend-ready. Các module đã được tổ chức theo route và thư mục, nhưng chưa thể build/deploy độc lập.

Đã bổ sung registry tại:

```text
src/lib/mfe/module-registry.ts
```

Registry này mô tả contract tối thiểu của từng module:

- mã module;
- tên module;
- route prefix;
- đơn vị/phạm vi phụ trách;
- runtime mode;
- data boundary;
- inbound/outbound events;
- trạng thái sẵn sàng production.

## 2. Mục tiêu cải thiện

Mục tiêu không phải đổi sang MFE ngay lập tức, mà là chuẩn hóa ranh giới trước để sau này có thể tách module an toàn.

Các nguyên tắc bắt buộc:

1. Module không import component nội bộ của module khác nếu không có lý do rõ ràng.
2. Luồng UI xuyên module đi qua Typed Service Bus.
3. Luồng ghi dữ liệu đi qua Server Action và Service Layer.
4. Dữ liệu dùng chung phải đi qua service hoặc schema/database boundary rõ ràng.
5. Module nào chưa đủ dữ liệu chính thức phải ghi rõ `needs-data` hoặc `needs-validation`.

## 3. Lộ trình chuyển sang MFE thật

### Giai đoạn 1 - Module contract

- Duy trì `APP_MODULE_REGISTRY`.
- Mỗi module phải khai báo inbound/outbound events.
- Mỗi module phải khai báo data boundary.
- Tài liệu kiến trúc phải phản ánh đúng registry.

### Giai đoạn 2 - Boundary test

- Thêm kiểm tra import boundary.
- Cảnh báo khi module A import trực tiếp component nội bộ của module B.
- Chỉ cho phép import qua public API hoặc service contract.

### Giai đoạn 3 - Remote-ready

- Tách module có ranh giới ổn định thành remote-ready package.
- Chuẩn hóa version contract giữa shell và module.
- Bổ sung test tải module lỗi để bảo đảm lỗi không lan truyền.

### Giai đoạn 4 - MFE deployment độc lập

- Áp dụng module federation hoặc remote module.
- Có CI/CD riêng cho từng module.
- Có rollback theo module.
- Có observability theo module.

## 4. Tiêu chí nghiệm thu MFE-ready

Có thể coi là MFE-ready khi:

- Registry có đầy đủ module trọng yếu.
- Service Bus có ít nhất 03 luồng được nối thật.
- Inspection tạo DNF qua Service Bus thay vì link thủ công.
- AI Lab mở được Incident Learning qua event hoặc deep link.
- Asset 360 mở được qua event hoặc deep link.
- Tài liệu không mô tả sai thành MFE deployment độc lập.

## 5. Giới hạn

Registry không làm hệ thống trở thành MFE thật. Đây là lớp contract để giảm nợ kỹ thuật và chuẩn bị cho tách module sau này.
