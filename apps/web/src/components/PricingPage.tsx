import React, { useState } from 'react';
import { FileText, CheckCircle2, Shield } from 'lucide-react';

type BillingCycle = 'weekly' | 'monthly' | 'yearly';

const PRICING: Record<BillingCycle, { free: string; pro: string; business: string }> = {
  weekly:  { free: '0',      pro: '850',    business: '2,200'  },
  monthly: { free: '0',      pro: '2,500',  business: '7,500'  },
  yearly:  { free: '0',      pro: '22,000', business: '65,000' },
};

const BILLING_LABELS: Record<BillingCycle, string> = {
  weekly: '/week',
  monthly: '/month',
  yearly: '/year',
};

interface Props {
  onNavigate: (view: string) => void;
  onSignIn: () => void;
  onGetStarted: () => void;
}

export function PricingPage({ onNavigate, onSignIn, onGetStarted }: Props) {
  const [billing, setBilling] = useState<BillingCycle>('monthly');

  const prices = PRICING[billing];
  const suffix = BILLING_LABELS[billing];

  const freePlanFeatures = [
    '5 free documents on signup (trial)',
    'Invoices, Quotations, Receipts & Letters',
    'PDF export',
    'Company branding setup',
    'Document history',
  ];

  const proPlanFeatures = [
    'Everything in Free',
    'Unlimited documents',
    'Custom logo & watermark',
    'Digital signature support',
    'Priority support',
    'Advanced document templates',
  ];

  const businessPlanFeatures = [
    'Everything in Pro',
    'Multiple team members',
    'Admin dashboard & controls',
    'Usage analytics',
    'API access',
    'Dedicated account manager',
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans antialiased flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 w-full z-50 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-8 h-8 rounded-lg bg-[#0F9D58] flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">InvoicePro</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Reviews'].map(link => (
              <button key={link} onClick={() => onNavigate(link.toLowerCase())} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                {link}
              </button>
            ))}
            <button onClick={() => onNavigate('contact')} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Contact</button>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={onSignIn} className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Sign In</button>
            <button onClick={onGetStarted} className="bg-[#0F9D58] hover:bg-[#0c864b] text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-all shadow-sm shadow-[#0F9D58]/20">Get Started</button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 py-24 px-4 bg-[#F9FAFB]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#0F9D58] text-sm font-bold tracking-widest uppercase mb-3">Simple Pricing</p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">Start free. Scale as you grow.</h2>
            <p className="text-slate-500 mt-6 max-w-xl mx-auto text-lg">Every new account gets <span className="text-[#0F9D58] font-bold">5 free documents</span> for 30 days — no credit card needed.</p>
          </div>

          <div className="flex items-center justify-center gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit mx-auto mb-16 shadow-sm">
            {(['weekly', 'monthly', 'yearly'] as BillingCycle[]).map(cycle => (
              <button
                key={cycle}
                onClick={() => setBilling(cycle)}
                className={`relative px-6 py-2.5 text-sm font-bold rounded-lg capitalize transition-all ${
                  billing === cycle
                    ? 'bg-[#0F9D58] text-white shadow-md shadow-[#0F9D58]/20'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cycle}
                {cycle === 'yearly' && billing !== 'yearly' && (
                  <span className="absolute -top-2.5 -right-1 text-[9px] font-black bg-[#0F9D58] text-white px-1.5 py-0.5 rounded-full">SAVE 30%</span>
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Free Trial</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-5xl font-black text-slate-900">₦0</span>
              </div>
              <p className="text-sm text-slate-500 font-medium mb-8 pb-8 border-b border-slate-100">5 documents for 30 days</p>
              <ul className="space-y-4 mb-10">
                {freePlanFeatures.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={onGetStarted} className="w-full py-3.5 rounded-xl border-2 border-slate-200 hover:border-[#0F9D58] hover:text-[#0F9D58] text-sm font-bold text-slate-600 transition-all">
                Start Free Trial
              </button>
            </div>

            <div className="relative bg-[#0B161E] rounded-2xl p-8 shadow-2xl shadow-[#0B161E]/10 transform md:-translate-y-4 border border-[#0F9D58]/30">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-[#0F9D58] text-white text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase shadow-lg shadow-[#0F9D58]/20">Most Popular</span>
              </div>
              <p className="text-sm font-bold text-[#0F9D58] uppercase tracking-widest mb-2">Pro</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-5xl font-black text-white">₦{prices.pro}</span>
                <span className="text-white/50 text-sm pb-1.5 font-medium">{suffix}</span>
              </div>
              <p className="text-sm text-white/60 font-medium mb-8 pb-8 border-b border-white/10">For growing businesses</p>
              <ul className="space-y-4 mb-10">
                {proPlanFeatures.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/80 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#0F9D58] mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={onGetStarted} className="w-full py-3.5 rounded-xl bg-[#0F9D58] hover:bg-[#0c864b] text-white text-sm font-bold transition-all hover:shadow-lg hover:shadow-[#0F9D58]/25">
                Get Started with Pro
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Business</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-5xl font-black text-slate-900">₦{prices.business}</span>
                <span className="text-slate-500 text-sm pb-1.5 font-medium">{suffix}</span>
              </div>
              <p className="text-sm text-slate-500 font-medium mb-8 pb-8 border-b border-slate-100">For teams & agencies</p>
              <ul className="space-y-4 mb-10">
                {businessPlanFeatures.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#0F9D58]/50 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={onGetStarted} className="w-full py-3.5 rounded-xl border-2 border-[#0F9D58]/30 hover:border-[#0F9D58] text-sm font-bold text-[#0F9D58] transition-all bg-[#0F9D58]/5 hover:bg-[#0F9D58]/10">
                Get Business Plan
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-12 flex items-center justify-center gap-2 font-medium">
            <Shield className="w-4 h-4 text-slate-400" />
            Free trial usage is admin-controlled. Contact support to adjust limits for your account.
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0B161E] py-12 px-4 border-t border-white/10 mt-auto">
        <div className="max-w-6xl mx-auto text-center text-xs text-white/30">
          <p>&copy; {new Date().getFullYear()} InvoicePro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
