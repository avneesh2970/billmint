import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, CheckCircle2, Building, Receipt, Sparkles, Loader2 } from 'lucide-react';
import { apiRequest } from '../services/api';
import { fetchGSTDetails } from '../services/gst';
import { parseGSTIN } from '../../../../packages/shared-utils/index.js';

export default function OnboardingPage() {
  const navigate = useNavigate();

  // Pre-fill from the authenticated user stored at signup — no fake data
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('billmint_user') || '{}'); } catch { return {}; }
  })();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [gstLoading, setGstLoading] = useState(false);
  const [gstFeedback, setGstFeedback] = useState({ message: '', error: false });

  const [businessInfo, setBusinessInfo] = useState({
    name: storedUser.fullName ? `${storedUser.fullName}'s Business` : '',
    businessType: '',
    address: '',
    city: '',
    state: '',
    stateCode: '',
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

  const handleGSTFetch = async (gstinVal) => {
    const clean = (gstinVal || taxInfo.gstin || '').trim().toUpperCase();
    if (clean.length !== 15) return;
    setGstLoading(true);
    setGstFeedback({ message: 'Fetching verified business details from GST Portal...', error: false });
    try {
      const data = await fetchGSTDetails(clean);
      if (data && data.success) {
        setBusinessInfo(prev => ({
          ...prev,
          name: data.tradeName || data.legalName || prev.name,
          businessType: data.constitution || prev.businessType,
          address: data.address || prev.address,
          city: data.city || prev.city,
          state: data.state || prev.state,
          stateCode: data.stateCode || prev.stateCode,
          pincode: data.pincode || prev.pincode
        }));
        setTaxInfo(prev => ({
          ...prev,
          gstin: clean,
          pan: data.pan || prev.pan
        }));
        const hasLiveName = Boolean(data.tradeName || data.legalName);
        if (hasLiveName) {
          setGstFeedback({
            message: `✓ Live Verified: ${data.tradeName || data.legalName} (${data.status})`,
            error: false
          });
        } else {
          setGstFeedback({
            message: `✓ State (${data.state}) & PAN verified. Enter business name & street address below.`,
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

            {/* Quick Auto-Fill with GSTIN */}
            <div className="bg-mint-50/70 border border-mint-200/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-mint-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-mint-600" />
                  Have a GSTIN? Auto-Fill All Details
                </span>
                <span className="text-[10px] text-mint-700">Instant verification</span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter 15-character GSTIN (e.g. 29ABCDE1234F1ZH)"
                    maxLength={15}
                    value={taxInfo.gstin}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '');
                      setTaxInfo(prev => ({ ...prev, gstin: val }));
                      if (val.length === 15) {
                        handleGSTFetch(val);
                      }
                    }}
                    className="w-full px-3 py-2 border border-mint-200 rounded-xl uppercase font-mono text-xs font-bold text-slate-900 bg-white tracking-wider focus:ring-2 focus:ring-mint-500 focus:outline-none"
                  />
                  {gstLoading && (
                    <div className="absolute right-2.5 top-2.5 text-mint-600 animate-spin">
                      <Loader2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleGSTFetch(taxInfo.gstin)}
                  disabled={gstLoading || taxInfo.gstin.length !== 15}
                  className="px-4 py-2 bg-mint-600 hover:bg-mint-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all shrink-0"
                >
                  {gstLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  <span>Auto-fill</span>
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

            {/* GSTIN with Auto-Fetch */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="block text-xs font-bold text-slate-800">
                  GSTIN Number (Optional)
                </label>
                <span className="text-[10px] text-slate-500 font-medium">
                  Enter 15-character GSTIN to auto-fetch details
                </span>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="e.g. 29ABCDE1234F1ZH"
                    maxLength={15}
                    value={taxInfo.gstin}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '');
                      setTaxInfo(prev => ({ ...prev, gstin: val }));
                      if (val.length === 15) {
                        handleGSTFetch(val);
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
                  onClick={() => handleGSTFetch(taxInfo.gstin)}
                  disabled={gstLoading || taxInfo.gstin.length !== 15}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">PAN Number (Optional)</label>
                <input
                  type="text"
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  value={taxInfo.pan}
                  onChange={(e) => setTaxInfo(prev => ({ ...prev, pan: e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '') }))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-mint-500 focus:outline-none text-sm font-mono uppercase font-bold text-slate-900"
                />
              </div>
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
