import React, { useState } from 'react';
import { CreditCard, Plus, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../packages/shared-utils/index.js';

export default function PaymentsPage({ payments = [], invoices = [], onRecordPayment }) {
  const [showModal, setShowModal] = useState(false);
  const [payForm, setPayForm] = useState({
    invoiceId: invoices[0]?.id || '',
    amount: '',
    paymentMethod: 'UPI',
    transactionId: '',
    notes: ''
  });

  const handleCreate = (e) => {
    e.preventDefault();
    onRecordPayment({
      invoiceId: payForm.invoiceId,
      amount: Number(payForm.amount),
      paymentMethod: payForm.paymentMethod,
      transactionId: payForm.transactionId || `TXN${Math.floor(100000 + Math.random() * 900000)}`,
      notes: payForm.notes
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">Payment Tracking</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Record payments received via UPI, Bank Transfer, Cash, or Cards.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <CreditCard className="w-4 h-4" />
          <span>Record New Payment</span>
        </button>
      </div>

      {/* Payment Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-base font-bold text-charcoal-900">Transaction History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Payment ID</th>
                <th className="py-3.5 px-6">Invoice #</th>
                <th className="py-3.5 px-6">Payment Date</th>
                <th className="py-3.5 px-6">Method</th>
                <th className="py-3.5 px-6">Transaction ID</th>
                <th className="py-3.5 px-6 text-right">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs font-bold text-slate-400">{p.id}</td>
                  <td className="py-4 px-6 font-bold text-slate-900">{p.invoiceNumber || 'INV-2026-001'}</td>
                  <td className="py-4 px-6 text-slate-500">{formatDate(p.paymentDate)}</td>
                  <td className="py-4 px-6">
                    <span className="bg-mint-50 text-mint-800 border border-mint-200 font-semibold text-xs px-2.5 py-1 rounded-full">
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-600">{p.transactionId}</td>
                  <td className="py-4 px-6 text-right font-extrabold text-emerald-600">
                    {formatCurrency(p.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold text-charcoal-900">Record Payment</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Invoice</label>
                <select 
                  value={payForm.invoiceId}
                  onChange={(e) => setPayForm({ ...payForm, invoiceId: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-semibold"
                >
                  {invoices.map(i => (
                    <option key={i.id} value={i.id}>{i.invoiceNumber} — {i.customerName} (₹{i.grandTotal})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Amount Paid (₹)</label>
                <input 
                  type="number" 
                  required
                  placeholder="21240"
                  value={payForm.amount}
                  onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                <select 
                  value={payForm.paymentMethod}
                  onChange={(e) => setPayForm({ ...payForm, paymentMethod: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                >
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Transaction Ref / ID</label>
                <input 
                  type="text" 
                  placeholder="HDFC9876543210"
                  value={payForm.transactionId}
                  onChange={(e) => setPayForm({ ...payForm, transactionId: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-500 font-bold hover:text-slate-900"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
