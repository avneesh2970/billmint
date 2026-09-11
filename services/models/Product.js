import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  sku: { type: String, default: '' },
  description: { type: String, default: '' },
  hsnSac: { type: String, default: '' },
  price: { type: Number, default: 0 },
  unit: { type: String, default: 'hrs' },
  taxRate: { type: Number, default: 18 }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
