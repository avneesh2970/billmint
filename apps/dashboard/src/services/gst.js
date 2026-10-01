import { apiRequest } from './api';

/**
 * Fetch and verify GSTIN details from BillMint GST API
 * Returns structured business name, legal name, PAN, address, city, state, stateCode, pincode
 */
export async function fetchGSTDetails(gstin) {
  if (!gstin) return null;
  const clean = gstin.trim().toUpperCase();
  if (clean.length !== 15) return null;

  try {
    const data = await apiRequest(`/gst/${clean}`);
    return data;
  } catch (err) {
    console.warn('GST Lookup notice:', err.message);
    throw err;
  }
}
