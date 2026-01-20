
import React, { useState } from 'react';
import { Party, Transaction } from '../types';
import { formatCurrency } from '../constants';
import { Plus, Search, Edit2, Trash2, Phone, Mail, ChevronRight, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface LedgerProps {
  parties: Party[];
  transactions: Transaction[];
  onAddParty: (party: Omit<Party, 'id'>) => void;
  onUpdateParty: (party: Party) => void;
  onDeleteParty: (id: string) => void;
  theme: 'light' | 'dark';
}

export const Ledger: React.FC<LedgerProps> = ({ parties, transactions, onAddParty, onUpdateParty, onDeleteParty, theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '', balance: 0 });
  const isDark = theme === 'dark';

  const filtered = parties.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalCr = parties.reduce((a, b) => a + (b.balance > 0 ? b.balance : 0), 0);
  const totalDr = parties.reduce((a, b) => a + (b.balance < 0 ? Math.abs(b.balance) : 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className={`flex-1 ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'} p-6 rounded-[2rem] border shadow-sm`}>
          <p className="text-red-500 font-black uppercase text-xs tracking-widest mb-1">Cash Out (To Give)</p>
          <h2 className="text-4xl font-black text-red-500">{formatCurrency(totalDr)}</h2>
        </div>
        <div className={`flex-1 ${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-100'} p-6 rounded-[2rem] border shadow-sm`}>
          <p className="text-green-500 font-black uppercase text-xs tracking-widest mb-1">Cash In (To Get)</p>
          <h2 className="text-4xl font-black text-green-500">{formatCurrency(totalCr)}</h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative flex-1 w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Search parties..." 
            className={`w-full pl-12 pr-6 py-4 rounded-3xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDark ? 'bg-[#1e1e2d] border-gray-800 text-white' : 'bg-white border-gray-200'}`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { setEditingParty(null); setShowModal(true); }}
          className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl shadow-xl shadow-blue-500/30 flex items-center justify-center space-x-2"
        >
          <Plus size={24} />
          <span>ADD NEW PARTY</span>
        </button>
      </div>

      <div className={`${isDark ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-100'} rounded-[2.5rem] border shadow-sm overflow-hidden`}>
        <div className="divide-y divide-gray-800/40">
          {filtered.map(party => (
            <div key={party.id} className={`p-5 flex items-center justify-between group ${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'} transition-all cursor-pointer`}>
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-[1.2rem] flex items-center justify-center text-white font-black text-xl shadow-lg">
                  {party.name.charAt(0)}
                </div>
                <div>
                  <h4 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{party.name}</h4>
                  <p className="text-xs text-gray-500 font-bold uppercase">{party.phone || 'No Phone'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className={`text-xl font-black ${party.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(Math.abs(party.balance))}
                  </p>
                  <p className="text-[10px] font-black text-gray-500 uppercase">{party.balance >= 0 ? 'To Get' : 'To Give'}</p>
                </div>
                <ChevronRight className="text-gray-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className={`${isDark ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white'} w-full max-w-md rounded-[3rem] border p-8 shadow-2xl scale-in-center`}>
            <h3 className={`text-2xl font-black mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>{editingParty ? 'Edit Profile' : 'New Party Ledger'}</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" className={`w-full p-4 rounded-2xl border outline-none ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="tel" placeholder="Phone Number" className={`w-full p-4 rounded-2xl border outline-none ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <input type="number" placeholder="Opening Balance (₹)" className={`w-full p-4 rounded-2xl border outline-none ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} value={formData.balance} onChange={e => setFormData({...formData, balance: parseFloat(e.target.value)})} />
              <div className="flex space-x-4 pt-4">
                <button onClick={() => setShowModal(false)} className={`flex-1 py-4 font-black rounded-2xl ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-700'}`}>CANCEL</button>
                <button onClick={() => { onAddParty(formData); setShowModal(false); }} className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20">CREATE</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
