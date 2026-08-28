import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileCheck,
  Receipt,
  FileText,
  History,
  Settings,
  Plus,
  LogOut,
  ChevronDown,
  User as UserIcon,
} from 'lucide-react';
import { Company, User } from '../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  company: Company | null;
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, company, user, onLogout }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoices', label: 'Invoices', icon: FileSpreadsheet },
    { id: 'quotations', label: 'Quotations', icon: FileCheck },
    { id: 'receipts', label: 'Receipts', icon: Receipt },
    { id: 'letters', label: 'Letters', icon: FileText },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Company Settings', icon: Settings },
  ];

  // Initials avatar
  const initials = user
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg border-b border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo & Name */}
          <div
            className="flex items-center space-x-2 md:space-x-3 cursor-pointer group min-w-0"
            onClick={() => setCurrentView('dashboard')}
          >
            {company?.logoUrl ? (
              <img
                src={company.logoUrl}
                alt="Logo"
                className="w-8 h-8 md:w-9 md:h-9 object-contain rounded-lg bg-white/10 p-1 flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md flex-shrink-0">
                IP
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center min-w-0">
              <span className="font-bold text-base md:text-lg tracking-tight group-hover:text-blue-400 transition truncate">
                {company?.companyName || 'InvoicePro'}
              </span>
              <span className="hidden sm:inline-block sm:ml-2 px-2 py-0.5 text-[9px] md:text-[10px] uppercase font-bold tracking-widest bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30 flex-shrink-0">
                Pro
              </span>
            </div>
          </div>

          {/* Main Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right side: New Doc + User Menu */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              id="navbar-new-doc-btn"
              onClick={() => setCurrentView('invoices')}
              className="flex items-center space-x-1.5 px-3 py-1.5 md:px-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-semibold rounded-lg shadow-md shadow-blue-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Document</span>
            </button>

            {/* User Avatar Dropdown */}
            {user && (
              <div className="relative">
                <button
                  id="navbar-user-menu-btn"
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-800 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow">
                    {initials}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      {/* Menu items */}
                      <div className="p-1">
                        <button
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                          onClick={() => { setCurrentView('settings'); setUserMenuOpen(false); }}
                        >
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          Company Settings
                        </button>
                        <button
                          id="navbar-logout-btn"
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          onClick={() => { setUserMenuOpen(false); onLogout(); }}
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
