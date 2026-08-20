import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Download, Printer, Share2, Send, CheckCircle2, ArrowLeft, 
  CreditCard, Edit3, FileText, Building2, ShieldCheck 
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../packages/shared-utils/index.js';
import { generateInvoicePDF } from '../services/pdfGenerator.js';

export default function InvoiceViewPage({ invoices = [], business = {}, customers = [], onRecordPayment }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState('Modern');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('UPI');

  const invoice = invoices.find(i => i.id === id || i.invoiceNumber === id) || invoices[0];
  const customer = customers.find(c => c.id === invoice?.customerId) || {};

  if (!invoice) {
    return (
      <div className="p-12 text-center text-slate-500">
        <p>Invoice not found.</p>
        <Link to="/invoices" className="text-mint-600 font-bold underline">Back to Invoices</Link>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    const pdf = generateInvoicePDF(invoice, business, customer, template);
    pdf.save(`${invoice.invoiceNumber}.pdf`);
  };

  const handlePrint = () => {
    const pdf = generateInvoicePDF(invoice, business, customer, template);
    pdf.autoPrint();
    window.open(pdf.output('bloburl'), '_blank');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Invoice link copied to clipboard!');
  };

  const submitPayment = (e) => {
    e.preventDefault();
    onRecordPayment({
      invoiceId: invoice.id,
      amount: Number(payAmount || invoice.balanceDue || invoice.grandTotal),
      paymentMethod: payMethod
    });
    setShowPaymentModal(false);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      
      {/* Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        <button 
          onClick={() => navigate('/invoices')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Invoices
        </button>

        {/* Template Selector Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {['Modern', 'Classic', 'Minimal'].map(t => (
            <button
              key={t}
              onClick={() => setTemplate(t)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                template === t ? 'bg-white text-mint-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {invoice.status !== 'Paid' && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Record Payment</span>
            </button>
          )}

          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2 bg-mint-600 hover:bg-mint-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl"
            title="Print"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl"
            title="Share Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Invoice Document Canvas */}
      <div className={`bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-8 sm:p-12 space-y-8 ${
        template === 'Classic' ? 'font-serif bg-amber-50/20' : template === 'Minimal' ? 'bg-white' : 'bg-gradient-to-br from-white via-slate-50/40 to-mint-50/20'
      }`}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
          <div>
            <div className="flex items-center gap-2 text-mint-600 font-bold text-xl mb-1">
              <div className="w-8 h-8 rounded-lg bg-mint-600 text-white flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <span>BillMint</span>
            </div>
            <h2 className="text-2xl font-bold text-charcoal-900">{business?.name || 'Nova Creative Studio'}</h2>
            <p className="text-xs text-slate-500 mt-1">{business?.address}, {business?.city}, {business?.state}</p>
            <p className="text-xs text-slate-500">GSTIN: {business?.gstin} | PAN: {business?.pan}</p>
            <p className="text-xs text-slate-500">Phone: {business?.phone} | Email: {business?.email}</p>
          </div>

          <div className="sm:text-right">
            <span className="inline-block bg-mint-100 text-mint-800 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              TAX INVOICE
            </span>
            <p className="text-2xl font-extrabold text-slate-900">{invoice.invoiceNumber}</p>
            <div className="text-xs text-slate-500 mt-2 space-y-1">
              <p><span className="font-semibold text-slate-700">Issue Date:</span> {formatDate(invoice.issueDate)}</p>
              <p><span className="font-semibold text-slate-700">Due Date:</span> {formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </div>

        {/* Client & Status */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-mint-600" /> Billed To
            </p>
            <h3 className="text-base font-bold text-charcoal-900">{invoice.customerName}</h3>
            <p className="text-xs text-slate-600">{invoice.customerAddress}</p>
            <p className="text-xs text-slate-500 font-mono mt-0.5">GSTIN: {invoice.customerGstin || 'N/A'}</p>
          </div>

          <div className="sm:text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Invoice Status</p>
            <span className={
              invoice.status === 'Paid' ? 'badge-paid' :
              invoice.status === 'Pending' ? 'badge-pending' :
              invoice.status === 'Overdue' ? 'badge-overdue' : 'badge-draft'
            }>
              {invoice.status}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-y border-slate-200">
                <th className="py-3 px-4">Item & Description</th>
                <th className="py-3 px-3 text-center">HSN/SAC</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Rate</th>
                <th className="py-3 px-4 text-right">GST</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(invoice.items || []).map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3.5 px-4 font-medium text-slate-900">{item.description}</td>
                  <td className="py-3.5 px-3 text-center font-mono text-xs text-slate-500">{item.hsnSac || '998314'}</td>
                  <td className="py-3.5 px-4 text-center">{item.quantity}</td>
                  <td className="py-3.5 px-4 text-right">{formatCurrency(item.rate)}</td>
                  <td className="py-3.5 px-4 text-right text-slate-500">{item.taxRate || 18}%</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">{formatCurrency(item.amount || (item.quantity * item.rate))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculations */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200">
          <div className="max-w-xs space-y-2 text-xs text-slate-600">
            <p className="font-bold text-slate-800">Payment Instructions:</p>
            <p>Bank: {business?.bankDetails?.bankName || 'HDFC Bank'}</p>
            <p>A/C No: {business?.bankDetails?.accountNumber || '50200012345678'}</p>
            <p>IFSC: {business?.bankDetails?.ifsc || 'HDFC0001234'} | UPI: {business?.bankDetails?.upiId}</p>
            {invoice.notes && <p className="pt-2 italic text-slate-500">"{invoice.notes}"</p>}
          </div>

          <div className="w-full sm:w-64 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-medium text-slate-900">{formatCurrency(invoice.subtotal)}</span>
            </div>

            {invoice.isInterState || (invoice.igst && invoice.igst > 0) ? (
              <div className="flex justify-between text-indigo-700 font-semibold bg-indigo-50 p-1 rounded border border-indigo-100">
                <span>IGST (Integrated 18%):</span>
                <span>{formatCurrency(invoice.igst || invoice.totalTax)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-slate-600">
                  <span>CGST (9%):</span>
                  <span className="font-medium text-slate-900">{formatCurrency(invoice.cgst || (invoice.totalTax / 2))}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SGST (9%):</span>
                  <span className="font-medium text-slate-900">{formatCurrency(invoice.sgst || (invoice.totalTax / 2))}</span>
                </div>
              </>
            )}

            <div className="flex justify-between text-slate-900 font-extrabold text-base pt-2 border-t border-slate-300">
              <span>Total Amount:</span>
              <span className="text-mint-700">{formatCurrency(invoice.grandTotal)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold text-charcoal-900">Record Payment</h3>
            <form onSubmit={submitPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Amount (₹)</label>
                <input 
                  type="number"
                  required
                  defaultValue={invoice.balanceDue || invoice.grandTotal}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
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
                  <option value="Bank Transfer">Bank Transfer</option>
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
                  className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
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
