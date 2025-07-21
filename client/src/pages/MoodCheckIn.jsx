import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkInMood, fetchSuggestions } from '../api';

function MoodCheckIn() {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in first');
      return;
    }

    try {
      await checkInMood(token, mood, note);
      const res = await fetchSuggestions(mood, note);
      setSuggestions(res.data.suggestions);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100 px-4">
      <h2 className="text-2xl mb-4">Mood Check-In</h2>
      <select
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Select your mood</option>
        <option value="happy">😊 Happy</option>
        <option value="sad">😢 Sad</option>
        <option value="anxious">😰 Anxious</option>
        <option value="angry">😡 Angry</option>
        <option value="calm">😌 Calm</option>
        <option value="neutral">😐 Neutral</option>
      </select>

      <textarea
        placeholder="Add a note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="border p-2 rounded mt-4 w-64 h-24"
      />

      <button
        onClick={handleSubmit}
        className="mt-4 bg-purple-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {suggestions.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded shadow w-80">
          <h3 className="text-lg font-semibold mb-2">🧘‍♀️ Suggested Self-Care:</h3>
          <ul className="list-disc list-inside space-y-1">
            {suggestions.map((item, idx) => (
              <li key={idx}>{item.replace(/^\d+\.\s*/, '')}</li>
            ))}
          </ul>
          <button
            className="mt-4 text-blue-500 underline"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

export default MoodCheckIn;
