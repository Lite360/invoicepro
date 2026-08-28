import React from 'react';
import { Plus, Bell, Search } from 'lucide-react';
import { Company, User } from '../types';

interface AppHeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  company: Company | null;
  user: User | null;
}

const VIEW_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard:  { title: 'Dashboard',         subtitle: 'Overview of your business activity' },
  invoices:   { title: 'Invoices',           subtitle: 'Create and manage client invoices' },
  quotations: { title: 'Quotations',         subtitle: 'Send estimates and convert to invoices' },
  receipts:   { title: 'Receipts',           subtitle: 'Acknowledge payments from clients' },
  letters:    { title: 'Business Letters',   subtitle: 'Draft professional correspondence' },
  history:    { title: 'Document History',   subtitle: 'All your generated documents in one place' },
  settings:   { title: 'Company Settings',   subtitle: 'Manage your branding and preferences' },
};

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentView,
  setCurrentView,
  company,
  user,
}) => {
  const { title, subtitle } = VIEW_TITLES[currentView] ?? { title: 'InvoicePro', subtitle: '' };

  const initials = user
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 no-print">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* ── Page title ───────────────────────────────── */}
        {/* Left padding accounts for mobile sidebar toggle button */}
        <div className="pl-10 lg:pl-0">
          <h1 className="text-lg font-bold text-slate-900 leading-tight">{title}</h1>
          <p className="text-xs text-slate-400 hidden sm:block">{subtitle}</p>
        </div>

        {/* ── Right actions ────────────────────────────── */}
        <div className="flex items-center gap-2">
          {/* New document CTA */}
          <button
            id="header-new-doc-btn"
            onClick={() => setCurrentView('invoices')}
            className="flex items-center gap-1.5 bg-[#0F9D58] hover:bg-[#0B7A44] text-white text-xs font-bold px-3 py-2 rounded-lg transition-all hover:shadow-md hover:shadow-[#0F9D58]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Document</span>
          </button>

          {/* Notification bell (placeholder) */}
          <button
            id="header-bell-btn"
            className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {/* Unread dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0F9D58] rounded-full border-2 border-white" />
          </button>

          {/* User avatar */}
          <div
            className="flex items-center gap-2 pl-1 cursor-pointer group"
            onClick={() => setCurrentView('settings')}
            title="Company settings"
          >
            <div className="w-8 h-8 rounded-full bg-[#0F9D58] flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ring-2 ring-transparent group-hover:ring-[#0F9D58]/30 transition-all">
              {initials}
            </div>
            <div className="hidden md:block min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{company?.companyName || 'InvoicePro'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
