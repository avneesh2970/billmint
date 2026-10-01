import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Download, Printer, Share2, ArrowLeft, 
  CreditCard, Check, FileText, QrCode, Sparkles, ShieldCheck, Copy, CheckCircle2, ChevronDown
} from 'lucide-react';
import QRCode from 'qrcode';
import { 
  formatCurrency, 
  formatCurrencyPDF,
  formatDate, 
  amountToWords, 
  getStateCodeFromState, 
  checkIsInterState,
  generateIRN,
  getFinancialYear,
  generateEInvoiceQRPayload
} from '../../../../packages/shared-utils/index.js';
import { generateInvoicePDF } from '../services/pdfGenerator.js';

export default function InvoiceViewPage({ invoices = [], business = {}, customers = [], onRecordPayment, onUpdateInvoice }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState('Modern');
  const [currencyPrefix, setCurrencyPrefix] = useState('Rs.'); // 'Rs.' or '₹'
  const [copyType, setCopyType] = useState('ORIGINAL FOR RECIPIENT');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('UPI');
  const [copied, setCopied] = useState(false);
  const [copiedIrn, setCopiedIrn] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [upiQrUrl, setUpiQrUrl] = useState('');
  const [generatingEInv, setGeneratingEInv] = useState(false);

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

  // E-Invoice parameters
  const finYear = getFinancialYear(invoice.issueDate);
  const irn = invoice.irn || (invoice.isEInvoice ? generateIRN(business?.gstin || '05AAJCN5266D1ZI', finYear, 'INV', invoice.invoiceNumber) : '');
  const ackNo = invoice.ackNo || (invoice.isEInvoice ? '142618992048512' : '');
  const ackDate = invoice.ackDate || (invoice.isEInvoice ? (invoice.issueDate || '2026-09-28') + ' 10:30:00' : '');

  // Generate E-Invoice Signed QR Code
  useEffect(() => {
    if (invoice.isEInvoice && irn) {
      const payload = generateEInvoiceQRPayload({
        supplierGstin: business?.gstin || '05AAJCN5266D1ZI',
        buyerGstin: invoice.customerGstin || customer?.gstin || 'URP',
        docNo: invoice.invoiceNumber,
        docDate: invoice.issueDate,
        totInvVal: grandTotal,
        itemCnt: (invoice.items || []).length,
        mainHsnCode: (invoice.items && invoice.items[0]?.hsnSac) || '998314',
        irn
      });
      QRCode.toDataURL(payload, { margin: 1, width: 140 })
        .then(url => setQrDataUrl(url))
        .catch(err => console.warn('QR generation error:', err));
    }
  }, [invoice.isEInvoice, irn, grandTotal, business?.gstin]);

  // Generate UPI Payment QR Code
  useEffect(() => {
    if (business?.bankDetails?.upiId && pendingAmt > 0) {
      const upiUrl = `upi://pay?pa=${encodeURIComponent(business.bankDetails.upiId)}&pn=${encodeURIComponent(bizName)}&am=${pendingAmt.toFixed(2)}&cu=INR&tn=${encodeURIComponent(invoice.invoiceNumber)}`;
      QRCode.toDataURL(upiUrl, { margin: 1, width: 110 })
        .then(url => setUpiQrUrl(url))
        .catch(() => {});
    }
  }, [business?.bankDetails?.upiId, pendingAmt, bizName, invoice.invoiceNumber]);

  // Format amount with active currency prefix
  const fmtCurr = (amount, includeDecimals = true) => {
    return formatCurrency(amount, includeDecimals, currencyPrefix);
  };

  const handleDownloadPDF = async () => {
    const pdf = await generateInvoicePDF(invoice, business, customer, template, { currencyPrefix, copyType });
    pdf.save(`${invoice.invoiceNumber || 'Tax-Invoice'}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyIrn = () => {
    if (!irn) return;
    navigator.clipboard.writeText(irn);
    setCopiedIrn(true);
    setTimeout(() => setCopiedIrn(false), 2000);
  };

  const handleGenerateEInvoice = () => {
    setGeneratingEInv(true);
    setTimeout(() => {
      const generatedIrn = generateIRN(business?.gstin || '05AAJCN5266D1ZI', finYear, 'INV', invoice.invoiceNumber);
      const updated = {
        ...invoice,
        isEInvoice: true,
        irn: generatedIrn,
        ackNo: `1426${Math.floor(10000000000 + Math.random() * 90000000000)}`,
        ackDate: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      if (typeof onUpdateInvoice === 'function') {
        onUpdateInvoice(updated);
      }
      setGeneratingEInv(false);
    }, 600);
  };

  const submitPayment = (e) => {
    e.preventDefault();
    if (onRecordPayment && payAmount) {
      onRecordPayment({
        invoiceId: invoice.id,
        amount: Number(payAmount),
        paymentMethod: payMethod,
        transactionId: `TXN-${Date.now().toString().slice(-6)}`,
        notes: `Payment of ${currencyPrefix} ${payAmount} via ${payMethod}`
      });
    }
    setShowPaymentModal(false);
  };

  // 5 Distinct Professional Template Configurations (All neat, ink-friendly and printable)
  const templateConfig = {
    Modern: {
      name: 'Modern Pro',
      accentBorder: 'border-t-4 border-mint-600',
      headerTagBg: 'text-mint-700 bg-mint-50 border-mint-200',
      tableHeaderClass: 'bg-slate-50 text-slate-800 border-y-2 border-slate-300 font-bold',
      fontFamily: 'font-sans',
      totalColor: 'text-mint-700'
    },
    Classic: {
      name: 'Classic Corporate',
      accentBorder: 'border-t-4 border-blue-900',
      headerTagBg: 'text-blue-900 bg-blue-50 border-blue-200',
      tableHeaderClass: 'bg-blue-900 text-white font-bold',
      fontFamily: 'font-serif',
      totalColor: 'text-blue-950'
    },
    Minimal: {
      name: 'Clean Minimal',
      accentBorder: 'border-t-2 border-slate-900',
      headerTagBg: 'text-slate-800 bg-slate-100 border-slate-300',
      tableHeaderClass: 'bg-white text-slate-900 border-y-2 border-slate-900 font-bold',
      fontFamily: 'font-sans',
      totalColor: 'text-slate-950'
    },
    GST: {
      name: 'GST Tax Standard',
      accentBorder: 'border-t-4 border-indigo-900',
      headerTagBg: 'text-indigo-900 bg-indigo-50 border-indigo-200',
      tableHeaderClass: 'bg-slate-100 text-slate-900 border-y border-slate-300 font-extrabold',
      fontFamily: 'font-sans',
      totalColor: 'text-indigo-950'
    },
    Executive: {
      name: 'Executive Slate',
      accentBorder: 'border-t-4 border-cyan-800',
      headerTagBg: 'text-cyan-900 bg-cyan-50 border-cyan-200',
      tableHeaderClass: 'bg-slate-800 text-white font-bold',
      fontFamily: 'font-sans',
      totalColor: 'text-cyan-900'
    }
  };

  const currentTheme = templateConfig[template] || templateConfig.Modern;

  // HSN Tax Breakdown Mapping
  const items = invoice.items && invoice.items.length > 0 ? invoice.items : [{
    description: 'Services Rendered',
    hsnSac: '998314',
    quantity: 1,
    rate: grandTotal,
    amount: grandTotal,
    taxRate: 18
  }];

  const hsnSummary = {};
  items.forEach(it => {
    const code = it.hsnSac || '998314';
    const qty = Number(it.quantity) || 1;
    const rate = Number(it.rate) || 0;
    const disc = Number(it.discountPercent) || 0;
    const taxRate = Number(it.taxRate) || 18;
    const taxable = (qty * rate) * (1 - (disc / 100));

    if (!hsnSummary[code]) {
      hsnSummary[code] = { code, taxable: 0, taxRate, taxAmount: 0 };
    }
    hsnSummary[code].taxable += taxable;
    hsnSummary[code].taxAmount += (taxable * taxRate / 100);
  });

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

        {/* Middle: Template & Currency Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Template Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 pl-2 pr-1">Design:</span>
            {Object.keys(templateConfig).map((key) => (
              <button
                key={key}
                onClick={() => setTemplate(key)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  template === key 
                    ? 'bg-white text-slate-950 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {templateConfig[key].name}
              </button>
            ))}
          </div>

          {/* Currency Toggle Switcher (₹ vs Rs.) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 pl-2 pr-1">Currency:</span>
            <button
              onClick={() => setCurrencyPrefix('Rs.')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                currencyPrefix === 'Rs.' 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Show currency as Rs. (100% universal compatibility)"
            >
              Rs.
            </button>
            <button
              onClick={() => setCurrencyPrefix('₹')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                currencyPrefix === '₹' 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Show currency as ₹ (Indian Rupee symbol)"
            >
              ₹
            </button>
          </div>

          {/* Copy Type Selector */}
          <select
            value={copyType}
            onChange={(e) => setCopyType(e.target.value)}
            className="text-xs font-bold py-1.5 px-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
          >
            <option value="ORIGINAL FOR RECIPIENT">Original for Recipient</option>
            <option value="DUPLICATE FOR TRANSPORTER">Duplicate for Transporter</option>
            <option value="TRIPLICATE FOR SUPPLIER">Triplicate for Supplier</option>
          </select>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {!invoice.isEInvoice && !irn && (
            <button
              onClick={handleGenerateEInvoice}
              disabled={generatingEInv}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              title="Generate Official GST E-Invoice (IRN & QR)"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{generatingEInv ? 'Generating...' : 'Generate E-Invoice'}</span>
            </button>
          )}

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
        
        {/* Top Legal Header & Copy Badge */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-200 text-xs">
          <span className="font-extrabold text-[11px] tracking-wider text-slate-600 border border-slate-300 px-2.5 py-0.5 rounded uppercase">
            {copyType}
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide">
            Issued under Rule 46 of CGST Rules, 2017 (Standard GST Tax Invoice)
          </span>
        </div>

        {/* 1. SELLER (LEFT) & INVOICE META (RIGHT) */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 py-6 border-b border-slate-200 text-xs">
          
          {/* Seller / Business Details */}
          <div className="space-y-1.5 max-w-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Seller / Billed From</span>
            <h1 className="text-xl font-bold text-slate-950">{bizName}</h1>
            {bizAddress && <p className="text-slate-600 leading-relaxed">{bizAddress}</p>}
            
            <div className="pt-1 text-slate-700 space-y-0.5">
              {business?.gstin && (
                <p>
                  <span className="font-bold text-slate-900">GSTIN:</span>{' '}
                  <span className="font-mono font-semibold">{business.gstin}</span>
                </p>
              )}
              {business?.pan && (
                <p>
                  <span className="font-bold text-slate-900">PAN:</span>{' '}
                  <span className="font-mono font-semibold">{business.pan}</span>
                </p>
              )}
              {business?.email && <p><span className="font-semibold text-slate-900">Email:</span> {business.email}</p>}
              {business?.phone && <p><span className="font-semibold text-slate-900">Phone:</span> {business.phone}</p>}
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="sm:text-right space-y-1.5 w-full sm:w-auto">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
              {isEInvoice ? 'E-INVOICE / TAX INVOICE' : 'TAX INVOICE'}
            </span>
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

        {/* 1B. OFFICIAL GST E-INVOICE BANNER & SIGNED QR CODE (Compliant with INV-01 Schema) */}
        {invoice.isEInvoice && irn && (
          <div className="my-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="GST Signed E-Invoice QR Code" 
                  className="w-16 h-16 rounded-lg border border-slate-200 bg-white p-1 shrink-0" 
                />
              ) : (
                <div className="w-16 h-16 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400">
                  <QrCode className="w-8 h-8" />
                </div>
              )}
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-extrabold text-[11px] text-slate-900 uppercase tracking-wide">
                    Official GST E-Invoice (NIC Portal Verified)
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    INV-01
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-700">
                  <span><strong>IRN:</strong> {irn.substring(0, 36)}...</span>
                  <button
                    onClick={handleCopyIrn}
                    className="p-1 text-slate-400 hover:text-slate-700 transition-colors hide-on-print"
                    title="Copy full 64-character IRN"
                  >
                    {copiedIrn ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-4">
                  <span><strong>Ack No:</strong> {ackNo}</span>
                  <span><strong>Ack Date:</strong> {ackDate}</span>
                  {invoice.eWayBillNo && <span><strong>E-Way Bill:</strong> {invoice.eWayBillNo}</span>}
                </div>
              </div>
            </div>

            <div className="text-right hidden sm:block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Digitally Verified &amp; Signed
            </div>
          </div>
        )}

        {/* 2. BILLED TO (CUSTOMER) & DISPATCH DETAILS */}
        <div className="py-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-4 text-xs">
          <div className="space-y-1 max-w-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billed To (Buyer)</span>
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
            {invoice.eWayBillNo && <p className="font-mono">E-Way Bill No: {invoice.eWayBillNo}</p>}
          </div>
        </div>

        {/* 3. ITEMS TABLE (Clean, Standard, Ink-Friendly with Explicit Currency) */}
        <div className="py-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={currentTheme.tableHeaderClass}>
                <th className="py-2.5 px-3 text-center w-8">#</th>
                <th className="py-2.5 px-3">Item &amp; Description</th>
                <th className="py-2.5 px-3 text-center w-20">HSN/SAC</th>
                <th className="py-2.5 px-3 text-center w-12">Qty</th>
                <th className="py-2.5 px-3 text-right w-24">Rate ({currencyPrefix})</th>
                <th className="py-2.5 px-3 text-center w-14">Disc</th>
                <th className="py-2.5 px-3 text-right w-24">Taxable ({currencyPrefix})</th>
                <th className="py-2.5 px-3 text-center w-14">GST</th>
                <th className="py-2.5 px-3 text-right w-28">Amount ({currencyPrefix})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item, idx) => {
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
                    <td className="py-3 px-3 text-right font-mono text-slate-700">{fmtCurr(rate, true)}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-500">{disc > 0 ? `${disc}%` : '-'}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-800">{fmtCurr(taxableVal, true)}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-600">{taxRate}%</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">{fmtCurr(itemTotal, true)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 3B. HSN/SAC GST TAX BREAKDOWN TABLE (OFFICIAL RULE 46 AUDIT FORMAT) */}
        <div className="pb-6">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            HSN/SAC Tax Summary
          </div>
          <table className="w-full text-left text-[11px] border border-slate-200">
            <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2 px-2.5 text-center">HSN/SAC</th>
                <th className="py-2 px-2.5 text-right">Taxable Value ({currencyPrefix})</th>
                {isInter ? (
                  <>
                    <th className="py-2 px-2.5 text-center">IGST Rate</th>
                    <th className="py-2 px-2.5 text-right">IGST Amount ({currencyPrefix})</th>
                  </>
                ) : (
                  <>
                    <th className="py-2 px-2.5 text-center">CGST</th>
                    <th className="py-2 px-2.5 text-center">SGST</th>
                  </>
                )}
                <th className="py-2 px-2.5 text-right">Total Tax ({currencyPrefix})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.values(hsnSummary).map((h, i) => {
                const halfRate = (h.taxRate / 2).toFixed(1).replace('.0', '');
                const halfTax = h.taxAmount / 2;
                return (
                  <tr key={i} className="text-slate-600">
                    <td className="py-1.5 px-2.5 text-center font-mono font-semibold text-slate-800">{h.code}</td>
                    <td className="py-1.5 px-2.5 text-right font-mono">{fmtCurr(h.taxable, true)}</td>
                    {isInter ? (
                      <>
                        <td className="py-1.5 px-2.5 text-center font-mono">{h.taxRate}%</td>
                        <td className="py-1.5 px-2.5 text-right font-mono">{fmtCurr(h.taxAmount, true)}</td>
                      </>
                    ) : (
                      <>
                        <td className="py-1.5 px-2.5 text-center font-mono">{halfRate}% ({fmtCurr(halfTax, true)})</td>
                        <td className="py-1.5 px-2.5 text-center font-mono">{halfRate}% ({fmtCurr(halfTax, true)})</td>
                      </>
                    )}
                    <td className="py-1.5 px-2.5 text-right font-mono font-bold text-slate-900">{fmtCurr(h.taxAmount, true)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 4. TOTALS & CALCULATIONS (RIGHT) + BANK & UPI REMITTANCE (LEFT) */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-2 pb-6 border-b border-slate-200">
          
          {/* Left: Bank Details & UPI QR Code */}
          <div className="w-full sm:w-1/2 space-y-4 text-xs">
            
            {(business?.bankDetails?.bankName || business?.bankDetails?.accountNumber || business?.bankDetails?.upiId) && (
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-2 flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Bank &amp; Remittance Details</p>
                  {business.bankDetails.bankName && <p><span className="text-slate-500">Bank:</span> <strong className="text-slate-800">{business.bankDetails.bankName}</strong></p>}
                  {business.bankDetails.accountName && <p><span className="text-slate-500">A/C Name:</span> <strong className="text-slate-800">{business.bankDetails.accountName}</strong></p>}
                  {business.bankDetails.accountNumber && <p><span className="text-slate-500">A/C No:</span> <strong className="font-mono text-slate-900">{business.bankDetails.accountNumber}</strong></p>}
                  {business.bankDetails.ifsc && <p><span className="text-slate-500">IFSC:</span> <strong className="font-mono text-slate-900">{business.bankDetails.ifsc}</strong></p>}
                  {business.bankDetails.upiId && <p><span className="text-slate-500">UPI ID:</span> <strong className="font-mono text-mint-700">{business.bankDetails.upiId}</strong></p>}
                </div>

                {upiQrUrl && (
                  <div className="text-center shrink-0">
                    <img 
                      src={upiQrUrl} 
                      alt="UPI Direct Payment QR Code" 
                      className="w-16 h-16 border border-slate-200 rounded bg-white p-0.5 mx-auto" 
                    />
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Scan to Pay UPI</span>
                  </div>
                )}
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
              <span>Taxable Amount:</span>
              <span className="font-mono font-medium text-slate-900">{fmtCurr(subtotal, true)}</span>
            </div>

            {isInter ? (
              <div className="flex justify-between text-slate-700">
                <span>IGST (Integrated 18%):</span>
                <span className="font-mono font-medium text-slate-900">{fmtCurr(invoice.igst || totalTax, true)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-slate-600">
                  <span>CGST (Central 9%):</span>
                  <span className="font-mono text-slate-900">{fmtCurr(invoice.cgst || (totalTax / 2), true)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SGST (State 9%):</span>
                  <span className="font-mono text-slate-900">{fmtCurr(invoice.sgst || (totalTax / 2), true)}</span>
                </div>
              </>
            )}

            {invoice.shipping > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Shipping &amp; Handling:</span>
                <span className="font-mono text-slate-900">{fmtCurr(invoice.shipping, true)}</span>
              </div>
            )}

            {invoice.roundOff && invoice.roundOff !== 0 ? (
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Round Off:</span>
                <span className="font-mono">{fmtCurr(invoice.roundOff, true)}</span>
              </div>
            ) : null}

            <div className="flex justify-between items-center text-sm font-black text-slate-950 pt-2 border-t-2 border-slate-300">
              <span>Total Invoice Amount:</span>
              <span className={`font-mono text-base ${currentTheme.totalColor}`}>{fmtCurr(grandTotal, true)}</span>
            </div>

            <div className="pt-2 border-t border-dashed border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Amount Received:</span>
                <span className="font-mono font-bold text-emerald-700">{fmtCurr(paidAmt, true)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold">
                <span>Balance Due:</span>
                <span className="font-mono text-rose-600">{fmtCurr(pendingAmt, true)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 5. AMOUNT IN WORDS */}
        <div className="my-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center gap-2">
          <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider shrink-0">Invoice Value (in Words):</span>
          <span className="font-bold text-slate-900 italic">{words}</span>
        </div>

        {/* 6. DECLARATION & AUTHORIZED SIGNATORY */}
        <div className="pt-4 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
          
          <div className="max-w-md space-y-1 text-slate-500 text-[11px]">
            <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Declaration &amp; Terms</p>
            <p className="leading-relaxed">
              {invoice.terms || business?.defaultTerms || '1. We declare that this invoice shows the actual price of the goods/services described and that all particulars are true and correct.\n2. Payment due within 15 days of invoice issue date.'}
            </p>
          </div>

          <div className="text-right space-y-6 w-48 shrink-0">
            <p className="font-bold text-slate-800 text-xs">For {bizName}</p>
            <div className="border-t border-slate-400 pt-1 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Authorized Signatory</span>
            </div>
          </div>

        </div>

        {/* 7. NEAT FOOTER WITH BILLMINT BRANDING */}
        <div className="pt-8 mt-6 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
          <span>This is a computer-generated tax invoice. No physical signature required under Indian IT Act.</span>
          <span className="font-semibold text-slate-500">Powered by <strong className="text-mint-600">BillMint</strong></span>
        </div>

      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl animate-in fade-in">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Record Payment</h3>
              <p className="text-xs text-slate-500 mt-1">Invoice: {invoice.invoiceNumber} | Total Due: {fmtCurr(pendingAmt)}</p>
            </div>
            
            <form onSubmit={submitPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount Paid ({currencyPrefix})</label>
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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
