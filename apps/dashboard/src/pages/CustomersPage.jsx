import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Search, Users, Edit3, Trash2, Building, Mail, Phone, MapPin, Receipt, X, Eye, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { formatCurrency, parseGSTIN, getStateCodeFromState, getStateFromStateCode } from '../../../../packages/shared-utils/index.js';
import { fetchGSTDetails } from '../services/gst';
import AddressStepForm from '../components/AddressStepForm.jsx';

export default function CustomersPage({ customers = [], invoices = [], onAddCustomer, onDeleteCustomer, onRecordPayment }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomerForHistory, setSelectedCustomerForHistory] = useState(null);
  const [gstLoading, setGstLoading] = useState(false);
  const [gstFeedback, setGstFeedback] = useState({ message: '', error: false });
  const navigate = useNavigate();

  const [newCust, setNewCust] = useState({
    name: '', company: '', email: '', phone: '', address: '', city: '', state: 'Karnataka', stateCode: '29', pincode: '', gstin: '', pan: '', notes: ''
  });


  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomerGSTFetch = async (gstinVal) => {
    const clean = (gstinVal || newCust.gstin || '').trim().toUpperCase();
    if (clean.length !== 15) return;
    setGstLoading(true);
    setGstFeedback({ message: 'Fetching customer details from GST Portal...', error: false });
    try {
      const data = await fetchGSTDetails(clean);
      if (data && data.success) {
        setNewCust(prev => ({
          ...prev,
          gstin: clean,
          company: data.tradeName || data.legalName || prev.company,
          name: prev.name || (data.legalName ? data.legalName.split(' ')[0] : 'Client Contact'),
          pan: data.pan || prev.pan,
          address: data.address || prev.address,
          city: data.city || prev.city,
          state: data.state || prev.state,
          stateCode: data.stateCode || prev.stateCode,
          pincode: data.pincode || prev.pincode
        }));
        const hasLiveName = Boolean(data.tradeName || data.legalName);
        if (hasLiveName) {
          setGstFeedback({
            message: `✓ Live Verified: ${data.tradeName || data.legalName} (${data.status})`,
            error: false
          });
        } else {
          setGstFeedback({
            message: `✓ State (${data.state}) & PAN verified. Enter client name & street address below.`,
            error: false
          });
        }
        setTimeout(() => setGstFeedback({ message: '', error: false }), 8000);
      } else {
        setGstFeedback({ message: data?.message || 'GSTIN details not found', error: true });
      }
    } catch (err) {
      setGstFeedback({ message: err.message || 'Could not fetch GST details', error: true });
    } finally {
      setGstLoading(false);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    onAddCustomer({ id: `cust_${Date.now()}`, ...newCust });
    setShowAddModal(false);
    setNewCust({ name: '', company: '', email: '', phone: '', address: '', city: '', state: '', gstin: '', pan: '', notes: '' });
    setGstFeedback({ message: '', error: false });
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">Customers</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage client profiles, billing addresses, GSTIN numbers, and full invoice history.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-mint-600 hover:bg-mint-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text"
            placeholder="Search customers by name, company, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-mint-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map(cust => {
          const custInvoices = invoices.filter(i => i.customerId === cust.id || i.customerName === cust.company || i.customerName === cust.name);
          const totalBilled = custInvoices.reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0);
          const totalPaid = custInvoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0);
          const outstanding = totalBilled - totalPaid;

          return (
            <div 
              key={cust.id} 
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg transition-all space-y-4 flex flex-col justify-between group cursor-pointer"
              onClick={() => setSelectedCustomerForHistory(cust)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-mint-100 text-mint-700 flex items-center justify-center font-bold text-sm">
                    {cust.company ? cust.company.substring(0, 2).toUpperCase() : 'CU'}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteCustomer && onDeleteCustomer(cust.id); }}
                    className="p-1 text-slate-400 hover:text-rose-500"
                    title="Delete Customer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-charcoal-900 group-hover:text-mint-600 transition-colors flex items-center gap-1.5">
                    {cust.company || cust.name}
                  </h3>
                  <p className="text-xs text-slate-500">Contact: {cust.name}</p>
                </div>

                <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cust.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cust.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <Receipt className="w-3.5 h-3.5 text-slate-400" />
                    <span>GSTIN: {cust.gstin || 'Unregistered'}</span>
                  </div>
                </div>
              </div>

              {/* Financial Stats & View History Button */}
              <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Invoices</span>
                    <span className="font-bold text-slate-800">{custInvoices.length}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Billed</span>
                    <span className="font-bold text-slate-800">{formatCurrency(totalBilled)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Balance</span>
                    <span className={`font-bold ${outstanding > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {formatCurrency(outstanding)}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedCustomerForHistory(cust); }}
                  className="w-full py-2 bg-slate-100 hover:bg-mint-50 hover:text-mint-700 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Check Customer History ({custInvoices.length})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Invoices History Modal / Drawer */}
      {selectedCustomerForHistory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-mint-600 uppercase tracking-widest bg-mint-50 px-2.5 py-1 rounded-full">
                  Customer Billing History
                </span>
                <h2 className="text-2xl font-extrabold text-charcoal-900 mt-1">
                  {selectedCustomerForHistory.company || selectedCustomerForHistory.name}
                </h2>
                <p className="text-xs text-slate-500">
                  GSTIN: {selectedCustomerForHistory.gstin || 'N/A'} | State: {selectedCustomerForHistory.state || 'N/A'}
                </p>
              </div>

              <button 
                onClick={() => setSelectedCustomerForHistory(null)} 
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Customer Summary Cards */}
            {(() => {
              const cInvoices = invoices.filter(i => i.customerId === selectedCustomerForHistory.id || i.customerName === selectedCustomerForHistory.company || i.customerName === selectedCustomerForHistory.name);
              const billed = cInvoices.reduce((s, i) => s + (Number(i.grandTotal) || 0), 0);
              const paid = cInvoices.filter(i => i.status === 'Paid').reduce((s, i) => s + (Number(i.grandTotal) || 0), 0);
              const due = billed - paid;

              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center text-xs">
                    <div>
                      <span className="text-slate-400 uppercase font-semibold">Total Invoiced</span>
                      <p className="text-base font-extrabold text-slate-900">{formatCurrency(billed)}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase font-semibold">Total Collected</span>
                      <p className="text-base font-extrabold text-emerald-600">{formatCurrency(paid)}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase font-semibold">Outstanding Due</span>
                      <p className={`text-base font-extrabold ${due > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {formatCurrency(due)}
                      </p>
                    </div>
                  </div>

                  {/* Customer Invoices Table */}
                  <div>
                    <h3 className="text-sm font-bold text-charcoal-900 mb-3 flex items-center justify-between">
                      <span>Invoices History ({cInvoices.length})</span>
                      <Link 
                        to="/invoices/new" 
                        onClick={() => setSelectedCustomerForHistory(null)}
                        className="text-xs font-bold text-mint-600 hover:underline"
                      >
                        + Create Invoice for this Customer
                      </Link>
                    </h3>

                    {cInvoices.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">No invoices created for this customer yet.</p>
                    ) : (
                      <div className="border border-slate-200 rounded-2xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                            <tr>
                              <th className="py-2.5 px-4">Invoice #</th>
                              <th className="py-2.5 px-3">Date</th>
                              <th className="py-2.5 px-3 text-right">Total</th>
                              <th className="py-2.5 px-3 text-right">Paid</th>
                              <th className="py-2.5 px-3 text-right">Pending</th>
                              <th className="py-2.5 px-3 text-center">Status</th>
                              <th className="py-2.5 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {cInvoices.map(inv => {
                              const paidAmt = inv.status === 'Paid' ? Number(inv.grandTotal) : (Number(inv.amountPaid) || 0);
                              const pendingAmt = inv.status === 'Paid' ? 0 : Math.max(0, Number(inv.grandTotal) - paidAmt);

                              return (
                                <tr key={inv.id} className="hover:bg-slate-50">
                                  <td className="py-3 px-4 font-bold text-slate-900">{inv.invoiceNumber}</td>
                                  <td className="py-3 px-3 text-slate-500">{inv.issueDate}</td>
                                  <td className="py-3 px-3 text-right font-bold text-slate-900">{formatCurrency(inv.grandTotal)}</td>
                                  <td className="py-3 px-3 text-right font-bold text-emerald-600">{formatCurrency(paidAmt)}</td>
                                  <td className="py-3 px-3 text-right font-bold text-rose-600">{formatCurrency(pendingAmt)}</td>
                                  <td className="py-3 px-3 text-center">
                                    <span className={
                                      inv.status === 'Paid' ? 'badge-paid' :
                                      inv.status === 'Partially Paid' ? 'badge-pending' :
                                      inv.status === 'Pending' ? 'badge-pending' :
                                      inv.status === 'Overdue' ? 'badge-overdue' : 'badge-draft'
                                    }>
                                      {inv.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                                    {inv.status !== 'Paid' && onRecordPayment && (
                                      <button
                                        onClick={() => {
                                          onRecordPayment({
                                            invoiceId: inv.id,
                                            amount: pendingAmt,
                                            paymentMethod: 'UPI',
                                            notes: `Settled via customer history drawer`
                                          });
                                        }}
                                        className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-xs"
                                        title="Mark 100% Paid"
                                      >
                                        Mark Paid
                                      </button>
                                    )}
                                    <button 
                                      onClick={() => { setSelectedCustomerForHistory(null); navigate(`/invoices/${inv.id}`); }}
                                      className="p-1 text-mint-600 font-bold hover:underline"
                                    >
                                      View →
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
                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-charcoal-900">Add New Customer</h3>
                <p className="text-xs text-slate-500">Create customer profile with multi-step billing address & GST state code.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Acme Corporation"
                    value={newCust.company}
                    onChange={(e) => setNewCust({ ...newCust, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Person</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. John Doe"
                    value={newCust.name}
                    onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="client@company.com"
                    value={newCust.email}
                    onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input 
                    type="text" 
                    placeholder="+91 98765 43210"
                    value={newCust.phone}
                    onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* GSTIN with Auto-Fetch */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="block font-bold text-slate-800">
                    GSTIN Number (Optional)
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Enter 15-character GSTIN to auto-fetch client details & address
                  </span>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      placeholder="e.g. 07AAACA1234B1ZB"
                      maxLength={15}
                      value={newCust.gstin}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '');
                        const parsed = parseGSTIN(val);
                        setNewCust(prev => ({
                          ...prev,
                          gstin: val,
                          ...(parsed.stateCode ? { stateCode: parsed.stateCode, state: parsed.state } : {})
                        }));
                        if (val.length === 15) {
                          handleCustomerGSTFetch(val);
                        }
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl uppercase font-mono text-xs font-bold text-slate-900 bg-white tracking-wider focus:ring-2 focus:ring-mint-500 focus:outline-none"
                    />
                    {gstLoading && (
                      <div className="absolute right-2.5 top-2.5 text-mint-600 animate-spin">
                        <Loader2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCustomerGSTFetch(newCust.gstin)}
                    disabled={gstLoading || newCust.gstin.length !== 15}
                    className="px-3 py-2 bg-mint-600 hover:bg-mint-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all shrink-0"
                  >
                    {gstLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    <span>Auto-fetch</span>
                  </button>
                </div>

                {gstFeedback.message && (
                  <div className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
                    gstFeedback.error ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {!gstFeedback.error && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    <span>{gstFeedback.message}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">PAN Number (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. AAACA1234B"
                  maxLength={10}
                  value={newCust.pan}
                  onChange={(e) => setNewCust({ ...newCust, pan: e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '') })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-mono uppercase font-bold text-slate-900" 
                />
              </div>

              {/* Multi-step Address Section */}
              <div>
                <label className="block font-bold text-slate-900 mb-1">Multi-Step Billing Address</label>
                <AddressStepForm
                  value={{
                    address: newCust.address,
                    city: newCust.city,
                    state: newCust.state,
                    stateCode: newCust.stateCode,
                    pincode: newCust.pincode
                  }}
                  onChange={(addrData) => {
                    setNewCust(prev => ({
                      ...prev,
                      ...addrData
                    }));
                  }}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-500 font-bold hover:text-slate-900"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-mint-600 hover:bg-mint-700 text-white font-bold rounded-xl shadow-md"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
