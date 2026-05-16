import { internalLogSystemEvent } from '../lib/services/log-service';

async function main() {
    console.log("🧪 Đang kiểm tra hệ thống Logging...");
    
    await internalLogSystemEvent(
        "TEST_LOG_EVENT",
        "INFO",
        "Sự kiện kiểm tra hệ thống lúc " + new Date().toISOString(),
        "system"
    );

    await internalLogSystemEvent(
        "SECURITY_TEST",
        "WARNING",
        "Kiểm tra bảo mật Shannon",
        "security"
    );

    console.log("✅ Đã gửi các sự kiện Log. Hãy kiểm tra thư mục /logs.");
}

main().catch(console.error);
