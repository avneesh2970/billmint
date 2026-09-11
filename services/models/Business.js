import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  name: { type: String, default: 'My Business' },
  businessType: { type: String, default: 'Agency / Service Provider' },
  logo: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  website: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: 'Karnataka' },
  stateCode: { type: String, default: '29' },
  country: { type: String, default: 'India' },
  pincode: { type: String, default: '' },
  gstin: { type: String, default: '' },
  pan: { type: String, default: '' },
  taxType: { type: String, default: 'GST' },
  defaultTaxRate: { type: Number, default: 18 },
  bankDetails: {
    bankName: { type: String, default: '' },
    accountName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifsc: { type: String, default: '' },
    upiId: { type: String, default: '' }
  },
  invoicePrefix: { type: String, default: 'INV-2026-' },
  nextInvoiceNumber: { type: Number, default: 1 },
  defaultTerms: { type: String, default: '1. Payment due within 15 days of invoice date.' },
  defaultNotes: { type: String, default: 'Thank you for your business!' }
}, { timestamps: true });

export const Business = mongoose.model('Business', businessSchema);
