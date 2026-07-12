import { type FunctionDeclaration, SchemaType } from '@google/generative-ai';
import { ChatCompletionTool } from '../services/nemoclaw-client';
import fs from 'fs';
import path from 'path';
import { jsonDb } from '../db/json-db';
import { redactSensitiveData, sanitizeAiText } from '../services/ai/control-plane';

// ==========================================
// 1. SKILLS DEFINITION (READ-ONLY)
// ==========================================

const technicalSkill: FunctionDeclaration[] = [
    {
        name: 'claw_ls',
        description: '[READ-ONLY TECHNICAL SKILL] Liệt kê tệp và thư mục trong phạm vi dự án đã được kiểm soát.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                path: { type: SchemaType.STRING, description: 'Đường dẫn thư mục tương đối trong dự án.' },
            },
        },
    },
    {
        name: 'claw_read',
        description: '[READ-ONLY TECHNICAL SKILL] Đọc tệp văn bản không nhạy cảm trong phạm vi dự án.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                path: { type: SchemaType.STRING, description: 'Đường dẫn tệp tương đối trong dự án.' },
            },
            required: ['path'],
        },
    },
    {
        name: 'claw_grep',
        description: '[READ-ONLY TECHNICAL SKILL] Tìm chuỗi literal trong tệp văn bản; không thực thi regex hoặc lệnh.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                pattern: { type: SchemaType.STRING, description: 'Chuỗi literal cần tìm.' },
                path: { type: SchemaType.STRING, description: 'Thư mục tương đối; mặc định là thư mục gốc dự án.' },
            },
            required: ['pattern'],
        },
    },
];

const opsSkill: FunctionDeclaration[] = [
    {
        name: 'get_open_dnfs',
        description: '[READ-ONLY OPS SKILL] Tra cứu danh sách sự cố DNF đang mở.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                limit: { type: SchemaType.NUMBER, description: 'Giới hạn kết quả, tối đa 50.' },
            },
        },
    },
    {
        name: 'get_system_health',
        description: '[READ-ONLY OPS SKILL] Kiểm tra sức khỏe tổng quát của hệ thống.',
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

export const openAiToolDeclarations: ChatCompletionTool[] = crmToolDeclarations.map(tool => ({
    type: 'function',
    function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
    }
}));

// ==========================================
// 2. READ-ONLY TOOL EXECUTION FIREWALL
// ==========================================

const MAX_DIRECTORY_ENTRIES = 200;
const MAX_READ_BYTES = 512 * 1024;
const MAX_GREP_FILES = 5_000;
const MAX_GREP_RESULTS = 20;
const MAX_PATTERN_CHARS = 200;
const ALLOWED_TEXT_EXTENSIONS = new Set([
    '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.md', '.txt',
    '.yaml', '.yml', '.prisma', '.sql', '.css', '.scss', '.html', '.xml',
    '.toml', '.ini', '.py', '.sh', '.ps1', '.dockerfile',
]);
const BLOCKED_SEGMENTS = new Set([
    '.git', 'node_modules', '.next', '.prisma-runtime', '.build-logs',
    'backups', 'coverage',
]);
const BLOCKED_EXACT_FILES = new Set([
    'db.json', 'db.backup.json', 'credentials.json', 'service-account.json',
]);

interface ValidatedPath {
    valid: boolean;
    error?: string;
    fullPath?: string;
    relativePath?: string;
}

function isSensitiveSegment(segment: string): boolean {
    const lower = segment.toLowerCase();
    return BLOCKED_SEGMENTS.has(lower)
        || BLOCKED_EXACT_FILES.has(lower)
        || /^\.env(?:\.|$)/i.test(segment)
        || /(?:secret|credential|private[-_]?key|access[-_]?token)/i.test(segment)
        || /\.(?:pem|key|p12|pfx|jks|keystore)$/i.test(segment);
}

function isWithinRoot(root: string, candidate: string): boolean {
    return candidate === root || candidate.startsWith(`${root}${path.sep}`);
}

function validatePath(targetPath: string, expectedType?: 'file' | 'directory'): ValidatedPath {
    try {
        const root = fs.realpathSync(process.cwd());
        const requested = sanitizeAiText(targetPath || '.', 1_000);
        const resolved = path.resolve(root, requested || '.');
        if (!isWithinRoot(root, resolved)) {
            return { valid: false, error: 'Truy cập ngoài phạm vi dự án bị từ chối.' };
        }
        if (!fs.existsSync(resolved)) {
            return { valid: false, error: 'Đường dẫn không tồn tại.' };
        }

        const realPath = fs.realpathSync(resolved);
        if (!isWithinRoot(root, realPath)) {
            return { valid: false, error: 'Symlink dẫn ra ngoài phạm vi dự án bị từ chối.' };
        }

        const relativePath = path.relative(root, realPath);
        const segments = relativePath.split(path.sep).filter(Boolean);
        if (segments.some(isSensitiveSegment)) {
            return { valid: false, error: 'Đường dẫn nhạy cảm bị từ chối theo chính sách AI read-only.' };
        }

        const stat = fs.statSync(realPath);
        if (expectedType === 'file' && !stat.isFile()) {
            return { valid: false, error: 'Đường dẫn không phải là tệp.' };
        }
        if (expectedType === 'directory' && !stat.isDirectory()) {
            return { valid: false, error: 'Đường dẫn không phải là thư mục.' };
        }

        return { valid: true, fullPath: realPath, relativePath };
    } catch (error) {
        return { valid: false, error: error instanceof Error ? error.message : String(error) };
    }
}

function isAllowedTextFile(filePath: string): boolean {
    const baseName = path.basename(filePath).toLowerCase();
    if (baseName === 'dockerfile') return true;
    return ALLOWED_TEXT_EXTENSIONS.has(path.extname(baseName));
}

function safeFileContent(content: string, maxChars = 8_000): string {
    return redactSensitiveData(sanitizeAiText(content, maxChars)).text;
}

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
                return { success: false, error: `Tool ${sanitizeAiText(callerName, 120)} is not in the read-only allowlist.` };
        }
    } catch (error: any) {
        console.error(`LỖI THỰC THI TOOL [${callerName}]:`, error);
        return { success: false, error: `Lỗi hệ thống khi thực thi công cụ: ${error.message}` };
    }
}

async function toolGetOpenDnfs(args: any) {
    const requestedLimit = Number(args?.limit ?? 10);
    const limit = Number.isFinite(requestedLimit) ? Math.max(1, Math.min(Math.floor(requestedLimit), 50)) : 10;

    try {
        const { opsDb, IS_DATABASE_OFFLINE } = await import('@/lib/prisma');
        if (IS_DATABASE_OFFLINE) throw new Error('Offline Mode');

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
            note: 'Dữ liệu read-only thời gian thực từ PostgreSQL.'
        };
    } catch (error: any) {
        console.warn(`Tool get_open_dnfs: Falling back to JSON due to: ${error.message}`);
        const allDnfs = await jsonDb.getCollection<any>('dnf_documents');
        const openDnfs = allDnfs
            .filter((dnf: any) => !['Đã đóng', 'Hủy'].includes(dnf.status))
            .reverse()
            .slice(0, limit)
            .map((dnf: any) => ({
                id: dnf.id,
                failureReportNo: dnf.failureReportNo,
                descriptionOfFailure: dnf.descriptionOfFailure,
                priority: dnf.priority,
                status: dnf.status,
                createdAt: dnf.createdAt,
            }));

        return {
            success: true,
            count: openDnfs.length,
            data: openDnfs,
            note: 'Dữ liệu read-only từ kho dự phòng do PostgreSQL không sẵn sàng.'
        };
    }
}

async function toolGetSystemHealth() {
    try {
        const { authDb, opsDb, IS_DATABASE_OFFLINE } = await import('@/lib/prisma');
        const stats = {
            dbStatus: IS_DATABASE_OFFLINE ? 'Offline (JSON fallback)' : 'Online (PostgreSQL)',
            isDatabaseOffline: IS_DATABASE_OFFLINE,
            userCount: 0,
            logCount: 0
        };

        if (!IS_DATABASE_OFFLINE) {
            try {
                const [userCount, logCount] = await Promise.all([
                    authDb.user.count(),
                    opsDb.systemLog.count()
                ]);
                stats.userCount = userCount;
                stats.logCount = logCount;
            } catch {
                stats.dbStatus = 'PostgreSQL connection error';
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
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function toolClawLs(args: any) {
    const check = validatePath(args?.path || '.', 'directory');
    if (!check.valid) return { success: false, error: check.error };

    try {
        const items = fs.readdirSync(check.fullPath!, { withFileTypes: true })
            .slice(0, MAX_DIRECTORY_ENTRIES)
            .map(entry => ({
                name: entry.name,
                type: entry.isSymbolicLink() ? 'symlink-blocked' : entry.isDirectory() ? 'directory' : 'file',
                accessible: !entry.isSymbolicLink() && !isSensitiveSegment(entry.name),
            }));
        return {
            success: true,
            path: check.relativePath || '.',
            truncated: items.length >= MAX_DIRECTORY_ENTRIES,
            items,
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function toolClawRead(args: any) {
    const check = validatePath(args?.path, 'file');
    if (!check.valid) return { success: false, error: check.error };
    if (!isAllowedTextFile(check.fullPath!)) {
        return { success: false, error: 'Loại tệp không nằm trong allowlist văn bản.' };
    }

    try {
        const stat = fs.statSync(check.fullPath!);
        if (stat.size > MAX_READ_BYTES) {
            return { success: false, error: `Tệp vượt giới hạn đọc ${MAX_READ_BYTES} byte.` };
        }
        const content = fs.readFileSync(check.fullPath!, 'utf8');
        return {
            success: true,
            path: check.relativePath,
            content: safeFileContent(content),
            truncated: content.length > 8_000,
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function toolClawGrep(args: any) {
    const pattern = sanitizeAiText(args?.pattern, MAX_PATTERN_CHARS);
    if (!pattern) return { success: false, error: 'Chuỗi tìm kiếm không được để trống.' };

    const check = validatePath(args?.path || '.', 'directory');
    if (!check.valid) return { success: false, error: check.error };

    const results: Array<{ path: string; line: number; content: string }> = [];
    const target = pattern.toLocaleLowerCase('vi');
    let scannedFiles = 0;

    function walk(directory: string) {
        if (results.length >= MAX_GREP_RESULTS || scannedFiles >= MAX_GREP_FILES) return;
        const entries = fs.readdirSync(directory, { withFileTypes: true });

        for (const entry of entries) {
            if (results.length >= MAX_GREP_RESULTS || scannedFiles >= MAX_GREP_FILES) break;
            if (entry.isSymbolicLink() || isSensitiveSegment(entry.name)) continue;

            const fullPath = path.join(directory, entry.name);
            const validated = validatePath(path.relative(process.cwd(), fullPath));
            if (!validated.valid) continue;

            if (entry.isDirectory()) {
                walk(validated.fullPath!);
                continue;
            }
            if (!entry.isFile() || !isAllowedTextFile(validated.fullPath!)) continue;

            const stat = fs.statSync(validated.fullPath!);
            if (stat.size > MAX_READ_BYTES) continue;
            scannedFiles += 1;

            const lines = fs.readFileSync(validated.fullPath!, 'utf8').split('\n');
            lines.forEach((line, index) => {
                if (results.length >= MAX_GREP_RESULTS) return;
                if (line.toLocaleLowerCase('vi').includes(target)) {
                    results.push({
                        path: validated.relativePath!,
                        line: index + 1,
                        content: safeFileContent(line.trim(), 200),
                    });
                }
            });
        }
    }

    try {
        walk(check.fullPath!);
        return {
            success: true,
            pattern,
            scannedFiles,
            truncated: results.length >= MAX_GREP_RESULTS || scannedFiles >= MAX_GREP_FILES,
            matches: results,
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
