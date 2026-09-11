import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGODB_URI;

console.log('Testing connection to MongoDB Atlas cluster...');
console.log('URI:', uri ? uri.replace(/:([^@]+)@/, ':****@') : 'NOT SET');

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('Database Name:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('State:', mongoose.connection.readyState);
    return mongoose.connection.close();
  })
  .catch((err) => {
    console.error('❌ Connection Failed:', err.message);
  });
