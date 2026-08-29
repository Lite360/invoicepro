import React from 'react';
import { Wrench, Clock, RefreshCw } from 'lucide-react';

interface Props {
  onRefresh?: () => void;
}

export const MaintenanceScreen: React.FC<Props> = ({ onRefresh }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-50 px-4"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#0F9D58]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#0F9D58]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-lg w-full">
        {/* Animated icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-[#0F9D58]/10 rounded-3xl flex items-center justify-center">
              <Wrench className="w-12 h-12 text-[#0F9D58] animate-bounce" style={{ animationDuration: '2s' }} />
            </div>
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-white" />
            </span>
          </div>
        </div>

        {/* Branding */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-7 h-7 bg-[#0F9D58] rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">IP</span>
          </div>
          <span className="text-slate-500 font-semibold text-sm tracking-wide">InvoicePro</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
          We'll be right back
        </h1>
        <p className="text-slate-500 text-base leading-relaxed mb-8">
          InvoicePro is currently undergoing scheduled maintenance to bring you
          a better experience. Please check back shortly.
        </p>

        {/* Status bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-sm text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Platform Status</span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              Maintenance
            </span>
          </div>
          <div className="h-px bg-slate-100" />
          <p className="text-xs text-slate-500">
            Our team is working hard to get everything back online. Thank you for your patience.
          </p>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh || (() => window.location.reload())}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F9D58] hover:bg-[#0B7A44] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#0F9D58]/20 group"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          Check Again
        </button>

        <p className="text-xs text-slate-400 mt-6">
          For urgent inquiries, contact{' '}
          <a href="mailto:support@invoicespro.com" className="text-[#0F9D58] hover:underline">
            support@invoicespro.com
          </a>
        </p>
      </div>
    </div>
  );
};
