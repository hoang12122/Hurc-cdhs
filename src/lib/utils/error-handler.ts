/**
 * ERROR HANDLER UTILITY
 * Standardizes error responses across Online and Offline modes.
 */

export type ErrorCode = 
    | "NOT_FOUND" 
    | "VALIDATION_ERROR" 
    | "OFFLINE_UNSUPPORTED" 
    | "DATABASE_CORRUPT" 
    | "DATABASE_LOCKED" 
    | "INTERNAL_ERROR"
    | "UNAUTHORIZED";

export interface AppErrorResponse {
    success: false;
    error: {
        code: ErrorCode;
        message: string;
        details?: any;
    };
}

export function createErrorResponse(code: ErrorCode, message: string, details?: any): AppErrorResponse {
    // Detailed logging on server (visible in console/logs)
    console.error(`[APP-ERROR] ${code}: ${message}`, details || "");

    return {
        success: false,
        error: {
            code,
            message,
            // Stack trace is NEVER returned to the UI
            details: process.env.NODE_ENV === 'development' ? details : undefined
        }
    };
}

/**
 * Specifically handles JSON DB Errors
 */
export function handleJsonDbError(error: any): AppErrorResponse {
    const msg = error.message || "";
    
    if (msg.includes("Unable to parse db.json")) {
        return createErrorResponse("DATABASE_CORRUPT", "Cơ sở dữ liệu offline (db.json) bị hỏng hoặc lỗi định dạng.");
    }
    
    if (msg.includes("locked by another process")) {
        return createErrorResponse("DATABASE_LOCKED", "Hệ thống đang bận xử lý dữ liệu. Vui lòng thử lại sau giây lát.");
    }

    if (msg.includes("not found in collection") || msg.includes("File not found")) {
        return createErrorResponse("NOT_FOUND", "Không tìm thấy dữ liệu yêu cầu trong bộ nhớ offline.");
    }

    return createErrorResponse("INTERNAL_ERROR", "Lỗi truy xuất dữ liệu offline.", error.message);
}
