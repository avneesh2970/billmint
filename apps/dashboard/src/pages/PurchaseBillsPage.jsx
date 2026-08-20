import React, { useState } from 'react';
import { Plus, Search, ShoppingBag, Trash2, CheckCircle2, Clock, X, FileText, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate, calculateInvoiceSummary } from '../../../../packages/shared-utils/index.js';

export default function PurchaseBillsPage({ purchaseBills = [], vendors = [], business = {}, onAddPurchaseBill, onDeletePurchaseBill }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);

  const [newBill, setNewBill] = useState({
    billNumber: `BILL-2026-${Math.floor(100 + Math.random() * 900)}`,
    vendorId: vendors[0]?.id || '',
    billDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    items: [{ description: 'Server VPS & Cloud Hosting', quantity: 1, rate: 15000, taxRate: 18 }],
    itcEligible: true,
    notes: 'Vendor expense bill'
  });

  const selectedVendor = vendors.find(v => v.id === newBill.vendorId) || vendors[0] || {};
  const isInterState = (business.state || 'Karnataka').trim().toLowerCase() !== (selectedVendor.state || 'Karnataka').trim().toLowerCase();

  const filteredBills = purchaseBills.filter(b => {
    const matchesSearch = b.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPurchases = purchaseBills.reduce((s, b) => s + (Number(b.grandTotal) || 0), 0);
  const totalITC = purchaseBills.filter(b => b.itcEligible).reduce((s, b) => s + (Number(b.totalTax) || 0), 0);
  const totalPaid = purchaseBills.filter(b => b.status === 'Paid').reduce((s, b) => s + (Number(b.grandTotal) || 0), 0);
  const outstandingPayable = totalPurchases - totalPaid;

  const handleCreate = (e) => {
    e.preventDefault();
    const summary = calculateInvoiceSummary(newBill.items, 0, isInterState);
    
    onAddPurchaseBill({
      id: `pbill_${Date.now()}`,
      billNumber: newBill.billNumber,
      vendorId: selectedVendor.id || 'vend_001',
      vendorName: selectedVendor.company || selectedVendor.name || 'Supplier',
      vendorGstin: selectedVendor.gstin || '',
      vendorState: selectedVendor.state || 'Karnataka',
      businessState: business.state || 'Karnataka',
      isInterState,
      billDate: newBill.billDate,
      dueDate: newBill.dueDate,
      status: 'Pending',
      items: newBill.items.map(i => ({ ...i, amount: Number(i.quantity) * Number(i.rate) })),
      subtotal: summary.subtotal,
      totalTax: summary.totalTax,
      cgst: summary.cgst,
      sgst: summary.sgst,
      igst: summary.igst,
      grandTotal: summary.grandTotal,
      amountPaid: 0,
      balanceDue: summary.grandTotal,
      itcEligible: newBill.itcEligible,
      notes: newBill.notes
    });

    setShowModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">Purchase Bills & Expenses</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track vendor bills, input tax credit (ITC), and inter-state purchase IGST.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-mint-600 hover:bg-mint-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Purchase Bill</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Purchase Expenses</span>
          <p className="text-xl font-extrabold text-slate-900">{formatCurrency(totalPurchases)}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Eligible Input Tax Credit (ITC)</span>
          <p className="text-xl font-extrabold text-emerald-600">{formatCurrency(totalITC)}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Paid to Vendors</span>
          <p className="text-xl font-extrabold text-mint-700">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Payable Outstanding</span>
          <p className="text-xl font-extrabold text-rose-600">{formatCurrency(outstandingPayable)}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text"
            placeholder="Search bill number or vendor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-mint-500 focus:outline-none"
          />
        </div>

        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white"
        >
          <option value="All">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Purchase Bills Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Bill Number</th>
                <th className="py-3.5 px-6">Vendor Name</th>
                <th className="py-3.5 px-6">Tax Criteria</th>
                <th className="py-3.5 px-6">Bill Date</th>
                <th className="py-3.5 px-6 text-right">Tax Amount</th>
                <th className="py-3.5 px-6 text-right">Total Bill</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">{b.billNumber}</td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800">{b.vendorName}</p>
                    <p className="text-[11px] text-slate-400">GSTIN: {b.vendorGstin || 'Unregistered'}</p>
                  </td>
                  <td className="py-4 px-6">
                    {b.isInterState || (b.igst && b.igst > 0) ? (
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        IGST (Inter-State)
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        CGST + SGST (Intra)
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-slate-500">{formatDate(b.billDate)}</td>
                  <td className="py-4 px-6 text-right text-slate-600 font-medium">
                    {formatCurrency(b.totalTax)}
                  </td>
                  <td className="py-4 px-6 text-right font-extrabold text-slate-900">
                    {formatCurrency(b.grandTotal)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={b.status === 'Paid' ? 'badge-paid' : 'badge-pending'}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => onDeletePurchaseBill && onDeletePurchaseBill(b.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Delete Bill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Purchase Bill Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-charcoal-900">Record Purchase Expense Bill</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bill Number</label>
                  <input 
                    type="text" 
                    required
                    value={newBill.billNumber}
                    onChange={(e) => setNewBill({ ...newBill, billNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Vendor / Supplier</label>
                  <select 
                    value={newBill.vendorId}
                    onChange={(e) => setNewBill({ ...newBill, vendorId: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-semibold"
                  >
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.company || v.name} ({v.state || 'Karnataka'})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tax Criteria Indicator */}
              <div className={`p-3 rounded-xl border text-xs ${isInterState ? 'bg-indigo-50 border-indigo-200 text-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                <p className="font-bold flex items-center justify-between">
                  <span>Tax Criteria Applied:</span>
                  <span className="font-extrabold uppercase">{isInterState ? 'IGST (Inter-State @ 18%)' : 'CGST (9%) + SGST (9%)'}</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Buyer: {business.state || 'Karnataka'} | Seller: {selectedVendor.state || 'Karnataka'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bill Date</label>
                  <input 
                    type="date" 
                    value={newBill.billDate}
                    onChange={(e) => setNewBill({ ...newBill, billDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    value={newBill.dueDate}
                    onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Expense Item Description</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Dedicated Server Hosting & VPS"
                  value={newBill.items[0].description}
                  onChange={(e) => {
                    const items = [...newBill.items];
                    items[0].description = e.target.value;
                    setNewBill({ ...newBill, items });
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Amount (₹)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="20000"
                    value={newBill.items[0].rate}
                    onChange={(e) => {
                      const items = [...newBill.items];
                      items[0].rate = Number(e.target.value);
                      setNewBill({ ...newBill, items });
                    }}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GST Tax Rate (%)</label>
                  <input 
                    type="number" 
                    value={newBill.items[0].taxRate}
                    onChange={(e) => {
                      const items = [...newBill.items];
                      items[0].taxRate = Number(e.target.value);
                      setNewBill({ ...newBill, items });
                    }}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox" 
                  id="itc"
                  checked={newBill.itcEligible}
                  onChange={(e) => setNewBill({ ...newBill, itcEligible: e.target.checked })}
                  className="w-4 h-4 text-mint-600 rounded"
                />
                <label htmlFor="itc" className="text-xs font-semibold text-slate-700">
                  Eligible for 100% Input Tax Credit (ITC)
                </label>
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
                  className="px-6 py-2.5 bg-mint-600 text-white font-bold rounded-xl shadow"
                >
                  Save Purchase Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
