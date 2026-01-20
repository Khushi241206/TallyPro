
import React, { useState } from 'react';
import { Product } from '../types';
import { formatCurrency } from '../constants';
import { Package, Search, Plus, AlertTriangle, MoreHorizontal, ArrowUpRight, ArrowDownLeft, X } from 'lucide-react';

interface StockProps {
  products: Product[];
  onAddProduct: (p: Omit<Product, 'id'>) => void;
  theme: 'light' | 'dark';
}

export const Stock: React.FC<StockProps> = ({ products, onAddProduct, theme }) => {
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    sku: '',
    unit: 'units',
    quantity: 0,
    lowStockLevel: 5,
    purchasePrice: 0,
    salePrice: 0
  });

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct(formData);
    setShowModal(false);
    setFormData({ name: '', sku: '', unit: 'units', quantity: 0, lowStockLevel: 5, purchasePrice: 0, salePrice: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className={`relative flex-1 w-full max-w-md ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inventory..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none ${isDark ? 'bg-[#1e1e2d] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      <div className={`${isDark ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-100'} rounded-2xl border shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} text-xs uppercase text-gray-500 font-bold tracking-wider`}>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4 text-center">In Stock</th>
                <th className="px-6 py-4 text-center">Unit</th>
                <th className="px-6 py-4">Low Stock</th>
                <th className="px-6 py-4">Unit Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {filtered.map((item) => {
                const isLow = item.quantity <= item.lowStockLevel;
                return (
                  <tr key={item.id} className={`${isDark ? 'hover:bg-gray-800/30 text-gray-300' : 'hover:bg-gray-50 text-gray-700'} transition-colors`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isLow ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                          <Package size={16} />
                        </div>
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p className="text-[10px] text-gray-500 font-medium">SKU: {item.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm font-black ${isLow ? 'text-amber-500' : ''}`}>{item.quantity}</span>
                    </td>
                    <td className="px-6 py-4 text-center capitalize text-xs font-bold text-gray-500">{item.unit}</td>
                    <td className="px-6 py-4">
                      {isLow ? (
                        <span className="flex items-center text-amber-500 font-bold text-xs">
                          <AlertTriangle size={14} className="mr-1" /> YES
                        </span>
                      ) : (
                        <span className="text-gray-400 font-medium text-xs">NO</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold">{formatCurrency(item.salePrice)}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-gray-500/10 rounded-lg text-gray-500"><MoreHorizontal size={18} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${isDark ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white'} w-full max-w-lg rounded-[2.5rem] border p-8 shadow-2xl`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black">Add New Inventory</h3>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required type="text" placeholder="Product Name" className={`w-full p-4 rounded-2xl border outline-none ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="SKU Code" className={`w-full p-4 rounded-2xl border outline-none ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`} value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
                <select className={`w-full p-4 rounded-2xl border outline-none ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`} value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value as any})}>
                  <option value="units">Units</option>
                  <option value="kg">Kilograms</option>
                  <option value="liters">Liters</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Opening Qty" className={`w-full p-4 rounded-2xl border outline-none ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`} value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} />
                <input required type="number" placeholder="Low Stock Level" className={`w-full p-4 rounded-2xl border outline-none ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`} value={formData.lowStockLevel} onChange={e => setFormData({...formData, lowStockLevel: parseInt(e.target.value)})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Purchase Price" className={`w-full p-4 rounded-2xl border outline-none ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`} value={formData.purchasePrice} onChange={e => setFormData({...formData, purchasePrice: parseFloat(e.target.value)})} />
                <input required type="number" placeholder="Sale Price" className={`w-full p-4 rounded-2xl border outline-none ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`} value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: parseFloat(e.target.value)})} />
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black mt-4 shadow-xl shadow-blue-500/20">SAVE PRODUCT</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
