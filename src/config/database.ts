
import { MongoClient, Db } from 'mongodb';

// MongoDB connection configuration
const MONGODB_URI = ''; // Add your MongoDB URI here
const DATABASE_NAME = 'whaot_platform';

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectToDatabase = async (): Promise<Db> => {
  if (db) {
    return db;
  }

  if (!MONGODB_URI) {
    throw new Error('MongoDB URI not configured');
  }

  client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DATABASE_NAME);
  
  console.log('Connected to MongoDB');
  return db;
};

export const getDatabase = (): Db => {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
};

export const closeDatabase = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
};
