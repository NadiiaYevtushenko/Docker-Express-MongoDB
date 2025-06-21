import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-123';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017/mydb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.set('views', path.join(__dirname, 'src'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('layout', {
    theme: req.cookies.theme || 'light',
    year: new Date().getFullYear(),
    user: req.user
  });
});

app.post("/set-theme", (req, res) => {
  const { theme } = req.body;
  if (!['light', 'dark'].includes(theme)) {
    return res.status(400).json({ error: 'Invalid theme value' });
  }
  res.cookie("theme", theme, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'Lax',
    secure: false
  });
  res.json({ success: true });
});

const createAuthToken = (user) => jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });

app.post('/register', async (req, res) => {
  try {
    const { email } = req.body;
    const user = { id: Date.now(), email };
    const token = createAuthToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: 'Lax',
      secure: false
    });
    res.json({ success: true, user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    const user = { id: 123, email };
    const token = createAuthToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: 'Lax',
      secure: false
    });
    res.json({ success: true, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
}

app.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
