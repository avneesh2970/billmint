import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI;

async function wipeDatabase() {
  try {
    console.log('🧹 Connecting to MongoDB Atlas cluster to wipe database collections...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas:', mongoose.connection.name);

    const collections = await mongoose.connection.db.collections();
    for (const col of collections) {
      console.log(`Deleting all documents from collection: ${col.collectionName}...`);
      await col.deleteMany({});
    }

    console.log('✅ All MongoDB collections wiped successfully.');

    // Also wipe local data_store.json file
    const dataStoreFile = path.join(__dirname, '../services/data_store.json');
    const cleanStore = {
      business: {
        id: 'bus_prod_001',
        name: 'My Business',
        businessType: 'Agency / Service Provider',
        logo: '',
        email: 'contact@mybusiness.com',
        phone: '',
        website: '',
        address: '',
        city: '',
        state: 'Karnataka',
        stateCode: '29',
        country: 'India',
        pincode: '',
        gstin: '',
        pan: '',
        taxType: 'GST',
        defaultTaxRate: 18,
        bankDetails: { bankName: '', accountName: '', accountNumber: '', ifsc: '', upiId: '' },
        invoicePrefix: 'INV-2026-',
        nextInvoiceNumber: 1,
        defaultTerms: '1. Payment due within 15 days of invoice date.\n2. Please mention Invoice Number in UPI/Bank transfer notes.',
        defaultNotes: 'Thank you for your business!'
      },
      customers: [],
      products: [],
      invoices: [],
      payments: [],
      recurringInvoices: [],
      vendors: [],
      purchaseBills: []
    };

    fs.writeFileSync(dataStoreFile, JSON.stringify(cleanStore, null, 2));
    console.log('✅ Local services/data_store.json reset to clean state.');

    await mongoose.connection.close();
    console.log('🎉 Full clean platform reset complete!');
  } catch (err) {
    console.error('❌ Wipe Error:', err.message);
    process.exit(1);
  }
}

wipeDatabase();
