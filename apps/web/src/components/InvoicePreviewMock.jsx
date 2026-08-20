import React, { useState } from 'react';
import { FileText, CheckCircle2, Download, Printer, Share2, Sparkles, Building2, User } from 'lucide-react';
import { formatCurrency } from '../../../../packages/shared-utils/index.js';

export default function InvoicePreviewMock() {
  const [template, setTemplate] = useState('Modern');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden transition-all duration-300">
      {/* Interactive Controls Bar */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Live Interactive Preview</span>
        </div>

        {/* Template selector pills */}
        <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl">
          {['Modern', 'Classic', 'Minimal'].map(t => (
            <button
              key={t}
              onClick={() => setTemplate(t)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                template === t 
                  ? 'bg-mint-500 text-slate-950 font-bold shadow-sm' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-mint-400 font-semibold flex items-center gap-1 bg-mint-950/60 border border-mint-800 px-3 py-1 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PAID IN FULL</span>
          </span>
        </div>
      </div>

      {/* Invoice Card Body */}
      <div className={`p-8 sm:p-10 ${
        template === 'Classic' 
          ? 'font-serif bg-amber-50/20' 
          : template === 'Minimal' 
          ? 'bg-white' 
          : 'bg-gradient-to-br from-white via-slate-50/50 to-mint-50/20'
      }`}>
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-mint-600 font-bold text-xl mb-2">
              <div className="w-8 h-8 rounded-lg bg-mint-600 text-white flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <span>BillMint</span>
            </div>
            <h2 className="text-2xl font-bold text-charcoal-900">Nova Creative Studio</h2>
            <p className="text-xs text-slate-500 mt-1">Suite 402, Mint Heights, Cyber City, Bengaluru</p>
            <p className="text-xs text-slate-500">GSTIN: 29ABCDE1234F1ZH | PAN: ABCDE1234F</p>
          </div>

          <div className="sm:text-right">
            <span className="inline-block bg-mint-100 text-mint-800 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              TAX INVOICE
            </span>
            <p className="text-xl font-bold text-slate-900 tracking-tight">INV-2026-001</p>
            <div className="text-xs text-slate-500 mt-2 space-y-1">
              <p><span className="font-semibold text-slate-700">Issue Date:</span> 01 Aug 2026</p>
              <p><span className="font-semibold text-slate-700">Due Date:</span> 15 Aug 2026</p>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="my-6 p-4 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-mint-600" /> Billed To
            </p>
            <h3 className="text-base font-bold text-charcoal-900">ABC Enterprises Pvt. Ltd.</h3>
            <p className="text-xs text-slate-600">Attn: Rahul Sharma (Purchasing Head)</p>
            <p className="text-xs text-slate-500">Plot 14, Tech Park, Sector 62, Noida, UP</p>
            <p className="text-xs text-slate-500 font-mono mt-0.5">GSTIN: 07AAACA1234B1ZB</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Status</p>
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5" /> PAID (HDFC Bank Txn #987654)
            </span>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto my-6">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-y border-slate-200">
                <th className="py-3 px-4">Item Description</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Rate</th>
                <th className="py-3 px-4 text-right">GST</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-900">
                  Website Development
                  <p className="text-[11px] text-slate-500">Custom React + Express SaaS Platform setup</p>
                </td>
                <td className="py-3.5 px-4 text-center font-medium">1</td>
                <td className="py-3.5 px-4 text-right">{formatCurrency(75000)}</td>
                <td className="py-3.5 px-4 text-right text-slate-500">18%</td>
                <td className="py-3.5 px-4 text-right font-semibold text-slate-900">{formatCurrency(75000)}</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-900">
                  UI/UX Design
                  <p className="text-[11px] text-slate-500">High-fidelity Figma wireframes & Design Tokens</p>
                </td>
                <td className="py-3.5 px-4 text-center font-medium">1</td>
                <td className="py-3.5 px-4 text-right">{formatCurrency(30000)}</td>
                <td className="py-3.5 px-4 text-right text-slate-500">18%</td>
                <td className="py-3.5 px-4 text-right font-semibold text-slate-900">{formatCurrency(27000)}</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-900">
                  Managed Cloud Hosting
                  <p className="text-[11px] text-slate-500">1-Year High performance VPS & SSL setup</p>
                </td>
                <td className="py-3.5 px-4 text-center font-medium">1</td>
                <td className="py-3.5 px-4 text-right">{formatCurrency(12000)}</td>
                <td className="py-3.5 px-4 text-right text-slate-500">18%</td>
                <td className="py-3.5 px-4 text-right font-semibold text-slate-900">{formatCurrency(12000)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Calculation Totals */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200">
          <div className="max-w-xs space-y-2 text-xs text-slate-600">
            <p className="font-bold text-slate-800">Bank Payment Details:</p>
            <p>Bank: HDFC Bank | A/C: 50200012345678</p>
            <p>IFSC: HDFC0001234 | UPI: novacreative@hdfcbank</p>
          </div>

          <div className="w-full sm:w-64 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-medium text-slate-900">{formatCurrency(114000)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>CGST (9%):</span>
              <span className="font-medium text-slate-900">{formatCurrency(10260)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>SGST (9%):</span>
              <span className="font-medium text-slate-900">{formatCurrency(10260)}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-bold text-base pt-2 border-t border-slate-300">
              <span>Total Amount:</span>
              <span className="text-mint-700">{formatCurrency(134520)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
