import { getMongoDb } from './mongo-client';
// @ts-ignore - Module will be available after npm install mongodb
import { ObjectId } from 'mongodb';
import { DB_CONFIG } from '../config/db-config';
import { readDb, writeDb } from '../json-db-service';

export interface AccountDoc {
  _id?: string | ObjectId;
  id?: string; // used for fallback mapping
  email: string;
  passwordHash: string;
  role: string;
  name: string;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
  status?: string;
}

export async function findAccountByEmail(email: string): Promise<AccountDoc | null> {
  if (DB_CONFIG.useFallback) {
    const db = readDb();
    const users = db.users || [];
    const user = users.find((u: any) => u.email === email);
    if (!user) return null;
    return {
      _id: user.id,
      id: user.id,
      email: user.email,
      passwordHash: user.password,
      role: user.role,
      name: user.name,
      department: user.department,
      status: user.status,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  const db = await getMongoDb();
  return db.collection<AccountDoc>('accounts').findOne({ email });
}

export async function findAccountById(id: string): Promise<AccountDoc | null> {
  if (DB_CONFIG.useFallback) {
    const db = readDb();
    const users = db.users || [];
    const user = users.find((u: any) => u.id === id);
    if (!user) return null;
    return {
      _id: user.id,
      id: user.id,
      email: user.email,
      passwordHash: user.password,
      role: user.role,
      name: user.name,
      department: user.department,
      status: user.status,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  const db = await getMongoDb();
  try {
    return await db.collection<AccountDoc>('accounts').findOne({ _id: new ObjectId(id) });
  } catch {
    // In case id is not a valid ObjectId (e.g. from legacy JSON data migrated to Mongo but kept as string)
    return await db.collection<AccountDoc>('accounts').findOne({ id: id } as any);
  }
}

export async function createAccount(data: Omit<AccountDoc, '_id' | 'createdAt' | 'updatedAt'>): Promise<AccountDoc> {
  const account: AccountDoc = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (DB_CONFIG.useFallback) {
    const db = readDb();
    if (!db.users) db.users = [];
    const newId = `user-${Date.now()}`;
    db.users.push({
      id: newId,
      email: data.email,
      password: data.passwordHash,
      role: data.role,
      name: data.name,
      department: data.department,
      status: data.status || 'active',
      isVerified: true
    });
    writeDb(db);
    account._id = newId;
    account.id = newId;
    return account;
  }

  const db = await getMongoDb();
  const result = await db.collection<AccountDoc>('accounts').insertOne(account);
  account._id = result.insertedId;
  return account;
}

export async function updateAccount(email: string, updateData: Partial<AccountDoc>): Promise<boolean> {
  if (DB_CONFIG.useFallback) {
    const db = readDb();
    const idx = (db.users || []).findIndex((u: any) => u.email === email);
    if (idx === -1) return false;
    
    if (updateData.passwordHash) db.users[idx].password = updateData.passwordHash;
    if (updateData.name) db.users[idx].name = updateData.name;
    if (updateData.role) db.users[idx].role = updateData.role;
    if (updateData.department) db.users[idx].department = updateData.department;
    if (updateData.status) db.users[idx].status = updateData.status;
    
    writeDb(db);
    return true;
  }

  const db = await getMongoDb();
  const result = await db.collection<AccountDoc>('accounts').updateOne(
    { email },
    { $set: { ...updateData, updatedAt: new Date() } }
  );
  return result.modifiedCount > 0;
}

export async function getAccounts(): Promise<AccountDoc[]> {
  if (DB_CONFIG.useFallback) {
    const db = readDb();
    return (db.users || []).map((u: any) => ({
      _id: u.id,
      id: u.id,
      email: u.email,
      passwordHash: u.password,
      role: u.role,
      name: u.name,
      department: u.department,
      status: u.status,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  }

  const db = await getMongoDb();
  return db.collection<AccountDoc>('accounts').find({}).toArray();
}
