import React, { useState } from 'react';
import { Search, Bell, Plus, Menu, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ setMobileOpen, onOpenSearch, notifications = [], business = {} }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const storedUserRaw = localStorage.getItem('billmint_user');
  const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
  const userEmail = storedUser?.email || business.email || 'user@billmint.com';
  const userName = business.name || storedUser?.fullName || userEmail.split('@')[0].toUpperCase();
  const initials = userName ? userName.slice(0, 2).toUpperCase() : 'BM';

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter(n => n && !n.read).length;

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between shadow-xs">
      
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          aria-label="Open navigation"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Global Search Button */}
        <button 
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-3 bg-slate-100 hover:bg-slate-200/70 text-slate-500 text-sm px-4 py-2.5 rounded-xl border border-slate-200/60 w-64 md:w-80 transition-all cursor-pointer"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="truncate">Search customers, invoices, products...</span>
          <kbd className="hidden md:inline-block bg-white text-[10px] font-bold text-slate-400 px-1.5 py-0.5 rounded shadow-xs ml-auto">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Quick Create Invoice CTA */}
        <Link 
          to="/invoices/new"
          className="inline-flex items-center gap-2 bg-mint-600 hover:bg-mint-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm shadow-mint-600/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create Invoice</span>
        </Link>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-sm text-charcoal-900">Notifications</span>
                <span className="text-xs font-semibold text-mint-600 bg-mint-50 px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <p className="p-4 text-xs text-center text-slate-400">No new notifications</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3">
                      {n.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-900">{n.title}</p>
                        <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">Just now</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-mint-600 to-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {initials}
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{userName}</p>
                <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
              </div>
              <Link to="/settings" onClick={() => setShowProfile(false)} className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50">
                Business Settings
              </Link>
              <Link to="/settings?tab=security" onClick={() => setShowProfile(false)} className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50">
                Account Security
              </Link>
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button 
                  onClick={() => {
                    setShowProfile(false);
                    localStorage.removeItem('billmint_token');
                    localStorage.removeItem('billmint_user');
                    window.location.href = '/login';
                  }} 
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                >
                  Logout Session
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
