
import React from 'react';
import { MENU_ITEMS, COLORS } from '../constants';
import { ViewState } from '../types';
import { LogOut, X } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen,
  onLogout,
  theme
}) => {
  const isDark = theme === 'dark';
  
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0 lg:static lg:inset-0
    ${isDark ? 'bg-[#1e1e2d] text-gray-300 border-r border-gray-800' : 'bg-white text-gray-700 border-r border-gray-200'}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800/50 lg:border-none">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>TallyPro</span>
            </div>
            <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id as ViewState);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${currentView === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }
                `}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Settings & Logout */}
          <div className="p-4 border-t border-gray-800/50">
             <button
              onClick={() => onViewChange(ViewState.PROFILE)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200
                ${currentView === ViewState.PROFILE 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }
              `}
            >
              <span className="font-medium">My Profile</span>
            </button>
            <button
              onClick={onLogout}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 ${isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
