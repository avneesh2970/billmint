import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
  id: String,
  description: String,
  hsnSac: String,
  quantity: Number,
  rate: Number,
  amount: Number,
  taxRate: Number
});

const invoiceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  invoiceNumber: { type: String, required: true },
  customerId: { type: String, default: '' },
  customerName: { type: String, required: true },
  customerEmail: { type: String, default: '' },
  customerGstin: { type: String, default: '' },
  customerState: { type: String, default: '' },
  customerStateCode: { type: String, default: '' },
  billingAddress: { type: String, default: '' },
  issueDate: { type: String, default: '' },
  dueDate: { type: String, default: '' },
  items: [invoiceItemSchema],
  subTotal: { type: Number, default: 0 },
  taxTotal: { type: Number, default: 0 },
  cgstAmount: { type: Number, default: 0 },
  sgstAmount: { type: Number, default: 0 },
  igstAmount: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  amountPaid: { type: Number, default: 0 },
  balanceDue: { type: Number, default: 0 },
  status: { type: String, default: 'Pending' },
  notes: { type: String, default: '' },
  terms: { type: String, default: '' },
  template: { type: String, default: 'Modern' },
  isEInvoice: { type: Boolean, default: false },
  irn: { type: String, default: '' },
  ackNo: { type: String, default: '' },
  ackDate: { type: String, default: '' },
  eWayBillNo: { type: String, default: '' }
}, { timestamps: true });

export const Invoice = mongoose.model('Invoice', invoiceSchema);
