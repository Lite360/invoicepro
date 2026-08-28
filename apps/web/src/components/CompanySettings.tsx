import React, { useState } from 'react';
import { SetupWizard } from './SetupWizard';
import { Company } from '../types';

interface CompanySettingsProps {
  company: Company | null;
  onUpdateCompany: (company: Company) => void;
}

export const CompanySettings: React.FC<CompanySettingsProps> = ({ company, onUpdateCompany }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900">Company Settings & Branding</h1>
        <p className="text-sm text-slate-500 mt-1">
          Update your business information, logos, digital signature, banking details, accent colors, and document prefixes.
        </p>
      </div>

      <SetupWizard existingCompany={company} onComplete={onUpdateCompany} />
    </div>
  );
};
