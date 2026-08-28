import React from 'react';
import { FileText, Star } from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
  onSignIn: () => void;
  onGetStarted: () => void;
}

export function ReviewsPage({ onNavigate, onSignIn, onGetStarted }: Props) {
  const testimonials = [
    { name: 'Adaeze Okonkwo', role: 'Freelance Designer, Lagos', quote: 'InvoicePro completely transformed how I bill clients. I went from sending Word docs to professional branded docs in minutes.', avatar: 'A', color: 'bg-pink-500' },
    { name: 'Emeka Nwosu',    role: 'Digital Agency Owner, Abuja', quote: 'The Paystack integration is seamless. Clients pay directly from the invoice and I get notified instantly. Game changer.', avatar: 'E', color: 'bg-emerald-500' },
    { name: 'Funmi Adeleke',  role: 'Consultant, Port Harcourt', quote: 'Finally a Nigerian invoicing tool that actually works properly. The automatic receipt generation alone saves me hours every week.', avatar: 'F', color: 'bg-teal-500' },
  ];

  return (
    <div className="min-h-screen bg-[#0B101E] text-slate-900 font-sans antialiased flex flex-col">
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
      <main className="flex-1 py-24 px-4 bg-[#0B101E]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#0F9D58] text-sm font-bold tracking-widest uppercase mb-3">Loved by Businesses</p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-6">Don't just take our word for it</h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">See what business owners and freelancers across Nigeria are saying about InvoicePro.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, quote, avatar, color }) => (
              <div key={name} className="bg-[#131B27] border border-white/5 rounded-3xl p-8 hover:border-[#0F9D58]/30 transition-all hover:bg-[#151f2d]">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#0F9D58] fill-[#0F9D58]" />
                  ))}
                </div>
                <p className="text-base text-white/80 leading-relaxed mb-8 font-medium">"{quote}"</p>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm shadow-inner`}>
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{name}</p>
                    <p className="text-xs text-white/50 font-medium">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
