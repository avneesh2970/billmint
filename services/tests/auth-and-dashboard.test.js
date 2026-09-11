import { test, before, after, describe } from 'node:test';
import assert from 'node:assert/strict';
import app from '../api-gateway/index.js';

let server;
let baseUrl;
let authToken;
let registeredUser;

before(async () => {
  process.env.NODE_ENV = 'test';
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`[TEST SUITE] Test server started on ${baseUrl}`);
      resolve();
    });
  });
});

after(async () => {
  if (server) server.close();
  try {
    const mongoose = (await import('mongoose')).default;
    await mongoose.disconnect();
  } catch (e) {}
  setTimeout(() => process.exit(0), 100);
});

describe('1. User Signup & Registration API Tests', () => {
  test('Should reject registration when email or password is missing', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: 'Test User' })
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.message, 'Email and password are required');
  });

  test('Should register a new user successfully with JWT token', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Anita Roy',
        email: 'anita.roy@billmint.com',
        password: 'Password123!',
        phone: '+91 9876543210',
        businessName: 'Roy Tech Solutions'
      })
    });
    assert.ok(res.status === 200 || res.status === 201, `Status was ${res.status}`);
    const data = await res.json();
    assert.ok(data.token, 'Token should be returned on successful registration');
    assert.ok(data.user, 'User object should be returned');
    assert.equal(data.user.email, 'anita.roy@billmint.com');
    assert.equal(data.user.fullName, 'Anita Roy');
    
    // Save for subsequent tests
    authToken = data.token;
    registeredUser = data.user;
  });
});

describe('2. User Login API Tests', () => {
  test('Should reject login when email or password is missing', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'anita.roy@billmint.com' })
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.message, 'Email and password are required');
  });

  test('Should log in user successfully and return JWT token', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'anita.roy@billmint.com',
        password: 'Password123!'
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.token, 'Login must return JWT token');
    assert.equal(data.user.email, 'anita.roy@billmint.com');
  });
});

describe('3. Session Authentication & Protection Tests', () => {
  test('Should reject unauthenticated GET /api/auth/me with 401', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`);
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.match(data.message, /Authentication required/i);
  });

  test('Should reject invalid JWT token with 403', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { 'Authorization': 'Bearer invalid_bogus_token' }
    });
    assert.equal(res.status, 403);
    const data = await res.json();
    assert.match(data.message, /Invalid or expired/i);
  });

  test('Should verify active session token with GET /api/auth/me', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.user.email, 'anita.roy@billmint.com');
  });
});

describe('4. Dashboard Services & Data API Tests', () => {
  test('Should fetch business settings with valid auth header', async () => {
    const res = await fetch(`${baseUrl}/api/business`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    assert.equal(res.status, 200);
    const business = await res.json();
    assert.ok(business, 'Business profile should exist');
  });

  test('Should update business profile', async () => {
    const res = await fetch(`${baseUrl}/api/business`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        name: 'Roy Tech Solutions Pvt Ltd',
        gstin: '27AAAAA0000A1Z5',
        state: 'Maharashtra'
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.business.name, 'Roy Tech Solutions Pvt Ltd');
  });

  test('Should fetch dashboard invoices list', async () => {
    const res = await fetch(`${baseUrl}/api/invoices`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    assert.equal(res.status, 200);
    const invoices = await res.json();
    assert.ok(Array.isArray(invoices), 'Invoices should return an array');
  });

  test('Should create a new invoice on dashboard', async () => {
    const newInvoice = {
      id: `inv_test_${Date.now()}`,
      invoiceNumber: 'INV-2026-TEST',
      customerName: 'Acme Corp',
      issueDate: '2026-08-21',
      dueDate: '2026-09-20',
      grandTotal: 11800,
      amountPaid: 0,
      balanceDue: 11800,
      status: 'Pending'
    };

    const res = await fetch(`${baseUrl}/api/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(newInvoice)
    });
    assert.equal(res.status, 201);
    const created = await res.json();
    assert.equal(created.invoiceNumber, 'INV-2026-TEST');
    assert.equal(created.grandTotal, 11800);
  });

  test('Should fetch customers list and create customer', async () => {
    const newCust = {
      id: `cust_test_${Date.now()}`,
      name: 'Global Enterprises',
      email: 'contact@globalent.com',
      phone: '+91 9988776655',
      state: 'Karnataka',
      gstin: '29BBBBB1111B1Z2'
    };

    const postRes = await fetch(`${baseUrl}/api/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(newCust)
    });
    assert.equal(postRes.status, 201);

    const getRes = await fetch(`${baseUrl}/api/customers`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    assert.equal(getRes.status, 200);
    const list = await getRes.json();
    assert.ok(Array.isArray(list));
  });

  test('Should create and list products', async () => {
    const newProd = {
      id: `prod_test_${Date.now()}`,
      name: 'Software Consulting (Per Hour)',
      price: 2500,
      hsnSac: '998313',
      taxRate: 18
    };

    const postRes = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(newProd)
    });
    assert.equal(postRes.status, 201);

    const getRes = await fetch(`${baseUrl}/api/products`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    assert.equal(getRes.status, 200);
    const list = await getRes.json();
    assert.ok(Array.isArray(list));
  });

  test('Should record a payment for dashboard', async () => {
    const newPay = {
      id: `pay_test_${Date.now()}`,
      invoiceId: 'INV-2026-TEST',
      amount: 11800,
      paymentMethod: 'UPI',
      transactionId: 'TXN12345678'
    };

    const postRes = await fetch(`${baseUrl}/api/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(newPay)
    });
    assert.equal(postRes.status, 201);
  });
});
