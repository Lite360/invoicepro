import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  FileCheck,
  Receipt,
  Download,
  History,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Star,
  Menu,
  X,
  CreditCard,
  Mail,
  Smartphone,
  PenTool,
} from 'lucide-react';

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

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onNavigate?: (view: string) => void;
}

export function LandingPage({ onGetStarted, onSignIn, onNavigate }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billing, setBilling] = useState<BillingCycle>('monthly');

  const prices = PRICING[billing];
  const suffix = BILLING_LABELS[billing];

  const features = [
    { icon: FileSpreadsheet, title: 'Professional Invoices', desc: 'Create branded invoices with your logo, colors, and digital signature in seconds.' },
    { icon: FileCheck,       title: 'Quotations & Estimates', desc: 'Send professional quotes and convert accepted ones to invoices with one click.' },
    { icon: CreditCard,      title: 'Collect Payments', desc: 'Accept payments via Paystack directly from your invoice. Receipts are generated automatically.' },
    { icon: PenTool,         title: 'Custom Branding', desc: 'Apply your logo, brand colors, watermark, and digital signature to every document.' },
    { icon: Mail,            title: 'Automated Emails', desc: 'Invoices, receipts, and payment reminders are sent automatically to your customers.' },
    { icon: Smartphone,      title: 'Works Everywhere', desc: 'Available as an app on android and iOS. Manage your business from anywhere.' },
  ];

  const testimonials = [
    { name: 'Adaeze Okonkwo', role: 'Freelance Designer, Lagos', quote: 'InvoicePro completely transformed how I bill clients. I went from sending Word docs to professional branded docs in minutes.', avatar: 'A', color: 'bg-pink-500' },
    { name: 'Emeka Nwosu',    role: 'Digital Agency Owner, Abuja', quote: 'The Paystack integration is seamless. Clients pay directly from the invoice and I get notified instantly. Game changer.', avatar: 'E', color: 'bg-emerald-500' },
    { name: 'Funmi Adeleke',  role: 'Consultant, Port Harcourt', quote: 'Finally a Nigerian invoicing tool that actually works properly. The automatic receipt generation alone saves me hours every week.', avatar: 'F', color: 'bg-teal-500' },
  ];

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
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans antialiased">
      {/* ── NAV ────────────────────────────────────────────── */}
      <header className="absolute top-0 w-full z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0F9D58] flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">InvoicePro</span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {['Features', 'Pricing', 'Reviews'].map(link => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </nav>

            {/* CTA buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button
                id="landing-signin-btn"
                onClick={onSignIn}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                id="landing-getstarted-btn"
                onClick={onGetStarted}
                className="text-sm font-semibold bg-[#0F9D58] hover:bg-[#0c864b] text-white px-5 py-2.5 rounded-lg transition-all"
              >
                Get Started Free
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-white/80 hover:text-white"
              onClick={() => setMobileMenuOpen(v => !v)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0B161E] px-4 py-4 space-y-4 shadow-xl absolute w-full top-20 border-t border-white/10">
            {['Features', 'Pricing', 'Reviews'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="block text-sm font-medium text-white/80 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>
                {link}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
              <button onClick={onSignIn} className="w-full text-sm font-medium text-white/80 hover:text-white py-2 transition-all text-left">Sign In</button>
              <button onClick={onGetStarted} className="w-full text-sm font-semibold bg-[#0F9D58] hover:bg-[#0c864b] text-white py-3 rounded-lg transition-all text-center">Get Started Free</button>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0B161E] pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center relative z-10 pt-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-[#0F9D58]/30 bg-[#0F9D58]/10 text-[#0F9D58] text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Trusted by 2,400+ Nigerian businesses
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-white">
            Create. Send. <span className="text-[#0F9D58]">Get Paid.</span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            InvoicePro is the professional billing platform for Nigerian businesses. 
            Create branded invoices, collect Paystack payments, and automate your receipts — all in one place.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              id="hero-getstarted-btn"
              onClick={onGetStarted}
              className="flex items-center justify-center gap-2 bg-[#0F9D58] hover:bg-[#0c864b] text-white font-semibold px-8 py-3.5 rounded-lg text-sm transition-all w-full sm:w-auto"
            >
              Start Free Today
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#pricing"
              className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-3.5 rounded-lg text-sm transition-all w-full sm:w-auto"
            >
              View Pricing
            </a>
          </div>

          {/* Stats inline */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-3xl mx-auto mb-16">
            {[
              ['2,400+', 'Businesses'],
              ['180K+', 'Invoices Created'],
              ['₦2.1B+', 'Payments Collected'],
              ['10K+ hrs', 'Time Saved'],
            ].map(([stat, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white mb-1">{stat}</p>
                <p className="text-xs text-white/50">{label}</p>
              </div>
            ))}
          </div>

          {/* Document mockup */}
          <div className="relative mx-auto max-w-3xl">
            <div className="bg-white rounded-t-2xl p-6 md:p-8 text-left shadow-2xl overflow-hidden relative">
              {/* Fake top bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#0F9D58]"></div>
              
              <div className="flex items-start justify-between mb-8 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0F9D58] rounded text-white flex items-center justify-center font-bold">
                    IN
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 leading-tight">Acme Design Studio</p>
                    <p className="text-xs text-slate-500">Invoice #INV-00042</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold tracking-widest text-[#0F9D58] border border-[#0F9D58]/30 px-2.5 py-1 rounded-full uppercase bg-[#0F9D58]/5">
                    Paid
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4 border-b border-slate-100 pb-6">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Bill To</p>
                  <p className="text-sm font-semibold text-slate-800">TechCorp Nigeria Ltd.</p>
                  <p className="text-xs text-slate-500">Lagos, Nigeria</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Issue Date</p>
                  <p className="text-sm font-medium text-slate-800 mb-2">Aug 15, 2026</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Due Date</p>
                  <p className="text-sm font-medium text-slate-800">Aug 30, 2026</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Total Amount</p>
                  <p className="text-2xl font-black text-slate-900 mb-1">₦850,000</p>
                  <p className="text-[10px] text-[#0F9D58] font-medium flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Fully Paid
                  </p>
                </div>
              </div>
              
            </div>
            {/* Fade out gradient at bottom of mockup */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F9FAFB] to-transparent z-20"></div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 bg-[#F9FAFB] relative z-30 -mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#0F9D58] text-xs font-bold tracking-widest uppercase mb-3">Everything you need</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">Built for Nigerian Businesses</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg">
              From freelancers to agencies — InvoicePro has every tool you need to look professional and get paid faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 transition-all hover:shadow-md"
              >
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-slate-700 stroke-[1.5]" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section className="py-24 px-4 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[#0F9D58] text-xs font-bold tracking-widest uppercase mb-3">Step-by-step workflow</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-16">How InvoicePro Works</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden sm:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-[#0F9D58]/20 z-0"></div>
            
            {[
              { num: '1', title: 'Register', desc: 'Create your account and set up your business profile in minutes.', icon: '✍️' },
              { num: '2', title: 'Brand It', desc: 'Add your logo, colors, and signature for a fully professional look.', icon: '🎨' },
              { num: '3', title: 'Create & Send', desc: 'Generate an invoice or quotation and send it to your customer via email.', icon: '📨' },
              { num: '4', title: 'Get Paid', desc: 'Customer pays via Paystack. Receipt is auto-generated and emailed.', icon: '💰' },
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-[#0F9D58] rounded-full flex items-center justify-center text-2xl shadow-lg shadow-[#0F9D58]/20 mb-6 relative">
                  {step.icon}
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-[#0F9D58] text-xs font-bold text-[#0F9D58]">
                    {step.num}
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 font-medium px-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4 bg-[#F9FAFB] border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#0F9D58] text-xs font-bold tracking-widest uppercase mb-3">Simple Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">Start free. Scale as you grow.</h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto text-lg">Every new account gets <span className="text-[#0F9D58] font-bold">5 free documents</span> for 30 days — no credit card needed.</p>
          </div>

          {/* Billing toggle */}
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

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Free Trial */}
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
              <button
                onClick={onGetStarted}
                className="w-full py-3.5 rounded-xl border-2 border-slate-200 hover:border-[#0F9D58] hover:text-[#0F9D58] text-sm font-bold text-slate-600 transition-all"
              >
                Start Free Trial
              </button>
            </div>

            {/* Pro — highlighted */}
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
              <button
                onClick={onGetStarted}
                className="w-full py-3.5 rounded-xl bg-[#0F9D58] hover:bg-[#0c864b] text-white text-sm font-bold transition-all hover:shadow-lg hover:shadow-[#0F9D58]/25"
              >
                Get Started with Pro
              </button>
            </div>

            {/* Business */}
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
              <button
                onClick={onGetStarted}
                className="w-full py-3.5 rounded-xl border-2 border-[#0F9D58]/30 hover:border-[#0F9D58] text-sm font-bold text-[#0F9D58] transition-all bg-[#0F9D58]/5 hover:bg-[#0F9D58]/10"
              >
                Get Business Plan
              </button>
            </div>
          </div>

          {/* Admin note */}
          <p className="text-center text-sm text-slate-500 mt-12 flex items-center justify-center gap-2 font-medium">
            <Shield className="w-4 h-4 text-slate-400" />
            Free trial usage is admin-controlled. Contact support to adjust limits for your account.
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────── */}
      <section id="reviews" className="py-24 px-4 bg-[#0B101E]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#0F9D58] text-xs font-bold tracking-widest uppercase mb-3">Real Results</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Loved by businesses across Nigeria</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, quote, avatar, color }) => (
              <div key={name} className="bg-[#131B27] border border-white/5 rounded-2xl p-8 flex flex-col">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#EAB308] fill-[#EAB308]" />
                  ))}
                </div>
                <p className="text-[15px] text-white/80 leading-relaxed mb-8 flex-1 font-medium">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm`}>
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{name}</p>
                    <p className="text-xs text-white/50">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────── */}
      <section className="py-24 px-4 bg-[#0F9D58]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6 text-white leading-tight">
            Ready to Get Paid Faster?
          </h2>
          <p className="text-white/90 mb-10 text-lg font-medium max-w-xl mx-auto">
            Join thousands of Nigerian businesses that use InvoicePro to look professional and collect payments with ease.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#0F9D58] font-bold px-8 py-3.5 rounded-lg text-sm transition-all hover:bg-slate-50 w-full sm:w-auto"
            >
              Start Free Today
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-bold px-8 py-3.5 rounded-lg text-sm transition-all hover:bg-white/10 w-full sm:w-auto"
            >
              See Pricing
            </button>
          </div>
          <p className="text-xs text-white/70 mt-6 font-medium">
            No credit card required • Free to start • Cancel anytime
          </p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="bg-[#0B161E] py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#0F9D58] flex items-center justify-center">
                <FileText className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-white text-sm">InvoicePro</span>
              <span className="text-white/40 text-xs ml-2">— Create. Send. Get Paid.</span>
            </div>
            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-white/50">
              <button onClick={onSignIn} className="hover:text-white transition-colors">Sign In</button>
              <button onClick={onGetStarted} className="hover:text-white transition-colors">Sign Up</button>
              <button onClick={() => onNavigate?.('privacy')} className="hover:text-white transition-colors">Privacy</button>
              <button onClick={() => onNavigate?.('terms')} className="hover:text-white transition-colors">Terms</button>
              <button onClick={() => onNavigate?.('aml-kyc')} className="hover:text-white transition-colors">AML & KYC</button>
              <button onClick={() => onNavigate?.('refund-policy')} className="hover:text-white transition-colors">Refund Policy</button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
            {/* Copyright */}
            <p className="text-xs font-medium text-white/30">
              &copy; {new Date().getFullYear()} InvoicePro. All rights reserved.
            </p>
            {/* Developer Attribution */}
            <p className="text-xs font-medium text-white/30">
              Developed by <a href="https://wa.me/2349054256786" target="_blank" rel="noopener noreferrer" className="text-[#0F9D58] hover:underline">Elite developer</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
