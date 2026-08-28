import React from 'react';
import { LegalLayout } from './LegalLayout';

export function RefundPolicy({ onBack }: { onBack: () => void }) {
  return (
    <LegalLayout title="Refund Policy" lastUpdated="August 28, 2026" onBack={onBack}>
      <p>
        Thank you for choosing InvoicePro. We strive to provide the best billing and invoicing software for your business. Please read this policy carefully regarding refunds for our subscription plans.
      </p>

      <h3>1. Monthly Subscriptions</h3>
      <p>
        For monthly subscriptions, we do not offer refunds. You can cancel your subscription at any time, and you will retain access to the paid features until the end of your current billing cycle.
      </p>

      <h3>2. Annual Subscriptions</h3>
      <p>
        For annual subscriptions, we offer a 14-day money-back guarantee. If you are not satisfied with the service within the first 14 days of your annual subscription purchase, you may request a full refund by contacting our support team.
      </p>

      <h3>3. Exceptions</h3>
      <p>
        Refunds will not be granted if your account has been suspended or terminated due to a violation of our Terms of Service or AML & KYC Policy. 
      </p>

      <h3>4. Contact Us</h3>
      <p>
        To request a refund for an eligible annual subscription, please contact us at support@invoicepro.com with your account details.
      </p>
    </LegalLayout>
  );
}
