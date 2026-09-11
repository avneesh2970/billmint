import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, Eye, Edit3, Copy, Download, Printer, 
  Share2, Trash2, ChevronLeft, ChevronRight, FileText, CheckCircle2, CreditCard, DollarSign, Clock, AlertTriangle, X
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../packages/shared-utils/index.js';
import { generateInvoicePDF } from '../services/pdfGenerator.js';

export default function InvoicesListPage({ 
  invoices = [], 
  business = {}, 
  customers = [], 
  onDeleteInvoice, 
  onDuplicateInvoice,
  onRecordPayment 
}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [customerFilter, setCustomerFilter] = useState('All');

  // Modal State for Recording Payment / Marking Paid
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('UPI');
  const [payTxnId, setPayTxnId] = useState('');
  const [payNotes, setPayNotes] = useState('');

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    const matchesCustomer = customerFilter === 'All' || inv.customerId === customerFilter;

    return matchesSearch && matchesStatus && matchesCustomer;
  });

  // Calculate Overall Financial Aggregates
  const totalInvoiced = invoices.reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0);
  const totalPaid = invoices.reduce((sum, i) => {
    if (i.status === 'Paid') return sum + (Number(i.grandTotal) || 0);
    return sum + (Number(i.amountPaid) || 0);
  }, 0);
  const totalPending = totalInvoiced - totalPaid;

  const handleDownloadPDF = (inv) => {
    const cust = customers.find(c => c.id === inv.customerId);
    const pdf = generateInvoicePDF(inv, business, cust, inv.template || 'Modern');
    pdf.save(`${inv.invoiceNumber}.pdf`);
  };

  const handlePrint = (inv) => {
    const cust = customers.find(c => c.id === inv.customerId);
    const pdf = generateInvoicePDF(inv, business, cust, inv.template || 'Modern');
    pdf.autoPrint();
    window.open(pdf.output('bloburl'), '_blank');
  };

  const openPaymentModal = (inv) => {
    const currentPaid = Number(inv.amountPaid) || (inv.status === 'Paid' ? Number(inv.grandTotal) : 0);
    const remaining = Math.max(0, Number(inv.grandTotal) - currentPaid);
    setSelectedInvoiceForPayment(inv);
    setPayAmount(remaining.toString());
    setPayTxnId(`TXN${Math.floor(100000 + Math.random() * 900000)}`);
    setPayNotes(`Payment for invoice ${inv.invoiceNumber}`);
  };

  const submitPayment = (e) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment) return;

    onRecordPayment({
      invoiceId: selectedInvoiceForPayment.id,
      amount: Number(payAmount),
      paymentMethod: payMethod,
      transactionId: payTxnId,
      notes: payNotes
    });

    setSelectedInvoiceForPayment(null);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">Invoices</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage client invoices, track paid amounts, mark pending balances, and record payments.
          </p>
        </div>

        <Link
          to="/invoices/new"
          className="inline-flex items-center gap-2 bg-mint-600 hover:bg-mint-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Invoice</span>
        </Link>
      </div>

      {/* Summary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Billed</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalInvoiced)}</h3>
            <span className="text-[11px] text-slate-500">{invoices.length} Invoices Generated</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">Total Paid Amount</span>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{formatCurrency(totalPaid)}</h3>
            <span className="text-[11px] text-emerald-700 font-semibold">
              {invoices.filter(i => i.status === 'Paid').length} Fully Settled Invoices
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600">Pending Balance Due</span>
            <h3 className="text-2xl font-black text-rose-600 mt-1">{formatCurrency(totalPending)}</h3>
            <span className="text-[11px] text-rose-700 font-semibold">
              {invoices.filter(i => i.status !== 'Paid').length} Outstanding Invoices
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text"
            placeholder="Search invoice number or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-mint-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-mint-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
            <option value="Draft">Draft</option>
          </select>

          {/* Customer Filter */}
          <select 
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-mint-500 focus:outline-none max-w-[180px]"
          >
            <option value="All">All Customers</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.company || c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Invoices Table with Paid & Pending Columns */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Invoices Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create your first invoice and start managing your billing efficiently.
            </p>
            <Link to="/invoices/new" className="inline-block px-4 py-2 bg-mint-600 text-white text-xs font-bold rounded-xl shadow">
              Create Invoice
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">Invoice Number</th>
                  <th className="py-3.5 px-5">Customer</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4 text-right">Total Amount</th>
                  <th className="py-3.5 px-4 text-right">Amount Paid</th>
                  <th className="py-3.5 px-4 text-right">Pending Balance</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions / Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => {
                  const paidAmt = inv.status === 'Paid' 
                    ? Number(inv.grandTotal) 
                    : (Number(inv.amountPaid) || 0);

                  const pendingAmt = inv.status === 'Paid'
                    ? 0
                    : Math.max(0, Number(inv.grandTotal) - paidAmt);

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5 font-bold text-slate-900">
                        <Link to={`/invoices/${inv.id}`} className="hover:text-mint-600 flex items-center gap-1">
                          {inv.invoiceNumber}
                        </Link>
                      </td>
                      <td className="py-4 px-5 font-medium text-slate-800">
                        {inv.customerName}
                      </td>
                      <td className="py-4 px-4 text-slate-500 text-xs">
                        <div>Issue: {formatDate(inv.issueDate)}</div>
                        <div className="text-[11px] text-slate-400">Due: {formatDate(inv.dueDate)}</div>
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-slate-900">
                        {formatCurrency(inv.grandTotal)}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-emerald-600">
                        {formatCurrency(paidAmt)}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-rose-600">
                        {formatCurrency(pendingAmt)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={
                          inv.status === 'Paid' ? 'badge-paid' :
                          inv.status === 'Partially Paid' ? 'badge-pending' :
                          inv.status === 'Pending' ? 'badge-pending' :
                          inv.status === 'Overdue' ? 'badge-overdue' : 'badge-draft'
                        }>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right space-x-1.5 whitespace-nowrap">
                        {inv.status !== 'Paid' && (
                          <button
                            onClick={() => openPaymentModal(inv)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs inline-flex items-center gap-1"
                            title="Mark Paid or Record Payment"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Mark Paid</span>
                          </button>
                        )}
                        <Link 
                          to={`/invoices/${inv.id}`}
                          className="p-1.5 text-slate-500 hover:text-mint-600 inline-block rounded-lg hover:bg-slate-100"
                          title="View & Share"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDownloadPDF(inv)}
                          className="p-1.5 text-slate-500 hover:text-mint-600 inline-block rounded-lg hover:bg-slate-100"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handlePrint(inv)}
                          className="p-1.5 text-slate-500 hover:text-mint-600 inline-block rounded-lg hover:bg-slate-100"
                          title="Print"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDeleteInvoice && onDeleteInvoice(inv.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 inline-block rounded-lg hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredInvoices.length} of {invoices.length} invoices</span>
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1 border border-slate-200 rounded-lg bg-white opacity-50 cursor-not-allowed">
              Previous
            </button>
            <span className="font-semibold text-slate-700">Page 1 of 1</span>
            <button className="px-2.5 py-1 border border-slate-200 rounded-lg bg-white opacity-50 cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Record Payment / Mark Paid Modal */}
      {selectedInvoiceForPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl animate-in fade-in">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Record Payment
                </span>
                <h3 className="text-xl font-bold text-charcoal-900 mt-1">
                  Mark Invoice {selectedInvoiceForPayment.invoiceNumber} Paid
                </h3>
              </div>
              <button 
                onClick={() => setSelectedInvoiceForPayment(null)} 
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Invoice Financial Summary Box */}
            {(() => {
              const currentPaid = Number(selectedInvoiceForPayment.amountPaid) || (selectedInvoiceForPayment.status === 'Paid' ? Number(selectedInvoiceForPayment.grandTotal) : 0);
              const remaining = Math.max(0, Number(selectedInvoiceForPayment.grandTotal) - currentPaid);
              const enteringAmount = Number(payAmount) || 0;
              const newRemaining = Math.max(0, remaining - enteringAmount);

              return (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Billed Amount:</span>
                    <span className="font-bold text-slate-900">{formatCurrency(selectedInvoiceForPayment.grandTotal)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Already Received Paid:</span>
                    <span>{formatCurrency(currentPaid)}</span>
                  </div>
                  <div className="flex justify-between text-rose-700 font-bold border-t border-slate-200 pt-1.5 text-sm">
                    <span>Current Pending Balance:</span>
                    <span>{formatCurrency(remaining)}</span>
                  </div>

                  <div className="pt-2 border-t border-dashed border-slate-200 flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">Balance after this payment:</span>
                    <span className={`font-mono font-extrabold ${newRemaining === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {formatCurrency(newRemaining)} {newRemaining === 0 ? '(Fully Paid!)' : ''}
                    </span>
                  </div>
                </div>
              );
            })()}

            <form onSubmit={submitPayment} className="space-y-4 text-xs">
              
              {/* Quick Preset Pills & Custom Amount Toggle */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Select Payment Option</label>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const half = Math.round(Number(selectedInvoiceForPayment.grandTotal) * 0.5);
                      setPayAmount(half.toString());
                    }}
                    className={`py-2 px-1 text-center font-bold text-[11px] rounded-xl border transition-all ${
                      Number(payAmount) === Math.round(Number(selectedInvoiceForPayment.grandTotal) * 0.5)
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                    }`}
                  >
                    ⚡ 50%
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const quarter = Math.round(Number(selectedInvoiceForPayment.grandTotal) * 0.25);
                      setPayAmount(quarter.toString());
                    }}
                    className={`py-2 px-1 text-center font-bold text-[11px] rounded-xl border transition-all ${
                      Number(payAmount) === Math.round(Number(selectedInvoiceForPayment.grandTotal) * 0.25)
                        ? 'bg-blue-500 text-white border-blue-600 shadow-xs'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-200'
                    }`}
                  >
                    ⚡ 25%
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const currentPaid = Number(selectedInvoiceForPayment.amountPaid) || 0;
                      const remaining = Math.max(0, Number(selectedInvoiceForPayment.grandTotal) - currentPaid);
                      setPayAmount(remaining.toString());
                    }}
                    className={`py-2 px-1 text-center font-bold text-[11px] rounded-xl border transition-all ${
                      Number(payAmount) === Math.max(0, Number(selectedInvoiceForPayment.grandTotal) - (Number(selectedInvoiceForPayment.amountPaid) || 0))
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
                    }`}
                  >
                    ⚡ 100% Full
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPayAmount('');
                      setTimeout(() => {
                        const inputEl = document.getElementById('custom-pay-amount-input');
                        if (inputEl) inputEl.focus();
                      }, 50);
                    }}
                    className="py-2 px-1 text-center font-bold text-[11px] rounded-xl border bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200 transition-colors"
                  >
                    ✏️ Custom
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Custom / Entered Payment Amount (₹)</label>
                <input 
                  id="custom-pay-amount-input"
                  type="number"
                  required
                  step="0.01"
                  min="1"
                  placeholder="Enter custom amount in ₹..."
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-mint-500 focus:outline-none bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                  <select 
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Transaction Ref #</label>
                  <input 
                    type="text"
                    value={payTxnId}
                    onChange={(e) => setPayTxnId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Notes</label>
                <input 
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setSelectedInvoiceForPayment(null)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Mark Paid</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

