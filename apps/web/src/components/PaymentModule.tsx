import React, { useState } from 'react';
import { CreditCard, Search, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2 } from 'lucide-react';
import { Company } from '../types';

interface PaymentModuleProps {
  company: Company | null;
}

export const PaymentModule: React.FC<PaymentModuleProps> = ({ company }) => {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const payments = [
    { id: '1', invoiceId: 'INV-2026-001', customer: 'Acme Corp', amount: 4500, status: 'paid', date: 'Aug 24, 2026' },
    { id: '2', invoiceId: 'INV-2026-002', customer: 'Globex Inc', amount: 2100, status: 'pending', date: 'Aug 25, 2026', dueDate: 'Sep 01, 2026' },
    { id: '3', invoiceId: 'INV-2026-003', customer: 'Initech', amount: 1850, status: 'paid', date: 'Aug 27, 2026' },
    { id: '4', invoiceId: 'INV-2026-004', customer: 'Stark Industries', amount: 6200, status: 'pending', date: 'Aug 28, 2026', dueDate: 'Sep 05, 2026' },
  ];

  const filteredPayments = filter === 'all' ? payments : payments.filter(p => p.status === filter);
  
  const totalReceived = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-600" />
            Payments
          </h1>
          <p className="text-slate-500 text-sm mt-1">Track received and pending payments</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-green-50 rounded-xl">
            <ArrowDownRight className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Received</p>
            <h2 className="text-3xl font-extrabold text-slate-900">{company?.currency || '$'}{totalReceived.toLocaleString()}</h2>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-amber-50 rounded-xl">
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Pending Payments</p>
            <h2 className="text-3xl font-extrabold text-slate-900">{company?.currency || '$'}{totalPending.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button onClick={() => setFilter('all')} className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-semibold rounded-lg transition ${filter === 'all' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>All</button>
            <button onClick={() => setFilter('paid')} className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-semibold rounded-lg transition ${filter === 'paid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Paid</button>
            <button onClick={() => setFilter('pending')} className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-semibold rounded-lg transition ${filter === 'pending' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Pending</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase text-slate-400 font-semibold bg-slate-50/50">
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition group cursor-pointer">
                  <td className="p-4 font-bold text-slate-900">{p.invoiceId}</td>
                  <td className="p-4 text-slate-700 font-medium">{p.customer}</td>
                  <td className="p-4 font-bold text-slate-900">{company?.currency || '$'}{p.amount.toLocaleString()}</td>
                  <td className="p-4">
                    {p.status === 'paid' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-500">
                    {p.status === 'paid' ? p.date : `Due: ${p.dueDate}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
