import React, { useState } from 'react';
import { 
  Building, FileText, CreditCard, User, Shield, 
  Sparkles, CheckCircle2, Save, ArrowUpRight 
} from 'lucide-react';
import { apiRequest } from '../services/api';
import { getStateCodeFromState, parseGSTIN } from '../../../../packages/shared-utils/index.js';
import AddressStepForm from '../components/AddressStepForm.jsx';

export default function SettingsPage({ business = {}, onUpdateBusiness }) {
  const [activeTab, setActiveTab] = useState('business');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [form, setForm] = useState({
    name: business.name || 'Nova Creative Studio',
    businessType: business.businessType || 'Agency / Service Provider',
    email: business.email || 'billing@novacreative.in',
    phone: business.phone || '+91 98765 43210',
    website: business.website || 'https://novacreative.in',
    address: business.address || 'Suite 402, Mint Heights, Cyber City',
    city: business.city || 'Bengaluru',
    state: business.state || 'Karnataka',
    stateCode: business.stateCode || getStateCodeFromState(business.state || 'Karnataka') || '29',
    pincode: business.pincode || '560100',
    gstin: business.gstin || '29ABCDE1234F1ZH',
    pan: business.pan || 'ABCDE1234F',
    invoicePrefix: business.invoicePrefix || 'INV-2026-',
    defaultTaxRate: business.defaultTaxRate || 18,
    bankName: business.bankDetails?.bankName || 'HDFC Bank',
    accountName: business.bankDetails?.accountName || 'Nova Creative Studio Pvt Ltd',
    accountNumber: business.bankDetails?.accountNumber || '50200012345678',
    ifsc: business.bankDetails?.ifsc || 'HDFC0001234',
    upiId: business.bankDetails?.upiId || 'novacreative@hdfcbank',
    defaultTerms: business.defaultTerms || 'Payment due within 15 days.',
    defaultNotes: business.defaultNotes || 'Thank you for your business!'
  });

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateBusiness({
      ...business,
      ...form,
      bankDetails: {
        bankName: form.bankName,
        accountName: form.accountName,
        accountNumber: form.accountNumber,
        ifsc: form.ifsc,
        upiId: form.upiId
      }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">Workspace Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure business details, multi-step billing address, GST rules, and security settings.
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-1 overflow-x-auto">
        {[
          { id: 'business', label: 'Business Profile', icon: Building },
          { id: 'invoice', label: 'Invoice Defaults', icon: FileText },
          { id: 'payment', label: 'Bank & UPI', icon: CreditCard },
          { id: 'profile', label: 'Account Profile', icon: User },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'subscription', label: 'Subscription Plan', icon: Sparkles },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-mint-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          
          {/* Business Profile */}
          {activeTab === 'business' && (
            <div className="space-y-5">
              <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">Business Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Name</label>
                  <input 
                    type="text" 
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-semibold" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Type</label>
                  <input 
                    type="text" 
                    value={form.businessType}
                    onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-semibold" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GSTIN Number</label>
                  <input 
                    type="text" 
                    value={form.gstin}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      const parsed = parseGSTIN(val);
                      setForm(prev => ({
                        ...prev,
                        gstin: val,
                        ...(parsed.stateCode ? { stateCode: parsed.stateCode, state: parsed.state } : {})
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-mono uppercase font-bold text-slate-900" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">PAN Number</label>
                  <input 
                    type="text" 
                    value={form.pan}
                    onChange={(e) => setForm({ ...form, pan: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-mono uppercase font-bold text-slate-900" 
                  />
                </div>
              </div>

              {/* Multi-step Business Address Input */}
              <div className="pt-2">
                <label className="block font-bold text-slate-900 mb-2">Multi-Step Business Address Configuration</label>
                <AddressStepForm
                  value={{
                    address: form.address,
                    city: form.city,
                    state: form.state,
                    stateCode: form.stateCode,
                    pincode: form.pincode
                  }}
                  onChange={(addr) => {
                    setForm(prev => ({
                      ...prev,
                      ...addr
                    }));
                  }}
                />
              </div>

            </div>
          )}

          {/* Invoice Defaults */}
          {activeTab === 'invoice' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">Invoice Defaults & Terms</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Invoice Prefix</label>
                  <input 
                    type="text" 
                    value={form.invoicePrefix}
                    onChange={(e) => setForm({ ...form, invoicePrefix: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-mono" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Default GST Rate (%)</label>
                  <input 
                    type="number" 
                    value={form.defaultTaxRate}
                    onChange={(e) => setForm({ ...form, defaultTaxRate: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl" 
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Default Terms & Conditions</label>
                  <textarea 
                    rows="3"
                    value={form.defaultTerms}
                    onChange={(e) => setForm({ ...form, defaultTerms: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl" 
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">Bank & UPI Payment Instructions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
                  <input 
                    type="text" 
                    value={form.bankName}
                    onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Holder Name</label>
                  <input 
                    type="text" 
                    value={form.accountName}
                    onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Number</label>
                  <input 
                    type="text" 
                    value={form.accountNumber}
                    onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-mono" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">IFSC Code</label>
                  <input 
                    type="text" 
                    value={form.ifsc}
                    onChange={(e) => setForm({ ...form, ifsc: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-mono uppercase" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">UPI ID</label>
                  <input 
                    type="text" 
                    value={form.upiId}
                    onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-mono" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Profile & Security */}
          {(activeTab === 'profile' || activeTab === 'security') && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">Account Credentials</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input type="text" readOnly value={form.email} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Change Password</label>
                  <input type="password" placeholder="New Password" className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl" />
                </div>
              </div>
            </div>
          )}

          {/* Subscription */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-mint-400 uppercase tracking-widest">Active Plan</span>
                  <span className="bg-mint-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">Pro Plan</span>
                </div>
                <div className="text-2xl font-extrabold">₹299 / month</div>
                <p className="text-xs text-slate-400">Your subscription renews automatically on 01 Sep 2026.</p>
              </div>

              <div className="pt-2">
                <a href="http://localhost:3000/pricing" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-mint-600 hover:underline">
                  Compare Plans & Upgrade →
                </a>
              </div>
            </div>
          )}

          {activeTab !== 'subscription' && (
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="submit"
                className="px-6 py-3 bg-mint-600 hover:bg-mint-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          )}

        </form>
      </div>

    </div>
  );
}
