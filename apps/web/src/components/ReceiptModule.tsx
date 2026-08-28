import React, { useState, useEffect } from 'react';
import { Receipt, Eye, Save, DollarSign } from 'lucide-react';
import { Company, Receipt as ReceiptType } from '../types';

interface ReceiptModuleProps {
  company: Company | null;
  onPreview: (type: 'Receipt', data: ReceiptType) => void;
}

export const ReceiptModule: React.FC<ReceiptModuleProps> = ({ company, onPreview }) => {
  const [formData, setFormData] = useState<ReceiptType>({
    number: '',
    customerName: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Transfer',
    amountPaid: 1500,
    balance: 0,
    referenceNumber: 'TXN-984720',
    notes: 'Full payment received with thanks.',
    status: 'Paid',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNumber();
  }, []);

  const fetchNumber = async () => {
    try {
      const res = await fetch('/api/number-gen/receipt');
      const data = await res.json();
      if (data.number) {
        setFormData((prev) => ({ ...prev, number: data.number }));
      }
    } catch (e) {
      console.error('Error fetching receipt number', e);
    }
  };

  const handleSave = async (status: string = 'Paid') => {
    setLoading(true);
    try {
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status }),
      });
      const data = await res.json();
      if (data.id) {
        onPreview('Receipt', data);
      }
    } catch (e) {
      console.error('Error saving receipt', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Issue Payment Receipt</h1>
              <p className="text-xs text-slate-500">Official proof of payment with company letterhead</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => handleSave('Draft')}
              className="flex-1 md:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition text-center"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => onPreview('Receipt', formData)}
              className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl transition"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave('Issued')}
              className="w-full md:w-auto flex items-center justify-center space-x-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Issue Receipt'}</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Receipt Number</label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Customer / Received From *</label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="Acme Corp / Jane Smith"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Payment Date</label>
            <input
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900"
            >
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Credit / Debit Card">Credit / Debit Card</option>
              <option value="Check">Check</option>
              <option value="Mobile Money">Mobile Money</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Amount Paid ({company?.currency || '$'}) *</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.amountPaid}
              onChange={(e) => setFormData({ ...formData, amountPaid: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Remaining Balance ({company?.currency || '$'})</label>
            <input
              type="number"
              step="0.01"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Reference / Transaction Number</label>
            <input
              type="text"
              value={formData.referenceNumber || ''}
              onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
              placeholder="e.g. Wire Ref # 94820194"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Notes / Description</label>
            <textarea
              rows={3}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Payment received for Invoice # INV-2026-000001"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
