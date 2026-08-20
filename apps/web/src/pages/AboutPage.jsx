import React from 'react';
import { Target, Users, Shield, Sparkles, Building2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-12 space-y-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-mint-600 uppercase tracking-widest bg-mint-100 px-3 py-1 rounded-full">
          About BillMint
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-charcoal-900 tracking-tight">
          Simple Billing. Smarter Business.
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          BillMint was created with one single mission: to provide freelancers, small business owners, agencies, and consultants with the most intuitive, fast, and trustworthy online billing experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-mint-100 text-mint-600 flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-charcoal-900">Our Mission</h3>
          <p className="text-sm text-slate-600">Empower millions of Indian business owners to send beautiful invoices and collect payments 3x faster.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-mint-100 text-mint-600 flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-charcoal-900">Customer First</h3>
          <p className="text-sm text-slate-600">We design software around real-world business workflows, minimizing clicks and eliminating clutter.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-mint-100 text-mint-600 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-charcoal-900">Data Security</h3>
          <p className="text-sm text-slate-600">Bank-level 256-bit encryption ensures your business details and financial records stay 100% private.</p>
        </div>
      </div>
    </div>
  );
}
