import React, { useEffect, useState } from 'react';
import { fetchMoods, submitMood, fetchSuggestions } from '../api';
import MoodChart from '../components/MoodChart';
import LevelBadge from '../components/LevelBadge';
import MoodSummaryCard from '../components/MoodSummaryCard';
import ProfileMenu from '../components/ProfileMenu';

function Dashboard() {
  const [moods, setMoods] = useState([]);
  const [error, setError] = useState('');
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    loadMoods();
  }, []);

  const loadMoods = async () => {
    try {
      const res = await fetchMoods();
      const sorted = res.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((m) => ({
          ...m,
          dateOnly: new Date(m.createdAt).toDateString(),
        }));

      setMoods(sorted);

      const totalXp = sorted.reduce((sum, mood) => sum + (mood.xpGained || 10), 0);
      setXp(totalXp);

      const uniqueDates = [...new Set(sorted.map((m) => m.dateOnly))];
      let currentStreak = 0;
      let today = new Date();

      for (let i = 0; i < uniqueDates.length; i++) {
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);
        if (new Date(uniqueDates[i]).toDateString() === expectedDate.toDateString()) {
          currentStreak++;
        } else {
          break;
        }
      }

      setStreak(currentStreak);
    } catch (err) {
      setError('Failed to load mood history.');
    }
  };

  const level = Math.floor(xp / 100) + 1;
  const progress = xp % 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mood) return;

    try {
      await submitMood({ mood, note });
      setMood('');
      setNote('');
      loadMoods();

      const res = await fetchSuggestions(mood, note);
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      alert('Failed to log mood or fetch suggestions.');
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <ProfileMenu />
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4 space-y-3">
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
          required
        >
          <option value="">Select how you feel</option>
          <option value="Happy">😊 Happy</option>
          <option value="Sad">😢 Sad</option>
          <option value="Stressed">😟 Stressed</option>
          <option value="Calm">😌 Calm</option>
          <option value="Anxious">😬 Anxious</option>
        </select>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note..."
          className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Mood
        </button>
      </form>

      {suggestions.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded shadow mb-4">
          <h3 className="text-lg font-semibold mb-2">💡 Self-care Suggestions</h3>
          <ul className="list-disc list-inside space-y-1">
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4">
        <p>🔥 Streak: {streak} day{streak !== 1 ? 's' : ''}</p>
        <p>💎 XP: {xp} | 🧠 Level: {level}</p>
        <div className="w-full bg-gray-300 dark:bg-gray-700 h-3 rounded mt-1">
          <div
            className="h-3 bg-green-500 rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <LevelBadge level={level} />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <MoodChart moods={moods} />

      <div className="mb-4 mt-4">
        <h2 className="text-lg font-semibold mb-1">📘 Daily Average Mood Summary</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">(This is calculated based on the average mood score per day)</p>
        <MoodSummaryCard moods={moods} />
      </div>

      <h2 className="text-xl mt-6 mb-2">Your Mood History</h2>
      <ul className="space-y-2">
        {moods.map((m, index) => (
          <li key={index} className="bg-white dark:bg-gray-800 p-3 shadow rounded">
            <strong>{new Date(m.createdAt).toLocaleDateString()}</strong> - {m.mood}
            <p className="text-sm text-gray-700 dark:text-gray-300">{m.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
