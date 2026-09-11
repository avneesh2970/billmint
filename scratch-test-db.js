import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from process.cwd()
dotenv.config({ path: path.join(process.cwd(), '.env') });

const uri = process.env.MONGODB_URI || "mongodb://avneesh:Avneesh%40123@cluster0-shard-00-00.ge7kx.mongodb.net:27017,cluster0-shard-00-01.ge7kx.mongodb.net:27017,cluster0-shard-00-02.ge7kx.mongodb.net:27017/billmint?ssl=true&replicaSet=atlas-rs4nz6-shard-0&authSource=admin&appName=Cluster0";

console.log("Testing MongoDB URI:", uri.replace(/:([^@]+)@/, ':****@'));

async function checkConnection() {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("SUCCESS_CONNECTED_TO_MONGODB_ATLAS");
    console.log("Connection State:", mongoose.connection.readyState); // 1 = connected
    console.log("Host:", mongoose.connection.host);
    console.log("DB Name:", mongoose.connection.name);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("CONNECTION_ERROR:", err.message);
    process.exit(1);
  }
}

checkConnection();
