# Walkthrough — BillMint SaaS Platform

BillMint has been fully built and verified with a microservices architecture, featuring 3 independent React frontend applications, 11 backend microservices connected via an API Gateway, database-per-service isolation with automatic file/memory fallback storage, seed data, client-side PDF generation, IGST / CGST+SGST tax rules engine, Customer Invoice History, and HSN/SAC code tracking.

---

## 1. Monorepo & Applications Overview

```text
billmint/
├── apps/
│   ├── web/                # Public Marketing Website (Port 3000)
│   ├── dashboard/          # Authenticated User SaaS Workspace (Port 3001)
│   └── admin/              # Platform Super-Admin Portal (Port 3002)
├── services/
│   ├── api-gateway/        # Port 5000: API Gateway Router & JWT Verification
│   ├── auth-service/       # Port 5001: Authentication & Hashing
│   ├── user-service/       # Port 5002: User Profile Service
│   ├── business-service/   # Port 5003: Business Settings & Profiles
│   ├── customer-service/   # Port 5004: Customer Directory & CRM
│   ├── product-service/    # Port 5005: Products & Services Catalog
│   ├── invoice-service/    # Port 5006: Invoices & Tax Calculations
│   ├── payment-service/    # Port 5007: Payment Records & Reconciliation
│   ├── subscription-service/# Port 5008: SaaS Plans & Upgrades
│   ├── notification-service/# Port 5009: In-app Alerts & Notifications
│   ├── report-service/     # Port 5010: Sales & GST Analytics
│   └── admin-service/      # Port 5011: Admin Operations & Audit Logger
├── packages/
│   ├── shared-types/       # Common Types, Initial Seed Data, Constants
│   └── shared-utils/       # Currency Formatters (₹), GST Tax Calculators, Dates
├── docker-compose.yml       # Docker Compose setup for local container deployment
└── package.json            # Monorepo workspaces configuration
```

---

## 2. Recent Enhancements Added

### 1. IGST vs CGST+SGST Tax Auto-Detection Engine
- **Inter-State Condition (Business State !== Customer State)**: Automatically applies **IGST** (Integrated GST @ 18%).
- **Intra-State Condition (Business State === Customer State)**: Automatically splits into **CGST (9%) + SGST (9%)**.
- Reflected dynamically in Invoice Builder calculations, Invoice Preview cards, Summary totals, and generated PDF documents.

### 2. Customer Invoices History & Statement View
- Clicking any customer card in the **Customers** page opens an interactive **Customer Billing History Modal**.
- Displays:
  - Complete Customer Profile (Company, Contact, Email, Phone, Address, GSTIN, State).
  - Lifetime Financial Summary: Total Invoiced, Total Collected, Outstanding Balance.
  - Complete list of all invoices generated for that specific customer with real-time status badges (`Paid`, `Pending`, `Overdue`, `Draft`), dates, grand total, and a direct link to view/print each invoice.
  - Quick action: "+ Create Invoice for this Customer".

### 3. HSN / SAC Code Support
- Added `hsnSac` code field across:
  - Product/Service catalog (`apps/dashboard/src/pages/ProductsPage.jsx`).
  - Invoice Line Items table (`apps/dashboard/src/pages/InvoiceBuilderPage.jsx`).
  - Invoice View/Preview (`apps/dashboard/src/pages/InvoiceViewPage.jsx`).
  - Generated PDF table column (`apps/dashboard/src/services/pdfGenerator.js`).

---

## 3. Production Build Verification

All three frontend applications were compiled for production using `npm run build:apps`:

```bash
> billmint-platform@1.0.0 build:apps
> npm --prefix apps/web run build && npm --prefix apps/dashboard run build && npm --prefix apps/admin run build

✓ billmint-web build: SUCCESS (5.14s)
✓ billmint-dashboard build: SUCCESS (12.38s)
✓ billmint-admin build: SUCCESS (4.45s)
```

---

## 4. How to Run Locally

1. **Start Development Servers**:
   ```bash
   npm run dev
   ```
   - Public Web App: `http://localhost:3000`
   - User Dashboard: `http://localhost:3001`
   - Admin Panel: `http://localhost:3002`
   - API Gateway: `http://localhost:5000`

2. **Docker Compose**:
   ```bash
   docker compose up
   ```
