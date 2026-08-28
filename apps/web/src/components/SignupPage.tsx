import React, { useState } from 'react';
import { Eye, EyeOff, FileText, Zap, Palette, CreditCard, User as UserIcon, Phone } from 'lucide-react';
import { User } from '../types';

interface SignupPageProps {
  onSignupSuccess: (token: string, user: User) => void;
  onGoToLogin: () => void;
}

export function SignupPage({ onSignupSuccess, onGoToLogin }: SignupPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }
      onSignupSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* ── LEFT SIDE (Form) ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 overflow-y-auto py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Top Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-[#0F9D58] flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">InvoicePro</span>
          </div>

          {/* Toggle Buttons */}
          <div className="flex p-1 bg-slate-50 rounded-xl mb-10 border border-slate-100">
            <button
              type="button"
              onClick={onGoToLogin}
              className="flex-1 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Sign In
            </button>
            <button className="flex-1 py-2.5 text-sm font-bold text-[#0F9D58] bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center gap-2">
              <UserIcon className="w-4 h-4" />
              Create Account
            </button>
          </div>

          {/* Header */}
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Create your account</h2>
          <p className="text-sm text-slate-500 mb-8 font-medium">Join thousands of businesses using InvoicePro</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-100 text-sm rounded-lg font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3.5 pl-11 text-sm focus:ring-2 focus:ring-[#0F9D58]/20 transition-all text-slate-900 font-medium placeholder-slate-400"
                  placeholder="John Doe"
                  required
                />
                <UserIcon className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3.5 pl-11 text-sm focus:ring-2 focus:ring-[#0F9D58]/20 transition-all text-slate-900 font-medium placeholder-slate-400"
                  placeholder="you@example.com"
                  required
                />
                <MailIcon className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Phone Number <span className="text-slate-400 font-normal normal-case">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3.5 pl-11 text-sm focus:ring-2 focus:ring-[#0F9D58]/20 transition-all text-slate-900 font-medium placeholder-slate-400"
                  placeholder="+234 800 000 0000"
                />
                <Phone className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3.5 pl-11 pr-10 text-sm focus:ring-2 focus:ring-[#0F9D58]/20 transition-all text-slate-900 font-medium placeholder-slate-400"
                    placeholder="••••••••••••"
                    required
                  />
                  <LockIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3.5 pl-11 text-sm focus:ring-2 focus:ring-[#0F9D58]/20 transition-all text-slate-900 font-medium placeholder-slate-400"
                    placeholder="Confirm"
                    required
                  />
                  <LockIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F9D58] hover:bg-[#0c864b] text-white font-bold rounded-xl py-3.5 text-sm transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Creating account...' : (
                <>
                  <UserIcon className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[11px] font-medium text-slate-400 mt-6">
            By creating an account, you agree to our <a href="#" className="text-[#0F9D58] hover:underline">Terms of Service</a> and <a href="#" className="text-[#0F9D58] hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>

      {/* ── RIGHT SIDE (Banner) ──────────────────────────────── */}
      <div className="hidden lg:flex flex-1 bg-[#0F9D58] items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        
        <div className="max-w-md w-full relative z-10 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl mx-auto flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10">
            <FileText className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Professional Invoicing Made Simple
          </h2>
          <p className="text-white/80 font-medium mb-10 leading-relaxed">
            Create branded invoices, quotations, and receipts in seconds. Get paid faster with integrated payment links.
          </p>

          <div className="space-y-4 text-left">
            <FeatureBox icon={Zap} title="Lightning Fast" desc="Create invoices in under 60 seconds" />
            <FeatureBox icon={Palette} title="Fully Branded" desc="Your logo, colors, and signature" />
            <FeatureBox icon={CreditCard} title="Online Payments" desc="Paystack-powered payment links" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureBox({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="font-bold text-white text-sm">{title}</p>
        <p className="text-xs text-white/70 font-medium">{desc}</p>
      </div>
    </div>
  );
}

function MailIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function LockIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
