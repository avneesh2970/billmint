import React, { useState, useEffect } from 'react';
import { MapPin, Building, Map, Hash, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { INDIAN_STATES, getStateCodeFromState, getStateFromStateCode } from '../../../../packages/shared-utils/index.js';

/**
 * Reusable Multi-Step Address Component
 * Steps:
 *  Step 1: Street Address / Building
 *  Step 2: City
 *  Step 3: State & GST State Code
 *  Step 4: Pin Code
 */
export default function AddressStepForm({ 
  value = { address: '', city: '', state: '', stateCode: '', pincode: '' }, 
  onChange,
  className = '' 
}) {
  const [activeStep, setActiveStep] = useState(1);

  const [addressData, setAddressData] = useState({
    address: value.address || '',
    city: value.city || '',
    state: value.state || 'Karnataka',
    stateCode: value.stateCode || '29',
    pincode: value.pincode || value.pinCode || ''
  });

  useEffect(() => {
    setAddressData({
      address: value.address || '',
      city: value.city || '',
      state: value.state || 'Karnataka',
      stateCode: value.stateCode || (getStateCodeFromState(value.state) || '29'),
      pincode: value.pincode || value.pinCode || ''
    });
  }, [value.address, value.city, value.state, value.stateCode, value.pincode]);

  const updateField = (field, val) => {
    let updated = { ...addressData, [field]: val };

    // Auto-link State & State Code
    if (field === 'state') {
      const code = getStateCodeFromState(val);
      if (code) updated.stateCode = code;
    } else if (field === 'stateCode') {
      const name = getStateFromStateCode(val);
      if (name) updated.state = name;
    }

    setAddressData(updated);
    if (onChange) onChange(updated);
  };

  const steps = [
    { num: 1, label: 'Street Address', icon: MapPin },
    { num: 2, label: 'City', icon: Building },
    { num: 3, label: 'State & Code', icon: Map },
    { num: 4, label: 'Pin Code', icon: Hash }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Multi-Step Header / Stepper Pills */}
      <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-1 overflow-x-auto text-xs">
        {steps.map(step => {
          const Icon = step.icon;
          const isActive = activeStep === step.num;
          const isFilled = step.num === 1 ? !!addressData.address :
                           step.num === 2 ? !!addressData.city :
                           step.num === 3 ? !!addressData.state : !!addressData.pincode;

          return (
            <button
              key={step.num}
              type="button"
              onClick={() => setActiveStep(step.num)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap font-bold ${
                isActive 
                  ? 'bg-mint-600 text-white shadow-xs' 
                  : isFilled 
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>Step {step.num}: {step.label}</span>
              {isFilled && !isActive && <CheckCircle2 className="w-3 h-3 text-emerald-600 ml-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        
        {/* Step 1: Address Line */}
        {activeStep === 1 && (
          <div className="space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold text-charcoal-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-mint-600" /> Step 1: Street Address / Building / Plot No.
              </label>
              <span className="text-[11px] text-slate-400 font-semibold">1 of 4</span>
            </div>
            <input 
              type="text"
              placeholder="e.g. Suite 402, Mint Heights, Cyber City"
              value={addressData.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-mint-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400">Specify building name, street, locality, or landmark.</p>
          </div>
        )}

        {/* Step 2: City */}
        {activeStep === 2 && (
          <div className="space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold text-charcoal-900 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-mint-600" /> Step 2: City / District / Town
              </label>
              <span className="text-[11px] text-slate-400 font-semibold">2 of 4</span>
            </div>
            <input 
              type="text"
              placeholder="e.g. Bengaluru / Noida / Mumbai"
              value={addressData.city}
              onChange={(e) => updateField('city', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-mint-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400">City or district location for municipal tax classification.</p>
          </div>
        )}

        {/* Step 3: State & State Code */}
        {activeStep === 3 && (
          <div className="space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold text-charcoal-900 flex items-center gap-1.5">
                <Map className="w-4 h-4 text-mint-600" /> Step 3: State & GST State Code
              </label>
              <span className="text-[11px] text-slate-400 font-semibold">3 of 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">State Name</label>
                <select
                  value={addressData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-mint-500 focus:outline-none"
                >
                  {INDIAN_STATES.map(s => (
                    <option key={s.code} value={s.state}>
                      {s.state} (Code: {s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">State Code</label>
                <input
                  type="text"
                  placeholder="e.g. 29"
                  maxLength={2}
                  value={addressData.stateCode}
                  onChange={(e) => updateField('stateCode', e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 bg-slate-50 focus:ring-2 focus:ring-mint-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="bg-mint-50 p-2.5 rounded-xl border border-mint-100 text-[11px] text-mint-800 font-medium">
              💡 State Code determines whether <strong>CGST + SGST (Same State)</strong> or <strong>IGST (Different State)</strong> applies to invoices.
            </div>
          </div>
        )}

        {/* Step 4: Pin Code */}
        {activeStep === 4 && (
          <div className="space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold text-charcoal-900 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-mint-600" /> Step 4: Pin Code / Postal Code
              </label>
              <span className="text-[11px] text-slate-400 font-semibold">4 of 4</span>
            </div>
            <input 
              type="text"
              placeholder="e.g. 560100"
              maxLength={6}
              value={addressData.pincode}
              onChange={(e) => updateField('pincode', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-mint-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400">6-digit Indian PIN code for postal & delivery address.</p>
          </div>
        )}

        {/* Stepper Navigation Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <button
            type="button"
            disabled={activeStep === 1}
            onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Step
          </button>

          {activeStep < 4 ? (
            <button
              type="button"
              onClick={() => setActiveStep(prev => Math.min(4, prev + 1))}
              className="px-3.5 py-1.5 bg-mint-600 hover:bg-mint-700 text-white font-bold rounded-lg shadow-xs flex items-center gap-1"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Address Steps Complete
            </span>
          )}
        </div>

      </div>

      {/* Live Formatted Address Card */}
      <div className="bg-slate-900 text-white p-3.5 rounded-2xl text-xs flex items-start justify-between gap-3 shadow-md">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-mint-400 font-extrabold block mb-0.5">
            Full Multi-Part Address Preview
          </span>
          <p className="font-semibold text-slate-200 leading-snug">
            {addressData.address || 'Street Address'}, {addressData.city || 'City'}, {addressData.state || 'State'} 
            {addressData.stateCode ? ` (State Code: ${addressData.stateCode})` : ''} - {addressData.pincode || 'PIN'}
          </p>
        </div>
        <span className="bg-mint-500/20 text-mint-300 font-mono font-bold px-2 py-1 rounded text-[10px] whitespace-nowrap">
          Code: {addressData.stateCode || '29'}
        </span>
      </div>

    </div>
  );
}
