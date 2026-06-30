# Secure External Integration Guide

## Mục tiêu

Tài liệu này chuẩn hóa cách HURC1 CRM kết nối với các phần mềm bên ngoài như SAP, Maximo, CMMS, GIS, BI, SCADA hoặc các hệ thống trung gian khác.

## Nguyên tắc

- Không kết nối trực tiếp từ UI component ra hệ thống ngoài.
- Luồng tích hợp phải đi qua Service Layer hoặc integration gateway.
- Dữ liệu gửi ra ngoài phải được chuẩn hóa theo envelope.
- Dữ liệu nhạy cảm phải được che trước khi log hoặc trả về UI.
- Tích hợp outbound phải kiểm tra allowlist host.
- Tích hợp hai chiều phải dùng chữ ký HMAC hoặc cơ chế xác thực tương đương.
- Mỗi hệ thống ngoài phải có policy riêng: loại hệ thống, chiều kết nối, event được phép và host được phép.

## Bằng chứng code

Gateway bảo mật đặt tại:

```text
src/lib/integrations/secure-integration-gateway.ts
```

Các năng lực chính:

```text
IntegrationPolicy
IntegrationEnvelope
createIntegrationEnvelope
redactIntegrationPayload
isHostAllowed
assertIntegrationPolicy
signIntegrationBody
verifyIntegrationSignature
buildSignedIntegrationHeaders
```

## Chuẩn envelope

```text
id
sourceSystem
targetSystem
eventType
occurredAt
schemaVersion
payload
metadata
```

## Checklist khi thêm phần mềm mới

- Xác định phần mềm cần kết nối: SAP, Maximo, GIS, BI, SCADA, CMMS hoặc generic.
- Xác định chiều kết nối: inbound, outbound hoặc bidirectional.
- Khai báo allowlist host.
- Khai báo danh sách event được phép.
- Không truyền password, token, cookie, private key hoặc secret trong payload nghiệp vụ.
- Log chỉ dùng payload đã redacted.
- Kiểm thử chữ ký, timestamp và timeout trước nghiệm thu.

## Điểm còn lại

- Chưa mở endpoint inbound public mặc định để tránh tăng bề mặt tấn công.
- Khi có hệ thống cụ thể, cần tạo adapter riêng và route riêng theo policy đã duyệt.
- Cần bổ sung audit log khi tích hợp ghi dữ liệu vào database nghiệp vụ.
