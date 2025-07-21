// server/routes/journal.js

import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get('/prompt', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = "Give a unique, simple daily mental health journaling prompt that encourages self-reflection.";

    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    res.json({ prompt: text.trim() });
  } catch (err) {
    console.error('❌ Gemini Journal Prompt Error:', err);
    res.status(500).json({ error: 'Failed to generate journal prompt.' });
  }
});

export default router;
