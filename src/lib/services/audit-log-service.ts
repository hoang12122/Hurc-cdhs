import { getMongoDb } from './mongo-client';
// @ts-ignore - Module will be available after npm install mongodb
import { ObjectId } from 'mongodb';

export interface AuditLog {
  _id?: string | ObjectId;
  action: string;
  performedBy: string; // account email or ID
  entityType?: string;
  entityId?: string;
  details?: any;
  timestamp: Date;
  ipAddress?: string;
  status: 'SUCCESS' | 'FAILURE' | 'PENDING';
}

export async function writeAuditLog(log: Omit<AuditLog, '_id' | 'timestamp'>): Promise<void> {
  const db = await getMongoDb();
  await db.collection<AuditLog>('audit_logs').insertOne({
    ...log,
    timestamp: new Date(),
  });
}

export async function getAuditLogs(filter: Partial<AuditLog> = {}, limit: number = 100): Promise<AuditLog[]> {
  const db = await getMongoDb();
  return db.collection<AuditLog>('audit_logs')
    .find(filter)
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();
}
