import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Printer, Download, Save, Eye, FileSpreadsheet } from 'lucide-react';
import { Company, Invoice, LineItem } from '../types';

interface InvoiceModuleProps {
  company: Company | null;
  onPreview: (type: 'Invoice', data: Invoice) => void;
}

export const InvoiceModule: React.FC<InvoiceModuleProps> = ({ company, onPreview }) => {
  const [formData, setFormData] = useState<Invoice>({
    number: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    projectTitle: '',
    items: [{ description: 'Web Application Development', quantity: 1, unitPrice: 1500, amount: 1500 }],
    subtotal: 1500,
    discountPercent: 0,
    discountAmount: 0,
    vatPercent: 0,
    vatAmount: 0,
    grandTotal: 1500,
    notes: 'Thank you for your business. Please make payment by the due date.',
    paymentInstructions: `Bank: ${company?.bankName || ''} | Acc: ${company?.accountNumber || ''} (${company?.accountName || ''})`,
    status: 'Issued',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNumber();
  }, []);

  const fetchNumber = async () => {
    try {
      const res = await fetch('/api/number-gen/invoice');
      const data = await res.json();
      if (data.number) {
        setFormData((prev) => ({ ...prev, number: data.number }));
      }
    } catch (e) {
      console.error('Error fetching invoice number', e);
    }
  };

  const handleItemChange = (index: number, field: keyof LineItem, value: any) => {
    const newItems = [...formData.items];
    const item = { ...newItems[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      item.amount = Number(item.quantity || 0) * Number(item.unitPrice || 0);
    }
    newItems[index] = item;
    recalculateTotals(newItems, formData.discountPercent, formData.vatPercent);
  };

  const addItem = () => {
    const newItems = [...formData.items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }];
    recalculateTotals(newItems, formData.discountPercent, formData.vatPercent);
  };

  const removeItem = (index: number) => {
    if (formData.items.length === 1) return;
    const newItems = formData.items.filter((_, i) => i !== index);
    recalculateTotals(newItems, formData.discountPercent, formData.vatPercent);
  };

  const recalculateTotals = (items: LineItem[], discountP: number, vatP: number) => {
    const sub = items.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
    const discAmt = (sub * (Number(discountP) || 0)) / 100;
    const afterDisc = sub - discAmt;
    const vatAmt = (afterDisc * (Number(vatP) || 0)) / 100;
    const grand = afterDisc + vatAmt;

    setFormData((prev) => ({
      ...prev,
      items,
      subtotal: sub,
      discountPercent: discountP,
      discountAmount: discAmt,
      vatPercent: vatP,
      vatAmount: vatAmt,
      grandTotal: grand,
    }));
  };

  const handleSave = async (status: string = 'Issued') => {
    setLoading(true);
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status }),
      });
      const data = await res.json();
      if (data.id) {
        onPreview('Invoice', data);
      }
    } catch (e) {
      console.error('Error saving invoice', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Create Invoice</h1>
              <p className="text-xs text-slate-500">Auto-formatted with company letterhead</p>
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
              onClick={() => onPreview('Invoice', formData)}
              className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl transition"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave('Issued')}
              className="w-full md:w-auto flex items-center justify-center space-x-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 transition"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Issue & Generate PDF'}</span>
            </button>
          </div>
        </div>

        {/* Meta info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Invoice Number</label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Invoice Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Project Title</label>
            <input
              type="text"
              value={formData.projectTitle || ''}
              onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
              placeholder="e.g. Website Redesign"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800"
            />
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Customer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Customer Name *</label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Acme Corp / John Doe"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Customer Email</label>
              <input
                type="email"
                value={formData.customerEmail || ''}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                placeholder="client@acme.com"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Customer Phone</label>
              <input
                type="text"
                value={formData.customerPhone || ''}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                placeholder="+1 (555) 234-5678"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Customer Address</label>
              <input
                type="text"
                value={formData.customerAddress || ''}
                onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                placeholder="456 Market St, San Francisco, CA"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Line Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3 w-12 text-center">#</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 w-24 text-center">Qty</th>
                  <th className="p-3 w-36 text-right">Unit Price</th>
                  <th className="p-3 w-36 text-right">Amount</th>
                  <th className="p-3 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {formData.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 text-center text-slate-400 font-medium">{idx + 1}</td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        placeholder="Item or service description"
                        className="w-full bg-transparent text-sm focus:outline-none text-slate-800 font-medium"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg py-1 text-sm text-slate-800"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full text-right bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-sm text-slate-800"
                      />
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      {company?.currency || '$'}{Number(item.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary & Calculations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Notes</label>
              <textarea
                rows={2}
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Payment Instructions</label>
              <textarea
                rows={2}
                value={formData.paymentInstructions || ''}
                onChange={(e) => setFormData({ ...formData, paymentInstructions: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold">{company?.currency || '$'}{formData.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span className="flex items-center space-x-2">
                <span>Discount (%)</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discountPercent}
                  onChange={(e) =>
                    recalculateTotals(formData.items, parseFloat(e.target.value) || 0, formData.vatPercent)
                  }
                  className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs text-right"
                />
              </span>
              <span className="text-emerald-600">-{company?.currency || '$'}{formData.discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span className="flex items-center space-x-2">
                <span>VAT / Tax (%)</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.vatPercent}
                  onChange={(e) =>
                    recalculateTotals(formData.items, formData.discountPercent, parseFloat(e.target.value) || 0)
                  }
                  className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs text-right"
                />
              </span>
              <span>+{company?.currency || '$'}{formData.vatAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-300 font-extrabold text-lg text-slate-900">
              <span>Grand Total</span>
              <span className="text-blue-600">{company?.currency || '$'}{formData.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
