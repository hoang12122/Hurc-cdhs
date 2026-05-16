import { promises as fs } from 'fs';
import { join } from 'path';
import { SystemLog } from '@/lib/types';

// Base logs directory
const LOGS_BASE_DIR = join(process.cwd(), 'logs');

/** Resolve file paths for a given category (default 'system') */
function getLogPaths(category: string = 'system') {
  const dir = join(LOGS_BASE_DIR, category);
  const textPath = join(dir, 'log.txt');
  const jsonlPath = join(dir, 'log.jsonl');
  return { dir, textPath, jsonlPath };
}

/** Ensure a specific log directory exists */
async function ensureLogDir(category: string = 'system') {
  const { dir } = getLogPaths(category);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    console.error('[LOG-WRITER] Failed to create log directory', e);
  }
}

// (Deprecated) ensureLogDir now handled with category

/** Read/Write Mutex Queue for Race Condition Prevention */
let logWriteQueue: Promise<void> = Promise.resolve();

/** Append a SystemLog entry to a category-specific log */
export async function appendLog(entry: SystemLog, asJsonl = true, category: string = 'system'): Promise<void> {
  const op = async () => {
      await ensureLogDir(category);
      const { textPath, jsonlPath } = getLogPaths(category);
      const timestamp = new Date(entry.timestamp).toISOString();
      const textLine = `[${timestamp}] ${entry.level?.toUpperCase() ?? 'INFO'} ${entry.action}: ${entry.details}\n`;
      await fs.appendFile(textPath, textLine, 'utf8');
      if (asJsonl) {
        const jsonLine = JSON.stringify({ ...entry, timestamp }) + '\n';
        await fs.appendFile(jsonlPath, jsonLine, 'utf8');
      }
  };

  // Queue the operation to prevent Concurrent Write Corruption (Race Condition)
  logWriteQueue = logWriteQueue.then(op).catch(e => {
      console.error("[LOG-WRITER] Queue write error:", e);
  });
  
  return logWriteQueue;
}

/** Read all logs from a specific category (default 'system') */
export async function readAllLogs(category: string = 'system'): Promise<SystemLog[]> {
  await ensureLogDir(category);
  const { textPath, jsonlPath } = getLogPaths(category);
  try {
    const data = await fs.readFile(jsonlPath, 'utf8');
    return data
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as SystemLog);
  } catch {
    // Fallback to plain‑text log
    try {
      const txt = await fs.readFile(textPath, 'utf8');
      const lines = txt.trim().split('\n').filter(Boolean);
      return lines.map((ln) => {
        const m = /^\[(.+?)\] (\w+) (.+?): (.+)$/.exec(ln);
        if (!m) return null as any;
        const [, ts, level, action, details] = m;
        return { timestamp: ts, level, action, details } as SystemLog;
      }).filter(Boolean) as SystemLog[];
    } catch {
      return [];
    }
  }
}

/** Clear logs for a specific category (default 'system') */
export async function clearLogs(category: string = 'system'): Promise<void> {
  await ensureLogDir(category);
  const { textPath, jsonlPath } = getLogPaths(category);
  await Promise.all([fs.writeFile(textPath, ''), fs.writeFile(jsonlPath, '')]);
}
