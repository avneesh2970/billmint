// BillMint Shared Types & Constants

export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
};

export const INVOICE_STATUS = {
  DRAFT: 'Draft',
  PENDING: 'Pending',
  PAID: 'Paid',
  PARTIALLY_PAID: 'Partially Paid',
  OVERDUE: 'Overdue'
};

export const PAYMENT_METHODS = {
  CASH: 'Cash',
  UPI: 'UPI',
  BANK_TRANSFER: 'Bank Transfer',
  CARD: 'Card',
  CHEQUE: 'Cheque',
  OTHER: 'Other'
};

export const RECURRING_FREQUENCIES = {
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly',
  YEARLY: 'Yearly'
};

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      'Up to 5 Invoices/month',
      'Manage up to 10 Customers',
      'Basic Invoice Templates',
      'PDF Download',
      'Basic Dashboard Analytics'
    ],
    invoiceLimit: 5,
    customerLimit: 10
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 299,
    priceYearly: 2990,
    features: [
      'Unlimited Invoices',
      'Unlimited Customers',
      'Premium Invoice Templates (Classic, Modern, Minimal)',
      'GST & Tax Auto-Calculation',
      'Payment Tracking & Receipts',
      'Recurring Invoices',
      'Business Financial Reports',
      'Direct Invoice Sharing',
      'Priority Customer Support'
    ],
    popular: true,
    invoiceLimit: Infinity,
    customerLimit: Infinity
  },
  {
    id: 'business',
    name: 'Business',
    priceMonthly: 799,
    priceYearly: 7990,
    features: [
      'Everything in Pro',
      'Multiple Business Profiles (Up to 5)',
      'Advanced GST & Audit Reports',
      'Team Members (Up to 5 seats)',
      'Custom Branding & Monogram',
      'Dedicated Account Support'
    ],
    invoiceLimit: Infinity,
    customerLimit: Infinity
  }
];

export const INITIAL_DEMO_DATA = {
  business: {
    id: 'bus_prod_001',
    name: 'My Business',
    businessType: 'Agency / Service Provider',
    logo: '',
    email: 'contact@mybusiness.com',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: 'Karnataka',
    stateCode: '29',
    country: 'India',
    pincode: '',
    gstin: '',
    pan: '',
    taxType: 'GST',
    defaultTaxRate: 18,
    bankDetails: {
      bankName: '',
      accountName: '',
      accountNumber: '',
      ifsc: '',
      upiId: ''
    },
    invoicePrefix: 'INV-2026-',
    nextInvoiceNumber: 1,
    defaultTerms: '1. Payment due within 15 days of invoice date.\n2. Please mention Invoice Number in UPI/Bank transfer notes.',
    defaultNotes: 'Thank you for your business!'
  },

  customers: [],
  products: [],
  invoices: [],
  payments: [],
  recurringInvoices: [],
  vendors: [],
  purchaseBills: []
};
