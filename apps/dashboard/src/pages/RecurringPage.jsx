import React, { useState } from 'react';
import { RefreshCw, Plus, Calendar, CheckCircle2, PauseCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../packages/shared-utils/index.js';

export default function RecurringPage({ recurringInvoices = [], customers = [] }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">Recurring Invoices</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automate retainer billing on a Weekly, Monthly, Quarterly, or Yearly basis.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-mint-600 hover:bg-mint-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Recurring Schedule</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Frequency</th>
                <th className="py-3.5 px-6">Start Date</th>
                <th className="py-3.5 px-6">Last Generated</th>
                <th className="py-3.5 px-6 text-right">Billing Amount</th>
                <th className="py-3.5 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recurringInvoices.map(rec => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">{rec.customerName}</td>
                  <td className="py-4 px-6 font-semibold text-slate-700">{rec.frequency}</td>
                  <td className="py-4 px-6 text-slate-500">{formatDate(rec.startDate)}</td>
                  <td className="py-4 px-6 text-slate-500">{formatDate(rec.lastGenerated)}</td>
                  <td className="py-4 px-6 text-right font-extrabold text-slate-900">{formatCurrency(rec.amount)}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="badge-paid">
                      <CheckCircle2 className="w-3 h-3" /> {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
