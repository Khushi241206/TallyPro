
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft, Clock,
  Calendar, CreditCard
} from 'lucide-react';
import { Transaction, Product, Party } from '../types';
import { formatCurrency, COLORS } from '../constants';

interface DashboardProps {
  transactions: Transaction[];
  products: Product[];
  parties: Party[];
  theme: 'light' | 'dark';
  onViewAll?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, products, parties, theme, onViewAll }) => {
  const isDark = theme === 'dark';

  const stats = useMemo(() => {
    const cashIn = transactions.filter(t => t.type === 'CREDIT').reduce((acc, t) => acc + t.amount, 0);
    const cashOut = transactions.filter(t => t.type === 'DEBIT').reduce((acc, t) => acc + t.amount, 0);
    const balance = cashIn - cashOut;
    const lowStockCount = products.filter(p => p.quantity <= p.lowStockLevel).length;
    
    return { cashIn, cashOut, balance, lowStockCount };
  }, [transactions, products]);

  const monthlyData = [
    { name: 'Jan', revenue: 4000, expenses: 2400 },
    { name: 'Feb', revenue: 3000, expenses: 1398 },
    { name: 'Mar', revenue: 2000, expenses: 9800 },
    { name: 'Apr', revenue: 2780, expenses: 3908 },
    { name: 'May', revenue: 1890, expenses: 4800 },
    { name: 'Jun', revenue: 2390, expenses: 3800 },
  ];

  const pieData = [
    { name: 'Inventory', value: 400 },
    { name: 'Salary', value: 300 },
    { name: 'Rent', value: 300 },
    { name: 'Utilities', value: 200 },
  ];

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const Card = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className={`${isDark ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-opacity-10 ${color}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`flex items-center text-xs font-bold ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</h3>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Cash In" value={formatCurrency(stats.cashIn)} icon={TrendingUp} color="text-green-500 bg-green-500" trend={12} />
        <Card title="Cash Out" value={formatCurrency(stats.cashOut)} icon={TrendingDown} color="text-red-500 bg-red-500" trend={-5} />
        <Card title="Current Balance" value={formatCurrency(stats.balance)} icon={Wallet} color="text-blue-500 bg-blue-500" />
        <Card title="Low Stock Alerts" value={stats.lowStockCount} icon={Clock} color="text-amber-500 bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${isDark ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-2xl border shadow-sm`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Monthly Performance</h3>
            <select className={`text-xs p-1 rounded ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#374151" : "#e5e7eb"} />
                <XAxis dataKey="name" stroke={isDark ? "#9ca3af" : "#4b5563"} axisLine={false} tickLine={false} />
                <YAxis stroke={isDark ? "#9ca3af" : "#4b5563"} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: isDark ? '#fff' : '#000' }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${isDark ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-2xl border shadow-sm`}>
          <h3 className={`font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Expense Distribution</h3>
          <div className="h-72 flex">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={`${isDark ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-100'} rounded-2xl border shadow-sm overflow-hidden`}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
          <button onClick={onViewAll} className="text-sm text-blue-500 hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} text-xs uppercase text-gray-500 font-semibold`}>
                <th className="px-6 py-4">Transaction</th>
                <th className="px-6 py-4">Party</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {transactions.slice(0, 5).map((tx) => (
                <tr key={tx.id} className={`${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'} transition-colors`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${tx.type === 'CREDIT' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {tx.type === 'CREDIT' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      </div>
                      <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{tx.category}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {parties.find(p => p.id === tx.partyId)?.name || 'Walk-in'}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{tx.date}</td>
                  <td className={`px-6 py-4 text-sm font-bold ${tx.type === 'CREDIT' ? 'text-green-500' : 'text-red-500'}`}>
                    {tx.type === 'CREDIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-full bg-blue-500/10 text-blue-500">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No recent transactions to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
