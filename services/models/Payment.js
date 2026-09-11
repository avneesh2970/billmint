import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  invoiceId: { type: String, required: true },
  invoiceNumber: { type: String, default: '' },
  customerName: { type: String, default: '' },
  amount: { type: Number, required: true },
  paymentDate: { type: String, default: '' },
  paymentMethod: { type: String, default: 'UPI' },
  transactionId: { type: String, default: '' },
  notes: { type: String, default: '' }
}, { timestamps: true });

export const Payment = mongoose.model('Payment', paymentSchema);
