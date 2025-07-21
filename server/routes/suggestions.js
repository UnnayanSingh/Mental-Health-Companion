import express from 'express';
import authMiddleware from '../middleware/auth.js';
// import { GoogleGenerativeAI } from '@google/generative-ai'; // Use if needed

const router = express.Router();

// POST /api/suggestions
router.post('/suggestions', authMiddleware, async (req, res) => {
  const { mood, note } = req.body;

  try {
    const suggestions = generateSuggestions(mood, note);
    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

// Basic suggestion logic
function generateSuggestions(mood) {
  const suggestions = {
    happy: ["Share your happiness with a friend", "Dance to your favorite song", "Write what made you smile"],
    sad: ["Talk to someone you trust", "Write your thoughts down", "Watch a comforting movie"],
    anxious: ["Breathe deeply for 2 minutes", "Stretch your body", "Try grounding techniques"],
    angry: ["Go for a walk", "Write a vent journal", "Do 20 jumping jacks"],
    calm: ["Practice mindfulness", "Read a book", "Enjoy some tea"],
    neutral: ["Plan something fun", "Try a hobby", "Reflect on your goals"]
  };

  return suggestions[mood] || ["Take a deep breath", "Go outside for fresh air", "Write what you're feeling"];
}

export default router;
