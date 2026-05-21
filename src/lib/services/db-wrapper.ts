// src/lib/services/db-wrapper.ts
import { opsDb } from '../db/ops-db';
import { aiDb } from '../db/ai-db';
import { CryptoUtility } from '../utils/crypto';
import { jsonDb } from '../db/json-db';
import { DB_CONFIG } from '../config/db-config';

export interface IDataProvider {
  findMany<T>(model: string, filter?: any, includeDeleted?: boolean): Promise<T[]>;
  findUnique<T>(model: string, id: string | number): Promise<T | null>;
  create<T>(model: string, data: any): Promise<T>;
  update<T>(model: string, id: string | number, data: any): Promise<T>;
  delete(model: string, id: string | number): Promise<void>;
  restore(model: string, id: string | number): Promise<void>;
  count(model: string, filter?: any, includeDeleted?: boolean): Promise<number>;
}

/**
 * Prisma implementation of Data Provider
 */
export class PrismaProvider implements IDataProvider {
  private client: any;

  constructor(client: any) {
    this.client = client;
  }

  private getModelClient(model: string): any {
    if (!this.client) throw new Error('Prisma Client is not initialized');
    if (this.client[model]) return this.client[model];
    const camelCased = model.charAt(0).toLowerCase() + model.slice(1);
    if (this.client[camelCased]) return this.client[camelCased];
    throw new Error(`Model '${model}' or its camelCase variant '${camelCased}' does not exist on the current Prisma client.`);
  }

  async findMany<T>(model: string, filter: any = {}, includeDeleted: boolean = false): Promise<T[]> {
    const modelClient = this.getModelClient(model);
    const where = includeDeleted ? filter : { ...filter, deletedAt: null };
    const results = await modelClient.findMany({ where });
    return results.map((item: any) => this.processItem(item, 'decrypt'));
  }
  
  async findUnique<T>(model: string, id: string | number): Promise<T | null> {
    const modelClient = this.getModelClient(model);
    const result = await modelClient.findUnique({ where: { id } });
    return result ? this.processItem(result, 'decrypt') : null;
  }

  async create<T>(model: string, data: any): Promise<T> {
    const modelClient = this.getModelClient(model);
    const processedData = this.processItem({ ...data }, 'encrypt');
    return await modelClient.create({ data: processedData });
  }

  async update<T>(model: string, id: string | number, data: any): Promise<T> {
    const modelClient = this.getModelClient(model);
    const processedData = this.processItem({ ...data }, 'encrypt');
    return await modelClient.update({ where: { id }, data: processedData });
  }

  private processItem(item: any, action: 'encrypt' | 'decrypt'): any {
    const targetFields = ['issueDetails', 'details', 'remarks', 'findings'];
    for (const field of targetFields) {
      if (item[field] && typeof item[field] === 'string') {
        try {
            if (action === 'encrypt') {
                item[field] = CryptoUtility.encrypt(item[field]);
            } else {
                item[field] = CryptoUtility.decrypt(item[field]);
            }
        } catch (e) { /* ignore crypto errors for malformed strings */ }
      }
    }
    return item;
  }

  async delete(model: string, id: string | number): Promise<void> {
    const modelClient = this.getModelClient(model);
    await modelClient.update({ 
      where: { id }, 
      data: { deletedAt: new Date() } 
    });
  }

  async restore(model: string, id: string | number): Promise<void> {
    const modelClient = this.getModelClient(model);
    await modelClient.update({ 
      where: { id }, 
      data: { deletedAt: null } 
    });
  }

  async count(model: string, filter: any = {}, includeDeleted: boolean = false): Promise<number> {
    const modelClient = this.getModelClient(model);
    const where = includeDeleted ? filter : { ...filter, deletedAt: null };
    return await modelClient.count({ where });
  }
}

/**
 * JSON implementation of Data Provider (Atomic Logic)
 */
export class JsonProvider implements IDataProvider {
  async findMany<T>(model: string, filter: any = {}, includeDeleted: boolean = false): Promise<T[]> {
    const collectionKey = this.resolveCollection(model);
    const collection = await jsonDb.getCollection<any>(collectionKey);
    
    let results = includeDeleted ? collection : collection.filter((item: any) => !item.deletedAt);

    if (filter) {
       results = results.filter((item: any) => {
         for (let key in filter) {
           const filterVal = filter[key];
           const itemVal = item[key];

           // Handle Prisma-style operators
           if (filterVal && typeof filterVal === 'object' && !Array.isArray(filterVal)) {
             const supportedOps = ['gte', 'lte', 'gt', 'lt', 'in', 'notIn', 'contains', 'has', 'hasSome'];
             const usedOps = Object.keys(filterVal);
             const unsupported = usedOps.filter(op => !supportedOps.includes(op));
             
             if (unsupported.length > 0) {
               console.warn(`[JsonProvider] Detected UNSUPPORTED Prisma operators in filter for model '${model}': ${unsupported.join(', ')}. Result might be inconsistent.`);
             }

             if (filterVal.gte !== undefined && new Date(itemVal) < new Date(filterVal.gte)) return false;
             if (filterVal.lte !== undefined && new Date(itemVal) > new Date(filterVal.lte)) return false;
             if (filterVal.gt !== undefined && new Date(itemVal) <= new Date(filterVal.gt)) return false;
             if (filterVal.lt !== undefined && new Date(itemVal) <= new Date(filterVal.lt)) return false;
             if (filterVal.in !== undefined && !filterVal.in.includes(itemVal)) return false;
             if (filterVal.notIn !== undefined && filterVal.notIn.includes(itemVal)) return false;
             if (filterVal.contains !== undefined && !String(itemVal || '').toLowerCase().includes(String(filterVal.contains).toLowerCase())) return false;
             
             // Array operators
             if (filterVal.has !== undefined && !(Array.isArray(itemVal) && itemVal.includes(filterVal.has))) return false;
             if (filterVal.hasSome !== undefined && !(Array.isArray(itemVal) && Array.isArray(filterVal.hasSome) && filterVal.hasSome.some((v: any) => itemVal.includes(v)))) return false;
             
             continue;
           }

           // Fallback to strict equality
           if (itemVal !== filterVal) return false;
         }
         return true;
       });
    }
    return results as T[];
  }
  
  async findUnique<T>(model: string, id: string | number): Promise<T | null> {
    const collectionKey = this.resolveCollection(model);
    const item = await jsonDb.findFirst<any>(collectionKey, (i: any) => String(i.id) === String(id));
    return item || null;
  }

  async create<T>(model: string, data: any): Promise<T> {
    const collectionKey = this.resolveCollection(model);
    const newItem = { 
      id: data.id || `JSON-${Date.now()}`, 
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null
    };
    return await jsonDb.insertRecord<any>(collectionKey, newItem) as T;
  }

  async update<T>(model: string, id: string | number, data: any): Promise<T> {
    const collectionKey = this.resolveCollection(model);
    const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
    };
    return await jsonDb.updateRecord<any>(collectionKey, id.toString(), updateData) as T;
  }

  async delete(model: string, id: string | number): Promise<void> {
    await this.update(model, id, { deletedAt: new Date().toISOString() });
  }

  async restore(model: string, id: string | number): Promise<void> {
    await this.update(model, id, { deletedAt: null });
  }

  async count(model: string, filter?: any, includeDeleted?: boolean): Promise<number> {
    const items = await this.findMany(model, filter, includeDeleted);
    return items.length;
  }

  private resolveCollection(model: string): string {
    // Mapping Prisma models to db.json collections
    const lower = model.toLowerCase();
    const mappings: Record<string, string> = {
        'DnfDocument': 'dnf_documents',
        'HazardRecord': 'hazards',
        'InspectionDetail': 'inspections',
        'CorrectiveAction': 'corrective_actions',
        'SystemLog': 'system_logs',
        'User': 'users',
        'MaintenanceStandard': 'maintenance_standards',
        'MaintenanceStandardItem': 'maintenance_standard_items',
        'ResponsibleUnit': 'responsible_units',
        'Subsystem': 'sub_systems',
        'PatrolLocation': 'patrol_locations',
        'TrustGraphNode': 'trust_graph_nodes',
        'TrustGraphEdge': 'trust_graph_edges',
        'AiAgent': 'ai_agents',
        'AiKnowledgeSnippet': 'ai_knowledge_snippets',
        'AiInsight': 'ai_insights',
        'AiSyncLog': 'ai_sync_logs',
        'AiVerificationLog': 'ai_verification_logs',
        'AiSafetyLog': 'ai_safety_logs',
        'AiRequestLog': 'ai_request_logs',
        'Comment': 'comments',
        'Improvement': 'improvements',
        'Task': 'tasks',
        'Asset': 'assets',
        'Equipment': 'equipment'
    };
    
    if (mappings[model]) return mappings[model];
    if (lower.endsWith('s')) return lower;
    return lower + 's';
  }
}

/**
 * Factory to get specific providers
 */
export function getOpsDbProvider(): IDataProvider {
  if (DB_CONFIG.useFallback) {
    return new JsonProvider();
  } else {
    return new PrismaProvider(opsDb);
  }
}

export function getAiDbProvider(): IDataProvider {
  if (DB_CONFIG.useFallback) {
    return new JsonProvider();
  } else {
    return new PrismaProvider(aiDb);
  }
}

export const opsDbProvider = getOpsDbProvider();
export const aiDbProvider = getAiDbProvider();
export const dbProvider = opsDbProvider;
