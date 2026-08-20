import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const allFaqs = [
    { q: "What is BillMint?", a: "BillMint is a cloud-based billing and invoicing platform where freelancers, agencies, shops, and businesses can create, download, share professional PDF invoices, calculate GST, and track client payments." },
    { q: "Can I create invoices for free?", a: "Yes! Our Free plan provides 5 free invoices per month with PDF downloads, customer management, and basic dashboard reporting." },
    { q: "Can I download invoices as PDF?", a: "Yes, BillMint generates high-quality PDF files that match your selected invoice template and are ready for print or email." },
    { q: "Does BillMint support GST?", a: "Yes, BillMint automatically calculates CGST, SGST, or IGST based on the state of your business and client, and includes GSTIN and HSN codes." },
    { q: "Can I manage multiple customers?", a: "Yes! You can add unlimited customers in Pro and Business plans, and track total billed vs total paid for each client." },
    { q: "Can I track payments?", a: "Yes, you can record payments received via UPI, Bank Transfer, Cash, Card, or Cheque against specific invoices." },
    { q: "Can I create recurring invoices?", a: "Yes, you can set recurring billing intervals (Weekly, Monthly, Quarterly, Yearly) for client retainers." },
    { q: "Can I use BillMint on mobile?", a: "Yes, BillMint is fully optimized for smartphones and tablets so you can generate and send invoices on the go." },
    { q: "Can I customize my invoices?", a: "Yes, you can upload your business logo, select colors, set custom notes, payment terms, and choose from Classic, Modern, or Minimal templates." },
    { q: "Is my business data secure?", a: "Yes, all data transmitted to BillMint is protected using 256-bit SSL encryption and strict data-isolation access policies." }
  ];

  const filteredFaqs = allFaqs.filter(f => 
    f.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-12 space-y-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-charcoal-900 tracking-tight">Help Center & FAQ</h1>
        <p className="text-slate-600 text-base max-w-xl mx-auto">
          Everything you need to know about BillMint's features, GST tax support, plans, and security.
        </p>

        {/* Search Input */}
        <div className="relative max-w-lg mx-auto pt-4">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-7" />
          <input 
            type="text"
            placeholder="Search questions (e.g. GST, PDF, recurring)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-mint-500 focus:outline-none text-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p>No questions matched your search query.</p>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left p-5 font-bold text-charcoal-900 flex items-center justify-between hover:text-mint-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openIndex === idx ? 'rotate-180 text-mint-600' : ''}`} />
              </button>
              {openIndex === idx && (
                <div className="px-5 pb-5 pt-1 text-slate-600 text-sm border-t border-slate-100 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
