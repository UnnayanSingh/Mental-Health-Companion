// client/src/components/ProfileMenu.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileMenu() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={toggleTheme}
        className="bg-gray-200 dark:bg-gray-700 text-sm px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>

      <button
        onClick={goToProfile}
        className="bg-purple-500 text-white text-sm px-3 py-1 rounded hover:bg-purple-600"
      >
        Profile
      </button>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

export default ProfileMenu;
