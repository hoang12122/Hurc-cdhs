import { type FunctionDeclaration, SchemaType } from '@google/generative-ai';
import { ChatCompletionTool } from '../services/nemoclaw-client';
import fs from 'fs';
import path from 'path';
import { jsonDb } from '../db/json-db';

// ==========================================
// 1. SKILLS DEFINITION (Paperclip Style)
// ==========================================

// --- Technical & Codebase Skill (Claw-Code) ---
const technicalSkill: FunctionDeclaration[] = [
    {
        name: 'claw_ls',
        description: '[TECHNICAL SKILL] Liệt kê các tệp và thư mục. Dùng để khám phá cấu trúc mã nguồn.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                path: { type: SchemaType.STRING, description: 'Đường dẫn thư mục.' },
            },
        },
    },
    {
        name: 'claw_read',
        description: '[TECHNICAL SKILL] Đọc nội dung tệp tin để phân tích logic.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                path: { type: SchemaType.STRING, description: 'Đường dẫn tệp.' },
            },
            required: ['path'],
        },
    },
    {
        name: 'claw_grep',
        description: '[TECHNICAL SKILL] Tìm kiếm văn bản trong toàn dự án.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                pattern: { type: SchemaType.STRING, description: 'Chuỗi tìm kiếm.' },
            },
            required: ['pattern'],
        },
    },
];

// --- Operational & CRM Data Skill (Hurc Skill) ---
const opsSkill: FunctionDeclaration[] = [
    {
        name: 'get_open_dnfs',
        description: '[OPS SKILL] Tra cứu danh sách sự cố DNF đang mở.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                limit: { type: SchemaType.NUMBER, description: 'Giới hạn kết quả.' },
            },
        },
    },
    {
        name: 'get_system_health',
        description: '[OPS SKILL] Kiểm tra sức khỏe toàn hệ thống.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {},
        },
    }
];

export const crmToolDeclarations: FunctionDeclaration[] = [
    ...technicalSkill,
    ...opsSkill
];

/**
 * Tools in OpenAI/NemoClaw format
 */
export const openAiToolDeclarations: ChatCompletionTool[] = crmToolDeclarations.map(tool => ({
    type: 'function',
    function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
    }
}));

// ==========================================
// 2. KÊNH THỰC THI TOOLS (Đôi Tay)
// ==========================================

export async function executeCrmTool(callerName: string, args: any): Promise<any> {
    try {
        switch (callerName) {
            case 'get_open_dnfs':
                return await toolGetOpenDnfs(args);
            case 'get_system_health':
                return await toolGetSystemHealth();
            case 'claw_ls':
                return await toolClawLs(args);
            case 'claw_read':
                return await toolClawRead(args);
            case 'claw_grep':
                return await toolClawGrep(args);
            default:
                return { error: `Tool ${callerName} not recognized by CRM.` };
        }
    } catch (e: any) {
        console.error(`LỖI THỰC THI TOOL [${callerName}]:`, e);
        return { success: false, error: `Lỗi hệ thống khi thực thi công cụ: ${e.message}` };
    }
}

// ---- Security Guard ----

const BLACKLISTED_FILES = ['.env', 'db.json', 'db.backup.json', '.git', 'node_modules', '.next'];

function validatePath(targetPath: string): { valid: boolean; error?: string; fullPath?: string } {
    const root = process.cwd();
    const resolvedPath = path.resolve(root, targetPath || '.');

    // 1. Phải nằm trong project root
    if (!resolvedPath.startsWith(root)) {
        return { valid: false, error: "Truy cập ngoài phạm vi dự án bị từ chối." };
    }

    // 2. Không được nằm trong blacklist
    const relativePath = path.relative(root, resolvedPath);
    if (BLACKLISTED_FILES.some(b => relativePath === b || relativePath.startsWith(b + path.sep))) {
        return { valid: false, error: "Truy cập vào tệp/thư mục nhạy cảm bị từ chối vì lý do an ninh." };
    }

    return { valid: true, fullPath: resolvedPath };
}

// ---- Implementations ----

async function toolGetOpenDnfs(args: any) {
    const limit = args?.limit ? Math.min(Number(args.limit), 50) : 10;
    
    try {
        const { opsDb, IS_DATABASE_OFFLINE } = await import('@/lib/prisma');
        if (IS_DATABASE_OFFLINE) throw new Error("Offline Mode");

        const dnfs = await opsDb.dnfDocument.findMany({
            where: {
                status: {
                    notIn: ['Đã đóng', 'Hủy']
                }
            },
            select: {
                id: true,
                failureReportNo: true,
                descriptionOfFailure: true,
                priority: true,
                status: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        return {
            success: true,
            count: dnfs.length,
            data: dnfs,
            note: "Đây là dữ liệu thời gian thực từ Database PostgreSQL."
        };
    } catch (e: any) {
        console.warn(`Tool get_open_dnfs: Falling back to JSON due to: ${e.message}`);
        
        // Fallback to standardized dnfDocuments key
        const allDnfs = await jsonDb.getCollection<any>('dnf_documents');
        const openDnfs = allDnfs
            .filter((d: any) => !['Đã đóng', 'Hủy'].includes(d.status))
            .reverse()
            .slice(0, limit);
        
        return {
            success: true,
            count: openDnfs.length,
            data: openDnfs,
            note: "Cảnh báo: Lấy dữ liệu từ db.json tạm thời do PostgreSQL bị rớt kết nối."
        };
    }
}

async function toolGetSystemHealth() {
    try {
        const { authDb, opsDb, IS_DATABASE_OFFLINE } = await import('@/lib/prisma');
        
        let stats = {
            dbStatus: IS_DATABASE_OFFLINE ? "Offline (Fall-back to JSON)" : "Online (PostgreSQL)",
            isDatabaseOffline: IS_DATABASE_OFFLINE,
            userCount: 0,
            logCount: 0
        };

        if (!IS_DATABASE_OFFLINE) {
            try {
                const [uCount, lCount] = await Promise.all([
                    authDb.user.count(),
                    opsDb.systemLog.count()
                ]);
                stats.userCount = uCount;
                stats.logCount = lCount;
            } catch {
                stats.dbStatus = "Error connecting to PostgreSQL";
                stats.isDatabaseOffline = true;
            }
        }

        if (stats.isDatabaseOffline) {
            const users = await jsonDb.getCollection<any>('users');
            const logs = await jsonDb.getCollection<any>('system_logs');
            stats.userCount = users.length;
            stats.logCount = logs.length;
        }

        return {
            success: true,
            ...stats,
            message: `Hệ thống ${stats.dbStatus}. Số người dùng: ${stats.userCount}. Số nhật ký: ${stats.logCount}.`
        };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// ---- Claw Tools Implementations ----

async function toolClawLs(args: any) {
    const check = validatePath(args.path);
    if (!check.valid) return { success: false, error: check.error };

    try {
        const items = fs.readdirSync(check.fullPath!);
        const stats = items.map(name => {
            const full = path.join(check.fullPath!, name);
            const isDir = fs.statSync(full).isDirectory();
            return { name, type: isDir ? 'directory' : 'file' };
        });
        return { success: true, path: args.path || '.', items: stats };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

async function toolClawRead(args: any) {
    const check = validatePath(args.path);
    if (!check.valid) return { success: false, error: check.error };

    try {
        const stats = fs.statSync(check.fullPath!);
        if (stats.isDirectory()) return { success: false, error: "Đường dẫn là thư mục, không thể đọc nội dung." };
        
        const content = fs.readFileSync(check.fullPath!, 'utf8');
        const truncated = content.length > 4000 ? content.substring(0, 4000) + "\n... [Nội dung quá dài, đã bị cắt tỉa]" : content;

        return { success: true, path: args.path, content: truncated };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

async function toolClawGrep(args: any) {
    const rootSearch = args.path || '.';
    const check = validatePath(rootSearch);
    if (!check.valid) return { success: false, error: check.error };

    const results: any[] = [];
    const pattern = new RegExp(args.pattern, 'i');

    function walk(dir: string) {
        const checkDir = validatePath(path.relative(process.cwd(), dir));
        if (!checkDir.valid) return;

        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                walk(fullPath);
            } else {
                const content = fs.readFileSync(fullPath, 'utf8');
                const lines = content.split('\n');
                lines.forEach((line, index) => {
                    if (pattern.test(line)) {
                        results.push({
                            path: path.relative(process.cwd(), fullPath),
                            line: index + 1,
                            content: line.trim().substring(0, 100)
                        });
                    }
                });
            }
            if (results.length >= 20) break;
        }
    }

    try {
        walk(check.fullPath!);
        return { success: true, pattern: args.pattern, matches: results };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
