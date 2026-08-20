import React from 'react';
import { Building, CheckCircle2 } from 'lucide-react';

export default function BusinessManagement() {
  const businesses = [
    { id: 'bus_1', name: 'Nova Creative Studio', owner: 'Nova Creative Owner', gstin: '29ABCDE1234F1ZH', plan: 'Pro', status: 'Active', city: 'Bengaluru' },
    { id: 'bus_2', name: 'ABC Enterprises Pvt. Ltd.', owner: 'Rahul Sharma', gstin: '07AAACA1234B1ZB', plan: 'Business', status: 'Active', city: 'Noida' },
    { id: 'bus_3', name: 'Apex Digital Solutions', owner: 'Vikram Sengupta', gstin: '19AACCA9876D1ZF', plan: 'Free', status: 'Active', city: 'Kolkata' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Business Profiles</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor registered tenant businesses and GST compliance across BillMint.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Business Entity</th>
                <th className="py-3.5 px-6">Owner</th>
                <th className="py-3.5 px-6">GSTIN</th>
                <th className="py-3.5 px-6">Location</th>
                <th className="py-3.5 px-6 text-center">Current Plan</th>
                <th className="py-3.5 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {businesses.map(b => (
                <tr key={b.id} className="hover:bg-slate-850">
                  <td className="py-4 px-6 font-bold text-white">{b.name}</td>
                  <td className="py-4 px-6 text-slate-300">{b.owner}</td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-400">{b.gstin}</td>
                  <td className="py-4 px-6 text-slate-400">{b.city}</td>
                  <td className="py-4 px-6 text-center font-bold text-mint-400">{b.plan}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
