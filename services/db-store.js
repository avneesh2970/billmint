// BillMint Database Store Engine with MongoDB / File-Store Fallback
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_DEMO_DATA } from '../packages/shared-types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data_store.json');

// Initialize data store
let store = { ...INITIAL_DEMO_DATA };

// Load persistent data if available
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    store = { ...INITIAL_DEMO_DATA, ...JSON.parse(raw) };
  } else {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
  }
} catch (e) {
  console.warn('Using in-memory DB store fallback:', e.message);
}

function saveStore() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
  } catch (e) {
    console.error('Failed to save store:', e);
  }
}

export const getStore = () => store;

export const updateStore = (key, data) => {
  store[key] = data;
  saveStore();
  return store[key];
};

export const resetStoreToDemo = () => {
  store = JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
  saveStore();
  return store;
};
