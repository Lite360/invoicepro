import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileCheck,
  Receipt,
  FileText,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { Company, User } from '../types';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  company: Company | null;
  user: User | null;
  onLogout: () => void;
}

const navItems = [
  { id: 'dashboard',   label: 'Dashboard',         icon: LayoutDashboard },
  { id: 'invoices',    label: 'Invoices',           icon: FileSpreadsheet },
  { id: 'quotations',  label: 'Quotations',         icon: FileCheck },
  { id: 'receipts',    label: 'Receipts',           icon: Receipt },
  { id: 'letters',     label: 'Letters',            icon: FileText },
  { id: 'history',     label: 'Document History',   icon: History },
  { id: 'settings',    label: 'Company Settings',   icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  company,
  user,
  onLogout,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const handleNav = (id: string) => {
    setCurrentView(id);
    setMobileOpen(false);
  };

  const SidebarContent = (
    <div className="flex flex-col h-full">
      {/* ── Logo ─────────────────────────────────────── */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-800 ${collapsed ? 'justify-center' : ''}`}>
        {company?.logoUrl ? (
          <img
            src={company.logoUrl}
            alt="Logo"
            className="w-8 h-8 object-contain rounded-lg bg-white/10 p-0.5 flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-xl bg-[#CAFF33] flex items-center justify-center font-black text-black text-xs flex-shrink-0">
            IP
          </div>
        )}
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-bold text-sm text-white truncate leading-tight">
              {company?.companyName || 'InvoicePro'}
            </p>
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#CAFF33]/70">Pro Plan</span>
          </div>
        )}
      </div>

      {/* ── Nav Items ────────────────────────────────── */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = currentView === id;
          return (
            <button
              key={id}
              id={`sidebar-nav-${id}`}
              onClick={() => handleNav(id)}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-[#CAFF33] text-black shadow-md shadow-[#CAFF33]/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-black' : ''}`} />
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* ── User Footer ──────────────────────────────── */}
      <div className="border-t border-slate-800 p-3 space-y-1">
        {/* User info */}
        <div className={`flex items-center gap-3 px-2 py-2 rounded-xl ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {initials}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          id="sidebar-logout-btn"
          onClick={onLogout}
          title={collapsed ? 'Sign out' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile overlay ───────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile toggle button ─────────────────────── */}
      <button
        id="sidebar-mobile-toggle"
        className="fixed top-4 left-4 z-50 lg:hidden bg-slate-900 border border-slate-700 text-white p-2 rounded-xl shadow-lg"
        onClick={() => setMobileOpen(v => !v)}
      >
        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* ── Mobile Sidebar (overlay) ─────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:hidden no-print ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {SidebarContent}
      </aside>

      {/* ── Desktop Sidebar (fixed) ──────────────────── */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out no-print ${
          collapsed ? 'w-[68px]' : 'w-60'
        }`}
      >
        {SidebarContent}

        {/* Collapse toggle */}
        <button
          id="sidebar-collapse-btn"
          onClick={() => setCollapsed(v => !v)}
          className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all shadow-md"
        >
          {collapsed
            ? <ChevronRight className="w-3 h-3" />
            : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* ── Spacer so main content doesn't hide behind sidebar ── */}
      <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-60'}`} />
    </>
  );
};

export default Sidebar;
