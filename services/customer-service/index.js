import express from 'express';
import cors from 'cors';
import { getStore, updateStore } from '../db-store.js';

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ service: 'Customer Service', status: 'UP', port: PORT }));

app.get('/customers', (req, res) => res.json(getStore().customers || []));

app.post('/customers', (req, res) => {
  const newCust = { id: `cust_${Date.now()}`, ...req.body };
  const list = [newCust, ...(getStore().customers || [])];
  updateStore('customers', list);
  res.status(201).json(newCust);
});

app.listen(PORT, () => console.log(`[CUSTOMER SERVICE] Listening on port ${PORT}`));
