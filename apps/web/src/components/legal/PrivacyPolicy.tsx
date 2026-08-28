import React from 'react';
import { LegalLayout } from './LegalLayout';

export function PrivacyPolicy({ onBack }: { onBack: () => void }) {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="August 28, 2026" onBack={onBack}>
      <p>
        At InvoicePro, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our service.
      </p>
      
      <h3>1. Information We Collect</h3>
      <p>
        We may collect information about you in a variety of ways. The information we may collect includes personal data such as your name, email address, phone number, and company details when you register for an account.
      </p>

      <h3>2. Use of Your Information</h3>
      <p>
        Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. We use your information to create and manage your account, process payments securely via Paystack, and send transactional emails (such as invoices and receipts).
      </p>

      <h3>3. Disclosure of Your Information</h3>
      <p>
        We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners.
      </p>

      <h3>4. Data Security</h3>
      <p>
        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
      </p>
    </LegalLayout>
  );
}
