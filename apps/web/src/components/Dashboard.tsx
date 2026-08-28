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
import { Company, DocumentRecord, User } from '../types';

interface DashboardProps {
  setCurrentView: (view: string) => void;
  company: Company | null;
  onSelectDocumentForPreview: (type: 'Invoice' | 'Quotation' | 'Receipt' | 'Letter', data: any) => void;
  user: User | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setCurrentView,
  company,
  onSelectDocumentForPreview,
  user,
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
      <div className="bg-[#104332] rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Decorative faint chart graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-64 opacity-20 pointer-events-none flex items-center justify-end pr-8">
          <div className="flex items-end space-x-2 h-24">
            <div className="w-6 bg-white rounded-t-sm h-12"></div>
            <div className="w-6 bg-white rounded-t-sm h-8"></div>
            <div className="w-6 bg-white rounded-t-sm h-16"></div>
            <div className="w-6 bg-white rounded-t-sm h-20"></div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-sm text-green-100 mb-1">
            <span>Good afternoon 👋</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">{user?.name ? user.name.split(' ')[0] : 'there'}!</h1>
          <p className="text-green-50 text-sm">
            Here's an overview of your business activity.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-4 px-1">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="p-3 bg-blue-50/50 rounded-xl">
              <FileSpreadsheet className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.totalInvoices}</div>
              <div className="text-xs text-slate-500">Total Invoices</div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <FileCheck className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">0</div>
              <div className="text-xs text-slate-500">Paid Invoices</div>
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="p-3 bg-amber-50 rounded-xl">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{company?.currency || 'NGN'} 0.00</div>
              <div className="text-xs text-slate-500">Pending Payments</div>
            </div>
          </div>
          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">0</div>
              <div className="text-xs text-slate-500">Total Customers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-4 px-1">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setCurrentView('invoices')}
            className="p-6 bg-[#0F9D58] hover:bg-[#0B7A44] rounded-2xl shadow-sm transition text-center group flex flex-col items-center justify-center space-y-3"
          >
            <FileSpreadsheet className="w-6 h-6 text-white opacity-90" />
            <span className="text-sm font-semibold text-white">New Invoice</span>
          </button>

          <button
            onClick={() => setCurrentView('quotations')}
            className="p-6 bg-[#0F9D58] hover:bg-[#0B7A44] rounded-2xl shadow-sm transition text-center group flex flex-col items-center justify-center space-y-3"
          >
            <FileCheck className="w-6 h-6 text-white opacity-90" />
            <span className="text-sm font-semibold text-white">New Quotation</span>
          </button>

          <button
            onClick={() => setCurrentView('receipts')}
            className="p-6 bg-[#0F9D58] hover:bg-[#0B7A44] rounded-2xl shadow-sm transition text-center group flex flex-col items-center justify-center space-y-3"
          >
            <Receipt className="w-6 h-6 text-white opacity-90" />
            <span className="text-sm font-semibold text-white">New Receipt</span>
          </button>

          <button
            className="p-6 bg-[#E77F67] hover:bg-[#D56A50] rounded-2xl shadow-sm transition text-center group flex flex-col items-center justify-center space-y-3"
          >
            <Building2 className="w-6 h-6 text-white opacity-90" />
            <span className="text-sm font-semibold text-white">Add Customer</span>
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
