import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

import { INITIAL_DEMO_DATA } from '../../../packages/shared-types/index.js';
import { apiRequest } from './services/api';

export default function App() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Workspace Data State
  const [business, setBusiness] = useState(INITIAL_DEMO_DATA.business);
  const [customers, setCustomers] = useState(INITIAL_DEMO_DATA.customers);
  const [products, setProducts] = useState(INITIAL_DEMO_DATA.products);
  const [invoices, setInvoices] = useState(INITIAL_DEMO_DATA.invoices);
  const [payments, setPayments] = useState(INITIAL_DEMO_DATA.payments);
  const [recurringInvoices, setRecurringInvoices] = useState(INITIAL_DEMO_DATA.recurringInvoices);
  const [vendors, setVendors] = useState(INITIAL_DEMO_DATA.vendors || []);
  const [purchaseBills, setPurchaseBills] = useState(INITIAL_DEMO_DATA.purchaseBills || []);
  const [notifications, setNotifications] = useState(INITIAL_DEMO_DATA.notifications);

  // Sync with API gateway if available
  useEffect(() => {
    async function loadApiData() {
      try {
        const b = await apiRequest('/business');
        if (b) setBusiness(b);
        const c = await apiRequest('/customers');
        if (c && c.length) setCustomers(c);
        const p = await apiRequest('/products');
        if (p && p.length) setProducts(p);
        const i = await apiRequest('/invoices');
        if (i && i.length) setInvoices(i);
        const pay = await apiRequest('/payments');
        if (pay && pay.length) setPayments(pay);
      } catch (e) {
        console.log('API Gateway sync notice: Running with local store cache.');
      }
    }
    loadApiData();
  }, []);

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
    const dup = {
      ...inv,
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-2026-00${Math.floor(10 + Math.random() * 90)}`,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setInvoices([dup, ...invoices]);
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

  const isAuthPage = ['/login', '/register', '/onboarding'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 text-charcoal-900 flex flex-col">
      {isAuthPage ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Routes>
      ) : (
        <div className="flex min-h-screen">
          <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

          <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
            <Header 
              setMobileOpen={setMobileOpen} 
              onOpenSearch={() => setSearchOpen(true)}
              notifications={notifications}
            />

            <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
              <Routes>
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
              </Routes>
            </main>
          </div>
        </div>
      )}

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
