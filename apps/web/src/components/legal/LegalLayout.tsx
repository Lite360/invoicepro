import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

interface Props {
  onBack: () => void;
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalLayout({ onBack, title, lastUpdated, children }: Props) {
  return (
    <div className="min-h-screen bg-[#0B161E] text-white font-sans antialiased flex flex-col">
      <header className="sticky top-0 w-full z-50 bg-[#0B161E] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#0F9D58] flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-white text-sm">InvoicePro</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="bg-[#131B27] rounded-2xl shadow-sm border border-white/5 p-8 sm:p-12">
          <h1 className="text-3xl font-black text-white mb-2">{title}</h1>
          <p className="text-sm text-white/40 font-medium mb-10 pb-6 border-b border-white/10">
            Last Updated: {lastUpdated}
          </p>
          <div className="prose prose-sm sm:prose-base max-w-none prose-invert text-white/70 prose-headings:text-white prose-a:text-[#0F9D58]">
            {children}
          </div>
        </div>
      </main>

      <footer className="bg-[#0B161E] py-8 text-center border-t border-white/10">
        <p className="text-xs text-white/40 font-medium">
          &copy; {new Date().getFullYear()} InvoicePro. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
