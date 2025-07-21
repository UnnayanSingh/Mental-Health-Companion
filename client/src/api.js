import axios from 'axios';

// Base API URL from environment variable
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// ✅ Login
export const loginUser = (email, password) =>
  axios.post(`${API_BASE}/api/login`, { email, password });

// ✅ Register
export const registerUser = (email, password) =>
  axios.post(`${API_BASE}/api/register`, { email, password });

// ✅ Submit mood (used in CheckIn.jsx)
export const submitMood = ({ mood, note }) =>
  axios.post(
    `${API_BASE}/api/mood`,
    { mood, note },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

// ✅ Fetch mood history
export const fetchMoods = () =>
  axios.get(`${API_BASE}/api/moods`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

// ✅ AI-powered suggestions (Gemini)
export const fetchSuggestions = (mood, note) =>
  axios.post(
    `${API_BASE}/api/suggestions`,
    { mood, note },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
