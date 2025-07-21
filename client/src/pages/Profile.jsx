import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = () => {
    setMessage('🔐 Feature coming soon: Password change via email verification.');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">👤 Profile Settings</h2>

      <div className="bg-white p-4 rounded shadow space-y-4">
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-medium">New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          onClick={handlePasswordChange}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Change Password
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>

        {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
      </div>
    </div>
  );
}

export default Profile;
