import React from 'react';
import { FileSpreadsheet, FileCheck, Receipt, ArrowRight, Zap, Star, Shield, CheckCircle2, FileText, Menu, X } from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
  onSignIn: () => void;
  onGetStarted: () => void;
}

export function FeaturesPage({ onNavigate, onSignIn, onGetStarted }: Props) {
  const [mobileMenuOpen, React_useState] = React.useState(false);
  
  const features = [
    { icon: FileSpreadsheet, title: 'Professional Invoices', desc: 'Create branded invoices with your logo, colors, and digital signature in seconds.' },
    { icon: FileCheck, title: 'Quotations', desc: 'Send beautiful quotes that clients can accept online with a single click.' },
    { icon: Receipt, title: 'Automatic Receipts', desc: 'Generate and send receipts instantly as soon as a payment is recorded.' },
    { icon: FileText, title: 'Official Letters', desc: 'Draft and send official company letters using your pre-configured letterhead.' },
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
      <main className="flex-1">
        <section className="py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[#0F9D58] text-sm font-bold tracking-widest uppercase mb-3">Powerful Features</p>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-6">Everything you need to bill like a pro</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg">Stop struggling with Word documents and Excel sheets. InvoicePro gives you a complete toolkit to manage your client billing professionally.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-[#0F9D58]/30 hover:bg-white hover:shadow-xl hover:shadow-[#0F9D58]/5 transition-all">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-[#0F9D58]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
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
