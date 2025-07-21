import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend,
  CartesianGrid,
  Cell,
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00bcd4'];

const MOOD_SCORES = {
  Happy: 5,
  Calm: 4,
  Neutral: 3,
  Stressed: 2,
  Sad: 1,
  Anxious: 1,
};

function MoodChart({ moods }) {
  const [distribution, setDistribution] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [expandedDate, setExpandedDate] = useState(null);
  const [moodFrequencyData, setMoodFrequencyData] = useState([]);
  const [moodScoreTrend, setMoodScoreTrend] = useState([]);

  useEffect(() => {
    const groupedByDate = moods.reduce((acc, mood) => {
      const date = new Date(mood.createdAt).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(mood);
      return acc;
    }, {});
    setGrouped(groupedByDate);

    // Pie chart data
    const moodDist = moods.reduce((acc, m) => {
      acc[m.mood] = (acc[m.mood] || 0) + 1;
      return acc;
    }, {});
    const distData = Object.entries(moodDist).map(([mood, count]) => ({
      name: mood,
      value: count,
    }));
    setDistribution(distData);

    // Line Chart: Mood Frequency Over Time
    const freqMap = {};
    moods.forEach(({ mood, createdAt }) => {
      const date = new Date(createdAt).toLocaleDateString();
      if (!freqMap[date]) freqMap[date] = {};
      freqMap[date][mood] = (freqMap[date][mood] || 0) + 1;
    });
    const freqData = Object.entries(freqMap).map(([date, moodCounts]) => ({
      date,
      ...moodCounts,
    }));
    setMoodFrequencyData(freqData);

    // Line Chart: Mood Score Over Time
    const scoreMap = {};
    Object.entries(groupedByDate).forEach(([date, entries]) => {
      const scores = entries.map((m) => MOOD_SCORES[m.mood] || 3);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      scoreMap[date] = avgScore.toFixed(2);
    });
    const scoreData = Object.entries(scoreMap).map(([date, score]) => ({
      date,
      score: parseFloat(score),
    }));
    setMoodScoreTrend(scoreData);
  }, [moods]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 📅 Daily Mood History Chart (Expandable List) */}
      <div className="bg-white p-4 rounded shadow dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-2">📅 Daily Mood Entries</h3>
        {Object.entries(grouped).map(([date, entries]) => (
          <div key={date} className="mb-2">
            <button
              onClick={() => setExpandedDate(expandedDate === date ? null : date)}
              className="w-full text-left p-2 bg-blue-100 dark:bg-blue-700 hover:bg-blue-200 dark:hover:bg-blue-600 rounded"
            >
              {date} ({entries.length} entry{entries.length > 1 ? 'ies' : 'y'})
            </button>
            {expandedDate === date && (
              <ul className="mt-2 ml-4 list-disc">
                {entries.map((m, i) => (
                  <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>{new Date(m.createdAt).toLocaleTimeString()}</strong>: {m.mood} - {m.note}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* 📊 Mood Distribution Pie Chart */}
      <div className="bg-white p-4 rounded shadow dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-2">📊 Mood Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              dataKey="value"
              data={distribution}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {distribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 📈 Mood Frequency Over Time */}
      <div className="bg-white p-4 rounded shadow dark:bg-gray-800 col-span-1 md:col-span-2">
        <h3 className="text-lg font-semibold mb-2">📆 Mood Frequency Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={moodFrequencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            {Object.keys(MOOD_SCORES).map((mood, idx) => (
              <Line
                key={mood}
                type="monotone"
                dataKey={mood}
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 📉 Mood Score Over Time */}
      <div className="bg-white p-4 rounded shadow dark:bg-gray-800 col-span-1 md:col-span-2">
        <h3 className="text-lg font-semibold mb-2">📉 Average Mood Score Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={moodScoreTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[1, 5]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#8884d8"
              strokeWidth={3}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MoodChart;
