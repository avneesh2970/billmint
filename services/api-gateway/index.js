import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { getStore, updateStore, resetStoreToDemo } from '../db-store.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'billmint_super_secret_jwt_key_2026';

app.use(cors());
app.use(express.json());

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
    // For local demo flexibility, auto attach demo user if unauthenticated on dashboard
    req.user = { id: 'usr_demo_1', email: 'demo@billmint.com', role: 'USER', name: 'Nova Creative Owner' };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.user = { id: 'usr_demo_1', email: 'demo@billmint.com', role: 'USER', name: 'Nova Creative Owner' };
      return next();
    }
    req.user = user;
    next();
  });
};

// Middleware for Admin verification
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Admin authentication required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
    req.user = user;
    next();
  });
};

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', service: 'API Gateway', timestamp: new Date() });
});

// AUTH ROUTES
app.post('/api/auth/register', (req, res) => {
  const { fullName, email, password, phone } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = {
    id: `usr_${Date.now()}`,
    fullName: fullName || 'New Business Owner',
    email,
    phone: phone || '',
    role: 'USER',
    createdAt: new Date().toISOString()
  };

  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user, message: 'Registration successful' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Admin account login
  if (email === 'admin@billmint.com' && password === 'Admin@123') {
    const adminUser = {
      id: 'admin_001',
      fullName: 'BillMint Super Admin',
      email: 'admin@billmint.com',
      role: 'SUPER_ADMIN'
    };
    const token = jwt.sign(adminUser, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: adminUser, message: 'Admin login successful' });
  }

  const user = {
    id: 'usr_demo_1',
    fullName: 'Nova Creative Owner',
    email: email,
    role: 'USER'
  };

  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user, message: 'Login successful' });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// BUSINESS ROUTES
app.get('/api/business', authenticateToken, (req, res) => {
  const store = getStore();
  res.json(store.business);
});

app.put('/api/business', authenticateToken, (req, res) => {
  const store = getStore();
  const updated = { ...store.business, ...req.body };
  updateStore('business', updated);
  res.json({ message: 'Business settings updated', business: updated });
});

// CUSTOMER ROUTES
app.get('/api/customers', authenticateToken, (req, res) => {
  const store = getStore();
  res.json(store.customers || []);
});

app.post('/api/customers', authenticateToken, (req, res) => {
  const store = getStore();
  const newCust = {
    id: `cust_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  const list = [newCust, ...(store.customers || [])];
  updateStore('customers', list);
  res.status(201).json(newCust);
});

app.put('/api/customers/:id', authenticateToken, (req, res) => {
  const store = getStore();
  const id = req.params.id;
  const list = (store.customers || []).map(c => c.id === id ? { ...c, ...req.body } : c);
  updateStore('customers', list);
  res.json({ message: 'Customer updated successfully' });
});

app.delete('/api/customers/:id', authenticateToken, (req, res) => {
  const store = getStore();
  const list = (store.customers || []).filter(c => c.id !== req.params.id);
  updateStore('customers', list);
  res.json({ message: 'Customer deleted successfully' });
});

// PRODUCT ROUTES
app.get('/api/products', authenticateToken, (req, res) => {
  const store = getStore();
  res.json(store.products || []);
});

app.post('/api/products', authenticateToken, (req, res) => {
  const store = getStore();
  const newProd = {
    id: `prod_${Date.now()}`,
    sku: req.body.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    ...req.body
  };
  const list = [newProd, ...(store.products || [])];
  updateStore('products', list);
  res.status(201).json(newProd);
});

app.put('/api/products/:id', authenticateToken, (req, res) => {
  const store = getStore();
  const id = req.params.id;
  const list = (store.products || []).map(p => p.id === id ? { ...p, ...req.body } : p);
  updateStore('products', list);
  res.json({ message: 'Product updated successfully' });
});

app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const store = getStore();
  const list = (store.products || []).filter(p => p.id !== req.params.id);
  updateStore('products', list);
  res.json({ message: 'Product deleted successfully' });
});

// INVOICE ROUTES
app.get('/api/invoices', authenticateToken, (req, res) => {
  const store = getStore();
  res.json(store.invoices || []);
});

app.get('/api/invoices/:id', authenticateToken, (req, res) => {
  const store = getStore();
  const inv = (store.invoices || []).find(i => i.id === req.params.id || i.invoiceNumber === req.params.id);
  if (!inv) return res.status(404).json({ message: 'Invoice not found' });
  res.json(inv);
});

app.post('/api/invoices', authenticateToken, (req, res) => {
  const store = getStore();
  const newInv = {
    id: `inv_${Date.now()}`,
    ...req.body,
    status: req.body.status || 'Pending'
  };
  const list = [newInv, ...(store.invoices || [])];
  updateStore('invoices', list);
  res.status(201).json(newInv);
});

app.put('/api/invoices/:id', authenticateToken, (req, res) => {
  const store = getStore();
  const id = req.params.id;
  const list = (store.invoices || []).map(i => i.id === id ? { ...i, ...req.body } : i);
  updateStore('invoices', list);
  res.json({ message: 'Invoice updated successfully' });
});

app.delete('/api/invoices/:id', authenticateToken, (req, res) => {
  const store = getStore();
  const list = (store.invoices || []).filter(i => i.id !== req.params.id);
  updateStore('invoices', list);
  res.json({ message: 'Invoice deleted successfully' });
});

// PAYMENT ROUTES
app.get('/api/payments', authenticateToken, (req, res) => {
  const store = getStore();
  res.json(store.payments || []);
});

app.post('/api/payments', authenticateToken, (req, res) => {
  const store = getStore();
  const { invoiceId, amount, paymentMethod, transactionId, notes } = req.body;
  const newPayment = {
    id: `pay_${Date.now()}`,
    invoiceId,
    amount: Number(amount),
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: paymentMethod || 'UPI',
    transactionId: transactionId || `TXN${Math.floor(Math.random() * 1000000)}`,
    notes
  };

  // Update invoice status
  const invoices = (store.invoices || []).map(inv => {
    if (inv.id === invoiceId) {
      const paid = (Number(inv.amountPaid) || 0) + Number(amount);
      const bal = Number(inv.grandTotal) - paid;
      return {
        ...inv,
        amountPaid: paid,
        balanceDue: Math.max(0, bal),
        status: bal <= 0 ? 'Paid' : 'Partially Paid'
      };
    }
    return inv;
  });

  updateStore('invoices', invoices);
  const payments = [newPayment, ...(store.payments || [])];
  updateStore('payments', payments);

  res.status(201).json(newPayment);
});

// RECURRING INVOICES
app.get('/api/recurring-invoices', authenticateToken, (req, res) => {
  const store = getStore();
  res.json(store.recurringInvoices || []);
});

app.post('/api/recurring-invoices', authenticateToken, (req, res) => {
  const store = getStore();
  const item = {
    id: `rec_${Date.now()}`,
    ...req.body,
    status: 'Active'
  };
  const list = [item, ...(store.recurringInvoices || [])];
  updateStore('recurringInvoices', list);
  res.status(201).json(item);
});

// VENDORS ROUTES
app.get('/api/vendors', authenticateToken, (req, res) => {
  const store = getStore();
  res.json(store.vendors || []);
});

app.post('/api/vendors', authenticateToken, (req, res) => {
  const store = getStore();
  const newVendor = {
    id: `vend_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  const list = [newVendor, ...(store.vendors || [])];
  updateStore('vendors', list);
  res.status(201).json(newVendor);
});

app.delete('/api/vendors/:id', authenticateToken, (req, res) => {
  const store = getStore();
  const list = (store.vendors || []).filter(v => v.id !== req.params.id);
  updateStore('vendors', list);
  res.json({ message: 'Vendor deleted successfully' });
});

// PURCHASE BILLS ROUTES
app.get('/api/purchase-bills', authenticateToken, (req, res) => {
  const store = getStore();
  res.json(store.purchaseBills || []);
});

app.post('/api/purchase-bills', authenticateToken, (req, res) => {
  const store = getStore();
  const newBill = {
    id: `pbill_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  const list = [newBill, ...(store.purchaseBills || [])];
  updateStore('purchaseBills', list);
  res.status(201).json(newBill);
});

app.delete('/api/purchase-bills/:id', authenticateToken, (req, res) => {
  const store = getStore();
  const list = (store.purchaseBills || []).filter(b => b.id !== req.params.id);
  updateStore('purchaseBills', list);
  res.json({ message: 'Purchase bill deleted successfully' });
});

// NOTIFICATIONS
app.get('/api/notifications', authenticateToken, (req, res) => {
  const store = getStore();
  res.json(store.notifications || []);
});

app.put('/api/notifications/read-all', authenticateToken, (req, res) => {
  const store = getStore();
  const list = (store.notifications || []).map(n => ({ ...n, read: true }));
  updateStore('notifications', list);
  res.json({ message: 'All notifications marked as read' });
});

// REPORTS
app.get('/api/reports/summary', authenticateToken, (req, res) => {
  const store = getStore();
  const invoices = store.invoices || [];

  const totalRevenue = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0);

  const pendingAmount = invoices
    .filter(i => i.status === 'Pending' || i.status === 'Partially Paid')
    .reduce((sum, i) => sum + (Number(i.balanceDue || i.grandTotal) || 0), 0);

  const overdueAmount = invoices
    .filter(i => i.status === 'Overdue')
    .reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0);

  res.json({
    totalRevenue,
    paidCount: invoices.filter(i => i.status === 'Paid').length,
    pendingAmount,
    pendingCount: invoices.filter(i => i.status === 'Pending').length,
    overdueAmount,
    overdueCount: invoices.filter(i => i.status === 'Overdue').length,
    totalInvoices: invoices.length
  });
});

// ADMIN ROUTES
app.get('/api/admin/users', requireAdmin, (req, res) => {
  res.json([
    { id: 'usr_1', fullName: 'Nova Creative Owner', email: 'demo@billmint.com', role: 'USER', status: 'Active', invoicesCount: 12, createdAt: '2026-01-15' },
    { id: 'usr_2', fullName: 'Rahul Enterprise', email: 'rahul@abcenterprises.com', role: 'USER', status: 'Active', invoicesCount: 5, createdAt: '2026-02-01' },
    { id: 'usr_3', fullName: 'Apex Digital Admin', email: 'vikram@apexdigital.io', role: 'USER', status: 'Suspended', invoicesCount: 2, createdAt: '2026-03-10' }
  ]);
});

app.get('/api/admin/audit-logs', requireAdmin, (req, res) => {
  res.json([
    { id: 'log_1', adminEmail: 'admin@billmint.com', action: 'ADMIN_LOGIN', ip: '192.168.1.1', timestamp: new Date().toISOString() },
    { id: 'log_2', adminEmail: 'admin@billmint.com', action: 'ACTIVATE_USER', target: 'usr_1', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'log_3', adminEmail: 'admin@billmint.com', action: 'UPDATE_SYSTEM_SETTINGS', target: 'Tax Default Rules', timestamp: new Date(Date.now() - 86400000).toISOString() }
  ]);
});

// SEED RESET FOR DEMO
app.post('/api/admin/reset-demo', (req, res) => {
  resetStoreToDemo();
  res.json({ message: 'Demo store reset to initial state successfully' });
});

app.listen(PORT, () => {
  console.log(`🚀 BillMint API Gateway running on port ${PORT}`);
});
