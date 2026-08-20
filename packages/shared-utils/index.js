// BillMint Shared Utilities

/**
 * Registry of Indian States and Union Territories with official 2-digit GST State Codes
 */
export const INDIAN_STATES = [
  { code: '01', state: 'Jammu & Kashmir' },
  { code: '02', state: 'Himachal Pradesh' },
  { code: '03', state: 'Punjab' },
  { code: '04', state: 'Chandigarh' },
  { code: '05', state: 'Uttarakhand' },
  { code: '06', state: 'Haryana' },
  { code: '07', state: 'Delhi' },
  { code: '08', state: 'Rajasthan' },
  { code: '09', state: 'Uttar Pradesh' },
  { code: '10', state: 'Bihar' },
  { code: '11', state: 'Sikkim' },
  { code: '12', state: 'Arunachal Pradesh' },
  { code: '13', state: 'Nagaland' },
  { code: '14', state: 'Manipur' },
  { code: '15', state: 'Mizoram' },
  { code: '16', state: 'Tripura' },
  { code: '17', state: 'Meghalaya' },
  { code: '18', state: 'Assam' },
  { code: '19', state: 'West Bengal' },
  { code: '20', state: 'Jharkhand' },
  { code: '21', state: 'Odisha' },
  { code: '22', state: 'Chhattisgarh' },
  { code: '23', state: 'Madhya Pradesh' },
  { code: '24', state: 'Gujarat' },
  { code: '26', state: 'Dadra & Nagar Haveli and Daman & Diu' },
  { code: '27', state: 'Maharashtra' },
  { code: '29', state: 'Karnataka' },
  { code: '30', state: 'Goa' },
  { code: '31', state: 'Lakshadweep' },
  { code: '32', state: 'Kerala' },
  { code: '33', state: 'Tamil Nadu' },
  { code: '34', state: 'Puducherry' },
  { code: '35', state: 'Andaman & Nicobar Islands' },
  { code: '36', state: 'Telangana' },
  { code: '37', state: 'Andhra Pradesh' },
  { code: '38', state: 'Ladakh' }
];

/**
 * Get 2-digit GST State Code from State Name
 */
export function getStateCodeFromState(stateName = '') {
  if (!stateName) return '';
  const match = INDIAN_STATES.find(s => s.state.toLowerCase() === stateName.trim().toLowerCase());
  return match ? match.code : '';
}

/**
 * Get State Name from 2-digit GST State Code
 */
export function getStateFromStateCode(code = '') {
  if (!code) return '';
  const cleanCode = code.toString().padStart(2, '0');
  const match = INDIAN_STATES.find(s => s.code === cleanCode);
  return match ? match.state : '';
}

/**
 * Parse GSTIN to extract State Code and State Name automatically
 */
export function parseGSTIN(gstin = '') {
  if (!gstin || gstin.length < 2) return { stateCode: '', state: '' };
  const stateCode = gstin.substring(0, 2);
  const state = getStateFromStateCode(stateCode);
  return { stateCode, state };
}

/**
 * Check if transaction is Inter-State (IGST) or Intra-State (CGST + SGST)
 * Returns true if states or state codes are DIFFERENT (IGST applied)
 * Returns false if states or state codes are SAME (CGST + SGST applied)
 */
export function checkIsInterState(bizState = '', custState = '', bizCode = '', custCode = '') {
  const normBizCode = (bizCode || getStateCodeFromState(bizState)).trim();
  const normCustCode = (custCode || getStateCodeFromState(custState)).trim();

  // If state codes are present, compare state codes
  if (normBizCode && normCustCode) {
    return normBizCode !== normCustCode;
  }

  // Otherwise fallback to normalized state name comparison
  const normBizState = bizState.trim().toLowerCase();
  const normCustState = custState.trim().toLowerCase();

  if (!normBizState || !normCustState) return false; // Default to same state if missing
  return normBizState !== normCustState;
}

/**
 * Format currency in Indian standard format (e.g. ₹1,24,500.00)
 */
export function formatCurrency(amount, includeDecimals = false) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: includeDecimals ? 2 : 0,
    minimumFractionDigits: includeDecimals ? 2 : 0
  }).format(num);
}

/**
 * Calculate line item total and tax
 */
export function calculateLineItem(rate, quantity = 1, discountPercent = 0, taxRate = 0) {
  const basePrice = Number(rate) * Number(quantity);
  const discountAmount = (basePrice * Number(discountPercent)) / 100;
  const taxableAmount = basePrice - discountAmount;
  const taxAmount = (taxableAmount * Number(taxRate)) / 100;
  const totalAmount = taxableAmount + taxAmount;

  return {
    basePrice,
    discountAmount,
    taxableAmount,
    taxAmount,
    totalAmount
  };
}

/**
 * Calculate total invoice summary given line items
 * If state is SAME -> CGST + SGST
 * If state is DIFFERENT -> IGST
 */
export function calculateInvoiceSummary(items = [], shippingFee = 0, isInterStateOrOptions = false) {
  let isInterState = false;

  if (typeof isInterStateOrOptions === 'boolean') {
    isInterState = isInterStateOrOptions;
  } else if (typeof isInterStateOrOptions === 'object' && isInterStateOrOptions !== null) {
    const { bizState, custState, bizCode, custCode } = isInterStateOrOptions;
    isInterState = checkIsInterState(bizState, custState, bizCode, custCode);
  }

  let subtotal = 0;
  let totalDiscount = 0;
  let totalTax = 0;

  items.forEach(item => {
    const qty = Number(item.quantity) || 1;
    const rate = Number(item.rate) || 0;
    const disc = Number(item.discountPercent) || 0;
    const tax = Number(item.taxRate) || 0;

    const base = qty * rate;
    const discAmt = (base * disc) / 100;
    const taxable = base - discAmt;
    const taxAmt = (taxable * tax) / 100;

    subtotal += base;
    totalDiscount += discAmt;
    totalTax += taxAmt;
  });

  const taxableAmount = subtotal - totalDiscount;
  const shipping = Number(shippingFee) || 0;
  const rawTotal = taxableAmount + totalTax + shipping;

  const grandTotal = Math.round(rawTotal);
  const roundOff = Number((grandTotal - rawTotal).toFixed(2));

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (isInterState) {
    igst = totalTax;
    cgst = 0;
    sgst = 0;
  } else {
    cgst = totalTax / 2;
    sgst = totalTax / 2;
    igst = 0;
  }

  return {
    subtotal,
    totalDiscount,
    taxableAmount,
    totalTax,
    cgst,
    sgst,
    igst,
    isInterState,
    shipping,
    roundOff,
    grandTotal
  };
}

/**
 * Format YYYY-MM-DD date into human friendly string (e.g. 15 Aug 2026)
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

