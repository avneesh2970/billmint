import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, Eye, ArrowLeft, Building2, UserPlus, FileText, MapPin, CheckCircle2, AlertCircle, Edit2 } from 'lucide-react';
import { formatCurrency, calculateInvoiceSummary, checkIsInterState, getStateCodeFromState } from '../../../../packages/shared-utils/index.js';
import AddressStepForm from '../components/AddressStepForm.jsx';

export default function InvoiceBuilderPage({ business = {}, customers = [], products = [], onSaveInvoice }) {
  const navigate = useNavigate();

  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-2026-00${Math.floor(10 + Math.random() * 90)}`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]);
  const [template, setTemplate] = useState('Modern');
  const [shipping, setShipping] = useState(0);
  const [showAddressEditor, setShowAddressEditor] = useState(false);

  // Selected Customer details
  const selectedCust = customers.find(c => c.id === selectedCustomerId) || customers[0] || {};

  // Local state for Customer Address (address, city, state, stateCode, pincode)
  const [custAddress, setCustAddress] = useState({
    address: selectedCust.address || '',
    city: selectedCust.city || '',
    state: selectedCust.state || 'Karnataka',
    stateCode: selectedCust.stateCode || getStateCodeFromState(selectedCust.state || 'Karnataka') || '29',
    pincode: selectedCust.pincode || selectedCust.pinCode || ''
  });

  useEffect(() => {
    if (selectedCust.id) {
      setCustAddress({
        address: selectedCust.address || '',
        city: selectedCust.city || '',
        state: selectedCust.state || 'Karnataka',
        stateCode: selectedCust.stateCode || getStateCodeFromState(selectedCust.state || 'Karnataka') || '29',
        pincode: selectedCust.pincode || selectedCust.pinCode || ''
      });
    }
  }, [selectedCustomerId]);

  // Business state & code
  const bizState = business.state || 'Karnataka';
  const bizCode = business.stateCode || getStateCodeFromState(bizState) || '29';

  // Auto-detect Inter-State (IGST) condition (true if DIFFERENT state, false if SAME state)
  const isInterState = checkIsInterState(bizState, custAddress.state, bizCode, custAddress.stateCode);

  const [items, setItems] = useState([
    {
      id: `item_${Date.now()}`,
      description: 'Website Development',
      hsnSac: '998314',
      quantity: 1,
      rate: 75000,
      discountPercent: 0,
      taxRate: 18
    }
  ]);

  const [notes, setNotes] = useState(business?.defaultNotes || 'Thank you for your business!');
  const [terms, setTerms] = useState(business?.defaultTerms || 'Payment due within 15 days.');

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `item_${Date.now()}`,
        description: '',
        hsnSac: '998314',
        quantity: 1,
        rate: 0,
        discountPercent: 0,
        taxRate: 18
      }
    ]);
  };

  const removeItem = (id) => {
    if (items.length <= 1) return;
    setItems(items.filter(i => i.id !== id));
  };

  const handleProductSelect = (index, prodId) => {
    const p = products.find(prod => prod.id === prodId);
    if (!p) return;
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      description: p.name + (p.description ? ` (${p.description})` : ''),
      hsnSac: p.hsnSac || '998314',
      rate: p.price,
      taxRate: p.taxRate || 18
    };
    setItems(updated);
  };

  const updateItemField = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  // Calculations with IGST vs CGST+SGST auto-detection
  const summary = calculateInvoiceSummary(items, shipping, isInterState);

  const handleSave = (status = 'Pending') => {
    const fullCustAddr = [custAddress.address, custAddress.city, custAddress.state, custAddress.stateCode ? `[${custAddress.stateCode}]` : '', custAddress.pincode].filter(Boolean).join(', ');

    const newInv = {
      id: `inv_${Date.now()}`,
      invoiceNumber,
      customerId: selectedCust.id || 'cust_001',
      customerName: selectedCust.company || selectedCust.name || 'ABC Enterprises',
      customerEmail: selectedCust.email || '',
      customerAddress: fullCustAddr || selectedCust.address || '',
      customerCity: custAddress.city,
      customerState: custAddress.state,
      customerStateCode: custAddress.stateCode,
      customerPincode: custAddress.pincode,
      customerGstin: selectedCust.gstin || '',
      businessState: bizState,
      businessStateCode: bizCode,
      isInterState,
      issueDate,
      dueDate,
      status,
      template,
      items: items.map(i => ({
        ...i,
        amount: (Number(i.quantity) * Number(i.rate)) * (1 - (Number(i.discountPercent) / 100))
      })),
      subtotal: summary.subtotal,
      totalDiscount: summary.totalDiscount,
      taxableAmount: summary.taxableAmount,
      cgst: summary.cgst,
      sgst: summary.sgst,
      igst: summary.igst,
      totalTax: summary.totalTax,
      shipping: summary.shipping,
      roundOff: summary.roundOff,
      grandTotal: summary.grandTotal,
      amountPaid: 0,
      balanceDue: summary.grandTotal,
      notes,
      terms
    };

    onSaveInvoice(newInv);
    navigate(`/invoices/${newInv.id}`);
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/invoices')} 
            className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-charcoal-900">Create Invoice</h1>
            <p className="text-xs text-slate-500">Draft or generate a new client invoice with automatic GST tax rules.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave('Draft')}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 rounded-xl shadow-xs"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave('Pending')}
            className="px-5 py-2.5 bg-mint-600 hover:bg-mint-700 font-bold text-xs text-white rounded-xl shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-10 space-y-8">
        
        {/* Section 1: Business Header & Invoice Number */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-mint-600 bg-mint-50 px-3 py-1 rounded-full">
              Billed From (Seller)
            </span>
            <h2 className="text-xl font-bold text-charcoal-900 mt-2">{business?.name || 'Nova Creative Studio'}</h2>
            <p className="text-xs text-slate-500">{business?.address}, {business?.city}, {bizState} (State Code: {bizCode})</p>
            <p className="text-xs text-slate-500">GSTIN: {business?.gstin} | Phone: {business?.phone}</p>
          </div>

          <div className="w-full sm:w-64 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Invoice Number</label>
              <input 
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-mint-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500">Issue Date</label>
                <input 
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-2 py-1 border border-slate-200 rounded-lg text-[11px]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500">Due Date</label>
                <input 
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-2 py-1 border border-slate-200 rounded-lg text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Customer Selection & Multi-Step Address */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-charcoal-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-mint-600" /> Billed To (Customer)
            </h3>
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setShowAddressEditor(!showAddressEditor)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-white px-3 py-1 rounded-lg border border-slate-200"
              >
                <Edit2 className="w-3.5 h-3.5" /> {showAddressEditor ? 'Hide Address Steps' : 'Edit Address Steps'}
              </button>
              <button 
                type="button"
                onClick={() => navigate('/customers')}
                className="text-xs font-bold text-mint-600 hover:underline flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" /> Manage Customers
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Customer</label>
              <select 
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-mint-500 focus:outline-none"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.company || c.name} ({c.state || 'Karnataka'} - Code: {c.stateCode || getStateCodeFromState(c.state) || '29'})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200/80">
              <p className="font-bold text-slate-900 text-sm">{selectedCust.company || selectedCust.name}</p>
              <p className="text-slate-600">
                {custAddress.address || 'Street Address'}, {custAddress.city || 'City'}, {custAddress.state || 'State'} {custAddress.pincode ? `- ${custAddress.pincode}` : ''}
              </p>
              <div className="flex items-center gap-2 font-mono text-[11px] pt-1">
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-bold">
                  State Code: {custAddress.stateCode || '29'}
                </span>
                <span className="text-slate-500">GSTIN: {selectedCust.gstin || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Interactive Multi-Step Address Form for Customer */}
          {showAddressEditor && (
            <div className="pt-2 animate-in fade-in">
              <label className="block text-xs font-bold text-slate-700 mb-2">Edit Customer Address Steps:</label>
              <AddressStepForm
                value={custAddress}
                onChange={(updated) => setCustAddress(updated)}
              />
            </div>
          )}

          {/* Live GST Tax Auto-Detection Banner */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
            isInterState 
              ? 'bg-indigo-50/90 border-indigo-200 text-indigo-900' 
              : 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
                isInterState ? 'bg-indigo-600' : 'bg-emerald-600'
              }`}>
                {isInterState ? 'IGST' : 'CGST'}
              </div>
              <div>
                <p className="font-extrabold text-sm">
                  {isInterState ? 'Inter-State Transaction Detected (IGST)' : 'Intra-State Transaction Detected (CGST + SGST)'}
                </p>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Business State: <strong className="text-slate-900">{bizState} [Code: {bizCode}]</strong> | 
                  Customer State: <strong className="text-slate-900">{custAddress.state} [Code: {custAddress.stateCode}]</strong>
                </p>
              </div>
            </div>

            <div className="self-end sm:self-auto">
              <span className={`px-3 py-1.5 rounded-xl font-mono font-extrabold text-xs shadow-xs ${
                isInterState ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {isInterState ? 'Applying IGST @ 18%' : 'Applying CGST (9%) + SGST (9%)'}
              </span>
            </div>
          </div>

        </div>


        {/* Section 3: Line Items Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-charcoal-900">Line Items</h3>
            <span className="text-xs text-slate-400">Select pre-saved product or enter custom items</span>
          </div>

          <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 min-w-[200px]">Product / Item Description</th>
                  <th className="py-3 px-3 w-28">HSN/SAC</th>
                  <th className="py-3 px-3 w-20 text-center">Qty</th>
                  <th className="py-3 px-3 w-28 text-right">Rate (₹)</th>
                  <th className="py-3 px-3 w-20 text-right">Disc %</th>
                  <th className="py-3 px-3 w-20 text-right">GST %</th>
                  <th className="py-3 px-3 w-28 text-right">Amount (₹)</th>
                  <th className="py-3 px-2 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, idx) => {
                  const lineTotal = (item.quantity * item.rate) * (1 - (item.discountPercent / 100));
                  return (
                    <tr key={item.id}>
                      <td className="p-3">
                        {products.length > 0 && (
                          <select 
                            onChange={(e) => handleProductSelect(idx, e.target.value)}
                            className="w-full text-[11px] p-1 mb-1 border border-slate-200 rounded text-slate-600"
                          >
                            <option value="">-- Quick Select Product --</option>
                            {products.map(p => (
                              <option key={p.id} value={p.id}>{p.name} (HSN: {p.hsnSac || '998314'}) - ₹{p.price}</option>
                            ))}
                          </select>
                        )}
                        <input 
                          type="text"
                          placeholder="Item name & description..."
                          value={item.description}
                          onChange={(e) => updateItemField(idx, 'description', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-mint-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-3">
                        <input 
                          type="text"
                          placeholder="998314"
                          value={item.hsnSac || '998314'}
                          onChange={(e) => updateItemField(idx, 'hsnSac', e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-mint-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-3">
                        <input 
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItemField(idx, 'quantity', Number(e.target.value))}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-center focus:ring-1 focus:ring-mint-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-3">
                        <input 
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItemField(idx, 'rate', Number(e.target.value))}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-right focus:ring-1 focus:ring-mint-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-3">
                        <input 
                          type="number"
                          value={item.discountPercent}
                          onChange={(e) => updateItemField(idx, 'discountPercent', Number(e.target.value))}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-right focus:ring-1 focus:ring-mint-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-3">
                        <input 
                          type="number"
                          value={item.taxRate}
                          onChange={(e) => updateItemField(idx, 'taxRate', Number(e.target.value))}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-right focus:ring-1 focus:ring-mint-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900">
                        {formatCurrency(lineTotal)}
                      </td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button 
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-mint-600 hover:text-mint-700 bg-mint-50 px-3.5 py-2 rounded-xl"
          >
            <Plus className="w-4 h-4" /> Add Item Line
          </button>
        </div>

        {/* Section 4: Totals & Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4 border-t border-slate-100">
          <div className="w-full sm:w-1/2 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Notes to Client</label>
              <textarea 
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-mint-500 focus:outline-none"
              ></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Terms & Conditions</label>
              <textarea 
                rows="2"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-mint-500 focus:outline-none"
              ></textarea>
            </div>
          </div>

          <div className="w-full sm:w-72 bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(summary.subtotal)}</span>
            </div>
            {summary.totalDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Total Discount:</span>
                <span>-{formatCurrency(summary.totalDiscount)}</span>
              </div>
            )}

            {isInterState ? (
              <div className="flex justify-between text-indigo-700 font-semibold bg-indigo-50 p-1.5 rounded-lg border border-indigo-100">
                <span>IGST (Integrated 18%):</span>
                <span>{formatCurrency(summary.igst)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-slate-600">
                  <span>CGST (Central 9%):</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(summary.cgst)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SGST (State 9%):</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(summary.sgst)}</span>
                </div>
              </>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Round Off:</span>
              <span>₹{summary.roundOff}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
              <span>Grand Total:</span>
              <span className="text-mint-700">{formatCurrency(summary.grandTotal)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
