import React, { useState } from 'react';
import { Building2, Upload, Sparkles, CheckCircle2, CreditCard, Palette, FileCode2 } from 'lucide-react';
import { Company } from '../types';

interface SetupWizardProps {
  onComplete: (company: Company) => void;
  existingCompany?: Company | null;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete, existingCompany }) => {
  const [formData, setFormData] = useState<Company>({
    companyName: existingCompany?.companyName || '',
    businessAddress: existingCompany?.businessAddress || '',
    phone: existingCompany?.phone || '',
    email: existingCompany?.email || '',
    website: existingCompany?.website || '',
    registrationNumber: existingCompany?.registrationNumber || '',
    taxNumber: existingCompany?.taxNumber || '',
    bankName: existingCompany?.bankName || '',
    accountName: existingCompany?.accountName || '',
    accountNumber: existingCompany?.accountNumber || '',
    footerText: existingCompany?.footerText || 'Thank you for your business!',
    primaryColor: existingCompany?.primaryColor || '#0f172a',
    secondaryColor: existingCompany?.secondaryColor || '#2563eb',
    currency: existingCompany?.currency || 'USD',
    invoicePrefix: existingCompany?.invoicePrefix || 'INV',
    quotationPrefix: existingCompany?.quotationPrefix || 'QTN',
    receiptPrefix: existingCompany?.receiptPrefix || 'RCT',
    letterPrefix: existingCompany?.letterPrefix || 'LTR',
    logoUrl: existingCompany?.logoUrl || null,
    watermarkUrl: existingCompany?.watermarkUrl || null,
    signatureUrl: existingCompany?.signatureUrl || null,
  });

  const [uploading, setUploading] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (field: 'logoUrl' | 'watermarkUrl' | 'signatureUrl', file: File) => {
    setUploading(field);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, [field]: data.url }));
      }
    } catch (e) {
      console.error('Upload failed', e);
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.company) {
        onComplete(data.company);
      }
    } catch (e) {
      console.error('Error saving company profile', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 py-12">
      <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>First Launch Setup Wizard</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome to BrandDocs</h1>
            <p className="text-blue-100 text-sm mt-2 max-w-xl">
              Configure your business profile once. BrandDocs will automatically format and brand all your invoices, quotations, receipts, and official letters.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 text-slate-200">
          {/* Step 1: Basic Details & Contact */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-base border-b border-slate-800 pb-2">
              <Building2 className="w-5 h-5" />
              <span>1. Company Information</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Apex Tech Solutions Ltd"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="billing@company.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Website (Optional)</label>
                <input
                  type="text"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="www.company.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1">Business Address *</label>
                <input
                  type="text"
                  required
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                  placeholder="123 Corporate Blvd, Suite 400, New York, NY 10001"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Registration Number *</label>
                <input
                  type="text"
                  required
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  placeholder="REG-9482710"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Tax Number (Optional)</label>
                <input
                  type="text"
                  value={formData.taxNumber || ''}
                  onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                  placeholder="TAX-84729102"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Branding Assets Uploads */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-base border-b border-slate-800 pb-2">
              <Upload className="w-5 h-5" />
              <span>2. Branding Assets (Logos & Signature)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Logo Upload */}
              <div className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl text-center">
                <label className="block text-xs font-semibold text-slate-300 mb-2">Business Logo</label>
                {formData.logoUrl ? (
                  <div className="relative group mb-2">
                    <img src={formData.logoUrl} alt="Logo" className="h-16 mx-auto object-contain bg-white/10 rounded-lg p-1" />
                    <span className="text-[10px] text-emerald-400 font-medium block mt-1">✓ Uploaded</span>
                  </div>
                ) : (
                  <div className="h-16 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center text-slate-500 text-xs mb-2">
                    {uploading === 'logoUrl' ? 'Uploading...' : 'No Logo Uploaded'}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('logoUrl', e.target.files[0])}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="inline-block px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg cursor-pointer transition"
                >
                  Upload Logo
                </label>
              </div>

              {/* Watermark Upload */}
              <div className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl text-center">
                <label className="block text-xs font-semibold text-slate-300 mb-2">Watermark Logo</label>
                {formData.watermarkUrl ? (
                  <div className="relative group mb-2">
                    <img src={formData.watermarkUrl} alt="Watermark" className="h-16 mx-auto object-contain bg-white/10 rounded-lg p-1" />
                    <span className="text-[10px] text-emerald-400 font-medium block mt-1">✓ Uploaded</span>
                  </div>
                ) : (
                  <div className="h-16 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center text-slate-500 text-xs mb-2">
                    {uploading === 'watermarkUrl' ? 'Uploading...' : 'No Watermark'}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('watermarkUrl', e.target.files[0])}
                  className="hidden"
                  id="watermark-upload"
                />
                <label
                  htmlFor="watermark-upload"
                  className="inline-block px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg cursor-pointer transition"
                >
                  Upload Watermark
                </label>
              </div>

              {/* Digital Signature Upload */}
              <div className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl text-center">
                <label className="block text-xs font-semibold text-slate-300 mb-2">Digital Signature</label>
                {formData.signatureUrl ? (
                  <div className="relative group mb-2">
                    <img src={formData.signatureUrl} alt="Signature" className="h-16 mx-auto object-contain bg-white/10 rounded-lg p-1" />
                    <span className="text-[10px] text-emerald-400 font-medium block mt-1">✓ Uploaded</span>
                  </div>
                ) : (
                  <div className="h-16 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center text-slate-500 text-xs mb-2">
                    {uploading === 'signatureUrl' ? 'Uploading...' : 'No Signature'}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('signatureUrl', e.target.files[0])}
                  className="hidden"
                  id="signature-upload"
                />
                <label
                  htmlFor="signature-upload"
                  className="inline-block px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg cursor-pointer transition"
                >
                  Upload Signature
                </label>
              </div>
            </div>
          </div>

          {/* Step 3: Banking Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-base border-b border-slate-800 pb-2">
              <CreditCard className="w-5 h-5" />
              <span>3. Banking Details & Prefixes</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Bank Name *</label>
                <input
                  type="text"
                  required
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="Chase / Citibank"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Account Name *</label>
                <input
                  type="text"
                  required
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  placeholder="Apex Tech Solutions"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Account Number *</label>
                <input
                  type="text"
                  required
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="9876543210"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
            </div>
          </div>

          {/* Step 4: Visual Theme & Prefixes */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-base border-b border-slate-800 pb-2">
              <Palette className="w-5 h-5" />
              <span>4. Document Colors & Number Prefixes</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Primary Color</label>
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-full h-10 bg-slate-800 border border-slate-700 rounded-xl cursor-pointer p-1"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Secondary Accent</label>
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-full h-10 bg-slate-800 border border-slate-700 rounded-xl cursor-pointer p-1"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Default Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                  <option value="NGN">NGN (₦)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Invoice Prefix</label>
                <input
                  type="text"
                  value={formData.invoicePrefix}
                  onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                  placeholder="INV"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Quotation Prefix</label>
                <input
                  type="text"
                  value={formData.quotationPrefix}
                  onChange={(e) => setFormData({ ...formData, quotationPrefix: e.target.value })}
                  placeholder="QTN"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Receipt Prefix</label>
                <input
                  type="text"
                  value={formData.receiptPrefix}
                  onChange={(e) => setFormData({ ...formData, receiptPrefix: e.target.value })}
                  placeholder="RCT"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1">Footer Text</label>
                <input
                  type="text"
                  value={formData.footerText || ''}
                  onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                  placeholder="Thank you for your business!"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-blue-600/30 transition-all text-sm"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{loading ? 'Saving Profile...' : 'Save & Launch BrandDocs'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
