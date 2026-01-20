
import React, { useState, useRef } from 'react';
import { Party, TransactionType } from '../types';
import { formatCurrency } from '../constants';
import { Plus, Save, User, Calendar, Tag, CreditCard, Upload, Send, FileCheck } from 'lucide-react';

interface BillingProps {
  parties: Party[];
  onAddTransaction: (t: any) => void;
  theme: 'light' | 'dark';
}

export const Billing: React.FC<BillingProps> = ({ parties, onAddTransaction, theme }) => {
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<TransactionType>('CREDIT');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    partyId: '',
    amount: '',
    category: '',
    note: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.partyId || !formData.amount) return;
    
    onAddTransaction({
      ...formData,
      type,
      amount: parseFloat(formData.amount),
      billUrl: selectedFile ? URL.createObjectURL(selectedFile) : undefined
    });

    setFormData({
      partyId: '',
      amount: '',
      category: '',
      note: '',
      date: new Date().toISOString().split('T')[0]
    });
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setType('CREDIT')}
          className={`py-4 rounded-2xl font-black text-lg transition-all border-2 ${
            type === 'CREDIT' 
              ? 'bg-green-500 text-white border-green-500 shadow-xl shadow-green-500/30' 
              : isDark ? 'bg-[#1e1e2d] border-gray-800 text-gray-500' : 'bg-white border-gray-100 text-gray-400'
          }`}
        >
          CASH IN
        </button>
        <button 
          onClick={() => setType('DEBIT')}
          className={`py-4 rounded-2xl font-black text-lg transition-all border-2 ${
            type === 'DEBIT' 
              ? 'bg-red-500 text-white border-red-500 shadow-xl shadow-red-500/30' 
              : isDark ? 'bg-[#1e1e2d] border-gray-800 text-gray-500' : 'bg-white border-gray-100 text-gray-400'
          }`}
        >
          CASH OUT
        </button>
      </div>

      <form onSubmit={handleSubmit} className={`${isDark ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-100'} p-8 rounded-[2rem] border shadow-sm space-y-6`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center">
              <User size={14} className="mr-2" /> Select Party
            </label>
            <select 
              required
              className={`w-full p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              value={formData.partyId}
              onChange={e => setFormData({...formData, partyId: e.target.value})}
            >
              <option value="">Choose a party...</option>
              {parties.map(p => <option key={p.id} value={p.id}>{p.name} (Bal: {formatCurrency(p.balance)})</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center">
              <CreditCard size={14} className="mr-2" /> Amount (₹)
            </label>
            <input 
              required
              type="number"
              placeholder="0.00"
              className={`w-full p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-blue-500 text-2xl font-black transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center">
              <Calendar size={14} className="mr-2" /> Date
            </label>
            <input 
              type="date"
              className={`w-full p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center">
              <Tag size={14} className="mr-2" /> Category
            </label>
            <input 
              type="text"
              placeholder="e.g. Sales, Service, Rent..."
              className={`w-full p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Additional Notes</label>
          <textarea 
            rows={3}
            placeholder="Write details about this transaction..."
            className={`w-full p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
            value={formData.note}
            onChange={e => setFormData({...formData, note: e.target.value})}
          />
        </div>

        <div className="flex items-center space-x-4 pt-4">
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 flex items-center justify-center space-x-2 p-4 rounded-2xl border border-dashed transition-all hover:bg-blue-500/10 ${selectedFile ? 'border-green-500 text-green-500' : isDark ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'}`}
          >
            {selectedFile ? <FileCheck size={18} /> : <Upload size={18} />}
            <span className="font-bold truncate max-w-[150px]">{selectedFile ? selectedFile.name : 'Attach Bill'}</span>
          </button>
          <button 
            type="submit" 
            className="flex-[2] flex items-center justify-center space-x-2 p-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-500/20"
          >
            <Send size={20} />
            <span>SAVE & SEND SMS</span>
          </button>
        </div>
      </form>
    </div>
  );
};
