import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Shield, 
  Zap, 
  FileCheck, 
  Users, 
  Package, 
  CreditCard, 
  Download, 
  Share2, 
  Receipt, 
  BarChart3, 
  Clock, 
  Hash, 
  PieChart, 
  Building,
  ChevronDown,
  HelpCircle,
  Star
} from 'lucide-react';
import InvoicePreviewMock from '../components/InvoicePreviewMock';

export default function HomePage() {
  const DASHBOARD_URL = 'http://localhost:3001';
  const [activeFaq, setActiveFaq] = useState(null);

  const features = [
    { icon: FileCheck, title: "Professional Invoices", desc: "Create pixel-perfect, branded PDF invoices in seconds with custom templates." },
    { icon: Users, title: "Customer Management", desc: "Keep track of clients, billing history, addresses, and GSTIN details seamlessly." },
    { icon: Package, title: "Product & Service Catalog", desc: "Save your offerings with pre-configured prices, SKUs, and default tax rates." },
    { icon: CreditCard, title: "Payment Tracking", desc: "Record cash, UPI, bank transfer, and card payments. Track partial & overdue bills." },
    { icon: Download, title: "Instant PDF Generation", desc: "Generate print-ready, high-resolution PDFs formatted specifically for business use." },
    { icon: Share2, title: "Invoice Sharing", desc: "Share invoices directly via Email, WhatsApp link, or secure download URLs." },
    { icon: Receipt, title: "GST & Tax Auto-Calculation", desc: "Automatic CGST, SGST, IGST calculations tailored to Indian tax compliance." },
    { icon: BarChart3, title: "Business Financial Reports", desc: "In-depth sales, revenue, outstanding receivables, and GST tax liability reports." },
    { icon: Clock, title: "Recurring Invoices", desc: "Set up automated weekly, monthly, or annual recurring invoice schedules." },
    { icon: Hash, title: "Invoice Number Management", desc: "Flexible custom prefixes, automatic sequential numbering, and fiscal year tags." },
    { icon: PieChart, title: "Dashboard Analytics", desc: "Real-time revenue charts, payment status distribution, and sales trends." },
    { icon: Building, title: "Multiple Business Profiles", desc: "Manage multiple companies, brands, or freelance entities under one subscription." }
  ];

  const steps = [
    { step: "01", title: "Create Your Account", desc: "Sign up in 30 seconds with no credit card required." },
    { step: "02", title: "Add Business Details", desc: "Configure your logo, address, GSTIN, and bank/UPI accounts." },
    { step: "03", title: "Create Your Invoice", desc: "Pick a client, add items, auto-calculate tax, and customize terms." },
    { step: "04", title: "Download, Print or Share", desc: "Export crisp PDFs or send direct links to clients instantly." }
  ];

  const benefits = [
    "Ultra-easy to use — no accounting background needed",
    "Lightning fast invoice creation in under 60 seconds",
    "3 Professional templates (Classic, Modern, Minimal)",
    "Secure cloud storage with 99.9% uptime SLA",
    "Accessible anywhere on Laptop, Tablet, or Mobile phone",
    "Specifically built for freelancers, agencies, and SMBs",
    "Built-in Indian GST calculation rules & HSN code support"
  ];

  const faqs = [
    { q: "What is BillMint?", a: "BillMint is a modern online billing and invoice platform designed for business owners, freelancers, agencies, and service providers to effortlessly generate invoices, manage customers, calculate GST, and track payments." },
    { q: "Can I create invoices for free?", a: "Yes! BillMint offers a Free plan allowing you to generate up to 5 invoices every month with full access to PDF downloads and basic analytics." },
    { q: "Can I download invoices as PDF?", a: "Absolutly. Invoices generated on BillMint can be immediately downloaded as crisp, high-resolution PDFs ready for printing or emailing." },
    { q: "Does BillMint support Indian GST?", a: "Yes, BillMint fully supports GST rules including auto-calculating CGST, SGST, IGST, and displaying GSTIN numbers and state codes on invoices." },
    { q: "Can I track payments and partial payments?", a: "Yes, you can record payments via UPI, Bank Transfer, Cash, or Card, track partially paid invoices, and send automated overdue reminders." },
    { q: "Can I use BillMint on my mobile phone?", a: "Yes! BillMint's user interface is 100% responsive and optimized for mobile browsers." }
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_20%,#d1fae5_0%,transparent_100%)] opacity-70"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 bg-white/80 border border-mint-200 shadow-sm px-4 py-1.5 rounded-full text-xs font-semibold text-mint-800 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-mint-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Introducing BillMint 2.0 — Next-Gen Invoicing</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-charcoal-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Simple Billing. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-600 via-emerald-600 to-teal-700">
              Smarter Business.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Create professional invoices, manage customers, track payments, and keep your business billing organized — all from one simple, trustworthy platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a 
              href={`${DASHBOARD_URL}/register`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 text-base font-bold text-white bg-mint-600 hover:bg-mint-700 px-8 py-4 rounded-xl shadow-lg shadow-mint-600/30 hover:shadow-xl transition-all active:scale-95"
            >
              <span>Start Billing Free</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 px-8 py-4 rounded-xl shadow-sm transition-all"
            >
              <span>Explore Features</span>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-mint-600" /> No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-mint-600" /> Free Plan Available Forever
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-mint-600" /> GST Compliant PDF Exports
            </span>
          </div>

          {/* Hero Invoice Preview Component */}
          <div className="pt-10 max-w-5xl mx-auto">
            <InvoicePreviewMock />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold text-mint-600 uppercase tracking-widest bg-mint-100 px-3 py-1 rounded-full">
            Comprehensive SaaS Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
            Everything you need to run your business billing effortlessly
          </h2>
          <p className="text-slate-600">
            Designed to save hours every month, eliminate accounting headaches, and ensure prompt payments from clients.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => {
            const IconComponent = f.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-mint-200 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-mint-50 text-mint-600 flex items-center justify-center mb-4 group-hover:bg-mint-600 group-hover:text-white transition-colors">
                  <IconComponent className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-lg font-bold text-charcoal-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-mint-400 uppercase tracking-widest bg-mint-950 border border-mint-800 px-3 py-1 rounded-full">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From zero to paid in four easy steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, idx) => (
              <div key={idx} className="relative bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
                <span className="text-4xl font-black text-mint-500/30 mb-2 block">{s.step}</span>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why BillMint? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-mint-900 via-charcoal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-mint-400 uppercase tracking-widest bg-mint-950/80 border border-mint-700 px-3 py-1 rounded-full">
                Why Choose BillMint?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Built for modern Indian business owners & freelancers
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Traditional accounting software is clunky, expensive, and overly complex. BillMint provides a streamlined invoicing experience designed specifically for real-world speed and clarity.
              </p>
              <div className="pt-2 space-y-3">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-mint-400 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <a 
                  href={`${DASHBOARD_URL}/register`}
                  className="inline-flex items-center gap-2 text-sm font-bold bg-mint-500 hover:bg-mint-400 text-charcoal-900 px-6 py-3.5 rounded-xl shadow-lg transition-all"
                >
                  Create Your First Invoice Now
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Visual Card */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs text-mint-300 font-semibold border-b border-white/10 pb-3">
                <span>Monthly Billing Volume</span>
                <span className="text-emerald-400">+34% growth</span>
              </div>
              <div className="text-3xl font-extrabold text-white">₹1,84,500.00</div>
              <p className="text-xs text-slate-400">Total processed this month across 42 paid client invoices.</p>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-mint-400 w-3/4 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-mint-600 uppercase tracking-widest bg-mint-100 px-3 py-1 rounded-full">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold text-charcoal-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between font-bold text-charcoal-900 hover:text-mint-600"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-mint-600' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-sm text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-mint-600 text-white rounded-3xl p-10 sm:p-16 text-center space-y-6 shadow-xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to simplify your business billing?
          </h2>
          <p className="text-mint-100 text-base sm:text-lg max-w-xl mx-auto">
            Join thousands of smart business owners saving time with BillMint today. Setup takes less than 60 seconds.
          </p>
          <div>
            <a 
              href={`${DASHBOARD_URL}/register`}
              className="inline-flex items-center gap-2 text-base font-bold bg-white text-mint-900 hover:bg-slate-100 px-8 py-4 rounded-xl shadow-lg transition-all"
            >
              Start Billing Free
              <ArrowRight className="w-5 h-5 text-mint-600" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
