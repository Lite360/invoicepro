import React from 'react';
import { BadgeCheck, ShieldCheck, Zap, ArrowRight, Check } from 'lucide-react';
import { User } from '../types';

interface SubscriptionModuleProps {
  user: User | null;
}

export const SubscriptionModule: React.FC<SubscriptionModuleProps> = ({ user }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="w-16 h-16 bg-[#0F9D58]/10 text-[#0F9D58] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BadgeCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Manage Your Subscription</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Upgrade your plan to unlock premium features like automated payment reminders, custom domains, and unlimited documents.
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-lg">Current Plan</span>
            <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span> Active
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Free Tier</h2>
          <p className="text-sm text-slate-500 mt-1">Basic features for getting started.</p>
        </div>
        <div className="text-right w-full md:w-auto">
          <button disabled className="w-full md:w-auto px-6 py-3 bg-slate-100 text-slate-400 font-semibold rounded-xl cursor-not-allowed">
            Current Plan
          </button>
        </div>
      </div>

      {/* Upgrade Option */}
      <div className="mt-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F9D58] to-emerald-400 transform skew-y-1 sm:skew-y-0 sm:-rotate-1 sm:rounded-3xl opacity-20"></div>
        <div className="relative bg-white rounded-3xl border-2 border-[#0F9D58] p-8 shadow-xl overflow-hidden">
          {/* Badge */}
          <div className="absolute top-0 right-0 bg-[#0F9D58] text-white px-4 py-1.5 rounded-bl-xl text-xs font-bold uppercase tracking-wider">
            Most Popular
          </div>

          <div className="flex flex-col lg:flex-row gap-8 justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="text-2xl font-bold text-slate-900">InvoiceHub Pro</h3>
              </div>
              <p className="text-slate-500 text-sm mb-6">Everything you need to run your business professionally.</p>
              
              <ul className="space-y-3">
                {[
                  'Unlimited Invoices & Quotations',
                  'Remove "Made with InvoiceHub" watermark',
                  'Accept Online Payments (Stripe/Paypal)',
                  'Custom Branding & Colors',
                  'Priority Email Support'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#0F9D58]" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-center items-center lg:items-end lg:w-64 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-6">
              <div className="text-center lg:text-right mb-6">
                <div className="flex items-end justify-center lg:justify-end gap-1 mb-1">
                  <span className="text-4xl font-extrabold text-slate-900">$12</span>
                  <span className="text-slate-500 font-medium pb-1">/mo</span>
                </div>
                <p className="text-xs text-slate-400">Billed annually ($144/year)</p>
              </div>
              <button className="w-full px-6 py-4 bg-[#0F9D58] hover:bg-[#0B7A44] text-white font-bold rounded-xl shadow-lg shadow-[#0F9D58]/30 transition flex items-center justify-center gap-2 group">
                Upgrade to Pro
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-xs text-slate-400 mt-4 flex items-center justify-center lg:justify-end gap-1">
                <ShieldCheck className="w-3 h-3" /> Secure payment via Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
