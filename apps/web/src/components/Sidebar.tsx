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
  Users,
  CreditCard,
  BadgeCheck,
  Shield,
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
  { id: 'customers',   label: 'Customers',          icon: Users },
  { id: 'payments',    label: 'Payments',           icon: CreditCard },
  { id: 'history',     label: 'Document History',   icon: History },
  { id: 'subscription',label: 'Subscription',       icon: BadgeCheck },
  { id: 'settings',    label: 'Company Settings',   icon: Settings },
];

const getNavItems = (user: User | null) => {
  if (user?.role === 'ADMIN') {
    return [...navItems, { id: 'admin', label: 'Admin Panel', icon: Shield }];
  }
  return navItems;
};

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
            className="w-8 h-8 object-contain rounded-lg bg-slate-800 p-0.5 flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-xl bg-[#0F9D58] flex items-center justify-center font-black text-white text-xs flex-shrink-0">
            IH
          </div>
        )}
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-bold text-sm text-white truncate leading-tight">
              InvoiceHub
            </p>
            <span className="text-[10px] text-slate-400">Create. Send. Get Paid.</span>
          </div>
        )}
      </div>

      {/* ── Nav Items ────────────────────────────────── */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {getNavItems(user).map(({ id, label, icon: Icon }) => {
          const isActive = currentView === id;
          return (
            <button
              key={id}
              id={`sidebar-nav-${id}`}
              onClick={() => handleNav(id)}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-[#0F9D58] text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* ── User Footer ──────────────────────────────── */}
      <div className="border-t border-slate-800 p-3 space-y-1">
        {/* Logout */}
        <button
          id="sidebar-logout-btn"
          onClick={onLogout}
          title={collapsed ? 'Sign out' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0 text-[#E77F67]" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile overlay ───────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
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
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#111827] border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:hidden no-print ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {SidebarContent}
      </aside>

      {/* ── Desktop Sidebar (fixed) ──────────────────── */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-[#111827] border-r border-slate-800 transition-all duration-300 ease-in-out no-print ${
          collapsed ? 'w-[72px]' : 'w-64'
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
      <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-64'}`} />
    </>
  );
};

export default Sidebar;
