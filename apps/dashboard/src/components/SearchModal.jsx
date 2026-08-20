import React, { useState } from 'react';
import { Search, X, Receipt, Users, Package, CreditCard, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchModal({ isOpen, onClose, invoices = [], customers = [], products = [], payments = [] }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedInvoices = q ? invoices.filter(i => 
    i.invoiceNumber.toLowerCase().includes(q) || 
    i.customerName.toLowerCase().includes(q)
  ) : [];

  const matchedCustomers = q ? customers.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.company.toLowerCase().includes(q) || 
    c.email.toLowerCase().includes(q)
  ) : [];

  const matchedProducts = q ? products.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.sku.toLowerCase().includes(q)
  ) : [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-mint-600 shrink-0" />
          <input 
            type="text"
            autoFocus
            placeholder="Type to search customers, invoices (e.g. INV-2026), products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base focus:outline-none text-charcoal-900 placeholder:text-slate-400"
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Container */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          {!q ? (
            <p className="text-xs text-center text-slate-400 py-8">
              Start typing to search your BillMint workspace records...
            </p>
          ) : (
            <>
              {/* Invoices */}
              {matchedInvoices.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-mint-600" /> Invoices ({matchedInvoices.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedInvoices.map(inv => (
                      <div 
                        key={inv.id}
                        onClick={() => { navigate(`/invoices/${inv.id}`); onClose(); }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900">{inv.invoiceNumber}</span>
                          <span className="text-xs text-slate-500 ml-2">— {inv.customerName}</span>
                        </div>
                        <span className="text-xs font-semibold text-mint-700">₹{inv.grandTotal?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers */}
              {matchedCustomers.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-mint-600" /> Customers ({matchedCustomers.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedCustomers.map(cust => (
                      <div 
                        key={cust.id}
                        onClick={() => { navigate('/customers'); onClose(); }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900">{cust.company || cust.name}</span>
                          <span className="text-xs text-slate-500 ml-2">{cust.email}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {matchedProducts.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-mint-600" /> Products & Services ({matchedProducts.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedProducts.map(prod => (
                      <div 
                        key={prod.id}
                        onClick={() => { navigate('/products'); onClose(); }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900">{prod.name}</span>
                          <span className="text-[11px] text-slate-400 ml-2">SKU: {prod.sku}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-900">₹{prod.price?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedInvoices.length === 0 && matchedCustomers.length === 0 && matchedProducts.length === 0 && (
                <p className="text-xs text-center text-slate-500 py-8">
                  No matching workspace records found for "{query}"
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
