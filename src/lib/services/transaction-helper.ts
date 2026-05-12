import prisma from '../prisma';
import { getMongoDb } from './mongo-client';
import { DB_CONFIG } from '../config/db-config';

export async function runDistributedTransaction<T>(
  pgOperation: (tx: any) => Promise<T>,
  mongoOperation: (db: any) => Promise<void>
): Promise<T> {
  if (DB_CONFIG.useFallback) {
    // In fallback mode, there is no real transaction, we just run them sequentially
    const pgResult = await pgOperation(null);
    const db = await getMongoDb();
    await mongoOperation(db);
    return pgResult;
  }

  if (!prisma) throw new Error('Prisma is not initialized');
  const db = await getMongoDb();
  // We assume MongoDB is a replica set and supports transactions
  // However, for single nodes, transactions might fail. We'll try-catch it.
  const client = db.client;
  const session = client.startSession();
  
  try {
    session.startTransaction();
    
    // First, run Postgres transaction
    const pgResult = await prisma.$transaction(async (tx: any) => {
      const result = await pgOperation(tx);
      // If Postgres succeeds, we try Mongo
      await mongoOperation(db);
      return result;
    });

    // If both succeeded without throwing, commit Mongo
    await session.commitTransaction();
    return pgResult;
  } catch (error) {
    // If anything fails, abort Mongo transaction (Prisma handles its own abort)
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}
