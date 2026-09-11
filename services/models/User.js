import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, default: 'USER' },
  businessName: { type: String, default: '' },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
