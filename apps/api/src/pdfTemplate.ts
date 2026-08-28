export interface CompanyDetails {
  companyName: string;
  logoUrl?: string | null;
  watermarkUrl?: string | null;
  businessAddress: string;
  phone: string;
  email: string;
  website?: string | null;
  registrationNumber: string;
  taxNumber?: string | null;
  bankName: string;
  accountName: string;
  accountNumber: string;
  signatureUrl?: string | null;
  footerText?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  currency?: string;
}

export function renderDocumentHTML(
  company: CompanyDetails,
  docType: 'Invoice' | 'Quotation' | 'Receipt' | 'Letter',
  docData: any
): string {
  const primaryColor = company.primaryColor || '#0f172a';
  const secondaryColor = company.secondaryColor || '#2563eb';
  const currencySymbol = docData.currency || company.currency || '$';

  let docTitle = docType.toUpperCase();
  if (docType === 'Letter' && docData.type) {
    docTitle = docData.type.toUpperCase();
  }

  // Render document-specific body
  let bodyContent = '';

  if (docType === 'Invoice' || docType === 'Quotation') {
    const itemsHTML = (docData.items || [])
      .map(
        (item: any, idx: number) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px; text-align: center; color: #64748b;">${idx + 1}</td>
        <td style="padding: 12px; font-weight: 500; color: #1e293b;">${item.description || ''}</td>
        <td style="padding: 12px; text-align: center; color: #475569;">${item.quantity || 1}</td>
        <td style="padding: 12px; text-align: right; color: #475569;">${currencySymbol}${Number(item.unitPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        <td style="padding: 12px; text-align: right; font-weight: 600; color: #0f172a;">${currencySymbol}${Number(item.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
      </tr>
    `
      )
      .join('');

    bodyContent = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">Billed To:</div>
          <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 4px;">${docData.customerName || 'N/A'}</div>
          ${docData.customerEmail ? `<div style="font-size: 13px; color: #475569;">${docData.customerEmail}</div>` : ''}
          ${docData.customerPhone ? `<div style="font-size: 13px; color: #475569;">${docData.customerPhone}</div>` : ''}
          ${docData.customerAddress ? `<div style="font-size: 13px; color: #475569; margin-top: 2px;">${docData.customerAddress}</div>` : ''}
        </div>
        <div style="text-align: right;">
          <div style="font-size: 13px; color: #475569;"><strong>Date:</strong> ${docData.date || ''}</div>
          <div style="font-size: 13px; color: #475569; margin-top: 4px;"><strong>Due Date:</strong> ${docData.dueDate || ''}</div>
          ${docData.projectTitle ? `<div style="font-size: 13px; color: #475569; margin-top: 4px;"><strong>Project:</strong> ${docData.projectTitle}</div>` : ''}
          <div style="margin-top: 8px;"><span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background: #e0effe; color: ${secondaryColor}; font-size: 12px; font-weight: 700;">${docData.status || 'Issued'}</span></div>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <thead>
          <tr style="background: ${primaryColor}; color: #ffffff;">
            <th style="padding: 10px 12px; text-align: center; width: 40px;">#</th>
            <th style="padding: 10px 12px; text-align: left;">Item Description</th>
            <th style="padding: 10px 12px; text-align: center; width: 70px;">Qty</th>
            <th style="padding: 10px 12px; text-align: right; width: 110px;">Unit Price</th>
            <th style="padding: 10px 12px; text-align: right; width: 120px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
        <div style="width: 280px;">
          <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #475569;">
            <span>Subtotal:</span>
            <span style="font-weight: 600;">${currencySymbol}${Number(docData.subtotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          ${
            docData.discountAmount > 0
              ? `<div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #059669;">
                  <span>Discount (${docData.discountPercent}%):</span>
                  <span>-${currencySymbol}${Number(docData.discountAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>`
              : ''
          }
          ${
            docData.vatAmount > 0
              ? `<div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #475569;">
                  <span>VAT (${docData.vatPercent}%):</span>
                  <span>+${currencySymbol}${Number(docData.vatAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>`
              : ''
          }
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 2px solid ${primaryColor}; margin-top: 6px; font-size: 18px; font-weight: 700; color: ${primaryColor};">
            <span>Grand Total:</span>
            <span>${currencySymbol}${Number(docData.grandTotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      ${docData.notes ? `<div style="margin-bottom: 20px; font-size: 13px; color: #475569;"><strong>Notes:</strong> ${docData.notes}</div>` : ''}
      ${docData.paymentInstructions ? `<div style="margin-bottom: 20px; font-size: 13px; color: #475569;"><strong>Payment Instructions:</strong> ${docData.paymentInstructions}</div>` : ''}
    `;
  } else if (docType === 'Receipt') {
    bodyContent = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px;">
        <div>
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">Received From:</div>
          <div style="font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 4px;">${docData.customerName || 'N/A'}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 13px; color: #475569;"><strong>Payment Date:</strong> ${docData.paymentDate || ''}</div>
          <div style="font-size: 13px; color: #475569; margin-top: 4px;"><strong>Payment Method:</strong> ${docData.paymentMethod || 'Bank Transfer'}</div>
          ${docData.referenceNumber ? `<div style="font-size: 13px; color: #475569; margin-top: 4px;"><strong>Ref / Transaction #:</strong> ${docData.referenceNumber}</div>` : ''}
        </div>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 30px;">
        <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600;">Amount Received</div>
        <div style="font-size: 36px; font-weight: 800; color: #16a34a; margin-top: 6px;">
          ${currencySymbol}${Number(docData.amountPaid || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        ${docData.balance > 0 ? `<div style="font-size: 14px; color: #dc2626; margin-top: 6px; font-weight: 600;">Remaining Balance: ${currencySymbol}${Number(docData.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>` : '<div style="font-size: 13px; color: #16a34a; margin-top: 4px; font-weight: 500;">✓ Payment Completed in Full</div>'}
      </div>

      ${docData.notes ? `<div style="margin-bottom: 20px; font-size: 13px; color: #475569;"><strong>Notes / Purpose:</strong> ${docData.notes}</div>` : ''}
    `;
  } else if (docType === 'Letter') {
    bodyContent = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <div style="font-size: 13px; color: #475569;"><strong>Date:</strong> ${docData.date || ''}</div>
          <div style="margin-top: 16px;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">To:</div>
            <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 4px;">${docData.recipientName || ''}</div>
            ${docData.recipientTitle ? `<div style="font-size: 13px; color: #475569;">${docData.recipientTitle}</div>` : ''}
            ${docData.recipientAddress ? `<div style="font-size: 13px; color: #475569;">${docData.recipientAddress}</div>` : ''}
          </div>
        </div>
      </div>

      <div style="font-size: 18px; font-weight: 700; color: ${primaryColor}; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid ${secondaryColor};">
        SUBJECT: ${docData.subject || ''}
      </div>

      <div style="font-size: 14px; line-height: 1.7; color: #334155; white-space: pre-wrap; margin-bottom: 40px;">
        ${docData.body || ''}
      </div>
    `;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${docType} - ${docData.number || ''}</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: #0f172a;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
    }
    .page-container {
      position: relative;
      width: 210mm;
      min-height: 297mm;
      padding: 20mm 20mm 25mm 20mm;
      box-sizing: border-box;
    }
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0.05;
      max-width: 60%;
      max-height: 60%;
      pointer-events: none;
      z-index: 0;
    }
    .content-layer {
      position: relative;
      z-index: 1;
    }
    .header-bar {
      border-bottom: 3px solid ${primaryColor};
      padding-bottom: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .footer-bar {
      position: absolute;
      bottom: 15mm;
      left: 20mm;
      right: 20mm;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 11px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="page-container">
    ${company.watermarkUrl ? `<img src="${company.watermarkUrl}" class="watermark" />` : ''}

    <div class="content-layer">
      <!-- HEADER -->
      <div class="header-bar">
        <div>
          ${company.logoUrl ? `<img src="${company.logoUrl}" style="max-height: 60px; margin-bottom: 8px;" />` : ''}
          <div style="font-size: 22px; font-weight: 800; color: ${primaryColor};">${company.companyName}</div>
          <div style="font-size: 12px; color: #475569; margin-top: 2px;">${company.businessAddress}</div>
          <div style="font-size: 12px; color: #475569;">Tel: ${company.phone} | Email: ${company.email} ${company.website ? `| ${company.website}` : ''}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Reg No: ${company.registrationNumber} ${company.taxNumber ? `| Tax No: ${company.taxNumber}` : ''}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 26px; font-weight: 900; color: ${secondaryColor}; letter-spacing: 1px;">${docTitle}</div>
          <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 4px;"># ${docData.number || ''}</div>
        </div>
      </div>

      <!-- BODY CONTENT -->
      ${bodyContent}

      <!-- SIGNATURE & BANK DETAILS SECTION -->
      <div style="margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; page-break-inside: avoid;">
        <div style="font-size: 12px; color: #475569; background: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="font-weight: 700; color: ${primaryColor}; margin-bottom: 4px;">BANKING DETAILS</div>
          <div><strong>Bank:</strong> ${company.bankName}</div>
          <div><strong>Account Name:</strong> ${company.accountName}</div>
          <div><strong>Account Number:</strong> ${company.accountNumber}</div>
        </div>

        ${
          company.signatureUrl && (docType !== 'Letter' || docData.showSignature !== false)
            ? `
          <div style="text-align: center;">
            <img src="${company.signatureUrl}" style="max-height: 50px; margin-bottom: 4px;" />
            <div style="border-top: 1px solid #cbd5e1; width: 180px; padding-top: 4px; font-size: 12px; font-weight: 600; color: #334155;">
              Authorized Signature
            </div>
          </div>
        `
            : ''
        }
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer-bar">
      <div>${company.footerText || `${company.companyName} - Thank you for your business!`}</div>
      <div>Page 1 of 1</div>
    </div>
  </div>
</body>
</html>
  `;
}
