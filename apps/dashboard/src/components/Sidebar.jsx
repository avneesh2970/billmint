import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, LayoutDashboard, Receipt, Users, Package, CreditCard, 
  BarChart3, RefreshCw, Settings, HelpCircle, LogOut, ShoppingBag, Building2 
} from 'lucide-react';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Invoices', path: '/invoices', icon: Receipt },
    { label: 'Customers', path: '/customers', icon: Users },
    { label: 'Products & Services', path: '/products', icon: Package },
    { label: 'Purchase Bills', path: '/purchase-bills', icon: ShoppingBag },
    { label: 'Vendors', path: '/vendors', icon: Building2 },
    { label: 'Payments', path: '/payments', icon: CreditCard },
    { label: 'Recurring Invoices', path: '/recurring', icon: RefreshCw },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('billmint_token');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between 
        transition-transform duration-300 ease-in-out border-r border-slate-800
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        <div>
          {/* Logo Header */}
          <div className="h-20 flex items-center px-6 border-b border-slate-800/80">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-mint-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-mint-500/20">
                <FileText className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">
                  Bill<span className="text-mint-400">Mint</span>
                </span>
                <p className="text-[10px] text-mint-400 font-semibold uppercase tracking-wider -mt-1">
                  Pro Workspace
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                    ${isActive 
                      ? 'bg-mint-500 text-slate-950 shadow-md shadow-mint-500/20 font-bold' 
                      : 'hover:bg-slate-800/80 hover:text-white text-slate-400'}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          
          {/* Active Business Badge */}
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-mint-950 text-mint-400 border border-mint-800 flex items-center justify-center font-bold text-xs">
              NC
            </div>
            <div className="truncate text-xs">
              <p className="font-bold text-white truncate">Nova Creative Studio</p>
              <p className="text-[10px] text-emerald-400 font-medium">Pro Subscription</p>
            </div>
          </div>

          {/* Help & Logout Buttons */}
          <div className="pt-2 flex items-center justify-between text-xs font-medium text-slate-400">
            <a 
              href="http://localhost:3000/faq" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <HelpCircle className="w-4 h-4" /> Help
            </a>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}
