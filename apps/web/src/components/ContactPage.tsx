import React, { useState } from 'react';
import { ArrowLeft, FileText, Mail, Phone, MapPin, Send } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (view: string) => void;
  onSignIn: () => void;
  onGetStarted: () => void;
}

export function ContactPage({ onNavigate, onSignIn, onGetStarted }: ContactPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B161E] text-white font-sans antialiased flex flex-col">
      {/* ── WHITE HEADER ────────────────────────────────────────────── */}
      <header className="sticky top-0 w-full z-50 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-8 h-8 rounded-lg bg-[#0F9D58] flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">InvoicePro</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Reviews'].map(link => (
              <button
                key={link}
                onClick={() => onNavigate(link.toLowerCase())}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                {link}
              </button>
            ))}
            <button
              onClick={() => onNavigate('contact')}
              className="text-sm font-bold text-[#0F9D58]"
            >
              Contact
            </button>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            <button onClick={onSignIn} className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="bg-[#0F9D58] hover:bg-[#0c864b] text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black mb-6">Get in touch</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Have questions about our pricing, need a custom integration, or just want to say hi? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact Form */}
          <div className="bg-[#131B27] border border-white/5 p-8 rounded-2xl">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">First Name</label>
                  <input type="text" className="w-full bg-[#0B161E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#0F9D58] focus:ring-1 focus:ring-[#0F9D58] transition-all outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Last Name</label>
                  <input type="text" className="w-full bg-[#0B161E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#0F9D58] focus:ring-1 focus:ring-[#0F9D58] transition-all outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" className="w-full bg-[#0B161E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#0F9D58] focus:ring-1 focus:ring-[#0F9D58] transition-all outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Message</label>
                <textarea rows={4} className="w-full bg-[#0B161E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#0F9D58] focus:ring-1 focus:ring-[#0F9D58] transition-all outline-none resize-none" required></textarea>
              </div>
              <button className="w-full bg-[#0F9D58] hover:bg-[#0c864b] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#0F9D58]" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Email us</h3>
                <p className="text-white/50 text-sm mb-2">Our friendly team is here to help.</p>
                <a href="mailto:support@invoicepro.com" className="text-[#0F9D58] hover:underline font-medium">support@invoicepro.com</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#0F9D58]" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Office</h3>
                <p className="text-white/50 text-sm mb-2">Come say hello at our office HQ.</p>
                <p className="text-white/80 font-medium">123 Tech Avenue, Victoria Island<br />Lagos, Nigeria</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-[#0F9D58]" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">WhatsApp</h3>
                <p className="text-white/50 text-sm mb-2">Mon-Fri from 8am to 5pm.</p>
                <a href="https://wa.me/2349054256786" target="_blank" rel="noopener noreferrer" className="text-[#0F9D58] hover:underline font-medium">+234 905 425 6786</a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="bg-[#0B161E] py-12 px-4 border-t border-white/10 mt-auto">
        <div className="max-w-6xl mx-auto text-center text-xs text-white/30">
          <p>&copy; {new Date().getFullYear()} InvoicePro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
