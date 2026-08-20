import React, { useState } from 'react';
import { Plus, Search, Package, Trash2, Edit3, X } from 'lucide-react';
import { formatCurrency } from '../../../../packages/shared-utils/index.js';

export default function ProductsPage({ products = [], onAddProduct, onDeleteProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newProd, setNewProd] = useState({
    sku: '', name: '', description: '', type: 'Service', price: '', taxRate: '18', unit: 'Project'
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e) => {
    e.preventDefault();
    onAddProduct({
      id: `prod_${Date.now()}`,
      sku: newProd.sku || `SRV-${Math.floor(100 + Math.random() * 900)}`,
      name: newProd.name,
      description: newProd.description,
      type: newProd.type,
      price: Number(newProd.price),
      taxRate: Number(newProd.taxRate || 18),
      unit: newProd.unit
    });
    setShowModal(false);
    setNewProd({ sku: '', name: '', description: '', type: 'Service', price: '', taxRate: '18', unit: 'Project' });
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">Products & Services</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your service offerings and products to speed up invoice creation.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-mint-600 hover:bg-mint-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product / Service</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text"
            placeholder="Search by product name or SKU code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-mint-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">SKU / HSN Code</th>
                <th className="py-3.5 px-6">Item Name & Description</th>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6 text-right">Price</th>
                <th className="py-3.5 px-6 text-right">Tax Rate</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(prod => (
                <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs text-slate-500">
                    <p className="font-bold text-slate-700">{prod.sku}</p>
                    <span className="text-[10px] text-mint-600 bg-mint-50 px-1.5 py-0.5 rounded border border-mint-200">
                      HSN: {prod.hsnSac || '998314'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900">{prod.name}</p>
                    {prod.description && <p className="text-xs text-slate-400 mt-0.5">{prod.description}</p>}
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-slate-100 text-slate-700 font-semibold text-xs px-2.5 py-1 rounded-full">
                      {prod.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-slate-900">
                    {formatCurrency(prod.price)} / {prod.unit || 'Unit'}
                  </td>
                  <td className="py-4 px-6 text-right text-slate-500 font-medium">
                    {prod.taxRate || 18}% GST
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => onDeleteProduct && onDeleteProduct(prod.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-charcoal-900">Add Product or Service</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Item Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Website Development"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU Code</label>
                  <input 
                    type="text" 
                    placeholder="SRV-WEB-01"
                    value={newProd.sku}
                    onChange={(e) => setNewProd({ ...newProd, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">HSN / SAC Code</label>
                  <input 
                    type="text" 
                    placeholder="998314"
                    value={newProd.hsnSac}
                    onChange={(e) => setNewProd({ ...newProd, hsnSac: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea 
                  rows="2"
                  placeholder="Brief details..."
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="75000"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tax Rate (%)</label>
                  <input 
                    type="number" 
                    placeholder="18"
                    value={newProd.taxRate}
                    onChange={(e) => setNewProd({ ...newProd, taxRate: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-500 font-bold hover:text-slate-900"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-mint-600 text-white font-bold rounded-xl shadow"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
