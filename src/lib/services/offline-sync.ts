export interface OfflineAction {
    id: string;
    type: 'DNF_CREATE' | 'HAZARD_CREATE' | 'INSPECTION_CREATE' | 'STATUS_UPDATE' | 'EDGE_INFERENCE_SYNC';
    entityType: 'DNF' | 'HAZARD' | 'INSPECTION';
    data: any;
    timestamp: number;
}

class OfflineSyncService {
    private dbName = 'hurc-offline-db';
    private storeName = 'offline-actions';
    private db: IDBDatabase | null = null;

    async init() {
        if (typeof window === 'undefined') return;
        
        return new Promise<void>((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event: any) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'id' });
                }
            };
        });
    }

    async addAction(action: Omit<OfflineAction, 'id' | 'timestamp'>) {
        await this.ensureDb();
        const fullAction: OfflineAction = {
            ...action,
            id: crypto.randomUUID(),
            timestamp: Date.now()
        };

        return new Promise<void>((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(fullAction);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getActions(): Promise<OfflineAction[]> {
        await this.ensureDb();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async removeAction(id: string) {
        await this.ensureDb();
        return new Promise<void>((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    private async ensureDb() {
        if (!this.db) {
            await this.init();
        }
    }
}

export const offlineSync = new OfflineSyncService();
