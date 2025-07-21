import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      <div className="w-full max-w-xl bg-gray-800 p-8 rounded-lg shadow-lg text-center space-y-6 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold">Mental Health Companion</h1>
        <p className="text-lg text-gray-300">
          Track your mood, get AI-driven suggestions, and build healthy habits.
        </p>
        <div className="flex justify-center gap-6">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
