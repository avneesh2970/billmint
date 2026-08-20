import React, { useState } from 'react';
import { Plus, Search, Building2, Trash2, Mail, Phone, MapPin, Receipt, X } from 'lucide-react';
import { formatCurrency, parseGSTIN, getStateCodeFromState } from '../../../../packages/shared-utils/index.js';
import AddressStepForm from '../components/AddressStepForm.jsx';

export default function VendorsPage({ vendors = [], purchaseBills = [], onAddVendor, onDeleteVendor }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [newVendor, setNewVendor] = useState({
    name: '', company: '', email: '', phone: '', address: '', city: '', state: 'Karnataka', stateCode: '29', pincode: '', gstin: '', pan: '', notes: ''
  });


  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e) => {
    e.preventDefault();
    onAddVendor({
      id: `vend_${Date.now()}`,
      ...newVendor
    });
    setShowModal(false);
    setNewVendor({ name: '', company: '', email: '', phone: '', address: '', city: '', state: 'Karnataka', gstin: '', pan: '', notes: '' });
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">Vendors & Suppliers</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Directory of external suppliers, contractors, and vendor GSTIN details.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-mint-600 hover:bg-mint-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vendor</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text"
            placeholder="Search vendors by company, contact person, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-mint-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map(vend => {
          const vBills = purchaseBills.filter(b => b.vendorId === vend.id || b.vendorName === vend.company || b.vendorName === vend.name);
          const totalPurchased = vBills.reduce((s, b) => s + (Number(b.grandTotal) || 0), 0);

          return (
            <div key={vend.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                    {vend.company ? vend.company.substring(0, 2).toUpperCase() : 'VE'}
                  </div>
                  <button 
                    onClick={() => onDeleteVendor && onDeleteVendor(vend.id)}
                    className="p-1 text-slate-400 hover:text-rose-500"
                    title="Delete Vendor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-charcoal-900">{vend.company || vend.name}</h3>
                  <p className="text-xs text-slate-500">Contact: {vend.name}</p>
                </div>

                <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{vend.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{vend.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <Receipt className="w-3.5 h-3.5 text-slate-400" />
                    <span>GSTIN: {vend.gstin || 'Unregistered'} ({vend.state || 'Karnataka'})</span>
                  </div>
                </div>
              </div>

              {/* Purchase Summary */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Bills</span>
                  <span className="font-bold text-slate-800">{vBills.length}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Expense</span>
                  <span className="font-bold text-slate-900">{formatCurrency(totalPurchased)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Vendor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-charcoal-900">Add New Vendor</h3>
                <p className="text-xs text-slate-500">Configure supplier profile with multi-step address & GST state code.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vendor / Company Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. CloudScale Tech"
                    value={newVendor.company}
                    onChange={(e) => setNewVendor({ ...newVendor, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Person</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={newVendor.name}
                    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="billing@vendor.com"
                    value={newVendor.email}
                    onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input 
                    type="text" 
                    placeholder="+91 98765 43210"
                    value={newVendor.phone}
                    onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* GSTIN & PAN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GSTIN Number (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="29AAACC1111A1Z1"
                    value={newVendor.gstin}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      const parsed = parseGSTIN(val);
                      setNewVendor(prev => ({
                        ...prev,
                        gstin: val,
                        ...(parsed.stateCode ? { stateCode: parsed.stateCode, state: parsed.state } : {})
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 border border-slate-200 bg-white rounded-xl uppercase font-mono text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">PAN Number (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="AAACC1111A"
                    value={newVendor.pan}
                    onChange={(e) => setNewVendor({ ...newVendor, pan: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 bg-white rounded-xl uppercase font-mono text-xs font-bold"
                  />
                </div>
              </div>

              {/* Multi-step Address Form */}
              <div>
                <label className="block font-bold text-slate-900 mb-1">Multi-Step Vendor Address</label>
                <AddressStepForm
                  value={{
                    address: newVendor.address,
                    city: newVendor.city,
                    state: newVendor.state,
                    stateCode: newVendor.stateCode,
                    pincode: newVendor.pincode
                  }}
                  onChange={(addr) => {
                    setNewVendor(prev => ({
                      ...prev,
                      ...addr
                    }));
                  }}
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
                  className="px-6 py-2.5 bg-mint-600 hover:bg-mint-700 text-white font-bold rounded-xl shadow-md"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
