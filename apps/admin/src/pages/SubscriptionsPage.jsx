import React from 'react';
import { Sparkles, Check } from 'lucide-react';

export default function SubscriptionsPage() {
  const plans = [
    { name: 'Free', price: '₹0/mo', subscribers: 240, limit: '5 Invoices/mo' },
    { name: 'Pro', price: '₹299/mo', subscribers: 890, limit: 'Unlimited' },
    { name: 'Business', price: '₹799/mo', subscribers: 290, limit: 'Unlimited Multi-Biz' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">SaaS Subscriptions & Pricing Control</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage tier limits, pricing features, and active subscribers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{p.name}</h3>
              <span className="text-xs font-bold text-mint-400 bg-mint-950 border border-mint-800 px-2.5 py-1 rounded-full">
                {p.subscribers} Subscribers
              </span>
            </div>
            <div className="text-3xl font-extrabold text-white">{p.price}</div>
            <p className="text-xs text-slate-400">Limit: {p.limit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
