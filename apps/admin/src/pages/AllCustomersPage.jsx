import React, { useState } from 'react';
import { 
  Users, Search, Building2, Mail, Phone, MapPin, 
  FileText, CheckCircle2, Clock, Shield, Eye
} from 'lucide-react';
import { formatCurrency } from '../../../../packages/shared-utils/index.js';

export default function AllCustomersPage({ customers = [], invoices = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = customers.filter(c => {
    const term = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.company?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.city?.toLowerCase().includes(term) ||
      c.gstin?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-mint-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            Platform Master Customer Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">All Customers & Client Profiles</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Complete admin visibility into client GSTIN, multi-step addresses, tax codes, and billing activity logs.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input 
            type="text"
            placeholder="Search customer name, company, email, city, GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-mint-500 focus:outline-none"
          />
        </div>
        <span className="text-xs font-bold text-slate-400">
          Showing {filteredCustomers.length} of {customers.length} Customers
        </span>
      </div>

      {/* Customers Directory Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-12 h-12 text-slate-700 mx-auto mb-2" />
            <p className="font-bold text-slate-400">No Customers Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-5">Customer / Company</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Multi-Step Address & Location</th>
                  <th className="py-3.5 px-4">GSTIN & PAN</th>
                  <th className="py-3.5 px-4 text-right">Invoices Billed</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCustomers.map((cust) => {
                  const custInvoices = invoices.filter(i => i.customerId === cust.id || i.customerName === cust.company || i.customerName === cust.name);
                  const totalInvoiced = custInvoices.reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0);

                  return (
                    <tr key={cust.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-white text-sm">{cust.name}</div>
                        <div className="text-xs text-mint-400 font-semibold">{cust.company || 'Individual Client'}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-300 text-xs">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{cust.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 text-[11px] mt-0.5">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{cust.phone || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-300 text-xs">
                        <div className="font-medium">{cust.address || 'Address Not Set'}</div>
                        <div className="text-[11px] text-slate-400">
                          {cust.city ? `${cust.city}, ` : ''}{cust.state} ({cust.stateCode || 'Code N/A'}) - {cust.pincode || cust.pinCode || ''}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs font-mono">
                        <div className="text-emerald-400 font-bold">GSTIN: {cust.gstin || 'Unregistered'}</div>
                        <div className="text-slate-500">PAN: {cust.pan || 'N/A'}</div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="font-extrabold text-white">{formatCurrency(totalInvoiced)}</div>
                        <div className="text-[11px] text-slate-400">{custInvoices.length} Invoices Issued</div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-mint-400 font-bold text-xs rounded-xl border border-slate-700 inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Full Profile</span>
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

      {/* Customer Full Profile Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-mint-400 bg-mint-500/10 px-2.5 py-1 rounded-full border border-mint-500/20">
                  Admin Customer Audit Profile
                </span>
                <h3 className="text-xl font-black text-white mt-1">{selectedCustomer.name}</h3>
                <p className="text-xs text-slate-400">{selectedCustomer.company || 'Individual Client'}</p>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)} 
                className="p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Complete Address & GST Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-extrabold text-white text-sm border-b border-slate-800 pb-1">Structured Multi-Step Address</h4>
                <div><span className="text-slate-500 font-medium">Street/Building:</span> <span className="text-slate-200 font-bold">{selectedCustomer.address || 'N/A'}</span></div>
                <div><span className="text-slate-500 font-medium">City:</span> <span className="text-slate-200 font-bold">{selectedCustomer.city || 'N/A'}</span></div>
                <div><span className="text-slate-500 font-medium">State & GST Code:</span> <span className="text-mint-400 font-bold">{selectedCustomer.state} [State Code: {selectedCustomer.stateCode || 'N/A'}]</span></div>
                <div><span className="text-slate-500 font-medium">Pin Code:</span> <span className="text-slate-200 font-bold">{selectedCustomer.pincode || selectedCustomer.pinCode || 'N/A'}</span></div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-extrabold text-white text-sm border-b border-slate-800 pb-1">Tax & Contact Credentials</h4>
                <div><span className="text-slate-500 font-medium">Email:</span> <span className="text-slate-200 font-bold">{selectedCustomer.email}</span></div>
                <div><span className="text-slate-500 font-medium">Phone:</span> <span className="text-slate-200 font-bold">{selectedCustomer.phone || 'N/A'}</span></div>
                <div><span className="text-slate-500 font-medium">GSTIN:</span> <span className="text-emerald-400 font-bold font-mono">{selectedCustomer.gstin || 'Unregistered'}</span></div>
                <div><span className="text-slate-500 font-medium">PAN:</span> <span className="text-slate-300 font-mono font-bold">{selectedCustomer.pan || 'N/A'}</span></div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
              >
                Close Audit View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
