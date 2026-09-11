import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  formatCurrency, 
  formatDate, 
  checkIsInterState, 
  getStateCodeFromState, 
  amountToWords 
} from '../../../../packages/shared-utils/index.js';

export function generateInvoicePDF(invoice, business = {}, customer = {}, template = 'Modern') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Template Color Themes (All Neat, Clean & Ink-Friendly)
  const themes = {
    Modern: {
      primary: [15, 23, 42],        // Slate 900
      accent: [16, 149, 106],       // BillMint Emerald
      muted: [100, 116, 139],       // Slate 500
      line: [226, 232, 240],        // Slate 200
      tableHeaderBg: [248, 250, 252],
      tableHeaderFg: [15, 23, 42]
    },
    Classic: {
      primary: [15, 23, 42],        // Slate 900
      accent: [30, 58, 138],        // Royal Navy
      muted: [71, 85, 105],         // Slate 600
      line: [203, 213, 225],        // Slate 300
      tableHeaderBg: [30, 58, 138],
      tableHeaderFg: [255, 255, 255]
    },
    Minimal: {
      primary: [15, 23, 42],        // Charcoal
      accent: [51, 65, 85],         // Slate 700
      muted: [100, 116, 139],       // Slate 500
      line: [226, 232, 240],        // Slate 200
      tableHeaderBg: [255, 255, 255],
      tableHeaderFg: [15, 23, 42]
    },
    GST: {
      primary: [15, 23, 42],        // Deep Slate
      accent: [49, 46, 129],        // Corporate Indigo
      muted: [100, 116, 139],       // Slate 500
      line: [203, 213, 225],        // Slate 300
      tableHeaderBg: [241, 245, 249],
      tableHeaderFg: [15, 23, 42]
    }
  };

  const currentTheme = themes[template] || themes.Modern;
  const primaryColor = currentTheme.primary;
  const accentColor = currentTheme.accent;
  const mutedColor = currentTheme.muted;
  const lineColor = currentTheme.line;

  // Business Details
  const bizName = business?.name || 'Business Workspace';
  const bizState = business?.state || invoice?.businessState || '';
  const bizCode = business?.stateCode || invoice?.businessStateCode || (bizState ? getStateCodeFromState(bizState) : '');
  const bizAddress = [
    business?.address,
    business?.city,
    bizState ? `${bizState}${bizCode ? ` (${bizCode})` : ''}` : '',
    business?.pincode
  ].filter(Boolean).join(', ');

  // Customer Details
  const custName = invoice?.customerName || customer?.company || customer?.name || 'Customer';
  const custState = invoice?.customerState || customer?.state || '';
  const custCode = invoice?.customerStateCode || customer?.stateCode || (custState ? getStateCodeFromState(custState) : '');
  const custAddress = invoice?.customerAddress || [
    customer?.address,
    customer?.city,
    custState ? `${custState}${custCode ? ` (${custCode})` : ''}` : '',
    customer?.pincode
  ].filter(Boolean).join(', ') || 'N/A';

  const isInter = invoice?.isInterState ?? checkIsInterState(bizState, custState, bizCode, custCode);

  const grandTotal = Number(invoice.grandTotal) || 0;
  const subtotal = Number(invoice.subtotal) || grandTotal;
  const totalTax = Number(invoice.totalTax) || (Number(invoice.igst) || (Number(invoice.cgst) + Number(invoice.sgst))) || 0;

  // 1. TOP BRAND ACCENT LINE (Neat, crisp 2mm bar)
  if (template !== 'Minimal') {
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(0, 0, 210, 2.5, 'F');
  }

  // 2. HEADER SECTION
  let y = 14;

  // Left: Seller / Business Info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(bizName, 14, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);

  let bizY = y + 5;
  if (bizAddress) {
    const splitAddr = doc.splitTextToSize(bizAddress, 100);
    doc.text(splitAddr, 14, bizY);
    bizY += (splitAddr.length * 3.8);
  }

  const taxDetails = [];
  if (business?.gstin) taxDetails.push(`GSTIN: ${business.gstin}`);
  if (business?.pan) taxDetails.push(`PAN: ${business.pan}`);
  if (taxDetails.length > 0) {
    doc.text(taxDetails.join('  |  '), 14, bizY);
    bizY += 4;
  }

  const contactDetails = [];
  if (business?.phone) contactDetails.push(`Phone: ${business.phone}`);
  if (business?.email) contactDetails.push(`Email: ${business.email}`);
  if (contactDetails.length > 0) {
    doc.text(contactDetails.join('  |  '), 14, bizY);
    bizY += 4;
  }

  // Right: BillMint Brand & Invoice Meta
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(16, 149, 106); // BillMint green
  doc.text('Bill', 180, y, { align: 'right' });
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Mint', 196, y, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('TAX INVOICE', 196, y + 6, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(invoice.invoiceNumber || 'INV-001', 196, y + 11.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.text(`Date: ${formatDate(invoice.issueDate)}`, 196, y + 16, { align: 'right' });
  doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 196, y + 20.5, { align: 'right' });
  
  if (custState || custCode) {
    doc.text(`Place of Supply: ${custState || 'State'} (${custCode || '29'})`, 196, y + 25, { align: 'right' });
  }

  // Status Badge
  const statusStr = (invoice.status || 'Pending').toUpperCase();
  const statusColor = invoice.status === 'Paid' ? [16, 149, 106] : invoice.status === 'Overdue' ? [225, 29, 72] : [217, 119, 6];
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(170, y + 28, 26, 5, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(statusStr, 183, y + 31.5, { align: 'center' });

  // 3. SEPARATOR LINE
  const sepY = Math.max(bizY + 4, y + 36);
  doc.setDrawColor(lineColor[0], lineColor[1], lineColor[2]);
  doc.setLineWidth(0.25);
  doc.line(14, sepY, 196, sepY);

  // 4. BILLED TO (CUSTOMER) BOX
  const billToY = sepY + 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('BILLED TO (CUSTOMER):', 14, billToY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(custName, 14, billToY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);

  let cY = billToY + 8.5;
  if (custAddress) {
    const splitCust = doc.splitTextToSize(custAddress, 110);
    doc.text(splitCust, 14, cY);
    cY += (splitCust.length * 3.8);
  }

  const custMeta = [];
  if (invoice?.customerGstin || customer?.gstin) custMeta.push(`GSTIN: ${invoice.customerGstin || customer.gstin}`);
  if (customer?.pan) custMeta.push(`PAN: ${customer.pan}`);
  if (custMeta.length > 0) {
    doc.text(custMeta.join('  |  '), 14, cY);
    cY += 4;
  }

  // Right column of Bill-To: Mode of Supply
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.text(isInter ? 'Supply: Inter-State (IGST 18%)' : 'Supply: Intra-State (CGST 9% + SGST 9%)', 196, billToY + 4.5, { align: 'right' });
  doc.text('Reverse Charge (RCM): No', 196, billToY + 9, { align: 'right' });

  // 5. TABLE OF ITEMS
  const tableStartY = Math.max(cY + 4, billToY + 16);
  const items = invoice.items && invoice.items.length > 0 ? invoice.items : [{
    description: 'Services Rendered',
    hsnSac: '998314',
    quantity: 1,
    rate: grandTotal,
    amount: grandTotal,
    taxRate: 18
  }];

  const tableRows = items.map((item, idx) => {
    const qty = Number(item.quantity) || 1;
    const rate = Number(item.rate) || 0;
    const disc = Number(item.discountPercent) || 0;
    const taxableVal = (qty * rate) * (1 - (disc / 100));
    const taxRate = Number(item.taxRate) || 18;
    const itemTotal = Number(item.amount) || (taxableVal * (1 + (taxRate / 100)));

    return [
      (idx + 1).toString(),
      item.description || 'Item',
      item.hsnSac || '998314',
      qty.toString(),
      formatCurrency(rate, true),
      disc > 0 ? `${disc}%` : '-',
      formatCurrency(taxableVal, true),
      `${taxRate}%`,
      formatCurrency(itemTotal, true)
    ];
  });

  autoTable(doc, {
    startY: tableStartY,
    head: [['#', 'Item & Description', 'HSN/SAC', 'Qty', 'Unit Rate', 'Disc', 'Taxable', 'GST', 'Amount']],
    body: tableRows,
    theme: template === 'Classic' ? 'striped' : 'plain',
    headStyles: {
      fillColor: currentTheme.tableHeaderBg,
      textColor: currentTheme.tableHeaderFg,
      fontSize: 8,
      fontStyle: 'bold',
      lineColor: lineColor,
      lineWidth: { top: 0.3, bottom: 0.3 },
      cellPadding: 2.5
    },
    styles: {
      fontSize: 8,
      textColor: [15, 23, 42],
      cellPadding: 2.5,
      lineColor: lineColor,
      lineWidth: { bottom: 0.1 }
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 62 },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 12, halign: 'center' },
      4: { cellWidth: 22, halign: 'right' },
      5: { cellWidth: 12, halign: 'center' },
      6: { cellWidth: 22, halign: 'right' },
      7: { cellWidth: 12, halign: 'center' },
      8: { cellWidth: 24, halign: 'right', fontStyle: 'bold' }
    }
  });

  let finalY = doc.lastAutoTable.finalY + 4;

  // 6. TOTALS & CALCULATIONS (Right) + BANK DETAILS (Left)
  const totalsX = 125;
  let totalsY = finalY;

  // Subtotal
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.text('Taxable Subtotal:', totalsX, totalsY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(formatCurrency(subtotal, true), 196, totalsY, { align: 'right' });
  totalsY += 4.5;

  // Tax Breakdown
  if (isInter) {
    const igstVal = Number(invoice.igst) || totalTax;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.text('IGST (Integrated 18%):', totalsX, totalsY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(formatCurrency(igstVal, true), 196, totalsY, { align: 'right' });
    totalsY += 4.5;
  } else {
    const cgstVal = Number(invoice.cgst) || (totalTax / 2);
    const sgstVal = Number(invoice.sgst) || (totalTax / 2);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.text('CGST (9%):', totalsX, totalsY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(formatCurrency(cgstVal, true), 196, totalsY, { align: 'right' });
    totalsY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.text('SGST (9%):', totalsX, totalsY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(formatCurrency(sgstVal, true), 196, totalsY, { align: 'right' });
    totalsY += 4.5;
  }

  if (invoice.shipping > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.text('Shipping:', totalsX, totalsY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(formatCurrency(invoice.shipping, true), 196, totalsY, { align: 'right' });
    totalsY += 4.5;
  }

  // Line before Total
  doc.setDrawColor(lineColor[0], lineColor[1], lineColor[2]);
  doc.setLineWidth(0.25);
  doc.line(totalsX, totalsY, 196, totalsY);
  totalsY += 4;

  // Grand Total
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Total Amount Due:', totalsX, totalsY);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(formatCurrency(grandTotal, true), 196, totalsY, { align: 'right' });
  totalsY += 5;

  // Paid & Balance Due
  const paid = invoice.status === 'Paid' ? grandTotal : (Number(invoice.amountPaid) || 0);
  const balDue = invoice.status === 'Paid' ? 0 : Math.max(0, grandTotal - paid);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 149, 106);
  doc.text('Amount Paid:', totalsX, totalsY);
  doc.text(formatCurrency(paid, true), 196, totalsY, { align: 'right' });
  totalsY += 4;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(balDue > 0 ? 225 : 100, balDue > 0 ? 29 : 116, balDue > 0 ? 72 : 139);
  doc.text('Balance Due:', totalsX, totalsY);
  doc.text(formatCurrency(balDue, true), 196, totalsY, { align: 'right' });

  // Bank Info (Left Column)
  let bankY = finalY;
  const hasBank = business?.bankDetails?.bankName || business?.bankDetails?.accountNumber || business?.bankDetails?.upiId;

  if (hasBank) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Payment Information:', 14, bankY);
    bankY += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);

    if (business.bankDetails.bankName) {
      doc.text(`Bank: ${business.bankDetails.bankName}`, 14, bankY);
      bankY += 3.5;
    }
    if (business.bankDetails.accountName) {
      doc.text(`A/C Name: ${business.bankDetails.accountName}`, 14, bankY);
      bankY += 3.5;
    }
    if (business.bankDetails.accountNumber) {
      doc.text(`A/C Number: ${business.bankDetails.accountNumber}`, 14, bankY);
      bankY += 3.5;
    }
    if (business.bankDetails.ifsc) {
      doc.text(`IFSC: ${business.bankDetails.ifsc}`, 14, bankY);
      bankY += 3.5;
    }
    if (business.bankDetails.upiId) {
      doc.text(`UPI ID: ${business.bankDetails.upiId}`, 14, bankY);
      bankY += 3.5;
    }
  }

  // 7. AMOUNT IN WORDS
  const wordsY = Math.max(totalsY + 4, bankY + 4);
  const words = amountToWords(grandTotal);

  doc.setDrawColor(lineColor[0], lineColor[1], lineColor[2]);
  doc.setLineWidth(0.2);
  doc.line(14, wordsY, 196, wordsY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.text('Amount in Words:', 14, wordsY + 4);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(words, 44, wordsY + 4);

  // 8. TERMS & AUTHORIZED SIGNATORY
  const bottomY = wordsY + 12;

  // Terms
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.text('Terms & Conditions:', 14, bottomY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  const termsText = invoice.terms || business?.defaultTerms || 'Payment due within 15 days of invoice issue date.';
  const splitTerms = doc.splitTextToSize(termsText, 100);
  doc.text(splitTerms, 14, bottomY + 3.8);

  // Authorized Signatory (Right)
  const sigX = 150;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`For ${bizName}`, sigX, bottomY);

  doc.setDrawColor(lineColor[0], lineColor[1], lineColor[2]);
  doc.setLineWidth(0.3);
  doc.line(sigX, bottomY + 14, sigX + 46, bottomY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.text('Authorized Signatory', sigX + 23, bottomY + 17.5, { align: 'center' });

  // 9. FOOTER (BillMint branding)
  doc.setDrawColor(lineColor[0], lineColor[1], lineColor[2]);
  doc.setLineWidth(0.2);
  doc.line(14, 282, 196, 282);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.text('This is a computer-generated tax invoice and requires no physical signature.', 14, 286);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 149, 106); // BillMint green
  doc.text('Powered by BillMint', 196, 286, { align: 'right' });

  return doc;
}
