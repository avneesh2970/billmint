import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Download, Printer, Share2, ArrowLeft, 
  CreditCard, Check, FileText
} from 'lucide-react';
import { 
  formatCurrency, 
  formatDate, 
  amountToWords, 
  getStateCodeFromState, 
  checkIsInterState 
} from '../../../../packages/shared-utils/index.js';
import { generateInvoicePDF } from '../services/pdfGenerator.js';

export default function InvoiceViewPage({ invoices = [], business = {}, customers = [], onRecordPayment }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState('Modern');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('UPI');
  const [copied, setCopied] = useState(false);

  const invoice = invoices.find(i => i.id === id || i.invoiceNumber === id) || invoices[0];
  const customer = customers.find(c => c.id === invoice?.customerId) || {};

  if (!invoice) {
    return (
      <div className="p-16 text-center space-y-4">
        <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
          <FileText className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Invoice Not Found</h2>
        <p className="text-sm text-slate-500">The requested invoice does not exist or has been deleted.</p>
        <Link 
          to="/invoices" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-mint-600 hover:bg-mint-700 text-white text-xs font-bold rounded-xl shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Invoices
        </Link>
      </div>
    );
  }

  // Business Details
  const bizName = business?.name || 'Business Workspace';
  const bizState = business?.state || invoice?.businessState || '';
  const bizCode = business?.stateCode || invoice?.businessStateCode || (bizState ? getStateCodeFromState(bizState) : '');
  const bizAddress = [
    business?.address,
    business?.city,
    bizState ? `${bizState}${bizCode ? ` (${bizCode})` : ''}` : '',
    business?.pincode
  ].filter(Boolean).join(', ');

  // Customer Details
  const custName = invoice.customerName || customer?.company || customer?.name || 'Customer';
  const custState = invoice.customerState || customer?.state || '';
  const custCode = invoice.customerStateCode || customer?.stateCode || (custState ? getStateCodeFromState(custState) : '');
  const custAddress = invoice.customerAddress || [
    customer?.address,
    customer?.city,
    custState ? `${custState}${custCode ? ` (${custCode})` : ''}` : '',
    customer?.pincode
  ].filter(Boolean).join(', ') || 'N/A';

  const isInter = invoice?.isInterState ?? checkIsInterState(bizState, custState, bizCode, custCode);

  const grandTotal = Number(invoice.grandTotal) || 0;
  const subtotal = Number(invoice.subtotal) || grandTotal;
  const totalTax = Number(invoice.totalTax) || (Number(invoice.igst) || (Number(invoice.cgst) + Number(invoice.sgst))) || 0;
  const paidAmt = invoice.status === 'Paid' ? grandTotal : (Number(invoice.amountPaid) || 0);
  const pendingAmt = invoice.status === 'Paid' ? 0 : Math.max(0, grandTotal - paidAmt);
  const words = amountToWords(grandTotal);

  const handleDownloadPDF = () => {
    const pdf = generateInvoicePDF(invoice, business, customer, template);
    pdf.save(`${invoice.invoiceNumber || 'Tax-Invoice'}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const submitPayment = (e) => {
    e.preventDefault();
    if (onRecordPayment) {
      onRecordPayment({
        invoiceId: invoice.id,
        amount: Number(payAmount || pendingAmt || grandTotal),
        paymentMethod: payMethod
      });
    }
    setShowPaymentModal(false);
  };

  // Template-specific style variations (All neat, clean, ink-friendly)
  const templateConfig = {
    Modern: {
      accentBorder: 'border-t-4 border-mint-600',
      headerTagBg: 'text-mint-700 bg-mint-50',
      tableHeaderClass: 'bg-slate-50 text-slate-800 border-y-2 border-slate-300 font-bold',
      fontFamily: 'font-sans',
      totalColor: 'text-mint-700'
    },
    Classic: {
      accentBorder: 'border-t-4 border-blue-900',
      headerTagBg: 'text-blue-900 bg-blue-50',
      tableHeaderClass: 'bg-blue-900 text-white font-bold',
      fontFamily: 'font-serif',
      totalColor: 'text-blue-950'
    },
    Minimal: {
      accentBorder: 'border-t-2 border-slate-900',
      headerTagBg: 'text-slate-800 bg-slate-100',
      tableHeaderClass: 'bg-white text-slate-900 border-y-2 border-slate-900 font-bold',
      fontFamily: 'font-sans',
      totalColor: 'text-slate-950'
    },
    GST: {
      accentBorder: 'border-t-4 border-indigo-900',
      headerTagBg: 'text-indigo-900 bg-indigo-50',
      tableHeaderClass: 'bg-slate-100 text-slate-900 border-y border-slate-300 font-extrabold',
      fontFamily: 'font-sans',
      totalColor: 'text-indigo-950'
    }
  };

  const currentTheme = templateConfig[template] || templateConfig.Modern;

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      
      {/* Top Action Bar (Hidden when Printing) */}
      <div className="hide-on-print bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        <button 
          onClick={() => navigate('/invoices')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Invoices
        </button>

        {/* Template Selector Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'Modern', label: 'Modern Pro' },
            { id: 'Classic', label: 'Classic Corporate' },
            { id: 'Minimal', label: 'Clean Minimal' },
            { id: 'GST', label: 'GST Standard' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                template === t.id 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {invoice.status !== 'Paid' && (
            <button
              onClick={() => {
                setPayAmount(pendingAmt.toString());
                setShowPaymentModal(true);
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Record Payment</span>
            </button>
          )}

          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-mint-600 hover:bg-mint-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            title="Print Clean A4 (Ctrl + P)"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
            title="Copy Link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* PRINTABLE INVOICE SHEET (Pure White, Neat, Clean, Only Relevant Text) */}
      <div 
        id="invoice-print-area"
        className={`bg-white rounded-2xl border border-slate-200 shadow-md p-8 sm:p-12 text-slate-900 ${currentTheme.fontFamily} ${currentTheme.accentBorder}`}
        style={{ minHeight: '297mm' }}
      >
        
        {/* Top BillMint Branding Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-mint-600 text-white flex items-center justify-center font-black text-sm">
              BM
            </div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">
              Bill<span className="text-mint-600">Mint</span>
            </span>
          </div>

          <div className="text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Original Tax Invoice
          </div>
        </div>

        {/* 1. SELLER & INVOICE META ROW */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 py-6 border-b border-slate-200 text-xs">
          
          {/* Seller / Business Details */}
          <div className="space-y-1 max-w-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Seller / Billed From</span>
            <h1 className="text-xl font-bold text-slate-950">{bizName}</h1>
            {bizAddress && <p className="text-slate-600 leading-relaxed">{bizAddress}</p>}
            
            <div className="pt-1 text-slate-700 space-y-0.5">
              {business?.gstin && <p><span className="font-semibold text-slate-900">GSTIN:</span> {business.gstin}</p>}
              {business?.pan && <p><span className="font-semibold text-slate-900">PAN:</span> {business.pan}</p>}
              {business?.email && <p><span className="font-semibold text-slate-900">Email:</span> {business.email}</p>}
              {business?.phone && <p><span className="font-semibold text-slate-900">Phone:</span> {business.phone}</p>}
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="sm:text-right space-y-1.5 w-full sm:w-auto">
            <div className="text-2xl font-black font-mono text-slate-900">
              {invoice.invoiceNumber || 'INV-001'}
            </div>
            
            <div className="space-y-0.5 text-slate-600">
              <p><span className="font-medium text-slate-800">Invoice Date:</span> {formatDate(invoice.issueDate)}</p>
              <p><span className="font-medium text-slate-800">Due Date:</span> {formatDate(invoice.dueDate)}</p>
              {custState && (
                <p><span className="font-medium text-slate-800">Place of Supply:</span> {custState} {custCode ? `(${custCode})` : ''}</p>
              )}
            </div>

            {/* Status */}
            <div className="pt-1">
              <span className={`inline-block px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                invoice.status === 'Paid' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : invoice.status === 'Overdue' 
                  ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {invoice.status || 'Pending'}
              </span>
            </div>
          </div>

        </div>

        {/* 2. BILLED TO (CUSTOMER) */}
        <div className="py-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-4 text-xs">
          <div className="space-y-1 max-w-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billed To (Customer)</span>
            <h2 className="text-base font-bold text-slate-900">{custName}</h2>
            <p className="text-slate-600 leading-relaxed">{custAddress}</p>
            {invoice.customerGstin && (
              <p className="text-slate-700 font-mono"><span className="font-semibold text-slate-900">GSTIN:</span> {invoice.customerGstin}</p>
            )}
            {customer?.pan && (
              <p className="text-slate-700 font-mono"><span className="font-semibold text-slate-900">PAN:</span> {customer.pan}</p>
            )}
          </div>

          <div className="sm:text-right space-y-1 text-[11px] text-slate-500 self-end sm:self-start">
            <p className="font-medium text-slate-700">
              {isInter ? 'Transaction: Inter-State (IGST 18%)' : 'Transaction: Intra-State (CGST 9% + SGST 9%)'}
            </p>
            <p>Reverse Charge (RCM): No</p>
          </div>
        </div>

        {/* 3. ITEMS TABLE (Clean, Standard, Ink-Friendly) */}
        <div className="py-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={currentTheme.tableHeaderClass}>
                <th className="py-2.5 px-3 text-center w-8">#</th>
                <th className="py-2.5 px-3">Item & Description</th>
                <th className="py-2.5 px-3 text-center w-20">HSN/SAC</th>
                <th className="py-2.5 px-3 text-center w-12">Qty</th>
                <th className="py-2.5 px-3 text-right w-24">Rate</th>
                <th className="py-2.5 px-3 text-center w-14">Disc</th>
                <th className="py-2.5 px-3 text-right w-24">Taxable</th>
                <th className="py-2.5 px-3 text-center w-14">GST</th>
                <th className="py-2.5 px-3 text-right w-28">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(invoice.items || []).map((item, idx) => {
                const qty = Number(item.quantity) || 1;
                const rate = Number(item.rate) || 0;
                const disc = Number(item.discountPercent) || 0;
                const taxableVal = (qty * rate) * (1 - (disc / 100));
                const taxRate = Number(item.taxRate) || 18;
                const itemTotal = Number(item.amount) || (taxableVal * (1 + (taxRate / 100)));

                return (
                  <tr key={idx} className={template === 'Classic' && idx % 2 === 1 ? 'bg-slate-50/60' : ''}>
                    <td className="py-3 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{item.description || 'Service'}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-600">{item.hsnSac || '998314'}</td>
                    <td className="py-3 px-3 text-center font-medium text-slate-800">{qty}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700">{formatCurrency(rate, true)}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-500">{disc > 0 ? `${disc}%` : '-'}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-800">{formatCurrency(taxableVal, true)}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-600">{taxRate}%</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">{formatCurrency(itemTotal, true)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 4. TOTALS & CALCULATIONS */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-2 pb-6 border-b border-slate-200">
          
          {/* Left: Bank Details & Notes */}
          <div className="w-full sm:w-1/2 space-y-4 text-xs">
            
            {(business?.bankDetails?.bankName || business?.bankDetails?.accountNumber || business?.bankDetails?.upiId) && (
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-1.5">
                <p className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Payment / Bank Details</p>
                {business.bankDetails.bankName && <p><span className="text-slate-500">Bank:</span> <strong className="text-slate-800">{business.bankDetails.bankName}</strong></p>}
                {business.bankDetails.accountName && <p><span className="text-slate-500">A/C Name:</span> <strong className="text-slate-800">{business.bankDetails.accountName}</strong></p>}
                {business.bankDetails.accountNumber && <p><span className="text-slate-500">A/C No:</span> <strong className="font-mono text-slate-900">{business.bankDetails.accountNumber}</strong></p>}
                {business.bankDetails.ifsc && <p><span className="text-slate-500">IFSC:</span> <strong className="font-mono text-slate-900">{business.bankDetails.ifsc}</strong></p>}
                {business.bankDetails.upiId && <p><span className="text-slate-500">UPI ID:</span> <strong className="font-mono text-mint-700">{business.bankDetails.upiId}</strong></p>}
              </div>
            )}

            {invoice.notes && (
              <div className="text-xs text-slate-600 italic">
                <span className="font-bold not-italic text-slate-800">Note: </span>
                "{invoice.notes}"
              </div>
            )}
          </div>

          {/* Right: Calculations */}
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal (Taxable):</span>
              <span className="font-mono font-medium text-slate-900">{formatCurrency(subtotal, true)}</span>
            </div>

            {isInter ? (
              <div className="flex justify-between text-slate-700">
                <span>IGST (18%):</span>
                <span className="font-mono font-medium text-slate-900">{formatCurrency(invoice.igst || totalTax, true)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-slate-600">
                  <span>CGST (9%):</span>
                  <span className="font-mono text-slate-900">{formatCurrency(invoice.cgst || (totalTax / 2), true)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SGST (9%):</span>
                  <span className="font-mono text-slate-900">{formatCurrency(invoice.sgst || (totalTax / 2), true)}</span>
                </div>
              </>
            )}

            {invoice.shipping > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Shipping:</span>
                <span className="font-mono text-slate-900">{formatCurrency(invoice.shipping, true)}</span>
              </div>
            )}

            {invoice.roundOff && invoice.roundOff !== 0 ? (
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Round Off:</span>
                <span className="font-mono">{formatCurrency(invoice.roundOff, true)}</span>
              </div>
            ) : null}

            <div className="flex justify-between items-center text-sm font-black text-slate-950 pt-2 border-t-2 border-slate-300">
              <span>Total Amount:</span>
              <span className={`font-mono text-base ${currentTheme.totalColor}`}>{formatCurrency(grandTotal, true)}</span>
            </div>

            <div className="pt-2 border-t border-dashed border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Amount Paid:</span>
                <span className="font-mono font-bold text-emerald-700">{formatCurrency(paidAmt, true)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold">
                <span>Balance Due:</span>
                <span className="font-mono text-rose-600">{formatCurrency(pendingAmt, true)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 5. AMOUNT IN WORDS */}
        <div className="py-3 border-b border-slate-200 text-xs">
          <span className="font-semibold text-slate-500">Amount in Words: </span>
          <span className="font-bold text-slate-900 italic">{words}</span>
        </div>

        {/* 6. TERMS & AUTHORIZED SIGNATORY */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
          
          <div className="max-w-md space-y-1 text-slate-500 text-[11px]">
            <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Terms &amp; Conditions</p>
            <p className="leading-relaxed">
              {invoice.terms || business?.defaultTerms || 'Payment due within 15 days of invoice date. Please mention the invoice number in your payment reference.'}
            </p>
          </div>

          <div className="text-right space-y-8 w-48 shrink-0">
            <p className="font-bold text-slate-800 text-xs">For {bizName}</p>
            <div className="border-t border-slate-400 pt-1 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Authorized Signatory</span>
            </div>
          </div>

        </div>

        {/* 7. NEAT FOOTER WITH BILLMINT BRANDING */}
        <div className="pt-8 mt-6 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
          <span>This is a computer-generated tax invoice.</span>
          <span className="font-semibold text-slate-500">Powered by <strong className="text-mint-600">BillMint</strong></span>
        </div>

      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl animate-in fade-in">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Record Payment</h3>
              <p className="text-xs text-slate-500 mt-1">Invoice: {invoice.invoiceNumber} | Total Due: {formatCurrency(pendingAmt)}</p>
            </div>
            
            <form onSubmit={submitPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount Paid (₹)</label>
                <input 
                  type="number" 
                  required
                  step="0.01"
                  min="1"
                  max={pendingAmt || grandTotal}
                  placeholder="Enter amount..."
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-mint-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                <select 
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
