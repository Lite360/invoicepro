import React, { useState, useEffect, useCallback } from 'react';
import { BadgeCheck, ShieldCheck, Zap, ArrowRight, Check, RefreshCw, Crown } from 'lucide-react';
import { User } from '../types';
import { usePaystackPayment } from 'react-paystack';

const API = import.meta.env.VITE_API_URL || '';
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

interface SubscriptionModuleProps {
  user: User | null;
  onPlanUpgraded?: (plan: string) => void;
}

type Cycle = 'weekly' | 'monthly' | 'yearly';

interface PricingGrid {
  weekly:  { free: string; pro: string; business: string };
  monthly: { free: string; pro: string; business: string };
  yearly:  { free: string; pro: string; business: string };
}

const DEFAULT_PRICING: PricingGrid = {
  weekly:  { free: '0', pro: '850',   business: '2200'  },
  monthly: { free: '0', pro: '2500',  business: '7500'  },
  yearly:  { free: '0', pro: '22000', business: '65000' },
};

const PLAN_FEATURES = {
  PRO: [
    'Unlimited Invoices, Quotations & Receipts',
    'Remove InvoicePro watermark',
    'Accept Online Payments via Paystack',
    'Custom Branding & Logo',
    'Priority Email Support',
  ],
  BUSINESS: [
    'Everything in Pro',
    'Unlimited Team Members',
    'Advanced Analytics Dashboard',
    'Dedicated Account Manager',
    'Custom Domain & White-label',
    'API Access',
  ],
};

const CYCLE_LABELS: Record<Cycle, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

const CYCLE_SAVINGS: Record<Cycle, string | null> = {
  weekly: null,
  monthly: null,
  yearly: 'Save 25%',
};

// Inner component to use the Paystack hook per plan
function PayButton({
  label,
  email,
  amount,
  plan,
  cycle,
  token,
  onSuccess,
  onVerifying,
  className,
}: {
  label: React.ReactNode;
  email: string;
  amount: number; // in kobo (NGN * 100)
  plan: string;
  cycle: string;
  token: string;
  onSuccess: (plan: string) => void;
  onVerifying: (v: boolean) => void;
  className?: string;
}) {
  const config = {
    reference: `INV-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    email,
    amount, // kobo
    publicKey: PAYSTACK_PUBLIC_KEY,
    currency: 'NGN',
    metadata: {
      plan,
      cycle,
      custom_fields: [
        { display_name: 'Plan', variable_name: 'plan', value: plan },
        { display_name: 'Cycle', variable_name: 'cycle', value: cycle },
      ],
    },
  };

  const initializePayment = usePaystackPayment(config);

  const handlePay = () => {
    initializePayment({
      onSuccess: async (txn: any) => {
        onVerifying(true);
        try {
          const res = await fetch(`${API}/api/payments/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              reference: txn.reference || config.reference,
              plan,
              cycle,
              amount: amount / 100,
            }),
          });
          const data = await res.json();
          if (data.success) {
            onSuccess(data.plan);
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        } finally {
          onVerifying(false);
        }
      },
      onClose: () => {},
    });
  };

  return (
    <button onClick={handlePay} className={className}>
      {label}
    </button>
  );
}

export const SubscriptionModule: React.FC<SubscriptionModuleProps> = ({ user, onPlanUpgraded }) => {
  const [pricing, setPricing] = useState<PricingGrid>(DEFAULT_PRICING);
  const [cycle, setCycle] = useState<Cycle>('monthly');
  const [verifying, setVerifying] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const token = localStorage.getItem('invoicepro_token') || '';
  const currentPlan = (user as any)?.plan || 'FREE';

  const fetchPricing = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/pricing`);
      if (res.ok) {
        const data = await res.json();
        if (data.pricing) setPricing(data.pricing);
      }
    } catch { }
  }, []);

  useEffect(() => { fetchPricing(); }, []);

  const handlePlanUpgraded = (plan: string) => {
    setSuccessMsg(`🎉 You have been upgraded to the ${plan} plan!`);
    if (onPlanUpgraded) onPlanUpgraded(plan);
    setTimeout(() => setSuccessMsg(null), 6000);
  };

  const proAmount  = Number(pricing[cycle].pro)  * 100; // kobo
  const bizAmount  = Number(pricing[cycle].business) * 100;

  const formatPrice = (val: string) =>
    Number(val) === 0 ? 'Free' : `₦${Number(val).toLocaleString()}`;

  const isPro      = currentPlan === 'PRO';
  const isBusiness = currentPlan === 'BUSINESS';

  return (
    <div className="space-y-8 max-w-4xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Success toast */}
      {successMsg && (
        <div className="fixed top-5 right-5 z-[9999] bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />{successMsg}
        </div>
      )}

      {/* Verifying overlay */}
      {verifying && (
        <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#0F9D58] animate-spin mx-auto" />
            <p className="font-semibold text-slate-900">Verifying your payment…</p>
            <p className="text-sm text-slate-500">Please wait, this takes a few seconds.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-[#0F9D58]/10 text-[#0F9D58] rounded-2xl flex items-center justify-center mx-auto">
          <BadgeCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Manage Your Subscription</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Upgrade to unlock unlimited documents, custom branding, and priority support.
        </p>
      </div>

      {/* Current Plan Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F9D58]/10 text-[#0F9D58] flex items-center justify-center">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Current Plan</p>
            <p className="text-xl font-bold text-slate-900">{currentPlan}</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Active
        </span>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center gap-1 bg-slate-100 rounded-xl p-1 w-fit mx-auto">
        {(['weekly', 'monthly', 'yearly'] as Cycle[]).map(c => (
          <button
            key={c}
            onClick={() => setCycle(c)}
            className={`relative px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              cycle === c
                ? 'bg-white shadow text-slate-900'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {CYCLE_LABELS[c]}
            {CYCLE_SAVINGS[c] && (
              <span className="absolute -top-2.5 -right-1 bg-[#0F9D58] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {CYCLE_SAVINGS[c]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* FREE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Free</p>
          <p className="text-4xl font-extrabold text-slate-900 mb-1">₦0</p>
          <p className="text-sm text-slate-500 mb-6">Always free, forever.</p>
          <ul className="space-y-2 flex-1 mb-6">
            {['5 free documents', 'Basic Invoice & Quotation', 'PDF Export', 'InvoicePro watermark'].map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-slate-400 flex-shrink-0" />{f}
              </li>
            ))}
          </ul>
          <button disabled className="w-full py-3 bg-slate-100 text-slate-400 font-semibold rounded-xl cursor-not-allowed text-sm">
            {currentPlan === 'FREE' ? 'Current Plan' : 'Downgrade'}
          </button>
        </div>

        {/* PRO */}
        <div className="relative bg-white border-2 border-[#0F9D58] rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0F9D58] text-white text-xs font-bold px-3 py-1 rounded-full">
            Most Popular
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pro</p>
          </div>
          <p className="text-4xl font-extrabold text-slate-900 mb-1">{formatPrice(pricing[cycle].pro)}</p>
          <p className="text-sm text-slate-500 mb-6">/{CYCLE_LABELS[cycle].toLowerCase()}</p>
          <ul className="space-y-2 flex-1 mb-6">
            {PLAN_FEATURES.PRO.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                <div className="mt-0.5 w-4 h-4 rounded-full bg-[#0F9D58]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5 text-[#0F9D58]" />
                </div>{f}
              </li>
            ))}
          </ul>
          {isPro || isBusiness ? (
            <button disabled className="w-full py-3 bg-[#0F9D58]/10 text-[#0F9D58] font-bold rounded-xl cursor-not-allowed text-sm">
              {isPro ? 'Current Plan' : 'Included in Business'}
            </button>
          ) : (
            <PayButton
              label={<span className="flex items-center justify-center gap-2">Upgrade to Pro <ArrowRight className="w-4 h-4" /></span>}
              email={user?.email || ''}
              amount={proAmount}
              plan="PRO"
              cycle={cycle}
              token={token}
              onSuccess={handlePlanUpgraded}
              onVerifying={setVerifying}
              className="w-full py-3 bg-[#0F9D58] hover:bg-[#0B7A44] text-white font-bold rounded-xl shadow-lg shadow-[#0F9D58]/20 transition text-sm flex items-center justify-center gap-2"
            />
          )}
          <p className="text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Secured by Paystack
          </p>
        </div>

        {/* BUSINESS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-purple-500" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business</p>
          </div>
          <p className="text-4xl font-extrabold text-slate-900 mb-1">{formatPrice(pricing[cycle].business)}</p>
          <p className="text-sm text-slate-500 mb-6">/{CYCLE_LABELS[cycle].toLowerCase()}</p>
          <ul className="space-y-2 flex-1 mb-6">
            {PLAN_FEATURES.BUSINESS.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                <div className="mt-0.5 w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5 text-purple-600" />
                </div>{f}
              </li>
            ))}
          </ul>
          {isBusiness ? (
            <button disabled className="w-full py-3 bg-purple-100 text-purple-600 font-bold rounded-xl cursor-not-allowed text-sm">
              Current Plan
            </button>
          ) : (
            <PayButton
              label={<span className="flex items-center justify-center gap-2">Upgrade to Business <ArrowRight className="w-4 h-4" /></span>}
              email={user?.email || ''}
              amount={bizAmount}
              plan="BUSINESS"
              cycle={cycle}
              token={token}
              onSuccess={handlePlanUpgraded}
              onVerifying={setVerifying}
              className="w-full py-3 bg-slate-900 hover:bg-slate-700 text-white font-bold rounded-xl transition text-sm flex items-center justify-center gap-2"
            />
          )}
          <p className="text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Secured by Paystack
          </p>
        </div>
      </div>
    </div>
  );
};
