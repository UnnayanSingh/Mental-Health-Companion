import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { GoogleGenerativeAI } from '@google/generative-ai';

import User from './models/User.js';
import Mood from './models/Mood.js';

import authRoutes from './routes/auth.js';
import moodRoutes from './routes/mood.js';
import suggestionsRoutes from './routes/suggestions.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// JWT Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Auth: Register
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Auth: Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Mood Logging
app.post('/api/mood', authenticate, async (req, res) => {
  const { mood, note } = req.body;
  try {
    const moodEntry = new Mood({
      userId: req.user.userId,
      mood,
      note,
      createdAt: new Date(),
    });
    await moodEntry.save();
    res.status(201).json(moodEntry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to log mood' });
  }
});

// Mood History
app.get('/api/moods', authenticate, async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch moods' });
  }
});

// ✅ Gemini Setup (non-pro)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ AI Suggestions using Gemini
app.post('/api/suggestions', authenticate, async (req, res) => {
  const { mood, note } = req.body;

  try {
    const model = genAI.getGenerativeModel({
      model: 'models/gemini-1.5-flash',
    });

    const prompt = `You are a mental health assistant. Based on the mood '${mood}' and note: "${note}", suggest 3 short and helpful self-care activities.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    console.log('🌟 Gemini response:', text); // optional debug

    const suggestions = text
      .split('\n')
      .map((line) => line.replace(/^[-*\d.]+\s*/, '').trim())
      .filter(Boolean);

    res.json({ suggestions });
  } catch (err) {
    console.error('❌ Gemini Suggestion Error:', err);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
