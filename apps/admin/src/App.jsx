import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  Shield, Users, Building, Sparkles, Activity, 
  LogOut, LayoutDashboard, Settings, FileText 
} from 'lucide-react';

import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import BusinessManagement from './pages/BusinessManagement';
import SubscriptionsPage from './pages/SubscriptionsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import AllInvoicesPage from './pages/AllInvoicesPage';
import AllCustomersPage from './pages/AllCustomersPage';
import { INITIAL_DEMO_DATA } from '../../../packages/shared-types/index.js';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [adminUser, setAdminUser] = useState({ id: 'admin_1', email: 'admin@billmint.com', role: 'SUPER_ADMIN' });

  const [invoices, setInvoices] = useState(INITIAL_DEMO_DATA.invoices || []);
  const [customers, setCustomers] = useState(INITIAL_DEMO_DATA.customers || []);
  const [business, setBusiness] = useState(INITIAL_DEMO_DATA.business || {});

  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const handleToggleUserStatus = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        setAuditLogs([{
          id: `log_${Date.now()}`,
          adminEmail: adminUser.email,
          action: nextStatus === 'Suspended' ? 'SUSPEND_USER' : 'ACTIVATE_USER',
          target: `${u.id} (${u.fullName})`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }, ...auditLogs]);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
    setAuditLogs([{
      id: `log_${Date.now()}`,
      adminEmail: adminUser.email,
      action: 'DELETE_USER',
      target: userId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }, ...auditLogs]);
  };

  const isAuthenticated = Boolean(localStorage.getItem('billmint_admin_token'));
  const isLoginPage = location.pathname === '/admin/login';

  // If not authenticated and not on login page, redirect to login
  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to="/admin/login" replace />;
  }

  // If on login page (either authenticated or not)
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex">
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage onAdminLogin={setAdminUser} />} />
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <div className="flex min-h-screen w-full">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between hidden md:flex">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-mint-500 text-slate-950 flex items-center justify-center font-black">
                <Shield className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">BillMint</span>
                <p className="text-[10px] text-mint-400 font-semibold uppercase tracking-wider -mt-1">
                  Super Admin Console
                </p>
              </div>
            </div>

            <nav className="space-y-1 text-xs font-semibold">
              <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/admin' ? 'bg-mint-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <LayoutDashboard className="w-4 h-4" /> Overview
              </Link>
              <Link to="/admin/invoices" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/admin/invoices' ? 'bg-mint-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <FileText className="w-4 h-4" /> All Invoices
              </Link>
              <Link to="/admin/customers" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/admin/customers' ? 'bg-mint-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Users className="w-4 h-4" /> All Customers
              </Link>
              <Link to="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/admin/users' ? 'bg-mint-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Users className="w-4 h-4" /> User Accounts
              </Link>
              <Link to="/admin/businesses" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/admin/businesses' ? 'bg-mint-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Building className="w-4 h-4" /> Business Profiles
              </Link>
              <Link to="/admin/subscriptions" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/admin/subscriptions' ? 'bg-mint-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Sparkles className="w-4 h-4" /> Subscriptions & Plans
              </Link>
              <Link to="/admin/audit-logs" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/admin/audit-logs' ? 'bg-mint-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Activity className="w-4 h-4" /> Activity & Audit Logs
              </Link>
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="truncate">{adminUser?.email}</span>
            <button 
              onClick={() => {
                localStorage.removeItem('billmint_admin_token');
                localStorage.removeItem('billmint_admin_user');
                window.location.href = '/admin/login';
              }} 
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg transition-colors"
              title="Logout Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Admin Main Body */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold text-mint-400">
              <Shield className="w-4 h-4" />
              <span>BILLMINT SAAS SUPER-ADMIN WORKSPACE</span>
            </div>
            <a href="http://localhost:3001" target="_blank" rel="noreferrer" className="text-xs font-semibold text-slate-400 hover:text-white">
              Launch User Dashboard →
            </a>
          </header>

          <main className="p-6 sm:p-10 flex-1 max-w-7xl w-full mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/admin" replace />} />
              <Route path="/admin" element={<AdminDashboard users={users} invoices={invoices} customers={customers} auditLogs={auditLogs} />} />
              <Route path="/admin/invoices" element={<AllInvoicesPage invoices={invoices} customers={customers} business={business} />} />
              <Route path="/admin/customers" element={<AllCustomersPage customers={customers} invoices={invoices} />} />
              <Route path="/admin/users" element={<UserManagement users={users} onToggleUserStatus={handleToggleUserStatus} onDeleteUser={handleDeleteUser} />} />
              <Route path="/admin/businesses" element={<BusinessManagement />} />
              <Route path="/admin/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/admin/audit-logs" element={<AuditLogsPage auditLogs={auditLogs} />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}
