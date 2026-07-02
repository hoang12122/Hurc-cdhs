import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { IS_DATABASE_OFFLINE } from '../config/database-mode';
import { createBackup } from '../services/backup-service';
import { clearStaleLocks } from './lock-recovery';
import { atomicWrite } from '../utils/atomic-write';

export interface JsonDbData {
  [key: string]: any[];
}

let _dbSnapshot: JsonDbData | null = null;
const DB_FILE_NAME = process.env.DATABASE_JSON_PATH || 'db.json';
const DB_PATH = path.join(process.cwd(), DB_FILE_NAME);
const LOCK_FILE = `${DB_PATH}.lock`;
let _debouncedWriteTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_WRITE_MS = 500;

export async function readRawDb(forceRefresh: boolean = false): Promise<JsonDbData> {
  if (_dbSnapshot && !forceRefresh) return _dbSnapshot;

  await clearStaleLocks(DB_PATH);

  try {
    try {
      await fs.access(DB_PATH, fs.constants.R_OK);
    } catch {
      console.warn(`[JSON-DB] File not found or not readable: ${DB_PATH}. Returning empty db.`);
      _dbSnapshot = {};
      return _dbSnapshot;
    }

    const content = await fs.readFile(DB_PATH, 'utf-8');

    try {
      const expectedChecksum = (await fs.readFile(`${DB_PATH}.sha256`, 'utf-8')).trim();
      const actualChecksum = crypto.createHash('sha256').update(content).digest('hex');
      if (expectedChecksum !== actualChecksum) {
        console.error(`🚨 [CRITICAL] BIT ROT DETECTED IN ${DB_FILE_NAME}! Checksum mismatch.`);
      }
    } catch {
      console.warn(`[JSON-DB] Checksum file missing for ${DB_FILE_NAME}.`);
    }

    try {
      const data = JSON.parse(content) as JsonDbData;
      _dbSnapshot = data;
      return data;
    } catch {
      console.error(`[JSON-DB] Invalid JSON format in ${DB_FILE_NAME}`);
      throw new Error('Unable to parse db.json. Please check JSON format for syntax errors.');
    }
  } catch (error: any) {
    throw new Error(error?.message || 'An unexpected error occurred while accessing the offline database.');
  }
}

async function acquireLock(maxRetries = 10, delay = 50): Promise<boolean> {
  for (let i = 0; i < maxRetries; i += 1) {
    try {
      await fs.writeFile(LOCK_FILE, process.pid.toString(), { flag: 'wx' });
      return true;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return false;
}

async function releaseLock(): Promise<void> {
  try {
    await fs.unlink(LOCK_FILE);
  } catch {
    // ignore stale/missing lock cleanup failures
  }
}

export async function writeJsonDb(data: JsonDbData): Promise<void> {
  if (!IS_DATABASE_OFFLINE && process.env.NODE_ENV === 'production') {
    console.error('[JSON-DB] BLOCK: Attempted to write to db.json in Online Production mode.');
    throw new Error('Offline database write operations are not allowed in production.');
  }

  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data provided to writeJsonDb.');
  }

  const locked = await acquireLock();
  if (!locked) {
    throw new Error('Database is currently busy (locked by another process). Please try again in a moment.');
  }

  try {
    try {
      await createBackup(DB_PATH);
    } catch (error) {
      console.warn('[JSON-DB] Backup failed before write, proceeding anyway:', error);
    }

    const content = JSON.stringify(data, null, 2);
    await atomicWrite(DB_PATH, content);
    _dbSnapshot = data;
  } finally {
    await releaseLock();
  }
}

export const writeRawDb = writeJsonDb;

export function scheduleDebouncedFlush(data: JsonDbData): void {
  _dbSnapshot = data;

  if (_debouncedWriteTimer) {
    clearTimeout(_debouncedWriteTimer);
  }

  _debouncedWriteTimer = setTimeout(async () => {
    try {
      await writeJsonDb(data);
    } catch (error) {
      console.error('[JSON-DB] Debounced flush to disk failed:', error);
    }
  }, DEBOUNCE_WRITE_MS);
}

export async function flushDbToDisk(): Promise<void> {
  if (_debouncedWriteTimer) {
    clearTimeout(_debouncedWriteTimer);
    _debouncedWriteTimer = null;
  }

  if (_dbSnapshot) {
    await writeJsonDb(_dbSnapshot);
  }
}

export const jsonDb = {
  async getCollection<T>(collectionName: string, autoCreate: boolean = false): Promise<T[]> {
    const db = await readRawDb();

    if (!db[collectionName]) {
      console.warn(`[JSON-DB] Collection '${collectionName}' not found in ${DB_FILE_NAME}.`);
      if (autoCreate) {
        console.info(`[JSON-DB] Auto-creating collection '${collectionName}'...`);
        db[collectionName] = [];
        await writeJsonDb(db);
      }
      return [] as T[];
    }

    return db[collectionName] as T[];
  },

  async findMany<T>(collection: string, filter?: (item: T) => boolean): Promise<T[]> {
    const items = await jsonDb.getCollection<T>(collection);
    return filter ? items.filter(filter) : items;
  },

  async findFirst<T>(collection: string, filter: (item: T) => boolean): Promise<T | null> {
    const items = await jsonDb.findMany<T>(collection, filter);
    return items.length > 0 ? items[0] : null;
  },

  async insertRecord<T extends { id?: string }>(collectionName: string, record: T): Promise<T> {
    const db = await readRawDb();
    if (!db[collectionName]) db[collectionName] = [];

    const id = record.id || crypto.randomUUID();
    const existingIndex = db[collectionName].findIndex((item: any) => item.id === id);

    if (existingIndex !== -1) {
      const existing = db[collectionName][existingIndex];
      if (existing.deletedAt) {
        db[collectionName].splice(existingIndex, 1);
      } else {
        throw new Error(`Record with ID ${id} already exists in collection '${collectionName}'.`);
      }
    }

    const now = new Date().toISOString();
    const newRecord = {
      ...record,
      id,
      createdAt: (record as any).createdAt || now,
      updatedAt: now,
    };

    db[collectionName].push(newRecord);
    await writeJsonDb(db);
    return newRecord as T;
  },

  async insert<T extends { id?: string }>(collection: string, item: T): Promise<T> {
    return jsonDb.insertRecord<T>(collection, item);
  },

  async updateRecord<T extends { id?: string }>(collectionName: string, id: string, patch: Partial<T>): Promise<T> {
    const db = await readRawDb();
    const items = (db[collectionName] || []) as T[];
    const index = items.findIndex((item: any) => item.id === id);

    if (index === -1) {
      throw new Error(`Record with ID ${id} not found in collection '${collectionName}'.`);
    }

    const updatedRecord = {
      ...items[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    items[index] = updatedRecord;
    db[collectionName] = items;
    await writeJsonDb(db);
    return updatedRecord;
  },

  async update<T>(collection: string, filter: (item: T) => boolean, updateData: Partial<T>): Promise<T[]> {
    const db = await readRawDb();
    const items = (db[collection] || []) as T[];
    const updatedItems: T[] = [];

    db[collection] = items.map((item) => {
      if (filter(item)) {
        const updated = {
          ...item,
          ...updateData,
          updatedAt: new Date().toISOString(),
        };
        updatedItems.push(updated);
        return updated;
      }
      return item;
    });

    await writeJsonDb(db);
    return updatedItems;
  },

  async applyFilters<T>(items: T[], filters: {
    keyword?: string;
    status?: string;
    stationId?: string;
    locationId?: string;
    equipmentId?: string;
    startDate?: string;
    endDate?: string;
    priority?: string;
    riskLevel?: string;
    isArchived?: boolean;
  }): Promise<T[]> {
    return items.filter((item: any) => {
      if (filters.isArchived !== undefined && item.isArchived !== filters.isArchived) return false;

      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        const searchableText = `${item.title || ''} ${item.description || ''} ${item.id || ''}`.toLowerCase();
        if (!searchableText.includes(keyword)) return false;
      }

      if (filters.status && item.status !== filters.status) return false;
      if (filters.stationId && item.stationId !== filters.stationId) return false;
      if (filters.locationId && !(item.locationIds || []).includes(filters.locationId)) return false;
      if (filters.equipmentId && item.equipmentId !== filters.equipmentId) return false;
      if (filters.priority && item.priority !== filters.priority) return false;
      if (filters.riskLevel && item.riskLevelId !== filters.riskLevel) return false;

      if (filters.startDate || filters.endDate) {
        const itemDate = new Date(item.date || item.createdAt || 0).getTime();
        if (filters.startDate && itemDate < new Date(filters.startDate).getTime()) return false;
        if (filters.endDate && itemDate > new Date(filters.endDate).getTime()) return false;
      }

      return true;
    });
  },

  async paginate<T>(items: T[], page: number = 1, pageSize: number = 10) {
    const p = Math.max(1, page);
    const ps = Math.max(1, pageSize);
    const total = items.length;
    const totalPages = Math.ceil(total / ps);
    const start = (p - 1) * ps;
    const end = start + ps;

    return {
      data: items.slice(start, end),
      total,
      page: p,
      pageSize: ps,
      totalPages,
    };
  },

  async delete<T>(collection: string, filter: (item: T) => boolean): Promise<number> {
    const db = await readRawDb();
    const items = (db[collection] || []) as T[];
    const initialCount = items.length;

    db[collection] = items.filter((item) => !filter(item));
    const deletedCount = initialCount - db[collection].length;

    await writeJsonDb(db);
    return deletedCount;
  },
};
