import React, { useState, useEffect } from 'react';
import { FileText, Eye, Save, Sparkles } from 'lucide-react';
import { Company, Letter as LetterType } from '../types';

interface LetterModuleProps {
  company: Company | null;
  onPreview: (type: 'Letter', data: LetterType) => void;
}

const letterPresets: Record<string, { subject: string; body: string }> = {
  'General Letter': {
    subject: 'Official Business Communication',
    body: `Dear Client,\n\nWe are writing to communicate important updates regarding our ongoing partnership and upcoming service enhancements.\n\nPlease feel free to contact us if you have any questions or require further assistance.\n\nSincerely,\nManagement`,
  },
  'Employment Letter': {
    subject: 'Offer of Employment / Employment Verification',
    body: `To Whom It May Concern,\n\nThis letter serves to confirm that [Employee Name] is employed with ${'our company'} as a [Job Title], effective from [Start Date].\n\nShould you require any additional information, please contact our Human Resources department.\n\nSincerely,\nHR Manager`,
  },
  'Recommendation Letter': {
    subject: 'Letter of Recommendation for [Name]',
    body: `To Whom It May Concern,\n\nIt is my pleasure to recommend [Candidate Name] for employment with your organization. During their tenure with us, they demonstrated exceptional professionalism, diligence, and expertise.\n\nI am confident they will prove to be a valuable asset to your team.\n\nSincerely,\nExecutive Director`,
  },
  Proposal: {
    subject: 'Commercial & Technical Project Proposal',
    body: `Dear [Client Name],\n\nWe are pleased to submit this proposal for your upcoming project. Our team is fully equipped to deliver high-quality solutions tailored to your operational goals.\n\nKey Scope & Deliverables:\n1. Phase 1: Planning & Requirements Analysis\n2. Phase 2: Design & System Implementation\n3. Phase 3: Deployment, Quality Assurance & Training\n\nWe look forward to working together.\n\nBest regards,`,
  },
  Contract: {
    subject: 'Formal Services Agreement & Terms',
    body: `THIS CONTRACT is entered into by and between ${'Company Name'} ("Provider") and [Client Name] ("Client").\n\n1. SCOPE OF SERVICES: Provider agrees to perform the services detailed in Exhibit A.\n2. PAYMENT TERMS: Payments shall be made within 14 days of invoice issuance.\n3. CONFIDENTIALITY: Both parties agree to maintain strict confidentiality of proprietary data.\n\nIN WITNESS WHEREOF, the parties execute this contract as of the date written above.`,
  },
  'Service Agreement': {
    subject: 'Master Service Agreement (MSA)',
    body: `This Master Service Agreement governs the provision of professional services by ${'Company Name'} to [Client Name].\n\nSLA Commitments:\n- 99.9% Service Uptime Guarantee\n- 24/7 Technical Support SLA\n- Dedicated Account Management\n\nAccepted & Agreed:`,
  },
};

export const LetterModule: React.FC<LetterModuleProps> = ({ company, onPreview }) => {
  const [formData, setFormData] = useState<LetterType>({
    number: '',
    type: 'General Letter',
    date: new Date().toISOString().split('T')[0],
    recipientName: '',
    recipientTitle: '',
    recipientAddress: '',
    subject: letterPresets['General Letter'].subject,
    body: letterPresets['General Letter'].body,
    showSignature: true,
    status: 'Final',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNumber();
  }, []);

  const fetchNumber = async () => {
    try {
      const res = await fetch('/api/number-gen/letter');
      const data = await res.json();
      if (data.number) {
        setFormData((prev) => ({ ...prev, number: data.number }));
      }
    } catch (e) {
      console.error('Error fetching letter number', e);
    }
  };

  const handlePresetChange = (type: string) => {
    const preset = letterPresets[type] || letterPresets['General Letter'];
    setFormData((prev) => ({
      ...prev,
      type,
      subject: preset.subject.replace('${Company Name}', company?.companyName || 'Our Company'),
      body: preset.body.replace('${Company Name}', company?.companyName || 'Our Company'),
    }));
  };

  const handleSave = async (status: string = 'Final') => {
    setLoading(true);
    try {
      const res = await fetch('/api/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status }),
      });
      const data = await res.json();
      if (data.id) {
        onPreview('Letter', data);
      }
    } catch (e) {
      console.error('Error saving letter', e);
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
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Official Letter Generator</h1>
              <p className="text-xs text-slate-500">Auto-formatted with branded company letterhead</p>
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
              onClick={() => onPreview('Letter', formData)}
              className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl transition"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave('Issued')}
              className="w-full md:w-auto flex items-center justify-center space-x-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-amber-600/30 transition"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Issue Letter'}</span>
            </button>
          </div>
        </div>

        {/* Presets Selection */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-500 mb-2">Select Letter Template Preset</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.keys(letterPresets).map((presetKey) => (
              <button
                key={presetKey}
                type="button"
                onClick={() => handlePresetChange(presetKey)}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition ${
                  formData.type === presetKey
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {presetKey}
              </button>
            ))}
          </div>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Letter Number</label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Digital Signature</label>
            <div className="flex items-center h-10 px-3 border border-slate-200 rounded-xl bg-slate-50">
              <input
                type="checkbox"
                id="sig-toggle"
                checked={formData.showSignature}
                onChange={(e) => setFormData({ ...formData, showSignature: e.target.checked })}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <label htmlFor="sig-toggle" className="ml-2 text-xs font-semibold text-slate-700">
                Include Signature
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Recipient Name *</label>
            <input
              type="text"
              required
              value={formData.recipientName}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              placeholder="Dr. Robert Johnson"
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Recipient Title</label>
            <input
              type="text"
              value={formData.recipientTitle || ''}
              onChange={(e) => setFormData({ ...formData, recipientTitle: e.target.value })}
              placeholder="Chief Executive Officer"
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Recipient Address / Organization</label>
            <input
              type="text"
              value={formData.recipientAddress || ''}
              onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
              placeholder="Global Tech Industries"
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Subject Line *</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Subject of the letter"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Letter Body *</label>
            <textarea
              rows={12}
              required
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm leading-relaxed text-slate-800 focus:outline-none focus:border-amber-500 font-sans"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
