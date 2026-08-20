import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);
  const DASHBOARD_URL = 'http://localhost:3001';

  return (
    <div className="py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-mint-600 uppercase tracking-widest bg-mint-100 px-3 py-1 rounded-full">
          Simple, Transparent Pricing
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-charcoal-900 tracking-tight">
          Choose the right plan for your growing business
        </h1>
        <p className="text-slate-600 text-lg">
          No hidden fees. Start free and upgrade as your invoicing needs expand.
        </p>

        {/* Toggle Monthly / Yearly */}
        <div className="pt-6 flex items-center justify-center gap-4">
          <span className={`text-sm font-semibold ${!isYearly ? 'text-charcoal-900' : 'text-slate-500'}`}>Monthly Billing</span>
          <button 
            onClick={() => setIsYearly(!isYearly)}
            className="w-14 h-8 bg-mint-600 rounded-full p-1 transition-colors relative"
            aria-label="Toggle annual pricing"
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${isYearly ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-semibold ${isYearly ? 'text-charcoal-900' : 'text-slate-500'}`}>Yearly Billing</span>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        
        {/* Free Plan */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-charcoal-900">Free</h3>
            <p className="text-xs text-slate-500 mt-1">For freelancers and solo starters</p>
            <div className="my-6">
              <span className="text-4xl font-extrabold text-charcoal-900">₹0</span>
              <span className="text-slate-500 text-sm"> / month</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-mint-600 shrink-0" /> Up to 5 Invoices per month</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-mint-600 shrink-0" /> Manage up to 10 Customers</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-mint-600 shrink-0" /> Basic invoice templates</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-mint-600 shrink-0" /> High quality PDF downloads</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-mint-600 shrink-0" /> Basic dashboard analytics</li>
            </ul>
          </div>
          <a 
            href={`${DASHBOARD_URL}/register?plan=free`}
            className="w-full text-center py-3.5 rounded-xl font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Start Free
          </a>
        </div>

        {/* Pro Plan (Popular) */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl border-2 border-mint-500 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-mint-500 text-slate-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Most Popular
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Pro</h3>
            <p className="text-xs text-slate-400 mt-1">For growing businesses & agencies</p>
            <div className="my-6">
              <span className="text-4xl font-extrabold text-white">₹{isYearly ? '249' : '299'}</span>
              <span className="text-slate-400 text-sm"> / month {isYearly && '(billed annually)'}</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-mint-400 shrink-0" /> Unlimited Invoices</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-mint-400 shrink-0" /> Unlimited Customers</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-mint-400 shrink-0" /> Premium templates (Classic, Modern, Minimal)</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-mint-400 shrink-0" /> GST & Tax auto-calculation</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-mint-400 shrink-0" /> Payment tracking & receipts</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-mint-400 shrink-0" /> Recurring automated invoices</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-mint-400 shrink-0" /> Business financial reports & CSV export</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-mint-400 shrink-0" /> Priority support</li>
            </ul>
          </div>
          <a 
            href={`${DASHBOARD_URL}/register?plan=pro`}
            className="w-full text-center py-3.5 rounded-xl font-bold text-slate-950 bg-mint-400 hover:bg-mint-300 shadow-lg shadow-mint-500/20 transition-all"
          >
            Start Pro
          </a>
        </div>

        {/* Business Plan */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-charcoal-900">Business</h3>
            <p className="text-xs text-slate-500 mt-1">For multi-entity SMBs & teams</p>
            <div className="my-6">
              <span className="text-4xl font-extrabold text-charcoal-900">₹{isYearly ? '649' : '799'}</span>
              <span className="text-slate-500 text-sm"> / month {isYearly && '(billed annually)'}</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-mint-600 shrink-0" /> Everything in Pro</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-mint-600 shrink-0" /> Multiple Business Profiles (Up to 5)</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-mint-600 shrink-0" /> Advanced reports & audit exports</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-mint-600 shrink-0" /> Team member sub-accounts</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-mint-600 shrink-0" /> Custom branding & Monogram logo</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-mint-600 shrink-0" /> Dedicated account manager</li>
            </ul>
          </div>
          <a 
            href={`${DASHBOARD_URL}/register?plan=business`}
            className="w-full text-center py-3.5 rounded-xl font-bold text-white bg-mint-600 hover:bg-mint-700 transition-colors"
          >
            Choose Business
          </a>
        </div>
      </div>
    </div>
  );
}
