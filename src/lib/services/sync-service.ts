import { IS_DATABASE_OFFLINE } from '../prisma';
import { createErrorResponse } from '../utils/error-handler';

/**
 * SYNC SERVICE — Handles Cloud Synchronization & Remote Backups
 * NOTE: This service is currently Online-Only.
 */

export async function syncOfflineDataWithCloudInternal() {
    if (IS_DATABASE_OFFLINE) {
        return createErrorResponse(
            "OFFLINE_UNSUPPORTED",
            "Tính năng 'Đồng bộ đám mây' hiện không khả dụng ở chế độ Ngoại tuyến (Offline Mode).",
            { offlineHint: "Dữ liệu của bạn đang được lưu an toàn tại bộ nhớ cục bộ (db.json). Hãy kết nối lại cơ sở dữ liệu để đồng bộ." }
        );
    }

    // TODO: Implement actual synchronization logic (Phase 5)
    return {
        success: true,
        message: "Tính năng đồng bộ đang được bảo trì hoặc chưa cấu hình API Gateway."
    };
}

export async function performRemoteBackupInternal() {
    if (IS_DATABASE_OFFLINE) {
        return createErrorResponse(
            "OFFLINE_UNSUPPORTED", 
            "Tính năng 'Sao lưu từ xa' không khả dụng khi ngoại tuyến."
        );
    }

    // TODO: Implement S3/Remote backup logic
    return { success: false, message: "Remote Backup service is not initialized." };
}

export async function checkSystemUpdatesInternal() {
    if (IS_DATABASE_OFFLINE) {
        return createErrorResponse(
            "OFFLINE_UNSUPPORTED",
            "Không thể kiểm tra bản cập nhật hệ thống khi ngoại tuyến."
        );
    }
    
    // Simulating online check
    return { success: true, updateAvailable: false };
}
