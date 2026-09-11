import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { formatCurrency, formatDate, calculateInvoiceSummary } from '../../../../packages/shared-utils/index.js';

function computeDashboardMetrics(invoices = []) {
  const safeInvoices = Array.isArray(invoices) ? invoices : [];

  const totalRevenue = safeInvoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0);

  const paidCount = safeInvoices.filter(i => i.status === 'Paid').length;

  const pendingAmount = safeInvoices
    .filter(i => i.status === 'Pending' || i.status === 'Partially Paid')
    .reduce((sum, i) => sum + (Number(i.balanceDue !== undefined ? i.balanceDue : i.grandTotal) || 0), 0);

  const overdueAmount = safeInvoices
    .filter(i => i.status === 'Overdue')
    .reduce((sum, i) => sum + (Number(i.balanceDue !== undefined ? i.balanceDue : i.grandTotal) || 0), 0);

  const grandTotalBilled = safeInvoices.reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0);
  const paidPct = grandTotalBilled > 0 ? Math.round((totalRevenue / grandTotalBilled) * 100) : 0;
  const pendingPct = grandTotalBilled > 0 ? Math.round((pendingAmount / grandTotalBilled) * 100) : 0;
  const overduePct = grandTotalBilled > 0 ? Math.round((overdueAmount / grandTotalBilled) * 100) : 0;

  return {
    totalRevenue,
    paidCount,
    pendingAmount,
    overdueAmount,
    grandTotalBilled,
    paidPct,
    pendingPct,
    overduePct
  };
}

describe('Dashboard Metrics & Overview Logic Tests', () => {
  test('Should handle empty invoices array gracefully without NaN or errors', () => {
    const metrics = computeDashboardMetrics([]);
    assert.equal(metrics.totalRevenue, 0);
    assert.equal(metrics.paidCount, 0);
    assert.equal(metrics.pendingAmount, 0);
    assert.equal(metrics.overdueAmount, 0);
    assert.equal(metrics.grandTotalBilled, 0);
    assert.equal(metrics.paidPct, 0);
    assert.equal(metrics.pendingPct, 0);
    assert.equal(metrics.overduePct, 0);
  });

  test('Should correctly aggregate revenue, pending, overdue metrics and percentages', () => {
    const sampleInvoices = [
      { id: '1', grandTotal: 10000, status: 'Paid' },
      { id: '2', grandTotal: 5000, balanceDue: 5000, status: 'Pending' },
      { id: '3', grandTotal: 5000, status: 'Overdue' }
    ];

    const metrics = computeDashboardMetrics(sampleInvoices);
    assert.equal(metrics.grandTotalBilled, 20000);
    assert.equal(metrics.totalRevenue, 10000);
    assert.equal(metrics.paidCount, 1);
    assert.equal(metrics.pendingAmount, 5000);
    assert.equal(metrics.overdueAmount, 5000);
    assert.equal(metrics.paidPct, 50);
    assert.equal(metrics.pendingPct, 25);
    assert.equal(metrics.overduePct, 25);
  });

  test('Should correctly format currencies in Indian Rupee format', () => {
    assert.equal(formatCurrency(1000), '₹1,000');
    assert.equal(formatCurrency(1000, true), '₹1,000.00');
    assert.equal(formatCurrency(150000), '₹1,50,000');
    assert.equal(formatCurrency(0), '₹0');
  });

  test('Should correctly compute invoice line item summary totals', () => {
    const items = [
      { quantity: 2, rate: 1000, taxRate: 18 },
      { quantity: 1, rate: 5000, taxRate: 18 }
    ];
    const summary = calculateInvoiceSummary(items);
    assert.equal(summary.subtotal, 7000);
    assert.equal(summary.totalTax, 1260);
    assert.equal(summary.grandTotal, 8260);
  });
});
