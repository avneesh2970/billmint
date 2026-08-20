import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, CheckCircle2, Building, Receipt, Sparkles } from 'lucide-react';
import { apiRequest } from '../services/api';
import { getStateCodeFromState } from '../../../../packages/shared-utils/index.js';
import AddressStepForm from '../components/AddressStepForm.jsx';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [businessInfo, setBusinessInfo] = useState({
    name: 'Nova Creative Studio',
    businessType: 'Agency / Service Provider',
    logo: '',
    address: 'Suite 402, Mint Heights',
    city: 'Bengaluru',
    state: 'Karnataka',
    stateCode: '29',
    country: 'India',
    pincode: '560100',
    phone: '+91 98765 43210',
    email: 'billing@novacreative.in',
    website: 'https://novacreative.in'
  });

  const [taxInfo, setTaxInfo] = useState({
    gstin: '29ABCDE1234F1ZH',
    pan: 'ABCDE1234F',
    taxType: 'GST',
    defaultTaxRate: '18'
  });

  const handleFinish = async () => {
    try {
      await apiRequest('/business', 'PUT', { ...businessInfo, ...taxInfo });
    } catch (e) {
      console.warn('Using local fallback for business update');
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden p-8 sm:p-12 space-y-8">
        
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
          <div className="text-center space-y-6 py-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-mint-100 text-mint-600 flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-charcoal-900">Welcome to BillMint!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Let's set up your business details and multi-step GST state address so your invoices look 100% compliant and professional.
            </p>
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-mint-600 hover:bg-mint-700 text-white font-bold rounded-xl shadow-md transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Business Information */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3">
              <Building className="w-6 h-6 text-mint-600" />
              <h2 className="text-xl font-bold text-charcoal-900">Business Profile & Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Business Name</label>
                <input 
                  type="text" 
                  value={businessInfo.name} 
                  onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-mint-500 focus:outline-none font-medium" 
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Business Type</label>
                <input 
                  type="text" 
                  value={businessInfo.businessType} 
                  onChange={(e) => setBusinessInfo({ ...businessInfo, businessType: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-mint-500 focus:outline-none font-medium" 
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={businessInfo.phone} 
                  onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-mint-500 focus:outline-none font-medium" 
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Business Email</label>
                <input 
                  type="email" 
                  value={businessInfo.email} 
                  onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-mint-500 focus:outline-none font-medium" 
                />
              </div>
            </div>

            {/* Multi-step Address Input */}
            <div>
              <label className="block font-bold text-slate-900 mb-2">Multi-Step Business Address Configuration</label>
              <AddressStepForm
                value={{
                  address: businessInfo.address,
                  city: businessInfo.city,
                  state: businessInfo.state,
                  stateCode: businessInfo.stateCode,
                  pincode: businessInfo.pincode
                }}
                onChange={(addr) => {
                  setBusinessInfo(prev => ({
                    ...prev,
                    ...addr
                  }));
                }}
              />
            </div>

            <div className="flex justify-between pt-4">
              <button 
                onClick={() => setStep(1)} 
                className="text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                Back
              </button>
              <button 
                onClick={() => setStep(3)} 
                className="px-6 py-2.5 bg-mint-600 text-white font-bold text-xs rounded-xl shadow"
              >
                Next: Tax Info →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Tax Information */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3">
              <Receipt className="w-6 h-6 text-mint-600" />
              <h2 className="text-xl font-bold text-charcoal-900">Tax & Compliance Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">GSTIN Number (Optional)</label>
                <input 
                  type="text" 
                  value={taxInfo.gstin} 
                  onChange={(e) => setTaxInfo({ ...taxInfo, gstin: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-mint-500 focus:outline-none uppercase font-mono" 
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">PAN Number (Optional)</label>
                <input 
                  type="text" 
                  value={taxInfo.pan} 
                  onChange={(e) => setTaxInfo({ ...taxInfo, pan: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-mint-500 focus:outline-none uppercase font-mono" 
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tax System</label>
                <select 
                  value={taxInfo.taxType}
                  onChange={(e) => setTaxInfo({ ...taxInfo, taxType: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-mint-500 focus:outline-none"
                >
                  <option value="GST">Indian GST (CGST + SGST / IGST)</option>
                  <option value="VAT">VAT</option>
                  <option value="None">No Tax</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Default Tax Rate (%)</label>
                <input 
                  type="number" 
                  value={taxInfo.defaultTaxRate} 
                  onChange={(e) => setTaxInfo({ ...taxInfo, defaultTaxRate: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-mint-500 focus:outline-none" 
                />
              </div>
            </div>

            <div className="bg-mint-50 border border-mint-200 rounded-2xl p-4 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-mint-600 mx-auto" />
              <h3 className="text-base font-bold text-mint-950">Your BillMint workspace is ready.</h3>
              <p className="text-xs text-mint-800">You can now start generating professional invoices, managing customers, and recording payments.</p>
            </div>

            <div className="flex justify-between pt-2">
              <button 
                onClick={() => setStep(2)} 
                className="text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                Back
              </button>
              <button 
                onClick={handleFinish} 
                className="px-8 py-3 bg-mint-600 hover:bg-mint-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
              >
                Go to Dashboard 🎉
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
