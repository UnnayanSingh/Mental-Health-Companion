import React from 'react';

const getBadge = (level) => {
  if (level >= 10) return '🌟 Legend';
  if (level >= 7) return '💎 Pro';
  if (level >= 4) return '🔥 Rising Star';
  return '🌱 Beginner';
};

function LevelBadge({ level }) {
  return (
    <div className="mt-2 text-sm text-gray-700">
      🏅 <strong>{getBadge(level)}</strong> (Level {level})
    </div>
  );
}

export default LevelBadge;
