import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: String,
  note: String,
  xpGained: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now }
});

const Mood = mongoose.model('Mood', moodSchema);
export default Mood;
