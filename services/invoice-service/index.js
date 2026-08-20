import express from 'express';
import cors from 'cors';
import { getStore, updateStore } from '../db-store.js';

const app = express();
const PORT = process.env.PORT || 5006;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ service: 'Invoice Service', status: 'UP', port: PORT }));

app.get('/invoices', (req, res) => res.json(getStore().invoices || []));

app.post('/invoices', (req, res) => {
  const newInv = { id: `inv_${Date.now()}`, ...req.body };
  const list = [newInv, ...(getStore().invoices || [])];
  updateStore('invoices', list);
  res.status(201).json(newInv);
});

app.listen(PORT, () => console.log(`[INVOICE SERVICE] Listening on port ${PORT}`));
