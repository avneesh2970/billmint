import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, CheckCircle2, Building, Receipt, Sparkles } from 'lucide-react';
import { apiRequest } from '../services/api';

export default function OnboardingPage() {
  const navigate = useNavigate();

  // Pre-fill from the authenticated user stored at signup — no fake data
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('billmint_user') || '{}'); } catch { return {}; }
  })();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [businessInfo, setBusinessInfo] = useState({
    name: storedUser.fullName ? `${storedUser.fullName}'s Business` : '',
    businessType: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    phone: '',
    email: storedUser.email || '',
    website: ''
  });

  const [taxInfo, setTaxInfo] = useState({
    gstin: '',
    pan: '',
    taxType: 'GST',
    defaultTaxRate: '18'
  });

  const handleFinish = async () => {
    setSaving(true);
    setError('');
    try {
      await apiRequest('/business', 'PUT', { ...businessInfo, ...taxInfo });
      // Mark this user as onboarded
      localStorage.setItem('billmint_onboarded', 'true');
      navigate('/dashboard');
    } catch (e) {
      setError('Could not save your business profile. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const field = (label, key, type = 'text', stateObj, setFn, placeholder = '') => (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1">{label}</label>
      <input
        type={type}
        value={stateObj[key]}
        placeholder={placeholder}
        onChange={(e) => setFn(prev => ({ ...prev, [key]: e.target.value }))}
        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-mint-500 focus:outline-none text-sm font-medium"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden p-8 sm:p-12 space-y-8">

        {/* Logo */}
        <div className="flex items-center gap-2 justify-center">
          <div className="w-8 h-8 rounded-xl bg-mint-600 text-white flex items-center justify-center shadow-md">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-charcoal-900 font-extrabold text-xl">Bill<span className="text-mint-600">Mint</span></span>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-mint-600 text-white flex items-center justify-center font-bold text-sm">
              {step}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Step {step} of 3</span>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${s === step ? 'w-8 bg-mint-600' : s < step ? 'w-4 bg-mint-300' : 'w-4 bg-slate-200'}`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-2xl bg-mint-100 text-mint-600 flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-charcoal-900">
              Welcome, {storedUser.fullName || 'there'}! 👋
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Let's set up your business workspace in 2 quick steps. Your data is completely private — only you can see your invoices, customers and payments.
            </p>
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-mint-600 hover:bg-mint-700 text-white font-bold rounded-xl shadow-md transition-all"
            >
              <span>Set Up My Business</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Business Information */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Building className="w-6 h-6 text-mint-600" />
              <h2 className="text-xl font-bold text-charcoal-900">Business Profile</h2>
            </div>
            <p className="text-xs text-slate-500">This information will appear on all your invoices.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field('Business Name *', 'name', 'text', businessInfo, setBusinessInfo, 'e.g. Sharma Enterprises')}
              {field('Business Type', 'businessType', 'text', businessInfo, setBusinessInfo, 'e.g. Freelancer, Agency, Retailer')}
              {field('Business Email', 'email', 'email', businessInfo, setBusinessInfo, 'billing@yourbusiness.com')}
              {field('Phone Number', 'phone', 'tel', businessInfo, setBusinessInfo, '+91 98765 43210')}
              {field('Website (Optional)', 'website', 'url', businessInfo, setBusinessInfo, 'https://yourbusiness.com')}
              {field('Street Address', 'address', 'text', businessInfo, setBusinessInfo, '42, MG Road, Office 301')}
              {field('City', 'city', 'text', businessInfo, setBusinessInfo, 'Bengaluru')}
              {field('State', 'state', 'text', businessInfo, setBusinessInfo, 'Karnataka')}
              {field('Pincode', 'pincode', 'text', businessInfo, setBusinessInfo, '560001')}
            </div>

            {!businessInfo.name.trim() && (
              <p className="text-xs text-rose-500 font-medium">Business name is required to continue.</p>
            )}

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(1)} className="text-xs font-semibold text-slate-500 hover:text-slate-900">
                Back
              </button>
              <button
                onClick={() => { if (businessInfo.name.trim()) setStep(3); }}
                disabled={!businessInfo.name.trim()}
                className="px-6 py-2.5 bg-mint-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow"
              >
                Next: Tax Info →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Tax Information */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Receipt className="w-6 h-6 text-mint-600" />
              <h2 className="text-xl font-bold text-charcoal-900">Tax & Compliance Details</h2>
            </div>
            <p className="text-xs text-slate-500">These are optional — you can fill them later in Settings.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field('GSTIN Number (Optional)', 'gstin', 'text', taxInfo, setTaxInfo, '29ABCDE1234F1ZH')}
              {field('PAN Number (Optional)', 'pan', 'text', taxInfo, setTaxInfo, 'ABCDE1234F')}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tax System</label>
                <select
                  value={taxInfo.taxType}
                  onChange={(e) => setTaxInfo(prev => ({ ...prev, taxType: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-mint-500 focus:outline-none text-sm"
                >
                  <option value="GST">Indian GST (CGST + SGST / IGST)</option>
                  <option value="VAT">VAT</option>
                  <option value="None">No Tax</option>
                </select>
              </div>
              {field('Default Tax Rate (%)', 'defaultTaxRate', 'number', taxInfo, setTaxInfo, '18')}
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl">
                {error}
              </div>
            )}

            <div className="bg-mint-50 border border-mint-200 rounded-2xl p-4 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-mint-600 mx-auto" />
              <h3 className="text-base font-bold text-mint-950">Your BillMint workspace is ready.</h3>
              <p className="text-xs text-mint-800">
                All your invoices, customers and payments will be stored privately — only accessible with your account.
              </p>
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(2)} className="text-xs font-semibold text-slate-500 hover:text-slate-900">
                Back
              </button>
              <button
                onClick={handleFinish}
                disabled={saving}
                className="px-8 py-3 bg-mint-600 hover:bg-mint-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
              >
                {saving ? 'Saving...' : 'Launch My Dashboard 🎉'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
