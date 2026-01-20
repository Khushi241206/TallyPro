
import React, { useState, useMemo } from 'react';
import { Transaction, Party } from '../types';
import { formatCurrency, formatDate } from '../constants';
import { Search, Filter, Calendar, TrendingUp, TrendingDown, FileText } from 'lucide-react';

interface DaybookProps {
  transactions: Transaction[];
  parties: Party[];
  theme: 'light' | 'dark';
}

export const Daybook: React.FC<DaybookProps> = ({ transactions, parties, theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const isDark = theme === 'dark';

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const party = parties.find(p => p.id === t.partyId);
      const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (party && party.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDate = dateFilter === '' || t.date.startsWith(dateFilter);
      return matchesSearch && matchesDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, parties, searchTerm, dateFilter]);

  const totals = filtered.reduce((acc, t) => {
    if (t.type === 'CREDIT') acc.credit += t.amount;
    else acc.debit += t.amount;
    return acc;
  }, { credit: 0, debit: 0 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className={`relative flex-1 w-full max-w-md ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by party or category..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none ${isDark ? 'bg-[#1e1e2d] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border ${isDark ? 'bg-[#1e1e2d] border-gray-800 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>
            <Calendar size={18} />
            <input 
              type="date" 
              className="bg-transparent outline-none text-sm font-medium" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            {dateFilter && (
              <button onClick={() => setDateFilter('')} className="text-xs font-bold text-red-500 ml-2">Clear</button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-100'} p-4 rounded-2xl border flex items-center justify-between`}>
          <div>
            <p className="text-xs font-bold text-green-600 uppercase">Total Credit (In)</p>
            <h3 className="text-2xl font-black text-green-500">{formatCurrency(totals.credit)}</h3>
          </div>
          <TrendingUp className="text-green-500" size={32} />
        </div>
        <div className={`${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'} p-4 rounded-2xl border flex items-center justify-between`}>
          <div>
            <p className="text-xs font-bold text-red-600 uppercase">Total Debit (Out)</p>
            <h3 className="text-2xl font-black text-red-500">{formatCurrency(totals.debit)}</h3>
          </div>
          <TrendingDown className="text-red-500" size={32} />
        </div>
      </div>

      <div className={`${isDark ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-100'} rounded-2xl border shadow-sm overflow-hidden`}>
        <div className="divide-y divide-gray-800/50">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-medium">No transactions found for the selected filter.</div>
          ) : (
            filtered.map((tx) => {
              const party = parties.find(p => p.id === tx.partyId);
              return (
                <div key={tx.id} className={`p-4 flex items-center justify-between ${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'CREDIT' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {tx.type === 'CREDIT' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    </div>
                    <div>
                      <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{party?.name || 'Self'}</h4>
                      <p className="text-xs text-gray-500">{tx.category} • {formatDate(tx.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black ${tx.type === 'CREDIT' ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.type === 'CREDIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    {tx.billUrl && <FileText size={14} className="ml-auto text-blue-500 mt-1" />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
