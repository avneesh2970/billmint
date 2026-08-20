import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'billmint_super_secret_jwt_key_2026';

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ service: 'Auth Service', status: 'UP', port: PORT });
});

app.post('/register', (req, res) => {
  const { fullName, email, password } = req.body;
  const user = { id: `usr_${Date.now()}`, fullName, email, role: 'USER' };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user, message: 'Auth registration successful' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@billmint.com') {
    const adminUser = { id: 'admin_001', fullName: 'BillMint Admin', email, role: 'SUPER_ADMIN' };
    const token = jwt.sign(adminUser, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: adminUser });
  }
  const user = { id: 'usr_demo_1', fullName: 'Nova Creative Owner', email, role: 'USER' };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

app.listen(PORT, () => {
  console.log(`[AUTH SERVICE] Listening on port ${PORT}`);
});
