import fs from 'node:fs';
import path from 'node:path';
import { redactSensitiveData, sanitizeAiText } from '../services/ai/control-plane';

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
    if (!isWithinRoot(root, resolved)) return { valid: false, error: 'Truy cập ngoài phạm vi dự án bị từ chối.' };
    if (!fs.existsSync(resolved)) return { valid: false, error: 'Đường dẫn không tồn tại.' };

    const realPath = fs.realpathSync(resolved);
    if (!isWithinRoot(root, realPath)) return { valid: false, error: 'Symlink dẫn ra ngoài phạm vi dự án bị từ chối.' };

    const relativePath = path.relative(root, realPath);
    if (relativePath.split(path.sep).filter(Boolean).some(isSensitiveSegment)) {
      return { valid: false, error: 'Đường dẫn nhạy cảm bị từ chối theo chính sách AI read-only.' };
    }

    const stat = fs.statSync(realPath);
    if (expectedType === 'file' && !stat.isFile()) return { valid: false, error: 'Đường dẫn không phải là tệp.' };
    if (expectedType === 'directory' && !stat.isDirectory()) return { valid: false, error: 'Đường dẫn không phải là thư mục.' };
    return { valid: true, fullPath: realPath, relativePath };
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : String(error) };
  }
}

function isAllowedTextFile(filePath: string): boolean {
  const baseName = path.basename(filePath).toLowerCase();
  return baseName === 'dockerfile' || ALLOWED_TEXT_EXTENSIONS.has(path.extname(baseName));
}

function safeFileContent(content: string, maxChars = 8_000): string {
  return redactSensitiveData(sanitizeAiText(content, maxChars)).text;
}

export async function toolClawLs(args: any) {
  const check = validatePath(args?.path || '.', 'directory');
  if (!check.valid) return { success: false, error: check.error };

  try {
    const entries = fs.readdirSync(check.fullPath!, { withFileTypes: true });
    const items = entries.slice(0, MAX_DIRECTORY_ENTRIES).map(entry => ({
      name: entry.name,
      type: entry.isSymbolicLink() ? 'symlink-blocked' : entry.isDirectory() ? 'directory' : 'file',
      accessible: !entry.isSymbolicLink() && !isSensitiveSegment(entry.name),
    }));
    return {
      success: true,
      path: check.relativePath || '.',
      truncated: entries.length > MAX_DIRECTORY_ENTRIES,
      items,
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function toolClawRead(args: any) {
  const check = validatePath(args?.path, 'file');
  if (!check.valid) return { success: false, error: check.error };
  if (!isAllowedTextFile(check.fullPath!)) return { success: false, error: 'Loại tệp không nằm trong allowlist văn bản.' };

  try {
    const stat = fs.statSync(check.fullPath!);
    if (stat.size > MAX_READ_BYTES) return { success: false, error: `Tệp vượt giới hạn đọc ${MAX_READ_BYTES} byte.` };
    const content = fs.readFileSync(check.fullPath!, 'utf8');
    return {
      success: true,
      path: check.relativePath,
      content: safeFileContent(content),
      truncated: content.length > 8_000,
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function toolClawGrep(args: any) {
  const pattern = sanitizeAiText(args?.pattern, MAX_PATTERN_CHARS);
  if (!pattern) return { success: false, error: 'Chuỗi tìm kiếm không được để trống.' };
  const check = validatePath(args?.path || '.', 'directory');
  if (!check.valid) return { success: false, error: check.error };

  const results: Array<{ path: string; line: number; content: string }> = [];
  const target = pattern.toLocaleLowerCase('vi');
  let scannedFiles = 0;

  function walk(directory: string): void {
    if (results.length >= MAX_GREP_RESULTS || scannedFiles >= MAX_GREP_FILES) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (results.length >= MAX_GREP_RESULTS || scannedFiles >= MAX_GREP_FILES) break;
      if (entry.isSymbolicLink() || isSensitiveSegment(entry.name)) continue;

      const validated = validatePath(path.relative(process.cwd(), path.join(directory, entry.name)));
      if (!validated.valid) continue;
      if (entry.isDirectory()) {
        walk(validated.fullPath!);
        continue;
      }
      if (!entry.isFile() || !isAllowedTextFile(validated.fullPath!)) continue;
      if (fs.statSync(validated.fullPath!).size > MAX_READ_BYTES) continue;
      scannedFiles += 1;

      fs.readFileSync(validated.fullPath!, 'utf8').split('\n').forEach((line, index) => {
        if (results.length < MAX_GREP_RESULTS && line.toLocaleLowerCase('vi').includes(target)) {
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
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
