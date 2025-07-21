import express from 'express';
import Mood from '../models/Mood.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// POST /api/mood
router.post('/mood', authMiddleware, async (req, res) => {
  const { mood, note } = req.body;

  try {
    const newMood = new Mood({
      userId: req.user.userId,
      mood,
      note
    });
    await newMood.save();
    res.status(201).json({ message: 'Mood saved successfully', mood: newMood });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save mood' });
  }
});

// GET /api/moods
router.get('/moods', authMiddleware, async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch mood history' });
  }
});

export default router;
