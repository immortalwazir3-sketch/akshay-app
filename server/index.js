import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─── MongoDB ──────────────────────────────────────────────────────────────────
// Cache the connection promise across serverless invocations to avoid cold-start
// reconnects on every request. Vercel reuses the module between warm invocations.
let _dbPromise = null;
function connectDB() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = mongoose
    .connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    })
    .then((m) => { console.log('Connected to MongoDB'); return m; })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      _dbPromise = null; // allow retry on next request
      throw err;
    });
  return _dbPromise;
}

// ─── User model ───────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String },
  googleId:  { type: String },
  name:      { type: String, default: '' },
  picture:   { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.options('*', cors());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function makeToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name, picture: user.picture },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

function safeUser(user) {
  return { id: user._id, email: user.email, name: user.name, picture: user.picture };
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// Register
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });
  if (!/\S+@\S+\.\S+/.test(email))
    return res.status(400).json({ error: 'Please enter a valid email address' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });

  try {
    await connectDB();
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hash });
    res.status(201).json({ token: makeToken(user), user: safeUser(user) });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ error: 'An account with this email already exists' });
    console.error('register error:', err);
    res.status(500).json({ error: 'Server error — please try again' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  try {
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password)
      return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    res.json({ token: makeToken(user), user: safeUser(user) });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ error: 'Server error — please try again' });
  }
});

// Google Sign-In — ID token flow
app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential)
    return res.status(400).json({ error: 'Google credential is required' });
  if (!process.env.GOOGLE_CLIENT_ID)
    return res.status(500).json({ error: 'Google Sign-In is not configured on this server' });

  try {
    await connectDB();

    // Race verifyIdToken against a 7-second timeout so a stalled Google handshake
    // doesn't hold the serverless function open until Vercel's hard limit.
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Google verification timed out')), 7000)
    );
    const ticket = await Promise.race([
      googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID }),
      timeout,
    ]);
    const { sub: googleId, email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.name = user.name || name;
        user.picture = user.picture || picture;
        await user.save();
      }
    } else {
      user = await User.create({ email, googleId, name: name || '', picture: picture || '' });
    }
    res.json({ token: makeToken(user), user: safeUser(user) });
  } catch (err) {
    console.error('google sign-in error:', err.message);
    res.status(401).json({ error: 'Google sign-in failed — please try again' });
  }
});

// Google Sign-In — access_token / userinfo flow
app.post('/api/auth/google-token', async (req, res) => {
  const { sub: googleId, email, name, picture } = req.body;
  if (!googleId || !email)
    return res.status(400).json({ error: 'Invalid Google profile data' });

  try {
    await connectDB();
    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.name = user.name || name || '';
        user.picture = user.picture || picture || '';
        await user.save();
      }
    } else {
      user = await User.create({ email, googleId, name: name || '', picture: picture || '' });
    }
    res.json({ token: makeToken(user), user: safeUser(user) });
  } catch (err) {
    if (err.code === 11000) {
      try {
        const existing = await User.findOne({ email });
        if (existing) {
          existing.googleId = googleId;
          existing.picture = existing.picture || picture || '';
          await existing.save();
          return res.json({ token: makeToken(existing), user: safeUser(existing) });
        }
      } catch (innerErr) {
        console.error('google-token dedup error:', innerErr);
      }
    }
    console.error('google-token error:', err);
    res.status(500).json({ error: 'Server error — please try again' });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: safeUser(user) });
  } catch (err) {
    console.error('me error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile name
app.patch('/api/auth/profile', authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (typeof name !== 'string' || name.trim().length > 50)
    return res.status(400).json({ error: 'Invalid name' });

  try {
    await connectDB();
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name: name.trim() },
      { new: true }
    ).select('-password');
    res.json({ token: makeToken(user), user: safeUser(user) });
  } catch (err) {
    console.error('profile update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
// Vercel runs this file as a module import — skip listen() in that environment.
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Victory Journal server running on http://localhost:${PORT}`);
  });
}

export default app;
