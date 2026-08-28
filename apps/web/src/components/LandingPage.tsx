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
  ChevronDown,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

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

export function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const prices = PRICING[billing];
  const suffix = BILLING_LABELS[billing];

  const features = [
    { icon: FileSpreadsheet, title: 'Professional Invoices', desc: 'Create beautiful, branded invoices in seconds with auto-numbering and PDF export.' },
    { icon: FileCheck,       title: 'Quotations & Estimates', desc: 'Convert approved quotations to invoices in one click — zero data re-entry.' },
    { icon: Receipt,         title: 'Payment Receipts', desc: 'Issue payment acknowledgements instantly with your company branding.' },
    { icon: FileText,        title: 'Business Letters', desc: 'Draft professional correspondence with your letterhead and signature.' },
    { icon: Download,        title: 'One-Click PDF Export', desc: 'Generate pixel-perfect A4 PDFs from any document, ready to send or print.' },
    { icon: History,         title: 'Document History', desc: 'Track every document ever created — search, preview, and re-download anytime.' },
  ];

  const testimonials = [
    { name: 'Adaeze Okonkwo', role: 'Founder, Lumino Creatives', quote: 'InvoicePro cut my invoicing time by 80%. My clients are always impressed by how professional my documents look.' },
    { name: 'Emeka Nwosu',    role: 'CEO, BuildRight Ltd',       quote: 'The quotation-to-invoice conversion is a game changer. No more copy-pasting between documents.' },
    { name: 'Chisom Eze',     role: 'Freelance Consultant',      quote: 'I love that everything stays in one place. The PDF quality is indistinguishable from what agencies charge thousands for.' },
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
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans antialiased">
      {/* ── NAV ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#CAFF33] flex items-center justify-center">
                <FileText className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold text-lg tracking-tight">InvoicePro</span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {['Features', 'Pricing', 'About'].map(link => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </nav>

            {/* CTA buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                id="landing-signin-btn"
                onClick={onSignIn}
                className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2"
              >
                Sign In
              </button>
              <button
                id="landing-getstarted-btn"
                onClick={onGetStarted}
                className="text-sm font-semibold bg-[#CAFF33] hover:bg-[#d4ff55] text-black px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-[#CAFF33]/20"
              >
                Get Started Free
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-white/70 hover:text-white"
              onClick={() => setMobileMenuOpen(v => !v)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0A0A0A] px-4 py-4 space-y-3">
            {['Features', 'Pricing', 'About'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="block text-sm text-white/60 hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>
                {link}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <button onClick={onSignIn} className="flex-1 text-sm border border-white/10 hover:border-white/20 text-white/70 hover:text-white py-2 rounded-lg transition-all">Sign In</button>
              <button onClick={onGetStarted} className="flex-1 text-sm font-semibold bg-[#CAFF33] hover:bg-[#d4ff55] text-black py-2 rounded-lg transition-all">Get Started</button>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-28 px-4">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#CAFF33]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-[#CAFF33]/3 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-[#CAFF33]/30 bg-[#CAFF33]/5 text-[#CAFF33] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Sparkles className="w-3 h-3" />
            5 free documents — no credit card required
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            Professional Documents.
            <br />
            <span className="text-[#CAFF33]">Instant. Branded.</span>
          </h1>

          <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create stunning invoices, quotations, receipts, and business letters in seconds.
            Export pixel-perfect PDFs with your company branding — all from one dashboard.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <button
              id="hero-getstarted-btn"
              onClick={onGetStarted}
              className="flex items-center gap-2 bg-[#CAFF33] hover:bg-[#d4ff55] text-black font-bold px-8 py-4 rounded-xl text-base transition-all hover:shadow-xl hover:shadow-[#CAFF33]/25 hover:-translate-y-0.5"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-signin-btn"
              onClick={onSignIn}
              className="flex items-center gap-2 border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-semibold px-8 py-4 rounded-xl text-base transition-all"
            >
              Sign In to your account
            </button>
          </div>

          {/* Document mockup */}
          <div className="relative mx-auto max-w-2xl">
            <div className="absolute inset-0 bg-[#CAFF33]/10 blur-3xl rounded-3xl" />
            <div className="relative bg-[#111111] border border-white/10 rounded-2xl p-6 text-left shadow-2xl">
              {/* Mock invoice header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="w-10 h-10 bg-[#CAFF33] rounded-lg mb-3 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-black" />
                  </div>
                  <p className="text-xs text-white/40">INVOICE</p>
                  <p className="text-lg font-bold">INV-2026-000001</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40 mb-1">STATUS</p>
                  <span className="text-xs font-semibold bg-[#CAFF33]/10 text-[#CAFF33] border border-[#CAFF33]/20 px-2 py-0.5 rounded-full">Issued</span>
                </div>
              </div>
              {/* Mock line items */}
              <div className="space-y-2 mb-4">
                {[
                  ['Website Design', '₦150,000'],
                  ['Brand Identity Package', '₦80,000'],
                  ['Monthly Maintenance', '₦25,000'],
                ].map(([item, amount]) => (
                  <div key={item} className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-sm text-white/60">{item}</span>
                    <span className="text-sm font-medium">{amount}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-white/40">Grand Total</span>
                <span className="text-xl font-black text-[#CAFF33]">₦255,000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-[#111111] py-6">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              ['500+', 'Businesses Using InvoicePro'],
              ['25,000+', 'Documents Generated'],
              ['₦2.1B+', 'Worth of Invoices Issued'],
              ['99.9%', 'Uptime Guaranteed'],
            ].map(([stat, label]) => (
              <div key={label}>
                <p className="text-2xl font-black text-[#CAFF33]">{stat}</p>
                <p className="text-xs text-white/40 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#CAFF33] text-xs font-bold tracking-widest uppercase mb-3">Everything You Need</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">One platform. Every document.</h2>
            <p className="text-white/40 mt-3 max-w-xl mx-auto">Stop juggling multiple tools. InvoicePro handles every document your business needs, with your brand front and centre.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group bg-[#111111] border border-white/5 hover:border-[#CAFF33]/30 rounded-2xl p-6 transition-all duration-300 hover:bg-[#161616]"
              >
                <div className="w-10 h-10 bg-[#CAFF33]/10 border border-[#CAFF33]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#CAFF33]/20 transition-colors">
                  <Icon className="w-5 h-5 text-[#CAFF33]" />
                </div>
                <h3 className="font-bold text-base mb-2">{title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4 bg-[#0D0D0D]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#CAFF33] text-xs font-bold tracking-widest uppercase mb-3">Simple Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Start free. Scale as you grow.</h2>
            <p className="text-white/40 mt-3">Every new account gets <span className="text-[#CAFF33] font-semibold">5 free documents</span> for 30 days — no credit card needed.</p>
          </div>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-1 bg-[#111111] border border-white/10 rounded-xl p-1 w-fit mx-auto mb-12">
            {(['weekly', 'monthly', 'yearly'] as BillingCycle[]).map(cycle => (
              <button
                key={cycle}
                onClick={() => setBilling(cycle)}
                className={`relative px-5 py-2 text-sm font-semibold rounded-lg capitalize transition-all ${
                  billing === cycle
                    ? 'bg-[#CAFF33] text-black shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {cycle}
                {cycle === 'yearly' && billing !== 'yearly' && (
                  <span className="absolute -top-2.5 -right-1 text-[9px] font-bold bg-[#CAFF33] text-black px-1 py-0.5 rounded-full">SAVE 30%</span>
                )}
              </button>
            ))}
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {/* Free Trial */}
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
              <p className="text-sm font-semibold text-white/60 mb-1">Free Trial</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-black">₦0</span>
              </div>
              <p className="text-xs text-white/30 mb-6">5 documents for 30 days</p>
              <ul className="space-y-3 mb-8">
                {freePlanFeatures.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                    <CheckCircle2 className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full py-3 rounded-xl border border-white/10 hover:border-white/20 text-sm font-semibold text-white/70 hover:text-white transition-all"
              >
                Start Free Trial
              </button>
            </div>

            {/* Pro — highlighted */}
            <div className="relative bg-[#111111] border-2 border-[#CAFF33] rounded-2xl p-6 shadow-2xl shadow-[#CAFF33]/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-[#CAFF33] text-black text-[10px] font-black px-3 py-1 rounded-full tracking-wider uppercase">Most Popular</span>
              </div>
              <p className="text-sm font-semibold text-[#CAFF33] mb-1">Pro</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-black">₦{prices.pro}</span>
                <span className="text-white/40 text-sm pb-1">{suffix}</span>
              </div>
              <p className="text-xs text-white/30 mb-6">For growing businesses</p>
              <ul className="space-y-3 mb-8">
                {proPlanFeatures.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                    <CheckCircle2 className="w-4 h-4 text-[#CAFF33] mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full py-3 rounded-xl bg-[#CAFF33] hover:bg-[#d4ff55] text-black text-sm font-bold transition-all hover:shadow-lg hover:shadow-[#CAFF33]/25"
              >
                Get Started with Pro
              </button>
            </div>

            {/* Business */}
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
              <p className="text-sm font-semibold text-white/60 mb-1">Business</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-black">₦{prices.business}</span>
                <span className="text-white/40 text-sm pb-1">{suffix}</span>
              </div>
              <p className="text-xs text-white/30 mb-6">For teams & agencies</p>
              <ul className="space-y-3 mb-8">
                {businessPlanFeatures.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                    <CheckCircle2 className="w-4 h-4 text-[#CAFF33]/60 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full py-3 rounded-xl border border-[#CAFF33]/30 hover:border-[#CAFF33]/60 text-sm font-semibold text-[#CAFF33] hover:text-[#CAFF33] transition-all"
              >
                Get Business Plan
              </button>
            </div>
          </div>

          {/* Admin note */}
          <p className="text-center text-xs text-white/25 mt-8 flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3" />
            Free trial usage is admin-controlled. Contact support to adjust limits for your account.
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#CAFF33] text-xs font-bold tracking-widest uppercase mb-3">Loved by Businesses</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Don't just take our word for it</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map(({ name, role, quote }) => (
              <div key={name} className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-[#CAFF33] fill-[#CAFF33]" />
                  ))}
                </div>
                <p className="text-sm text-white/60 leading-relaxed mb-5">"{quote}"</p>
                <div>
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-white/30">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────── */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative bg-[#CAFF33]/5 border border-[#CAFF33]/20 rounded-3xl p-12 overflow-hidden">
            <div className="absolute inset-0 bg-[#CAFF33]/3 blur-3xl" />
            <div className="relative">
              <Zap className="w-10 h-10 text-[#CAFF33] mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
                Ready to professionalise your documents?
              </h2>
              <p className="text-white/40 mb-8">Join 500+ businesses already using InvoicePro. Start free — no credit card required.</p>
              <button
                id="cta-banner-btn"
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 bg-[#CAFF33] hover:bg-[#d4ff55] text-black font-bold px-8 py-4 rounded-xl text-base transition-all hover:shadow-xl hover:shadow-[#CAFF33]/25 hover:-translate-y-0.5"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#CAFF33] flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-black" />
              </div>
              <span className="font-bold">InvoicePro</span>
            </div>
            {/* Links */}
            <div className="flex items-center gap-6 text-sm text-white/30">
              {['Features', 'Pricing', 'Privacy Policy', 'Terms of Service'].map(link => (
                <a key={link} href="#" className="hover:text-white transition-colors">{link}</a>
              ))}
            </div>
            {/* Copyright */}
            <p className="text-xs text-white/20">
              &copy; {new Date().getFullYear()} InvoicePro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
