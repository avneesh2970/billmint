import React, { useState } from 'react';
import { 
  FileText, Search, Filter, Eye, Download, CheckCircle2, 
  Clock, AlertCircle, ArrowUpRight, DollarSign, Building, User, MapPin
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../packages/shared-utils/index.js';

export default function AllInvoicesPage({ invoices = [], customers = [], business = {} }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Aggregates
  const totalBilled = invoices.reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0);
  const totalPaid = invoices.reduce((sum, i) => {
    if (i.status === 'Paid') return sum + (Number(i.grandTotal) || 0);
    return sum + (Number(i.amountPaid) || 0);
  }, 0);
  const totalPending = totalBilled - totalPaid;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-mint-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            System Wide Data Access
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Platform Invoices Directory</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Full admin visibility into all client invoices, tax breakdowns (CGST/SGST vs IGST), and payment statuses.
          </p>
        </div>
      </div>

      {/* Summary Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Platform Billed</span>
            <h3 className="text-2xl font-black text-white mt-1">{formatCurrency(totalBilled)}</h3>
            <span className="text-[11px] text-slate-500">{invoices.length} Total Invoices</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold border border-blue-500/20">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">Total Collected Paid</span>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{formatCurrency(totalPaid)}</h3>
            <span className="text-[11px] text-emerald-500/80 font-semibold">
              {invoices.filter(i => i.status === 'Paid').length} Fully Settled Invoices
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400">Total Pending Balances</span>
            <h3 className="text-2xl font-black text-rose-400 mt-1">{formatCurrency(totalPending)}</h3>
            <span className="text-[11px] text-rose-500/80 font-semibold">
              {invoices.filter(i => i.status !== 'Paid').length} Outstanding Invoices
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold border border-rose-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input 
            type="text"
            placeholder="Search invoice # or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-mint-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="w-12 h-12 text-slate-700 mx-auto mb-2" />
            <p className="font-bold text-slate-400">No Invoices Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-5">Invoice #</th>
                  <th className="py-3.5 px-5">Customer & Business</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4 text-right">Grand Total</th>
                  <th className="py-3.5 px-4 text-right">Paid</th>
                  <th className="py-3.5 px-4 text-right">Pending</th>
                  <th className="py-3.5 px-4 text-center">Tax Type</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredInvoices.map((inv) => {
                  const paidAmt = inv.status === 'Paid' 
                    ? Number(inv.grandTotal) 
                    : (Number(inv.amountPaid) || 0);

                  const pendingAmt = inv.status === 'Paid'
                    ? 0
                    : Math.max(0, Number(inv.grandTotal) - paidAmt);

                  const isInter = inv.isInterState || (inv.igst && inv.igst > 0);

                  return (
                    <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-5 font-bold font-mono text-white">{inv.invoiceNumber}</td>
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-200">{inv.customerName}</div>
                        <div className="text-[11px] text-slate-500">{business.name || 'Nova Creative Studio'}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-xs">
                        <div>Issue: {formatDate(inv.issueDate)}</div>
                        <div className="text-[11px] text-slate-500">Due: {formatDate(inv.dueDate)}</div>
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-white">
                        {formatCurrency(inv.grandTotal)}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-emerald-400">
                        {formatCurrency(paidAmt)}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-rose-400">
                        {formatCurrency(pendingAmt)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          isInter ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {isInter ? 'IGST (18%)' : 'CGST+SGST (9%+9%)'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${
                          inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          inv.status === 'Partially Paid' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                          inv.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-mint-400 font-bold text-xs rounded-xl border border-slate-700 inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Audit View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Invoice Audit Drawer / Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full space-y-6 shadow-2xl animate-in fade-in">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-mint-400 bg-mint-500/10 px-2.5 py-1 rounded-full border border-mint-500/20">
                  Admin Full Audit View
                </span>
                <h3 className="text-xl font-black text-white mt-1">Invoice {selectedInvoice.invoiceNumber}</h3>
              </div>
              <button 
                onClick={() => setSelectedInvoice(null)} 
                className="p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block font-semibold">Billed To (Customer):</span>
                  <span className="font-bold text-white text-sm">{selectedInvoice.customerName}</span>
                  <span className="text-slate-400 block text-[11px]">{selectedInvoice.customerEmail}</span>
                  <span className="text-slate-400 block text-[11px]">GSTIN: {selectedInvoice.customerGstin || 'Unregistered'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Issued By (Business):</span>
                  <span className="font-bold text-white text-sm">{business.name || 'Nova Creative Studio'}</span>
                  <span className="text-slate-400 block text-[11px]">GSTIN: {business.gstin || '29ABCDE1234F1ZH'}</span>
                  <span className="text-slate-400 block text-[11px]">State Code: {business.stateCode || '29'}</span>
                </div>
              </div>

              {/* Tax & Financial Breakdown */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal Amount:</span>
                  <span className="font-bold text-white">{formatCurrency(selectedInvoice.subtotal)}</span>
                </div>
                {selectedInvoice.isInterState || (selectedInvoice.igst && selectedInvoice.igst > 0) ? (
                  <div className="flex justify-between text-purple-400 font-bold">
                    <span>IGST Tax (Inter-State 18%):</span>
                    <span>{formatCurrency(selectedInvoice.igst || selectedInvoice.totalTax)}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-blue-400">
                      <span>CGST Tax (Intra-State 9%):</span>
                      <span>{formatCurrency(selectedInvoice.cgst || (selectedInvoice.totalTax / 2))}</span>
                    </div>
                    <div className="flex justify-between text-blue-400">
                      <span>SGST Tax (Intra-State 9%):</span>
                      <span>{formatCurrency(selectedInvoice.sgst || (selectedInvoice.totalTax / 2))}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-white font-extrabold text-sm border-t border-slate-800 pt-2">
                  <span>Grand Total:</span>
                  <span className="text-mint-400">{formatCurrency(selectedInvoice.grandTotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold text-xs pt-1">
                  <span>Amount Paid / Received:</span>
                  <span>{formatCurrency(selectedInvoice.status === 'Paid' ? selectedInvoice.grandTotal : (selectedInvoice.amountPaid || 0))}</span>
                </div>
                <div className="flex justify-between text-rose-400 font-bold text-xs">
                  <span>Remaining Pending Balance:</span>
                  <span>{formatCurrency(selectedInvoice.status === 'Paid' ? 0 : Math.max(0, selectedInvoice.grandTotal - (selectedInvoice.amountPaid || 0)))}</span>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
              >
                Close Audit View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
