import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { Business } from '../models/Business.js';
import { Customer } from '../models/Customer.js';
import { Invoice } from '../models/Invoice.js';
import { Product } from '../models/Product.js';
import { Payment } from '../models/Payment.js';
import { User } from '../models/User.js';
import { getStore, updateStore } from '../db-store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'billmint_super_secret_jwt_key_2026';
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
let isMongoConnected = false;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      isMongoConnected = true;
      console.log(`[API GATEWAY] ✅ Connected to MongoDB Atlas cluster: ${mongoose.connection.name}`);
    })
    .catch((err) => {
      console.warn(`[API GATEWAY] ⚠️ MongoDB Atlas connection notice: ${err.message}. Using local store fallback.`);
    });
}

// Logger middleware
app.use((req, res, next) => {
  console.log(`[API GATEWAY] ${req.method} ${req.url}`);
  next();
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required. Please login.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired session token.' });
    }
    req.user = user;
    next();
  });
};

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'API Gateway',
    database: isMongoConnected ? 'MongoDB Atlas (CONNECTED)' : 'Local File Store',
    timestamp: new Date()
  });
});

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
  const { fullName, email, password, phone, businessName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!isMongoConnected) {
    return res.status(503).json({ message: 'Database not connected. Cannot register at this time.' });
  }

  try {
    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userId = `usr_${Date.now()}`;
    const newUser = await User.create({
      id: userId,
      fullName: fullName || 'New Business Owner',
      email: cleanEmail,
      passwordHash,
      phone: phone || '',
      businessName: businessName || '',
      role: 'USER',
      status: 'Active'
    });

    // Create default isolated business profile for tenant
    await Business.create({
      userId,
      name: businessName || `${fullName || 'My'} Business`,
      email: cleanEmail
    });

    const userPayload = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ token, user: userPayload, message: 'Registration successful!' });
  } catch (err) {
    console.error('Mongo Registration error:', err.message);
    return res.status(500).json({ message: 'Registration failed due to server error.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!isMongoConnected) {
    return res.status(503).json({ message: 'Database not connected. Cannot authenticate at this time.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const dbUser = await User.findOne({ email: cleanEmail });
    if (!dbUser) {
      return res.status(401).json({ message: 'User not registered. Please sign up first.' });
    }

    const isMatch = await bcrypt.compare(password, dbUser.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Incorrect password.' });
    }

    const userPayload = {
      id: dbUser.id,
      fullName: dbUser.fullName,
      email: dbUser.email,
      role: dbUser.role
    };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: userPayload, message: 'Login successful' });
  } catch (err) {
    console.error('Mongo Login error:', err.message);
    return res.status(500).json({ message: 'Authentication server error' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// MULTI-TENANT ISOLATED BUSINESS ROUTES
app.get('/api/business', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    if (isMongoConnected) {
      let b = await Business.findOne({ userId });
      if (!b) {
        b = await Business.create({ userId, name: `${req.user.fullName || 'My'} Business`, email: req.user.email });
      }
      return res.json(b);
    }
  } catch (err) {
    console.error('Mongo Business error:', err.message);
  }
  const store = getStore();
  res.json(store.business);
});

app.put('/api/business', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    if (isMongoConnected) {
      const b = await Business.findOneAndUpdate(
        { userId },
        { $set: { ...req.body, userId } },
        { new: true, upsert: true }
      );
      updateStore('business', b.toObject());
      return res.json({ message: 'Business settings updated', business: b });
    }
  } catch (err) {
    console.error('Mongo Business PUT error:', err.message);
  }
  const store = getStore();
  const updated = { ...store.business, ...req.body };
  updateStore('business', updated);
  res.json({ message: 'Business settings updated', business: updated });
});

// MULTI-TENANT ISOLATED CUSTOMER ROUTES
app.get('/api/customers', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    if (isMongoConnected) {
      const customers = await Customer.find({ userId }).sort({ createdAt: -1 });
      return res.json(customers);
    }
  } catch (err) {
    console.error('Mongo Customer GET error:', err.message);
  }
  const store = getStore();
  res.json(store.customers || []);
});

app.post('/api/customers', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const newCust = {
    id: req.body.id || `cust_${Date.now()}`,
    userId,
    ...req.body
  };
  try {
    if (isMongoConnected) {
      const created = await Customer.create(newCust);
      return res.status(201).json(created);
    }
  } catch (err) {
    console.error('Mongo Customer POST error:', err.message);
  }
  const store = getStore();
  const list = [newCust, ...(store.customers || [])];
  updateStore('customers', list);
  res.status(201).json(newCust);
});

app.delete('/api/customers/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    if (isMongoConnected) {
      await Customer.deleteOne({ id: req.params.id, userId });
      return res.json({ message: 'Customer deleted successfully' });
    }
  } catch (err) {
    console.error('Mongo Customer DELETE error:', err.message);
  }
  const store = getStore();
  const list = (store.customers || []).filter(c => c.id !== req.params.id);
  updateStore('customers', list);
  res.json({ message: 'Customer deleted successfully' });
});

// MULTI-TENANT ISOLATED INVOICE ROUTES
app.get('/api/invoices', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    if (isMongoConnected) {
      const invoices = await Invoice.find({ userId }).sort({ createdAt: -1 });
      return res.json(invoices);
    }
  } catch (err) {
    console.error('Mongo Invoice GET error:', err.message);
  }
  const store = getStore();
  res.json(store.invoices || []);
});

app.post('/api/invoices', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const newInv = {
    id: req.body.id || `inv_${Date.now()}`,
    userId,
    ...req.body
  };
  try {
    if (isMongoConnected) {
      const created = await Invoice.findOneAndUpdate(
        { id: newInv.id, userId },
        { $set: newInv },
        { new: true, upsert: true }
      );
      return res.status(201).json(created);
    }
  } catch (err) {
    console.error('Mongo Invoice POST error:', err.message);
  }
  const store = getStore();
  const exists = (store.invoices || []).some(i => i.id === newInv.id);
  const list = exists 
    ? store.invoices.map(i => i.id === newInv.id ? newInv : i) 
    : [newInv, ...(store.invoices || [])];
  updateStore('invoices', list);
  res.status(201).json(newInv);
});

app.delete('/api/invoices/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    if (isMongoConnected) {
      await Invoice.deleteOne({ id: req.params.id, userId });
      return res.json({ message: 'Invoice deleted successfully' });
    }
  } catch (err) {
    console.error('Mongo Invoice DELETE error:', err.message);
  }
  const store = getStore();
  const list = (store.invoices || []).filter(i => i.id !== req.params.id);
  updateStore('invoices', list);
  res.json({ message: 'Invoice deleted successfully' });
});

// MULTI-TENANT ISOLATED PRODUCT ROUTES
app.get('/api/products', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    if (isMongoConnected) {
      const products = await Product.find({ userId }).sort({ createdAt: -1 });
      return res.json(products);
    }
  } catch (err) {
    console.error('Mongo Product GET error:', err.message);
  }
  const store = getStore();
  res.json(store.products || []);
});

app.post('/api/products', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const newProd = {
    id: req.body.id || `prod_${Date.now()}`,
    userId,
    sku: req.body.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    ...req.body
  };
  try {
    if (isMongoConnected) {
      const created = await Product.create(newProd);
      return res.status(201).json(created);
    }
  } catch (err) {
    console.error('Mongo Product POST error:', err.message);
  }
  const store = getStore();
  const list = [newProd, ...(store.products || [])];
  updateStore('products', list);
  res.status(201).json(newProd);
});

// MULTI-TENANT ISOLATED PAYMENT ROUTES
app.get('/api/payments', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    if (isMongoConnected) {
      const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
      return res.json(payments);
    }
  } catch (err) {
    console.error('Mongo Payment GET error:', err.message);
  }
  const store = getStore();
  res.json(store.payments || []);
});

app.post('/api/payments', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const newPayment = {
    id: req.body.id || `pay_${Date.now()}`,
    userId,
    ...req.body
  };
  try {
    if (isMongoConnected) {
      const created = await Payment.create(newPayment);
      return res.status(201).json(created);
    }
  } catch (err) {
    console.error('Mongo Payment POST error:', err.message);
  }
  const store = getStore();
  const list = [newPayment, ...(store.payments || [])];
  updateStore('payments', list);
  res.status(201).json(newPayment);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[API GATEWAY] 🚀 Gateway Server listening on http://localhost:${PORT}`);
  });
}

export default app;
