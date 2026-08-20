import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, Eye, Edit3, Copy, Download, Printer, 
  Share2, Trash2, ChevronLeft, ChevronRight, FileText 
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../packages/shared-utils/index.js';
import { generateInvoicePDF } from '../services/pdfGenerator.js';

export default function InvoicesListPage({ invoices = [], business = {}, customers = [], onDeleteInvoice, onDuplicateInvoice }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [customerFilter, setCustomerFilter] = useState('All');

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    const matchesCustomer = customerFilter === 'All' || inv.customerId === customerFilter;

    return matchesSearch && matchesStatus && matchesCustomer;
  });

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

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">Invoices</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage, download, and track all your client invoices in one place.
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

      {/* Invoices Table */}
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
                  <th className="py-3.5 px-5">Issue Date</th>
                  <th className="py-3.5 px-5">Due Date</th>
                  <th className="py-3.5 px-5 text-right">Amount</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-900">
                      <Link to={`/invoices/${inv.id}`} className="hover:text-mint-600">
                        {inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="py-4 px-5 font-medium text-slate-800">{inv.customerName}</td>
                    <td className="py-4 px-5 text-slate-500">{formatDate(inv.issueDate)}</td>
                    <td className="py-4 px-5 text-slate-500">{formatDate(inv.dueDate)}</td>
                    <td className="py-4 px-5 text-right font-bold text-slate-900">
                      {formatCurrency(inv.grandTotal)}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className={
                        inv.status === 'Paid' ? 'badge-paid' :
                        inv.status === 'Pending' ? 'badge-pending' :
                        inv.status === 'Overdue' ? 'badge-overdue' : 'badge-draft'
                      }>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right space-x-1">
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
                        onClick={() => onDuplicateInvoice && onDuplicateInvoice(inv)}
                        className="p-1.5 text-slate-500 hover:text-mint-600 inline-block rounded-lg hover:bg-slate-100"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
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
                ))}
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

    </div>
  );
}
