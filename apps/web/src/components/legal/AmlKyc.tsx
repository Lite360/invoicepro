import React from 'react';
import { LegalLayout } from './LegalLayout';

export function AmlKyc({ onBack }: { onBack: () => void }) {
  return (
    <LegalLayout title="AML & KYC Policy" lastUpdated="August 28, 2026" onBack={onBack}>
      <p>
        To prevent financial crime and ensure the integrity of our platform, InvoicePro operates in compliance with Anti-Money Laundering (AML) and Know Your Customer (KYC) regulations applicable in Nigeria.
      </p>

      <h3>1. Know Your Customer (KYC)</h3>
      <p>
        We require users to provide accurate business information upon registration. For businesses collecting large volumes of payments via our Paystack integration, additional verification documents (such as CAC registration certificates and valid IDs of directors) may be requested.
      </p>

      <h3>2. Anti-Money Laundering (AML)</h3>
      <p>
        InvoicePro monitors transactions for suspicious activities. We reserve the right to freeze accounts or report suspicious transactions to relevant authorities, including the Economic and Financial Crimes Commission (EFCC), without prior notice.
      </p>

      <h3>3. Payment Processor Compliance</h3>
      <p>
        Since we integrate with Paystack for payment collection, all users must also adhere to Paystack's Acceptable Use Policy and undergo their independent verification processes when enabling payment links.
      </p>
    </LegalLayout>
  );
}
