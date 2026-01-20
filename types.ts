
export type TransactionType = 'DEBIT' | 'CREDIT';

export interface Party {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  balance: number;
}

export interface Transaction {
  id: string;
  date: string;
  partyId: string;
  type: TransactionType;
  amount: number;
  note: string;
  category: string;
  billUrl?: string;
  invoiceNumber?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  unit: 'units' | 'kg' | 'liters';
  quantity: number;
  lowStockLevel: number;
  purchasePrice: number;
  salePrice: number;
}

export interface StockHistory {
  id: string;
  productId: string;
  date: string;
  type: 'IN' | 'OUT';
  quantity: number;
  note: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  isRead: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  photoUrl: string;
  businessName: string;
  subscription: 'Free' | 'Pro' | 'Enterprise';
  lockType: 'NONE' | 'PIN' | 'PASSWORD';
  lockValue?: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  LEDGER = 'LEDGER',
  DAYBOOK = 'DAYBOOK',
  STOCK = 'STOCK',
  BILLING = 'BILLING',
  REPORTS = 'REPORTS',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',
  STOCK_HISTORY = 'STOCK_HISTORY',
  BILL_HISTORY = 'BILL_HISTORY'
}
