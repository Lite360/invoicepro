import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Mail, Phone, MapPin, MoreVertical } from 'lucide-react';
import { Company } from '../types';

interface CustomerModuleProps {
  company: Company | null;
}

export const CustomerModule: React.FC<CustomerModuleProps> = ({ company }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/customers`);
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name) return alert('Name is required');
    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowAddModal(false);
        setFormData({ name: '', email: '', phone: '', address: '' });
        fetchCustomers();
      }
    } catch (error) {
      console.error('Failed to create customer', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#0F9D58]" />
            Customers
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage your clients and billing contacts</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#0F9D58] hover:bg-[#0B7A44] text-white font-medium text-sm rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F9D58]/20 focus:border-[#0F9D58] transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-sm font-semibold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
          Total Customers: <span className="text-slate-900">{customers.length}</span>
        </div>
      </div>

      {/* Customer List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading customers...</div>
      ) : customers.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-slate-500 mb-4">No customers found. Add your first customer!</p>
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-xl transition">Add Customer</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((customer) => (
            <div key={customer.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0F9D58]/10 text-[#0F9D58] flex items-center justify-center font-bold text-lg uppercase">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 truncate w-32 sm:w-40">{customer.name}</h3>
                    <p className="text-xs font-semibold text-[#0F9D58]">
                      Total Billed: {company?.currency || '$'}{(customer.totalBilled || 0).toLocaleString()}
                    </p>
                  </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center text-sm text-slate-600 gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600 gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600 gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{customer.address}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add Customer Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Add New Customer</h2>
            <p className="text-sm text-slate-500 mb-6">Enter the client's billing and contact details.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Name *</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0F9D58] focus:border-transparent outline-none" placeholder="e.g. Acme Corp" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0F9D58] focus:border-transparent outline-none" placeholder="billing@company.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0F9D58] focus:border-transparent outline-none" placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Address</label>
                <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={2} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0F9D58] focus:border-transparent outline-none resize-none" placeholder="Full address"></textarea>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button disabled={isSubmitting} onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition">Cancel</button>
              <button disabled={isSubmitting} onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-[#0F9D58] hover:bg-[#0B7A44] shadow-md shadow-[#0F9D58]/20 transition">
                {isSubmitting ? 'Saving...' : 'Save Customer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
