// @ts-ignore - Module will be available after npm install mongodb
import { MongoClient, Db } from 'mongodb';
import { DB_CONFIG } from '../config/db-config';
import { logToFullStack } from '../logger';

let client: MongoClient | null = null;

export async function getMongoDb(): Promise<Db> {
  if (!client) {
    await logToFullStack('info', `Connecting to MongoDB at ${DB_CONFIG.mongo.uri}`, { component: 'MongoClient' });
    client = new MongoClient(DB_CONFIG.mongo.uri, {
      serverSelectionTimeoutMS: 5000,
    });
    try {
      await client.connect();
      await logToFullStack('info', 'Successfully connected to MongoDB', { component: 'MongoClient' });
    } catch (error) {
      await logToFullStack('error', 'Failed to connect to MongoDB', { component: 'MongoClient', error });
      throw error;
    }
  }
  return client.db(DB_CONFIG.mongo.dbName);
}

export async function closeMongoDb(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    await logToFullStack('info', 'MongoDB connection closed', { component: 'MongoClient' });
  }
}
