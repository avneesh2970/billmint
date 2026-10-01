import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, CheckCircle2, Clock, AlertTriangle, Plus, 
  ArrowUpRight, ArrowDownRight, Eye, Download, FileText 
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../packages/shared-utils/index.js';
import { generateInvoicePDF } from '../services/pdfGenerator.js';

export default function DashboardOverview({ invoices = [], business = {}, customers = [] }) {
  const safeInvoices = Array.isArray(invoices) ? invoices : [];
  const safeCustomers = Array.isArray(customers) ? customers : [];

  const totalRevenue = safeInvoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0);

  const paidCount = safeInvoices.filter(i => i.status === 'Paid').length;

  const pendingAmount = safeInvoices
    .filter(i => i.status === 'Pending' || i.status === 'Partially Paid')
    .reduce((sum, i) => sum + (Number(i.balanceDue !== undefined ? i.balanceDue : i.grandTotal) || 0), 0);

  const overdueAmount = safeInvoices
    .filter(i => i.status === 'Overdue')
    .reduce((sum, i) => sum + (Number(i.balanceDue !== undefined ? i.balanceDue : i.grandTotal) || 0), 0);

  const grandTotalBilled = safeInvoices.reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0);
  const paidPct = grandTotalBilled > 0 ? Math.round((totalRevenue / grandTotalBilled) * 100) : 0;
  const pendingPct = grandTotalBilled > 0 ? Math.round((pendingAmount / grandTotalBilled) * 100) : 0;
  const overduePct = grandTotalBilled > 0 ? Math.round((overdueAmount / grandTotalBilled) * 100) : 0;

  const handleDownloadPDF = async (inv) => {
    const cust = safeCustomers.find(c => c.id === inv.customerId);
    const pdf = await generateInvoicePDF(inv, business, cust, inv.template || 'Modern');
    pdf.save(`${inv.invoiceNumber || 'Invoice'}.pdf`);
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Top Banner & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-800">{business.name || 'My Business'}</span>. Here is your business billing snapshot.
          </p>
        </div>

        <Link
          to="/invoices/new"
          className="inline-flex items-center gap-2 bg-mint-600 hover:bg-mint-700 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-md shadow-mint-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Invoice</span>
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-charcoal-900">{formatCurrency(totalRevenue)}</div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Real-time collected revenue</span>
          </div>
        </div>

        {/* Paid Invoices */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Paid Invoices</span>
            <div className="w-8 h-8 rounded-xl bg-mint-100 text-mint-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-charcoal-900">{paidCount}</div>
          <div className="text-xs text-slate-500 font-medium">
            {paidCount > 0 ? `${paidCount} settled invoices` : 'No settled invoices yet'}
          </div>
        </div>

        {/* Pending Receivables */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Pending Receivables</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{formatCurrency(pendingAmount)}</div>
          <div className="text-xs text-slate-500 font-medium">
            {safeInvoices.filter(i => i.status === 'Pending' || i.status === 'Partially Paid').length} client invoices pending
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Overdue Amount</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-600">{formatCurrency(overdueAmount)}</div>
          <div className="text-xs text-rose-500 font-medium">
            {safeInvoices.filter(i => i.status === 'Overdue').length} overdue payment alerts
          </div>
        </div>

      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Total Billed Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-charcoal-900">Total Billed & Collections</h3>
              <p className="text-xs text-slate-500">Overview of overall invoice metrics</p>
            </div>
            <span className="text-xs font-bold text-mint-600 bg-mint-50 px-3 py-1 rounded-full">
              Live Metrics
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-center">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-500">Total Billed</p>
              <p className="text-lg font-black text-slate-900 mt-1">{formatCurrency(grandTotalBilled)}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700">Collected</p>
              <p className="text-lg font-black text-emerald-700 mt-1">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <p className="text-xs font-semibold text-amber-700">Pending</p>
              <p className="text-lg font-black text-amber-700 mt-1">{formatCurrency(pendingAmount + overdueAmount)}</p>
            </div>
          </div>
        </div>

        {/* Invoice Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-charcoal-900">Invoice Status Breakdown</h3>
            <p className="text-xs text-slate-500">Distribution across active bills</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Paid ({paidPct}%)</span>
                <span className="text-emerald-600">{formatCurrency(totalRevenue)}</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${paidPct}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Pending ({pendingPct}%)</span>
                <span className="text-amber-600">{formatCurrency(pendingAmount)}</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pendingPct}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Overdue ({overduePct}%)</span>
                <span className="text-rose-600">{formatCurrency(overdueAmount)}</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${overduePct}%` }}></div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link to="/reports" className="text-xs font-bold text-mint-600 hover:underline">
              View Detailed Financial Reports →
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-charcoal-900">Recent Invoices</h3>
            <p className="text-xs text-slate-500">Latest transactions generated on BillMint</p>
          </div>
          <Link to="/invoices" className="text-xs font-bold text-mint-600 hover:underline">
            View All Invoices →
          </Link>
        </div>

        <div className="overflow-x-auto">
          {safeInvoices.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-mint-50 text-mint-600 rounded-2xl flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">No Invoices Created Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create your first invoice to track billing, state tax (CGST/SGST vs IGST), and payments.
              </p>
              <Link
                to="/invoices/new"
                className="inline-flex items-center gap-2 bg-mint-600 hover:bg-mint-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm"
              >
                <Plus className="w-4 h-4" /> Create First Invoice
              </Link>
            </div>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Invoice Number</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6 text-right">Amount</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {safeInvoices.slice(0, 5).map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <Link to={`/invoices/${inv.id}`} className="hover:text-mint-600">
                        {inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">{inv.customerName}</td>
                    <td className="py-4 px-6 text-slate-500">{formatDate(inv.issueDate)}</td>
                    <td className="py-4 px-6 text-right font-bold text-slate-900">
                      {formatCurrency(inv.grandTotal)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                        inv.status === 'Partially Paid' ? 'bg-amber-100 text-amber-800' :
                        inv.status === 'Overdue' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link to={`/invoices/${inv.id}`} className="text-slate-400 hover:text-slate-600 inline-block p-1">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDownloadPDF(inv)} className="text-slate-400 hover:text-mint-600 inline-block p-1">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
