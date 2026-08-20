import React from 'react';
import { 
  FileCheck, Users, Package, CreditCard, Download, Share2, 
  Receipt, BarChart3, Clock, Hash, PieChart, Building, ArrowRight 
} from 'lucide-react';

export default function FeaturesPage() {
  const DASHBOARD_URL = 'http://localhost:3001';

  const featureList = [
    { icon: FileCheck, title: "Professional Invoices", desc: "Create customized, professional invoices in seconds. Support for logo upload, customizable payment terms, reference numbers, and 3 modern templates." },
    { icon: Users, title: "Customer Management", desc: "Maintain a clean CRM of all client contacts, shipping addresses, GSTIN/PAN info, lifetime billing history, and outstanding balance tracking." },
    { icon: Package, title: "Product & Service Catalog", desc: "Save products and services with pre-configured prices, SKUs, tax rates, and units. Instantly select items when generating invoices." },
    { icon: CreditCard, title: "Payment Tracking", desc: "Record payments made via Cash, UPI, Bank Transfer, Card, or Cheque. Automatic reconciliation updates status from Pending to Paid." },
    { icon: Download, title: "Invoice PDF Generation", desc: "Instant high-resolution PDF generation formatted specifically for real-world printing and professional email attachments." },
    { icon: Share2, title: "Invoice Sharing", desc: "Send invoice links directly to clients via WhatsApp, Email, or copy direct download links." },
    { icon: Receipt, title: "GST/Tax Support", desc: "Built-in support for Indian GST (CGST, SGST, IGST) auto-calculations based on client location, HSN codes, and customizable tax rates." },
    { icon: BarChart3, title: "Business Reports", desc: "Comprehensive financial reporting including Sales Reports, Revenue breakdowns, GST tax liabilities, and Outstanding payment aging." },
    { icon: Clock, title: "Recurring Invoices", desc: "Automate recurring client billing schedules (Weekly, Monthly, Quarterly, Yearly) for subscription or retainer services." },
    { icon: Hash, title: "Invoice Number Management", desc: "Custom invoice prefixes (e.g. INV-2026-), sequential numbering, and fiscal year tracking." },
    { icon: PieChart, title: "Dashboard Analytics", desc: "At-a-glance KPI summary cards, revenue trend charts, and payment distribution graphs." },
    { icon: Building, title: "Multiple Business Profiles", desc: "Manage multiple brands or company entities under one single BillMint account seamlessly." }
  ];

  return (
    <div className="py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-charcoal-900 tracking-tight">
          Everything You Need to Manage Billing & Invoicing
        </h1>
        <p className="text-slate-600 text-lg">
          Explore all the features that make BillMint the preferred billing platform for modern freelancers, agencies, and business owners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featureList.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-mint-100 text-mint-700 flex items-center justify-center mb-6">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 mb-3">{f.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-mint-600 text-white rounded-3xl p-10 text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to start invoicing with BillMint?</h2>
        <p className="text-mint-100 max-w-lg mx-auto text-sm">Create your free account today and generate your first professional invoice in under a minute.</p>
        <div>
          <a href={`${DASHBOARD_URL}/register`} className="inline-flex items-center gap-2 bg-white text-mint-900 font-bold px-6 py-3 rounded-xl shadow">
            Start Billing Free <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
