import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SetupWizard } from './components/SetupWizard';
import { Dashboard } from './components/Dashboard';
import { CompanySettings } from './components/CompanySettings';
import { InvoiceModule } from './components/InvoiceModule';
import { QuotationModule } from './components/QuotationModule';
import { ReceiptModule } from './components/ReceiptModule';
import { LetterModule } from './components/LetterModule';
import { DocumentHistory } from './components/DocumentHistory';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { Company, User } from './types';

type AuthView = 'login' | 'signup';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authView, setAuthView] = useState<AuthView>('login');

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
    setAuthView('login');
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // ── Not authenticated: show Login or Signup ───────────────────
  if (!user) {
    if (authView === 'signup') {
      return (
        <SignupPage
          onSignupSuccess={handleAuthSuccess}
          onGoToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <LoginPage
        onLoginSuccess={handleAuthSuccess}
        onGoToSignup={() => setAuthView('signup')}
      />
    );
  }

  // ── Authenticated: company setup check spinner ────────────────
  if (setupRequired === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (setupRequired) {
    return <SetupWizard onComplete={handleSetupComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        company={company}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <Dashboard
            setCurrentView={setCurrentView}
            company={company}
            onSelectDocumentForPreview={handleOpenPreview}
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
        {currentView === 'settings' && (
          <CompanySettings company={company} onUpdateCompany={handleSetupComplete} />
        )}
      </main>

      {/* Global Document A4 Live Preview Modal */}
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
