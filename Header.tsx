
import React, { useState } from 'react';
import { Bell, Search, Menu, Sun, Moon, User } from 'lucide-react';
import { ViewState, Notification, UserProfile } from '../types';

interface HeaderProps {
  currentView: ViewState;
  onMenuClick: () => void;
  onViewChange: (view: ViewState) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  notifications: Notification[];
  clearNotifications: () => void;
  user: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onMenuClick, 
  onViewChange,
  theme, 
  toggleTheme,
  notifications,
  clearNotifications,
  user
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const isDark = theme === 'dark';

  return (
    <header className={`${isDark ? 'bg-[#1e1e2d] border-b border-gray-800' : 'bg-white border-b border-gray-200'} h-16 sticky top-0 z-30 transition-colors duration-200`}>
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        <div className="flex items-center space-x-4">
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <Menu className={isDark ? 'text-gray-300' : 'text-gray-600'} />
          </button>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} capitalize`}>
            {currentView.toLowerCase()}
          </h2>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${isDark ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`p-2 rounded-full transition-colors relative ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Panel */}
            {isNotifOpen && (
              <div className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl border ${isDark ? 'bg-[#1e1e2d] border-gray-800' : 'bg-white border-gray-100'} overflow-hidden z-50`}>
                <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                  <button onClick={clearNotifications} className="text-xs text-blue-500 hover:underline">Clear all</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No notifications</div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className={`p-4 border-b last:border-0 ${isDark ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-50 hover:bg-gray-50'} cursor-pointer`}>
                        <p className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                        <p className="text-[10px] text-gray-600 mt-2">{notif.timestamp}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Quick Access */}
          <div 
            onClick={() => onViewChange(ViewState.PROFILE)}
            className={`flex items-center space-x-3 pl-2 cursor-pointer rounded-xl p-1 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <div className="hidden md:block text-right">
              <p className={`text-xs font-bold leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
              <p className="text-[10px] text-gray-500 leading-none mt-1">{user.businessName}</p>
            </div>
            {user.photoUrl ? (
              <img src={user.photoUrl} alt="User" className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
