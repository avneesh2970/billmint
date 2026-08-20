import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate, checkIsInterState, getStateCodeFromState } from '../../../../packages/shared-utils/index.js';

export function generateInvoicePDF(invoice, business, customer, template = 'Modern') {
  const doc = new jsPDF();
  const primaryColor = template === 'Classic' ? [15, 23, 42] : template === 'Minimal' ? [51, 65, 85] : [16, 185, 129];

  const bizState = business?.state || 'Karnataka';
  const bizCode = business?.stateCode || getStateCodeFromState(bizState) || '29';

  const custState = customer?.state || invoice?.customerState || 'Karnataka';
  const custCode = customer?.stateCode || invoice?.customerStateCode || getStateCodeFromState(custState) || '29';

  const isInter = checkIsInterState(bizState, custState, bizCode, custCode);

  // Header Box
  if (template === 'Modern') {
    doc.setFillColor(236, 253, 245);
    doc.rect(0, 0, 210, 45, 'F');
  }

  // Brand Name
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(business?.name || 'Nova Creative Studio', 14, 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`${business?.address || 'Suite 402, Mint Heights'}, ${business?.city || 'Bengaluru'}, ${bizState} (State Code: ${bizCode})`, 14, 26);
  doc.text(`Phone: ${business?.phone || '+91 98765 43210'} | Email: ${business?.email || 'billing@novacreative.in'}`, 14, 31);
  doc.text(`GSTIN: ${business?.gstin || '29ABCDE1234F1ZH'} | PAN: ${business?.pan || 'ABCDE1234F'}`, 14, 36);

  // Invoice Meta
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('TAX INVOICE', 196, 20, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Invoice #: ${invoice.invoiceNumber || 'INV-2026-001'}`, 196, 27, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Issue Date: ${formatDate(invoice.issueDate)}`, 196, 33, { align: 'right' });
  doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 196, 38, { align: 'right' });

  // Bill To Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 52, 182, 32, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('BILLED TO:', 20, 60);

  doc.setFontSize(11);
  doc.text(customer?.company || invoice.customerName || 'ABC Enterprises Pvt. Ltd.', 20, 67);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  const custFullAddr = customer?.address || invoice?.customerAddress || `${custState} [State Code: ${custCode}]`;
  doc.text(`Address: ${custFullAddr}`, 20, 73);
  doc.text(`GSTIN: ${customer?.gstin || invoice.customerGstin || '07AAACA1234B1ZB'} | State Code: ${custCode}`, 20, 79);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(invoice.status === 'Paid' ? 16 : 225, invoice.status === 'Paid' ? 185 : 29, invoice.status === 'Paid' ? 129 : 72);
  doc.text(`STATUS: ${invoice.status?.toUpperCase() || 'PAID'}`, 190, 60, { align: 'right' });

  // Table Data with HSN/SAC column
  const tableData = (invoice.items || []).map(item => [
    item.description || 'Service',
    item.hsnSac || '998314',
    item.quantity || 1,
    formatCurrency(item.rate || 0),
    `${item.taxRate || 18}%`,
    formatCurrency(item.amount || (item.quantity * item.rate))
  ]);

  autoTable(doc, {
    startY: 90,
    head: [['Item & Description', 'HSN/SAC', 'Qty', 'Rate', 'GST', 'Amount']],
    body: tableData,
    headStyles: {
      fillColor: primaryColor,
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 4
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' }
    }
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  // Totals Section
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  doc.text(`Subtotal:`, 140, finalY);
  doc.text(formatCurrency(invoice.subtotal || 114000), 196, finalY, { align: 'right' });

  if (isInter) {
    doc.text(`IGST (18%):`, 140, finalY + 6);
    doc.text(formatCurrency(invoice.igst || invoice.totalTax || 20520), 196, finalY + 6, { align: 'right' });
  } else {
    doc.text(`CGST (9%):`, 140, finalY + 6);
    doc.text(formatCurrency(invoice.cgst || (invoice.totalTax / 2) || 10260), 196, finalY + 6, { align: 'right' });

    doc.text(`SGST (9%):`, 140, finalY + 12);
    doc.text(formatCurrency(invoice.sgst || (invoice.totalTax / 2) || 10260), 196, finalY + 12, { align: 'right' });
  }

  const offset = isInter ? 14 : 20;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Grand Total:`, 140, finalY + offset);
  doc.text(formatCurrency(invoice.grandTotal || 134520), 196, finalY + offset, { align: 'right' });

  // Bank Info
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Bank Payment Details:', 14, finalY);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Bank Name: ${business?.bankDetails?.bankName || 'HDFC Bank'}`, 14, finalY + 5);
  doc.text(`Account No: ${business?.bankDetails?.accountNumber || '50200012345678'}`, 14, finalY + 10);
  doc.text(`IFSC: ${business?.bankDetails?.ifsc || 'HDFC0001234'} | UPI: ${business?.bankDetails?.upiId || 'novacreative@hdfcbank'}`, 14, finalY + 15);

  // Footer Note
  doc.setFontSize(8);
  doc.text('Thank you for your business! Generated via BillMint SaaS Platform.', 105, 285, { align: 'center' });

  return doc;
}
