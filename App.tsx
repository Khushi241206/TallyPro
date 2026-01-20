
import React, { useState, useEffect, useMemo } from 'react';
import { ViewState, Transaction, Party, Product, Notification, UserProfile, StockHistory } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './views/Dashboard';
import { Ledger } from './views/Ledger';
import { Daybook } from './views/Daybook';
import { Stock } from './views/Stock';
import { Billing } from './views/Billing';
import { Reports } from './views/Reports';
import { Lock, Download, X, Edit2, KeyRound, CheckCircle2, CreditCard, Loader2 } from 'lucide-react';
import { formatCurrency, downloadAsCSV, Logo } from './constants';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isAppUnlocked, setIsAppUnlocked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '', businessName: '' });
  const [lockEntry, setLockEntry] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  const [user, setUser] = useState<UserProfile>({
    name: 'Admin Account',
    email: 'admin@tallypro.com',
    photoUrl: 'https://picsum.photos/seed/admin/200',
    businessName: 'TallyPro Global Corp',
    subscription: 'Enterprise',
    lockType: 'NONE',
    lockValue: '1234'
  });

  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem('tallypro_data_v11');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setTransactions(parsed.transactions || []);
      setParties(parsed.parties || []);
      setProducts(parsed.products || []);
      setStockHistory(parsed.stockHistory || []);
      setNotifications(parsed.notifications || []);
      if (parsed.user) setUser(parsed.user);
    } else {
      const mockParties: Party[] = [
        { id: '1', name: 'Zylker Tech', phone: '9876543210', email: 'zylker@tech.com', address: 'Bangalore', balance: 145000 },
        { id: '2', name: 'Nexus Solutions', phone: '9123456780', email: 'nexus@sol.com', address: 'Mumbai', balance: -22000 },
        { id: '3', name: 'Green Earth Inc', phone: '8877665544', email: 'green@earth.com', address: 'Pune', balance: 50000 },
        { id: '4', name: 'Velocity Motors', phone: '7766554433', email: 'velocity@motors.com', address: 'Chennai', balance: -8500 },
        { id: '5', name: 'Crystal Clear', phone: '9988776655', email: 'crystal@clear.com', address: 'Delhi', balance: 12000 }
      ];
      const mockProducts: Product[] = [
        { id: '1', name: 'Workstation Laptop', sku: 'LAP-WS-01', unit: 'units', quantity: 24, lowStockLevel: 5, purchasePrice: 45000, salePrice: 65000 },
        { id: '2', name: 'Ergo Chair X5', sku: 'CHR-ER-05', unit: 'units', quantity: 8, lowStockLevel: 10, purchasePrice: 12000, salePrice: 18500 },
        { id: '3', name: 'Curved Monitor 32"', sku: 'MON-CV-32', unit: 'units', quantity: 15, lowStockLevel: 5, purchasePrice: 22000, salePrice: 32000 },
        { id: '4', name: 'Wireless Mechanical KB', sku: 'KB-WL-RGB', unit: 'units', quantity: 45, lowStockLevel: 15, purchasePrice: 3500, salePrice: 5500 },
        { id: '5', name: 'Webcam 4K Ultra', sku: 'CAM-4K-02', unit: 'units', quantity: 3, lowStockLevel: 10, purchasePrice: 8000, salePrice: 12000 }
      ];
      
      const initialTransactions: Transaction[] = [
        { id: 't1', date: '2025-05-01', partyId: '1', type: 'CREDIT', amount: 45000, category: 'Sales', note: 'Project Phase 1', invoiceNumber: 'TP-001' },
        { id: 't2', date: '2025-05-02', partyId: '2', type: 'DEBIT', amount: 15000, category: 'Utilities', note: 'Office Maintenance', invoiceNumber: 'TP-002' },
        { id: 't3', date: '2025-05-03', partyId: '3', type: 'CREDIT', amount: 22000, category: 'Consulting', note: 'Q2 Strategy', invoiceNumber: 'TP-003' },
        { id: 't4', date: '2025-05-04', partyId: '4', type: 'DEBIT', amount: 5000, category: 'Logistics', note: 'Delivery Charges', invoiceNumber: 'TP-004' },
        { id: 't5', date: '2025-05-05', partyId: '5', type: 'CREDIT', amount: 12000, category: 'Retail', note: 'Counter Sale', invoiceNumber: 'TP-005' },
        { id: 't6', date: '2025-05-06', partyId: '1', type: 'DEBIT', amount: 3500, category: 'Hardware', note: 'New Router', invoiceNumber: 'TP-006' },
        { id: 't7', date: '2025-05-07', partyId: '2', type: 'CREDIT', amount: 9000, category: 'Maintenance', note: 'Service Fee', invoiceNumber: 'TP-007' }
      ];

      const initialStockHistory: StockHistory[] = [
        { id: 's1', productId: '1', date: '2025-05-10', type: 'IN', quantity: 10, note: 'Vendor Delivery' },
        { id: 's2', productId: '2', date: '2025-05-11', type: 'OUT', quantity: 2, note: 'Office Setup' },
        { id: 's3', productId: '3', date: '2025-05-12', type: 'IN', quantity: 5, note: 'Return Stock' }
      ];

      setParties(mockParties);
      setProducts(mockProducts);
      setTransactions(initialTransactions);
      setStockHistory(initialStockHistory);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tallypro_data_v11', JSON.stringify({ transactions, parties, products, stockHistory, notifications, user }));
  }, [transactions, parties, products, stockHistory, notifications, user]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering || (loginForm.username === 'admin' && loginForm.password === 'admin123')) {
      if (isRegistering) {
        setUser({ ...user, name: loginForm.username, businessName: loginForm.businessName || 'Business' });
      }
      setIsLoggedIn(true);
      addNotification('Session Started', `Welcome back to TallyPro!`, 'success');
    } else {
      addNotification('Login Error', 'Invalid credentials.', 'error');
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockEntry === user.lockValue) {
      setIsAppUnlocked(true);
      setLockEntry('');
    } else {
      addNotification('Locked', 'Incorrect Security Code', 'error');
      setLockEntry('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAppUnlocked(false);
    addNotification('Logged Out', 'Safely disconnected.', 'info');
  };

  const addNotification = (title: string, message: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    if (transaction.partyId) {
      setParties(prevParties => prevParties.map(party => {
        if (party.id === transaction.partyId) {
          const balanceChange = transaction.type === 'CREDIT' ? transaction.amount : -transaction.amount;
          return { ...party, balance: (party.balance || 0) + balanceChange };
        }
        return party;
      }));
    }
  };

  const handleProfileSave = () => {
    setIsSavingProfile(true);
    // Simulate API delay
    setTimeout(() => {
      setIsSavingProfile(false);
      addNotification('Changes Saved', 'Your profile details have been updated successfully.', 'success');
    }, 800);
  };

  const tableTextClass = theme === 'dark' ? 'text-white' : 'text-gray-900';

  if (user.lockType !== 'NONE' && !isAppUnlocked) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-[#0a0a0f]' : 'bg-gray-100'}`}>
        <div className={`w-full max-w-sm p-12 rounded-[4rem] shadow-2xl border ${theme === 'dark' ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-100'}`}>
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/40 mb-6">
              <Lock size={40} className="text-white" />
            </div>
            <h2 className={`text-3xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>TallyPro Locked</h2>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Enter Security Key</p>
          </div>
          <form onSubmit={handleUnlock} className="space-y-6">
            <input 
              type="password"
              placeholder={user.lockType === 'PIN' ? '••••' : 'Password'}
              className={`w-full p-6 rounded-3xl border text-center text-3xl font-black outline-none transition-all ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`}
              value={lockEntry}
              onChange={e => setLockEntry(e.target.value)}
              autoFocus
            />
            <button type="submit" className="w-full py-6 bg-blue-600 text-white font-black text-xl rounded-[2.5rem] shadow-2xl transition-all active:scale-95">UNLOCK</button>
          </form>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
        <div className={`w-full max-w-md p-10 md:p-12 rounded-[4rem] shadow-2xl border ${theme === 'dark' ? 'bg-[#1e293b] border-gray-800' : 'bg-white border-gray-100'}`}>
          <div className="flex flex-col items-center">
            <div className="mb-10 transform -rotate-2 hover:rotate-0 transition-transform">
              <Logo />
            </div>
            <h1 className={`text-3xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{isRegistering ? 'Sign In' : 'Login'}</h1>
            <form className="w-full space-y-6" onSubmit={handleLogin}>
              <input 
                type="text" 
                placeholder="Username" 
                className={`w-full p-5 rounded-3xl border outline-none ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} 
                value={loginForm.username}
                onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                required
              />
              {isRegistering && (
                <input 
                  type="text" 
                  placeholder="Business Name" 
                  className={`w-full p-5 rounded-3xl border outline-none ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} 
                value={loginForm.businessName}
                onChange={e => setLoginForm({...loginForm, businessName: e.target.value})}
                required
              />
              )}
              <input 
                type="password" 
                placeholder="Password" 
                className={`w-full p-5 rounded-3xl border outline-none ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} 
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                required
              />
              <button type="submit" className="w-full py-6 bg-blue-600 text-white font-black text-xl rounded-[2.5rem] shadow-2xl uppercase">{isRegistering ? 'Register' : 'Login'}</button>
            </form>
            <div className="mt-8 flex flex-col md:flex-row justify-between w-full px-2 gap-4">
              <button onClick={() => setIsForgotPassword(true)} className="text-xs text-blue-500 font-bold hover:underline">Lost Access?</button>
              <button onClick={() => setIsRegistering(!isRegistering)} className="text-xs text-gray-500 font-bold hover:underline">
                {isRegistering ? 'Already have an account? Login' : 'Need an account? Sign In'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'bg-[#0a0a0f] text-gray-300' : 'bg-[#f8fafc] text-gray-700'}`}>
      <Sidebar currentView={currentView} onViewChange={setCurrentView} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} onLogout={handleLogout} theme={theme} />
      <main className="flex-1 flex flex-col min-w-0">
        <Header currentView={currentView} onMenuClick={() => setIsMobileMenuOpen(true)} onViewChange={setCurrentView} theme={theme} toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} notifications={notifications} clearNotifications={() => setNotifications([])} user={user} />
        <div className="flex-1 p-4 lg:p-10 overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-10">
            {currentView === ViewState.DASHBOARD && <Dashboard transactions={transactions} products={products} parties={parties} theme={theme} onViewAll={() => setCurrentView(ViewState.DAYBOOK)} />}
            {currentView === ViewState.LEDGER && <Ledger parties={parties} transactions={transactions} onAddParty={p => setParties([...parties, {...p, id: Date.now().toString()}])} onUpdateParty={p => setParties(parties.map(it => it.id === p.id ? p : it))} onDeleteParty={id => setParties(parties.filter(it => it.id !== id))} theme={theme} />}
            {currentView === ViewState.DAYBOOK && <Daybook transactions={transactions} parties={parties} theme={theme} />}
            {currentView === ViewState.STOCK && <Stock products={products} onAddProduct={p => {
               const newP = {...p, id: Date.now().toString()};
               setProducts([...products, newP]);
               setStockHistory([{id: Date.now().toString(), productId: newP.id, date: new Date().toISOString().split('T')[0], type: 'IN', quantity: newP.quantity, note: 'Opening Stock Entry'}, ...stockHistory]);
               addNotification('Stock Updated', `New product ${newP.name} added.`, 'success');
            }} theme={theme} />}
            {currentView === ViewState.BILLING && <Billing parties={parties} onAddTransaction={(t) => {
              const txId = Date.now().toString();
              const invNum = `INV-${txId.slice(-6)}`;
              const transaction: Transaction = {
                ...t,
                id: txId,
                invoiceNumber: invNum
              };
              addTransaction(transaction);
              addNotification('Bill Generated', `Invoice ${invNum} saved.`, 'success');
            }} theme={theme} />}
            
            {currentView === ViewState.BILL_HISTORY && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h2 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Invoice Archives</h2>
                  <div className="flex space-x-3 w-full md:w-auto">
                    <button onClick={() => downloadAsCSV(transactions, 'bill_history')} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold flex flex-1 md:flex-none items-center justify-center space-x-2 shadow-lg transition-all active:scale-95">
                      <Download size={18} />
                      <span>EXPORT CSV</span>
                    </button>
                  </div>
                </div>
                <div className={`${theme === 'dark' ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-200'} rounded-[2rem] border shadow-sm overflow-hidden`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} text-xs md:text-sm font-bold text-gray-500`}>
                          <th className="px-6 py-6 whitespace-nowrap">Invoice</th>
                          <th className="px-6 py-6 whitespace-nowrap">Date</th>
                          <th className="px-6 py-6 whitespace-nowrap">Party</th>
                          <th className="px-6 py-6 whitespace-nowrap text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-500/10">
                        {transactions.map(tx => (
                          <tr key={tx.id} className={`${theme === 'dark' ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'} transition-colors`}>
                            <td className="px-6 py-6 font-bold text-blue-500 whitespace-nowrap">{tx.invoiceNumber}</td>
                            <td className={`px-6 py-6 text-sm whitespace-nowrap ${tableTextClass}`}>{tx.date}</td>
                            <td className={`px-6 py-6 whitespace-nowrap ${tableTextClass}`}>{parties.find(p => p.id === tx.partyId)?.name || 'Walk-in'}</td>
                            <td className={`px-6 py-6 font-black text-right whitespace-nowrap ${tx.type === 'CREDIT' ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(tx.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {currentView === ViewState.STOCK_HISTORY && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h2 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Inventory Logs</h2>
                  <button onClick={() => downloadAsCSV(stockHistory, 'inventory_logs')} className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-95">
                    <Download size={18} />
                    <span>EXPORT CSV</span>
                  </button>
                </div>
                <div className={`${theme === 'dark' ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-200'} rounded-[2rem] border shadow-sm overflow-hidden`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} text-xs font-bold text-gray-500`}>
                          <th className="px-6 py-6">Date</th>
                          <th className="px-6 py-6">Product</th>
                          <th className="px-6 py-6">Flow</th>
                          <th className="px-6 py-6 text-right">Qty</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-500/10">
                        {stockHistory.map(h => (
                          <tr key={h.id} className={`${theme === 'dark' ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'}`}>
                            <td className={`px-6 py-6 text-sm ${tableTextClass}`}>{h.date}</td>
                            <td className={`px-6 py-6 font-bold ${tableTextClass}`}>{products.find(p => p.id === h.productId)?.name || 'Item'}</td>
                            <td className="px-6 py-6">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black ${h.type === 'IN' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>STOCK {h.type}</span>
                            </td>
                            <td className={`px-6 py-6 font-black text-right ${tableTextClass}`}>{h.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {currentView === ViewState.REPORTS && <Reports transactions={transactions} parties={parties} products={products} theme={theme} />}

            {currentView === ViewState.PROFILE && (
              <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-500 pb-20">
                <div className={`${theme === 'dark' ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-200'} p-8 md:p-12 rounded-[3rem] border flex flex-col md:flex-row items-center gap-12 shadow-xl`}>
                  <div className="relative group">
                    <img src={user.photoUrl} className="w-40 h-40 md:w-48 rounded-[3rem] object-cover ring-8 ring-blue-500/10 transition-transform cursor-pointer" />
                    <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center border-4 border-[#1e1e2d] cursor-pointer shadow-xl">
                      <Edit2 size={20} />
                      <input type="file" className="hidden" />
                    </label>
                  </div>
                  <div className="flex-1 w-full space-y-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Profile Name</label>
                      <input className={`w-full p-5 rounded-3xl border outline-none font-bold ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-100 text-gray-900'}`} value={user.name} onChange={e => setUser({...user, name: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Business Name</label>
                      <input className={`w-full p-5 rounded-3xl border outline-none font-bold ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-100 text-gray-900'}`} value={user.businessName} onChange={e => setUser({...user, businessName: e.target.value})} />
                    </div>
                    <button 
                      onClick={handleProfileSave} 
                      disabled={isSavingProfile}
                      className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black shadow-xl flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-70"
                    >
                      {isSavingProfile ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>SAVING...</span>
                        </>
                      ) : (
                        <span>SAVE CHANGES</span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className={`${theme === 'dark' ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-200'} p-8 md:p-10 rounded-[3rem] border shadow-sm`}>
                    <div className="flex items-center space-x-3 mb-8 text-blue-500">
                      <KeyRound size={24} />
                      <h4 className="text-xl font-black">Security Pin</h4>
                    </div>
                    <div className="space-y-6">
                       <select 
                        className={`w-full p-5 rounded-3xl border outline-none font-black ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-100'}`} 
                        value={user.lockType} 
                        onChange={e => setUser({...user, lockType: e.target.value as any})}
                       >
                        <option value="NONE">No Lock</option>
                        <option value="PIN">4-Digit PIN</option>
                        <option value="PASSWORD">Password</option>
                      </select>
                      {user.lockType !== 'NONE' && (
                        <div className="flex items-center space-x-2 text-[10px] font-black text-green-500 uppercase">
                          <CheckCircle2 size={14} /> <span>Lock Active</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`${theme === 'dark' ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-200'} p-8 md:p-10 rounded-[3rem] border shadow-sm`}>
                    <div className="flex items-center space-x-3 mb-8 text-amber-500">
                      <CreditCard size={24} />
                      <h4 className="text-xl font-black">Account Tier</h4>
                    </div>
                    <div className="space-y-6">
                       <div className="p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-[2rem] shadow-xl">
                          <p className="text-[10px] font-black uppercase opacity-60">Status</p>
                          <h5 className="text-2xl font-black">{user.subscription} Plan</h5>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
