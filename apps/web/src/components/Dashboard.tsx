import React, { useEffect, useState } from 'react';
import {
  FileSpreadsheet,
  FileCheck,
  Receipt,
  FileText,
  Plus,
  ArrowRight,
  Settings,
  History,
  Clock,
  TrendingUp,
  Building2,
} from 'lucide-react';
import { Company, DocumentRecord } from '../types';

interface DashboardProps {
  setCurrentView: (view: string) => void;
  company: Company | null;
  onSelectDocumentForPreview: (type: 'Invoice' | 'Quotation' | 'Receipt' | 'Letter', data: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setCurrentView,
  company,
  onSelectDocumentForPreview,
}) => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalQuotations: 0,
    totalReceipts: 0,
    totalLetters: 0,
    recentDocs: [] as DocumentRecord[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error('Failed to fetch dashboard stats', e);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: 'Total Invoices', count: stats.totalInvoices, icon: FileSpreadsheet, color: 'from-blue-600 to-indigo-600', view: 'invoices' },
    { title: 'Total Quotations', count: stats.totalQuotations, icon: FileCheck, color: 'from-purple-600 to-indigo-600', view: 'quotations' },
    { title: 'Total Receipts', count: stats.totalReceipts, icon: Receipt, color: 'from-emerald-600 to-teal-600', view: 'receipts' },
    { title: 'Total Letters', count: stats.totalLetters, icon: FileText, color: 'from-amber-600 to-orange-600', view: 'letters' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">
            <Building2 className="w-4 h-4" />
            <span>{company?.companyName || 'BrandDocs Dashboard'}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Overview & Document Hub</h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Quickly create branded invoices, quotations, receipts, and official letters for your business.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setCurrentView('invoices')}
            className="flex items-center space-x-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
          <button
            onClick={() => setCurrentView('settings')}
            className="flex items-center space-x-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition"
          >
            <Settings className="w-4 h-4" />
            <span>Brand Settings</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => setCurrentView(card.view)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.title}</span>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-slate-900">{card.count}</span>
                <span className="text-xs text-blue-600 font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                  View <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <button
            onClick={() => setCurrentView('invoices')}
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition text-center group flex flex-col items-center justify-center space-y-2"
          >
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Create Invoice</span>
          </button>

          <button
            onClick={() => setCurrentView('quotations')}
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-md transition text-center group flex flex-col items-center justify-center space-y-2"
          >
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
              <FileCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Create Quotation</span>
          </button>

          <button
            onClick={() => setCurrentView('receipts')}
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition text-center group flex flex-col items-center justify-center space-y-2"
          >
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
              <Receipt className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Create Receipt</span>
          </button>

          <button
            onClick={() => setCurrentView('letters')}
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition text-center group flex flex-col items-center justify-center space-y-2"
          >
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Create Letter</span>
          </button>

          <button
            onClick={() => setCurrentView('history')}
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-purple-500 hover:shadow-md transition text-center group flex flex-col items-center justify-center space-y-2"
          >
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
              <History className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Document History</span>
          </button>

          <button
            onClick={() => setCurrentView('settings')}
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-500 hover:shadow-md transition text-center group flex flex-col items-center justify-center space-y-2"
          >
            <div className="p-3 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-slate-800 group-hover:text-white transition">
              <Settings className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Company Settings</span>
          </button>
        </div>
      </div>

      {/* Recent Documents Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-bold text-slate-900">Recent Documents</h2>
          </div>
          <button
            onClick={() => setCurrentView('history')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
          >
            View All History <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        {stats.recentDocs.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl">
            <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">No documents generated yet</p>
            <p className="text-xs text-slate-400 mt-1">Start by creating your first invoice, quotation, or receipt!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase text-slate-400 font-semibold">
                  <th className="pb-3">Doc Number</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 font-semibold text-slate-900">{doc.documentNumber}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-md">
                        {doc.type}
                      </span>
                    </td>
                    <td className="py-3 text-slate-700">{doc.customer}</td>
                    <td className="py-3 font-semibold text-slate-900">
                      {doc.amount > 0 ? `${company?.currency || '$'}${doc.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                    </td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-full">
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-slate-500">{doc.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
