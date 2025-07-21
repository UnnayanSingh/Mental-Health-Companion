import React from 'react';

function MoodSummaryCard({ moods }) {
  // Group moods by date
  const dailySummary = {};

  moods.forEach((mood) => {
    const date = new Date(mood.createdAt).toLocaleDateString();
    const moodLabel = mood.mood?.toLowerCase() || 'unknown';

    if (!dailySummary[date]) dailySummary[date] = {};
    if (!dailySummary[date][moodLabel]) dailySummary[date][moodLabel] = 0;

    dailySummary[date][moodLabel]++;
  });

  // Create a readable array
  const summary = Object.entries(dailySummary).map(([date, moodCounts]) => {
    const mostFrequentMood = Object.entries(moodCounts).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    return { date, mood: mostFrequentMood };
  });

  // Emoji map
  const moodEmoji = {
    happy: '😊',
    sad: '😢',
    stressed: '😟',
    calm: '😌',
    anxious: '😬',
    angry: '😡',
    unknown: '❓'
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-semibold mb-2">📊 Daily Mood Summary <span className="text-sm text-gray-500">(Average Mood)</span></h3>
      <ul className="space-y-1">
        {summary.map((item, index) => (
          <li key={index} className="flex justify-between">
            <span>{item.date}</span>
            <span>
              {moodEmoji[item.mood] || '❓'} {item.mood}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoodSummaryCard;
