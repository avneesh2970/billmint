import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Heart, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  const DASHBOARD_URL = 'http://localhost:3001';
  const ADMIN_URL = 'http://localhost:3002';

  return (
    <footer className="bg-charcoal-900 text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-mint-500 flex items-center justify-center text-charcoal-900 shadow-md shadow-mint-500/20">
                <FileText className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Bill<span className="text-mint-400">Mint</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Simple Billing. Smarter Business. Create professional invoices, manage customers, track payments, and calculate GST effortessly.
            </p>
            <div className="flex items-center gap-2 text-xs text-mint-400 bg-mint-950/60 border border-mint-800/40 w-fit px-3 py-1.5 rounded-lg">
              <Shield className="w-4 h-4 text-mint-400" />
              <span>Bank-Grade 256-Bit SSL Data Encryption</span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/features" className="hover:text-mint-400 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-mint-400 transition-colors">Pricing Plans</Link></li>
              <li><a href={`${DASHBOARD_URL}/register`} className="hover:text-mint-400 transition-colors">Invoice Builder</a></li>
              <li><Link to="/faq" className="hover:text-mint-400 transition-colors">GST Tax Support</Link></li>
              <li><a href={`${DASHBOARD_URL}/login`} className="hover:text-mint-400 transition-colors">User Dashboard</a></li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-mint-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-mint-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-mint-400 transition-colors">Help Center & FAQ</Link></li>
              <li><a href={`${ADMIN_URL}`} className="text-slate-500 hover:text-amber-400 transition-colors flex items-center gap-1">Admin Portal</a></li>
            </ul>
          </div>

          {/* Column 3: Legal & Security */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-pointer hover:text-mint-400">Terms of Service</span></li>
              <li><span className="cursor-pointer hover:text-mint-400">Privacy Policy</span></li>
              <li><span className="cursor-pointer hover:text-mint-400">GST Compliance</span></li>
              <li><span className="cursor-pointer hover:text-mint-400">Security Overview</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 BillMint Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for modern businesses with precision & passion.
          </p>
        </div>
      </div>
    </footer>
  );
}
