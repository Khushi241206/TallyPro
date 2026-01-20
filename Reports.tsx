
import React, { useState } from 'react';
import { Transaction, Party, Product } from '../types';
import { formatCurrency, downloadAsCSV } from '../constants';
import { BarChart3, TrendingUp, TrendingDown, Package, Download, PieChart, Calendar, Users, X, Info } from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';

interface ReportsProps {
  transactions: Transaction[];
  parties: Party[];
  products: Product[];
  theme: 'light' | 'dark';
}

export const Reports: React.FC<ReportsProps> = ({ transactions, parties, products, theme }) => {
  const isDark = theme === 'dark';
  const [showForecast, setShowForecast] = useState(false);

  const revenueByParty = parties.map(p => {
    const total = transactions
      .filter(t => t.partyId === p.id && t.type === 'CREDIT')
      .reduce((acc, t) => acc + t.amount, 0);
    return { name: p.name, amount: total };
  }).sort((a, b) => b.amount - a.amount);

  const topProducts = [...products].sort((a, b) => (b.salePrice * b.quantity) - (a.salePrice * a.quantity)).slice(0, 5);

  const forecastData = [
    { month: 'Jun', actual: 45000, projected: 45000 },
    { month: 'Jul', actual: 52000, projected: 53000 },
    { month: 'Aug', actual: 48000, projected: 58000 },
    { month: 'Sep', actual: null, projected: 64000 },
    { month: 'Oct', actual: null, projected: 72000 },
    { month: 'Nov', actual: null, projected: 85000 },
    { month: 'Dec', actual: null, projected: 98000 },
  ];

  const handleExportCSV = () => {
    const reportData = [
      { Metric: 'Gross Sales', Value: transactions.filter(t => t.type === 'CREDIT').reduce((a, b) => a + b.amount, 0) },
      { Metric: 'Net Earnings', Value: transactions.reduce((a, b) => a + (b.type === 'CREDIT' ? b.amount : -b.amount), 0) },
      { Metric: 'Total Expenses', Value: transactions.filter(t => t.type === 'DEBIT').reduce((a, b) => a + b.amount, 0) },
      { Metric: 'Inventory Value', Value: products.reduce((a, b) => a + (b.quantity * b.purchasePrice), 0) }
    ];
    downloadAsCSV(reportData, 'financial_intelligence_report');
  };

  return (
    <div className="space-y-10 pb-20 print-container">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 no-print">
        <div className="text-center md:text-left">
          <h2 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Financial Intelligence</h2>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Real-time Analysis v10.0</p>
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          {/* Removed Print and PDF buttons as requested */}
          <button 
            onClick={handleExportCSV} 
            className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg transition-all active:scale-95`}
          >
            <Download size={20} />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'} p-8 rounded-[2.5rem] border shadow-sm`}>
          <p className="text-blue-500 font-black uppercase text-[10px] tracking-widest mb-2 flex items-center"><BarChart3 size={14} className="mr-2" /> Gross Sales</p>
          <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-blue-900'}`}>{formatCurrency(transactions.filter(t => t.type === 'CREDIT').reduce((a, b) => a + b.amount, 0))}</h3>
        </div>
        <div className={`${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-100'} p-8 rounded-[2.5rem] border shadow-sm`}>
          <p className="text-green-500 font-black uppercase text-[10px] tracking-widest mb-2 flex items-center"><TrendingUp size={14} className="mr-2" /> Net Earnings</p>
          <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-green-900'}`}>{formatCurrency(transactions.reduce((a, b) => a + (b.type === 'CREDIT' ? b.amount : -b.amount), 0))}</h3>
        </div>
        <div className={`${isDark ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-100'} p-8 rounded-[2.5rem] border shadow-sm`}>
          <p className="text-rose-500 font-black uppercase text-[10px] tracking-widest mb-2 flex items-center"><TrendingDown size={14} className="mr-2" /> Total Opex</p>
          <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-rose-900'}`}>{formatCurrency(transactions.filter(t => t.type === 'DEBIT').reduce((a, b) => a + b.amount, 0))}</h3>
        </div>
        <div className={`${isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-100'} p-8 rounded-[2.5rem] border shadow-sm`}>
          <p className="text-amber-500 font-black uppercase text-[10px] tracking-widest mb-2 flex items-center"><Package size={14} className="mr-2" /> Stock Wealth</p>
          <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-amber-900'}`}>{formatCurrency(products.reduce((a, b) => a + (b.quantity * b.purchasePrice), 0))}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`${isDark ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-200'} p-8 md:p-10 rounded-[3rem] md:rounded-[3.5rem] border shadow-sm`}>
          <div className="flex items-center justify-between mb-8">
            <h4 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Client Performance</h4>
            <Users size={20} className="text-blue-500" />
          </div>
          <div className="space-y-6">
            {revenueByParty.slice(0, 5).map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm font-black">
                  <span className={isDark ? 'text-white' : 'text-gray-600'}>{item.name}</span>
                  <span className="text-blue-500">{formatCurrency(item.amount)}</span>
                </div>
                <div className="w-full bg-gray-500/10 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${Math.min(100, (item.amount / (revenueByParty[0]?.amount || 1)) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${isDark ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-200'} p-8 md:p-10 rounded-[3rem] md:rounded-[3.5rem] border shadow-sm`}>
          <div className="flex items-center justify-between mb-8">
            <h4 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Inventory Mix</h4>
            <PieChart size={20} className="text-amber-500" />
          </div>
          <div className="space-y-4">
             {topProducts.map((prod, i) => (
               <div key={prod.id} className={`flex items-center justify-between p-4 rounded-3xl transition-all ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500"><Package size={18} /></div>
                    <div>
                      <p className={`font-black text-sm ${isDark ? 'text-white' : 'text-gray-700'}`}>{prod.name}</p>
                      <p className="text-[10px] text-gray-500 font-black uppercase">Qty: {prod.quantity}</p>
                    </div>
                  </div>
                  <span className="text-amber-500 font-black text-sm">{formatCurrency(prod.salePrice * prod.quantity)}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className={`${isDark ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-200'} p-8 md:p-10 rounded-[3rem] border shadow-sm text-center no-print`}>
        <div className="w-20 h-20 bg-blue-600/10 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6"><Calendar size={32} /></div>
        <h4 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Projection 2026</h4>
        <button onClick={() => setShowForecast(true)} className="px-10 py-4 bg-blue-600 text-white rounded-3xl font-black shadow-xl active:scale-95 transition-all">REVEAL DETAILED FORECAST</button>
      </div>

      {showForecast && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 no-print">
          <div className={`${isDark ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white'} w-full max-w-4xl rounded-[3.5rem] border p-8 md:p-12 shadow-2xl relative animate-in zoom-in-95 duration-300`}>
            <button onClick={() => setShowForecast(false)} className="absolute top-8 right-8 p-3 rounded-2xl hover:bg-gray-500/10 transition-colors">
              <X size={24} />
            </button>
            <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-6 space-y-4 md:space-y-0 mb-10">
              <div className="p-4 bg-blue-600 rounded-3xl text-white shadow-xl"><TrendingUp size={32} /></div>
              <div>
                <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>TallyPro AI Intelligence</h3>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Growth Analytics • 2026</p>
              </div>
            </div>
            
            <div className="h-64 md:h-80 w-full mb-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#374151" : "#e5e7eb"} />
                  <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="projected" stroke="#3b82f6" strokeWidth={4} fillOpacity={0.1} fill="#3b82f6" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
