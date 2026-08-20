// API Client Service for BillMint Dashboard

const API_BASE = 'http://localhost:5000/api';

function getAuthHeader() {
  const token = localStorage.getItem('billmint_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function apiRequest(endpoint, method = 'GET', data = null) {
  try {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    };
    if (data) config.body = JSON.stringify(data);

    const res = await fetch(`${API_BASE}${endpoint}`, config);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'API Request Failed' }));
      throw new Error(err.message || `Error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API Call Failed: ${endpoint}]`, err.message);
    throw err;
  }
}
