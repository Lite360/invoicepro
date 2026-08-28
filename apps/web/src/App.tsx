import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { AppHeader } from './components/AppHeader';
import { SetupWizard } from './components/SetupWizard';
import { Dashboard } from './components/Dashboard';
import { CompanySettings } from './components/CompanySettings';
import { InvoiceModule } from './components/InvoiceModule';
import { QuotationModule } from './components/QuotationModule';
import { ReceiptModule } from './components/ReceiptModule';
import { LetterModule } from './components/LetterModule';
import { DocumentHistory } from './components/DocumentHistory';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { CustomerModule } from './components/CustomerModule';
import { PaymentModule } from './components/PaymentModule';
import { SubscriptionModule } from './components/SubscriptionModule';
import { AdminPanel } from './components/AdminPanel';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { LandingPage } from './components/LandingPage';
import { ContactPage } from './components/ContactPage';
import { FeaturesPage } from './components/FeaturesPage';
import { PricingPage } from './components/PricingPage';
import { ReviewsPage } from './components/ReviewsPage';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { Terms } from './components/legal/Terms';
import { AmlKyc } from './components/legal/AmlKyc';
import { RefundPolicy } from './components/legal/RefundPolicy';
import { Company, User } from './types';

type PageView = 'landing' | 'login' | 'signup' | 'privacy' | 'terms' | 'aml-kyc' | 'refund-policy' | 'contact' | 'features' | 'pricing' | 'reviews';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [pageView, setPageView] = useState<PageView>('landing');

  const [company, setCompany] = useState<Company | null>(null);
  const [setupRequired, setSetupRequired] = useState<boolean | null>(null);
  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Preview Modal State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewDocType, setPreviewDocType] = useState<'Invoice' | 'Quotation' | 'Receipt' | 'Letter'>('Invoice');
  const [previewDocData, setPreviewDocData] = useState<any>(null);

  // On mount: check for existing token
  useEffect(() => {
    const token = localStorage.getItem('invoicepro_token');
    const storedUser = localStorage.getItem('invoicepro_user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('invoicepro_token');
        localStorage.removeItem('invoicepro_user');
      }
    }
    setAuthLoading(false);
  }, []);

  // Check company once authenticated
  useEffect(() => {
    if (user) {
      checkCompany();
    }
  }, [user]);

  const checkCompany = async () => {
    try {
      const token = localStorage.getItem('invoicepro_token');
      const res = await fetch('/api/company', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.setupRequired) {
        setSetupRequired(true);
      } else {
        setCompany(data.company);
        setSetupRequired(false);
      }
    } catch (e) {
      console.error('Error fetching company data', e);
      setSetupRequired(true);
    }
  };

  const handleAuthSuccess = (token: string, loggedInUser: User) => {
    localStorage.setItem('invoicepro_token', token);
    localStorage.setItem('invoicepro_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('invoicepro_token');
    localStorage.removeItem('invoicepro_user');
    setUser(null);
    setCompany(null);
    setSetupRequired(null);
    setCurrentView('dashboard');
    setPageView('landing');
  };

  const handleSetupComplete = (newCompany: Company) => {
    setCompany(newCompany);
    setSetupRequired(false);
    setCurrentView('dashboard');
  };

  const handleOpenPreview = (type: 'Invoice' | 'Quotation' | 'Receipt' | 'Letter', data: any) => {
    setPreviewDocType(type);
    setPreviewDocData(data);
    setPreviewModalOpen(true);
  };

  // ── Auth loading spinner ──────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#CAFF33] flex items-center justify-center">
            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#CAFF33]/20 border-t-[#CAFF33]" />
        </div>
      </div>
    );
  }

  // ── Not authenticated ─────────────────────────────────────────
  if (!user) {
    if (pageView === 'privacy') return <PrivacyPolicy onBack={() => setPageView('landing')} />;
    if (pageView === 'terms') return <Terms onBack={() => setPageView('landing')} />;
    if (pageView === 'aml-kyc') return <AmlKyc onBack={() => setPageView('landing')} />;
    if (pageView === 'refund-policy') return <RefundPolicy onBack={() => setPageView('landing')} />;
    if (pageView === 'features') {
      return <FeaturesPage onNavigate={(view) => setPageView(view as PageView)} onSignIn={() => setPageView('login')} onGetStarted={() => setPageView('signup')} />;
    }
    if (pageView === 'pricing') {
      return <PricingPage onNavigate={(view) => setPageView(view as PageView)} onSignIn={() => setPageView('login')} onGetStarted={() => setPageView('signup')} />;
    }
    if (pageView === 'reviews') {
      return <ReviewsPage onNavigate={(view) => setPageView(view as PageView)} onSignIn={() => setPageView('login')} onGetStarted={() => setPageView('signup')} />;
    }
    if (pageView === 'contact') {
      return (
        <ContactPage
          onNavigate={(view) => setPageView(view as PageView)}
          onSignIn={() => setPageView('login')}
          onGetStarted={() => setPageView('signup')}
        />
      );
    }
    if (pageView === 'signup') {
      return (
        <SignupPage
          onSignupSuccess={handleAuthSuccess}
          onGoToLogin={() => setPageView('login')}
        />
      );
    }
    if (pageView === 'login') {
      return (
        <LoginPage
          onLoginSuccess={handleAuthSuccess}
          onGoToSignup={() => setPageView('signup')}
        />
      );
    }
    return (
      <LandingPage
        onGetStarted={() => setPageView('signup')}
        onSignIn={() => setPageView('login')}
        onNavigate={(view) => setPageView(view as PageView)}
      />
    );
  }

  // ── Authenticated: company setup check ───────────────────────
  if (setupRequired === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#CAFF33]/30 border-t-[#CAFF33]" />
      </div>
    );
  }

  if (setupRequired) {
    return <SetupWizard onComplete={handleSetupComplete} />;
  }

  if (currentView === 'admin' && user?.role === 'ADMIN') {
    return <AdminPanel onBack={() => setCurrentView('dashboard')} />;
  }

  // ── Main authenticated app layout: Sidebar + Header + Content ─
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Fixed left sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        company={company}
        user={user}
        onLogout={handleLogout}
      />

      {/* Right-side column: header + scrollable content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky top header */}
        <AppHeader
          currentView={currentView}
          setCurrentView={setCurrentView}
          company={company}
          user={user}
        />

        {/* Scrollable main content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-auto">
          {currentView === 'dashboard' && (
            <Dashboard
              setCurrentView={setCurrentView}
              company={company}
              onSelectDocumentForPreview={handleOpenPreview}
              user={user}
            />
          )}
          {currentView === 'invoices' && (
            <InvoiceModule company={company} onPreview={handleOpenPreview} />
          )}
          {currentView === 'quotations' && (
            <QuotationModule
              company={company}
              onPreview={handleOpenPreview}
              onInvoiceCreated={() => setCurrentView('invoices')}
            />
          )}
          {currentView === 'receipts' && (
            <ReceiptModule company={company} onPreview={handleOpenPreview} />
          )}
          {currentView === 'letters' && (
            <LetterModule company={company} onPreview={handleOpenPreview} />
          )}
          {currentView === 'history' && (
            <DocumentHistory company={company} onSelectDocumentForPreview={handleOpenPreview} />
          )}
          {currentView === 'customers' && (
            <CustomerModule company={company} />
          )}
          {currentView === 'payments' && (
            <PaymentModule company={company} />
          )}
          {currentView === 'subscription' && (
            <SubscriptionModule user={user} />
          )}
          {currentView === 'settings' && (
            <CompanySettings company={company} onUpdateCompany={handleSetupComplete} />
          )}
        </main>
      </div>

      {/* Global Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        company={company}
        type={previewDocType}
        data={previewDocData}
      />
    </div>
  );
}

export default App;
