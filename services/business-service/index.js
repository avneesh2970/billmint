import express from 'express';
import cors from 'cors';
import { getStore, updateStore } from '../db-store.js';

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ service: 'Business Service', status: 'UP', port: PORT });
});

app.get('/business', (req, res) => {
  res.json(getStore().business);
});

app.put('/business', (req, res) => {
  const updated = updateStore('business', { ...getStore().business, ...req.body });
  res.json(updated);
});

app.listen(PORT, () => {
  console.log(`[BUSINESS SERVICE] Listening on port ${PORT}`);
});
