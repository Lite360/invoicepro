import React from 'react';
import { LegalLayout } from './LegalLayout';

export function Terms({ onBack }: { onBack: () => void }) {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="August 28, 2026" onBack={onBack}>
      <p>
        These Terms of Service constitute a legally binding agreement made between you and InvoicePro concerning your access to and use of our application and services.
      </p>

      <h3>1. Agreement to Terms</h3>
      <p>
        By accessing our service, you agree that you have read, understood, and agreed to be bound by all of these Terms of Service. If you do not agree with all of these Terms, you are prohibited from using the service.
      </p>

      <h3>2. Subscription and Billing</h3>
      <p>
        We offer a 30-day free trial containing 5 free documents. Upgrading to a paid tier (Pro or Business) will require payment via Paystack. All payments are non-refundable unless stated in our Refund Policy.
      </p>

      <h3>3. User Accounts</h3>
      <p>
        You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.
      </p>

      <h3>4. Prohibited Activities</h3>
      <p>
        You may not access or use the service for any purpose other than that for which we make the service available. The service may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
      </p>
    </LegalLayout>
  );
}
