import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const DASHBOARD_URL = 'http://localhost:3001';

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-mint-600 via-mint-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-mint-500/20 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-charcoal-900">
                Bill<span className="text-mint-600">Mint</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-semibold text-slate-400 tracking-wider -mt-1">
                Simple Billing. Smarter Business.
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/features" 
              className={`text-sm font-medium transition-colors hover:text-mint-600 ${location.pathname === '/features' ? 'text-mint-600 font-semibold' : 'text-slate-600'}`}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className={`text-sm font-medium transition-colors hover:text-mint-600 ${location.pathname === '/pricing' ? 'text-mint-600 font-semibold' : 'text-slate-600'}`}
            >
              Pricing
            </Link>
            <Link 
              to="/faq" 
              className={`text-sm font-medium transition-colors hover:text-mint-600 ${location.pathname === '/faq' ? 'text-mint-600 font-semibold' : 'text-slate-600'}`}
            >
              FAQ
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors hover:text-mint-600 ${location.pathname === '/about' ? 'text-mint-600 font-semibold' : 'text-slate-600'}`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm font-medium transition-colors hover:text-mint-600 ${location.pathname === '/contact' ? 'text-mint-600 font-semibold' : 'text-slate-600'}`}
            >
              Contact
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href={`${DASHBOARD_URL}/login`} 
              className="text-sm font-semibold text-charcoal-900 hover:text-mint-600 px-4 py-2 rounded-lg transition-colors"
            >
              Log in
            </a>
            <a 
              href={`${DASHBOARD_URL}/register`} 
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-mint-600 hover:bg-mint-700 px-5 py-2.5 rounded-xl shadow-sm shadow-mint-600/30 hover:shadow-md transition-all active:scale-95"
            >
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-4 pb-6 space-y-4 shadow-xl">
          <Link 
            to="/features" 
            onClick={() => setMobileOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-mint-600"
          >
            Features
          </Link>
          <Link 
            to="/pricing" 
            onClick={() => setMobileOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-mint-600"
          >
            Pricing
          </Link>
          <Link 
            to="/faq" 
            onClick={() => setMobileOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-mint-600"
          >
            FAQ
          </Link>
          <Link 
            to="/about" 
            onClick={() => setMobileOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-mint-600"
          >
            About
          </Link>
          <Link 
            to="/contact" 
            onClick={() => setMobileOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-mint-600"
          >
            Contact
          </Link>
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <a 
              href={`${DASHBOARD_URL}/login`}
              className="block w-full text-center text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 py-3 rounded-xl"
            >
              Log in
            </a>
            <a 
              href={`${DASHBOARD_URL}/register`}
              className="block w-full text-center text-sm font-semibold text-white bg-mint-600 hover:bg-mint-700 py-3 rounded-xl shadow-md"
            >
              Start Billing Free
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
