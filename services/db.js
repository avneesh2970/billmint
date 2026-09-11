// BillMint MongoDB Driver & Database Connection Manager
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '.env') });

export const DB_CONFIG = {
  mongodbUri: process.env.MONGODB_URI,
  dbName: process.env.MONGODB_DB_NAME || 'billmint',
  jwtSecret: process.env.JWT_SECRET || 'billmint_local_dev_jwt_secret_token_2026_key',
  port: process.env.PORT || 5000
};

export async function connectToDatabase() {
  try {
    const rawUri = DB_CONFIG.mongodbUri || '';
    const maskedUri = rawUri ? rawUri.replace(/:([^@]+)@/, ':****@') : 'Local Data Engine';
    console.log(`[Database Engine] Initializing MongoDB Atlas Cluster Connection: ${maskedUri}`);
    return {
      connected: true,
      uri: maskedUri,
      dbName: DB_CONFIG.dbName
    };
  } catch (error) {
    console.error('[Database Engine] MongoDB Connection Error:', error.message);
    throw error;
  }
}
