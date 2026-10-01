import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SearchModal from './components/SearchModal';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardOverview from './pages/DashboardOverview';
import InvoicesListPage from './pages/InvoicesListPage';
import InvoiceBuilderPage from './pages/InvoiceBuilderPage';
import InvoiceViewPage from './pages/InvoiceViewPage';
import CustomersPage from './pages/CustomersPage';
import ProductsPage from './pages/ProductsPage';
import PaymentsPage from './pages/PaymentsPage';
import RecurringPage from './pages/RecurringPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import PurchaseBillsPage from './pages/PurchaseBillsPage';
import VendorsPage from './pages/VendorsPage';

import { formatCurrency, calculateInvoiceSummary, generateNextInvoiceNumber } from '../../../packages/shared-utils/index.js';
import { INITIAL_DEMO_DATA } from '../../../packages/shared-types/index.js';
import { apiRequest } from './services/api';

// Helper: validate JWT token is not expired (without secret — just decode payload)
function isTokenValid(token) {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    // Check expiry
    if (!payload.exp) return false;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function DashboardLayout({ mobileOpen, setMobileOpen, setSearchOpen, notifications, business }) {
  const token = localStorage.getItem('billmint_token');

  if (!isTokenValid(token)) {
    localStorage.removeItem('billmint_token');
    localStorage.removeItem('billmint_user');
    localStorage.removeItem('billmint_onboarded');
    return <Navigate to="/login" replace />;
  }

  // Force onboarding for new users who haven't completed setup
  const onboarded = localStorage.getItem('billmint_onboarded');
  if (!onboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-charcoal-900">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} business={business} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          setMobileOpen={setMobileOpen}
          onOpenSearch={() => setSearchOpen(true)}
          notifications={notifications}
          business={business}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Onboarding route: only accessible when logged in but NOT yet onboarded
function OnboardingRoute({ children }) {
  const token = localStorage.getItem('billmint_token');
  if (!isTokenValid(token)) {
    return <Navigate to="/login" replace />;
  }
  // Already onboarded → skip back to dashboard
  if (localStorage.getItem('billmint_onboarded')) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}


// Guard: redirect already-logged-in users away from /login and /register
function PublicRoute({ children }) {
  const token = localStorage.getItem('billmint_token');
  if (isTokenValid(token)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}


export default function App() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Workspace Data State — always empty on load; fetched from API scoped to current user
  const [business, setBusiness] = useState({});
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [recurringInvoices, setRecurringInvoices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [purchaseBills, setPurchaseBills] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Load all user-scoped data from API. Re-fetch on route change so onboarding
  // data is picked up the moment the user lands on /dashboard.
  useEffect(() => {
    const token = localStorage.getItem('billmint_token');
    if (!token) return;
    async function loadApiData() {
      try {
        const b = await apiRequest('/business');
        if (b && b._id) setBusiness(b);
        const c = await apiRequest('/customers');
        if (Array.isArray(c)) setCustomers(c);
        const p = await apiRequest('/products');
        if (Array.isArray(p)) setProducts(p);
        const i = await apiRequest('/invoices');
        if (Array.isArray(i)) setInvoices(i);
        const pay = await apiRequest('/payments');
        if (Array.isArray(pay)) setPayments(pay);
      } catch (e) {
        console.log('API Gateway sync notice:', e.message);
      }
    }
    loadApiData();
  }, [location.pathname]);

  // Keyboard shortcut Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for state updates
  const handleSaveInvoice = (newInv) => {
    const exists = invoices.some(i => i.id === newInv.id);
    let updated;
    if (exists) {
      updated = invoices.map(i => i.id === newInv.id ? newInv : i);
    } else {
      updated = [newInv, ...invoices];
      // Increment next invoice number in business state
      setBusiness(prev => ({
        ...prev,
        nextInvoiceNumber: (Number(prev.nextInvoiceNumber) || 1) + 1
      }));
    }
    setInvoices(updated);
    apiRequest('/invoices', 'POST', newInv).catch(() => {});
  };

  const handleDeleteInvoice = (id) => {
    const updated = invoices.filter(i => i.id !== id);
    setInvoices(updated);
    apiRequest(`/invoices/${id}`, 'DELETE').catch(() => {});
  };

  const handleDuplicateInvoice = (inv) => {
    const nextNo = generateNextInvoiceNumber(business, invoices);
    const dup = {
      ...inv,
      id: `inv_${Date.now()}`,
      invoiceNumber: nextNo,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setInvoices([dup, ...invoices]);
    setBusiness(prev => ({
      ...prev,
      nextInvoiceNumber: (Number(prev.nextInvoiceNumber) || 1) + 1
    }));
  };

  const handleRecordPayment = ({ invoiceId, amount, paymentMethod, transactionId, notes }) => {
    const targetInv = invoices.find(i => i.id === invoiceId);
    const newPayment = {
      id: `pay_${Date.now()}`,
      invoiceId,
      invoiceNumber: targetInv ? targetInv.invoiceNumber : 'INV-2026-001',
      customerName: targetInv ? targetInv.customerName : 'Client',
      amount: Number(amount),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: paymentMethod || 'UPI',
      transactionId: transactionId || `TXN${Math.floor(100000 + Math.random() * 900000)}`,
      notes
    };

    setPayments([newPayment, ...payments]);

    // Update invoice status
    const updatedInvoices = invoices.map(inv => {
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

    setInvoices(updatedInvoices);
    apiRequest('/payments', 'POST', newPayment).catch(() => {});
  };

  const handleAddCustomer = (cust) => {
    setCustomers([cust, ...customers]);
    apiRequest('/customers', 'POST', cust).catch(() => {});
  };

  const handleDeleteCustomer = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
    apiRequest(`/customers/${id}`, 'DELETE').catch(() => {});
  };

  const handleAddProduct = (prod) => {
    setProducts([prod, ...products]);
    apiRequest('/products', 'POST', prod).catch(() => {});
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    apiRequest(`/products/${id}`, 'DELETE').catch(() => {});
  };

  const handleAddVendor = (vend) => {
    setVendors([vend, ...vendors]);
    apiRequest('/vendors', 'POST', vend).catch(() => {});
  };

  const handleDeleteVendor = (id) => {
    setVendors(vendors.filter(v => v.id !== id));
    apiRequest(`/vendors/${id}`, 'DELETE').catch(() => {});
  };

  const handleAddPurchaseBill = (bill) => {
    setPurchaseBills([bill, ...purchaseBills]);
    apiRequest('/purchase-bills', 'POST', bill).catch(() => {});
  };

  const handleDeletePurchaseBill = (id) => {
    setPurchaseBills(purchaseBills.filter(b => b.id !== id));
    apiRequest(`/purchase-bills/${id}`, 'DELETE').catch(() => {});
  };

  const handleUpdateBusiness = (updated) => {
    setBusiness(updated);
    apiRequest('/business', 'PUT', updated).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-slate-50 text-charcoal-900 flex flex-col">
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/onboarding" element={<OnboardingRoute><OnboardingPage /></OnboardingRoute>} />
        <Route
          element={
            <DashboardLayout 
              mobileOpen={mobileOpen} 
              setMobileOpen={setMobileOpen} 
              setSearchOpen={setSearchOpen}
              notifications={notifications}
              business={business}
            />
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route 
            path="/dashboard" 
            element={
              <DashboardOverview 
                invoices={invoices} 
                business={business} 
                customers={customers} 
              />
            } 
          />
          <Route 
            path="/invoices" 
            element={
              <InvoicesListPage 
                invoices={invoices} 
                business={business} 
                customers={customers}
                onDeleteInvoice={handleDeleteInvoice}
                onDuplicateInvoice={handleDuplicateInvoice}
                onRecordPayment={handleRecordPayment}
              />
            } 
          />
          <Route 
            path="/invoices/new" 
            element={
              <InvoiceBuilderPage 
                business={business} 
                customers={customers} 
                products={products}
                invoices={invoices}
                onSaveInvoice={handleSaveInvoice}
              />
            } 
          />
          <Route 
            path="/invoices/:id" 
            element={
              <InvoiceViewPage 
                invoices={invoices} 
                business={business} 
                customers={customers}
                onRecordPayment={handleRecordPayment}
                onUpdateInvoice={handleSaveInvoice}
              />
            } 
          />
          <Route 
            path="/customers" 
            element={
              <CustomersPage 
                customers={customers} 
                invoices={invoices}
                onAddCustomer={handleAddCustomer}
                onDeleteCustomer={handleDeleteCustomer}
                onRecordPayment={handleRecordPayment}
              />
            } 
          />
          <Route 
            path="/products" 
            element={
              <ProductsPage 
                products={products}
                onAddProduct={handleAddProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            } 
          />
          <Route 
            path="/purchase-bills" 
            element={
              <PurchaseBillsPage 
                purchaseBills={purchaseBills}
                vendors={vendors}
                business={business}
                onAddPurchaseBill={handleAddPurchaseBill}
                onDeletePurchaseBill={handleDeletePurchaseBill}
              />
            } 
          />
          <Route 
            path="/vendors" 
            element={
              <VendorsPage 
                vendors={vendors}
                purchaseBills={purchaseBills}
                onAddVendor={handleAddVendor}
                onDeleteVendor={handleDeleteVendor}
              />
            } 
          />
          <Route 
            path="/payments" 
            element={
              <PaymentsPage 
                payments={payments}
                invoices={invoices}
                onRecordPayment={handleRecordPayment}
              />
            } 
          />
          <Route 
            path="/recurring" 
            element={
              <RecurringPage 
                recurringInvoices={recurringInvoices}
                customers={customers}
              />
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ReportsPage 
                invoices={invoices}
                payments={payments}
                customers={customers}
                purchaseBills={purchaseBills}
              />
            } 
          />
          <Route 
            path="/settings" 
            element={
              <SettingsPage 
                business={business}
                onUpdateBusiness={handleUpdateBusiness}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>

      {/* Global Search Modal */}
      <SearchModal 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)}
        invoices={invoices}
        customers={customers}
        products={products}
        payments={payments}
      />
    </div>
  );
}
