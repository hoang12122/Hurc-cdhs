import fs from 'fs/promises';
import path from 'path';
import { IS_DATABASE_OFFLINE } from '../config/database-mode';

/**
 * PHASE 2 - TASK 2.1: JSON-DB Helper Layer
 * Centralized utility for reading and writing to db.json.
 */

const DB_FILE_NAME = process.env.DATABASE_JSON_PATH || 'db.json';
const DB_PATH = path.join(process.cwd(), DB_FILE_NAME);

export interface JsonDbData {
  [key: string]: any[];
}

/**
 * Low-level: Read the entire database file
 * PHASE 2 - TASK 2.2: Robust JSON reading
 */
export async function readRawDb(): Promise<JsonDbData> {
  try {
    // 1. Kiểm tra file có tồn tại và có quyền đọc không
    try {
      await fs.access(DB_PATH, fs.constants.R_OK);
    } catch (err) {
      console.error(`[JSON-DB] File not found or not readable: ${DB_PATH}`);
      throw new Error("Unable to read db.json. File does not exist at specified path.");
    }

    // 2. Đọc nội dung file
    const content = await fs.readFile(DB_PATH, 'utf-8');
    
    // 3. Parse JSON với kiểm tra định dạng
    try {
      return JSON.parse(content);
    } catch (err) {
      console.error(`[JSON-DB] Invalid JSON format in ${DB_FILE_NAME}`);
      throw new Error("Unable to parse db.json. Please check JSON format for syntax errors.");
    }
  } catch (error: any) {
    // Trả lỗi thân thiện, không kèm stack trace ra ngoài
    const friendlyMessage = error.message || "An unexpected error occurred while accessing the offline database.";
    throw new Error(friendlyMessage);
  }
}

const LOCK_FILE = `${DB_PATH}.lock`;

/**
 * Acquire a file lock (Phase 4: Data Integrity)
 */
async function acquireLock(maxRetries = 10, delay = 50): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      // wx flag: fails if file exists
      await fs.writeFile(LOCK_FILE, process.pid.toString(), { flag: 'wx' });
      return true;
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
}

/**
 * Release a file lock
 */
async function releaseLock(): Promise<void> {
  try {
    await fs.unlink(LOCK_FILE);
  } catch (e) { /* ignore */ }
}

/**
 * Low-level: Write the entire database file
 * PHASE 2 - TASK 2.3: Safe JSON writing with ATOMIC LOCKING
 */
export async function writeJsonDb(data: JsonDbData): Promise<void> {
  // 1. Chặn tuyệt đối ghi vào JSON trong môi trường production online
  if (!IS_DATABASE_OFFLINE && process.env.NODE_ENV === 'production') {
    console.error("[JSON-DB] BLOCK: Attempted to write to db.json in Online Production mode.");
    throw new Error("Offline database write operations are not allowed in production.");
  }
  
  // 2. Kiểm tra tính hợp lệ của dữ liệu
  if (!data || typeof data !== 'object') {
    throw new Error("Invalid data provided to writeJsonDb.");
  }

  // 3. Acquire Lock to prevent race conditions
  const locked = await acquireLock();
  if (!locked) {
    throw new Error("Database is currently busy (locked by another process). Please try again in a moment.");
  }

  try {
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(DB_PATH, content, 'utf-8');
  } catch (error: any) {
    console.error(`[JSON-DB] Write failed for ${DB_FILE_NAME}:`, error);
    throw error;
  } finally {
    await releaseLock();
  }
}

// Alias for backward compatibility if needed within this file
export const writeRawDb = writeJsonDb;

/**
 * High-level Helper for common operations
 */
export const jsonDb = {
  /**
   * Get all items from a collection (PHASE 2 - TASK 2.4)
   * Safely returns an empty array if collection doesn't exist.
   */
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

  /**
   * Get all items from a collection with optional filtering
   */
  async findMany<T>(collection: string, filter?: (item: T) => boolean): Promise<T[]> {
    const items = await this.getCollection<T>(collection);
    if (filter) {
      return items.filter(filter);
    }
    return items;
  },

  /**
   * Find a single item by predicate
   */
  async findFirst<T>(collection: string, filter: (item: T) => boolean): Promise<T | null> {
    const items = await this.findMany<T>(collection, filter);
    return items.length > 0 ? items[0] : null;
  },

  /**
   * Insert a new record into a collection (PHASE 2 - TASK 2.5)
   * Auto-generates UUID and timestamps if missing.
   */
  async insertRecord<T extends { id?: string }>(collectionName: string, record: T): Promise<T> {
    const db = await readRawDb();
    if (!db[collectionName]) db[collectionName] = [];
    
    // 1. Tự sinh UUID nếu chưa có id (Sử dụng crypto.randomUUID() chuẩn Node.js)
    const id = record.id || (await import('crypto')).randomUUID();
    
    // 2. Kiểm tra trùng lặp ID để tránh ghi đè bản ghi cũ
    if (db[collectionName].some((item: any) => item.id === id)) {
      throw new Error(`Record with ID ${id} already exists in collection '${collectionName}'.`);
    }

    const now = new Date().toISOString();
    
    // 3. Chuẩn hóa bản ghi với audit fields
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

  /**
   * Legacy alias for insertRecord
   */
  async insert<T extends { id?: string }>(collection: string, item: any): Promise<T> {
    return this.insertRecord<T>(collection, item);
  },

  /**
   * Update a record by ID (PHASE 2 - TASK 2.6)
   * Performs a partial update (merge).
   */
  async updateRecord<T extends { id?: string }>(collectionName: string, id: string, patch: Partial<T>): Promise<T> {
    const db = await readRawDb();
    const items = (db[collectionName] || []) as T[];
    
    const index = items.findIndex((item: any) => item.id === id);
    if (index === -1) {
      throw new Error(`Record with ID ${id} not found in collection '${collectionName}'.`);
    }

    // 1. Hợp nhất dữ liệu cũ và mới (Merge patch)
    const updatedRecord = {
      ...items[index],
      ...patch,
      updatedAt: new Date().toISOString() // 2. Tự động cập nhật thời gian
    };

    items[index] = updatedRecord;
    db[collectionName] = items;
    
    await writeJsonDb(db);
    return updatedRecord;
  },

  /**
   * Update items matching a predicate (Bulk update supported)
   */
  async update<T>(collection: string, filter: (item: T) => boolean, updateData: Partial<T>): Promise<T[]> {
    const db = await readRawDb();
    const items = (db[collection] || []) as T[];
    const updatedItems: T[] = [];

    const newCollection = items.map(item => {
      if (filter(item)) {
        const updated = { 
          ...item, 
          ...updateData, 
          updatedAt: new Date().toISOString() 
        };
        updatedItems.push(updated);
        return updated;
      }
      return item;
    });

    db[collection] = newCollection;
    await writeJsonDb(db);
    return updatedItems;
  },

  /**
   * Advanced Filtering for CRM Collections (PHASE 2 - TASK 2.8)
   */
  async applyFilters<T>(items: T[], filters: {
    keyword?: string;
    status?: string;
    stationId?: string;
    locationId?: string; // Tương đương stationId
    equipmentId?: string;
    startDate?: string;
    endDate?: string;
    priority?: string;
    riskLevel?: string;
    isArchived?: boolean;
  }): Promise<T[]> {
    return items.filter((item: any) => {
      // 0. Lọc theo isArchived
      if (filters.isArchived !== undefined && item.isArchived !== filters.isArchived) return false;

      // 1. Lọc theo Keyword (Search)
      if (filters.keyword) {
        const k = filters.keyword.toLowerCase();
        const searchableText = `${item.title || ''} ${item.description || ''} ${item.id || ''}`.toLowerCase();
        if (!searchableText.includes(k)) return false;
      }

      // 2. Lọc theo Status
      if (filters.status && item.status !== filters.status) return false;

      // 3. Lọc theo Ga (Location/Station)
      if (filters.stationId && item.stationId !== filters.stationId) return false;
      if (filters.locationId && !(item.locationIds || []).includes(filters.locationId)) return false;

      // 4. Lọc theo Thiết bị
      if (filters.equipmentId && item.equipmentId !== filters.equipmentId) return false;

      // 5. Lọc theo Độ ưu tiên / Mức rủi ro
      if (filters.priority && item.priority !== filters.priority) return false;
      if (filters.riskLevel && item.riskLevelId !== filters.riskLevel) return false;

      // 6. Lọc theo Khoảng thời gian (Date Range)
      if (filters.startDate || filters.endDate) {
        const itemDate = new Date(item.date || item.createdAt || 0).getTime();
        if (filters.startDate && itemDate < new Date(filters.startDate).getTime()) return false;
        if (filters.endDate && itemDate > new Date(filters.endDate).getTime()) return false;
      }

      return true;
    });
  },

  /**
   * Paginate a collection of items (PHASE 2 - TASK 2.7)
   * Mimics standard database pagination response.
   */
  async paginate<T>(items: T[], page: number = 1, pageSize: number = 10) {
    const p = Math.max(1, page);
    const ps = Math.max(1, pageSize);
    const total = items.length;
    const totalPages = Math.ceil(total / ps);
    
    const start = (p - 1) * ps;
    const end = start + ps;
    const data = items.slice(start, end);

    return {
      data,
      total,
      page: p,
      pageSize: ps,
      totalPages
    };
  },

  /**
   * Delete items matching a predicate
   */
  async delete<T>(collection: string, filter: (item: T) => boolean): Promise<number> {
    const db = await readRawDb();
    const items = (db[collection] || []) as T[];
    const initialCount = items.length;
    
    db[collection] = items.filter(item => !filter(item));
    const deletedCount = initialCount - db[collection].length;
    
    await writeJsonDb(db);
    return deletedCount;
  }
};
