export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;       // 'USER' | 'ADMIN'
  plan?: string;       // 'FREE' | 'PRO' | 'BUSINESS'
  trialUsed?: number;
  isActive?: boolean;
  planExpiry?: string | null;
  createdAt?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  trialUsed: number;
  isActive: boolean;
  planExpiry: string | null;
  createdAt: string;
}

export interface AdminSettings {
  id: string;
  freeTrialLimit: number;
  pricingJson: string;
  trialDocTypes: string;
}

export interface AdminPayment {
  id: string;
  userId: string | null;
  userName: string;
  userEmail: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  reference: string | null;
  createdAt: string;
}

export interface Company {
  id?: string;
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
  invoicePrefix?: string;
  quotationPrefix?: string;
  receiptPrefix?: string;
  letterPrefix?: string;
}

export interface LineItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id?: string;
  number: string;
  date: string;
  dueDate: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  projectTitle?: string;
  items: LineItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  vatPercent: number;
  vatAmount: number;
  grandTotal: number;
  notes?: string;
  paymentInstructions?: string;
  status: string;
  createdAt?: string;
}

export interface Quotation {
  id?: string;
  number: string;
  date: string;
  dueDate: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  projectTitle?: string;
  items: LineItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  vatPercent: number;
  vatAmount: number;
  grandTotal: number;
  notes?: string;
  paymentInstructions?: string;
  status: string;
  convertedToInvoiceId?: string | null;
  createdAt?: string;
}

export interface Receipt {
  id?: string;
  number: string;
  customerName: string;
  paymentDate: string;
  paymentMethod: string;
  amountPaid: number;
  balance: number;
  referenceNumber?: string;
  notes?: string;
  status: string;
  createdAt?: string;
}

export interface Letter {
  id?: string;
  number: string;
  type: string;
  date: string;
  recipientName: string;
  recipientTitle?: string;
  recipientAddress?: string;
  subject: string;
  body: string;
  showSignature: boolean;
  status: string;
  createdAt?: string;
}

export interface DocumentRecord {
  id: string;
  documentNumber: string;
  type: 'Invoice' | 'Quotation' | 'Receipt' | 'Letter';
  customer: string;
  amount: number;
  status: string;
  date: string;
  fileUrl?: string;
  referenceId?: string;
  createdAt: string;
}
