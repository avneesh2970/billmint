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
    id: 'bus_nova_001',
    name: 'Nova Creative Studio',
    businessType: 'Agency / Service Provider',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    email: 'billing@novacreative.in',
    phone: '+91 98765 43210',
    website: 'https://novacreative.in',
    address: 'Suite 402, Mint Heights, Cyber City',
    city: 'Bengaluru',
    state: 'Karnataka',
    stateCode: '29',
    country: 'India',
    pincode: '560100',
    gstin: '29ABCDE1234F1ZH',
    pan: 'ABCDE1234F',
    taxType: 'GST',
    defaultTaxRate: 18,
    bankDetails: {
      bankName: 'HDFC Bank',
      accountName: 'Nova Creative Studio Pvt Ltd',
      accountNumber: '50200012345678',
      ifsc: 'HDFC0001234',
      upiId: 'novacreative@hdfcbank'
    },
    invoicePrefix: 'INV-2026-',
    nextInvoiceNumber: 4,
    defaultTerms: '1. Payment due within 15 days of invoice date.\n2. Please mention Invoice Number in UPI/Bank transfer notes.',
    defaultNotes: 'Thank you for partnering with Nova Creative Studio!'
  },

  customers: [
    {
      id: 'cust_001',
      name: 'Rahul Sharma',
      company: 'ABC Enterprises Pvt. Ltd.',
      email: 'rahul@abcenterprises.com',
      phone: '+91 98111 22334',
      address: 'Plot 14, Tech Park, Sector 62',
      city: 'Noida',
      state: 'Uttar Pradesh',
      stateCode: '07',
      pincode: '201301',
      gstin: '07AAACA1234B1ZB',
      pan: 'AAACA1234B',
      notes: 'Key Enterprise Client - Net 30 terms'
    },
    {
      id: 'cust_002',
      name: 'Priya Patel',
      company: 'Aura Health & Fitness',
      email: 'priya@aurahealth.in',
      phone: '+91 98222 33445',
      address: '12 Mint Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      stateCode: '27',
      pincode: '400050',
      gstin: '27AABCA5678C1ZD',
      pan: 'AABCA5678C',
      notes: 'Monthly retainer client'
    },
    {
      id: 'cust_003',
      name: 'Vikram Sengupta',
      company: 'Apex Digital Solutions',
      email: 'vikram@apexdigital.io',
      phone: '+91 98333 44556',
      address: '88 Salt Lake Sector V',
      city: 'Kolkata',
      state: 'West Bengal',
      stateCode: '19',
      pincode: '700091',
      gstin: '19AACCA9876D1ZF',
      pan: 'AACCA9876D',
      notes: 'Ad-hoc project client'
    }
  ],

  products: [
    {
      id: 'prod_001',
      sku: 'SRV-WEB-01',
      name: 'Website Development',
      hsnSac: '998314',
      description: 'Custom React & Node.js full-stack web application development',
      type: 'Service',
      price: 75000,
      taxRate: 18,
      unit: 'Project'
    },
    {
      id: 'prod_002',
      sku: 'SRV-UIUX-02',
      name: 'UI/UX Design',
      hsnSac: '998313',
      description: 'High-fidelity Figma wireframes, UI design system, & responsive layouts',
      type: 'Service',
      price: 35000,
      taxRate: 18,
      unit: 'Project'
    },
    {
      id: 'prod_003',
      sku: 'SRV-HST-03',
      name: 'Managed Cloud Hosting',
      hsnSac: '998315',
      description: 'Annual premium SSL, CDN, high-speed VPS hosting & daily backups',
      type: 'Service',
      price: 12000,
      taxRate: 18,
      unit: 'Year'
    },
    {
      id: 'prod_004',
      sku: 'SRV-SEO-04',
      name: 'SEO & Marketing Package',
      hsnSac: '998319',
      description: 'On-page optimization, content strategy, & monthly performance reports',
      type: 'Service',
      price: 25000,
      taxRate: 18,
      unit: 'Month'
    },
    {
      id: 'prod_005',
      sku: 'SRV-SMM-05',
      name: 'Social Media Management',
      hsnSac: '998319',
      description: 'Content creation, design graphics, and strategy across 3 channels',
      type: 'Service',
      price: 18000,
      taxRate: 18,
      unit: 'Month'
    }
  ],

  invoices: [
    {
      id: 'inv_001',
      invoiceNumber: 'INV-2026-001',
      customerId: 'cust_001',
      customerName: 'ABC Enterprises Pvt. Ltd.',
      customerEmail: 'rahul@abcenterprises.com',
      customerAddress: 'Plot 14, Tech Park, Sector 62, Noida, UP',
      customerGstin: '07AAACA1234B1ZB',
      customerState: 'Uttar Pradesh',
      businessState: 'Karnataka',
      isInterState: true,
      issueDate: '2026-08-01',
      dueDate: '2026-08-15',
      status: 'Paid',
      template: 'Modern',
      items: [
        {
          id: 'item_1',
          description: 'Website Development (Phase 1)',
          hsnSac: '998314',
          quantity: 1,
          rate: 75000,
          discountPercent: 0,
          taxRate: 18,
          amount: 75000
        },
        {
          id: 'item_2',
          description: 'UI/UX Design Package',
          hsnSac: '998313',
          quantity: 1,
          rate: 30000,
          discountPercent: 10,
          taxRate: 18,
          amount: 27000
        },
        {
          id: 'item_3',
          description: 'Managed Cloud Hosting (1 Year)',
          hsnSac: '998315',
          quantity: 1,
          rate: 12000,
          discountPercent: 0,
          taxRate: 18,
          amount: 12000
        }
      ],
      subtotal: 114000,
      totalDiscount: 3000,
      taxableAmount: 114000,
      cgst: 0,
      sgst: 0,
      igst: 20520,
      totalTax: 20520,
      shipping: 0,
      roundOff: 0.00,
      grandTotal: 134520,
      amountPaid: 134520,
      balanceDue: 0,
      notes: 'Inter-state transaction (Karnataka -> Uttar Pradesh). IGST @ 18% applied.',
      terms: 'Payment due within 15 days of invoice date.'
    },
    {
      id: 'inv_002',
      invoiceNumber: 'INV-2026-002',
      customerId: 'cust_002',
      customerName: 'Aura Health & Fitness',
      customerEmail: 'priya@aurahealth.in',
      customerAddress: '12 Mint Road, Bandra West, Mumbai',
      customerGstin: '27AABCA5678C1ZD',
      issueDate: '2026-08-05',
      dueDate: '2026-08-20',
      status: 'Pending',
      template: 'Classic',
      items: [
        {
          id: 'item_1',
          description: 'Social Media Management - August 2026',
          quantity: 1,
          rate: 18000,
          discountPercent: 0,
          taxRate: 18,
          amount: 18000
        }
      ],
      subtotal: 18000,
      totalDiscount: 0,
      taxableAmount: 18000,
      cgst: 1620,
      sgst: 1620,
      totalTax: 3240,
      shipping: 0,
      roundOff: 0.00,
      grandTotal: 21240,
      amountPaid: 0,
      balanceDue: 21240,
      notes: 'Monthly billing cycle.',
      terms: 'Net 15 days payment terms.'
    },
    {
      id: 'inv_003',
      invoiceNumber: 'INV-2026-003',
      customerId: 'cust_003',
      customerName: 'Apex Digital Solutions',
      customerEmail: 'vikram@apexdigital.io',
      customerAddress: '88 Salt Lake Sector V, Kolkata',
      customerGstin: '19AACCA9876D1ZF',
      issueDate: '2026-07-10',
      dueDate: '2026-07-25',
      status: 'Overdue',
      template: 'Minimal',
      items: [
        {
          id: 'item_1',
          description: 'SEO Audit & Keyword Optimization',
          quantity: 1,
          rate: 25000,
          discountPercent: 0,
          taxRate: 18,
          amount: 25000
        }
      ],
      subtotal: 25000,
      totalDiscount: 0,
      taxableAmount: 25000,
      cgst: 2250,
      sgst: 2250,
      totalTax: 4500,
      shipping: 0,
      roundOff: 0.00,
      grandTotal: 29500,
      amountPaid: 0,
      balanceDue: 29500,
      notes: 'Second reminder sent.',
      terms: 'Net 15 days.'
    }
  ],

  payments: [
    {
      id: 'pay_001',
      invoiceId: 'inv_001',
      invoiceNumber: 'INV-2026-001',
      customerName: 'ABC Enterprises Pvt. Ltd.',
      amount: 134520,
      paymentDate: '2026-08-10',
      paymentMethod: 'Bank Transfer',
      transactionId: 'HDFC9876543210',
      notes: 'Full payment received into HDFC Account'
    }
  ],

  recurringInvoices: [
    {
      id: 'rec_001',
      customerId: 'cust_002',
      customerName: 'Aura Health & Fitness',
      frequency: 'Monthly',
      startDate: '2026-08-01',
      endDate: '2027-08-01',
      amount: 21240,
      status: 'Active',
      lastGenerated: '2026-08-05'
    }
  ],

  vendors: [
    {
      id: 'vend_001',
      name: 'CloudScale Technologies Pvt. Ltd.',
      company: 'CloudScale Tech',
      email: 'billing@cloudscale.in',
      phone: '+91 98999 11223',
      address: 'Tech Hub, Sector 5',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      gstin: '29AAACC1111A1Z1',
      pan: 'AAACC1111A',
      notes: 'Primary VPS & CDN Server Infrastructure Provider'
    },
    {
      id: 'vend_002',
      name: 'DesignCraft Media House',
      company: 'DesignCraft Solutions',
      email: 'accounts@designcraft.io',
      phone: '+91 98888 22334',
      address: 'MG Road, Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      gstin: '07AAACD2222B1Z2',
      pan: 'AAACD2222B',
      notes: 'External Graphics & Motion Asset Contractor'
    }
  ],

  purchaseBills: [
    {
      id: 'pbill_001',
      billNumber: 'BILL-2026-088',
      vendorId: 'vend_001',
      vendorName: 'CloudScale Tech',
      vendorGstin: '29AAACC1111A1Z1',
      vendorState: 'Karnataka',
      businessState: 'Karnataka',
      isInterState: false,
      billDate: '2026-08-02',
      dueDate: '2026-08-16',
      status: 'Paid',
      items: [
        { description: 'High Speed Dedicated VPS Cluster (August)', quantity: 1, rate: 20000, taxRate: 18, amount: 20000 }
      ],
      subtotal: 20000,
      totalTax: 3600,
      cgst: 1800,
      sgst: 1800,
      igst: 0,
      grandTotal: 23600,
      amountPaid: 23600,
      balanceDue: 0,
      itcEligible: true,
      notes: 'Server infrastructure cost. Eligible for 100% Input Tax Credit.'
    },
    {
      id: 'pbill_002',
      billNumber: 'BILL-2026-092',
      vendorId: 'vend_002',
      vendorName: 'DesignCraft Solutions',
      vendorGstin: '07AAACD2222B1Z2',
      vendorState: 'Delhi',
      businessState: 'Karnataka',
      isInterState: true,
      billDate: '2026-08-05',
      dueDate: '2026-08-20',
      status: 'Pending',
      items: [
        { description: '3D Brand Mascot & Animation Pack', quantity: 1, rate: 15000, taxRate: 18, amount: 15000 }
      ],
      subtotal: 15000,
      totalTax: 2700,
      cgst: 0,
      sgst: 0,
      igst: 2700,
      grandTotal: 17700,
      amountPaid: 0,
      balanceDue: 17700,
      itcEligible: true,
      notes: 'Inter-state purchase (Delhi -> Karnataka). IGST @ 18% applied.'
    }
  ],

  notifications: [
    {
      id: 'notif_001',
      title: 'Invoice Paid',
      message: 'Invoice INV-2026-001 (₹1,34,520) was paid by ABC Enterprises.',
      type: 'success',
      read: false,
      timestamp: '2026-08-10T14:30:00Z'
    },
    {
      id: 'notif_002',
      title: 'Overdue Alert',
      message: 'Invoice INV-2026-003 (₹29,500) for Apex Digital Solutions is overdue by 23 days.',
      type: 'warning',
      read: false,
      timestamp: '2026-08-12T09:15:00Z'
    },
    {
      id: 'notif_003',
      title: 'Revenue Milestone',
      message: 'Your total monthly billing crossed ₹1,80,000 this month! 🎉',
      type: 'info',
      read: true,
      timestamp: '2026-08-15T11:00:00Z'
    }
  ]
};
