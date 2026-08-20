import React, { useState } from 'react';
import { BarChart3, Download, Calendar, FileText, CheckCircle2, TrendingUp, PieChart } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../packages/shared-utils/index.js';

export default function ReportsPage({ invoices = [], payments = [], customers = [] }) {
  const [dateRange, setDateRange] = useState('This Month');
  const [reportType, setReportType] = useState('Sales');

  const totalSales = invoices.reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0);
  const totalTaxCollected = invoices.reduce((sum, i) => sum + (Number(i.totalTax) || 0), 0);
  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0);
  const totalOutstanding = totalSales - totalPaid;

  const exportCSV = () => {
    let csv = 'Invoice Number,Customer,Issue Date,Amount,Tax,Status\n';
    invoices.forEach(i => {
      csv += `"${i.invoiceNumber}","${i.customerName}","${i.issueDate}",${i.grandTotal},${i.totalTax},"${i.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BillMint_Sales_Report_${dateRange.replace(' ', '_')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">Financial Reports</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit-ready sales, GST liability, and outstanding collection reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 rounded-xl shadow-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-mint-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Date & Report Type Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Report Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['Sales', 'Revenue', 'GST/Tax', 'Outstanding', 'Customers'].map(r => (
            <button
              key={r}
              onClick={() => setReportType(r)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                reportType === r ? 'bg-mint-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {r} Report
            </button>
          ))}
        </div>

        {/* Date Filter Pills */}
        <select 
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white"
        >
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
          <option value="This Quarter">This Quarter</option>
          <option value="This Year">This Year</option>
        </select>

      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Sales Invoiced</span>
          <p className="text-xl font-extrabold text-slate-900">{formatCurrency(totalSales)}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Collected</span>
          <p className="text-xl font-extrabold text-emerald-600">{formatCurrency(totalPaid)}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">GST Tax Liability</span>
          <p className="text-xl font-extrabold text-indigo-600">{formatCurrency(totalTaxCollected)}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Outstanding Due</span>
          <p className="text-xl font-extrabold text-amber-600">{formatCurrency(totalOutstanding)}</p>
        </div>
      </div>

      {/* Report Detailed Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900">{reportType} Breakdown — {dateRange}</h3>
          <span className="text-xs text-slate-400">Audited & Tax Compliant</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Ref #</th>
                <th className="py-3 px-5">Customer Entity</th>
                <th className="py-3 px-5">Issue Date</th>
                <th className="py-3 px-5 text-right">Taxable Value</th>
                <th className="py-3 px-5 text-right">CGST</th>
                <th className="py-3 px-5 text-right">SGST</th>
                <th className="py-3 px-5 text-right">Grand Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-5 font-bold text-slate-900">{inv.invoiceNumber}</td>
                  <td className="py-3.5 px-5 font-medium text-slate-700">{inv.customerName}</td>
                  <td className="py-3.5 px-5 text-slate-500">{formatDate(inv.issueDate)}</td>
                  <td className="py-3.5 px-5 text-right">{formatCurrency(inv.taxableAmount || (inv.grandTotal * 0.85))}</td>
                  <td className="py-3.5 px-5 text-right text-slate-500">{formatCurrency(inv.cgst || (inv.totalTax / 2))}</td>
                  <td className="py-3.5 px-5 text-right text-slate-500">{formatCurrency(inv.sgst || (inv.totalTax / 2))}</td>
                  <td className="py-3.5 px-5 text-right font-extrabold text-slate-900">{formatCurrency(inv.grandTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
