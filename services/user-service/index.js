import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ service: 'User Service', status: 'UP', port: PORT });
});

app.get('/users/me', (req, res) => {
  res.json({ id: 'usr_demo_1', fullName: 'Nova Creative Owner', email: 'demo@billmint.com', role: 'USER' });
});

app.listen(PORT, () => {
  console.log(`[USER SERVICE] Listening on port ${PORT}`);
});
