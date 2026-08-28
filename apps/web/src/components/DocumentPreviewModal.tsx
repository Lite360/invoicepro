import React from 'react';
import { Printer, Download, X, FileText } from 'lucide-react';
import { Company } from '../types';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  type: 'Invoice' | 'Quotation' | 'Receipt' | 'Letter';
  data: any;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  company,
  type,
  data,
}) => {
  if (!isOpen || !data || !company) return null;

  const primaryColor = company.primaryColor || '#0f172a';
  const secondaryColor = company.secondaryColor || '#2563eb';
  const currencySymbol = company.currency || '$';

  const handlePrint = async () => {
    const win = window.open('', '_blank');
    if (!win) {
      alert('Please allow popups to print this document.');
      return;
    }
    
    win.document.write('<html><head><title>Loading...</title></head><body style="font-family:sans-serif;padding:20px;text-align:center;color:#64748b;">Preparing print document...</body></html>');
    win.document.close();

    try {
      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data, htmlOnly: true }),
      });
      const html = await response.text();

      win.document.open();
      win.document.write(html);
      win.document.close();

      const imgs = win.document.querySelectorAll('img');
      const loadPromises = Array.from(imgs).map(img => 
        new Promise<void>(resolve => {
          if (img.complete) { resolve(); return; }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
      );
      await Promise.all(loadPromises);
      
      setTimeout(() => {
        win.focus();
        win.print();
        // Do NOT call win.close() immediately, as it kills the print dialog on some browsers.
        // Listen to the afterprint event to close the window gracefully.
        win.addEventListener('afterprint', () => {
          win.close();
        });
      }, 500);
    } catch (e) {
      console.error('Print failed', e);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const printEl = document.getElementById('printable-document');
      if (!printEl) return;

      const originalClasses = printEl.className;
      // Strip classes that interfere with PDF bounds or add unnecessary visual frames
      printEl.className = originalClasses
        .replace(/print:[^\s]+/g, '')
        .replace('min-h-[297mm]', '')
        .replace('shadow-xl', '')
        .replace('border-slate-200', '')
        .replace('border', '')
        .replace('rounded-xl', '');
      
      // @ts-ignore
      const opt = {
        margin:       [0, 0, 0, 0],
        filename:     `${data.number || 'document'}.pdf`,
        image:        { type: 'jpeg', quality: 1.0 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // @ts-ignore
      await html2pdf().set(opt).from(printEl).save();
      
      printEl.className = originalClasses;
    } catch (e) {
      console.error('Frontend PDF Generation failed', e);
    }
  };

  let docTitle = type.toUpperCase();
  if (type === 'Letter' && data.type) {
    docTitle = data.type.toUpperCase();
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 gap-4">
          <div className="flex items-center justify-between md:justify-start w-full md:w-auto">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{type} Preview</h3>
                <p className="text-xs text-slate-400"># {data.number}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 md:px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-medium rounded-lg transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-600/30 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="hidden md:block p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document View */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-100">
          <div
            id="printable-document"
            className="bg-white mx-auto shadow-xl rounded-xl p-10 max-w-3xl relative min-h-[297mm] print:min-h-0 print:p-8 print:shadow-none print:border-none print:m-0 text-slate-800 border border-slate-200"
          >
            {/* Watermark */}
            {company.watermarkUrl && (
              <img
                src={company.watermarkUrl}
                alt="Watermark"
                className="absolute inset-0 m-auto opacity-[0.04] max-w-[60%] max-h-[60%] pointer-events-none select-none"
              />
            )}

            {/* Header */}
            <div className="border-b-2 pb-6 mb-8 flex justify-between items-start" style={{ borderColor: primaryColor }}>
              <div>
                {company.logoUrl && (
                  <img src={company.logoUrl} alt="Logo" className="max-h-16 mb-3 object-contain" />
                )}
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: primaryColor }}>
                  {company.companyName}
                </h1>
                <p className="text-xs text-slate-600 mt-1">{company.businessAddress}</p>
                <p className="text-xs text-slate-600">
                  Tel: {company.phone} | Email: {company.email} {company.website ? `| ${company.website}` : ''}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Reg No: {company.registrationNumber} {company.taxNumber ? `| Tax No: ${company.taxNumber}` : ''}
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-extrabold tracking-wider" style={{ color: secondaryColor }}>
                  {docTitle}
                </h2>
                <p className="text-sm font-bold text-slate-900 mt-1"># {data.number}</p>
              </div>
            </div>

            {/* Body Details */}
            {(type === 'Invoice' || type === 'Quotation') && (
              <>
                <div className="flex justify-between mb-8">
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">Billed To:</p>
                    <p className="text-base font-bold text-slate-900 mt-1">{data.customerName || 'N/A'}</p>
                    {data.customerEmail && <p className="text-xs text-slate-600">{data.customerEmail}</p>}
                    {data.customerPhone && <p className="text-xs text-slate-600">{data.customerPhone}</p>}
                    {data.customerAddress && <p className="text-xs text-slate-600 mt-1">{data.customerAddress}</p>}
                  </div>
                  <div className="text-right text-xs text-slate-700 space-y-1">
                    <p><strong>Date:</strong> {data.date}</p>
                    <p><strong>Due Date:</strong> {data.dueDate}</p>
                    {data.projectTitle && <p><strong>Project:</strong> {data.projectTitle}</p>}
                    <div className="mt-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold rounded-full text-[11px]">
                        {data.status || 'Issued'}
                      </span>
                    </div>
                  </div>
                </div>

                <table className="w-full text-sm mb-8 border-collapse">
                  <thead>
                    <tr className="text-white text-left font-semibold" style={{ backgroundColor: primaryColor }}>
                      <th className="p-3 text-center w-12">#</th>
                      <th className="p-3">Item Description</th>
                      <th className="p-3 text-center w-20">Qty</th>
                      <th className="p-3 text-right w-28">Unit Price</th>
                      <th className="p-3 text-right w-32">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(data.items || []).map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="p-3 text-center text-slate-500">{idx + 1}</td>
                        <td className="p-3 font-medium text-slate-800">{item.description}</td>
                        <td className="p-3 text-center text-slate-600">{item.quantity}</td>
                        <td className="p-3 text-right text-slate-600">
                          {currencySymbol}{Number(item.unitPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-right font-semibold text-slate-900">
                          {currencySymbol}{Number(item.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end mb-8">
                  <div className="w-72 space-y-2 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-semibold">{currencySymbol}{Number(data.subtotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    {data.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Discount ({data.discountPercent}%):</span>
                        <span>-{currencySymbol}{Number(data.discountAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    {data.vatAmount > 0 && (
                      <div className="flex justify-between text-slate-600">
                        <span>VAT ({data.vatPercent}%):</span>
                        <span>+{currencySymbol}{Number(data.vatAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-3 border-t-2 font-bold text-lg" style={{ borderColor: primaryColor, color: primaryColor }}>
                      <span>Grand Total:</span>
                      <span>{currencySymbol}{Number(data.grandTotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                {data.notes && (
                  <div className="text-xs text-slate-600 mb-4">
                    <strong>Notes:</strong> {data.notes}
                  </div>
                )}
                {data.paymentInstructions && (
                  <div className="text-xs text-slate-600 mb-6">
                    <strong>Payment Instructions:</strong> {data.paymentInstructions}
                  </div>
                )}
              </>
            )}

            {type === 'Receipt' && (
              <>
                <div className="flex justify-between mb-8 pb-6 border-b border-slate-200">
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">Received From:</p>
                    <p className="text-xl font-bold text-slate-900 mt-1">{data.customerName || 'N/A'}</p>
                  </div>
                  <div className="text-right text-xs text-slate-700 space-y-1">
                    <p><strong>Payment Date:</strong> {data.paymentDate}</p>
                    <p><strong>Payment Method:</strong> {data.paymentMethod}</p>
                    {data.referenceNumber && <p><strong>Ref #:</strong> {data.referenceNumber}</p>}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center mb-8">
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Amount Received</p>
                  <p className="text-4xl font-extrabold text-emerald-600 mt-2">
                    {currencySymbol}{Number(data.amountPaid || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  {data.balance > 0 ? (
                    <p className="text-sm font-semibold text-rose-600 mt-2">
                      Remaining Balance: {currencySymbol}{Number(data.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  ) : (
                    <p className="text-xs text-emerald-600 font-medium mt-2">✓ Paid in Full</p>
                  )}
                </div>

                {data.notes && (
                  <p className="text-xs text-slate-600 mb-6">
                    <strong>Notes:</strong> {data.notes}
                  </p>
                )}
              </>
            )}

            {type === 'Letter' && (
              <>
                <div className="mb-8">
                  <p className="text-xs text-slate-600"><strong>Date:</strong> {data.date}</p>
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">To:</p>
                    <p className="text-base font-bold text-slate-900 mt-1">{data.recipientName}</p>
                    {data.recipientTitle && <p className="text-xs text-slate-600">{data.recipientTitle}</p>}
                    {data.recipientAddress && <p className="text-xs text-slate-600">{data.recipientAddress}</p>}
                  </div>
                </div>

                <div className="text-base font-bold mb-6 pb-2 border-b-2" style={{ color: primaryColor, borderColor: secondaryColor }}>
                  SUBJECT: {data.subject}
                </div>

                <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap mb-12">
                  {data.body}
                </div>
              </>
            )}

            {/* Signature & Bank Footer */}
            <div className="mt-12 flex justify-between items-end pt-6 border-t border-slate-100">
              <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="font-bold mb-1" style={{ color: primaryColor }}>BANKING DETAILS</p>
                <p><strong>Bank:</strong> {company.bankName}</p>
                <p><strong>Account Name:</strong> {company.accountName}</p>
                <p><strong>Account Number:</strong> {company.accountNumber}</p>
              </div>

              {company.signatureUrl && (type !== 'Letter' || data.showSignature !== false) && (
                <div className="text-center">
                  <img src={company.signatureUrl} alt="Signature" className="max-h-14 mx-auto mb-1" />
                  <div className="border-t border-slate-400 w-44 pt-1 text-xs font-semibold text-slate-700">
                    Authorized Signature
                  </div>
                </div>
              )}
            </div>

            {/* Footer Text */}
            <div className="mt-12 pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
              <span>{company.footerText || `${company.companyName} - Thank you for your business!`}</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
