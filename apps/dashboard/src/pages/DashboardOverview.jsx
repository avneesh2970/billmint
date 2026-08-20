import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, CheckCircle2, Clock, AlertTriangle, Plus, 
  ArrowUpRight, ArrowDownRight, Eye, Download, FileText 
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../packages/shared-utils/index.js';
import { generateInvoicePDF } from '../services/pdfGenerator.js';

export default function DashboardOverview({ invoices = [], business = {}, customers = [] }) {
  
  const totalRevenue = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0);

  const paidCount = invoices.filter(i => i.status === 'Paid').length;

  const pendingAmount = invoices
    .filter(i => i.status === 'Pending' || i.status === 'Partially Paid')
    .reduce((sum, i) => sum + (Number(i.balanceDue || i.grandTotal) || 0), 0);

  const overdueAmount = invoices
    .filter(i => i.status === 'Overdue')
    .reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0);

  const handleDownloadPDF = (inv) => {
    const cust = customers.find(c => c.id === inv.customerId);
    const pdf = generateInvoicePDF(inv, business, cust, inv.template || 'Modern');
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
            Welcome back, <span className="font-semibold text-slate-800">Nova Creative Studio</span>. Here is your business billing snapshot.
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
          <div className="text-2xl font-extrabold text-charcoal-900">{formatCurrency(totalRevenue || 124500)}</div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% from last month</span>
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
          <div className="text-2xl font-extrabold text-charcoal-900">{paidCount || 42}</div>
          <div className="text-xs text-slate-500 font-medium">
            100% collected on time
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
          <div className="text-2xl font-extrabold text-amber-600">{formatCurrency(pendingAmount || 18400)}</div>
          <div className="text-xs text-slate-500 font-medium">
            2 client invoices pending payment
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
          <div className="text-2xl font-extrabold text-rose-600">{formatCurrency(overdueAmount || 7200)}</div>
          <div className="text-xs text-rose-500 font-medium">
            Requires follow-up reminder
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trend Visualizer */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-charcoal-900">Revenue & Sales Overview</h3>
              <p className="text-xs text-slate-500">Monthly breakdown for FY 2026</p>
            </div>
            <span className="text-xs font-bold text-mint-600 bg-mint-50 px-3 py-1 rounded-full">
              Monthly Trend
            </span>
          </div>

          {/* CSS Bar Chart */}
          <div className="pt-6 pb-2 grid grid-cols-6 gap-3 items-end h-48 border-b border-slate-100">
            {[
              { month: 'Mar', val: 45, label: '₹45k' },
              { month: 'Apr', val: 62, label: '₹62k' },
              { month: 'May', val: 55, label: '₹55k' },
              { month: 'Jun', val: 80, label: '₹80k' },
              { month: 'Jul', val: 95, label: '₹95k' },
              { month: 'Aug', val: 134, label: '₹134k' },
            ].map((bar, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 group h-full justify-end">
                <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.label}
                </span>
                <div 
                  className={`w-full rounded-t-xl transition-all duration-500 ${idx === 5 ? 'bg-mint-500 shadow-md shadow-mint-500/30' : 'bg-slate-200 group-hover:bg-mint-300'}`}
                  style={{ height: `${(bar.val / 140) * 100}%` }}
                />
                <span className="text-xs font-semibold text-slate-500">{bar.month}</span>
              </div>
            ))}
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
                <span>Paid (82%)</span>
                <span className="text-emerald-600">₹1,34,520</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[82%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Pending (13%)</span>
                <span className="text-amber-600">₹21,240</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[13%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Overdue (5%)</span>
                <span className="text-rose-600">₹29,500</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-[5%] rounded-full"></div>
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
              {invoices.map((inv) => (
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
                    <span className={
                      inv.status === 'Paid' ? 'badge-paid' :
                      inv.status === 'Pending' ? 'badge-pending' :
                      inv.status === 'Overdue' ? 'badge-overdue' : 'badge-draft'
                    }>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <Link 
                      to={`/invoices/${inv.id}`}
                      className="p-1.5 text-slate-500 hover:text-mint-600 inline-block"
                      title="View Invoice"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleDownloadPDF(inv)}
                      className="p-1.5 text-slate-500 hover:text-mint-600 inline-block"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
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
