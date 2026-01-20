
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Package, 
  FileText, 
  BarChart3, 
  UserCircle, 
  Settings,
  PlusCircle,
  Download,
  Bell,
  Search,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Trash2,
  Edit2,
  ChevronRight,
  Calendar,
  Eye,
  Printer,
  History,
  FileSearch,
  Lock,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

export const COLORS = {
  dark: '#0f172a',
  charcoal: '#1e293b',
  income: '#10b981',
  expense: '#f43f5e',
  primary: '#2563eb',
  white: '#ffffff',
  gray: '#94a3b8'
};

export const MENU_ITEMS = [
  { id: 'DASHBOARD', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'LEDGER', label: 'Ledger', icon: <Users size={20} /> },
  { id: 'DAYBOOK', label: 'Daybook', icon: <BookOpen size={20} /> },
  { id: 'STOCK', label: 'Stock', icon: <Package size={20} /> },
  { id: 'BILLING', label: 'New Bill', icon: <PlusCircle size={20} /> },
  { id: 'BILL_HISTORY', label: 'Bill History', icon: <FileSearch size={20} /> },
  { id: 'STOCK_HISTORY', label: 'Stock History', icon: <History size={20} /> },
  { id: 'REPORTS', label: 'Reports', icon: <BarChart3 size={20} /> },
];

export const Logo = () => (
  <div className="flex items-center space-x-4 group">
    <div className="relative">
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 rounded-[1.5rem] blur-md opacity-40 group-hover:opacity-100 transition duration-1000"></div>
      <div className="relative w-14 h-14 bg-gradient-to-tr from-blue-700 to-indigo-600 rounded-[1.2rem] flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-transform border border-white/20">
        <span className="text-white font-black text-3xl italic tracking-tighter drop-shadow-lg">TP</span>
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 leading-none">TallyPro</span>
      <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50 mt-1">Enterprise Edition v6</span>
    </div>
  </div>
);

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const downloadAsCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj => Object.values(obj).map(v => String(v).replace(/,/g, '')).join(',')).join('\n');
  const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const handlePrint = () => {
  window.print();
};

export const downloadPDF = (title: string) => {
  // window.print() is the most universal way to generate a real PDF without a heavy library or server
  window.print();
};
