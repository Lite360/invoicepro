import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  Eye,
  Download,
  Printer,
  Trash2,
  Copy,
  ArrowUpDown,
  FileSpreadsheet,
} from 'lucide-react';
import { Company, DocumentRecord } from '../types';

interface DocumentHistoryProps {
  company: Company | null;
  onSelectDocumentForPreview: (type: 'Invoice' | 'Quotation' | 'Receipt' | 'Letter', data: any) => void;
}

export const DocumentHistory: React.FC<DocumentHistoryProps> = ({
  company,
  onSelectDocumentForPreview,
}) => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      setDocuments(data);
    } catch (e) {
      console.error('Failed to fetch documents history', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document record?')) return;
    try {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      fetchDocuments();
    } catch (e) {
      console.error('Error deleting document', e);
    }
  };

  const handleFetchFullAndPreview = async (doc: DocumentRecord) => {
    let endpoint = '';
    if (doc.type === 'Invoice') endpoint = '/api/invoices';
    else if (doc.type === 'Quotation') endpoint = '/api/quotations';
    else if (doc.type === 'Receipt') endpoint = '/api/receipts';
    else if (doc.type === 'Letter') endpoint = '/api/letters';

    try {
      const res = await fetch(endpoint);
      const list = await res.json();
      const match = list.find((item: any) => item.number === doc.documentNumber);
      if (match) {
        onSelectDocumentForPreview(doc.type, match);
      } else {
        onSelectDocumentForPreview(doc.type, {
          number: doc.documentNumber,
          customerName: doc.customer,
          amountPaid: doc.amount,
          grandTotal: doc.amount,
          date: doc.date,
          status: doc.status,
        });
      }
    } catch (e) {
      console.error('Error fetching document details', e);
    }
  };

  const filteredDocs = documents
    .filter((doc) => {
      const matchesSearch =
        doc.documentNumber.toLowerCase().includes(search.toLowerCase()) ||
        doc.customer.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'All' || doc.type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc'
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      }
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Document History</h1>
            <p className="text-xs text-slate-500">View, search, print, duplicate, or delete any generated document</p>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-semibold bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          Total Archived Documents: {documents.length}
        </div>
      </div>

      {/* Controls: Search, Filter, Sort */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doc number or customer..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Filter & Sort Buttons */}
        <div className="flex flex-wrap items-center space-x-2 w-full sm:w-auto">
          <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
            {['All', 'Invoice', 'Quotation', 'Receipt', 'Letter'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  typeFilter === t
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (sortBy === 'date') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              else setSortBy('date');
            }}
            className="flex items-center space-x-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort Date ({sortOrder})</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredDocs.length === 0 ? (
          <div className="text-center py-16">
            <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">No matching documents found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or type filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-400 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">Doc Number</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Customer / Recipient</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-bold text-slate-900">{doc.documentNumber}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-md">
                        {doc.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-800 font-medium">{doc.customer}</td>
                    <td className="p-4 font-semibold text-slate-900">
                      {doc.amount > 0
                        ? `${company?.currency || '$'}${doc.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                        : '-'}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-full">
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-500">{doc.date}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleFetchFullAndPreview(doc)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          title="View / Print PDF"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
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
